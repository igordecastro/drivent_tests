import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

type HotelInput = Omit<Hotel, "id" | "createdAt" | "updatedAt">;

async function getHotels() {
  const hotels = await prisma.hotel.findMany();
  return hotels;
}

async function getHotelRoomsById(id: number) {
  return prisma.hotel.findMany({
    where: { id },
    include: {
      Rooms: true
    }
  });
}

async function createHotel(hotel: HotelInput) {
  return prisma.hotel.create({
    data: hotel
  });
}

const hotelsRepository = {
  getHotels,
  createHotel,
  getHotelById: getHotelRoomsById
};

export default hotelsRepository;
