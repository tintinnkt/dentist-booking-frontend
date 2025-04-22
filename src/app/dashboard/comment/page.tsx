"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [selectedDate, setSelectedDate] = useState("");
  const [show, setShow] = useState(false);

  function handleSearch() {
    setShow(true);
  }

  return (
    <div className="w-full rounded-lg bg-white shadow-lg">
      <div className="p-5">
        <div className="text-md font-bold">Comment Management</div>
        <div className="text-sm text-gray-500">view and manage comment</div>

        <div className="relative m-2 flex h-[200px] w-full flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>

          <div>
            <div className="text-md font-bold">comment from user 1</div>
            <div>{"You are the worst dentist I have ever met."}</div>
          </div>

          <div className="flex items-end justify-between text-sm text-gray-500">
            <div>to Dr.dentist</div>
            <div>13 Apr 2025</div>
          </div>
        </div>

        <div className="relative m-2 flex h-[200px] w-full flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>

          <div>
            <div className="text-md font-bold">comment from user 2</div>
            <div>{"Stupid shit."}</div>
          </div>

          <div className="flex items-end justify-between text-sm text-gray-500">
            <div>to Dr.dentist</div>
            <div>13 Apr 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}
