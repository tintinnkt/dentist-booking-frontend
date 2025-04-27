import { BackendRoutes } from "@/config/apiRoutes";
import { Comment } from "@/types/api/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface CommentResponse {
  data: Array<Comment>;
  count: number;
}

export function useComments(dentistId: string) {
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token;

  // Internal API functions (axios only)
  const getCommentByDentID = async (dentID: string, token: string) => {
    try {
      const response = await axios.get(`${BackendRoutes.COMMENTS}/dentist/`, {
        params: { dentistId: dentID },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      throw new Error("Failed to fetch comments");
    }
  };

  const addCommentApi = async (
    comment: string,
    userID: string,
    dentID: string,
    token: string,
  ) => {
    try {
      const response = await axios.post(
        `${BackendRoutes.DENTIST}/${dentID}/comments`,
        {
          user: userID,
          dentist: dentID,
          comment: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw new Error("Failed to add comment");
    }
  };

  const deleteCommentApi = async (commentID: string, token: string) => {
    try {
      const response = await axios.delete(
        `${BackendRoutes.COMMENTS}/${commentID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete comment:", error);
      throw new Error("Failed to delete comment");
    }
  };

  // Fetch comments query
  const {
    data: commentData,
    isLoading: isLoadingComments,
    isError: isErrorComments,
    refetch: refetchComments,
  } = useQuery<CommentResponse>({
    queryKey: ["comments", dentistId],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return await getCommentByDentID(dentistId, token);
    },
    enabled: !!token,
  });

  // Add comment mutation
  const { mutate: addComment, isPending: isAddingCommentPending } = useMutation(
    {
      mutationFn: async ({
        comment,
        userId,
      }: {
        comment: string;
        userId: string;
      }) => {
        if (!token) {
          throw new Error("No authentication token available");
        }
        return await addCommentApi(comment, userId, dentistId, token);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", dentistId] });
        toast.success("Comment added successfully!");
        setNewComment("");
        setIsAddingComment(false);
      },
      onError: (error) => {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment. Please try again.");
      },
    },
  );

  // Delete comment mutation
  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId: string) => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return await deleteCommentApi(commentId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", dentistId] });
      toast.success("Comment deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again.");
    },
  });

  // Handler for adding a comment
  const handleAddComment = (userId: string) => {
    if (!token) {
      toast.error("You must be logged in to add a comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please write something before sending.");
      return;
    }

    addComment({ comment: newComment, userId });
  };

  // Handler for deleting a comment
  const handleDeleteComment = (commentId: string) => {
    if (!token) {
      toast.error("You must be logged in to delete a comment");
      return;
    }

    deleteComment(commentId);
  };

  return {
    commentData,
    isLoadingComments,
    isErrorComments,
    isAddingComment,
    setIsAddingComment,
    newComment,
    setNewComment,
    handleAddComment,
    handleDeleteComment,
    isAddingCommentPending,
    isDeletingComment,
    refetchComments,
  };
}
