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
    _id: "mock122",
    user: {
      _id: "0011",
      name: "Ann Ji",
    },
    dentist: "001",
    detail: "You are the worst",
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
    <div className="w-full">
      <div className="pb-1 text-lg font-bold">Comment Management</div>
      <div className="pb-4 text-sm text-gray-500">view and manage comment</div>
      {comments.map((comment) => (
        <CommentCard comment={comment} key={comment._id} />
      ))}
    </div>
  );
}
