import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Card from "../components/Dashboard/Card";
import Loading from "../ui/Loading";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [products, setProducts] = useState<
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

  const fetchSummaryHandler = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "dashboard",
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

      setProducts(data.products);
      setStores(data.stores);
      setMerchants(data.merchants);
      setBoms(data.boms);
      setApprovalsPending(data.approvals_pending);
      setEmployees(data.employees);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryHandler();
  }, []);

  return (
    <div>
      {/* <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Dashboard
        </div>
      </div> */}

      <div>
        <div className="text-3xl font-bold">Hi {firstname || ""},</div>
      </div>

      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          <div className="mb-2 mt-5 font-semibold text-xl">
            Inventory Insights
          </div>
          {products && (
            <div className="grid grid-cols-4 gap-2 mt-4 mb-2">
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Products"
                content={products?.total_product_count}
                link="product"
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Stock Value"
                content={"₹ " + products?.total_stock_price + "/-"}
                link="product"
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Excess Stock"
                content={products?.total_excess_stock}
                link="product"
              />
              <Card
                primaryColor="#4CAAE4"
                secondaryColor="#32A1E7"
                textColor="white"
                title="Low Stock"
                content={products?.total_low_stock}
                link="product"
              />
            </div>
          )}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {stores && (
              <div>
                <Card
                  primaryColor="#E57E3D"
                  secondaryColor="#E56F27"
                  textColor="white"
                  title="Stores"
                  content={stores?.total_store_count}
                  link="store"
                />
              </div>
            )}
            {merchants && (
              <Card
                primaryColor="#A948E7"
                secondaryColor="#A231E8"
                textColor="white"
                title="Buyers"
                content={merchants?.total_buyer_count}
                link="merchant/buyer"
              />
            )}
            {merchants && (
              <Card
                primaryColor="#A948E7"
                secondaryColor="#A231E8"
                textColor="white"
                title="Suppliers"
                content={merchants?.total_supplier_count}
                link="merchant/supplier"
              />
            )}
            {boms && (
              <Card
                primaryColor="#37A775"
                secondaryColor="#21A86C"
                textColor="white"
                title="BOMs"
                content={boms?.total_bom_count}
                link="bom"
              />
            )}
          </div>
          <div className="mb-2 mt-6 font-semibold text-xl">
            Approvals Pending
          </div>
          {approvalsPending && (
            <div className="grid grid-cols-4 gap-2">
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="Products"
                content={approvalsPending?.unapproved_product_count}
                link="approval"
              />
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="Stores"
                content={approvalsPending?.unapproved_store_count}
                link="approval"
              />
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="Merchants"
                content={approvalsPending?.unapproved_merchant_count}
                link="approval"
              />
              <Card
                primaryColor="#273F7C"
                secondaryColor="#1E387B"
                textColor="white"
                title="BOMs"
                content={approvalsPending?.unapproved_bom_count}
                link="approval"
              />
            </div>
          )}
          <div className="mb-2 mt-6 font-semibold text-xl">
            Employee Insights
          </div>
          {employees && (
            <div className="grid grid-cols-4 gap-2">
              {employees.map((emp, ind) => {
                return (
                  <Card
                    primaryColor="#A83D9B"
                    secondaryColor="#A82298"
                    textColor="white"
                    title={emp?._id}
                    content={emp?.total_employee_count}
                    link="employee"
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
