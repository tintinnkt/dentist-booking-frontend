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
interface DentistDetailsProps extends DentistProps {
  comments: Array<Comment>;
}
const DentistDetailsMock: DentistDetailsProps = {
  id: "001",
  _id: "001",
  user: {
    name: "Ollie",
  },
  yearsOfExperience: 1,
  areaOfExpertise: ["Orthodontics", "Periodontics", "Oral Surgery"],
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
      <section className="m-1 flex items-center justify-between md:col-span-9">
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
              {/* <CustomButton
                      hideTextOnMobile={true}
                      useFor="add-booking-section"
                      onClick={handleAppointmentBooking}
                      disabled={!appDate || !appTime || isCreating}
                      className="w-full"
                      isLoading={isCreating}
                    >
                      {isCreating ? "Booking..." : "Book Appointment"}
                    </CustomButton> */}
            </CardFooter>
          </CardHeader>
        </Card>
      </section>
    </main>
  );
};

export default DentistDetails;
