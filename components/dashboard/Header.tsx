import { MdMenuOpen } from "react-icons/md";

type HeaderProps = {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ isCollapsed, setIsCollapsed }: HeaderProps) => {
  return (
    <div className="bg-white shadow rounded p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <MdMenuOpen
          className="text-4xl"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>
      <div>
        <button className="bg-red-600 text-white p-2 rounded cursor-pointer hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
