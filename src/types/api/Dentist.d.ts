import { UserProps } from "./UserProps";

export interface DentistProps {
  _id: string;
  user: UserProps;
  yearsOfExperience: number;
  areaOfExpertise: Array<string>;
  id: string;
}
