"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { expertiseOptions, timeSlots } from "@/constant/expertise";
import { useBooking } from "@/hooks/useBooking";
import { useComments } from "@/hooks/useComments";
import { useOffHours } from "@/hooks/useOffHours";
import { useUser } from "@/hooks/useUser";
import { DentistProps, DentistResponse } from "@/types/api/Dentist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import {
  CalendarX2Icon,
  CheckIcon,
  Loader2Icon,
  MessageCircleIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  dentist: DentistResponse;
  onAction?: () => void;
  isLoaded?: boolean;
  actionButtonUseFor?: ButtonConfigKeys;
}

const DentistCard = ({ dentist }: DentistCardProps) => {
  const { user } = useUser();
  const [appDate, setAppDate] = useState<Date>();
  const [appTime, setAppTime] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    Record<string, boolean>
  >({});
  const [availabilityCalculating, setAvailabilityCalculating] = useState(false);

  const [formData, setFormData] = useState<Partial<DentistProps>>({
    yearsOfExperience: dentist.yearsOfExperience,
    areaOfExpertise: dentist.areaOfExpertise,
  });
  const [selectedExpertise, setSelectedExpertise] = useState<Array<string>>(
    dentist.areaOfExpertise || [],
  );
  const [expertisePopoverOpen, setExpertisePopoverOpen] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Use our new comments hook
  const {
    commentData,
    isAddingComment,
    setIsAddingComment,
    newComment,
    setNewComment,
    handleAddComment,
    handleDeleteComment,
  } = useComments(dentist._id);

  const { filteredOffhours, isLoadingOffHours } = useOffHours(
    appDate,
    dentist.user._id,
  );

  // Booking mutation
  const { bookAppointment, isCreating } = useBooking();

  // Pre-calculate available time slots whenever the date changes
  useEffect(() => {
    if (!appDate) {
      setAvailableTimeSlots({});
      return;
    }

    // Set loading state
    setAvailabilityCalculating(true);

    // Calculate availability for all time slots
    const dateStr = format(appDate, "yyyy-MM-dd");
    const slotsAvailability: Record<string, boolean> = {};

    // Small delay to ensure the offhours data is loaded
    const timer = setTimeout(() => {
      timeSlots.forEach((time) => {
        const dateTimeStr = `${dateStr}T${time}`;

        // Check if in off hours
        const isOffHour = filteredOffhours.some((offhour) => {
          const startTime = new Date(offhour.startDate);
          const endTime = new Date(offhour.endDate);
          const slotTime = new Date(dateTimeStr);
          return slotTime >= startTime && slotTime <= endTime;
        });

        // Check if already booked
        const isBooked = dentist.bookings?.some((booking) => {
          if (booking.status === "cancel") return false;

          const bookingDate = new Date(booking.apptDateAndTime);
          const bookingTime = format(bookingDate, "HH:mm");
          const bookingDateStr = format(bookingDate, "yyyy-MM-dd");

          return bookingTime === time && bookingDateStr === dateStr;
        });

        slotsAvailability[time] = !(isOffHour || isBooked);
      });

      setAvailableTimeSlots(slotsAvailability);

      // If current selected time is now unavailable, reset it
      if (appTime && !slotsAvailability[appTime]) {
        setAppTime("");
      }

      setAvailabilityCalculating(false);
    }, 300); // Small delay to avoid excessive re-renders

    return () => clearTimeout(timer);
  }, [appDate, filteredOffhours, dentist.bookings, appTime]);

  // Update dentist mutation
  const updateDentist = useMutation({
    mutationFn: async (updatedDentist: Partial<DentistProps>) => {
      return axios.put(
        `${BackendRoutes.DENTIST}/${dentist._id}`,
        updatedDentist,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
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
    onError: (error: AxiosError) => {
      console.error(error.message);
      toast.error("Failed to update dentist. Please try again!");
    },
  });

  // Delete dentist mutation
  const { mutate: deleteDentistMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return axios.delete(`${BackendRoutes.DENTIST}/${dentist._id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
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

  // Create a visual indicator for available slots
  const getAvailableSlotsCount = (): number => {
    if (!appDate) return 0;
    return Object.values(availableTimeSlots).filter(Boolean).length;
  };

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
        yearsOfExperience: dentist.yearsOfExperience,
        areaOfExpertise: dentist.areaOfExpertise,
      });
      setSelectedExpertise(dentist.areaOfExpertise || []);
    }
  };

  const handleSave = () => {
    // Validate inputs
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
      yearsOfExperience: formData.yearsOfExperience,
      areaOfExpertise: selectedExpertise,
    });
  };

  return (
    <Card className="w-full max-w-3xl rounded-xl">
      <CardHeader className="flex flex-wrap lg:flex-nowrap">
        <CardTitle className="flex items-center space-y-1 space-x-4">
          <h2 className="text-2xl">{dentist.user.name}</h2>
          <Badge variant={"secondary"}>
            {dentist.yearsOfExperience} year
            {dentist.yearsOfExperience > 1 ? "s" : ""} of experience
          </Badge>
        </CardTitle>
        <div className="flex w-full max-w-md flex-wrap items-center justify-end space-x-2 gap-y-2">
          {user && user.role === Role_type.ADMIN && (
            <>
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
                    <Badge variant={"destructive"}>{dentist.user.name}</Badge>{" "}
                    and remove data from our servers.
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
            </>
          )}

          {user && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild className="w-fit">
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
                    onSelect={(date) => {
                      setAppDate(date);
                      setAppTime(""); // Reset time selection when date changes
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />

                  {appDate && (
                    <div className="space-y-2">
                      <div className="flex flex-col items-start">
                        <h4 className="text-sm font-medium">
                          Time for {format(appDate, "EEEE, MMMM do")}
                        </h4>
                        {availabilityCalculating || isLoadingOffHours ? (
                          <div className="flex items-center space-x-2">
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                            <span className="text-xs">
                              Checking availability...
                            </span>
                          </div>
                        ) : (
                          <Badge
                            variant={
                              getAvailableSlotsCount() > 0
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {getAvailableSlotsCount()} available slots
                          </Badge>
                        )}
                      </div>

                      <Select
                        value={appTime}
                        onValueChange={setAppTime}
                        disabled={availabilityCalculating || isLoadingOffHours}
                      >
                        <SelectTrigger disabled={getAvailableSlotsCount() <= 0}>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableSlotsCount() === 0 &&
                          !availabilityCalculating &&
                          !isLoadingOffHours ? (
                            <div className="text-muted-foreground p-2 text-center text-sm">
                              No available time slots for this date
                            </div>
                          ) : (
                            timeSlots.map((time) => {
                              const isAvailable = availableTimeSlots[time];

                              return (
                                <SelectItem
                                  key={time}
                                  value={time}
                                  disabled={!isAvailable}
                                >
                                  {!isAvailable ? <CalendarX2Icon /> : null}
                                  {time}
                                </SelectItem>
                              );
                            })
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="pt-2">
                    <CustomButton
                      hideTextOnMobile={true}
                      useFor="add-booking-section"
                      onClick={() => {
                        if (user && appDate && appTime) {
                          bookAppointment(
                            dentist._id,
                            user._id,
                            appDate,
                            appTime,
                          );
                          if (!isCreating) {
                            setPopoverOpen(false);
                          }
                        } else {
                          toast.error("Please select a date and time");
                        }
                      }}
                      disabled={
                        !appDate ||
                        !appTime ||
                        isCreating ||
                        availabilityCalculating ||
                        isLoadingOffHours
                      }
                      className="w-full"
                      isLoading={isCreating}
                    >
                      {isCreating ? "Booking..." : "Book Appointment"}
                    </CustomButton>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <Separator />
      <CardContent
        className={twJoin(
          "grid w-full grid-cols-2 gap-4 sm:grid-cols-3",
          isEditing ? "space-y-0" : "",
        )}
      >
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
          <div className="sm:col-span-2">
            <Popover
              open={expertisePopoverOpen}
              onOpenChange={setExpertisePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left"
                >
                  <span className="truncate">
                    {selectedExpertise.length > 0
                      ? selectedExpertise.join(", ")
                      : "Select expertise"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 md:w-80">
                <Command className="max-h-60 overflow-y-auto">
                  <CommandInput placeholder="Search expertise..." />
                  <CommandList>
                    <CommandGroup>
                      {expertiseOptions.map((expertise) => (
                        <CommandItem
                          key={expertise}
                          value={expertise}
                          onSelect={() => toggleExpertise(expertise)}
                        >
                          <CheckIcon
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
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleExpertiseSave} size="sm">
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {selectedExpertise.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedExpertise.map((expertise) => (
                  <Badge key={expertise} variant="secondary">
                    {expertise}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ul className="list-inside list-disc sm:col-span-2">
            {dentist.areaOfExpertise.map((expertise, idx) => (
              <li key={idx}>{expertise}</li>
            ))}
          </ul>
        )}
      </CardContent>
      {user && (
        <>
          <CardFooter className="flex flex-row flex-wrap items-center justify-end space-y-2 space-x-2">
            <Accordion type="single" collapsible className="mx-0 w-full">
              <AccordionItem value="comment">
                <AccordionTrigger className="py-1">
                  <div className="flex items-center space-x-2">
                    <MessageCircleIcon className="h-4 w-4" />
                    <span>View Comments ({commentData?.count ?? 0})</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-2">
                  <div className="space-y-3">
                    {commentData?.data?.map((comment) => (
                      <div key={comment._id} className="relative bg-white">
                        <Separator />
                        <div className="flex items-center space-x-2 pt-2.5">
                          <UserIcon />
                          <span className="text-lg font-semibold">
                            {comment.user.name}
                          </span>
                        </div>

                        <div className="pt-2 font-medium text-gray-800">
                          {comment.comment}
                        </div>

                        {user &&
                          (user._id === comment.user._id ||
                            user.role === Role_type.ADMIN) && (
                            <div className="absolute right-2 bottom-2">
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2Icon size={18} />
                              </button>
                            </div>
                          )}
                      </div>
                    ))}
                    {user && user.role !== "dentist" ? (
                      <div className="flex w-full justify-end px-3">
                        {isAddingComment ? (
                          <div className="w-full space-y-2 px-3">
                            <Input
                              placeholder="Write your comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setIsAddingComment(false);
                                  setNewComment("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  if (user?._id && session?.user?.token) {
                                    handleAddComment(user._id);
                                  } else {
                                    toast.error("User session not available");
                                  }
                                }}
                              >
                                Send
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex w-full justify-end px-3">
                            <CustomButton
                              useFor="add-comment"
                              onClick={() => setIsAddingComment(true)}
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default DentistCard;
