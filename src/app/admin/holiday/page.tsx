"use client";

import HolidayManagement from "@/components/HolidayManagement";
import { FrontendRootRoutes } from "@/config/apiRoutes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PatientDashboard() {
  const router = useRouter();

  const ScheduleClick = () => {
    router.push(FrontendRootRoutes.ADMIN);
  };

  const PatientClick = () => {
    router.push(`${FrontendRootRoutes.ADMIN}/patient`);
  };

  const DentistClick = () => {
    router.push(`${FrontendRootRoutes.ADMIN}/dentist`);
  };

  const HolidayClick = () => {
    router.push(`${FrontendRootRoutes.ADMIN}/holiday`);
  };

  // Dummy state for selected patient and date
  const [selectedPatient, setSelectedPatient] = useState("Jame Wilson");
  const [selectedDate, setSelectedDate] = useState("2025-04-23");

  return (
    <main>
      <div className="m-3 flex justify-center text-3xl font-bold">
        Dental Clinic Admin Dashboard
      </div>
      <div className="text-md m-5 flex justify-center">
        View and manage dentist information and schedules.
      </div>

      <div className="mb-6 flex gap-2 px-10">
        {/* <button
          className="rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={ScheduleClick}
        >
          Schedules
        </button> */}

        <button
          className="rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={PatientClick}
        >
          Patients
        </button>

        <button
          className="rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={DentistClick}
        >
          Dentists
        </button>

        <button
          className="rounded bg-white px-4 py-1 text-sm font-semibold text-black"
          onClick={HolidayClick}
        >
          Holidays
        </button>
      </div>
      {/* navbar buttons */}
      <div className="flex justify-center">
        <HolidayManagement />
      </div>
    </main>
  );
}
