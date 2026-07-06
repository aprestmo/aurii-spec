/**
 * Query Language v1 parser.
 *
 * Syntax:
 *   from <schema> [join <schema> on <alias>.<field> = <alias>.<field>]
 *   [select <field>[, <field>]*]
 *   [where <expr>]
 *   [order by <field> [asc | desc]]
 *   [limit <n>] [offset <n>]
 *
 *   count <schema> [where <expr>]
 *
 * Where expressions support AND, OR, NOT, IN, and EXISTS.
 */

import type {
	AggregateQuery,
	Condition,
	JoinClause,
	QueryAST,
	ScalarValue,
	SelectQuery,
	WhereExpr,
} from "./ast";

export type {
	AggregateQuery,
	Condition,
	JoinClause,
	QueryAST,
	Operator,
	OrderBy,
	ScalarValue,
	SelectQuery,
	WhereExpr,
} from "./ast";

/** @deprecated Use QueryAST (SelectQuery) instead. Kept for backward compatibility. */
export interface ParsedQuery {
	from: string;
	select?: string[];
	where?: Condition[];
	orderBy?: { field: string; direction: "asc" | "desc" };
	limit?: number;
	offset?: number;
}

// ── Tokenizer ───────────────────────────────────────────────────────────────

type TokenKind =
	| "keyword"
	| "ident"
	| "qualified"
	| "string"
	| "number"
	| "boolean"
	| "null"
	| "op"
	| "comma"
	| "lparen"
	| "rparen"
	| "eof";

interface Token {
	kind: TokenKind;
	value: ScalarValue | string;
	raw: string;
}

const KEYWORDS = new Set([
	"from",
	"select",
	"where",
	"and",
	"or",
	"not",
	"in",
	"exists",
	"order",
	"by",
	"limit",
	"offset",
	"asc",
	"desc",
	"join",
	"on",
	"count",
]);

function tokenize(input: string): Token[] {
	const tokens: Token[] = [];
	let i = 0;

	while (i < input.length) {
		if (/\s/.test(input[i]!)) {
			i++;
			continue;
		}

		const two = input.slice(i, i + 2);
		if (two === "==" || two === "!=" || two === ">=" || two === "<=") {
			tokens.push({ kind: "op", value: two, raw: two });
			i += 2;
			continue;
		}

		const ch = input[i]!;

		if (ch === "(") {
			tokens.push({ kind: "lparen", value: "(", raw: "(" });
			i++;
			continue;
		}
		if (ch === ")") {
			tokens.push({ kind: "rparen", value: ")", raw: ")" });
			i++;
			continue;
		}
		if (ch === ">" || ch === "<" || ch === "=") {
			tokens.push({ kind: "op", value: ch, raw: ch });
			i++;
			continue;
		}
		if (ch === ",") {
			tokens.push({ kind: "comma", value: ",", raw: "," });
			i++;
			continue;
		}

		if (ch === '"' || ch === "'") {
			const quote = ch;
			let str = "";
			i++;
			while (i < input.length && input[i] !== quote) {
				if (input[i] === "\\" && i + 1 < input.length) {
					i++;
					str += input[i];
				} else {
					str += input[i];
				}
				i++;
			}
			i++;
			tokens.push({ kind: "string", value: str, raw: `"${str}"` });
			continue;
		}

		if (/[0-9]/.test(ch) || (ch === "-" && /[0-9]/.test(input[i + 1] ?? ""))) {
			let num = ch === "-" ? (i++, "-") : "";
			while (i < input.length && /[0-9.]/.test(input[i]!)) num += input[i++];
			tokens.push({ kind: "number", value: parseFloat(num), raw: num });
			continue;
		}

		if (/[a-zA-Z_]/.test(ch)) {
			let word = "";
			while (i < input.length && /[a-zA-Z0-9_\-.]/.test(input[i]!))
				word += input[i++];
			const lower = word.toLowerCase();

			if (lower === "true") {
				tokens.push({ kind: "boolean", value: true, raw: word });
				continue;
			}
			if (lower === "false") {
				tokens.push({ kind: "boolean", value: false, raw: word });
				continue;
			}
			if (lower === "null") {
				tokens.push({ kind: "null", value: null, raw: word });
				continue;
			}
			if (lower === "contains") {
				tokens.push({ kind: "op", value: "contains", raw: word });
				continue;
			}
			if (KEYWORDS.has(lower)) {
				tokens.push({ kind: "keyword", value: lower, raw: word });
				continue;
			}

			tokens.push({ kind: "ident", value: word, raw: word });
			continue;
		}

		throw new Error(`Unexpected character "${ch}" at position ${i}`);
	}

	tokens.push({ kind: "eof", value: null, raw: "" });
	return tokens;
}

