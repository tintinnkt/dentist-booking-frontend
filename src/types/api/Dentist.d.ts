export interface DentistProps {
  _id: string;
  user: {
    name: string;
  };
  yearsOfExperience: number;
  areaOfExpertise: Array<string>;
  id: string;
}

interface BookingUserProps {
  _id: string;
  name: string;
  tel: string;
  email: string;
}

export interface Booking {
  _id: string;
  apptDateAndTime: string;
  user: BookingUserProps;
  dentist: DentistProps | null;
  status: string;
  createdAt: string;
  __v: number;
}

type BookingItem = {
  id: string;
  date: string;
  patientName: string;
  patientContact: string;
  patientEmail: string;
  status: string;
};

type DentistSchedule = {
  dentist: {
    id: string;
    user: {
      name: string;
      tel: string;
      email: string;
    };
    yearsOfExperience: number;
    areaOfExpertise: string[];
  };
  upcomingBookings: BookingItem[];
  unavailableSlots: {
    id: string;
    date: string;
    createdAt: string;
  }[];
};
