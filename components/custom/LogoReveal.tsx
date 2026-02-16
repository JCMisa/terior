import Image from "next/image";

export default function LogoReveal() {
  return (
    <div className="flex items-center p-0">
      {/* The 'group' class allows us to trigger animations on hover */}
      <div className="group flex items-end cursor-pointer select-none">
        {/* Image Container - On md and up: starts shifted right, slides to 0 on hover. On smaller screens: no shift */}
        <div className="relative z-10 md:translate-x-[35px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:group-hover:translate-x-0">
          <Image
            src={"/logo-short.png"}
            alt="logo"
            width={30}
            height={30}
            className="w-[30px] h-[30px]"
          />
        </div>

        {/* Text Container - Hidden on all screens, only visible with hover on md and up */}
        <div className="flex items-center overflow-hidden w-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:group-hover:w-[90px] md:group-hover:opacity-100">
          <span className="bg-gradient-to-r from-primary-500 to-primary bg-clip-text text-transparent text-lg font-extrabold">
            Terior
          </span>
        </div>
      </div>
    </div>
  );
}
