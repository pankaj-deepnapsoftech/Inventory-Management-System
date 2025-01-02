import { FaAngleDown, FaAngleUp, FaRegCheckCircle } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineShoppingCart, MdOutlineSpeed } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";
import routes from "../../routes/routes";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const Navigation: React.FC = () => {
  const { allowedroutes, isSuper } = useSelector((state: any) => state.auth);

  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSubMenusHandler = (path: string) => {
    setOpenSubMenus((prev: { [key: string]: boolean }) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  return (
    <div className="h-[inherit] px-3 py-3 overflow-auto bg-[#fbfbfb]">
      <ul>
        {routes.map((route, ind) => {
          const isAllowed =
            isSuper || allowedroutes.includes(route.path.replaceAll("/", ""));
          // if(!isAllowed){
          //   return null;
          // }

          if (route.isSublink) {
            return (
              <div key={ind}>
                <li
                  key={ind}
                  className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                  onClick={() => toggleSubMenusHandler(route.path)}
                  style={{
                    cursor: isAllowed ? "pointer" : "not-allowed",
                    opacity: isAllowed ? 1 : 0.5,
                    pointerEvents: isAllowed ? "auto" : "none", // Disable click interaction
                  }}
                >
                  <span>{route.icon}</span>
                  <span>{route.name}</span>
                  <span className="pt-1">
                    {openSubMenus[route.path] ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </li>
                {openSubMenus[route.path] &&
                  route.sublink &&
                  route.sublink.map((sublink, index) => (
                    <NavLink
                      style={{
                        cursor: isAllowed ? "pointer" : "not-allowed",
                        opacity: isAllowed ? 1 : 0.5,
                        pointerEvents: isAllowed ? "auto" : "none", // Disable click interaction
                      }}
                      to={route.path + "/" + sublink.path}
                    >
                      <li
                        key={index}
                        className="flex gap-x-2 pl-5 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                      >
                        <span>{sublink.icon}</span>
                        <span>{sublink.name}</span>
                      </li>
                    </NavLink>
                  ))}
              </div>
            );
          }
          else if(route.name === "Approval" && isSuper){
            return (
              <NavLink style={{
                cursor: isAllowed ? "pointer" : "not-allowed",
                opacity: isAllowed ? 1 : 0.5,
                pointerEvents: isAllowed ? "auto" : "none",
              }} to={route.path || ""}>
                <li
                  key={ind}
                  className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                >
                  <span>{route.icon}</span>
                  <span>{route.name}</span>
                </li>
              </NavLink>
            );
          }
          else if(route.name !== "Approval") {
            return (
              <NavLink style={{
                cursor: isAllowed ? "pointer" : "not-allowed",
                opacity: isAllowed ? 1 : 0.5,
                pointerEvents: isAllowed ? "auto" : "none", // Disable click interaction
              }} to={route.path || ""}>
                <li
                  key={ind}
                  className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold"
                >
                  <span>{route.icon}</span>
                  <span>{route.name}</span>
                </li>
              </NavLink>
            );
          }
        })}

        {/* <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold">
          <span>
            <MdOutlineSpeed />
          </span>
          <span>Dashboard</span>
        </li>
        <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold">
          <span>
            <MdOutlineShoppingCart />
          </span>
          <span>Products</span>
        </li>
        <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold">
          <span>
            <FaRegCheckCircle />
          </span>
          <span>Approvals</span>
        </li>
        <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold">
          <span>
            <IoStorefrontOutline />
          </span>
          <span>Stores</span>
        </li>
        <li className="flex gap-x-2 pl-3 pr-9 py-3 rounded-lg hover:bg-[#e6efff] hover:text-[#1640d6] hover:cursor-pointer text-[15px] font-semibold">
          <span>
            <TbUsersGroup />
          </span>
          <span>Agents</span>
        </li> */}
      </ul>
    </div>
  );
};

export default Navigation;
