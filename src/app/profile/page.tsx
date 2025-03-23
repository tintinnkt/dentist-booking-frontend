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
import { Skeleton } from "@/components/ui/Skeleton";
import { FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { LoaderCircleIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const MemoizedCard = React.memo(({ user }: { user: any }) => (
  <Card className="w-lg max-w-full p-5 shadow-xl">
    <CardHeader>
      <CardTitle className="flex items-center justify-start space-x-3 text-xl font-bold">
        <span>Profile Information</span>
        {user.role === Role_type.ADMIN && <Badge>Admin</Badge>}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.tel}
        </p>
        {user.role === "admin" && (
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        )}
        <p>
          <strong>Account Created: </strong>
          {new Date(user.createdAt).toLocaleDateString("en-GB")}
        </p>
      </div>
    </CardContent>
    <CardFooter>
      <p className="text-sm text-gray-500">ID: {user._id}</p>
    </CardFooter>
  </Card>
));

const Page = () => {
  const router = useRouter();
  const { user } = useUser();
  const handleLogout = async () => {
    const logoutPromise = signOut({ redirect: false, callbackUrl: "/" });

    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Logout failed. Please try again.",
    });

    try {
      await logoutPromise;
      router.push(FrontendRoutes.DENTIST_LIST);
    } catch (error) {
      console.error("Logout failed:", error);
      router.push(FrontendRoutes.DENTIST_LIST);
    }
  };

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
        <MemoizedCard user={user} />
      </section>
      <section className="flex w-full max-w-lg justify-end justify-self-center px-5">
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
