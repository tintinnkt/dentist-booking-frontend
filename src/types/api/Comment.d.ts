import { DentistProps } from "./Dentist";
import { UserProps } from "./UserProps";

export interface Comment {
  _id: string;
  user: UserProps;
  dentist: DentistProps;
  detail: string;
  createdAt: Date;
}
