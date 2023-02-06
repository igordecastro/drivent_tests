import { Router } from "express";
import { getHotels, getHotelById, createHotel } from "@/controllers";
import { authenticateToken } from "@/middlewares";

const hotelsRouter = Router();

hotelsRouter
  // .all("/*", authenticateToken)
  .post("/", createHotel)
  .get("/", getHotels)
  .get("/:id", getHotelById);

export { hotelsRouter };
