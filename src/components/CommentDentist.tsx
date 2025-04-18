"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react"; 

export default function CommentDentist() {
  const [selectedDate, setSelectedDate] = useState("");
  const [show, setShow] = useState(false);

  function handleSearch() {
    setShow(true);
  }

  return (
    <div className="w-[800px] rounded-lg shadow-lg bg-white">
      <div className="p-5">
        <div className="text-md font-bold">Comment Management</div>
        <div className="text-sm text-gray-500">
          view and manage comment
        </div>

      <div className="relative w-full h-[200px] rounded-lg shadow-lg bg-white p-5 m-2 flex flex-col justify-between">
      <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
        <Trash2 size={18} />
      </button>

      <div>
        <div className="text-md font-bold">comment from user 1</div>
        <div>"You are the worst dentist I have ever met."</div>
      </div>

      
      <div className="flex justify-between items-end text-sm text-gray-500">
        <div>to Dr.dentist</div>
        <div>13 Apr 2025</div>
      </div>
    </div>

    <div className="relative w-full h-[200px] rounded-lg shadow-lg bg-white p-5 m-2 flex flex-col justify-between">
      <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
        <Trash2 size={18} />
      </button>

      <div>
        <div className="text-md font-bold">comment from user 2</div>
        <div>"Stupid shit."</div>
      </div>

      
      <div className="flex justify-between items-end text-sm text-gray-500">
        <div>to Dr.dentist</div>
        <div>13 Apr 2025</div>
      </div>
    </div>
        </div>
        </div>
  );
}
