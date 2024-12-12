import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Loading from "../../../ui/Loading";
import { BiX } from "react-icons/bi";
import moment from "moment";

interface ProformaInvoiceDetailsProps {
  closeDrawerHandler: () => void;
  id: string | undefined;
}

const ProformaInvoiceDetails: React.FC<ProformaInvoiceDetailsProps> = ({
  closeDrawerHandler,
  id,
}) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buyer, setBuyer] = useState<string | undefined>();
  const [proformaInvoiceNo, setProformaInvoiceNo] = useState<
    string | undefined
  >();
  const [documentDate, setDocumentDate] = useState<string | undefined>();
  const [salesOrderDate, setSalesOrderDate] = useState<string | undefined>();
  const [note, setNote] = useState<string | undefined>();
  const [subtotal, setSubtotal] = useState<number | undefined>(0);
  const [total, setTotal] = useState<number | undefined>();
  const [items, setItems] = useState<any[] | []>([]);
  const [store, setStore] = useState<string | undefined>();
  const [tax, setTax] = useState<string | undefined>();
  const taxOptions = [
    { value: 0.18, label: "GST 18%" },
    { value: 0, label: "No Tax 0%" },
  ];

  const fetchProformaInvoiceDetails = async (id: string) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `proforma-invoice/${id}`,
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
      setBuyer(data.proforma_invoice.buyer.name);
      setProformaInvoiceNo(data.proforma_invoice.proforma_invoice_no);
      setDocumentDate(data.proforma_invoice.document_date);
      setSalesOrderDate(data.proforma_invoice.sales_order_date);
      setNote(data.proforma_invoice?.note || "Not Available");
      setSubtotal(data.proforma_invoice.subtotal);
      setTotal(data.proforma_invoice.total);
      setTax(data.proforma_invoice.tax);
      setItems(data.proforma_invoice.items);
      setStore(data.proforma_invoice.store.name);
    } catch (error: any) {
      toast.error(error.messsage || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProformaInvoiceDetails(id || "");
  }, [id]);

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
            Proforma Invoice Details
          </h2>

          {isLoading && <Loading />}
          {!isLoading && (
            <div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Buyer</p>
                <p>{buyer}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Proforma Invoice No.</p>
                <p>{proformaInvoiceNo}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Document Date</p>
                <p>{moment(documentDate).format('DD/MM/YYYY')}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Sales Order Date</p>
                <p>{moment(salesOrderDate).format('DD/MM/YYYY')}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Items</p>
                <p>{/* {} */}</p>
                <div className="mt-3 mb-5">
                  <p className="font-semibold">Store</p>
                  <p>{store}</p>
                </div>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Note</p>
                <p>{note}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Subtotal</p>
                <p>₹ {subtotal}/-</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Tax</p>
                <p>{tax}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Total</p>
                <p>₹ {total}/-</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ProformaInvoiceDetails;
