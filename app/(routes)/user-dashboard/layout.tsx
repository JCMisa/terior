import { NavbarComponent } from "@/components/custom/Navbar";
import { navItemsDashboard } from "@/constants";
import React from "react";

const UserDashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="relative py-20 px-10">
      <NavbarComponent navItems={navItemsDashboard} />
      {children}
    </main>
  );
};

export default UserDashboardLayout;
