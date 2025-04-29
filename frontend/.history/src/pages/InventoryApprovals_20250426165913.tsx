import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import BOMRawMaterialTable from "../components/Table/BOMRawMaterialTable";

const InventoryApprovals: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(false);

  const fetchInventoryHandler = async () => {
    try {
      setIsLoadingInventory(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/unapproved/inventory/raw-materials",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const results = await response.json();
      if (!results.success) throw new Error(results?.message);
      setData(results.unapproved);
      setFilteredData(results.unapproved);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const approveRmHandler = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "bom/approve/inventory/raw-materials",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }),
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      fetchInventoryHandler();
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchInventoryHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter(
      (emp: any) =>
        emp.first_name?.toLowerCase()?.includes(searchTxt) ||
        emp.last_name?.toLowerCase()?.includes(searchTxt) ||
        emp.email?.toLowerCase()?.includes(searchTxt) ||
        emp.phone?.toLowerCase()?.includes(searchTxt) ||
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
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey]);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500 font-medium text-lg py-10">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white shadow-md rounded-lg px-4 py-5 md:px-6 md:py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
          <h1 className="text-2xl font-bold text-[#2D3748]">
            Inventory Approvals
          </h1>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1640d6] focus:border-transparent w-full md:w-64"
              placeholder="Search inventory..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button
              fontSize="14px"
              px="12px"
              py="3px"
              minWidth="100px"
              onClick={fetchInventoryHandler}
              leftIcon={<MdOutlineRefresh />}
              color="#1640d6"
              borderColor="#1640d6"
              variant="outline"
              _hover={{ bg: "#edf2ff" }}
            >
              Refresh
            </Button>
          </div>
        </div>

        <BOMRawMaterialTable
          products={filteredData}
          isLoadingProducts={isLoadingInventory}
          approveProductHandler={approveRmHandler}
        />
      </div>
    </div>
  );
};

export default InventoryApprovals;
