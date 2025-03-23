"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { FrontendRoutes } from "@/config/apiRoutes";
import getUserProfile from "@/lib/getUserProfile";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.token) {
        try {
          const userData = await getUserProfile(session.user.token);
          setUser(userData.data);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [session?.user?.token]);
  console.log(user);
  if (!user) {
    redirect(FrontendRoutes.DENTIST_LIST);
  }
  return (
    <main className="space-y-10">
      <section className="flex w-full flex-col items-center justify-center pt-10">
        <p className="text-3xl font-semibold">Your Profile</p>
      </section>
      <section className="flex w-full justify-center">
        {user ? (
          <Card className="max-w-lg p-5">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Profile Information
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
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>Account Created: </strong>
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">ID: {user._id}</p>
            </CardFooter>
          </Card>
        ) : (
          <></>
        )}
      </section>
    </main>
  );
};

export default Page;
