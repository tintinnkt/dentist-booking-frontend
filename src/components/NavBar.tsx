import {
  BriefcaseMedicalIcon,
  CalendarPlusIcon,
  LogInIcon,
  MenuIcon,
  StethoscopeIcon,
} from "lucide-react";
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
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-row items-center justify-between rounded-b-2xl bg-red-400 bg-gradient-to-r from-blue-300 px-4 py-1.5 shadow-lg sm:w-3/5">
      <div className="hover:bg-primary-foreground/20 rounded-sm p-1.5 transition-all hover:translate-x-1 hover:scale-110 hover:shadow-sm">
        <BriefcaseMedicalIcon />
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
            <DropdownMenuItem className="flex items-center space-x-1.5">
              <StethoscopeIcon />
              <>Doctors</>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center space-x-1.5">
              <CalendarPlusIcon />
              <>Booking</>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <Separator />
          <DropdownMenuItem>
            <LogInIcon />
            <>Login</>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavBar;
