import {
  BriefcaseMedicalIcon,
  CalendarPlusIcon,
  LogInIcon,
  MenuIcon,
  StethoscopeIcon,
} from "lucide-react";
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
    <div className="to mx-auto my-2 flex w-4/5 max-w-2xl flex-row items-center justify-between rounded-md bg-red-400 bg-gradient-to-r from-blue-300 px-4 py-1.5">
      <div className="hover:bg-primary-foreground/20 rounded-sm p-1.5 transition-all hover:translate-x-1 hover:scale-110 hover:shadow-sm">
        <BriefcaseMedicalIcon />
      </div>
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
