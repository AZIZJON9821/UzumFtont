import { BannerSlider } from "@/components/home/BannerSlider";
import { CategorySlider } from "@/components/home/CategorySlider";
import { ProductsWidget } from "@/components/home/ProductsWidget";

export default function Home() {
  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Banner Slider */}
        <BannerSlider />

        {/* Kategoriyalar */}
        <div className="my-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Kategoriyalar</h2>
          <CategorySlider />
        </div>

        {/* Mahsulotlar Vidjetlari */}
        <ProductsWidget title="Mashxur" sortBy="popular" limit={10} />

        <ProductsWidget title="Yangi" sortBy="newest" limit={10} />

        <ProductsWidget title="Arzon" sortBy="price_asc" limit={10} />
      </div>
    </div>
  );
}
