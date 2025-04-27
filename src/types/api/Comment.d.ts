import { DentistProps } from "./Dentist";
import { UserProps } from "./UserProps";

export interface Comment {
  _id: string;
  user: UserProps;
  dentist: DentistProps;
  comment: string;
  createdAt: Date;
}
