import { Booking } from "@/types/api/Dentist";

export const mockBookings: Array<Booking> = [
  {
    _id: "67deeb7d3dd3fec624612fd7",
    apptDate: "2024-01-01T15:00:00.000Z",
    user: "67b5fb1413eb42cfcc03df6f",
    dentist: {
      _id: "67c336e4c52730635fa12200",
      name: "Jana Kohler",
      yearsOfExperience: 2,
      areaOfExpertise: ["Orthodontics"],
      id: "67c336e4c52730635fa12200",
    },
    createdAt: "2025-03-22T16:55:25.463Z",
    __v: 0,
  },
  {
    _id: "67deeb7d3dd3fec624612fd8",
    apptDate: "2024-02-10T10:30:00.000Z",
    user: "67b5fb1413eb42cfcc03df6f",
    dentist: {
      _id: "67c336e4c52730635fa12201",
      name: "Samantha Smith",
      yearsOfExperience: 5,
      areaOfExpertise: ["General Dentistry", "Cosmetic Dentistry"],
      id: "67c336e4c52730635fa12201",
    },
    createdAt: "2025-03-23T16:55:25.463Z",
    __v: 0,
  },
];
