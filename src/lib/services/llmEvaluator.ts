/**
 * LLM Evaluator — Stub Module
 *
 * This defines the contract for AI-powered evaluation of free-response
 * answers. The interface is the important part: when Phase 6 implements
 * the actual LLM integration (Anthropic API), only the internals of
 * the evaluate() function change. Everything upstream and downstream
 * stays the same.
 *
 * The submit route already checks step.metadata.llmEnabled and will
 * call this module when it's true. Currently it logs a warning and
 * falls back to static feedback instead.
 */

export interface LlmConfig {
  llmEnabled: boolean;
  evaluationPrompt?: string;
  rubricCriteria?: string[];
  feedbackTone?: "encouraging" | "direct" | "socratic";
  maxTokens?: number;
}

export interface EvaluationRequest {
  stepContent: Record<string, unknown>;
  userResponse: unknown;
  llmConfig: LlmConfig;
}

export interface EvaluationResult {
  /** 0.0 to 1.0 */
  score: number;
  /** Natural language feedback */
  feedback: string;
  /** What the learner got right */
  strengths: string[];
  /** What they missed */
  gaps: string[];
  /** What to try next */
  suggestion?: string;
}

/**
 * Evaluate a user's free response using an LLM.
 *
 * NOT YET IMPLEMENTED. This stub throws an error if called directly.
 * The submit route handles this gracefully by checking llmEnabled
 * before reaching this function.
 *
 * Phase 6 will:
 * 1. Replace this implementation with an Anthropic API call
 * 2. Use the evaluationPrompt and rubricCriteria from LlmConfig
 * 3. Parse the LLM response into the EvaluationResult shape
 * 4. Add usage metering per user for billing
 */
export async function evaluate(
  _request: EvaluationRequest
): Promise<EvaluationResult> {
  throw new Error(
    "LLM evaluation is not yet enabled. " +
      "This feature will be available in a future release. " +
      "See deployment-pipeline.md Phase 6."
  );
}
