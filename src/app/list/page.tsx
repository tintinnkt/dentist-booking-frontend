import DentistCard from "@/components/DentistCard";
import { SearchBar } from "@/components/SearchBar";
import { dentists } from "@/mock/DentistsMock";

const page = () => {
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
            {dentists.map((dentist, idx) => (
              <DentistCard key={idx} dentist={dentist} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
