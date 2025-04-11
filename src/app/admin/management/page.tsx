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
import {
  Calendar,
  Clock,
  Edit,
  Plus,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

// Define types for our data models
interface Dentist {
  id: number;
  name: string;
  specialization: string;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Schedule {
  id: number;
  dentistId: number | null;
  date: string;
  startTime: string;
  endTime: string;
  isHoliday: boolean;
  title?: string;
}

interface Appointment {
  id: number;
  patientId: number;
  dentistId: number;
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

// Mock data
const mockDentists: Array<Dentist> = [
  { id: 1, name: "Dr. Sarah Johnson", specialization: "Orthodontist" },
  { id: 2, name: "Dr. Michael Chen", specialization: "Periodontist" },
  { id: 3, name: "Dr. Emily Davis", specialization: "Pediatric Dentist" },
];

const mockPatients: Array<Patient> = [
  {
    id: 1,
    name: "James Wilson",
    phone: "555-123-4567",
    email: "james@example.com",
  },
  {
    id: 2,
    name: "Maria Garcia",
    phone: "555-234-5678",
    email: "maria@example.com",
  },
  {
    id: 3,
    name: "Robert Taylor",
    phone: "555-345-6789",
    email: "robert@example.com",
  },
];

const mockSchedules: Array<Schedule> = [
  {
    id: 1,
    dentistId: 1,
    date: "2025-04-10",
    startTime: "09:00",
    endTime: "12:00",
    isHoliday: false,
  },
  {
    id: 2,
    dentistId: 1,
    date: "2025-04-10",
    startTime: "14:00",
    endTime: "17:00",
    isHoliday: false,
  },
  {
    id: 3,
    dentistId: 2,
    date: "2025-04-11",
    startTime: "10:00",
    endTime: "15:00",
    isHoliday: false,
  },
  {
    id: 4,
    dentistId: 3,
    date: "2025-04-12",
    startTime: "09:00",
    endTime: "18:00",
    isHoliday: false,
  },
  {
    id: 5,
    dentistId: null,
    date: "2025-04-15",
    startTime: "00:00",
    endTime: "23:59",
    isHoliday: true,
    title: "Clinic Holiday",
  },
];

const mockAppointments: Array<Appointment> = [
  {
    id: 1,
    patientId: 1,
    dentistId: 1,
    date: "2025-04-10",
    startTime: "10:00",
    endTime: "11:00",
    service: "Teeth Cleaning",
  },
  {
    id: 2,
    patientId: 2,
    dentistId: 2,
    date: "2025-04-11",
    startTime: "14:00",
    endTime: "15:00",
    service: "Root Canal",
  },
  {
    id: 3,
    patientId: 3,
    dentistId: 1,
    date: "2025-04-10",
    startTime: "15:00",
    endTime: "16:00",
    service: "Filling",
  },
];

export default function DentalAdminDashboard() {
  const [selectedDentist, setSelectedDentist] = useState<string>("all");
  const [schedules, setSchedules] = useState<Array<Schedule>>(mockSchedules);
  const [appointments, setAppointments] =
    useState<Array<Appointment>>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<string>("2025-04-10");
  const [viewMode, setViewMode] = useState<"schedule" | "appointment">(
    "schedule",
  );
  const [holidayDialogOpen, setHolidayDialogOpen] = useState<boolean>(false);
  const [newHoliday, setNewHoliday] = useState<HolidayFormData>({
    date: "",
    title: "",
    startTime: "00:00",
    endTime: "23:59",
  });
  const [editScheduleDialog, setEditScheduleDialog] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Get filtered schedules based on selected dentist and date
  const getFilteredSchedules = (): Array<Schedule> => {
    let filtered = [...schedules];

    if (selectedDentist !== "all") {
      filtered = filtered.filter(
        (schedule) =>
          schedule.dentistId === parseInt(selectedDentist) ||
          (schedule.isHoliday && schedule.dentistId === null),
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((schedule) => schedule.date === selectedDate);
    }

    return filtered;
  };

  // Get filtered appointments based on selected dentist and date
  const getFilteredAppointments = (): Array<Appointment> => {
    let filtered = [...appointments];

    if (selectedDentist !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.dentistId === parseInt(selectedDentist),
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (appointment) => appointment.date === selectedDate,
      );
    }

    return filtered;
  };

  // Add holiday
  const handleAddHoliday = (): void => {
    const holiday: Schedule = {
      id: schedules.length + 1,
      dentistId: null,
      date: newHoliday.date,
      startTime: newHoliday.startTime,
      endTime: newHoliday.endTime,
      isHoliday: true,
      title: newHoliday.title,
    };

    setSchedules([...schedules, holiday]);

    // Check for conflicting appointments
    const conflictingAppointments = appointments.filter(
      (appointment) => appointment.date === newHoliday.date,
    );

    if (conflictingAppointments.length > 0) {
      setAlertMessage(
        `${conflictingAppointments.length} appointments affected by this holiday. These will be automatically canceled.`,
      );
      setTimeout(() => setAlertMessage(""), 5000);
    }

    setHolidayDialogOpen(false);
    setNewHoliday({
      date: "",
      title: "",
      startTime: "00:00",
      endTime: "23:59",
    });
  };

  // Delete schedule
  const handleDeleteSchedule = (id: number): void => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
    setAlertMessage("Schedule deleted successfully");
    setTimeout(() => setAlertMessage(""), 3000);
  };

  // Handle edit schedule
  const openEditSchedule = (schedule: Schedule): void => {
    setCurrentSchedule(schedule);
    setEditScheduleDialog(true);
  };

  // Update schedule
  const handleUpdateSchedule = (): void => {
    if (!currentSchedule) return;

    setSchedules(
      schedules.map((schedule) =>
        schedule.id === currentSchedule.id ? currentSchedule : schedule,
      ),
    );

    setEditScheduleDialog(false);
    setAlertMessage("Schedule updated successfully");
    setTimeout(() => setAlertMessage(""), 3000);
  };

  // Get dentist name by id
  const getDentistName = (id: number): string => {
    const dentist = mockDentists.find((dentist) => dentist.id === id);
    return dentist ? dentist.name : "All Dentists";
  };

  // Get patient name by id
  const getPatientName = (id: number): string => {
    const patient = mockPatients.find((patient) => patient.id === id);
    return patient ? patient.name : "Unknown Patient";
  };

  // Handle current schedule changes
  const handleCurrentScheduleChange = (
    field: keyof Schedule,
    value: string,
  ): void => {
    if (!currentSchedule) return;

    setCurrentSchedule({
      ...currentSchedule,
      [field]: value,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dental Clinic Admin Dashboard</h1>
        <p className="text-gray-500">
          Manage schedules, appointments, and holidays
        </p>
      </header>

      {alertMessage && (
        <Alert className="mb-4">
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

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
              <CardDescription>
                View and manage dentist schedules and appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="w-full md:w-1/3">
                  <Label htmlFor="dentist-select">Select Dentist</Label>
                  <Select
                    value={selectedDentist}
                    onValueChange={setSelectedDentist}
                  >
                    <SelectTrigger id="dentist-select">
                      <SelectValue placeholder="Select a dentist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dentists</SelectItem>
                      {mockDentists.map((dentist) => (
                        <SelectItem
                          key={dentist.id}
                          value={dentist.id.toString()}
                        >
                          {dentist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-1/3">
                  <Label htmlFor="date-select">Select Date</Label>
                  <DatePickerWithPresets />
                  {/* <Input
                    id="date-select"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  /> */}
                </div>

                <div className="w-full md:w-1/3">
                  <Label htmlFor="view-mode">View Mode</Label>
                  <Select
                    value={viewMode}
                    onValueChange={(value: "schedule" | "appointment") =>
                      setViewMode(value)
                    }
                  >
                    <SelectTrigger id="view-mode">
                      <SelectValue placeholder="Select view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schedule">
                        Dentist Schedules
                      </SelectItem>
                      <SelectItem value="appointment">
                        Patient Appointments
                      </SelectItem>
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
                      : getDentistName(parseInt(selectedDentist))}{" "}
                    on {selectedDate}
                  </h3>

                  <div className="space-y-4">
                    {getFilteredSchedules().length > 0 ? (
                      getFilteredSchedules().map((schedule) => (
                        <Card
                          key={schedule.id}
                          className={`${schedule.isHoliday ? "border-red-300 bg-red-50" : ""}`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">
                                {schedule.isHoliday
                                  ? schedule.title
                                  : getDentistName(
                                      schedule.dentistId as number,
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
                                    handleDeleteSchedule(schedule.id)
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
                    Appointments for{" "}
                    {selectedDentist === "all"
                      ? "All Dentists"
                      : getDentistName(parseInt(selectedDentist))}{" "}
                    on {selectedDate}
                  </h3>

                  <div className="space-y-4">
                    {getFilteredAppointments().length > 0 ? (
                      getFilteredAppointments().map((appointment) => (
                        <Card key={appointment.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base">
                                {getPatientName(appointment.patientId)}
                              </CardTitle>
                              <Badge>{appointment.service}</Badge>
                            </div>
                            <CardDescription>
                              With {getDentistName(appointment.dentistId)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No appointments found for the selected criteria.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                View and manage patient information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPatients.map((patient) => (
                  <Card key={patient.id}>
                    <CardHeader>
                      <CardTitle>{patient.name}</CardTitle>
                      <CardDescription>
                        Patient ID: {patient.id}
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
                          <p className="font-medium">Upcoming Appointments</p>
                          {appointments.filter(
                            (a) => a.patientId === patient.id,
                          ).length > 0 ? (
                            appointments
                              .filter((a) => a.patientId === patient.id)
                              .map((a) => (
                                <div key={a.id} className="text-sm">
                                  {a.date} · {a.startTime} - {a.endTime} ·{" "}
                                  {a.service}
                                </div>
                              ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No upcoming appointments
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">View Details</Button>
                        <Button>Book Appointment</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dentists">
          <Card>
            <CardHeader>
              <CardTitle>Dentist Management</CardTitle>
              <CardDescription>
                View and manage dentist information and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDentists.map((dentist) => (
                  <Card key={dentist.id}>
                    <CardHeader>
                      <CardTitle>{dentist.name}</CardTitle>
                      <CardDescription>
                        {dentist.specialization}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="font-medium">{"Today's Schedule"}</p>
                          {schedules
                            .filter(
                              (s) =>
                                s.dentistId === dentist.id &&
                                s.date === selectedDate,
                            )
                            .map((s) => (
                              <div key={s.id} className="text-sm">
                                {s.startTime} - {s.endTime}
                              </div>
                            ))}
                        </div>
                        <div>
                          <p className="font-medium">Upcoming Appointments</p>
                          {appointments
                            .filter((a) => a.dentistId === dentist.id)
                            .map((a) => (
                              <div key={a.id} className="text-sm">
                                {a.date} · {a.startTime} - {a.endTime} ·{" "}
                                {getPatientName(a.patientId)}
                              </div>
                            ))}
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

        <TabsContent value="holidays">
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
                      Add a holiday or off-service period. Any existing
                      appointments during this time will be canceled.
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
                      <DatePickerWithPresets />
                      {/* <Input
                        id="holiday-date"
                        type="date"
                        className="col-span-3"
                        value={newHoliday.date}
                        onChange={(e) =>
                          setNewHoliday({ ...newHoliday, date: e.target.value })
                        }
                      /> */}
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
                    <Button onClick={handleAddHoliday}>Save Holiday</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules
                  .filter((schedule) => schedule.isHoliday)
                  .map((holiday) => (
                    <Card key={holiday.id} className="border-red-300 bg-red-50">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">
                            {holiday.title || "Clinic Holiday"}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteSchedule(holiday.id)}
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
              {"Update the dentist's schedule details."}
            </DialogDescription>
          </DialogHeader>

          {currentSchedule && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <DatePickerWithPresets />
                {/* <Input
                  id="edit-date"
                  type="date"
                  className="col-span-3"
                  value={currentSchedule.date}
                  onChange={(e) =>
                    handleCurrentScheduleChange("date", e.target.value)
                  }
                /> */}
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
            <Button onClick={handleUpdateSchedule}>Update Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
