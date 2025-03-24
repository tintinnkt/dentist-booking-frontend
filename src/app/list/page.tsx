"use client";
import CreateDentistForm from "@/components/CreateDentistForm";
import DentistCard from "@/components/DentistCard";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { expertiseOptions } from "@/constant/expertise";
import { useUser } from "@/hooks/useUser";
import { DentistProps } from "@/types/api/Dentist";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoaderIcon, XCircleIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const fetchDentists = async (): Promise<Array<DentistProps>> => {
  const response = await axios.get(BackendRoutes.DENTIST);
  if (Array.isArray(response.data.data)) {
    return response.data.data;
  }
  throw new Error("Failed to fetch dentists data");
};

const Page = () => {
  const {
    data: dentists = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dentists"],
    queryFn: fetchDentists,
  });

  const [filteredDentists, setFilteredDentists] = useState<Array<DentistProps>>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { user } = useUser();

  // Filtering states
  const [minExperience, setMinExperience] = useState<number>(0);
  const [selectedExpertises, setSelectedExpertises] = useState<Array<string>>(
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (value: string) => {
    filterDentists(value, minExperience, selectedExpertises);
  };

  const handleFilterChange = (
    newExperience: number,
    newExpertises: Array<string>,
  ) => {
    setMinExperience(newExperience);
    setSelectedExpertises(newExpertises);
    filterDentists(searchTerm, newExperience, newExpertises);
  };

  const filterDentists = useCallback(
    (term: string, experience: number, expertises: Array<string>) => {
      const filtered = dentists.filter((dentist) => {
        const matchesSearch = dentist.name
          .toLowerCase()
          .includes(term.toLowerCase());
        const matchesExperience = dentist.yearsOfExperience >= experience;
        const matchesExpertise =
          expertises.length === 0 ||
          dentist.areaOfExpertise.some((exp) => expertises.includes(exp));
        return matchesSearch && matchesExperience && matchesExpertise;
      });
      setFilteredDentists(filtered);
    },
    [dentists],
  );

  useEffect(() => {
    if (dentists.length > 0) {
      filterDentists(searchTerm, minExperience, selectedExpertises);
    }
  }, [searchTerm, dentists, minExperience, selectedExpertises, filterDentists]);

  if (error)
    return (
      <p className="text-red-500">
        <XCircleIcon /> Error: {(error as Error).message}
      </p>
    );

  if (isLoading)
    return (
      <p className="flex items-center justify-center gap-3 pt-10">
        <LoaderIcon /> Loading...
      </p>
    );

  return (
    <main className="mx-auto my-10 max-w-screen-xl overflow-visible px-4 sm:px-8">
      <div className="gap-x-10 md:grid md:grid-cols-11">
        <section className="col-span-4 hidden md:block" />
        <section className="flex flex-col items-center space-x-2.5 gap-y-6 md:col-span-7 md:flex-row md:justify-between">
          <h1 className="align-baseline text-4xl font-semibold sm:text-5xl">
            Search Dentists
          </h1>
          {user && user.role == Role_type.ADMIN ? <CreateDentistForm /> : null}
        </section>

        <section className="mt-5 sm:col-span-4 lg:col-span-3">
          <div className="sticky top-10 space-y-5">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />
            <div className="bg-card rounded-lg border p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Filter by:</h2>

              <div className="mb-4 space-y-2">
                <h3 className="space-x-2 text-sm font-medium">
                  <span>Years of Experience </span>
                  <Badge variant={"secondary"}>{minExperience}+ years</Badge>
                </h3>
                <Slider
                  min={0}
                  max={30}
                  step={1}
                  value={[minExperience]}
                  onValueChange={(val) =>
                    handleFilterChange(val[0], selectedExpertises)
                  }
                />
              </div>
              {/* Expertise Checkboxes */}
              <div className="mb-4">
                <h3 className="text-sm font-medium">Area of Expertise</h3>
                <div className="flex flex-col space-y-2">
                  {expertiseOptions.map((expertise) => (
                    <label
                      key={expertise}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={selectedExpertises.includes(expertise)}
                        onCheckedChange={(checked) => {
                          const newExpertises = checked
                            ? [...selectedExpertises, expertise]
                            : selectedExpertises.filter(
                                (exp) => exp !== expertise,
                              );
                          handleFilterChange(minExperience, newExpertises);
                        }}
                      />
                      <span className="text-sm">{expertise}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="col-span-7 my-10 flex h-full w-full flex-col justify-between gap-y-4 md:my-0 lg:col-span-8">
          <div className="col-span-8 w-full space-y-6 sm:p-5">
            {filteredDentists.length > 0 ? (
              filteredDentists.map((dentist) => (
                <DentistCard
                  key={dentist.id}
                  dentist={dentist}
                  isAdmin={user?.role == Role_type.ADMIN}
                  user={user}
                />
              ))
            ) : (
              <p className="w-full pr-10 text-end">No dentists found.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
