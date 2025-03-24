"use client";
import { BackendRoutes } from "@/config/apiRoutes";
import { DentistProps } from "@/types/api/Dentist";
import { User } from "@/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ButtonConfigKeys, CustomButton } from "./CustomButton";
import { Badge } from "./ui/Badge";
import { Calendar } from "./ui/Calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Separator } from "./ui/Separator";

interface DentistCardProps {
  dentist: DentistProps;
  onAction?: () => void;
  isLoaded?: boolean;
  actionButtonUseFor?: ButtonConfigKeys;
  isAdmin: boolean;
  user: User | null;
}

const DentistCard = ({ dentist, isAdmin, user }: DentistCardProps) => {
  const [appDate, setAppDate] = useState<Date>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data: session } = useSession();

  const handleBooking = async () => {
    // Validate if date is selected
    if (!appDate) {
      toast.error("Please select a date for your appointment");
      return;
    }

    // Validate if user is logged in
    if (!user || !user._id) {
      toast.error("You must be logged in to book an appointment");
      return;
    }

    try {
      const response = await axios.post(
        BackendRoutes.BOOKING,
        {
          apptDate: appDate,
          user: user._id,
          dentist: dentist.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Handle success
      toast.success("Appointment booked successfully");
      setAppDate(undefined);
      setPopoverOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to book appointment";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
        console.error(error);
      }
    }
  };

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
          <CardFooter className="flex flex-row flex-wrap items-center justify-end space-y-2 space-x-2">
            {isAdmin && (
              <div className="flex space-x-2 pt-2">
                <CustomButton useFor="edit" />
                <CustomButton useFor="delete-dentist" />
              </div>
            )}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <CustomButton useFor="booking" hideTextOnMobile={false} />
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-4">
                  <h3 className="pl-2 font-medium">Select Appointment Date</h3>
                  <Calendar
                    mode="single"
                    selected={appDate}
                    onSelect={setAppDate}
                    disabled={(date) => date < new Date()}
                  />
                  <div className="px-3 pb-1">
                    <CustomButton
                      useFor="add-booking-section"
                      onClick={handleBooking}
                      disabled={!appDate}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default DentistCard;
