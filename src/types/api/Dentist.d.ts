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
}

export interface Booking {
  _id: string;
  apptDateAndTime: string;
  user: BookingUserProps;
  dentist: DentistProps | null;
  createdAt: string;
  __v: number;
}
