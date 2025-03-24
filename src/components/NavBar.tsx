"use client";
import { FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import {
  BriefcaseMedicalIcon,
  CalendarPlusIcon,
  LogInIcon,
  MenuIcon,
  StethoscopeIcon,
  UserIcon,
  UserRoundCogIcon,
} from "lucide-react";
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
  const { user } = useUser();

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

          {user ? (
            <>
              <DropdownMenuItem
                className="flex items-center space-x-1.5"
                onClick={() => router.push(FrontendRoutes.PROFILE)}
              >
                {user.role == Role_type.ADMIN ? (
                  <UserRoundCogIcon />
                ) : (
                  <UserIcon />
                )}
                <>{user?.name || "Profile"}</>
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
