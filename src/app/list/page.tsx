"use client";
import DentistCard from "@/components/DentistCard";
import { SearchBar } from "@/components/SearchBar";
import { BackendRoutes } from "@/config/apiRoutes";

import { DentistProps } from "@/types/api/Dentist";
import axios, { AxiosError } from "axios";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorIcon } from "react-hot-toast";

const Page = () => {
  const [dentists, setDentists] = useState<Array<DentistProps>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BackendRoutes.DENTIST);

        if (Array.isArray(response.data.data)) {
          setDentists(response.data.data);
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

  if (error)
    return (
      <p className="text-red-500">
        <ErrorIcon /> Error: {error}
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
        <section className="col-span-3 hidden md:block" />
        <section className="flex flex-col items-center gap-y-6 md:col-span-8 md:flex-row md:justify-between">
          <h1 className="align-baseline text-5xl font-semibold">
            Search Doctors
          </h1>
          <SearchBar />
        </section>
        <section className="mt-5 sm:col-span-4 lg:col-span-3">hello</section>
        <section className="col-span-7 my-10 flex h-full w-full flex-col justify-between gap-y-4 md:my-0 lg:col-span-8">
          <div className="col-span-8 w-full space-y-6 p-5">
            {dentists.length > 0 ? (
              dentists.map((dentist, idx) => (
                <DentistCard key={idx} dentist={dentist} />
              ))
            ) : (
              <p>No dentists found.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
