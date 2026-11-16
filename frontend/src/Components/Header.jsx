import LOGO from "../pastille-methode.svg";
import AccountCircle from "./AccountCircle";

const Header = () => {
  return (
    <header className="mx-auto flex w-full max-w-site items-center justify-between min-h-14">
      <div className="flex items-center gap-2.5">
        <img
          alt="logo"
          src={LOGO}
          className="block h-8 w-auto shrink-0 object-contain md:h-10"
        />
        <span className="select-none font-sans text-[1.05rem] font-bold leading-tight tracking-tight text-accent md:text-[1.35rem]">
          Typing Playground
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-muted">
        <AccountCircle />
      </div>
    </header>
  );
};

export default Header;
