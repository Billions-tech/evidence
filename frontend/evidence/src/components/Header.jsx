import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaBuilding, FaUserCircle, FaPowerOff } from "react-icons/fa";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="mx-4 shadow-lg mb-4">
      {/* Business Info */}
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-4">
          {user?.logo ? (
            <img
              src={user.logo}
              alt="Logo"
              className="w-14 h-14 rounded-full border-4 border-indigo-400 bg-white object-cover"
            />
          ) : (
            <FaBuilding className="w-14 h-14 text-indigo-400 bg-white rounded-full p-2" />
          )}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-2">
              {user?.businessName || user?.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="focus:outline-none">
            <FaUserCircle className="text-3xl text-indigo-300" />
          </Link>
          <button
            title="Logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="focus:outline-none"
          >
            <FaPowerOff className="text-3xl text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
