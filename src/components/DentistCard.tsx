"use client";
import { BackendRoutes } from "@/config/apiRoutes";
import { expertiseOptions, timeSlots } from "@/constant/expertise";
import { useBooking } from "@/hooks/useBooking";
import { DentistProps } from "@/types/api/Dentist";
import { User } from "@/types/User";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { twJoin } from "tailwind-merge";
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
import { Button } from "./ui/Button";
import { Calendar } from "./ui/Calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { Input } from "./ui/Input";
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

  const { bookAppointment, isCreating } = useBooking();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DentistProps>>({
    name: dentist.name,
    yearsOfExperience: dentist.yearsOfExperience,
    areaOfExpertise: dentist.areaOfExpertise,
  });
  const [selectedExpertise, setSelectedExpertise] = useState<Array<string>>(
    dentist.areaOfExpertise || [],
  );
  const [expertisePopoverOpen, setExpertisePopoverOpen] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Booking mutation (unchanged)
  const handleAppointmentBooking = () => {
    if (user && appDate && appTime) {
      bookAppointment(dentist.id, user._id, appDate, appTime);
      // Reset form after booking
      setAppDate(undefined);
      setAppTime("");
      setPopoverOpen(false);
    } else {
      toast.error("Please select a date and time");
    }
  };

  // Update dentist mutation
  const updateDentist = useMutation({
    mutationFn: async (updatedDentist: Partial<DentistProps>) => {
      return axios.put(
        `${BackendRoutes.DENTIST}/${dentist._id}`,
        updatedDentist,
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      toast.success("Dentist updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error((error as AxiosError).message);
      toast.error("Failed to update dentist. Please try again!");
    },
  });

  // Delete dentist mutation (unchanged)
  const { mutate: deleteDentistMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return axios.delete(`${BackendRoutes.DENTIST}/${dentist._id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      toast.success("Dentist deleted successfully!");
    },
    onError: (error) => {
      console.error((error as AxiosError).message);
      toast.error("Failed to delete dentist. Please try again!");
    },
  });

  // Handle input changes during editing
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? Number(value) : value,
    }));
  };

  // Toggle expertise selection
  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise)
        ? prev.filter((item) => item !== expertise)
        : [...prev, expertise],
    );
  };

  // Handle expertise save
  const handleExpertiseSave = () => {
    setFormData((prev) => ({
      ...prev,
      areaOfExpertise: selectedExpertise,
    }));
    setExpertisePopoverOpen(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        name: dentist.name,
        yearsOfExperience: dentist.yearsOfExperience,
        areaOfExpertise: dentist.areaOfExpertise,
      });
      setSelectedExpertise(dentist.areaOfExpertise || []);
    }
  };

  const handleSave = () => {
    // Validate inputs
    if (!formData.name || !formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (
      formData.yearsOfExperience === undefined ||
      formData.yearsOfExperience < 0
    ) {
      toast.error("Years of experience must be a non-negative number");
      return;
    }

    if (!selectedExpertise || selectedExpertise.length === 0) {
      toast.error("Please select at least one area of expertise");
      return;
    }

    updateDentist.mutate({
      name: formData.name,
      yearsOfExperience: formData.yearsOfExperience,
      areaOfExpertise: selectedExpertise,
    });
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
      <CardContent
        className={twJoin(
          "grid w-full grid-cols-2 sm:grid-cols-3",
          isEditing ? "space-y-3" : "",
        )}
      >
        <p>Name</p>
        {isEditing ? (
          <Input
            name="name"
            type="text"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="sm:col-span-2"
          />
        ) : (
          <p className="sm:col-span-2">{dentist.name}</p>
        )}
        <p className="min-w-fit">Years of experiences</p>
        {isEditing ? (
          <Input
            name="yearsOfExperience"
            type="number"
            value={formData.yearsOfExperience || 0}
            onChange={handleInputChange}
            className="sm:col-span-2"
            min={0}
          />
        ) : (
          <p className="sm:col-span-2">{dentist.yearsOfExperience}</p>
        )}
        <p>Expertises</p>
        {isEditing ? (
          <Popover
            open={expertisePopoverOpen}
            onOpenChange={setExpertisePopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-wrap sm:col-span-2"
              >
                {selectedExpertise.length > 0
                  ? selectedExpertise.join(", ")
                  : "Select expertise"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2 text-wrap">
              <Command>
                <CommandInput placeholder="Search expertise..." />
                <CommandList>
                  <CommandGroup>
                    {expertiseOptions.map((expertise) => (
                      <CommandItem
                        key={expertise}
                        value={expertise}
                        onSelect={() => toggleExpertise(expertise)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedExpertise.includes(expertise)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {expertise}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="mt-2 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setExpertisePopoverOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleExpertiseSave}>Save</Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <ul className="list-inside list-disc sm:col-span-2">
            {dentist.areaOfExpertise.map((expertise, idx) => (
              <li key={idx} className="">
                {expertise}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {user && (
        <>
          <CardFooter className="flex flex-row flex-wrap items-center justify-end space-y-2 space-x-2">
            {isAdmin && (
              <div className="flex space-x-2 pt-2">
                {isEditing ? (
                  <>
                    <CustomButton
                      useFor="cancel"
                      onClick={handleEditToggle}
                      disabled={updateDentist.isPending}
                    />
                    <CustomButton
                      useFor="confirm-info"
                      onClick={handleSave}
                      isLoading={updateDentist.isPending}
                    />
                  </>
                ) : (
                  <CustomButton useFor="edit" onClick={handleEditToggle} />
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <CustomButton useFor="delete-dentist" hideTextOnMobile />
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
                        onClick={() => deleteDentistMutation()}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Continue"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <CustomButton useFor="booking" hideTextOnMobile />
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
                      hideTextOnMobile={true}
                      useFor="add-booking-section"
                      onClick={handleAppointmentBooking}
                      disabled={!appDate || !appTime || isCreating}
                      className="w-full"
                      isLoading={isCreating}
                    >
                      {isCreating ? "Booking..." : "Book Appointment"}
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
