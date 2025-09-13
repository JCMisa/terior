import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { BackgroundLines } from "@/components/ui/background-lines";
import { samplePeople } from "@/constants";
import { SignUp } from "@clerk/nextjs";
import { QuoteIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SignupPage = () => {
  return (
    <section className="">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative hidden lg:flex  items-end lg:col-span-5 h-full xl:col-span-6">
          <Link
            className="absolute top-10 left-10 z-50 flex items-center gap-2"
            href="/"
          >
            <span className="sr-only">Home</span>
            <Image src="/logo-long.png" alt="logo" width={100} height={100} />
          </Link>
          <BackgroundLines className="flex items-center justify-center w-full flex-col p-4 !bg-transparent ">
            <div className="flex flex-row items-center justify-center mb-10 w-full mt-14 lg:mt-0 md:hidden lg:flex">
              <AnimatedTooltip items={samplePeople} />
            </div>
            <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-lg md:text-xl lg:text-2xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight block md:hidden lg:block -mt-14">
              Design your interior, instantly.
            </h2>
            <p className="max-w-xl mx-auto text-xs md:text-sm text-neutral-700 dark:text-neutral-400 text-center block md:hidden xl:block">
              <QuoteIcon className="size-8 z-50" /> Before Terior, I felt
              overwhelmed by all the design choices for my living room. I spent
              hours on Pinterest and still couldn&apos;t visualize what would
              look good. With Terior, I simply uploaded a photo and got
              stunning, realistic design ideas in seconds. It took all the
              guesswork out of decorating and helped me find a style I truly
              love. It&apos;s an absolute game-changer for anyone who wants a
              beautiful space without the stress.
            </p>

            <div className="hidden lg:relative lg:block lg:p-12">
              <h2 className="mt-6 text-lg font-bold sm:text-2xl md:text-3xl">
                Discover a new vision for your home.
              </h2>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                Join Terior today and start transforming your living spaces with
                the power of AI. It&apos;s free, fast, and full of inspiration.
              </p>
            </div>
          </BackgroundLines>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl mt-40 md:mt-0">
            <SignUp />
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignupPage;
