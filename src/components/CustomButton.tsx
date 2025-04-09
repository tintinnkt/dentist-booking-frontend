import { cn } from "@/lib/utils";
import {
  CalendarCheckIcon,
  CalendarPlusIcon,
  CalendarX2Icon,
  Check,
  ChevronLeft,
  ChevronRight,
  FileCheck2Icon,
  Loader2,
  LogOutIcon,
  LucideIcon,
  LucideProps,
  PencilIcon,
  Plus,
  SearchIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import { twJoin } from "tailwind-merge";
import { Button } from "./ui/Button";

interface ButtonConfig {
  label?: string | { sm: string; md: string };
  icon?: LucideIcon;
  placeAt?: "start" | "end";
  iconProps?: LucideProps;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

const buttonConfig: Record<string, ButtonConfig> = {
  select: {
    label: "select",
    variant: "default",
    icon: Plus,
  },
  selected: {
    label: "selected",
    variant: "outline",
    icon: Check,
  },
  back: {
    label: "back",
    variant: "secondary",
    icon: ChevronLeft,
  },
  "see-more": {
    label: "see more",
    variant: "secondary",
    icon: ChevronRight,
    placeAt: "end",
  },
  search: {
    variant: "secondary",
    icon: SearchIcon,
    placeAt: "end",
  },
  "create-dentist": {
    label: "Create New Dentist",
    variant: "default",
    icon: UserPlusIcon,
  },
  edit: {
    label: "Edit",
    variant: "outline",
    icon: PencilIcon,
  },
  "edit-booking": {
    label: "Edit Booking",
    variant: "outline",
    icon: PencilIcon,
  },
  "delete-dentist": {
    label: "Delete Dentist",
    variant: "destructive",
    icon: Trash2Icon,
  },
  "delete-booking": {
    label: "Remove Booking",
    variant: "destructive",
    icon: Trash2Icon,
  },
  "cancel-booking": {
    label: "Cancel Booking",
    variant: "destructive",
    icon: CalendarX2Icon,
  },
  delete: {
    label: "Delete",
    variant: "destructive",
    icon: Trash2Icon,
  },
  booking: {
    label: "Book now",
    variant: "default",
    icon: CalendarPlusIcon,
  },
  logout: {
    label: "logout",
    variant: "destructive",
    icon: LogOutIcon,
    placeAt: "end",
  },
  "add-booking-section": {
    label: "comfirm",
    variant: "outline",
    icon: CalendarCheckIcon,
  },
  "confirm-info": {
    label: "Confirm Info",
    variant: "default",
    icon: FileCheck2Icon,
  },
  cancel: {
    label: "cancel",
    variant: "outline",
    icon: CalendarX2Icon,
  },
};
export type ButtonConfigKeys =
  | "select"
  | "selected"
  | "back"
  | "seeResources"
  | "edit";

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  useFor: keyof typeof buttonConfig;
  hideTextOnMobile?: boolean;
  iconProps?: LucideProps;
  isLoading?: boolean;
}

export const CustomButton = ({
  useFor,
  hideTextOnMobile,
  className,
  isLoading,
  disabled,
  ...props
}: CustomButtonProps) => {
  const config = buttonConfig[useFor];
  const Icon = config?.icon;

  return (
    <Button
      className={cn(
        "flex items-center gap-2 rounded-full transition-all hover:scale-110",
        config?.className,
        hideTextOnMobile && "max-md:size-10 max-md:p-0",
        !config?.label && "size-10 p-0",
        className,
      )}
      variant={config?.variant || "default"}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <>
          {config?.placeAt !== "end" && Icon && (
            <Icon className="size-5" {...config?.iconProps} />
          )}
          {config?.label && (
            <span className={twJoin(hideTextOnMobile ? "hidden sm:block" : "")}>
              {typeof config?.label === "string"
                ? config?.label
                : config?.label.md}
            </span>
          )}
          {config?.placeAt === "end" && Icon && (
            <Icon className="size-5" {...config?.iconProps} />
          )}
        </>
      )}
    </Button>
  );
};
