import Image from "next/image";
import logo from "../app/logo.png";
const Header = () => {
  return (
    <header className="mb-4 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
        {/* <Wallet className="text-blue-600" /> */}
        <Image src={logo} alt="Financial Log Book" width={40} height={40} />
        <span className=" sm:inline">Financial Log Book</span>
      </h1>
      <p className="text-gray-600 text-sm md:text-base mt-1">
        Track income & expenses
      </p>
    </header>
  );
};

export default Header;
