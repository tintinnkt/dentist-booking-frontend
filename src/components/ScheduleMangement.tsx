"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface Schedule {
  id: number;
  dentistName: string;
  date: string;
  time: string;
  type: string;
}

const mockSchedules: Schedule[] = [
  { id: 1, dentistName: "Dr. dentist", date: "2025-04-18", time: "09:00 - 12:00", type: "Working Hours" },
  { id: 2, dentistName: "Dr. dentist", date: "2025-04-19", time: "14:00 - 17:00", type: "Working Hours" },
];

export default function ScheduleManagement() {
  const [selectedDentist, setSelectedDentist] = useState("Dr. dentist");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [viewMode, setViewMode] = useState("Dental schedules");

  const filteredSchedules = mockSchedules.filter(
    (schedule) =>
      schedule.dentistName === selectedDentist &&
      (!selectedDate || schedule.date === selectedDate.toISOString().split("T")[0])
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Schedule Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        view and manage dentist schedules and appointments
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Select Dentist</label>
          <Select value={selectedDentist} onValueChange={setSelectedDentist}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Dentist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. dentist">Dr. dentist</SelectItem>
              <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <DatePickerWithPresets value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">View mode</label>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dental schedules">Dental schedules</SelectItem>
              <SelectItem value="Appointments">Appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <button className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded">
            search
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="font-semibold text-base mb-4">
        schedules for {selectedDentist} on {selectedDate ? selectedDate.toISOString().split("T")[0] : "selected date"}
      </div>

      {/* Schedule Cards */}
      {filteredSchedules.length > 0 ? (
        filteredSchedules.map((schedule) => (
          <Card key={schedule.id} className="mb-4">
            <CardContent className="p-4 space-y-2">
              <div className="font-bold">{schedule.dentistName}</div>
              <div className="text-sm text-gray-600">{schedule.date} {schedule.time}</div>
              <div className="flex items-center text-sm mt-2">
                <span className="mr-2">🕑</span>
                <span>{schedule.type}</span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-sm text-gray-400">No schedules found for selected criteria.</div>
      )}
    </div>
  );
}
