"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface OffHour {
  _id: string;
  owner: {
    _id: string;
    name?: string;
  };
  startDate: string;
  endDate: string;
  description: string;
  isForAllDentist: boolean;
  createdAt: string;
}

export default function OffHoursManagement() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: session } = useSession(); // Move useSession to component level
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  // Define fetchOffHours using the session from component scope
  const fetchOffHours = async (): Promise<OffHour[]> => {
    if (!session?.user.token) return [];
    const response = await axios.get(BackendRoutes.OFF_HOURS, {
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error("Failed to fetch holiday data");
  };
  const {
    data: offHours = [],
    isLoading,
    isError,
    error: queryError,
  } = useQuery<OffHour[], Error>({
    queryKey: ["offHours"],
    queryFn: fetchOffHours,
    enabled: !!user && !!session?.user.token, // Only fetch when user and token are available
    select: (data) => {
      if (user?.role === Role_type.ADMIN) {
        return data;
      }
      return data.filter(
        (offHour) => offHour.owner._id === user?._id || offHour.isForAllDentist
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user.token) throw new Error("Authentication required");
      await axios.delete(`${BackendRoutes.OFF_HOURS}/${id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offHours"] });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newOffHour: Omit<OffHour, "_id" | "createdAt">) => {
      if (!session?.user.token) throw new Error("Authentication required");
      const response = await axios.post(
        BackendRoutes.OFF_HOURS,
        newOffHour,
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offHours"] });
      setShowModal(false);
      setError("");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please <Link href="/login" className="text-blue-500 underline">login</Link> to view off hours
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 pt-10">
        <LoaderIcon /> Loading off hours...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        <XCircleIcon /> Error: {queryError.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-[90%]">
      {/* Header and controls */}
      <div className="font-bold text-lg mb-2">Off Hours Management</div>
      <div className="text-gray-400 mb-4 text-sm">
        {user.role === Role_type.ADMIN
          ? "Manage clinic-wide and personal off-hours"
          : "Manage your personal unavailable periods"}
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          + Add Off Hours
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-lg">
          <XCircleIcon className="inline mr-2" />
          {error}
        </div>
      )}

      {/* Off Hours list */}
      {offHours.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No off hours periods scheduled yet
        </div>
      ) : (
        offHours.map((offHour) => (
          <Card key={offHour._id} className="mb-4">
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <div className="font-bold">{offHour.description}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(offHour.startDate)} - {formatDate(offHour.endDate)}
                </div>
                <div className="flex items-center text-sm mt-2">
                  <span className="mr-2">🕑</span>
                  <span>
                    {formatTime(offHour.startDate)} - {formatTime(offHour.endDate)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {offHour.isForAllDentist
                    ? "Applies to all dentists"
                    : `Personal (${offHour.owner.name || "you"})`}
                </div>
              </div>
              {(user._id === offHour.owner._id || user.role === Role_type.ADMIN) && (
                <button
                  onClick={() => deleteMutation.mutate(offHour._id)}
                  className="text-gray-500 hover:text-red-500"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <LoaderIcon className="animate-spin" size={20} />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Add Off Hours Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">
            <div className="text-xl font-bold mb-1">Schedule Off Hours</div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                createMutation.mutate({
                  owner: user._id,
                  startDate: (form.startDate as HTMLInputElement).value,
                  endDate: (form.endDate as HTMLInputElement).value,
                  description: (form.description as HTMLInputElement).value,
                  isForAllDentist: user.role === Role_type.ADMIN
                    ? (form.isForAllDentist as HTMLInputElement)?.checked
                    : false,
                });
              }}
              className="space-y-4"
            >
              {/* Form fields */}
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Description*
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="text-sm font-semibold block mb-1">
                    Start Date & Time*
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-semibold block mb-1">
                    End Date & Time*
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {user.role === Role_type.ADMIN && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isForAllDentist"
                    id="isForAllDentist"
                    className="w-4 h-4"
                  />
                  <label htmlFor="isForAllDentist" className="text-sm font-medium">
                    Apply to all dentists
                  </label>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="submit"
                  className="bg-gray-200 text-black px-4 py-2 rounded font-semibold hover:bg-gray-300 text-sm"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <LoaderIcon className="animate-spin inline mr-2" size={16} />
                  ) : null}
                  Save Off Hours
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
