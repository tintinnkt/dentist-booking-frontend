"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { BackendRoutes } from "@/config/apiRoutes";
import { MdEdit, MdDelete } from "react-icons/md"
import { Comment } from "@/types/api/Comment";
import { expertiseOptions, timeSlots } from "@/constant/expertise";
import { useBooking } from "@/hooks/useBooking";
import { DentistProps } from "@/types/api/Dentist";
import { User } from "@/types/User";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { Check, MessageCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { twJoin } from "tailwind-merge";
import { ButtonConfigKeys, CustomButton } from "./CustomButton";
import addComment from "@/lib/addComment";
import getCommentByDentID from "@/lib/getCommentByDentID";
import deleteComment from "@/lib/deleteComment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Calendar } from "./ui/Calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { Input } from "./ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Separator } from "./ui/Separator";
import updateComment from "@/lib/updateComment";

interface DentistCardProps {
  dentist: DentistProps;
  onAction?: () => void;
  isLoaded?: boolean;
  actionButtonUseFor?: ButtonConfigKeys;
  isAdmin: boolean;
  user: User | null;
}

const DentistCard = ({ dentist, isAdmin, user }: DentistCardProps) => {
  const [appDate, setAppDate] = useState<Date>();
  const [appTime, setAppTime] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState<string>("");
  const [commentEN , setCommentEN] = useState<any>(null);

  

  const [formData, setFormData] = useState<Partial<DentistProps>>({
    yearsOfExperience: dentist.yearsOfExperience,
    areaOfExpertise: dentist.areaOfExpertise,
  });
  const [selectedExpertise, setSelectedExpertise] = useState<Array<string>>(
    dentist.areaOfExpertise || [],
  );
  const [expertisePopoverOpen, setExpertisePopoverOpen] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  console.log("user_id : "+ session?.user?.token) ;
 
  // Booking mutation (unchanged)
  const { bookAppointment, isCreating } = useBooking();
  const token_user: string | undefined = session?.user.token;
  
// ถ้าฟังก์ชันนี้ไม่ได้อยู่ใน async ให้ทำการประกาศให้เป็น async
const fetchComment = async () => {
  if (token_user) {
    try {
      const comment = await getCommentByDentID(dentist._id, token_user); // ใช้ await
      console.log("เก็บค่า"); // แสดงผล comment ที่ได้รับ
      setCommentEN(comment) ;
    } catch (error) {
      console.error("Error fetching comments:", error); // หากเกิดข้อผิดพลาด
    }
  } else {
    console.error("Token is undefined, cannot fetch comments.");
  }
};

useEffect(() => {
  fetchComment();
}, []); // Dependency array เพื่อให้ fetchComment เรียกใหม่เมื่อ dentist._id หรือ token_user เปลี่ยนแปลง

useEffect(() => {
  // เมื่อ commentEN มีการอัพเดทใหม่ จะทำการ log ค่าที่ได้
  console.log(commentEN);
}, [commentEN]); // การทำงานนี้จะเกิดขึ้นทุกครั้งที่ commentEN มีการเปลี่ยนแปลง

  
  // Update dentist mutation
  const updateDentist = useMutation({
    mutationFn: async (updatedDentist: Partial<DentistProps>) => {
      return axios.put(
        `${BackendRoutes.DENTIST}/${dentist._id}`,
        updatedDentist,
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      toast.success("Dentist updated successfully!");
      setIsEditing(false);
    },
    onError: (error: AxiosError) => {
      console.error(error.message);
      toast.error("Failed to update dentist. Please try again!");
    },
  });

  // Delete dentist mutation (unchanged)
  const { mutate: deleteDentistMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return axios.delete(`${BackendRoutes.DENTIST}/${dentist._id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      toast.success("Dentist deleted successfully!");
    },
    onError: (error) => {
      console.error((error as AxiosError).message);
      toast.error("Failed to delete dentist. Please try again!");
    },
  });

  // Handle input changes during editing
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? Number(value) : value,
    }));
  };

  // Toggle expertise selection
  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise)
        ? prev.filter((item) => item !== expertise)
        : [...prev, expertise],
    );
  };

  // Handle expertise save
  const handleExpertiseSave = () => {
    setFormData((prev) => ({
      ...prev,
      areaOfExpertise: selectedExpertise,
    }));
    setExpertisePopoverOpen(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        yearsOfExperience: dentist.yearsOfExperience,
        areaOfExpertise: dentist.areaOfExpertise,
      });
      setSelectedExpertise(dentist.areaOfExpertise || []);
    }
  };

  const handleSave = () => {
    // Validate inputs
    if (
      formData.yearsOfExperience === undefined ||
      formData.yearsOfExperience < 0
    ) {
      toast.error("Years of experience must be a non-negative number");
      return;
    }

    if (!selectedExpertise || selectedExpertise.length === 0) {
      toast.error("Please select at least one area of expertise");
      return;
    }

    updateDentist.mutate({
      yearsOfExperience: formData.yearsOfExperience,
      areaOfExpertise: selectedExpertise,
    });
  };
  const handleEdit = (commentId: string) => {
    setCommentEN((prevCommentData: { data: any; count: any; }) => {
      const updatedComments = prevCommentData.data.map(comment => 
        comment._id === commentId ? { ...comment, editing: true } : comment
      );
      return { ...prevCommentData, data: updatedComments };
    });
  };

  
  const handleDelete = async (commentId: string) => {
    if (!token_user) {
      alert("Missing user token.");
      return;
    }
  
    
    const isConfirmed = window.confirm("Confirm to delete");
    if (!isConfirmed) {
      return; 
    }
  
    try {
      const deletedComment = await deleteComment(commentId, token_user);
  
      setCommentEN((prevCommentData: { data: any; count: any; }) => {
        const updatedComments = prevCommentData.data.filter(
          (comment: any) => comment._id !== commentId
        );
        return { ...prevCommentData, data: updatedComments, count: prevCommentData.count - 1 };
      });
  
      alert("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };
  

  const handleCancelEdit = (commentId: string) => {
    setCommentEN((prevCommentData: { data: any; count: any; }) => {
      const updatedComments = prevCommentData.data.map(comment => 
        comment._id === commentId ? { ...comment, editing: false, editingText: '' } : comment
      );
      return { ...prevCommentData, data: updatedComments };
    });
  };

  const handleEditTextChange = (event: React.ChangeEvent<HTMLInputElement>, commentId: string) => {
    const updatedText = event.target.value;
    setCommentEN((prevCommentData: { data: any; count: any; }) => {
      const updatedComments = prevCommentData.data.map(comment =>
        comment._id === commentId ? { ...comment, editingText: updatedText } : comment
      );
      return { ...prevCommentData, data: updatedComments };
    });
  };

  const handleSaveEdit = async (commentId: string | undefined, editedText: string) => {
    if (!commentId || !token_user) {
      alert("Missing comment ID or token.");
      return;
    }
  
    try {
      await updateComment(commentId, token_user, editedText); // ไม่ต้องรอผลลัพธ์อะไรจาก backend ก็ได้
      setCommentEN((prevCommentData: { data: any; count: any; }) => {
        const updatedComments = prevCommentData.data.map(comment =>
          comment._id === commentId
            ? { ...comment, comment: editedText, editing: false, editingText: undefined } // ใช้ editedText ที่เรามีอยู่
            : comment
        );
        return { ...prevCommentData, data: updatedComments };
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment.");
    }
  };
  
  


  return (
    <Card className="w-full max-w-3xl rounded-xl">
      <CardHeader className="flex flex-wrap lg:flex-nowrap">
        <CardTitle className="flex items-center space-y-1 space-x-4">
          <h2 className="text-2xl">{dentist.user.name}</h2>
          <Badge variant={"secondary"}>
            {dentist.yearsOfExperience} year
            {dentist.yearsOfExperience > 1 ? "s" : ""} of experience
          </Badge>
        </CardTitle>
        <div className="flex w-full max-w-md flex-wrap items-center justify-end space-x-2 gap-y-2">
          {isAdmin && (
            <>
              {isEditing ? (
                <>
                  <CustomButton
                    useFor="cancel"
                    onClick={handleEditToggle}
                    disabled={updateDentist.isPending}
                  />
                  <CustomButton
                    useFor="confirm-info"
                    onClick={handleSave}
                    isLoading={updateDentist.isPending}
                  />
                </>
              ) : (
                <CustomButton useFor="edit" onClick={handleEditToggle} />
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <CustomButton useFor="delete-dentist" hideTextOnMobile />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    <Badge variant={"destructive"}>{dentist.user.name}</Badge>{" "}
                    and remove data from our servers.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteDentistMutation()}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Continue"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild className="w-fit">
              <CustomButton useFor="booking" hideTextOnMobile />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="space-y-4 p-3">
                <h3 className="font-medium">Select Appointment Date & Time</h3>
                <Calendar
                  mode="single"
                  selected={appDate}
                  onSelect={setAppDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />

                {appDate && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      Time for {format(appDate, "EEEE, MMMM do")}
                    </h4>
                    <Select value={appTime} onValueChange={setAppTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                        <SelectItem key={"test"} value="test" disabled={true}>
                          Items That is disabled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="pt-2">
                  <CustomButton
                    hideTextOnMobile={true}
                    useFor="add-booking-section"
                    onClick={() => {
                      if (user && appDate && appTime) {
                        bookAppointment(
                          dentist._id,
                          user._id,
                          appDate,
                          appTime,
                        );
                        if (!isCreating) {
                          setPopoverOpen(false);
                        }
                      } else {
                        toast.error("Please select a date and time");
                      }
                    }}
                    disabled={!appDate || !appTime || isCreating}
                    className="w-full"
                    isLoading={isCreating}
                  >
                    {isCreating ? "Booking..." : "Book Appointment"}
                  </CustomButton>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <Separator />
      <CardContent
        className={twJoin(
          "grid w-full grid-cols-2 sm:grid-cols-3 gap-4",
          isEditing ? "space-y-0" : "",
        )}
      >
        <p className="min-w-fit">Years of experiences</p>
        {isEditing ? (
          <Input
            name="yearsOfExperience"
            type="number"
            value={formData.yearsOfExperience || 0}
            onChange={handleInputChange}
            className="sm:col-span-2"
            min={0}
          />
        ) : (
          <p className="sm:col-span-2">{dentist.yearsOfExperience}</p>
        )}
        <p>Expertises</p>
        {isEditing ? (
          <div className="sm:col-span-2">
            <Popover
              open={expertisePopoverOpen}
              onOpenChange={setExpertisePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left"
                >
                  <span className="truncate">
                    {selectedExpertise.length > 0
                      ? selectedExpertise.join(", ")
                      : "Select expertise"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 md:w-80">
                <Command className="max-h-60 overflow-y-auto">
                  <CommandInput placeholder="Search expertise..." />
                  <CommandList>
                    <CommandGroup>
                      {expertiseOptions.map((expertise) => (
                        <CommandItem
                          key={expertise}
                          value={expertise}
                          onSelect={() => toggleExpertise(expertise)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedExpertise.includes(expertise)
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {expertise}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <div className="mt-2 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setExpertisePopoverOpen(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleExpertiseSave} size="sm">
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            {selectedExpertise.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedExpertise.map((expertise) => (
                  <Badge key={expertise} variant="secondary">
                    {expertise}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ul className="list-inside list-disc sm:col-span-2">
            {dentist.areaOfExpertise.map((expertise, idx) => (
              <li key={idx}>{expertise}</li>
            ))}
          </ul>
        )}
      </CardContent>
      {user && (
        <>
          <CardFooter className="flex flex-row flex-wrap items-center justify-end space-y-2 space-x-2">
            <Accordion type="single" collapsible className="mx-0 w-full">
              <AccordionItem value="comment">
              <AccordionTrigger className="py-1">
              <div className="flex items-center space-x-2">
                <MessageCircleIcon className="h-4 w-4" />
                <span>View Comments ({commentEN?.count ?? 0})</span>
              </div>
            </AccordionTrigger>
            

            <AccordionContent className="space-y-2">
  <div className="space-y-3">
    {commentEN?.data?.map((comment: Comment, index: number) => (
      <div key={comment._id} className="p-4 border rounded-lg shadow-sm bg-white relative">
        <Separator />
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg">Comment {index + 1}</span>
        </div>
        
        {/* การแสดงข้อความคอมเมนต์หรือช่องกรอกข้อความเมื่อแก้ไข */}
        {comment.editing ? (
          <div className="pt-2">
            <Input
              value={comment.editingText !== undefined ? comment.editingText : comment.comment}
              onChange={(e) => handleEditTextChange(e, comment._id)} // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลงข้อความ
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button
                variant="ghost"
                onClick={() => handleCancelEdit(comment._id)} // ฟังก์ชันยกเลิกการแก้ไข
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSaveEdit(comment._id, comment.editingText ?? comment.comment)} // ฟังก์ชันบันทึกการแก้ไข
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-2 font-medium text-gray-800">
            {comment.comment}
          </div>
        )}
        
        {/* Optionally add who commented if you want */}
        <div className="pt-2 text-sm text-gray-500">By User ID: {comment.user}</div>
        
        {/* ปุ่มอัพเดท (Update) อยู่ที่มุมขวาบน */}
        {user && (user._id === comment.user || user.role === "admin") && !comment.editing && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => handleEdit(comment._id)} // ฟังก์ชันเปิดการแก้ไขคอมเมนต์
              className="text-blue-500 hover:text-blue-700"
            >
              <MdEdit size={18} />
            </button>
          </div>
        )}
        
        {/* ปุ่มลบ (Delete) อยู่ที่มุมขวาล่าง */}
        {user && (user._id === comment.user || user.role === "admin") && (
          <div className="absolute bottom-2 right-2">
            <button
              onClick={() => handleDelete(comment._id)} // ฟังก์ชันลบคอมเมนต์
              className="text-red-500 hover:text-red-700"
            >
              <MdDelete size={18} />
            </button>
          </div>
        )}
      </div>
    ))}
    {user ? (
      <div className="flex w-full justify-end px-3">
        {isAddingComment ? (
          <div className="w-full space-y-2 px-3">
            <Input
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddingComment(false);
                  setNewComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (newComment.trim() && user?._id && dentist?._id && token_user) {
                    try {
                      await addComment(newComment, user._id, dentist._id, token_user);
                      console.log("Submit comment:", newComment);
                
                      // ใหม่! ดึง comment ใหม่จากเซิร์ฟเวอร์
                      await fetchComment();  
                
                      toast.success("Comment added!");
                      setIsAddingComment(false);
                      setNewComment(""); // Clear the input
                    } catch (error) {
                      console.error("Error adding comment:", error);
                      toast.error("Failed to add comment.");
                    }
                  } else {
                    toast.error("Please write something before sending.");
                  }
                }}
                
              >
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-end px-3">
            <CustomButton
              useFor="add-comment"
              onClick={() => setIsAddingComment(true)}
            />
          </div>
        )}
      </div>
    ) : null}
  </div>
</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default DentistCard;
