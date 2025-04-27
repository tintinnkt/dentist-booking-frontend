import { BackendRoutes } from "@/config/apiRoutes";
import { OffHour } from "@/types/api/OffHour";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { isSameDay, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OffHoursResponse {
  data: Array<OffHour>;
}

export function useOffHours(appDate: Date | null | undefined, dentistId: string) {
  const [filteredOffhours, setFilteredOffhours] = useState<OffHour[]>([]);
  const { data: session } = useSession();
  const token = session?.user?.token;

  // Get Offhours
  const getOffHours = async (): Promise<OffHoursResponse> => {
    try {
      const response = await axios.get(BackendRoutes.OFF_HOURS, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      throw new Error("Failed to fetch comments");
    }
  };

  // Fetch offHours query
  const { 
    data: offHoursData,
    isLoading: isLoadingOffHours,
    isError: isErrorOffHours,
    error: offHoursError,
    refetch: refetchOffHours,
  } = useQuery<OffHoursResponse>({
    queryKey: ["offhours"],
    queryFn: getOffHours,
    enabled: !!token,
  });

  useEffect(() => {
    if (isErrorOffHours && offHoursError  instanceof Error) {
      console.error("useQuery error:", offHoursError.message);
      toast.error(offHoursError.message || "Failed to fetch offhours!");
    }
  }, [isErrorOffHours, offHoursError]);

  useEffect(() => {
    if (!appDate || !offHoursData) return;

    const allOffhours = offHoursData.data;

    const dentistOffhours = allOffhours.filter(
      (offhour) => 
        offhour.owner._id === dentistId ||
        offhour.isForAllDentist === true
    );

    const matchedOffhours = dentistOffhours.filter((offhour: OffHour) => {
      const start = parseISO(offhour.startDate);
      return isSameDay(start, appDate);
    });

    setFilteredOffhours(matchedOffhours);
  }, [appDate, dentistId, offHoursData]);

  return {
    offHoursData,
    filteredOffhours,
    isLoadingOffHours,
    isErrorOffHours,
    refetchOffHours,
  };
}
