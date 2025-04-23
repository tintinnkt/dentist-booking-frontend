"use client";

import CommentCard from "@/components/CommentCard";
import { Comment } from "@/types/api/Comment";
import { useState } from "react";
const mockComments: Array<Comment> = [
  {
    _id: "mock123",
    user: {
      _id: "0012",
      name: "Peter",
    },
    dentist: "001",
    detail: "You are awesome",
    createdAt: new Date(),
  },
  {
    _id: "mock123",
    user: {
      _id: "0012",
      name: "Peter",
    },
    dentist: "001",
    detail: "You are awesome",
    createdAt: new Date(),
  },
];

export default function Page() {
  const [selectedDate, setSelectedDate] = useState("");
  const [show, setShow] = useState(false);
  const comments = mockComments;
  function handleSearch() {
    setShow(true);
  }

  return (
    <div className="w-full rounded-lg bg-white shadow-lg">
      <div className="p-5">
        <div className="text-md font-bold">Comment Management</div>
        <div className="text-sm text-gray-500">view and manage comment</div>
        {comments.map((comment, index) => (
          <CommentCard comment={comment} key={index} />
        ))}
      </div>
    </div>
  );
}
