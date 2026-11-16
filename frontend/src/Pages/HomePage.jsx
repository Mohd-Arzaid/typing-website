import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import TypingBox from "../Components/TypingBox";

const HomePage = () => {
  const [chromeVisible, setChromeVisible] = useState(true);

  return (
    <div
      className={[
        "grid min-h-screen w-full grid-rows-[auto_1fr_auto] gap-0 px-6 py-0 text-center",
        !chromeVisible &&
          "[&_.chrome]:pointer-events-none [&_.chrome]:opacity-10",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="chrome shrink-0 transition-opacity duration-400 ease-in-out">
        <Header />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-2">
        <TypingBox onChromeVisibilityChange={setChromeVisible} />
      </div>

      <div className="chrome shrink-0 pb-4 transition-opacity duration-400 ease-in-out">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
