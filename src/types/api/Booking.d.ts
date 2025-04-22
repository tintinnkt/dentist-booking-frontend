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
  dentist: DentistProps;
  status: string;
}
