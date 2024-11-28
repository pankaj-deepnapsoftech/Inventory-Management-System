import { Button } from "@chakra-ui/react";
import { MdOutlineRefresh } from "react-icons/md";
// import { usePagination, useSortBy, useTable } from "react-table";
import { useEffect, useMemo, useState } from "react";
import { useDeleteProductMutation, useLazyFetchProductsQuery } from "../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import ProductTable from "../components/Table/ProductTable";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddProductDrawer,
  closeProductDetailsDrawer,
  closeUpdateProductDrawer,
  openAddProductDrawer,
  openProductDetailsDrawer,
  openUpdateProductDrawer,
} from "../redux/reducers/drawersSlice";
import AddProduct from "../components/Drawers/Product/AddProduct";
import UpdateProduct from "../components/Drawers/Product/UpdateProduct";
import ProductDetails from "../components/Drawers/Product/ProductDetails";

// const columns = useMemo(() => ([]), []);

const Products: React.FC = () => {
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [productId, setProductId] = useState<string | undefined>(); // Product Id to be updated or deleted
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  const { isAddProductDrawerOpened, isUpdateProductDrawerOpened, isProductDetailsDrawerOpened } = useSelector(
    (state: any) => state.drawers
  );
  const dispatch = useDispatch();

  const [deleteProduct] = useDeleteProductMutation();

  const openAddProductDrawerHandler = () => {
    dispatch(openAddProductDrawer());
  };

  const closeProductDrawerHandler = () => {
    dispatch(closeAddProductDrawer());
  };

  const openUpdateProductDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openUpdateProductDrawer());
  };

  const closeUpdateProductDrawerHandler = () => {
    dispatch(closeUpdateProductDrawer());
  };

  const openProductDetailsDrawerHandler = (id: string) => {
    setProductId(id);
    dispatch(openProductDetailsDrawer());
  };

  const closeProductDetailsDrawerHandler = () => {
    dispatch(closeProductDetailsDrawer());
  };

  const deleteProductHandler = async (id: string)=>{
    try {
      const response: any = await deleteProduct({_id: id}).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  }

  //   const [fetchProducts, { data, error, isError }] =
  //   useLazyFetchProductsQuery();
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  //   const fetchProductsHandler = async () => {
  //     try {
  //       setIsLoadingProducts(true);
  //       const response = await fetchProducts({}).unwrap();
  //     //   if (isError) {
  //     //     throw new Error(error);
  //     //   }
  //     console.log(response, data, error, isError)
  //     //   setData(products);
  //     //   setFilteredData(products);
  //     } catch (err: any) {
  //       toast.error(err?.data?.msg || err?.message || "Something went wrong");
  //     } finally {
  //       setIsLoadingProducts(false);
  //     }
  //   };

  const fetchProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
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
      setData(results.products);
      setFilteredData(results.products);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProductsHandler();
  }, []);

  useEffect(()=>{
    const searchTxt = searchKey?.toLowerCase();
    const results = data.filter((prod: any) => (
      prod.name?.toLowerCase()?.includes(searchTxt) ||
      prod.product_id?.toLowerCase()?.includes(searchTxt) ||
      prod.category?.toLowerCase()?.includes(searchTxt) ||
      prod.price?.toString()?.toLowerCase()?.toString().includes(searchTxt) ||
      prod.uom?.toLowerCase()?.includes(searchTxt) ||
      prod.current_stock?.toString().toString().includes(searchTxt) ||
      prod?.min_stock?.toString()?.includes(searchTxt) ||
      prod?.max_stock?.toString()?.includes(searchTxt) ||
      prod?.hsn?.includes(searchTxt) ||
      (prod?.createdAt &&
        new Date(prod?.createdAt)
          ?.toISOString()
          ?.substring(0, 10)
          ?.split("-")
          .reverse()
          .join("")
          ?.includes(searchTxt?.replaceAll("/", "") || '')) ||
      (prod?.updatedAt &&
        new Date(prod?.updatedAt)
          ?.toISOString()
          ?.substring(0, 10)
          ?.split("-")
          ?.reverse()
          ?.join("")
          ?.includes(searchTxt?.replaceAll("/", "") || ''))
    ));
    setFilteredData(results);
  }, [searchKey])

  return (
    <div>
      {/* Add Product Drawer */}
      {isAddProductDrawerOpened && (
        <AddProduct closeDrawerHandler={closeProductDrawerHandler} fetchProductsHandler={fetchProductsHandler} />
      )}
      {/* Update Product Drawer */}
      {isUpdateProductDrawerOpened && (
        <UpdateProduct closeDrawerHandler={closeUpdateProductDrawerHandler} productId={productId} fetchProductsHandler={fetchProductsHandler} />
      )}
      {/* Product Details Drawer */}
      {isProductDetailsDrawerOpened && (
        <ProductDetails closeDrawerHandler={closeProductDetailsDrawerHandler} productId={productId} />
      )}

      {/* Products Page */}
      <div className="flex flex-col items-start justify-start md:flex-row gap-y-1 md:justify-between md:items-center mb-8">
        <div className="flex text-lg md:text-xl font-semibold items-center gap-y-1">
          Products
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
            onClick={fetchProductsHandler}
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
            onClick={openAddProductDrawerHandler}
            color="white"
            backgroundColor="#1640d6"
          >
            Add New Product
          </Button>
        </div>
      </div>

      <div>
        <ProductTable isLoadingProducts={isLoadingProducts} products={filteredData} openUpdateProductDrawerHandler={openUpdateProductDrawerHandler} openProductDetailsDrawerHandler={openProductDetailsDrawerHandler} deleteProductHandler={deleteProductHandler} />
      </div>
    </div>
  );
};

export default Products;
