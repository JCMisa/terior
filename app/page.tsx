import { NavbarComponent } from "@/components/custom/Navbar";
import Hero from "../components/custom/Hero";
import { getCurrentUser } from "@/lib/actions/users";

export default async function Home() {
  const currentUser = await getCurrentUser();

  let user;
  if (currentUser && currentUser.success && currentUser.data) {
    user = currentUser.data;
  }

  return (
    <main className="relative px-10 lg:px-0 ">
      <NavbarComponent />

      <Hero user={user as UserType} />
    </main>
  );
}
