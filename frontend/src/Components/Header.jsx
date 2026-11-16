import { Link, useLocation } from "react-router-dom";
import LOGO from "../pastille-methode.svg";
import AccountCircle from "./AccountCircle";

const Header = ({ onLogoClick }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const brandClass =
    "flex cursor-pointer items-center gap-2.5 no-underline";

  const brandContent = (
    <>
      <img
        alt=""
        src={LOGO}
        className="block h-10 w-auto shrink-0 object-contain"
      />
      <span className="select-none font-sans text-2xl font-bold leading-tight tracking-tight text-accent md:text-3xl">
        Typing Playground
      </span>
    </>
  );

  return (
    <header className="mx-auto flex min-h-14 w-full max-w-site items-center justify-between border-b border-border/60 px-0 py-3">
      {isHome && onLogoClick ? (
        <button
          type="button"
          onClick={onLogoClick}
          className={brandClass}
          aria-label="Restart typing test"
        >
          {brandContent}
        </button>
      ) : (
        <Link to="/" className={brandClass} aria-label="Typing Playground home">
          {brandContent}
        </Link>
      )}
      <div className="flex items-center gap-1.5 text-muted">
        <AccountCircle />
      </div>
    </header>
  );
};

export default Header;
