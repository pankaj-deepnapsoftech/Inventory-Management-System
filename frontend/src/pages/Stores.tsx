import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddStoreDrawer,
  closeStoreDetailsDrawer,
  closeUpdateStoreDrawer,
  openAddStoreDrawer,
  openStoreDetailsDrawer,
  openUpdateStoreDrawer,
} from "../redux/reducers/drawersSlice";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import StoreTable from "../components/Table/StoreTable";
import AddStore from "../components/Drawers/Store/AddStore";
import StoreDetails from "../components/Drawers/Store/StoreDetails";
import UpdateStore from "../components/Drawers/Store/UpdateStore";
import { useDeleteStoresMutation } from "../redux/api/api";

const Stores: React.FC = () => {
  const [isLoadingStores, setIsLoadingStores] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [storeId, setStoreId] = useState<string | undefined>(); // Store Id to be updated or deleted
  const [stores, setStores] = useState<any>([]);
  const [filteredStores, setFilteredStores] = useState<any>([]);
  const {
    isAddStoreDrawerOpened,
    isUpdateStoreDrawerOpened,
    isStoreDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [cookies] = useCookies();

  const [deleteStore] = useDeleteStoresMutation();

  const openAddStoreDrawerHandler = () => {
    dispatch(openAddStoreDrawer());
  };

  const closeAddStoreDrawerHandler = () => {
    dispatch(closeAddStoreDrawer());
  };

  const openUpdateStoreDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openUpdateStoreDrawer());
  };

  const closeUpdateStoreDrawerHandler = () => {
    dispatch(closeUpdateStoreDrawer());
  };

  const openStoreDetailsDrawerHandler = (id: string) => {
    setStoreId(id);
    dispatch(openStoreDetailsDrawer());
  };

  const closeStoreDetailsDrawerHandler = () => {
    dispatch(closeStoreDetailsDrawer());
  };

  const fetchStoresHandler = async () => {
    try {
      setIsLoadingStores(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "store/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setStores(data.stores);
      setFilteredStores(data.stores);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsLoadingStores(false);
    }
  };

  const deleteStoreHandler = async (id: string) => {
    try {
      const response = await deleteStore(id).unwrap();
      toast.success(response.message);
      fetchStoresHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchStoresHandler();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    const results = stores.filter((st: any) => (
        st.name?.toLowerCase()?.includes(searchTxt) ||
        st.gst_number?.toLowerCase()?.includes(searchTxt) ||
        st.address_line1?.toString()?.toLowerCase()?.toString().includes(searchTxt) ||
        st.address_line2?.toLowerCase()?.includes(searchTxt) ||
        st.pincode?.toString().toString().includes(searchTxt) ||
        st?.city?.toString()?.includes(searchTxt) ||
        st?.state?.toString()?.includes(searchTxt) ||
        (st?.createdAt &&
          new Date(st?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
        (st?.updatedAt &&
          new Date(st?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchTxt?.replaceAll("/", "") || ""))
      ));
    setFilteredStores(results);
  }, [searchKey]);

  return (
    <div>
      <div>
        {/* Add Store Drawer */}
        {isAddStoreDrawerOpened && (
          <AddStore
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeAddStoreDrawerHandler}
          />
        )}
        {/* Update Store Drawer */}
        {isUpdateStoreDrawerOpened && (
          <UpdateStore
            storeId={storeId}
            fetchStoresHandler={fetchStoresHandler}
            closeDrawerHandler={closeUpdateStoreDrawerHandler}
          />
        )}
        {/* Store Details Drawer */}
        {isStoreDetailsDrawerOpened && (
          <StoreDetails
            storeId={storeId}
            closeDrawerHandler={closeStoreDetailsDrawerHandler}
          />
        )}
        {/* Stores Page */}
        <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
          <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
            Stores
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
              onClick={fetchStoresHandler}
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
              onClick={openAddStoreDrawerHandler}
              color="white"
              backgroundColor="#1640d6"
            >
              Add New Store
            </Button>
          </div>
        </div>

        <div>
          <StoreTable
            stores={filteredStores}
            isLoadingStores={isLoadingStores}
            deleteStoreHandler={deleteStoreHandler}
            openStoreDetailsDrawerHandler={openStoreDetailsDrawerHandler}
            openUpdateStoreDrawerHandler={openUpdateStoreDrawerHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Stores;
