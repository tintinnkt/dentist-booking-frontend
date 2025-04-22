"use client";

import { FrontendRoutes } from "@/config/apiRoutes";
import { useRouter } from "next/navigation";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  return (
    <main>
      <div className="m-8 flex justify-center text-3xl font-bold">
        Dental Clinic Dentist Dashboard
      </div>

      <div className="container mx-auto mb-6 px-6">
        <button
          className="mr-2 rounded bg-white px-4 py-1 text-sm font-semibold text-black"
          onClick={() => router.push(FrontendRoutes.DENTIST)}
        >
          Schedules
        </button>

        <button
          className="mr-2 rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={() => router.push(FrontendRoutes.DENTIST_COMMENT)}
        >
          Comment
        </button>

        <button
          className="rounded bg-orange-400 px-4 py-1 text-sm font-semibold text-black hover:bg-white"
          onClick={() => router.push(FrontendRoutes.DENTIST_HOLIDAY)}
        >
          Holidays
        </button>
      </div>

      <div className="flex w-full justify-center">{children}</div>
    </main>
  );
};

export default Layout;
