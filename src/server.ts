import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";

const app = fastify();

app.get("/", async () => {
  const transaction = await knex("transactions").insert({
    id: crypto.randomUUID(),
    title: "Transação de teste",
    amount: 1000
  }).returning("*")
  return transaction;
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on port 3333");
  });