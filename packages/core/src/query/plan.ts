/**
 * Execution plans produced by the query planner.
 *
 * Storage adapters execute plans — not query strings or raw SQL from clients.
 */

import type { OrderBy, WhereExpr } from "./ast";

export interface ScanStep {
	kind: "scan";
	schemaId: string;
	alias: string;
	select?: string[];
	where?: WhereExpr;
	orderBy?: OrderBy;
	limit?: number;
	offset?: number;
}

export interface JoinStep {
	kind: "join";
	left: ScanStep;
	right: ScanStep;
	on: {
		leftAlias: string;
		leftField: string;
		rightAlias: string;
		rightField: string;
	};
	select?: string[];
	where?: WhereExpr;
	orderBy?: OrderBy;
	limit?: number;
	offset?: number;
}

export interface AggregateStep {
	kind: "aggregate";
	fn: "count";
	schemaId: string;
	field?: string;
	where?: WhereExpr;
}

export type ExecutionPlan = ScanStep | JoinStep | AggregateStep;

/** Human-readable explanation of a plan (for Studio / explain API). */
export interface PlanExplanation {
	plan: ExecutionPlan;
	steps: string[];
	estimatedSchemas: string[];
}
