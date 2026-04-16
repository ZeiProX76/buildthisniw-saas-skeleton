import { inngest } from "../client";

/**
 * In-memory job store for tracking processing status.
 * In production this would be a database table.
 */
export const jobStore = new Map<
  string,
  { status: string; result?: string; progress: number; updatedAt: number }
>();

/**
 * Multi-step data processing function.
 * Simulates a real pipeline: validate → process → finalize.
 * Total runtime ~8-12 seconds across 3 steps.
 */
export const processData = inngest.createFunction(
  { id: "process-data" },
  { event: "jobs/process-data" },
  async ({ event, step }) => {
    const jobId = event.data.jobId as string;
    const input = event.data.input as string;

    // Step 1: Validate
    await step.run("validate", async () => {
      jobStore.set(jobId, {
        status: "validating",
        progress: 0,
        updatedAt: Date.now(),
      });
      // Simulate validation work
      await new Promise((r) => setTimeout(r, 2000));
      if (!input || input.length === 0) {
        jobStore.set(jobId, {
          status: "failed",
          result: "Empty input",
          progress: 0,
          updatedAt: Date.now(),
        });
        throw new Error("Empty input");
      }
      jobStore.set(jobId, {
        status: "validated",
        progress: 33,
        updatedAt: Date.now(),
      });
    });

    // Step 2: Process
    const processed = await step.run("process", async () => {
      jobStore.set(jobId, {
        status: "processing",
        progress: 33,
        updatedAt: Date.now(),
      });
      // Simulate heavier processing
      await new Promise((r) => setTimeout(r, 3000));
      const result = input.toUpperCase().split("").reverse().join("");
      jobStore.set(jobId, {
        status: "processed",
        progress: 66,
        updatedAt: Date.now(),
      });
      return result;
    });

    // Step 3: Finalize
    await step.run("finalize", async () => {
      jobStore.set(jobId, {
        status: "finalizing",
        progress: 66,
        updatedAt: Date.now(),
      });
      await new Promise((r) => setTimeout(r, 2000));
      jobStore.set(jobId, {
        status: "done",
        result: processed,
        progress: 100,
        updatedAt: Date.now(),
      });
    });

    return { jobId, result: processed };
  },
);
