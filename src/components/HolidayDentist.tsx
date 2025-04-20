"use client";

import { useState } from "react";
import { Trash2, Clock } from "lucide-react";

export default function CommentDentist() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("full");

  function handleAddDayOff() {
    setShowAddForm(!showAddForm);
  }

  return (
    <div className="w-[800px] rounded-lg shadow-lg bg-white">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-md font-bold">Day off Management 123 131 </div>
            <div className="text-sm text-gray-500">
              Schedule clinic-wide holidays and off-service hours
            </div>
          </div>
          <button
            onClick={handleAddDayOff}
            className="bg-gray-300 hover:bg-gray-400 text-black text-sm font-semibold px-4 py-1 rounded"
          >
            + add day off
          </button>
        </div>

        {showAddForm && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm mb-3 w-full"
            />

            <label className="block text-sm font-medium mb-1">Time Period</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
            >
              <option value="full">Full Day</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>

            <button
      onClick={() => {
        console.log("Selected Date:", selectedDate);
        console.log("Selected Time:", selectedTime);
        
        setShowAddForm(false); 
      }}
      className="bg-gray-300 hover:bg-gray-400 text-black font-semibold text-xs m-2 px-2 py-2 rounded"
    >
      Confirm
    </button>
          </div>
        )}

        {/* Card 1 */}
        <div className="relative w-full h-[200px] rounded-lg shadow-lg bg-white p-5 m-2 flex flex-col justify-between">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>

          <div>
            <div className="text-md font-bold">I want to play game</div>
            <div className="text-xs text-gray-500">2025-04-15</div>
          </div>

          <div className="flex justify-between items-end text-xs font-bold">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-600" />
              Full day
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative w-full h-[200px] rounded-lg shadow-lg bg-white p-5 m-2 flex flex-col justify-between">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>

          <div>
            <div className="text-md font-bold">I am sick</div>
            <div className="text-xs text-gray-500">2025-04-20</div>
          </div>

          <div className="flex justify-between items-end text-xs font-bold">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-600" />
              Full day
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
