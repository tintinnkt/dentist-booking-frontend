"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface Holiday {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  fullDay: boolean;
}

const initialHolidays: Holiday[] = [
  {
    id: 1,
    name: "Clinic Holiday",
    date: "2025-04-15",
    startTime: "00:00",
    endTime: "23:59",
    fullDay: true,
  },
  {
    id: 2,
    name: "Songkran Holiday",
    date: "2025-04-15",
    startTime: "00:00",
    endTime: "23:59",
    fullDay: true,
  },
];

export default function HolidayManagement() {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id: number) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const handleAddHoliday = (
    name: string,
    date: string,
    startTime: string,
    endTime: string,
    fullDay: boolean
  ) => {
    const newHoliday: Holiday = {
      id: holidays.length + 1,
      name,
      date,
      startTime,
      endTime,
      fullDay,
    };
    setHolidays([...holidays, newHoliday]);
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Holiday Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        Schedule clinic-wide holidays and off-service hours
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          + add holiday
        </Button>
      </div>

      {holidays.map((holiday) => (
        <Card key={holiday.id} className="mb-4">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <div className="font-bold">{holiday.name}</div>
              <div className="text-sm text-gray-600">{holiday.date}</div>
              <div className="flex items-center text-sm mt-2">
                <span className="mr-2">🕑</span>
                <span>
                  {holiday.fullDay
                    ? "Full day"
                    : `${holiday.startTime} - ${holiday.endTime}`}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(holiday.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 size={20} />
            </button>
          </CardContent>
        </Card>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">
            <div className="text-xl font-bold mb-1">schedule a Holiday</div>
            <div className="text-sm text-gray-500 mb-6">
              Add a holiday or off-service period. Any existing appointments during this time will be canceled.
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const name = form.name.value;
                const date = form.date.value;
                const fullDay = form.fullDay.checked;
                const startTime = fullDay ? "00:00" : form.startTime.value;
                const endTime = fullDay ? "23:59" : form.endTime.value;

                if (name && date) {
                  handleAddHoliday(name, date, startTime, endTime, fullDay);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Songkran"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="text-sm font-semibold block mb-1">
                    Start time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue="00:00"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-semibold block mb-1">
                    End time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue="23:59"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="fullDay"
                  id="fullDay"
                  defaultChecked
                  className="w-4 h-4"
                  onChange={(e) => {
                    const form = e.target.form as any;
                    const disabled = e.target.checked;
                    form.startTime.disabled = disabled;
                    form.endTime.disabled = disabled;
                  }}
                />
                <label htmlFor="fullDay" className="text-sm font-medium">
                  All day holiday
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="submit"
                  className="bg-gray-200 text-black px-4 py-2 rounded font-semibold hover:bg-gray-300 text-sm"
                >
                  save holiday
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 text-sm"
                >
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
