import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddEmployeeDrawer,
  closeEmployeeDetailsDrawer,
  closeUpdateEmployeeDrawer,
  openAddEmployeeDrawer,
  openEmployeeDetailsDrawer,
  openUpdateEmployeeDrawer,
} from "../redux/reducers/drawersSlice";
import EmployeeTable from "../components/Table/EmployeeTable";
import EmployeeDetails from "../components/Drawers/Employee/EmployeeDetails";
import UpdateEmployee from "../components/Drawers/Employee/UpdateEmployee";
import { FiSearch } from "react-icons/fi";

const Employees: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("employee");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  const { isUpdateEmployeeDrawerOpened, isEmployeeDetailsDrawerOpened } =
    useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();

  const openUpdateEmployeeDrawerHandler = (id: string) => {
    setEmployeeId(id);
    dispatch(openUpdateEmployeeDrawer());
  };

  const closeUpdateEmployeeDrawerHandler = () => {
    dispatch(closeUpdateEmployeeDrawer());
  };

  const openEmployeeDetailsDrawerHandler = (id: string) => {
    setEmployeeId(id);
    dispatch(openEmployeeDetailsDrawer());
  };

  const closeEmployeeDetailsDrawerHandler = () => {
    dispatch(closeEmployeeDetailsDrawer());
  };

  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(false);

  const fetchEmployeesHandler = async () => {
    try {
      setIsLoadingEmployees(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "auth/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) {
        throw new Error(results?.message);
      }
      setData(results.users);
      setFilteredData(results.users);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployeesHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (emp: any) =>
        emp.first_name?.toLowerCase()?.includes(searchTxt) ||
        emp.last_name?.toLowerCase().includes(searchTxt) ||
        emp.email.toLowerCase()?.includes(searchTxt) ||
        emp.phone.toLowerCase().toString().includes(searchTxt) ||
        emp?.role?.role?.toLowerCase()?.includes(searchTxt) ||
        (emp?.createdAt &&
          new Date(emp?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (emp?.updatedAt &&
          new Date(emp?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div>
      {/* Update Employee Drawer */}
      {isUpdateEmployeeDrawerOpened && (
        <UpdateEmployee
          closeDrawerHandler={closeUpdateEmployeeDrawerHandler}
          employeeId={employeeId}
          fetchEmployeesHandler={fetchEmployeesHandler}
        />
      )}
      {/* Employee Details Drawer */}
      {isEmployeeDetailsDrawerOpened && (
        <EmployeeDetails
          closeDrawerHandler={closeEmployeeDetailsDrawerHandler}
          employeeId={employeeId}
        />
      )}

      {/* Employees Page */}
      <div className=" border border-red-500 justify-start gap-y-1 ">
        <div className=" text-center text-lg md:text-2xl font-bold items-center gap-y-1">
          Employees
        </div>
        <br />
        <div className="flex flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0 relative">
          {/* Search Wrapper */}
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              className="pl-10 pr-4 py-2 w-full text-sm rounded-[5px] border border-gray-300 bg-white shadow-sm focus:outline-none"
              placeholder="Search roles..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>

          {/* Refresh Button */}
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            onClick={fetchEmployeesHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#2e2e4f"
            borderColor="#2e2e4f"
            variant="outline"
            className="whitespace-nowrap"
          >
            Refresh
          </Button>
        </div>

      </div>

      <div>
        <EmployeeTable
          employees={filteredData}
          openEmployeeDetailsDrawerHandler={openEmployeeDetailsDrawerHandler}
          openUpdateEmployeeDrawerHandler={openUpdateEmployeeDrawerHandler}
          isLoadingEmployees={isLoadingEmployees}
        />
      </div>
    </div>
  );
};

export default Employees;
