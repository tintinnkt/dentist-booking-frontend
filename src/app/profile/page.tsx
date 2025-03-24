"use client";
import { CustomButton } from "@/components/CustomButton";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { BackendRoutes, FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name,
    tel: user?.tel,
  });
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user?.name || "",
        tel: user?.tel || "",
      });
    }
  }, [user]);

  const handleLogout = async () => {
    const logoutPromise = signOut({ redirect: false, callbackUrl: "/" });

    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Logout failed. Please try again.",
    });

    try {
      await logoutPromise;
      // Invalidate and remove user queries from cache on logout
      queryClient.removeQueries({ queryKey: ["userProfile"] });
      setUser(null as any);
      router.push(FrontendRoutes.DENTIST_LIST);
    } catch (error) {
      console.error("Logout failed:", error);
      router.push(FrontendRoutes.DENTIST_LIST);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Save the edited data, you can add further logic to update the backend
      console.log("Saving data", editedUser);
    }
    setIsEditing((prev) => !prev);
  };

  const { mutate: updateUser } = useMutation({
    mutationFn: async () => {
      return axios.put(
        BackendRoutes.UPDATE_USER,
        {
          name: editedUser.name,
          tel: editedUser.tel,
        },
        {
          headers: {
            // TODO: add token here
          },
        },
      );
    },
    onSuccess: () => {
      setIsEditing(false);
      //TODO: add toast for noti (tell user that update successful)
    },
  });

  if (!user) {
    return (
      <div className="place-items-center pt-20">
        <Skeleton className="h-72 w-lg place-items-center pt-5 shadow-lg">
          <LoaderCircleIcon />
        </Skeleton>
      </div>
    );
  }

  return (
    <main className="space-y-10 px-10">
      <section className="flex w-full flex-col items-center justify-center pt-10">
        <p className="text-3xl font-semibold">Your Profile</p>
      </section>
      <section className="flex w-full justify-center">
        <Card className="w-lg max-w-full p-5 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-start space-x-3 text-xl font-bold">
              <span>Profile Information</span>
              {user.role === Role_type.ADMIN && <Badge>Admin</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <strong>Name:</strong>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  className="border p-2"
                />
              ) : (
                <p>{user.name}</p>
              )}

              <strong>Email:</strong>
              <p>{user.email}</p>

              <strong>Phone:</strong>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedUser.tel}
                  onChange={handleInputChange}
                  className="border p-2"
                />
              ) : (
                <p>{user.tel}</p>
              )}

              {user.role === "admin" && (
                <>
                  <strong>Role:</strong>
                  <p>{user.role}</p>
                </>
              )}
              <p>
                <strong>Account Created:</strong>
              </p>
              <p>{new Date(user.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">ID: {user._id}</p>
          </CardFooter>
        </Card>
      </section>
      <section className="flex w-full max-w-lg justify-end space-x-2 justify-self-center px-5">
        {isEditing ? (
          <CustomButton useFor="comfirm-edit" />
        ) : (
          <CustomButton useFor="edit" onClick={toggleEditMode} />
        )}
        <CustomButton
          useFor="logout"
          hideTextOnMobile={false}
          className="shadow-3xl"
          onClick={handleLogout}
        />
      </section>
    </main>
  );
};

export default Page;
