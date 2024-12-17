import { Button } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
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
  const [cookies] = useCookies();
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingProformaInvoices] = useState<boolean>(false);
  const {isAddProformaInvoiceDrawerOpened, isUpdateProformaInvoiceDrawerOpened,  isProformaInvoiceDetailsDrawerOpened} = useSelector((state: any)=>state.drawers);
  const dispatch = useDispatch();
  const [id, setId] = useState<string | undefined>();

  const [deleteProformaInvoice] = useDeleteProformaInvoiceMutation();

  const openAddProformaInvoiceDrawerHandler = ()=>{
    dispatch(openAddProformaInvoiceDrawer());
  }
  const closeAddProformaInvoiceDrawerHandler = ()=>{
    dispatch(closeAddProformaInvoiceDrawer());
  }

  const openProformaInvoiceDetailsDrawerHandler = (id: string)=>{
    setId(id);
    dispatch(openProformaInvoiceDetailsDrawer());
  }
  const closeProformaInvoiceDetailsDrawerHandler = ()=>{
    dispatch(closeProformaInvoiceDetailsDrawer());
  }

  const openProformaInvoiceUpdateDrawerHandler = (id: string)=>{
    setId(id);
    dispatch(openUpdateProformaInvoiceDrawer());
  }
  const closeProformaInvoiceUpdateDrawerHandler = ()=>{
    dispatch(closeUpdateProformaInvoiceDrawer());
  }

  const fetchProformaInvoiceHandler = async ()=>{
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+'proforma-invoice/all', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${cookies?.access_token}`
          }
        });
        const data = await response.json();
        if(!data.success){
          throw new Error(data.message);
        }

        setData(data.proforma_invoices);
        setFilteredData(data.proforma_invoices);
    } catch (error: any) {
        toast.error(error?.message || 'Something went wrong');
    }
  }

  const deleteProformaInvoiceHandler = async (id: string)=>{
    try {
      const response = await deleteProformaInvoice(id).unwrap();
      if(!response.success){
        throw new Error(response.message);
    }
    toast.success(response.message);
    fetchProformaInvoiceHandler();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  }

  useEffect(()=>{
    fetchProformaInvoiceHandler();
  }, [])

  // useEffect(()=>{
  //   const results = filteredData.map(prod => (

  //   ));
  //   setFilteredData(results);
  // }, [searchKey])

  return (
    <div>

      {isAddProformaInvoiceDrawerOpened && <AddProformaInvoice closeDrawerHandler={closeAddProformaInvoiceDrawerHandler} fetchProformaInvoicesHandler={fetchProformaInvoiceHandler} />}
      {isProformaInvoiceDetailsDrawerOpened && <ProformaInvoiceDetails closeDrawerHandler={closeProformaInvoiceDetailsDrawerHandler} id={id} />}
      {isUpdateProformaInvoiceDrawerOpened && <UpdateProformaInvoice closeDrawerHandler={closeProformaInvoiceUpdateDrawerHandler} id={id} fetchProformaInvoicesHandler={fetchProformaInvoiceHandler} />}

      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-start mb-2">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Proforma Invoices
        </div>

        <div className="mt-2 md:mt-0 flex flex-wrap gap-y-1 items-start gap-x-2 w-full md:w-fit">
          <textarea
            className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#1640d6] hover:outline:[#1640d6] border resize-none border-[#bbbbbb] bg-[#f9f9f9]"
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
            onClick={fetchProformaInvoiceHandler}
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
            onClick={openAddProformaInvoiceDrawerHandler}
            color="white"
            backgroundColor="#1640d6"
          >
            Add New Proforma Invoice
          </Button>
        </div>
      </div>

      <div>
        <ProformaInvoiceTable isLoadingProformaInvoices={isLoadingProformaInvoices} proformaInvoices={filteredData} deleteProformaInvoiceHandler={deleteProformaInvoiceHandler} openProformaInvoiceDetailsHandler={openProformaInvoiceDetailsDrawerHandler} openUpdateProformaInvoiceDrawer={openProformaInvoiceUpdateDrawerHandler} />
      </div>
    </div>
  );
};

export default ProformaInvoice;
