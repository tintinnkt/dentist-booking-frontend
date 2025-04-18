"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BackendRoutes } from "@/config/apiRoutes";
import { DentistProps } from "@/types/api/Dentist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Edit,
  LoaderIcon,
  Plus,
  Trash2,
  User,
  UserCheck,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Patient {
  _id: string;
  name: string;
  phone: string;
  email: string;
}

interface Schedule {
  _id: string;
  dentistId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  isHoliday: boolean;
  title?: string;
}

interface Booking {
  _id: string;
  patientId: string;
  dentistId: string;
  date: string;
  startTime: string;
  endTime: string;
  service: string;
}

interface HolidayFormData {
  date: string;
  title: string;
  startTime: string;
  endTime: string;
}

const fetchDentists = async (): Promise<Array<DentistProps>> => {
  const response = await axios.get(BackendRoutes.DENTIST);
  return response.data.data;
};

const fetchPatients = async (): Promise<Array<Patient>> => {
  const response = await axios.get(BackendRoutes.PATIENTS);
  return response.data.data;
};

const fetchSchedules = async (): Promise<Array<Schedule>> => {
  const response = await axios.get(BackendRoutes.SCHEDULES);
  return response.data.data;
};

const fetchBookings = async (): Promise<Array<Booking>> => {
  const response = await axios.get(BackendRoutes.BOOKING);
  return response.data.data;
};

const addHoliday = async (
  holiday: Omit<Schedule, "_id">,
): Promise<Schedule> => {
  const response = await axios.post(BackendRoutes.SCHEDULES, holiday);
  return response.data.data;
};

const updateSchedule = async (schedule: Schedule): Promise<Schedule> => {
  const response = await axios.put(
    `${BackendRoutes.SCHEDULES}/${schedule._id}`,
    schedule,
  );
  return response.data.data;
};

const deleteSchedule = async (id: string): Promise<void> => {
  await axios.delete(`${BackendRoutes.SCHEDULES}/${id}`);
};

