import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Hotel } from "@prisma/client";

type HotelInput = Omit<Hotel, "id" | "createdAt" | "updatedAt">;

async function getHotels(userId: number) {
  const hotels = await hotelsRepository.getHotels();
  if(!hotels) {
    throw notFoundError();
  }
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }
  return hotels;
}

async function getHotelById(id: number) {
  const hotel = await hotelsRepository.getHotelById(id);

  if(!hotel) {
    throw notFoundError();
  }
  return hotel;
}

async function createHotel(hotel: HotelInput) {
  if(!hotel) {
    throw notFoundError();
  }
  await hotelsRepository.createHotel(hotel);
}

const hotelsService = {
  getHotels,
  getHotelById,
  createHotel
};

export default hotelsService;
