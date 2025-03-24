import { Button } from "@/components/ui/Button";
import { CardHeader } from "@/components/ui/Card";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { BackendRoutes } from "@/config/apiRoutes";
import { expertiseOptions } from "@/constant/expertise";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CustomButton } from "./CustomButton";

interface CreateDentistData {
  name: string;
  yearsOfExperience: number;
  areaOfExpertise: string[];
}

export default function CreateDentistForm() {
  const [selectedExpertise, setSelectedExpertise] = useState<Array<string>>([]);
  const [name, setName] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Function to toggle selected expertise
  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise)
        ? prev.filter((item) => item !== expertise)
        : [...prev, expertise],
    );
  };

  // Create dentist mutation
  const createDentistMutation = useMutation({
    mutationFn: async (dentistData: CreateDentistData) => {
      const token = session?.user?.token;
      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

      return axios.post(BackendRoutes.DENTIST, dentistData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      // Invalidate and refetch dentists query to update UI
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      toast.success("Dentist created successfully!");

      // Reset form
      setName("");
      setYearsOfExperience("");
      setSelectedExpertise([]);
      setIsOpen(false); // Close the popover
    },
    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Failed to create dentist",
      );
    },
  });

  // Function to create a new dentist
  const handleCreateDentist = async () => {
    if (!name || !yearsOfExperience || selectedExpertise.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }

    createDentistMutation.mutate({
      name,
      yearsOfExperience: Number(yearsOfExperience),
      areaOfExpertise: selectedExpertise,
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Create New Dentist</Button>
      </PopoverTrigger>
      <PopoverContent className="w-sm min-w-fit space-y-3 p-4">
        <CardHeader>
          <h2 className="font-semibold">Create New Dentist</h2>
        </CardHeader>

        {/* Name Input */}
        <div>
          <p className="text-sm">Name</p>
          <Input
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={createDentistMutation.isPending}
          />
        </div>

        {/* Years of Experience Input */}
        <div>
          <p className="text-sm">Years of Experience</p>
          <Input
            placeholder="Enter years"
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value) || "")}
            disabled={createDentistMutation.isPending}
          />
        </div>

        {/* Areas of Expertise Selection */}
        <div>
          <p className="text-sm">Areas of Expertise</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                disabled={createDentistMutation.isPending}
              >
                {selectedExpertise.length > 0
                  ? selectedExpertise.join(", ")
                  : "Select expertise"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-2">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandGroup>
                    {expertiseOptions.map((expertise) => (
                      <CommandItem
                        key={expertise}
                        value={expertise}
                        onSelect={() => toggleExpertise(expertise)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedExpertise.includes(expertise)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {expertise}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Create Button */}
        <div className="px-1.5 py-1">
          <CustomButton
            useFor="create-dentist"
            onClick={handleCreateDentist}
            disabled={createDentistMutation.isPending}
          >
            {createDentistMutation.isPending ? "Creating..." : "Create Dentist"}
          </CustomButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
