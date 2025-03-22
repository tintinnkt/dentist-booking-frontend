"use client";
import { CustomButton } from "@/components/CustomButton";
import { FrontendRoutes } from "@/conifg/apiRoutes";
import { useRouter } from "next/navigation";

const Page = () => {
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
    </main>
  );
};
export default Page;
