import type { Entity } from "../entity/types";
import { DEFAULT_DATASET, getStorage } from "../storage";
import type { QueryAST } from "./ast";
import type { ExecutionPlan, PlanExplanation } from "./plan";
import { explainPlan, planQuery } from "./planner";
import type { QueryAST as ParsedInput } from "./parser";
import { parseQuery } from "./parser";

export interface QueryResult {
	entities: Entity[];
	count: number;
	query: QueryAST;
	aggregate?: { fn: string; value: number };
	plan?: ExecutionPlan;
	explain?: PlanExplanation;
}

export async function executeQuery(
	query: string | QueryAST,
	datasetId: string = DEFAULT_DATASET,
	options?: { explain?: boolean },
): Promise<QueryResult> {
	const ast = typeof query === "string" ? parseQuery(query) : query;
	const plan = planQuery(ast);
	const storage = await getStorage();
	const result = await storage.executePlan(plan, datasetId);

	return {
		entities: result.entities,
		count: result.aggregate?.value ?? result.count,
		query: ast,
		...(result.aggregate ? { aggregate: result.aggregate } : {}),
		plan,
		...(options?.explain ? { explain: explainPlan(plan) } : {}),
	};
}

export async function explainQuery(
	query: string | QueryAST,
): Promise<PlanExplanation> {
	const ast = typeof query === "string" ? parseQuery(query) : query;
	return explainPlan(planQuery(ast));
}
