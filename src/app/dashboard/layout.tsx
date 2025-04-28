"use client";

import { Button } from "@/components/ui/Button";
import { FrontendRoutes } from "@/config/apiRoutes";
import { Role_type } from "@/config/role";
import { useUser } from "@/hooks/useUser";
import { redirect, usePathname, useRouter } from "next/navigation";
import React from "react";
import { twJoin } from "tailwind-merge";

const managementRoutes: Array<{ name: string; route: FrontendRoutes }> = [
  {
    name: "Schedule",
    route: FrontendRoutes.DASHBOARD,
  },
  {
    name: "Holidays",
    route: FrontendRoutes.HOLIDAY,
  },
];

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = useUser();
  if (user?.role == Role_type.USER) redirect(FrontendRoutes.DENTIST_LIST);

  return (
    <main className="flex w-full flex-col items-center pb-3">
      <div className="m-8 flex justify-center text-3xl font-bold">
        Dental Clinic {user?.role === Role_type.ADMIN ? "Admin" : "Dentist"}{" "}
        Dashboard
      </div>
      <section className="flex w-full flex-col items-center sm:w-4/5">
        <div className="flex w-full flex-wrap space-x-1.5">
          {user?.role === Role_type.ADMIN ? (
            <>
              <DashboardNavItem name="Dentist" route={FrontendRoutes.ADMIN} />
              <DashboardNavItem name="User" route={FrontendRoutes.USER} />
            </>
          ) : null}
          {managementRoutes.map(({ name, route }, index) => (
            <DashboardNavItem key={index} name={name} route={route} />
          ))}
        </div>
        <div className="flex min-h-[600px] w-full justify-center rounded-tr-2xl rounded-b-xl bg-white p-8">
          {children}
        </div>
      </section>
    </main>
  );
};

export default Layout;

const DashboardNavItem = ({
  name,
  route,
}: {
  name: string;
  route: FrontendRoutes;
}) => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <Button
      className={twJoin(
        "rounded-none rounded-t-md px-4 py-1 text-sm font-semibold text-black",
        pathName === route ? "bg-white" : "bg-orange-400",
      )}
      onClick={() => router.push(route)}
    >
      {name}
    </Button>
  );
};
