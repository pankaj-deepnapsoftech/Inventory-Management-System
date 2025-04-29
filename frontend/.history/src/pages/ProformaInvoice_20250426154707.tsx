import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ProformaInvoiceTable from "../components/Table/ProformaInvoiceTable";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { closeAddProformaInvoiceDrawer, closeProformaInvoiceDetailsDrawer, closeUpdateProformaInvoiceDrawer, openAddProformaInvoiceDrawer, openProformaInvoiceDetailsDrawer, openUpdateProformaInvoiceDrawer } from "../redux/reducers/drawersSlice";
import AddProformaInvoice from "../components/Drawers/Proforma Invoice/AddProformaInvoice";
import { useCookies } from "react-cookie";
import { MdOutlineRefresh } from "react-icons/md";
import { useDeleteProformaInvoiceMutation } from "../redux/api/api";
import ProformaInvoiceDetails from "../components/Drawers/Proforma Invoice/ProformaInvoiceDetails";
import UpdateProformaInvoice from "../components/Drawers/Proforma Invoice/UpdateProformaInvoice";

const ProformaInvoice: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("sale & purchase");
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingProformaInvoices] = useState<boolean>(false);
  const { isAddProformaInvoiceDrawerOpened, isUpdateProformaInvoiceDrawerOpened, isProformaInvoiceDetailsDrawerOpened } = useSelector((state: any) => state.drawers);
  const dispatch = useDispatch();
  const [id, setId] = useState<string | undefined>();

  const [deleteProformaInvoice] = useDeleteProformaInvoiceMutation();

  const openAddProformaInvoiceDrawerHandler = () => {
    dispatch(openAddProformaInvoiceDrawer());
  }
  const closeAddProformaInvoiceDrawerHandler = () => {
    dispatch(closeAddProformaInvoiceDrawer());
  }

  const openProformaInvoiceDetailsDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openProformaInvoiceDetailsDrawer());
  }
  const closeProformaInvoiceDetailsDrawerHandler = () => {
    dispatch(closeProformaInvoiceDetailsDrawer());
  }

  const openProformaInvoiceUpdateDrawerHandler = (id: string) => {
    setId(id);
    dispatch(openUpdateProformaInvoiceDrawer());
  }
  const closeProformaInvoiceUpdateDrawerHandler = () => {
    dispatch(closeUpdateProformaInvoiceDrawer());
  }

  const fetchProformaInvoiceHandler = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + 'proforma-invoice/all', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cookies?.access_token}`
        }
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setData(data.proforma_invoices);
      setFilteredData(data.proforma_invoices);
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    }
  }

  const deleteProformaInvoiceHandler = async (id: string) => {
    try {
      const response = await deleteProformaInvoice(id).unwrap();
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      fetchProformaInvoiceHandler();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  }

  useEffect(() => {
    fetchProformaInvoiceHandler();
  }, [])

  useEffect(() => {
    const searchText = searchKey?.toLowerCase();
    const results = data.filter(
      (pi: any) =>
        pi.creator.first_name?.toLowerCase()?.includes(searchText) ||
        pi?.creator?.last_name?.toLowerCase()?.includes(searchText) ||
        pi?.subtotal?.toString()?.toLowerCase()?.includes(searchText) ||
        pi?.total?.toString()?.toLowerCase()?.includes(searchText) ||
        pi?.supplier?.name?.toLowerCase()?.includes(searchText) ||
        pi?.buyer?.name?.toLowerCase()?.includes(searchText) ||
        (pi?.createdAt &&
          new Date(pi?.createdAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            .reverse()
            .join("")
            ?.includes(searchText?.replaceAll("/", "") || "")) ||
        (pi?.updatedAt &&
          new Date(pi?.updatedAt)
            ?.toISOString()
            ?.substring(0, 10)
            ?.split("-")
            ?.reverse()
            ?.join("")
            ?.includes(searchText?.replaceAll("/", "") || ""))
    );
    setFilteredData(results);
  }, [searchKey])

  if (!isAllowed) {
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div className=" bg-white shadow-2xl  mx-2 rounded-md h-full">

      {isAddProformaInvoiceDrawerOpened && <AddProformaInvoice closeDrawerHandler={closeAddProformaInvoiceDrawerHandler} fetchProformaInvoicesHandler={fetchProformaInvoiceHandler} />}
      {isProformaInvoiceDetailsDrawerOpened && <ProformaInvoiceDetails closeDrawerHandler={closeProformaInvoiceDetailsDrawerHandler} id={id} />}
      {isUpdateProformaInvoiceDrawerOpened && <UpdateProformaInvoice closeDrawerHandler={closeProformaInvoiceUpdateDrawerHandler} id={id} fetchProformaInvoicesHandler={fetchProformaInvoiceHandler} />}

      <div>

        <h1 className=" text-center font-[600] pb-4 text-xl"> Proforma Invoices</h1>


        <div className="mt-2  flex justify-center gap-y-1 it gap-x-2 w-full">
    
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddProformaInvoiceDrawerHandler}
            color="white"
            backgroundColor="#2D3748"
             _hover={{ bg: "#2D374820", color: "white" }}
             >
           <p  class> Add New Proforma Invoice</p>
          </Button>
          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchProformaInvoiceHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#2D3748"
            borderColor="#2D3748"
            variant="outline"
            _hover={{ bg: "#2D3748", color: "white" }}
          >
            Refresh
          </Button>
          <textarea
            className="rounded-[10px]  px-2 py-2 md:px-3 md:py-2 text-sm  border resize-none "
            rows={1}
            placeholder="Search"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />

        </div>
      </div>

      <div>
        <ProformaInvoiceTable isLoadingProformaInvoices={isLoadingProformaInvoices} proformaInvoices={filteredData} deleteProformaInvoiceHandler={deleteProformaInvoiceHandler} openProformaInvoiceDetailsHandler={openProformaInvoiceDetailsDrawerHandler} openUpdateProformaInvoiceDrawer={openProformaInvoiceUpdateDrawerHandler} />
      </div>
    </div>
  );
};

export default ProformaInvoice;
