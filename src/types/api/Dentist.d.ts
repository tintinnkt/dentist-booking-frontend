export interface DentistProps {
  _id: string;
  name: string;
  yearsOfExperience: number;
  areaOfExpertise: Array<string>;
  id: string;
}
export interface Booking {
  _id: string;
  apptDate: string;
  user: string;
  dentist: DentistProps;
  createdAt: string;
  __v: number;
}
