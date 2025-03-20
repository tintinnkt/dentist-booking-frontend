import DentistCard from "@/components/DentistCard";
import { dentists } from "@/mock/DentistsMock";

const page = () => {
  return (
    <main className="gap-x-10 md:grid md:grid-cols-11">
      <section className="col-span-3 hidden md:block" />
      <section className="flex flex-col gap-y-6 md:col-span-8 md:flex-row md:justify-between">
        <h1 className="align-baseline font-semibold">Search Doctors</h1>
        <input></input>
      </section>
      <section></section>
      <div className="col-span-8 w-full space-y-6 p-5">
        {dentists.map((dentist, idx) => (
          <DentistCard key={idx} dentist={dentist} />
        ))}
      </div>
    </main>
  );
};

export default page;
