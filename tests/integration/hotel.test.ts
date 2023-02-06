import app, { init } from "@/app";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is invalid", async () => {
    const response = await server.get("/hotels").set("Authorization", "Bearer invalid");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 404 if ticket or hotel is not found", async () => {
    const token = await generateValidToken();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should respond with status 402 if ticket was'nt paid or does not include hotel", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    console.log(response.status);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with status 402 if ticket is remote", async () => {
    const token = await generateValidToken();
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with status 200 if everything is OK", async () => {
    const token = await generateValidToken();
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    const body = 
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        Rooms: expect.arrayContaining([
          {
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: expect.any(Number),
            updatedAt: expect.any(Date),
            createdAt: expect.any(Date),
          }
        ])
      });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(body);
  });
});
