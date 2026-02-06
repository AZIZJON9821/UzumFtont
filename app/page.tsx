import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-4">
        {/* Main Banner Slider (Mock) */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden bg-gray-200 mb-8">
          {/* Placeholder for Banner Image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100 text-slate-400">
            <span className="text-xl">Katta Banner (Slider)</span>
          </div>
        </div>

        {/* Categories (Empty for now) */}
        <div className="mb-12">
          {/* Dynamic categories will be loaded here */}
        </div>

        {/* Products (Empty for now) */}
        <div>
          {/* Dynamic products will be loaded here */}
        </div>

      </div>
    </div>
  );
}
