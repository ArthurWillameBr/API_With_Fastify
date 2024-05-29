import request from "supertest";
import { app } from "../app";
import { afterAll, beforeAll, test } from "vitest";

beforeAll( async () => {
    await app.ready()
})
afterAll( async () => {
    await app.close()
})

test("user can create a new transaction", async () => {
  await request(app.server).post("/transactions").send({
    title: "New transaction",
    amount: 100,
    type: "credit",
  })
  .expect(201)
});
