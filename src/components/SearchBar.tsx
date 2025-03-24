import { CustomButton } from "./CustomButton";
import { Input } from "./ui/Input";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchBar = ({ onSearch, ...props }: SearchBarProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && props.value !== undefined) {
      onSearch(props.value as string);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center space-x-1.5 rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm"
    >
      <Input
        placeholder="Search Name"
        className="flex-1 border-none focus:ring-0"
        {...props}
      />
      <CustomButton useFor="search" type="submit" />
    </form>
  );
};
