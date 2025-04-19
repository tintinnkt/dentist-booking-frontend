"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Trash2, LoaderIcon, XCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BackendRoutes } from "@/config/apiRoutes";

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
  yearsOfExperience: number;
  areaOfExpertise: string[];
}

// API call to fetch dentists data
const fetchDentists = async (): Promise<Array<Dentist>> => {
  const response = await axios.get(BackendRoutes.DENTIST);
  if (Array.isArray(response.data.data)) {
    return response.data.data;
  }
  throw new Error("Failed to fetch dentists data");
};

// API call to delete a comment
const deleteComment = async (dentistId: number, commentId: number): Promise<void> => {
  await axios.delete(`${BackendRoutes.DENTIST}/${dentistId}/comments/${commentId}`);
};

export default function DentistManagement() {
  const [selectedDentistId, setSelectedDentistId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    data: dentists = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["dentists"],
    queryFn: fetchDentists,
  });

  const handleCardClick = (id: number) => {
    setSelectedDentistId(id === selectedDentistId ? null : id);
  };

  const handleDeleteComment = async (dentistId: number, commentId: number) => {
    try {
      await deleteComment(dentistId, commentId);
      refetch();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const filteredDentists = dentists.filter((dentist) =>
    `${dentist.name} ${dentist.specialty}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
        <p className="text-red-500 flex items-center gap-2">
          <XCircleIcon size={18} /> Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
        <p className="flex items-center justify-center gap-3 pt-4">
          <LoaderIcon className="animate-spin" size={18} /> Loading dentists data...
        </p>
      </div>
    );
  }

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
                  <div className="text-xs text-gray-500 mt-1">
                    {dentist.yearsOfExperience} years of experience
                  </div>
                  <div className="text-xs text-gray-500">
                    {dentist.areaOfExpertise?.join(", ")}
                  </div>

                  <div className="mt-3 font-bold text-sm">Today's Schedule</div>
                  <div className="text-sm">
                    {dentist.todaySchedule?.map((time, idx) => (
                      <div key={idx}>{time}</div>
                    )) || "No schedule for today"}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sm">Upcoming Appointments</div>
                  <div className="text-sm">
                    {dentist.upcomingAppointments?.length > 0 ? (
                      dentist.upcomingAppointments.map((appointment, idx) => (
                        <div key={idx}>
                          {appointment.date} - {appointment.timeRange} - {appointment.patientName}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm italic">No upcoming appointments</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            {selectedDentistId === dentist.id && (
              <div className="bg-white rounded-xl shadow-md p-6 mt-2 mb-6">
                <div className="font-bold mb-3">{dentist.name} comments</div>
                {dentist.comments?.length === 0 || !dentist.comments ? (
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