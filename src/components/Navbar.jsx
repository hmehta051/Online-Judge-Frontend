import React from "react";
import { useLogoutUserMutation } from "../redux/slices/apiSlice";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaHome, FaInfoCircle } from "react-icons/fa";

const Navbar = () => {
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      localStorage.removeItem("userid");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      toast.error("Logout failed: ", err);
      console.error("Logout failed: ", err);
    }
  };

  return (
    <div className="w-full h-full shadow-lg p-4 flex items-center justify-between p-2 bg-gray-100">
      <img
        src="https://ik.imagekit.io/bksgfrlfg/logo_daad_dAnA.png?updatedAt=1716035561396"
        alt="CodeKing Logo"
        width={150}
        height={150}
        className="w-[150px] md:w-[150px] sm:w-[100px]"
      />

      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="text-[#527450]">
          <FaHome size={24} />
        </Link>
        <Link to="/about-us" className="text-[#527450]">
          <FaInfoCircle size={24} />
        </Link>
        <>{!Cookies.get("token") && <Link to="/login" className="text-[#527450]">Login</Link>}</>
        <>{Cookies.get("token") && <div onClick={handleLogout} className="text-[#527450]">Logout</div>}</>
      </div>
    </div>
  );
};

export default Navbar;
