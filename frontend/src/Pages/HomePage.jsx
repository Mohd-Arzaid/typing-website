import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import TypingBox from "../Components/TypingBox";

const HomePage = () => {
  const [restartKey, setRestartKey] = useState(0);

  const handleLogoClick = () => {
    setRestartKey((k) => k + 1);
  };

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr_auto] gap-0 px-6 py-0 text-center">
      <div className="shrink-0">
        <Header onLogoClick={handleLogoClick} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-2">
        <TypingBox key={restartKey} />
      </div>

      <div className="shrink-0 pb-4">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
