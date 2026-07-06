/**
 * Query Language AST types (v1).
 *
 * Parsing produces these structures; the planner converts them to ExecutionPlans.
 */

export type Operator =
	| "=="
	| "!="
	| ">"
	| "<"
	| ">="
	| "<="
	| "contains"
	| "in"
	| "exists";

export type ScalarValue = string | number | boolean | null;

export interface Condition {
	field: string;
	op: Operator;
	value?: ScalarValue | ScalarValue[];
}

export type WhereExpr =
	| { type: "condition"; condition: Condition }
	| { type: "and"; exprs: WhereExpr[] }
	| { type: "or"; exprs: WhereExpr[] }
	| { type: "not"; expr: WhereExpr };

export interface OrderBy {
	field: string;
	direction: "asc" | "desc";
}

export interface JoinClause {
	schema: string;
	alias: string;
	on: {
		leftAlias: string;
		leftField: string;
		rightAlias: string;
		rightField: string;
	};
}

/** SELECT query — single entity or join. */
export interface SelectQuery {
	kind: "select";
	from: string;
	fromAlias: string;
	join?: JoinClause;
	select?: string[];
	where?: WhereExpr;
	orderBy?: OrderBy;
	limit?: number;
	offset?: number;
}

/** Aggregate query — COUNT, etc. */
export interface AggregateQuery {
	kind: "aggregate";
	fn: "count";
	from: string;
	field?: string;
	where?: WhereExpr;
}

export type QueryAST = SelectQuery | AggregateQuery;
