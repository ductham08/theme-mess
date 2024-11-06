import BannerHome from "Components/banners/bannerHome";
import Brands from "Components/brands/brands";
import CardBestIdeas from "Components/cards/cardBestIdeas";
import CardBestUserExperience from "Components/cards/cardBestUserExperience";
import CardOurProjects from "Components/cards/cardOurProjects";
import CardWhatWeProvide from "Components/cards/cardWhatWeProvide";
import SliderHome from "Components/slider/sliderHome";
import BannerNewsLetter from "Components/banners/bannerNewsLetter";
import { useRef } from "react";
import Navbar from "Layout/navbar";
import Footer from "Layout/footer";
import "../main.css"
import 'leaflet/dist/leaflet.css';

const Home = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  const navigateToBottomHandler = () => {
    if (elementRef?.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  }

  return (
    <>
      <Navbar />
        <main>
          <BannerHome navigateHandler={navigateToBottomHandler} />
          <div className="lg:container xl:px-40 px-4 mx-auto">
            <Brands ref={elementRef} />
            <CardOurProjects />
            <CardWhatWeProvide />
            <CardBestUserExperience />
            <CardBestIdeas />
            <SliderHome />
            <BannerNewsLetter />
          </div>
        </main>
      <Footer />
      
    </>
  );
};

export default Home;
