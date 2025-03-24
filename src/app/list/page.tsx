"use client";
import CreateDentistForm from "@/components/CreateDentistForm";
import DentistCard from "@/components/DentistCard";
import { SearchBar } from "@/components/SearchBar";
import { BackendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { DentistProps } from "@/types/api/Dentist";
import axios, { AxiosError } from "axios";
import { LoaderIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const [dentists, setDentists] = useState<Array<DentistProps>>([]);
  const [filteredDentists, setFilteredDentists] = useState<Array<DentistProps>>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BackendRoutes.DENTIST);
        if (Array.isArray(response.data.data)) {
          setDentists(response.data.data);
          setFilteredDentists(response.data.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (err) {
        const error = err as AxiosError;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = (value: string) => {
    filterDentists(value);
  };

  // Filter dentists based on search term
  const filterDentists = (term: string) => {
    if (!term.trim()) {
      setFilteredDentists(dentists);
      return;
    }

    const filtered = dentists.filter((dentist) =>
      dentist.name.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredDentists(filtered);
  };

  // Filter dentists whenever search term changes
  useEffect(() => {
    filterDentists(searchTerm);
  }, [searchTerm, dentists]);

  if (error)
    return (
      <p className="text-red-500">
        <XCircleIcon /> Error: {error}
      </p>
    );

  if (loading)
    return (
      <p className="place-items-center py-10 text-gray-500">
        <LoaderIcon /> Loading...
      </p>
    );

  return (
    <main className="mx-auto my-10 max-w-screen-xl px-8">
      <div className="gap-x-10 md:grid md:grid-cols-11">
        <section className="col-span-2 hidden md:block" />
        <section className="flex flex-col items-center space-x-2.5 gap-y-6 md:col-span-9 md:flex-row md:justify-between">
          <h1 className="align-baseline text-5xl font-semibold">
            Search Dentists
          </h1>
          {user && user.role == Role_type.ADMIN ? <CreateDentistForm /> : null}
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />
        </section>
        <section className="mt-5 sm:col-span-4 lg:col-span-3">hello</section>
        <section className="col-span-7 my-10 flex h-full w-full flex-col justify-between gap-y-4 md:my-0 lg:col-span-8">
          <div className="col-span-8 w-full space-y-6 p-5">
            {filteredDentists.length > 0 ? (
              filteredDentists.map((dentist, idx) => (
                <DentistCard
                  key={idx}
                  dentist={dentist}
                  isAdmin={user?.role == Role_type.ADMIN}
                  userLoggedIn={!!user}
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
