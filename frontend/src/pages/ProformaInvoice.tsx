import { Button } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import ProformaInvoiceTable from "../components/Table/ProformaInvoiceTable";
import { toast } from "react-toastify";

const ProformaInvoice: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [data, setData] = useState<any[] | []>([]);
  const [filteredData, setFilteredData] = useState<any[] | []>([]);
  const [isLoadingProformaInvoices] = useState<boolean>(false);

  // const fetchProformaInvoiceHandler = async ()=>{
  //   try {
  //       const response = await fetch(process.env.REACT_APP_CRM_URL);
  //   } catch (error: any) {
  //       toast.error(error?.message || 'Something went wrong');
  //   }
  // }

  return (
    <div>
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
            // onClick={fetchProductsHandler}
            // leftIcon={<MdOutlineRefresh />}
            color="#1640d6"
            borderColor="#1640d6"
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div>
        <ProformaInvoiceTable isLoadingProformaInvoices={isLoadingProformaInvoices} proformaInvoices={filteredData} />
      </div>
    </div>
  );
};

export default ProformaInvoice;
