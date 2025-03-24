"use client";
import { CustomButton } from "@/components/CustomButton";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/user";
import { LoaderCircleIcon, EditIcon, SaveIcon, XIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { BackendRoutes } from "@/config/apiRoutes";
import { useSession } from "next-auth/react";

const ProfileCard = React.memo(({ 
  user, 
  isEditing, 
  onEditToggle,
  onSave,
  formData,
  setFormData,
  isLoading
}: { 
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => Promise<void>;
  formData: Partial<User>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  isLoading: boolean;
}) => (
  <Card className="w-lg max-w-full p-5 shadow-xl">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-3 text-xl font-bold">
          <span>Profile Information</span>
          {user.role === Role_type.ADMIN && <Badge>Admin</Badge>}
        </CardTitle>
        {!isEditing ? (
          <button 
            onClick={onEditToggle} 
            className="text-blue-500 hover:text-blue-700"
            disabled={isLoading}
          >
            <EditIcon className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={onSave} 
              className="text-green-500 hover:text-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircleIcon className="h-5 w-5 animate-spin" />
              ) : (
                <SaveIcon className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={onEditToggle} 
              className="text-red-500 hover:text-red-700"
              disabled={isLoading}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block font-medium">Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <Input
                value={formData.tel || ''}
                onChange={(e) => setFormData({...formData, tel: e.target.value})}
                disabled={isLoading}
              />
            </div>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.tel}</p>
          </>
        )}
        {user.role === "admin" && (
          <p><strong>Role:</strong> {user.role}</p>
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
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    const logoutPromise = signOut({ redirect: false, callbackUrl: "/" });

    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Logout failed. Please try again.",
    });

    try {
      await logoutPromise;
      setUser(null);
      router.push(FrontendRoutes.DENTIST_LIST);
    } catch (error) {
      console.error("Logout failed:", error);
      router.push(FrontendRoutes.DENTIST_LIST);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing && user) {
      setFormData({
        name: user.name,
        email: user.email,
        tel: user.tel
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!user || !user._id || !session?.user.token) return;

    // Optimistically update the UI immediately
    const optimisticUser = { ...user, ...formData };
    setUser(optimisticUser);
    setIsLoading(true);

    try {
      const response = await fetch(`${BackendRoutes.UPDATE_USER}/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}` 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to update user');
      }

      const updatedUser = await response.json();
      
      // Final update with server response
      setUser({
        ...optimisticUser,
        ...updatedUser
      });
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Revert to original state if error occurs
      setUser(user);
      console.error('Update error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="place-items-center pt-20">
        <Skeleton className="h-72 w-lg place-items-center pt-5 shadow-lg">
          <LoaderCircleIcon className="animate-spin" />
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
        <ProfileCard 
          user={user}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
        />
      </section>
      <section className="flex w-full max-w-lg justify-end justify-self-center px-5">
        <CustomButton
          useFor="logout"
          hideTextOnMobile={false}
          className="shadow-3xl"
          onClick={handleLogout}
          disabled={isLoading}
        />
      </section>
    </main>
  );
};

export default Page;