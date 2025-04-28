import { Booking } from "./Booking";
import { UserProps } from "./UserProps";

export interface DentistProps {
  _id: string;
  user: UserProps;
  yearsOfExperience: number;
  areaOfExpertise: Array<string>;
  id: string;
}

export interface DentistResponse extends DentistProps {
  bookings: Array<DentistBookingProps>;
}

interface DentistBookingProps extends Booking {
  user: string;
  _id: string;
}
