import DentistCard from "@/components/DentistCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
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
      <div className="w-full space-y-6 p-5">
        {dentists.map((dentist, idx) => (
          <DentistCard key={idx} dentist={dentist} />
        ))}
        <Card>
          <CardHeader>
            <CardTitle>hello</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
