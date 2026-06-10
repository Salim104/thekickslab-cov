import HeroSlider from "@/sections/HeroSlider";
import FeaturesStrip from "@/sections/FeaturesStrip";
import BestSelling from "@/sections/BestSelling";
import Deals from "@/sections/Deals";
import ShopAll from "@/sections/ShopAll";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturesStrip />
      <BestSelling />
      <Deals />
      <ShopAll />
    </>
  );
}
