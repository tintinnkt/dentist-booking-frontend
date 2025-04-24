import { UserProps } from "./UserProps";

export interface OffHour {
  _id: string;
  owner: UserProps;
  startDate: string;
  endDate: string;
  description: string;
  isForAllDentist: boolean;
  createdAt: string;
}
