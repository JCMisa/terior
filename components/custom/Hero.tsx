import Link from "next/link";
import { BackgroundRippleEffect } from "../ui/background-ripple-effect";
import { Button } from "../ui/button";
import { Spotlight } from "../ui/spotlight-new";

const Hero = ({ user }: { user: UserType }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden">
      <Spotlight />
      <BackgroundRippleEffect />
      <div className="mt-32 w-full">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          Redesign any room in seconds with{" "}
          <span className="bg-gradient-to-r from-primary-500 to-primary bg-clip-text text-transparent">
            Terior
          </span>
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          Upload a photo of your space and let Terior generate stunning,
          personalized interior designs instantly—no skills required.
        </p>

        <div className="flex items-center justify-center mt-4 gap-2 relative z-50">
          <Button className="cursor-pointer !relative !z-50 text-white" asChild>
            <Link
              href={
                !user
                  ? "/sign-in"
                  : user.role === "admin"
                  ? "/admin-dashboard"
                  : "/user-dashboard"
              }
              className="relative z-50"
            >
              Get Started
            </Link>
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer !relative !z-50"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
