import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import ticketService from "@/services/tickets-service";
import { TicketStatus } from "@prisma/client";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels( req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  
  try {
    const hotels = await hotelsService.getHotels(userId);
    
    const ticket = await ticketService.getTicketByUserId(userId);
    
    if(ticket.status === TicketStatus.RESERVED || ticket.ticketTypeId === 1) {
      return res.status(httpStatus.PAYMENT_REQUIRED);
    }

    return res.send(hotels);
  } catch(error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById( req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  try {
    const hotel = await hotelsService.getHotelById(parseInt(id));
    
    return res.status(httpStatus.OK).send(hotel);
  } catch(error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createHotel( req: AuthenticatedRequest, res: Response) {
  const hotel = req.body;
  try {
    await hotelsService.createHotel(hotel);

    return res.sendStatus(httpStatus.CREATED);
  } catch(error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
