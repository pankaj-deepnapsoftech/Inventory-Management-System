import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AgentTable from "../components/Table/AgentTable";
import {
  closeAddSellerDrawer,
  closeSellerDetailsDrawer,
  closeUpdateSellerDrawer,
  openAddSellerDrawer,
  openSellerDetailsDrawer,
  openUpdateSellerDrawer,
} from "../redux/reducers/drawersSlice";
import AddSeller from "../components/Drawers/Seller/AddSeller";
import UpdateSeller from "../components/Drawers/Seller/UpdateSeller";
import { useDeleteAgentMutation } from "../redux/api/api";
import SellerDetails from "../components/Drawers/Seller/SellerDetails";

const Sellers: React.FC = () => {
  const [sellerId, setSellerId] = useState<string | undefined>();
  const [isSellersLoading, setIsSellersLoading] = useState<boolean>(false);
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [sellers, setSellers] = useState<any[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);

  const dispatch = useDispatch();
  const {
    isAddSellerDrawerOpened,
    isUpdateSellerDrawerOpened,
    isSellerDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);

  const [deleteSeller] = useDeleteAgentMutation();

  const openAddSellerDrawerHandler = () => {
    dispatch(openAddSellerDrawer());
  };
  const closeAddSellerDrawerHandler = () => {
    dispatch(closeAddSellerDrawer());
  };
  const openUpdateSellerDrawerHandler = (id: string) => {
    setSellerId(id);
    dispatch(openUpdateSellerDrawer());
  };
  const closeUpdateSellerDrawerHandler = () => {
    dispatch(closeUpdateSellerDrawer());
  };
  const openSellerDetailsDrawerHandler = (id: string) => {
    setSellerId(id);
    dispatch(openSellerDetailsDrawer());
  };
  const closeSellerDetailsDrawerHandler = () => {
    dispatch(closeSellerDetailsDrawer());
  };

  const deleteSellerHandler = async (id: string) => {
    try {
      const response = await deleteSeller(id).unwrap();
      toast.success(response.message);
      fetchSellersHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchSellersHandler = async () => {
    try {
      setIsSellersLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/suppliers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (!data.success) {
        throw new Error(data.message);
      }
      setSellers(data.agents);
      setFilteredSellers(data.agents);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsSellersLoading(false);
    }
  };

  useEffect(() => {
    fetchSellersHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = sellers.filter(
      (seller: any) =>
        seller.name?.toLowerCase()?.includes(searchTxt) ||
        seller.email?.toLowerCase()?.includes(searchTxt) ||
        seller.phone?.toLowerCase()?.includes(searchTxt) ||
        seller?.gst_number?.toLowerCase()?.includes(searchTxt) ||
        seller.company_name.toLowerCase().includes(searchTxt) ||
        seller.company_email.toLowerCase().includes(searchTxt) ||
        seller.company_phone.toLowerCase().includes(searchTxt) ||
        seller.address_line1.toLowerCase().includes(searchTxt) ||
        seller?.address_line2?.toLowerCase()?.includes(searchTxt) ||
        seller?.pincode?.toLowerCase()?.includes(searchTxt) ||
        seller.city.toLowerCase().includes(searchTxt) ||
        seller.state.toLowerCase().includes(searchTxt) ||
        (seller?.createdAt &&
          new Date(seller?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (seller?.updatedAt &&
          new Date(seller?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
    );
    setFilteredSellers(results);
  }, [searchKey]);

  return (
    <div>
      {/* Add Seller */}
      {isAddSellerDrawerOpened && (
        <AddSeller
          closeDrawerHandler={closeAddSellerDrawerHandler}
          fetchSellersHandler={fetchSellersHandler}
        />
      )}
      {/* Update Seller */}
      {isUpdateSellerDrawerOpened && (
        <UpdateSeller
          closeDrawerHandler={closeUpdateSellerDrawerHandler}
          sellerId={sellerId}
          fetchSellersHandler={fetchSellersHandler}
        />
      )}
      {/* Seller Details */}
      {isSellerDetailsDrawerOpened && (
        <SellerDetails
          sellerId={sellerId}
          closeDrawerHandler={closeSellerDetailsDrawerHandler}
        />
      )}

      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Suppliers
        </div>

        <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 gap-x-2 w-full md:w-fit">
          <textarea
            className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none border-[#bbbbbb] bg-[#bdbdbdd9]"
            rows={1}
            //   width="220px"
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchSellersHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddSellerDrawerHandler}
            color="white"
            backgroundColor="#1640d6"
          >
            Add New Supplier
          </Button>
        </div>
      </div>

      <div>
        <AgentTable
          agents={filteredSellers}
          openUpdateAgentDrawerHandler={openUpdateSellerDrawerHandler}
          openAgentDetailsDrawerHandler={openSellerDetailsDrawerHandler}
          isLoadingAgents={isSellersLoading}
          deleteAgentHandler={deleteSellerHandler}
        />
      </div>
    </div>
  );
};

export default Sellers;
