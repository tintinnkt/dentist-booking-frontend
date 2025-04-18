"use client";

import { useState } from "react";

export default function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState("");
  const [show, setShow] = useState(false);

  function handleSearch() {
    setShow(true);
  }

  return (
    <div className="w-[800px] h-[500px] rounded-lg shadow-lg bg-white">
      <div className="p-5">
        <div className="text-lg font-bold">Schedule Management</div>
        <div className="text-sm text-gray-500">
          view and manage dentist schedules and appointments
        </div>
        <div className="text-sm font-bold py-3">Select Date</div>

        <div className="flex gap-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-4 py-1 rounded"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        
        {show && (
          <div className="mt-4 text-sm text-black font-bold">
            Schedule for Dr.dentist on {selectedDate || "this day"}
          </div>
        )}
      </div>
    </div>
  );
}
