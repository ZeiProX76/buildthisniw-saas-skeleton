import { inngest } from "../client";

/**
 * Sample function — verifies Inngest is wired up correctly.
 * Trigger manually from the Inngest dev dashboard or via:
 *   await inngest.send({ name: "test/hello.world", data: { message: "hi" } })
 */
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const greeting = await step.run("greet", async () => {
      return `Hello, ${event.data.message ?? "world"}!`;
    });

    return { greeting };
  },
);
