import { CustomButton } from "./CustomButton";
import { Input } from "./ui/Input";

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement>;

export const SearchBar = (props: SearchBarProps) => {
  return (
    <div className="flex items-center space-x-1.5 rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm">
      <Input
        placeholder="Search for dentist name"
        className="flex-1 border-none focus:ring-0"
        {...props}
      />
      <CustomButton useFor="search" />
    </div>
  );
};
