"use client";

import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { Comment } from "@/types/api/Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "./ui/Button";

interface CommentCardProps {
  comment: Comment;
  refetchComments?: () => void;
}

export default function CommentCard({
  comment,
  refetchComments,
}: CommentCardProps) {
  const { data: session } = useSession();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate: deleteComment } = useMutation({
    mutationFn: async () => {
      if (!session?.user.token) {
        throw new Error("Authentication required");
      }

      return await axios.delete(`/api/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
    },
    onMutate: () => {
      toast.loading(`Deleting comment from user ${comment.user.name}`);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error(`Cannot delete comment from user ${comment.user.name}`);
    },
    onSuccess: () => {
      toast.success(`Comment has been successfully deleted`);
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return (
    <div className="relative m-2 flex w-full flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
      {user?.role == Role_type.ADMIN && (
        <Button
          variant={"ghost"}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={() => deleteComment()}
          aria-label="Delete comment"
        >
          <Trash2 size={18} />
        </Button>
      )}

      <div>
        <div className="text-md font-bold">{`Comment from ${comment.user.name}`}</div>
        <div className="mt-2 text-gray-700">{comment.detail}</div>
      </div>

      <div className="flex items-end justify-between text-sm text-gray-500">
        <div>
          {new Date(comment.createdAt).toLocaleDateString()} at{" "}
          {new Date(comment.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
