"use client";
import { useUser } from "@/hooks/useUser";
import { DentistProps } from "@/types/api/Dentist";

import { Role_type } from "@/config/role";
import toast from "react-hot-toast";
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
  dentist: DentistProps;
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
  const { user, loading, error } = useUser();

  return (
    <Card className="w-full max-w-xl rounded-xl">
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
      <CardContent className="grid w-full grid-cols-2 sm:grid-cols-3">
        <p>Name</p>
        <p className="sm:col-span-2">{dentist.name}</p>
        <p className="min-w-fit">Years of experiences</p>
        <p className="sm:col-span-2">{dentist.yearsOfExperience}</p>
        <p>Expertises</p>
        <ul className="list-disc sm:col-span-2">
          {dentist.areaOfExpertise.map((expertise, idx) => (
            <li key={idx} className="">
              {expertise}
            </li>
          ))}
        </ul>
      </CardContent>
      {user && (
        <>
          <Separator />
          <CardFooter className="flex justify-end space-x-2">
            {user?.role === Role_type.ADMIN && (
              <>
                <CustomButton useFor="edit" />
                <CustomButton useFor="delete-dentist" />
              </>
            )}
            <CustomButton
              useFor="booking"
              onClick={() => toast.success("ทำการจองแล้ว")}
              hideTextOnMobile={false}
            />
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default DentistCard;
