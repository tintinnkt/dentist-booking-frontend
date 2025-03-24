"use client";
import { BackendRoutes } from "@/config/apiRoutes";
import { timeSlots } from "@/constant/expertise";
import { DentistProps } from "@/types/api/Dentist";
import { User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ButtonConfigKeys, CustomButton } from "./CustomButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
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
  const queryClient = useQueryClient();

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (appointmentData: {
      apptDate: Date;
      user: string;
      dentist: string;
    }) => {
      return axios.post(BackendRoutes.BOOKING, appointmentData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Appointment booked successfully");
      setAppDate(undefined);
      setAppTime("");
      setPopoverOpen(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Failed to book appointment";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
        console.error(error);
      }
    },
  });

  // Delete dentist mutation
  const deleteDentistMutation = useMutation({
    mutationFn: async () => {
      return axios.delete(`${BackendRoutes.DENTIST}/${dentist._id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Dentist deleted successfully!");
      // Invalidate and refetch dentists query to update UI
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
    },
    onError: (error) => {
      console.error((error as AxiosError).message);
      toast.error("Failed to delete dentist. Please try again!");
    },
  });

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

    // Create a combined date and time
    const [hours, minutes] = appTime.split(":").map(Number);
    const appointmentDateTime = new Date(appDate);
    appointmentDateTime.setHours(hours, minutes);

    bookingMutation.mutate({
      apptDate: appointmentDateTime,
      user: user._id,
      dentist: dentist.id,
    });
  };

  const handleDeleteDentist = () => {
    deleteDentistMutation.mutate();
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
        <ul className="list-inside list-disc sm:col-span-2">
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <CustomButton useFor="delete-dentist" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      <Badge variant={"destructive"}>{dentist.name}</Badge> and
                      remove data from our servers.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteDentist}
                        disabled={deleteDentistMutation.isPending}
                      >
                        {deleteDentistMutation.isPending
                          ? "Deleting..."
                          : "Continue"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                      disabled={
                        !appDate || !appTime || bookingMutation.isPending
                      }
                      className="w-full"
                    >
                      {bookingMutation.isPending
                        ? "Booking..."
                        : "Book Appointment"}
                    </CustomButton>
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
