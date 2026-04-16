import { z } from "zod";
import { protectedProcedure } from "../base";
import { inngest } from "@/lib/inngest/client";
import { jobStore } from "@/lib/inngest/functions/process-data";

/**
 * Trigger a data processing job
 */
export const triggerJob = protectedProcedure
  .route({ method: "POST", path: "/protected/jobs/trigger" })
  .input(z.object({ input: z.string().min(1).max(500) }))
  .handler(async ({ input }) => {
    const jobId = crypto.randomUUID();

    // Set initial status
    jobStore.set(jobId, {
      status: "queued",
      progress: 0,
      updatedAt: Date.now(),
    });

    // Fire the Inngest event
    await inngest.send({
      name: "jobs/process-data",
      data: { jobId, input: input.input },
    });

    return { jobId, status: "queued" };
  });

/**
 * Check job status
 */
export const getJobStatus = protectedProcedure
  .route({ method: "GET", path: "/protected/jobs/status" })
  .input(z.object({ jobId: z.string().uuid() }))
  .handler(async ({ input }) => {
    const job = jobStore.get(input.jobId);

    if (!job) {
      return { status: "not_found", progress: 0, result: null };
    }

    return {
      status: job.status,
      progress: job.progress,
      result: job.result ?? null,
    };
  });

export const jobsRouter = {
  trigger: triggerJob,
  status: getJobStatus,
};
