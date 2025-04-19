"use client";

import { useState } from "react";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { Card, CardContent } from "@/components/ui/Card";

interface Appointment {
  date: string; // Format: YYYY-MM-DD
  time: string;
  type: string;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  appointments: Appointment[];
}

const fakePatients: Patient[] = [
  {
    id: 1,
    name: "Jame Wilson",
    phone: "555-123-1452",
    email: "jame@example.com",
    appointments: [
      { date: "2025-04-10", time: "10:00 - 11:10", type: "Teeth Cleaning" },
      { date: "2025-04-15", time: "09:00 - 09:45", type: "Checkup" },
    ],
  },
  {
    id: 2,
    name: "Alex Smith",
    phone: "555-987-6543",
    email: "alex@example.com",
    appointments: [
      { date: "2025-04-11", time: "14:00 - 15:00", type: "Filling" },
    ],
  },
];

export default function PatientManagement() {
  const [selectedPatientName, setSelectedPatientName] = useState("Jame Wilson");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filteredPatient, setFilteredPatient] = useState<Patient | null>(null);

  const handleSearch = () => {
    const patient = fakePatients.find((p) => p.name === selectedPatientName);
    if (!patient) {
      setFilteredPatient(null);
      return;
    }

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const filteredAppointments = patient.appointments.filter(
        (a) => a.date === dateStr
      );
      setFilteredPatient({
        ...patient,
        appointments: filteredAppointments,
      });
    } else {
      setFilteredPatient(patient);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Patient Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        View and manage patient information and appointments.
      </div>

      {/* Search Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Search Patient</label>
          <select
            value={selectedPatientName}
            onChange={(e) => setSelectedPatientName(e.target.value)}
            className="border p-1 rounded text-sm w-48"
          >
            {fakePatients.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Date</label>
          <DatePickerWithPresets value={selectedDate} onChange={setSelectedDate} />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="bg-orange-400 hover:bg-white text-black text-sm font-semibold px-4 py-1 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Patient Info Card */}
      {filteredPatient && (
        <Card>
          <CardContent className="p-4">
            <div className="font-bold text-lg mb-2">{filteredPatient.name}</div>
            <div className="text-sm text-gray-400 mb-3">
              Patient ID: {filteredPatient.id}
            </div>

            <div className="text-sm mb-3">
              <div className="font-bold text-sm mb-1">Contact Information</div>
              <div>Phone: {filteredPatient.phone}</div>
              <div>Email: {filteredPatient.email}</div>
            </div>

            <div className="text-sm">
              <div className="font-bold text-sm mb-1">Upcoming Appointments</div>
              {filteredPatient.appointments.length > 0 ? (
                filteredPatient.appointments.map((appt, index) => (
                  <div key={index} className="text-gray-600">
                    {appt.date} - {appt.time} - {appt.type}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No appointments for selected date</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
