import request from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";
import { afterAll, beforeAll, it, describe, expect, beforeEach } from "vitest";

describe("transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(() => {
    // para cada teste o banco é apagado e criado de novo
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new transactions", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 100,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 100,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") || [];

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 100,
      }),
    ]);
  });

  it("should be able to get a specific transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 100,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") || [];

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransactionsResponse.body.transactions).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 100,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "credit transaction",
        amount: 100,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") || [];

    await request(app.server)
    .post("/transactions")
    .set("Cookie", cookies)
    .send({
      title: "debit transaction",
      amount: 50,
      type: "debit",
    });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({
      amount: 50
    })
  });

});
