import { FaAngleDown, FaAngleUp, FaSignOutAlt } from "react-icons/fa";
import routes from "../../routes/routes";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import logo from "../../assets/images/logo/logo.png";
 

const Navigation: React.FC = () => {
  const { allowedroutes, isSuper } = useSelector((state: any) => state.auth);
  const [checkMenu, setCheckMenu] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcon(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


   const handleCloseMenu =()=>{
         if(window.innerWidth < 800){
          setCheckMenu(false)
         }
   }


  const toggleSubMenusHandler = (path: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="absolute top-4 left-4 z-50 md:hidden">
        <div onClick={() => setCheckMenu(!checkMenu)}>
          {checkMenu ? (
            <IoCloseSharp
              size={30}
              className={`transition-all duration-50 ease-in absolute left-[12rem] text-white ${
                showIcon ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            />
          ) : (
            <RiMenu2Line size={30} className="text-black" />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`bg-gradient-to-b from-[#1c1c36] to-[#10223a]  text-white h-full overflow-auto md:block ${
          checkMenu ? "block" : "hidden"
        } transition-all duration-300 ease-in-out
        fixed z-40 w-64 md:w-auto top-0 left-0 px-3 py-3`}
      >
        {/* Logo */}
        <div className="pt-4 pb-4">
    <img src={logo} alt="blogger" className="w-[190px] filter invert" />
        </div>
        <hr className=" border-1.5 w-[180px] ml-4  relative top-10 border-gray-300" />

        {/* Menu List */}
        <ul className="pt-[50px]">
          {routes.map((route, ind) => {
            const isAllowed =
              isSuper || allowedroutes.includes(route.path.replaceAll("/", ""));

            if (route.isSublink) {
              return (
                <div key={ind}>
                  <li
                    className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#383433] to-[#36312e] hover:text-white text-[15px] font-semibold"
                    onClick={() => toggleSubMenusHandler(route.path)}
                    style={{
                      cursor: isAllowed ? "pointer" : "not-allowed",
                      opacity: isAllowed ? 1 : 0.5,
                      pointerEvents: isAllowed ? "auto" : "none",
                    }}
                  >
                    <span>{route.icon}</span>
                    <span>{route.name}</span>
                    <span className="pt-1">
                      {openSubMenus[route.path] ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </li>
                  {openSubMenus[route.path] &&
                    route.sublink?.map((sublink, index) => (
                      <NavLink 
                      onClick={handleCloseMenu}
                        key={index}
                        to={route.path + "/" + sublink.path}
                        style={{
                          cursor: isAllowed ? "pointer" : "not-allowed",
                          opacity: isAllowed ? 1 : 0.5,
                          pointerEvents: isAllowed ? "auto" : "none",
                        }}
                      >
                        <li className="flex gap-x-2 pl-5 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#383433] to-[#36312e] hover:text-white text-[15px] font-semibold">
                          <span>{sublink.icon}</span>
                          <span>{sublink.name}</span>
                        </li>
                      </NavLink>
                    ))}
                </div>
              );
            } else if (route.name === "Approval" && isSuper) {
              return (
                <NavLink
                onClick={handleCloseMenu}
                  key={ind}
                  to={route.path || ""}
                  style={{
                    cursor: isAllowed ? "pointer" : "not-allowed",
                    opacity: isAllowed ? 1 : 0.5,
                    pointerEvents: isAllowed ? "auto" : "none",
                  }}
                >
                  <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#383433] to-[#36312e] hover:text-white text-[15px] font-semibold">
                    <span>{route.icon}</span>
                    <span>{route.name}</span>
                  </li>
                </NavLink>
              );
            } else if (route.name !== "Approval") {
              return (
                <NavLink
                onClick={handleCloseMenu}
                  key={ind}
                  to={route.path || ""}
                  style={{
                    cursor: isAllowed ? "pointer" : "not-allowed",
                    opacity: isAllowed ? 1 : 0.5,
                    pointerEvents: isAllowed ? "auto" : "none",
                  }}
                >
                  <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-gradient-to-b from-[#383433] to-[#36312e] hover:text-whitetext-[15px] font-semibold">
                    <span>{route.icon}</span>
                    <span>{route.name}</span>
                  </li>
                </NavLink>
              );
            }
          })}
        </ul>
        <hr className="my-4 border-1.5 w-[180px] ml-4 relative top-0 border-gray-300" />
        <div className="mt-[150px]">
    <button className="flex items-center justify-center ml-4 h-[35px] w-[150px] gap-2 bg-gradient-to-r from-red-500 to-red-700 hover:bg-red-600 text-white py-2 rounded-md transition-all">
      Log Out
      <FaSignOutAlt />
    </button>
  </div>
      </div>
    </>
  );
};

export default Navigation;