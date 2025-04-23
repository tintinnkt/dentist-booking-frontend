"use client";
import { CustomButton } from "@/components/CustomButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { FrontendRoutes } from "@/config/apiRoutes";
import { DentistProps } from "@/types/api/Dentist";
import { useRouter } from "next/navigation";
interface Comment {
  owner_id: string;
  comment_id: string;
  message: string;
}
interface OffHour {
  owner: string;
  _id: string;
  startDate: Date;
  endDate: Date;
  description: string;
  isForAllDentist: boolean;
}
interface DentistDetailsProps extends DentistProps {
  comments?: Array<Comment>;
  offHour?: OffHour[];
}
const DentistDetailsMock: DentistDetailsProps = {
  id: "001",
  _id: "001",
  user: {
    name: "Ollie",
  },
  yearsOfExperience: 1,
  areaOfExpertise: ["Orthodontics", "Periodontics", "Oral Surgery"],
  offHour: [
    {
      _id: "001",
      owner: "121",
      startDate: new Date(),
      endDate: new Date(),
      description: "SongKran",
      isForAllDentist: true,
    },
    {
      _id: "002",
      owner: "121",
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      isForAllDentist: false,
    },
  ],

  comments: [
    {
      comment_id: "001",
      owner_id: "02",
      message: "Very good",
    },
  ],
};

const DentistDetails = () => {
  const router = useRouter();
  // const { dentist_id } = useParams<{ dentist_id: string }>();
  // const {
  //   data: DentistDetailsProps,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["DENTIST_DETAIL", dentist_id],
  //   queryFn: async () => {
  //     await axios.get(BackendRoutes.DENTIST + `/${dentist_id}`);
  //   },
  // });
  return (
    <main className="mx-auto max-w-screen-xl space-y-4 gap-x-5 md:grid-cols-10 md:space-y-0 md:pt-4 lg:grid lg:py-8">
      <section className="px-3 pb-2 md:col-span-1 md:pb-4 lg:pb-0">
        <CustomButton
          useFor="back"
          onClick={() => {
            router.push(FrontendRoutes.DENTIST_LIST);
          }}
        />
      </section>
      <section className="m-1 flex flex-col items-center justify-between space-y-2 md:col-span-9">
        <Card className="w-full rounded-3xl bg-white p-5 shadow-md shadow-neutral-200 sm:p-8">
          <CardHeader>
            <CardTitle className="text-4xl">
              {DentistDetailsMock.user.name}
            </CardTitle>
            <CardContent className="prose-h4:font-bold prose-p:max-sm:indent-2 grid w-fit gap-2 sm:grid-cols-2 lg:gap-x-4">
              <div>year</div>
              <div>12</div>
              <div>area of expretises</div>
              <ul>
                {DentistDetailsMock.areaOfExpertise.map((expertise, index) => (
                  <li key={index}>{expertise}</li>
                ))}
              </ul>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end space-x-3">
              <CustomButton useFor="edit" />
              <CustomButton useFor="delete-dentist" />
            </CardFooter>
          </CardHeader>
        </Card>
        <h2>Unavalible Date</h2>
        <ul className="w-full max-w-md list-disc">
          {DentistDetailsMock.offHour?.map((offHour, index) => (
            <li key={index} className="flex w-full space-x-3">
              <div>{offHour.startDate.toDateString()}</div>
              <div>{offHour.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default DentistDetails;
