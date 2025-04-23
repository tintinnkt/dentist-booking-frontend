import { UserProps } from "./UserProps";

export interface Comment {
  _id: string;
  user: UserProps;
  dentist: string;
  detail: string;
  createdAt: Date;
}
