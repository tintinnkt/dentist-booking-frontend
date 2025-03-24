"use client";
import { BackendRoutes } from "@/config/apiRoutes";
import { DentistProps } from "@/types/api/Dentist";
import { User } from "@/types/user";
import axios from "axios";
import { format } from "date-fns"; // Make sure to install this package if not already
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
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
  const [appTime, setAppTime] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data: session } = useSession();

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  const handleBooking = async () => {
    if (!appDate) {
      toast.error("Please select a date for your appointment");
      return;
    }

    if (!appTime) {
      toast.error("Please select a time for your appointment");
      return;
    }

    // Validate if user is logged in
    if (!user || !user._id) {
      toast.error("You must be logged in to book an appointment");
      return;
    }

    try {
      // Create a combined date and time
      const [hours, minutes] = appTime.split(":").map(Number);
      const appointmentDateTime = new Date(appDate);
      appointmentDateTime.setHours(hours, minutes);

      const response = await axios.post(
        BackendRoutes.BOOKING,
        {
          apptDate: appointmentDateTime,
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
      setAppTime("");
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

  const handleDeleteDentist = (dentist_id: string) => {
    axios.delete(`${BackendRoutes.DENTIST}/${dentist_id}`);
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
                <CustomButton
                  useFor="delete-dentist"
                  onClick={() => handleDeleteDentist(dentist.id)}
                />
              </div>
            )}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <CustomButton useFor="booking" hideTextOnMobile={false} />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="space-y-4 p-3">
                  <h3 className="font-medium">
                    Select Appointment Date & Time
                  </h3>
                  <Calendar
                    mode="single"
                    selected={appDate}
                    onSelect={setAppDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />

                  {appDate && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Time for {format(appDate, "EEEE, MMMM do")}
                      </h4>
                      <Select value={appTime} onValueChange={setAppTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="pt-2">
                    <CustomButton
                      useFor="add-booking-section"
                      onClick={handleBooking}
                      disabled={!appDate || !appTime}
                      className="w-full"
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
