import DentistCard from "@/components/DentistCard";
import { DentistListAllItem } from "@/types/api/Dentist";
const dentists: Array<DentistListAllItem> = [
  {
    id: "012",
    name: "Zeng",
    yearsOfExperience: 49,
    areaOfExpertise: ["node", "mongo"],
  },
  {
    id: "012",
    name: "Oliver Queen",
    yearsOfExperience: 1,
    areaOfExpertise: ["node", "mongo", "talk"],
  },
];

export default function Home() {
  return (
    <main>
      <div className="w-full space-y-6 p-5 md:w-1/3">
        {dentists.map((dentist, idx) => (
          <DentistCard key={idx} dentist={dentist} />
        ))}
      </div>
    </main>
  );
}
