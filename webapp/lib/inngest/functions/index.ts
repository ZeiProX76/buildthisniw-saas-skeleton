import { helloWorld } from "./hello";
import { processData } from "./process-data";
import { userDelete } from "./user-delete";

// Register all Inngest functions here.
// The serve() handler in the API route imports this array.
export const functions = [
  helloWorld,
  processData,
  userDelete,
];
