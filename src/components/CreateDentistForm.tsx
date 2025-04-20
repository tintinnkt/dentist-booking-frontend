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
import { Role_type } from "@/config/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { CustomButton } from "./CustomButton";

// Define the expertise options based on the model schema
const expertiseOptions = [
  "Orthodontics",
  "Pediatric Dentistry",
  "Endodontics",
  "Prosthodontics",
  "Periodontics",
  "Oral Surgery",
  "General Dentistry",
];

interface RegisterDentistData {
  name: string;
  email: string;
  password: string;
  tel: string;
  role: string;
  yearsOfExperience: number;
  areaOfExpertise: Array<string>;
}

export default function CreateDentistForm() {
  const [selectedExpertise, setSelectedExpertise] = useState<Array<string>>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
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

  // Register dentist mutation
  const registerDentistMutation = useMutation({
    mutationFn: async (dentistData: RegisterDentistData) => {
      const token = session?.user?.token;
      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

      return axios.post(BackendRoutes.REGISTER_DENTIST, dentistData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      // Invalidate and refetch dentists query to update UI
      queryClient.invalidateQueries({ queryKey: ["dentists"] });
      toast.success("Dentist registered successfully!");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setTel("");
      setYearsOfExperience("");
      setSelectedExpertise([]);
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Failed to register dentist",
      );
    },
  });

  // Function to register a new dentist
  const handleRegisterDentist = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !tel ||
      !yearsOfExperience ||
      selectedExpertise.length === 0
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    registerDentistMutation.mutate({
      name,
      email,
      password,
      tel,
      role: Role_type.DENTIST,
      yearsOfExperience: Number(yearsOfExperience),
      areaOfExpertise: selectedExpertise,
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <CustomButton useFor="create-dentist" />
      </PopoverTrigger>
      <PopoverContent className="mx-3 max-w-screen min-w-fit space-y-3 p-4 sm:w-sm">
        <CardHeader>
          <h2 className="font-semibold">Register New Dentist</h2>
        </CardHeader>

        <div>
          <p className="text-sm">Name</p>
          <Input
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={registerDentistMutation.isPending}
          />
        </div>

        <div>
          <p className="text-sm">Email</p>
          <Input
            placeholder="Enter Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={registerDentistMutation.isPending}
          />
        </div>

        <div>
          <p className="text-sm">Password</p>
          <Input
            placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={registerDentistMutation.isPending}
          />
        </div>

        <div>
          <p className="text-sm">Telephone</p>
          <Input
            placeholder="Enter Telephone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            disabled={registerDentistMutation.isPending}
          />
        </div>

        <div>
          <p className="text-sm">Years of Experience</p>
          <Input
            placeholder="Enter years"
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value) || "")}
            disabled={registerDentistMutation.isPending}
            min={0}
          />
        </div>

        <div>
          <p className="text-sm">Areas of Expertise</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                disabled={registerDentistMutation.isPending}
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

        <div className="px-1.5 py-1">
          <CustomButton
            useFor="confirm-info"
            onClick={handleRegisterDentist}
            disabled={registerDentistMutation.isPending}
          >
            {registerDentistMutation.isPending
              ? "Registering..."
              : "Register Dentist"}
          </CustomButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
