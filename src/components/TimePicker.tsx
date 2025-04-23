"use client";

import { ClockIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/ScrollArea";

interface TimePickerProps {
  time?: string;
  onSelect?: (time: string) => void;
  className?: string;
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

export function TimePicker({ time, onSelect, className }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState(time || "09:00");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (time) {
      setSelectedTime(time);
    }
  }, [time]);

  const handleTimeSelect = (newTime: string) => {
    setSelectedTime(newTime);
    setOpen(false);
    if (onSelect) {
      onSelect(newTime);
    }
  };

  // Function to format time for readable display
  const formatTimeDisplay = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);

    // Convert to 12-hour format with AM/PM
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedTime && "text-gray-500",
            className,
          )}
        >
          <ClockIcon className="mr-2 h-4 w-4" />
          {selectedTime ? formatTimeDisplay(selectedTime) : "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <ScrollArea className="h-72 w-full overflow-x-auto" type="always">
          <div className="relative min-w-full space-y-1 p-2 pr-3">
            <div className="px-2 pt-1 pb-2 text-sm font-medium">Time</div>
            {TIME_SLOTS.map((timeSlot) => (
              <Button
                key={timeSlot}
                variant={selectedTime === timeSlot ? "default" : "ghost"}
                className="w-full justify-start font-normal"
                onClick={() => handleTimeSelect(timeSlot)}
              >
                {formatTimeDisplay(timeSlot)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
