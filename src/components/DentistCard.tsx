import { DentistListAllItem } from "../types/api/Dentist";

import { ButtonConfigKeys, CustomButton } from "./CustomButton";
import { Badge } from "./ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Separator } from "./ui/Separator";

interface DentistCardProps {
  dentist: DentistListAllItem;
  onAction?: () => void;
  isLoaded?: boolean;
  actionButtonUseFor?: ButtonConfigKeys;
}

const DentistCard = ({
  dentist,
  isLoaded = true,
  onAction,
  actionButtonUseFor,
}: DentistCardProps) => {
  // const { data: session } = useSession();
  // const user = session?.user;

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center space-y-1 space-x-4">
          <h2 className="text-2xl">{dentist.name}</h2>
          <Badge variant={"secondary"}>
            {dentist.yearsOfExperience} year
            {dentist.yearsOfExperience > 1 ? "s" : ""} of experience
          </Badge>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="grid w-full grid-cols-2">
        <p>Name</p>
        <p className="col-span-1">{dentist.name}</p>
        <p>Years of experiences</p>
        <p className="col-span-1">{dentist.yearsOfExperience}</p>
        <p>Expertises</p>
        <ul className="col-span-1 list-disc">
          {dentist.areaOfExpertise.map((expertise, idx) => (
            <li key={idx} className="">
              {expertise}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-end">
        <CustomButton useFor="select" />
      </CardFooter>
    </Card>
  );
};

export default DentistCard;
