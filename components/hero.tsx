import { MapPin } from "lucide-react";
import { AuroraText } from "@/components/magicui/aurora-text";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-[50vh] mt-20 sm:mt-30">
      <div className="flex flex-col items-center text-center gap-6">
        
        {/* Location */}
       <div className="flex items-center gap-2 border border-foreground px-4 py-3 rounded-full text-foreground">
        <MapPin className="w-6 h-6" />
          <span className="font-semibold text-md">Waterford, Ireland</span>
        </div>


        {/* Name Block */}
       <div className="relative">
        {/* Desktop / Large screens */}
          <h1 className="hidden sm:block relative text-[9vw] font-extrabold leading-none z-10">
            SHREYAJ YADAV
          </h1>
          <span className="hidden sm:block absolute inset-0 -translate-y-[0%] text-[14vw] font-extrabold 
            text-gray-500/20 select-none pointer-events-none">
            श्रेयज यादव
          </span>

          {/* Mobile */}
          <div className="block sm:hidden relative w-full text-center leading-tight">
            <h1 className="relative z-20 text-[18vw] font-extrabold">
              SHREYAJ
            </h1>
            <span className="absolute inset-x-0 top-0 z-10 text-[22vw] font-extrabold text-gray-500/50 -translate-y-[-30%] select-none">
              श्रेयज
            </span>

            <h1 className="relative z-10 text-[18vw] font-extrabold mt-7">
              YADAV
            </h1>
            <span className="absolute inset-x-0 bottom-0 z-0 text-[22vw] font-extrabold text-gray-500/50 -translate-y-[-40%] select-none">
              यादव
            </span>
          </div>
          <div className="mt-12 sm:mt-35 text-center">
            <p className="text-lg sm:text-3xl font-medium tracking-wide text-foreground">
              Making things, breaking things, <AuroraText>learning always.</AuroraText>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
