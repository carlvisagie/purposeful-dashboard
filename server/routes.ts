import { Hono } from "hono";

// Import minimal MVP routers (default exports)
import crisisManagement from "./routers/crisisManagement";
import psychologicalProfiling from "./routers/psychologicalProfiling";
import traumaCare from "./routers/traumaCare";

const app = new Hono();

// Attach MVP routers
app.route("/crisis", crisisManagement);
app.route("/psychology", psychologicalProfiling);
app.route("/trauma", traumaCare);

export default app;
