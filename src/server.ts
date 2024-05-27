import fastify from "fastify";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();

app.register(transactionsRoutes)

app
  .listen({
    port: Number(env.PORT),
  })
  .then(() => {
    console.log(`🚀 Server is running on port ${env.PORT}` );
  });