// ── Parser ────────────────────────────────────────────────────────────────────

class Parser {
	private tokens: Token[];
	private pos = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	private peek(): Token {
		return this.tokens[this.pos]!;
	}

	private advance(): Token {
		return this.tokens[this.pos++]!;
	}

	private expect(kind: TokenKind, value?: string): Token {
		const tok = this.peek();
		if (tok.kind !== kind) {
			throw new Error(
				`Expected ${kind}${value ? ` "${value}"` : ""} but got ${tok.kind} ("${tok.raw}")`,
			);
		}
		if (value !== undefined && tok.value !== value) {
			throw new Error(`Expected "${value}" but got "${tok.raw}"`);
		}
		return this.advance();
	}

	private match(kind: TokenKind, value?: string): boolean {
		const tok = this.peek();
		if (tok.kind !== kind) return false;
		if (value !== undefined && tok.value !== value) return false;
		return true;
	}

	parse(): QueryAST {
		if (this.match("keyword", "count")) {
			return this.parseAggregate();
		}
		return this.parseSelect();
	}

	private parseAggregate(): AggregateQuery {
		this.expect("keyword", "count");
		const from = this.expect("ident").value as string;
		const query: AggregateQuery = { kind: "aggregate", fn: "count", from };

		while (!this.match("eof")) {
			if (this.match("keyword", "where")) {
				this.advance();
				query.where = this.parseWhereExpr();
			} else {
				throw new Error(`Unexpected token "${this.peek().raw}" in aggregate query`);
			}
		}
		return query;
	}

	private parseSelect(): SelectQuery {
		this.expect("keyword", "from");
		const from = this.expect("ident").value as string;
		const query: SelectQuery = { kind: "select", from, fromAlias: from };

		if (this.match("keyword", "join")) {
			this.advance();
			const joinSchema = this.expect("ident").value as string;
			this.expect("keyword", "on");
			const left = this.parseQualifiedField();
			this.expect("op", "=");
			const right = this.parseQualifiedField();
			query.join = {
				schema: joinSchema,
				alias: joinSchema,
				on: {
					leftAlias: left.alias,
					leftField: left.field,
					rightAlias: right.alias,
					rightField: right.field,
				},
			};
		}

		while (!this.match("eof")) {
			if (this.match("keyword", "select")) {
				this.advance();
				query.select = this.parseFieldList();
			} else if (this.match("keyword", "where")) {
				this.advance();
				query.where = this.parseWhereExpr();
			} else if (this.match("keyword", "order")) {
				this.advance();
				this.expect("keyword", "by");
				const field = this.expect("ident").value as string;
				let direction: "asc" | "desc" = "asc";
				if (this.match("keyword", "asc") || this.match("keyword", "desc")) {
					direction = this.advance().value as "asc" | "desc";
				}
				query.orderBy = { field, direction };
			} else if (this.match("keyword", "limit")) {
				this.advance();
				query.limit = this.expect("number").value as number;
			} else if (this.match("keyword", "offset")) {
				this.advance();
				query.offset = this.expect("number").value as number;
			} else {
				throw new Error(`Unexpected token "${this.peek().raw}"`);
			}
		}

		return query;
	}

	private parseQualifiedField(): { alias: string; field: string } {
		const raw = this.expect("ident").value as string;
		const dot = raw.indexOf(".");
		if (dot > 0) {
			return { alias: raw.slice(0, dot), field: raw.slice(dot + 1) };
		}
		return { alias: raw, field: raw };
	}

