import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  useAddProductMutation,
  useCreateProformaInvoiceMutation,
} from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import AddItems from "../../Dynamic Add Components/AddItems";

interface AddProformaInvoiceProps {
  closeDrawerHandler: () => void;
  fetchProformaInvoicesHandler: () => void;
}

const AddProformaInvoice: React.FC<AddProformaInvoiceProps> = ({
  closeDrawerHandler,
  fetchProformaInvoicesHandler,
}) => {
  const [cookies] = useCookies();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [buyer, setBuyer] = useState<
    { value: string; label: string } | undefined
  >();
  const [proformaInvoiceNo, setProformaInvoiceNo] = useState<
    string | undefined
  >();
  const [documentDate, setDocumentDate] = useState<string | undefined>();
  const [salesOrderDate, setSalesOrderDate] = useState<string | undefined>();
  const [note, setNote] = useState<string | undefined>();
  const [subtotal, setSubtotal] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>();
  const [items, setItems] = useState<any[] | []>([]);
  const [allItems, setAllItems] = useState<any[] | []>([]);
  const [itemOptions, setItemOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [buyers, setBuyers] = useState<any[] | []>([]);
  const [buyerOptions, setBuyerOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [store, setStore] = useState<
    { value: string; label: string } | undefined
  >();
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [tax, setTax] = useState<
    { value: number; label: string } | undefined
  >();
  const taxOptions = [
    { value: 0.18, label: "GST 18%" },
    { value: 0, label: "No Tax 0%" },
  ];


    const [inputs, setInputs] = useState<{ item: { value: string, label: string }, quantity: number, price: number }[]>([
    { item: { value: "", label: "" }, quantity: 0, price: 0 }
  ]);

  const [addProformaInvoice] = useCreateProformaInvoiceMutation();

  const addProformaInvoiceHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
        buyer: buyer?.value,
        proforma_invoice_no: proformaInvoiceNo,
        document_date: documentDate,
        sales_order_date: salesOrderDate,
        note: note,
        tax: tax?.value,
        subtotal: subtotal,
        total: total,
        store: store?.value,
        items: items.map(item => item.value)
    };
    
    try{
        setIsAdding(true);
        const response = await addProformaInvoice(data).unwrap();
        if(!response.success){
            throw new Error(response.message);
        }
        toast.success(response.message);
        closeDrawerHandler();
        fetchProformaInvoicesHandler();
    }
    catch(error: any){
        toast.error(error?.message || 'Something went wrong');
    }
    finally{
        setIsAdding(false);
    }
  };

  const fetchBuyersHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "agent/buyers",
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

      const buyers = data.agents.map((buyer: any) => ({
        value: buyer._id,
        label: buyer.name,
      }));
      setBuyerOptions(buyers);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchItemsHandler = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all",
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
      const products = results.products.map((product: any) => ({
        value: product._id,
        label: product.name,
      }));
      setItemOptions(products);
      setAllItems(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const fetchStoresHandler = async () => {
    try {
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
      const stores = data.stores.map((store: any) => ({
        value: store._id,
        label: store.name,
      }));
      setStoreOptions(stores);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(()=>{
    if(tax && subtotal){
        setTotal(subtotal + (tax?.value * subtotal));
    }
  }, [tax, subtotal]);

  useEffect(()=>{
    const price = items.reduce((acc: number, curr: any)=>{
        const price = allItems.find((item: any)=> item._id === curr.value)?.price;
        return acc + (price || 0);
    }, 0);
    setSubtotal(price);
  }, [items]);

  useEffect(() => {
    fetchBuyersHandler();
    fetchItemsHandler();
    fetchStoresHandler();
  }, []);


  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Proforma Invoice
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Add New Proforma Invoice
          </h2>

          <form onSubmit={addProformaInvoiceHandler}>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Buyer</FormLabel>
              <Select
                value={buyer}
                options={buyerOptions}
                required={true}
                onChange={(e: any) => setBuyer(e)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Proforma Invoice No.</FormLabel>
              <Input
                value={proformaInvoiceNo}
                onChange={(e) => setProformaInvoiceNo(e.target.value)}
                type="text"
                placeholder="Proforma Invoice No."
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Document Date</FormLabel>
              <Input
                value={documentDate}
                className="no-scrollbar"
                onChange={(e) => setDocumentDate(e.target.value)}
                type="date"
                placeholder="Document Date"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Sales Order Date</FormLabel>
              <Input
                value={salesOrderDate}
                className="no-scrollbar"
                onChange={(e) => setSalesOrderDate(e.target.value)}
                type="date"
                placeholder="Sales Order Date"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Store</FormLabel>
              <Select
                value={store}
                options={storeOptions}
                required={true}
                onChange={(e: any) => setStore(e)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5">
              <FormLabel fontWeight="bold">Note</FormLabel>
              <textarea
                className="border w-full border-[#a9a9a9] rounded"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Items</FormLabel>
              <AddItems inputs={inputs} setInputs={setInputs} />
              {/* <Select
                value={items}
                options={itemOptions}
                isMulti={true}
                required={true}
                onChange={(e: any) => setItems(e)}
              /> */}
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Subtotal</FormLabel>
              <Input
                value={subtotal}
                isDisabled={true}
                className="no-scrollbar"
                type="number"
                placeholder="Subtotal"
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Tax</FormLabel>
              <Select
                required={true}
                value={tax}
                options={taxOptions}
                onChange={(e: any) => setTax(e)}
              />
            </FormControl>
            <FormControl className="mt-3 mb-5" isRequired>
              <FormLabel fontWeight="bold">Total</FormLabel>
              <Input value={total} isDisabled={true} />
            </FormControl>
            <Button
              isLoading={isAdding}
              type="submit"
              className="mt-1"
              color="white"
              backgroundColor="#1640d6"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Drawer>
  );
};

export default AddProformaInvoice;