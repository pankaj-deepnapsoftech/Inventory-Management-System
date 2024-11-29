import { FaRegCheckCircle } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineShoppingCart, MdOutlineSpeed, MdOutlineSell, MdOutlineAttachMoney } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { TbLockAccess, TbUsersGroup } from "react-icons/tb";
import { FaPeopleGroup } from "react-icons/fa6";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Approvals from "../pages/Approvals";
import Stores from "../pages/Stores";
import Buyers from "../pages/Buyers";
import Sellers from "../pages/Sellers";
import BOM from "../pages/BOM";
import UserRole from "../pages/UserRoles";
import Employees from "../pages/Emloyees";

const routes = [
  {
    name: "Dashboard",
    icon: <MdOutlineSpeed />,
    path: "",
    element: <Dashboard />,
    isSublink: false
  },
  {
    name: "User Roles",
    icon: <TbLockAccess />,
    path: "role",
    element: <UserRole />,
    isSublink: false
  },
  {
    name: "Employees",
    icon: <FaPeopleGroup />,
    path: "employee",
    element: <Employees />,
    isSublink: false
  },
  {
    name: "Product",
    icon: <MdOutlineShoppingCart />,
    path: "product",
    element: <Products />,
    isSublink: false
  },
  {
    name: "Store",
    icon: <IoStorefrontOutline />,
    path: "store",
    element: <Stores />,
    isSublink: false
  },
  {
    name: "Approval",
    icon: <FaRegCheckCircle />,
    path: "approval",
    element: <Approvals />,
    isSublink: false
  },
  {
    name: "Merchant",
    path: "merchant",
    icon: <TbUsersGroup />,
    sublink: [
      {
        name: "Buyer",
        icon: <MdOutlineAttachMoney />,
        path: "buyer",
        element: <Buyers />,
      },
      {
        name: "Supplier",
        icon: <MdOutlineSell />,
        path: "supplier",
        element: <Sellers />,
      },
    ],
    isSublink: true
  },
  {
    name: "BOM",
    icon: <RiBillLine />,
    path: "bom",
    element: <BOM />,
    isSublink: false
  },
];

export default routes;
