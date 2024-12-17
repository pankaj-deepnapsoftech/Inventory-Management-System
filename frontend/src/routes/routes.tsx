import { FaRegCheckCircle } from "react-icons/fa";
import { IoDocumentTextOutline, IoStorefrontOutline } from "react-icons/io5";
import { MdOutlineShoppingCart, MdOutlineSpeed, MdOutlineSell, MdOutlineAttachMoney, MdOutlinePayment, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { TbLockAccess, TbUsersGroup } from "react-icons/tb";
import { FaPeopleGroup } from "react-icons/fa6";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { VscServerProcess } from "react-icons/vsc";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Approvals from "../pages/Approvals";
import Stores from "../pages/Stores";
import Buyers from "../pages/Buyers";
import Sellers from "../pages/Sellers";
import BOM from "../pages/BOM";
import UserRole from "../pages/UserRoles";
import Employees from "../pages/Emloyees";
import ProformaInvoice from "../pages/ProformaInvoice";
import Invoice from "../pages/Invoice";
import Payment from "../pages/Payment";
import Process from "../pages/Process";

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
    name: "Sales & Purchase",
    path: "sales-purchase",
    icon: <BiPurchaseTagAlt />,
    sublink: [
      {
        name: "Proforma Invoices",
        icon: <IoDocumentTextOutline />,
        path: "proforma-invoice",
        element: <ProformaInvoice />,
      },
      {
        name: "Invoices",
        icon: <RiBillLine />,
        path: "invoice",
        element: <Invoice />,
      },
      {
        name: "Payments",
        icon: <MdOutlinePayment />,
        path: "payment",
        element: <Payment />,
      },
    ],
    isSublink: true
  },
  {
    name: "Inventory",
    icon: <MdOutlineShoppingCart />,
    path: "inventory",
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
    name: "Production",
    path: "production",
    icon: <MdOutlineProductionQuantityLimits />,
    sublink: [
      {
        name: "BOM",
        icon: <RiBillLine />,
        path: "bom",
        element: <BOM />,
      },
      {
        name: "Production Process",
        icon: <VscServerProcess />,
        path: "production-process",
        element: <Process />,
      },
    ],
    isSublink: true
  },
];

export default routes;
