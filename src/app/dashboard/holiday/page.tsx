"use client";

import { TimePicker } from "@/components/TimePicker";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { OffHour } from "@/types/api/OffHour";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { set } from "date-fns";
import { Clock10Icon, LoaderIcon, Trash2, XCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    isForAllDentist: false,
  });

  // State for date and time pickers
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const fetchOffHours = async (): Promise<Array<OffHour>> => {
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
    data: offHours,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Array<OffHour>, Error>({
    queryKey: ["offHours"],
    queryFn: fetchOffHours,
    enabled: !!user,
    select: (data) => {
      if (user?.role === Role_type.ADMIN) {
        return data;
      }
      return data.filter(
        (offHour) => offHour.owner._id === user?._id || offHour.isForAllDentist,
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user.token) throw new Error("Authentication required");
      await axios.delete(`${BackendRoutes.OFF_HOURS}/${id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
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
      const response = await axios.post(BackendRoutes.OFF_HOURS, newOffHour, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offHours"] });
      setShowModal(false);
      resetForm();
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.message;
      setError(errorMessage);
    },
  });

  // Reset form function
  const resetForm = () => {
    setFormData({
      description: "",
      isForAllDentist: false,
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("09:00");
    setEndTime("17:00");
    setError("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    setError("");

    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }

    if (!startDate) {
      setError("Start date is required");
      return false;
    }

    if (!endDate) {
      setError("End date is required");
      return false;
    }

    // Validate that end date is after start date
    if (startDate > endDate) {
      setError("End date must be after start date");
      return false;
    }

    // If dates are the same, check if end time is after start time
    if (startDate.toDateString() === endDate.toDateString()) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      if (
        startHour > endHour ||
        (startHour === endHour && startMinute >= endMinute)
      ) {
        setError("End time must be after start time when on the same day");
        return false;
      }
    }

    // Validate start date is in the future
    const current = new Date();
    if (startDate < current) {
      setError("Start date must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !startDate || !endDate) {
      return;
    }

    // Create complete date-time objects by combining dates with times
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const completeStartDate = set(new Date(startDate), {
      hours: startHours,
      minutes: startMinutes,
      seconds: 0,
      milliseconds: 0,
    });

    const completeEndDate = set(new Date(endDate), {
      hours: endHours,
      minutes: endMinutes,
      seconds: 0,
      milliseconds: 0,
    });

    createMutation.mutate({
      owner: user?._id || "",
      startDate: completeStartDate.toISOString(),
      endDate: completeEndDate.toISOString(),
      description: formData.description,
      isForAllDentist:
        user?.role === Role_type.ADMIN ? formData.isForAllDentist : false,
    });
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please{" "}
        <Link href="/login" className="text-blue-500 underline">
          login
        </Link>{" "}
        to view off hours
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 pt-10">
        <LoaderIcon className="animate-spin" /> Loading off hours...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500">
        <XCircleIcon className="mr-2 inline" /> Error: {queryError.message}
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white p-8 shadow-md">
      {/* Header and controls */}
      <div className="mb-2 text-lg font-bold">Off Hours Management</div>
      <div className="mb-4 text-sm text-gray-400">
        {user.role === Role_type.ADMIN
          ? "Manage clinic-wide and personal off-hours"
          : "Manage your personal unavailable periods"}
      </div>

      <div className="mb-4 flex justify-end">
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          + Add Off Hours
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 flex items-center rounded-lg bg-red-50 p-4 text-red-500">
          <XCircleIcon className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Off Hours list */}
      {!offHours || offHours.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No off hours periods scheduled yet
        </div>
      ) : (
        offHours.map((offHour) => (
          <Card key={offHour._id} className="mb-4">
            <CardHeader>
              <CardTitle className="text-2xl">{offHour.description}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">
                  {formatDate(offHour.startDate)} -{" "}
                  {formatDate(offHour.endDate)}
                </div>
                <div className="mt-2 flex items-center space-x-1.5 text-sm">
                  <Clock10Icon size={16} />
                  <span>
                    {formatTime(offHour.startDate)} -{" "}
                    {formatTime(offHour.endDate)}
                  </span>
                </div>
              </div>
              {(user._id === offHour.owner._id ||
                user.role === Role_type.ADMIN) && (
                <Button
                  variant="ghost"
                  onClick={() => deleteMutation.mutate(offHour._id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <LoaderIcon className="animate-spin" size={20} />
                  ) : (
                    <Trash2 size={20} className="text-red-900" />
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}

      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle>Schedule Off Hours</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Vacation, Conference, Personal day, etc."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Start Date
                </label>
                <DatePickerWithPresets
                  date={startDate}
                  onSelect={setStartDate}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Start Time
                </label>
                <TimePicker time={startTime} onSelect={setStartTime} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold">End Date</label>
                <DatePickerWithPresets date={endDate} onSelect={setEndDate} />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">End Time</label>
                <TimePicker time={endTime} onSelect={setEndTime} />
              </div>
            </div>

            {user.role === Role_type.ADMIN && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isForAllDentist"
                  id="isForAllDentist"
                  checked={formData.isForAllDentist}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="isForAllDentist"
                  className="text-sm font-medium"
                >
                  Apply to all dentists
                </label>
              </div>
            )}

            <DialogFooter className="flex justify-between pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {createMutation.isPending ? (
                  <>
                    <LoaderIcon
                      className="mr-2 inline animate-spin"
                      size={16}
                    />
                    Saving...
                  </>
                ) : (
                  "Save Off Hours"
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="secondary" type="button" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
