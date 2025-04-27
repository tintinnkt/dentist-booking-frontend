import axios from "axios";

export default async function addComment(comment: string, userID: string, dentID: string , token : string) {
    try {
  
      const response = await axios.post(
        `https://project-s-backend-cyan.vercel.app/api/v1/dentists/${dentID}/comments`,
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
        }
      );
  
      return response.data;
  
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw new Error("Failed to add comment");
    }
  }
  