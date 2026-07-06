import { describe, expect, it } from "bun:test";
import type { SelectQuery } from "../query/ast";
import { parseQuery } from "../query/parser";

function selectQuery(input: string): SelectQuery {
	const q = parseQuery(input);
	if (q.kind !== "select") throw new Error("expected select query");
	return q;
}

describe("parseQuery", () => {
	describe("from clause", () => {
		it("parses minimal from", () => {
			const q = selectQuery("from article");
			expect(q.from).toBe("article");
			expect(q.select).toBeUndefined();
			expect(q.where).toBeUndefined();
			expect(q.orderBy).toBeUndefined();
			expect(q.limit).toBeUndefined();
			expect(q.offset).toBeUndefined();
		});

		it("is case-insensitive for keywords", () => {
			expect(selectQuery("FROM article").from).toBe("article");
		});

		it("throws when from is missing", () => {
			expect(() => parseQuery("select id")).toThrow();
		});
	});

	describe("select clause", () => {
		it("parses single field select", () => {
			const q = selectQuery("from article select title");
			expect(q.select).toEqual(["title"]);
		});

		it("parses multi-field select", () => {
			const q = selectQuery("from article select id, title, published");
			expect(q.select).toEqual(["id", "title", "published"]);
		});
	});

	describe("where clause", () => {
		it("parses == with string value", () => {
			const q = selectQuery('from article where status == "published"');
			expect(q.where?.type).toBe("condition");
			if (q.where?.type === "condition") {
				expect(q.where.condition).toEqual({
					field: "status",
					op: "==",
					value: "published",
				});
			}
		});

		it("parses != operator", () => {
			const q = selectQuery('from article where status != "draft"');
			if (q.where?.type === "condition") {
				expect(q.where.condition.op).toBe("!=");
			}
		});

		it("parses > and < with numbers", () => {
			const q = selectQuery("from product where price > 100");
			if (q.where?.type === "condition") {
				expect(q.where.condition).toEqual({
					field: "price",
					op: ">",
					value: 100,
				});
			}
		});

		it("parses contains operator", () => {
			const q = selectQuery('from article where title contains "Aurii"');
			if (q.where?.type === "condition") {
				expect(q.where.condition).toEqual({
					field: "title",
					op: "contains",
					value: "Aurii",
				});
			}
		});

		it("parses multiple AND conditions", () => {
			const q = selectQuery(
				'from article where published == true and status == "active"',
			);
			expect(q.where?.type).toBe("and");
			if (q.where?.type === "and") {
				expect(q.where.exprs).toHaveLength(2);
			}
		});

		it("parses OR conditions", () => {
			const q = selectQuery(
				'from municipality where countyId == "03" or countyId == "11"',
			);
			expect(q.where?.type).toBe("or");
		});

		it("parses IN operator", () => {
			const q = selectQuery(
				'from municipality where countyId in ("03", "11")',
			);
			if (q.where?.type === "condition") {
				expect(q.where.condition.op).toBe("in");
			}
		});

		it("parses NOT operator", () => {
			const q = selectQuery('from article where not status == "draft"');
			expect(q.where?.type).toBe("not");
		});

		it("parses EXISTS operator", () => {
			const q = selectQuery("from municipality where countyId exists");
			if (q.where?.type === "condition") {
				expect(q.where.condition.op).toBe("exists");
			}
		});
	});

	describe("join clause", () => {
		it("parses join on qualified fields", () => {
			const q = selectQuery(
				"from municipality join county on municipality.countyId = county.id",
			);
			expect(q.join).toBeDefined();
			expect(q.join!.schema).toBe("county");
			expect(q.join!.on.leftField).toBe("countyId");
			expect(q.join!.on.rightField).toBe("id");
		});
	});

	describe("aggregate queries", () => {
		it("parses count municipality", () => {
			const q = parseQuery("count municipality");
			expect(q.kind).toBe("aggregate");
			if (q.kind === "aggregate") {
				expect(q.fn).toBe("count");
				expect(q.from).toBe("municipality");
			}
		});

		it("parses count with where", () => {
			const q = parseQuery('count municipality where countyId == "03"');
			expect(q.kind).toBe("aggregate");
			if (q.kind === "aggregate") {
				expect(q.where).toBeDefined();
			}
		});
	});

	describe("order by clause", () => {
		it("defaults to asc when direction omitted", () => {
			const q = selectQuery("from article order by title");
			expect(q.orderBy).toEqual({ field: "title", direction: "asc" });
		});
	});

	describe("limit and offset", () => {
		it("parses limit and offset together", () => {
			const q = selectQuery("from article limit 10 offset 20");
			expect(q.limit).toBe(10);
			expect(q.offset).toBe(20);
		});
	});

	describe("error cases", () => {
		it("throws on unexpected token", () => {
			expect(() => parseQuery("from article BADTOKEN")).toThrow();
		});
	});
});