export default function DentalAdminDashboard() {
  const queryClient = useQueryClient();
  const [selectedDentist, setSelectedDentist] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [viewMode, setViewMode] = useState<"schedule" | "booking">("schedule");
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState<HolidayFormData>({
    date: format(new Date(), "yyyy-MM-dd"),
    title: "",
    startTime: "00:00",
    endTime: "23:59",
  });
  const [editScheduleDialog, setEditScheduleDialog] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"default" | "destructive">(
    "default",
  );

  // Data fetching
  const {
    data: dentists = [],
    isPending: isDentistsLoading,
    error: dentistsError,
  } = useQuery({ queryKey: ["dentists"], queryFn: fetchDentists });

  const {
    data: patients = [],
    isPending: isPatientsLoading,
    error: patientsError,
  } = useQuery({ queryKey: ["patients"], queryFn: fetchPatients });

  const {
    data: schedules = [],
    isPending: isSchedulesLoading,
    error: schedulesError,
  } = useQuery({ queryKey: ["schedules"], queryFn: fetchSchedules });

  const {
    data: bookings = [],
    isPending: isBookingsLoading,
    error: bookingsError,
  } = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });

  // Mutations
  const addHolidayMutation = useMutation({
    mutationFn: addHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setAlertMessage("Holiday added successfully");
      setAlertType("default");
      setHolidayDialogOpen(false);
      resetHolidayForm();
    },
    onError: (error) => {
      setAlertMessage(`Error adding holiday: ${error.message}`);
      setAlertType("destructive");
    },
  });

  const updateScheduleMutation = useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setAlertMessage("Schedule updated successfully");
      setAlertType("default");
      setEditScheduleDialog(false);
    },
    onError: (error) => {
      setAlertMessage(`Error updating schedule: ${error.message}`);
      setAlertType("destructive");
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      setAlertMessage("Schedule deleted successfully");
      setAlertType("default");
    },
    onError: (error) => {
      setAlertMessage(`Error deleting schedule: ${error.message}`);
      setAlertType("destructive");
    },
  });

  // Helper functions
  const resetHolidayForm = () => {
    setNewHoliday({
      date: format(new Date(), "yyyy-MM-dd"),
      title: "",
      startTime: "00:00",
      endTime: "23:59",
    });
  };

  const getFilteredSchedules = (): Array<Schedule> => {
    let filtered = [...schedules];
    if (selectedDentist !== "all") {
      filtered = filtered.filter(
        (schedule) =>
          schedule.dentistId === selectedDentist ||
          (schedule.isHoliday && schedule.dentistId === null),
      );
    }
    if (selectedDate) {
      filtered = filtered.filter((schedule) => schedule.date === selectedDate);
    }
    return filtered;
  };

  const getFilteredBookings = (): Array<Booking> => {
    let filtered = [...bookings];
    if (selectedDentist !== "all") {
      filtered = filtered.filter(
        (booking) => booking.dentistId === selectedDentist,
      );
    }
    if (selectedDate) {
      filtered = filtered.filter((booking) => booking.date === selectedDate);
    }
    return filtered;
  };

  const getDentistName = (id: string): string => {
    const dentist = dentists.find((d) => d._id === id);
    return dentist ? dentist.name : "Unknown Dentist";
  };

  const getPatientName = (id: string): string => {
    const patient = patients.find((p) => p._id === id);
    return patient ? patient.name : "Unknown Patient";
  };

  const handleAddHoliday = () => {
    const holiday: Omit<Schedule, "_id"> = {
      dentistId: null,
      date: newHoliday.date,
      startTime: newHoliday.startTime,
      endTime: newHoliday.endTime,
      isHoliday: true,
      title: newHoliday.title,
    };
    addHolidayMutation.mutate(holiday);
  };

  const handleDeleteSchedule = (id: string) => {
    deleteScheduleMutation.mutate(id);
  };

  const openEditSchedule = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
    setEditScheduleDialog(true);
  };

  const handleUpdateSchedule = () => {
    if (currentSchedule) {
      updateScheduleMutation.mutate(currentSchedule);
    }
  };

  const handleCurrentScheduleChange = (
    field: keyof Schedule,
    value: string | null | boolean,
  ) => {
    if (currentSchedule) {
      setCurrentSchedule({ ...currentSchedule, [field]: value });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) setSelectedDate(format(date, "yyyy-MM-dd"));
  };

  // Effect for clearing alerts
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // Loading and error states
  const isPending =
    isDentistsLoading ||
    isPatientsLoading ||
    isSchedulesLoading ||
    isBookingsLoading;
  const error =
    dentistsError || patientsError || schedulesError || bookingsError;

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <XCircleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error as Error).message || "Failed to load data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <LoaderIcon className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dental Clinic Admin Dashboard</h1>
        <p className="text-gray-500">
          Manage schedules, bookings, and holidays
        </p>
      </header>

      {alertMessage && (
        <Alert variant={alertType} className="mb-4">
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="schedules" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="schedules">
            <Calendar className="mr-2 h-4 w-4" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="patients">
            <User className="mr-2 h-4 w-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="dentists">
            <UserCheck className="mr-2 h-4 w-4" />
            Dentists
          </TabsTrigger>
          <TabsTrigger value="holidays">
            <Calendar className="mr-2 h-4 w-4" />
            Holidays
          </TabsTrigger>
        </TabsList>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
              <CardDescription>
                View and manage dentist schedules and bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="w-full md:w-1/3">
                  <Label>Select Dentist</Label>
                  <Select
                    value={selectedDentist}
                    onValueChange={setSelectedDentist}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a dentist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dentists</SelectItem>
                      {dentists.map((dentist) => (
                        <SelectItem key={dentist._id} value={dentist._id}>
                          {dentist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/3">
                  <Label>Select Date</Label>
                  <DatePickerWithPresets
                    date={new Date(selectedDate)}
                    onSelect={handleDateChange}
                  />
                </div>

                <div className="w-full md:w-1/3">
                  <Label>View Mode</Label>
                  <Select
                    value={viewMode}
                    onValueChange={(value: "schedule" | "booking") =>
                      setViewMode(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schedule">
                        Dentist Schedules
                      </SelectItem>
                      <SelectItem value="booking">Patient Bookings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {viewMode === "schedule" ? (
                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    Schedules for{" "}
                    {selectedDentist === "all"
                      ? "All Dentists"
                      : getDentistName(selectedDentist)}{" "}
                    on {selectedDate}
                  </h3>

                  <div className="space-y-4">
                    {getFilteredSchedules().length > 0 ? (
                      getFilteredSchedules().map((schedule) => (
                        <Card
                          key={schedule._id}
                          className={
                            schedule.isHoliday ? "border-red-300 bg-red-50" : ""
                          }
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">
                                {schedule.isHoliday
                                  ? schedule.title || "Holiday"
                                  : getDentistName(
                                      schedule.dentistId as string,
                                    )}
                              </CardTitle>
                              <div className="flex space-x-2">
                                {!schedule.isHoliday && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openEditSchedule(schedule)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteSchedule(schedule._id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription>
                              {schedule.date} · {schedule.startTime} -{" "}
                              {schedule.endTime}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {schedule.isHoliday ? (
                              <Badge variant="destructive">Holiday</Badge>
                            ) : (
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>Working Hours</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No schedules found for the selected criteria.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="mb-4 text-lg font-medium">
                    Bookings for{" "}
                    {selectedDentist === "all"
                      ? "All Dentists"
                      : getDentistName(selectedDentist)}{" "}
                    on {selectedDate}
                  </h3>

                  <div className="space-y-4">
                    {getFilteredBookings().length > 0 ? (
                      getFilteredBookings().map((booking) => (
                        <Card key={booking._id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">
                                {getPatientName(booking.patientId)}
                              </CardTitle>
                              <Badge>{booking.service}</Badge>
                            </div>
                            <CardDescription>
                              With {getDentistName(booking.dentistId)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>
                                {booking.startTime} - {booking.endTime}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No bookings found for the selected criteria.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                View and manage patient information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient) => (
                  <Card key={patient._id}>
                    <CardHeader>
                      <CardTitle>{patient.name}</CardTitle>
                      <CardDescription>
                        Patient ID: {patient._id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="font-medium">Contact Information</p>
                          <p>Phone: {patient.phone}</p>
                          <p>Email: {patient.email}</p>
                        </div>
                        <div>
                          <p className="font-medium">Upcoming Bookings</p>
                          {bookings.filter((a) => a.patientId === patient._id)
                            .length > 0 ? (
                            bookings
                              .filter((a) => a.patientId === patient._id)
                              .map((a) => (
                                <div key={a._id} className="text-sm">
                                  {a.date} · {a.startTime} - {a.endTime} ·{" "}
                                  {a.service}
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No upcoming bookings
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">View Details</Button>
                        <Button>Book Booking</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dentists Tab */}
        <TabsContent value="dentists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dentist Management</CardTitle>
              <CardDescription>
                View and manage dentist information and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dentists.map((dentist) => (
                  <Card key={dentist._id}>
                    <CardHeader>
                      <CardTitle>{dentist.name}</CardTitle>
                      <CardDescription>
                        {dentist.areaOfExpertise}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="font-medium">{"Today's Schedule"}</p>
                          {schedules
                            .filter(
                              (s) =>
                                s.dentistId === dentist._id &&
                                s.date === selectedDate,
                            )
                            .map((s) => (
                              <div key={s._id} className="text-sm">
                                {s.startTime} - {s.endTime}
                              </div>
                            ))}
                          {schedules.filter(
                            (s) =>
                              s.dentistId === dentist._id &&
                              s.date === selectedDate,
                          ).length === 0 && (
                            <p className="text-sm text-gray-500">
                              No schedule for today
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Upcoming Bookings</p>
                          {bookings
                            .filter((a) => a.dentistId === dentist._id)
                            .map((a) => (
                              <div key={a._id} className="text-sm">
                                {a.date} · {a.startTime} - {a.endTime} ·{" "}
                                {getPatientName(a.patientId)}
                              </div>
                            ))}
                          {bookings.filter((a) => a.dentistId === dentist._id)
                            .length === 0 && (
                            <p className="text-sm text-gray-500">
                              No upcoming bookings
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">View Details</Button>
                        <Button>Manage Schedule</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holidays Tab */}
        <TabsContent value="holidays" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Holiday Management</CardTitle>
                <CardDescription>
                  Schedule clinic-wide holidays and off-service hours
                </CardDescription>
              </div>
              <Dialog
                open={holidayDialogOpen}
                onOpenChange={setHolidayDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule a Holiday</DialogTitle>
                    <DialogDescription>
                      Add a holiday or off-service period.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="holiday-title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="holiday-title"
                        className="col-span-3"
                        value={newHoliday.title}
                        onChange={(e) =>
                          setNewHoliday({
                            ...newHoliday,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="holiday-date" className="text-right">
                        Date
                      </Label>
                      <div className="col-span-3">
                        <DatePickerWithPresets
                          date={new Date(newHoliday.date)}
                          onSelect={(date) => {
                            if (date) {
                              setNewHoliday({
                                ...newHoliday,
                                date: format(date, "yyyy-MM-dd"),
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="holiday-start" className="text-right">
                        Start Time
                      </Label>
                      <Input
                        id="holiday-start"
                        type="time"
                        className="col-span-3"
                        value={newHoliday.startTime}
                        onChange={(e) =>
                          setNewHoliday({
                            ...newHoliday,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="holiday-end" className="text-right">
                        End Time
                      </Label>
                      <Input
                        id="holiday-end"
                        type="time"
                        className="col-span-3"
                        value={newHoliday.endTime}
                        onChange={(e) =>
                          setNewHoliday({
                            ...newHoliday,
                            endTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="full-day" className="text-right">
                        Full Day
                      </Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch
                          id="full-day"
                          checked={
                            newHoliday.startTime === "00:00" &&
                            newHoliday.endTime === "23:59"
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewHoliday({
                                ...newHoliday,
                                startTime: "00:00",
                                endTime: "23:59",
                              });
                            } else {
                              setNewHoliday({
                                ...newHoliday,
                                startTime: "09:00",
                                endTime: "17:00",
                              });
                            }
                          }}
                        />
                        <Label htmlFor="full-day">All day holiday</Label>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setHolidayDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddHoliday}
                      disabled={addHolidayMutation.isPending}
                    >
                      {addHolidayMutation.isPending ? (
                        <>
                          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Holiday"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules
                  .filter((schedule) => schedule.isHoliday)
                  .map((holiday) => (
                    <Card
                      key={holiday._id}
                      className="border-red-300 bg-red-50"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">
                            {holiday.title || "Clinic Holiday"}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteSchedule(holiday._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>{holiday.date}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>
                            {holiday.startTime === "00:00" &&
                            holiday.endTime === "23:59"
                              ? "Full day"
                              : `${holiday.startTime} - ${holiday.endTime}`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {schedules.filter((schedule) => schedule.isHoliday).length ===
                  0 && <p className="text-gray-500">No holidays scheduled.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Schedule Dialog */}
      <Dialog open={editScheduleDialog} onOpenChange={setEditScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the dentist's schedule details.
            </DialogDescription>
          </DialogHeader>

          {currentSchedule && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <DatePickerWithPresets
                  date={new Date(currentSchedule.date)}
                  onSelect={(date) => {
                    if (date) {
                      handleCurrentScheduleChange(
                        "date",
                        format(date, "yyyy-MM-dd"),
                      );
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-start" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="edit-start"
                  type="time"
                  className="col-span-3"
                  value={currentSchedule.startTime}
                  onChange={(e) =>
                    handleCurrentScheduleChange("startTime", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-end" className="text-right">
                  End Time
                </Label>
                <Input
                  id="edit-end"
                  type="time"
                  className="col-span-3"
                  value={currentSchedule.endTime}
                  onChange={(e) =>
                    handleCurrentScheduleChange("endTime", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSchedule}
              disabled={updateScheduleMutation.isPending}
            >
              {updateScheduleMutation.isPending ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Schedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
