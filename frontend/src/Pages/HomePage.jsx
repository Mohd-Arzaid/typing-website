import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import TypingBox from "../Components/TypingBox";

const HomePage = () => {
  const [chromeVisible, setChromeVisible] = useState(true);

  return (
    <div
      className={[
        "grid min-h-screen w-full grid-rows-[auto_1fr_auto] items-center gap-3 px-3 py-4 text-center sm:px-4 md:gap-3 md:px-6 md:py-6",
        !chromeVisible &&
          "[&_.chrome]:pointer-events-none [&_.chrome]:opacity-15",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="chrome transition-opacity duration-300">
        <Header />
      </div>
      <TypingBox onChromeVisibilityChange={setChromeVisible} />
      <div className="chrome transition-opacity duration-300">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
