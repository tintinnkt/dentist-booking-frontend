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
    name: "Comments",
    route: FrontendRoutes.COMMENT,
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
    <main className="flex w-full flex-col items-center">
      <div className="m-8 flex justify-center text-3xl font-bold">
        Dental Clinic {user?.role === Role_type.ADMIN ? "Admin" : "Dentist"}{" "}
        Dashboard
      </div>

      <div className="container mx-auto mb-6 flex flex-wrap px-6">
        {user?.role === Role_type.ADMIN ? (
          <>
            <DashboardNavItem name="Management" route={FrontendRoutes.ADMIN} />
            <DashboardNavItem name="User" route={FrontendRoutes.USER} />
          </>
        ) : (
          <DashboardNavItem name="Schedules" route={FrontendRoutes.DASHBOARD} />
        )}
        {managementRoutes.map(({ name, route }, index) => (
          <DashboardNavItem key={index} name={name} route={route} />
        ))}
      </div>

      <div className="flex w-full items-center justify-center sm:w-4/5">
        {children}
      </div>
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
        "mr-2 mb-2 rounded px-4 py-1 text-sm font-semibold text-black",
        pathName === route ? "bg-white" : "bg-orange-400",
      )}
      onClick={() => router.push(route)}
    >
      {name}
    </Button>
  );
};
