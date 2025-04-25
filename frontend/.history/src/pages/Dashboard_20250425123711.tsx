import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Card from "../components/Dashboard/Card";
import Loading from "../ui/Loading";
import { IoIosDocument, IoMdCart } from "react-icons/io";
import { FaRupeeSign, FaStoreAlt, FaUser } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { IoPeople } from "react-icons/io5";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

const Dashboard: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [cookies] = useCookies();
  const { firstname } = useSelector((state: any) => state.auth);
  const [approvalsPending, setApprovalsPending] = useState<
    | {
      unapproved_product_count: number;
      unapproved_store_count: number;
      unapproved_merchant_count: number;
      unapproved_bom_count: number;
    }
    | undefined
  >();
  const [scrap, setScrap] = useState<
    | {
      total_product_count: number;
      total_stock_price: number;
    }
    | undefined
  >();
  const [inventory, setInventory] = useState<
    | {
      total_product_count: number;
      total_stock_price: number;
    }
    | undefined
  >();
  const [directInventory, setDirectInventory] = useState<
    | {
      total_low_stock: number;
      total_excess_stock: number;
      total_product_count: number;
      total_stock_price: number;
    }
    | undefined
  >();
  const [indirectInventory, setIndirectInventory] = useState<
    | {
      total_low_stock: number;
      total_excess_stock: number;
      total_product_count: number;
      total_stock_price: number;
    }
    | undefined
  >();
  const [stores, setStores] = useState<
    | {
      total_store_count: number;
    }
    | undefined
  >();
  const [boms, setBoms] = useState<
    | {
      total_bom_count: number;
    }
    | undefined
  >();
  const [merchants, setMerchants] = useState<
    | {
      total_supplier_count: number;
      total_buyer_count: number;
    }
    | undefined
  >();
  const [employees, setEmployees] = useState<
    | {
      _id: string;
      total_employee_count: number;
    }[]
    | undefined
  >();
  const [processes, setProcesses] = useState<
    | {
      ["raw material approval pending"]?: number;
      ["raw materials approved"]?: number;
      completed?: number;
      "work in progress"?: number;
    }
    | undefined
  >();
  const [totalProformaInvoices, setTotalProformaInvoices] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);

  const fetchSummaryHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies?.access_token}`,
          },
          body: JSON.stringify({
            from,
            to,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setDirectInventory(
        data.products?.[0]?._id === "direct"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setIndirectInventory(
        data.products?.[0]?._id === "indirect"
          ? data.products?.[0]
          : data.products?.[1]
      );
      setScrap(data.scrap[0]);
      setInventory(data.wip_inventory[0]);
      setStores(data.stores);
      setMerchants(data.merchants);
      setBoms(data.boms);
      setApprovalsPending(data.approvals_pending);
      setEmployees(data.employees);
      setProcesses(data.processes);
      setTotalProformaInvoices(data.proforma_invoices);
      setTotalInvoices(data.invoices);
      setTotalPayments(data.payments);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (from && to) {
      fetchSummaryHandler();
    }
  };

  const resetFilterHandler = (e: React.FormEvent) => {
    e.preventDefault();

    setFrom("");
    setTo("");

    fetchSummaryHandler();
  };
  const dynamicColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br  from-purple-400 to-purple-600"
        break;
      case 1:
        return "bg-gradient-to-br  from-green-400 to-green-600"
        break;
      case 2:
        return "bg-gradient-to-br  from-yellow-400 to-yellow-600"
        break;
      case 3:
        return "bg-gradient-to-br  from-blue-400 to-blue-600"
        break;
      case 4:
        return "bg-gradient-to-br  from-red-400 to-red-600"
    }
  }
  useEffect(() => {
    fetchSummaryHandler();
  }, []);

  if (!isAllowed) {
    return (
      <div className="text-center text-red-500">
        You are not allowed to access this route.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col  md:items-center md:justify-between gap-6 p-4 bg-white rounded-xl shadow-sm">
        <div className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome {firstname || ""}
        </div>

        <form
          onSubmit={applyFilterHandler}
          className="flex flex-col md:flex-row items-start md:items-end gap-4 w-full md:w-auto"
        >
          <div className="w-full max-w-md">
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              FROM:
            </label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              id="dob"
              type="text"
              placeholder="DD/MM/YYYY"
              className="w-full border-b rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none  transition"
            />

          </div>
          <div className="w-full max-w-md">
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              TO:
            </label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              id="dob"
              type="text"
              placeholder="DD/MM/YYYY"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition"
            />

          </div>

          <div className="flex w-full md:w-auto gap-2">
            <Button
              type="submit"
              className="w-full md:w-32 h-10 text-sm font-medium rounded-md bg-gray-800 text-white hover:bg-white hover:text-gray-800 hover:shadow-md transition-colors duration-300 border border-gray-800"
            >
              Apply
            </Button>

            <Button
              type="button"
              onClick={resetFilterHandler}
              className="w-full md:w-32 h-10 text-sm font-medium rounded-md bg-gray-800 text-white hover:bg-white hover:text-gray-800 hover:shadow-md transition-colors duration-300 border border-gray-800"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>

      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          <div className="mb-2 mt-6 font-bold text-2xl">
            Employee Insights
          </div>
          {employees && employees.length === 0 && (
            <div className="text-center mb-2">No data found.</div>
          )}
          {employees && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {employees.map((emp, ind) => {
                return (
                  <Card
                    primaryColor="white"
                    secondaryColor="#A82298"
                    bgColor={dynamicColor(ind)}
                    textColor="#A82298"
                    title={emp?._id}
                    content={emp?.total_employee_count}
                    link="employee"
                    icon={<IoPeople color="#ffffff" size={28} />}
                  />
                );
              })}
            </div>
          )}
          <div className="mb-2 mt-6 font-bold text-2xl">
            Sales & Purchase Insights
          </div>
          {approvalsPending && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card
                primaryColor="white"
                secondaryColor="white"
                bgColor="bg-gradient-to-br  from-pink-400 to-pink-600"
                textColor="black"
                title="Proforma Invoices"
                content={totalProformaInvoices}
                link="approval"
                icon={<IoMdCart color="#fff" size={28} />}
              />

              <Card
                primaryColor="white"
                secondaryColor="#900C3F"
                bgColor="bg-gradient-to-br  from-cyan-400 to-cyan-600"
                textColor="#00FFFF"
                title="Invoices"
                content={totalInvoices}
                link="approval"
                icon={<FaStoreAlt color="#00FFFF" size={28} />}
              />

              <Card
                primaryColor="white"
                secondaryColor="#155724"
                bgColor="bg-gradient-to-br  from-orange-400 to-orange-600"
                textColor="#FF69B4"
                title="Payments"
                content={totalPayments}
                link="approval"
                icon={<FaUser color="#FF69B4" size={28} />}
              />

            </div>
          )}
          <div className="mb-2 mt-6 font-bold text-2xl ">
            Approvals Pending
          </div>
          {approvalsPending && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card
                primaryColor="white"
                secondaryColor="#1E387B"
                textColor="white"
                bgColor="bg-gradient-to-br from-teal-400 to-emerald-500"


                title="Inventory"
                content={approvalsPending?.unapproved_product_count}
                link="approval"
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="white"
                secondaryColor="#1E387B"
                textColor="white"
                bgColor="bg-gradient-to-br from-fuchsia-500 to-red-500"
                title="Stores"
                content={approvalsPending?.unapproved_store_count}
                link="approval"
                icon={<FaStoreAlt color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="white"
                secondaryColor="#1E387B"
                textColor="white"
                bgColor="bg-gradient-to-br from-purple-400 to-purple-600"
                title="Merchants"
                content={approvalsPending?.unapproved_merchant_count}
                link="approval"
                icon={<FaUser color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="white"
                secondaryColor="#1E387B"
                textColor="white"
                bgColor="bg-gradient-to-br from-yellow-400 to-yellow-600"
                title="BOMs"
                content={approvalsPending?.unapproved_bom_count}
                link="approval"
                icon={<IoIosDocument color="#ffffff" size={28} />}
              />
            </div>
          )}
          <div className="mb-2 mt-5 font-bold text-2xl">
            Inventory Insights
          </div>
          {directInventory && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br  from-cyan-400 to-cyan-600"
                title="Direct Inventory"
                content={directInventory?.total_product_count}
                link="product"
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br from-pink-400 to-red-600"
                title="Stock Value"
                content={"₹ " + directInventory?.total_stock_price + "/-"}
                icon={<FaRupeeSign color="#ffffff" size={24} />}
                link="product"
              />
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br  from-green-400 to-green-600"
                title="Excess Stock"
                content={directInventory?.total_excess_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br from-blue-400 to-blue-600"
                title="Low Stock"
                content={directInventory?.total_low_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
            </div>
          )}
          {indirectInventory && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-3">
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br from-green-400 to-lime-600"
                title="Indirect Inventory"
                content={indirectInventory?.total_product_count}
                link="product"
                icon={<IoMdCart color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br from-yellow-400 to-yellow-600"
                title="Stock Value"
                content={"₹ " + indirectInventory?.total_stock_price + "/-"}
                icon={<FaRupeeSign color="#ffffff" size={28} />}
                link="product"
              />
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br from-purple-400 to-purple-600"
                title="Excess Stock"
                content={indirectInventory?.total_excess_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
              <Card
                primaryColor="white"
                secondaryColor="#32A1E7"
                textColor="white"
                bgColor="bg-gradient-to-br from-red-400 to-red-600"
                title="Low Stock"
                content={indirectInventory?.total_low_stock}
                link="product"
                icon={<AiFillProduct color="#ffffff" size={28} />}
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6  mt-6">
            <Card
              primaryColor="white"
              secondaryColor="#32A1E7"
              textColor="white"
              bgColor="bg-gradient-to-br from-cyan-400 to-cyan-600"
              title="Scrap Materials"
              content={scrap?.total_product_count?.toString() || ""}
              link="product"
              icon={<IoMdCart color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="white"
              secondaryColor="#32A1E7"
              textColor="white"
              bgColor="bg-gradient-to-br from-blue-400 to-blue-600"
              title="Scrap Value"
              content={"₹ " + scrap?.total_stock_price + "/-"}
              icon={<FaRupeeSign color="#ffffff" size={24} />}
              link="product"
            />
            <Card
              primaryColor="white"
              secondaryColor="#32A1E7"
              textColor="white"
              bgColor="bg-gradient-to-br from-orange-400 to-orange-600"
              title="WIP Inventory"
              content={inventory?.total_product_count?.toString() || ""}
              link="product"
              icon={<IoMdCart color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="white"
              secondaryColor="#32A1E7"
              textColor="White"
              bgColor="bg-gradient-to-br from-green-400 to-green-600"
              title="WIP Inventory Value"
              content={"₹ " + inventory?.total_stock_price + "/-"}
              icon={<FaRupeeSign color="#ffffff" size={24} />}
              link="product"
            />
          </div>
          <div className="mb-2 mt-5 font-bold text-2xl">
            Store & Merchant Insights
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stores && (
              <div>
                <Card
                  primaryColor="white"
                  secondaryColor="#E56F27"
                  textColor="white"
                  bgColor="bg-gradient-to-br from-purple-400 to-purple-600"
                  title="Stores"
                  content={stores?.total_store_count}
                  link="store"
                  icon={<FaStoreAlt color="#ffffff" size={28} />}
                />
              </div>
            )}
            {merchants && (
              <Card
                primaryColor="white"
                secondaryColor="#A231E8"
                textColor="white"
                bgColor="bg-gradient-to-br from-red-400 to-red-600"
                title="Buyers"
                content={merchants?.total_buyer_count}
                link="merchant/buyer"
                icon={<FaUser color="#ffffff" size={24} />}
              />
            )}
            {merchants && (
              <Card
                primaryColor="white"
                secondaryColor="#A231E8"
                textColor="white"
                bgColor="bg-gradient-to-br from-blue-400 to-blue-600"
                title="Suppliers"
                content={merchants?.total_supplier_count}
                link="merchant/supplier"
                icon={<FaUser color="#ffffff" size={24} />}
              />
            )}
          </div>

          <div className="mb-2 mt-5 font-bold text-2xl">
            Production Insights
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {boms && (
              <Card
                primaryColor="white"
                secondaryColor="#21A86C"
                textColor="white"
                bgColor="bg-gradient-to-br from-cyan-400 to-sky-600"
                title="BOMs"
                content={boms?.total_bom_count}
                link="bom"
                icon={<IoIosDocument color="#ffffff" size={28} />}
              />
            )}
            <Card
              primaryColor="white"
              secondaryColor="#E56F27"
              textColor="white"
              bgColor="bg-gradient-to-br from-pink-300 to-indigo-200"
              title="Inventory Approval Pending"
              content={processes?.["raw material approval pending"] || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="white"
              secondaryColor="#E56F27"
              bgColor="bg-gradient-to-br from-yellow-400 to-yellow-600"
              textColor="white"
              title="Inventory Approved"
              content={processes?.["raw materials approved"] || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="white"
              secondaryColor="#E56F27"
              textColor="white"
              bgColor="bg-gradient-to-br from-pink-400 to-pink-600"
              title="Work In Progress"
              content={processes?.["work in progress"] || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
            <Card
              primaryColor="white"
              secondaryColor="#E56F27"
              textColor="white"
              bgColor="bg-gradient-to-br from-green-400 to-green-600"
              title="Completed"
              content={processes?.completed || 0}
              link="production/production-process"
              icon={<FaStoreAlt color="#ffffff" size={28} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
