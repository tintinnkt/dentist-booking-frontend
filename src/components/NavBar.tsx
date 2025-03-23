"use client";
import { FrontendRoutes } from "@/config/apiRoutes";
import { useUser } from "@/hooks/useUser";
import {
  BriefcaseMedicalIcon,
  CalendarPlusIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  StethoscopeIcon,
  UserIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react"; // Add useSession
import { useRouter } from "next/navigation";
import { TypingAnimation } from "./magicui/TypingAnimation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Separator } from "./ui/Separator";

const NavBar = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  // Add direct session check to ensure immediate updates
  const { data: session } = useSession();
  
  const handleLogout = async () => {
    try {
      // Use callbackUrl to force a full page reload
      await signOut({ redirect: true, callbackUrl: "/" });
      // Note: We're now using redirect:true so the router.push line will never execute
      // But we'll keep it as a fallback
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/");
    }
  };

  // Check both user from hook and session directly
  const isAuthenticated = !!(user && !loading && session?.user);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-row items-center justify-between rounded-b-2xl bg-red-400 bg-gradient-to-r from-blue-300 px-4 py-1.5 shadow-lg sm:w-3/5">
      <div className="hover:bg-primary-foreground/20 rounded-sm p-1.5 transition-all hover:translate-x-1 hover:scale-110 hover:shadow-sm">
        <BriefcaseMedicalIcon onClick={() => router.push("/")} />
      </div>
      <TypingAnimation
        startOnView
        delay={100}
        duration={40}
        className="font-serif text-lg"
      >
        Dentist Booking System
      </TypingAnimation>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-primary-foreground/20 rounded-lg p-1.5 transition-all hover:-translate-x-1.5 hover:scale-105 hover:shadow-md">
          <MenuIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center space-x-1.5"
              onClick={() => router.push(FrontendRoutes.DENTIST_LIST)}
            >
              <StethoscopeIcon />
              <>Dentists</>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center space-x-1.5"
              onClick={() => router.push(FrontendRoutes.BOOKING)}
            >
              <CalendarPlusIcon />
              <>Booking</>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <Separator />

          {isAuthenticated ? (
            <>
              <DropdownMenuItem
                className="flex items-center space-x-1.5"
                onClick={() => router.push(FrontendRoutes.PROFILE)}
              >
                <UserIcon />
                <>{user?.name || "Profile"}</>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center space-x-1.5"
                onClick={handleLogout}
              >
                <LogOutIcon />
                <>Logout</>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem 
              className="flex items-center space-x-1.5"
              onClick={() => router.push(FrontendRoutes.LOGIN)}
            >
              <LogInIcon />
              <>Login</>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavBar;