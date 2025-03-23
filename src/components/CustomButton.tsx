import { cn } from "@/lib/utils";
import {
  CalendarPlusIcon,
  CalendarX2Icon,
  Check,
  ChevronLeft,
  ChevronRight,
  LogOutIcon,
  LucideIcon,
  LucideProps,
  PencilIcon,
  Plus,
  SearchIcon,
  Trash2Icon,
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
  seeResources: {
    label: "See Resources",
    variant: "secondary",
    icon: ChevronRight,
    placeAt: "end",
  },
  search: {
    variant: "secondary",
    icon: SearchIcon,
    placeAt: "end",
  },
  edit: {
    label: "แก้ไข",
    variant: "outline",
    icon: PencilIcon,
  },
  "delete-dentist": {
    label: "ลบหมอ",
    variant: "destructive",
    icon: Trash2Icon,
  },
  "delete-booking": {
    label: "ลบการจอง",
    variant: "destructive",
    icon: Trash2Icon,
  },
  "cancel-booking": {
    label: "ยกเลิกการจอง",
    variant: "destructive",
    icon: CalendarX2Icon,
  },
  delete: {
    label: "ลบ",
    variant: "destructive",
    icon: Trash2Icon,
  },
  booking: {
    label: "นัดวันกับหมอ",
    variant: "default",
    icon: CalendarPlusIcon,
  },
  logout: {
    label: "logout",
    variant: "destructive",
    icon: LogOutIcon,
    placeAt: "end",
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
}

export const CustomButton = ({
  useFor,
  hideTextOnMobile,
  className,
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
      {...props}
    >
      {config?.placeAt !== "end" && Icon && (
        <Icon className="size-5" {...config?.iconProps} />
      )}
      {config?.label && (
        <span className={twJoin(hideTextOnMobile ? "hidden sm:block" : "")}>
          {typeof config?.label === "string" ? config?.label : config?.label.md}
        </span>
      )}
      {config?.placeAt === "end" && Icon && (
        <Icon className="size-5" {...config?.iconProps} />
      )}
    </Button>
  );
};
