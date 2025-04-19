"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface Appointment {
  date: string;
  timeRange: string;
  patientName: string;
}

interface Comment {
  id: number;
  title: string;
  content: string;
  dateTime: string;
}

interface Dentist {
  id: number;
  name: string;
  specialty: string;
  todaySchedule: string[];
  upcomingAppointments: Appointment[];
  comments: Comment[];
}

const fakeDentists: Dentist[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Orthodontist",
    todaySchedule: ["09:00 - 12:00", "14:00 - 17:00"],
    upcomingAppointments: [
      { date: "2025-04-10", timeRange: "10:00 - 11:10", patientName: "James Wilson" },
      { date: "2025-04-10", timeRange: "15:00 - 16:00", patientName: "Robert Tayler" },
    ],
    comments: [
      {
        id: 1,
        title: "comment from user1",
        content: "Had a great experience with Dr. Sarah Johnson!",
        dateTime: "9:00 2025/04/02",
      },
      {
        id: 2,
        title: "comment from user2",
        content: "Super professional and kind.",
        dateTime: "10:00 2025/04/02",
      },
      {
        id: 3,
        title: "comment from user3",
        content: "Would definitely recommend!",
        dateTime: "12:00 2025/04/02",
      },
    ],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Periodontist",
    todaySchedule: ["09:00 - 12:00"],
    upcomingAppointments: [
      { date: "2025-04-10", timeRange: "09:00 - 12:00", patientName: "Tatie Hash" },
    ],
    comments: [],
  },
];

export default function DentistManagement() {
  const [selectedDentistId, setSelectedDentistId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCardClick = (id: number) => {
    setSelectedDentistId(id === selectedDentistId ? null : id);
  };

  const handleDeleteComment = (dentistId: number, commentId: number) => {
    const updatedDentists = fakeDentists.map((d) => {
      if (d.id === dentistId) {
        return {
          ...d,
          comments: d.comments.filter((c) => c.id !== commentId),
        };
      }
      return d;
    });

    // Simulate update
    setSelectedDentistId(null);
    setTimeout(() => setSelectedDentistId(dentistId), 0);
  };

  const filteredDentists = fakeDentists.filter((dentist) =>
    `${dentist.name} ${dentist.specialty}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      <div className="font-bold text-lg mb-2">Dentist Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        View and manage dentist information, schedules, and comments
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search dentist by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Dentist Cards */}
      {filteredDentists.length === 0 ? (
        <div className="text-gray-500 text-sm italic">No dentists found.</div>
      ) : (
        filteredDentists.map((dentist) => (
          <div key={dentist.id}>
            <Card
              className={`mb-4 cursor-pointer hover:shadow-lg ${
                selectedDentistId === dentist.id ? "border-2 border-orange-400" : ""
              }`}
              onClick={() => handleCardClick(dentist.id)}
            >
              <CardContent className="flex justify-between p-4">
                <div>
                  <div className="font-bold">{dentist.name}</div>
                  <div className="text-sm text-gray-400">{dentist.specialty}</div>

                  <div className="mt-3 font-bold text-sm">Today's Schedule</div>
                  <div className="text-sm">
                    {dentist.todaySchedule.map((time, idx) => (
                      <div key={idx}>{time}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sm">Upcoming Appointments</div>
                  <div className="text-sm">
                    {dentist.upcomingAppointments.map((appointment, idx) => (
                      <div key={idx}>
                        {appointment.date} - {appointment.timeRange} - {appointment.patientName}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            {selectedDentistId === dentist.id && (
              <div className="bg-white rounded-xl shadow-md p-6 mt-2 mb-6">
                <div className="font-bold mb-3">{dentist.name} comments</div>
                {dentist.comments.length === 0 ? (
                  <div className="text-gray-500 text-sm italic">No comments available</div>
                ) : (
                  dentist.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border rounded-xl p-4 mb-3 shadow-sm bg-white flex justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm">{comment.title}</div>
                        <div className="text-sm mt-1">{comment.content}</div>
                        <div className="text-sm text-black font-bold mt-2">
                          to {dentist.name}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleDeleteComment(dentist.id, comment.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="text-xs text-gray-400 mt-2">{comment.dateTime}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