	private parseFieldList(): string[] {
		const fields: string[] = [this.expect("ident").value as string];
		while (this.match("comma")) {
			this.advance();
			fields.push(this.expect("ident").value as string);
		}
		return fields;
	}

	private parseWhereExpr(): WhereExpr {
		return this.parseOrExpr();
	}

	private parseOrExpr(): WhereExpr {
		const exprs = [this.parseAndExpr()];
		while (this.match("keyword", "or")) {
			this.advance();
			exprs.push(this.parseAndExpr());
		}
		if (exprs.length === 1) return exprs[0]!;
		return { type: "or", exprs };
	}

	private parseAndExpr(): WhereExpr {
		const exprs = [this.parseNotExpr()];
		while (this.match("keyword", "and")) {
			this.advance();
			exprs.push(this.parseNotExpr());
		}
		if (exprs.length === 1) return exprs[0]!;
		return { type: "and", exprs };
	}

	private parseNotExpr(): WhereExpr {
		if (this.match("keyword", "not")) {
			this.advance();
			if (this.match("lparen")) {
				this.advance();
				const inner = this.parseWhereExpr();
				this.expect("rparen");
				return { type: "not", expr: inner };
			}
			return { type: "not", expr: this.parsePrimaryExpr() };
		}
		return this.parsePrimaryExpr();
	}

	private parsePrimaryExpr(): WhereExpr {
		if (this.match("lparen")) {
			this.advance();
			const expr = this.parseWhereExpr();
			this.expect("rparen");
			return expr;
		}
		return { type: "condition", condition: this.parseCondition() };
	}

	private parseCondition(): Condition {
		const field = this.expect("ident").value as string;

		if (this.match("keyword", "exists")) {
			this.advance();
			return { field, op: "exists" };
		}

		if (this.match("keyword", "in")) {
			this.advance();
			this.expect("lparen");
			const values: ScalarValue[] = [this.parseValue()];
			while (this.match("comma")) {
				this.advance();
				values.push(this.parseValue());
			}
			this.expect("rparen");
			return { field, op: "in", value: values };
		}

		const op = this.expect("op").value as Condition["op"];
		const value = this.parseValue();
		return { field, op, value };
	}

	private parseValue(): ScalarValue {
		const tok = this.peek();
		if (!["string", "number", "boolean", "null"].includes(tok.kind)) {
			throw new Error(
				`Expected a value but got ${tok.kind} ("${tok.raw}")`,
			);
		}
		return this.advance().value as ScalarValue;
	}
}

// ── Public API ───────────────────────────────────────────────────────────────

export function parseQuery(input: string): QueryAST {
	const tokens = tokenize(input.trim());
	return new Parser(tokens).parse();
}

/** Convert v1 AST to legacy ParsedQuery (single-entity, flat AND conditions only). */
export function toLegacyParsedQuery(ast: QueryAST): ParsedQuery {
	if (ast.kind === "aggregate") {
		throw new Error("Aggregate queries cannot be converted to legacy ParsedQuery");
	}
	if (ast.join) {
		throw new Error("Join queries cannot be converted to legacy ParsedQuery");
	}

	const flatWhere: Condition[] = [];
	if (ast.where) flattenWhere(ast.where, flatWhere);

	return {
		from: ast.from,
		...(ast.select ? { select: ast.select } : {}),
		...(flatWhere.length > 0 ? { where: flatWhere } : {}),
		...(ast.orderBy ? { orderBy: ast.orderBy } : {}),
		...(ast.limit !== undefined ? { limit: ast.limit } : {}),
		...(ast.offset !== undefined ? { offset: ast.offset } : {}),
	};
}

function flattenWhere(expr: WhereExpr, out: Condition[]): void {
	if (expr.type === "condition") {
		out.push(expr.condition);
	} else if (expr.type === "and") {
		for (const e of expr.exprs) flattenWhere(e, out);
	} else {
		throw new Error("Legacy ParsedQuery only supports flat AND conditions");
	}
}
