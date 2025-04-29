import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Select from "react-select";
import { MdOutlineRefresh } from "react-icons/md";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import SampleCSV from '../assets/csv/product-sample.csv';
import React, { useEffect, useRef, useState } from "react";
import {
  useDeleteProductMutation,
  useProductBulKUploadMutation,
} from "../redux/api/api";
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

const IndirectProducts: React.FC = () => {
  const { isSuper, allowedroutes } = useSelector((state: any) => state.auth);
  const isAllowed = isSuper || allowedroutes.includes("inventory");
  const [cookies] = useCookies();
  const [data, setData] = useState([]);
  const [productId, setProductId] = useState<string | undefined>(); // Product Id to be updated or deleted
  const [searchKey, setSearchKey] = useState<string | undefined>();
  const [filteredData, setFilteredData] = useState<any>([]);

  // Bulk upload menu
  const [showBulkUploadMenu, setShowBulkUploadMenu] = useState<boolean>(false);

  // Filters
  const [productServiceFilter, setProductServiceFilter] = useState<string>("");
  const [storeOptions, setStoreOptions] = useState<
    { value: string; label: string }[] | []
  >([]);
  const [storeFilter, setStoreFilter] = useState<
    { value: string; label: string } | undefined
  >();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);

  const [bulkUpload] = useProductBulKUploadMutation();

  const {
    isAddProductDrawerOpened,
    isUpdateProductDrawerOpened,
    isProductDetailsDrawerOpened,
  } = useSelector((state: any) => state.drawers);
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

  const deleteProductHandler = async (id: string) => {
    try {
      const response: any = await deleteProduct({ _id: id }).unwrap();
      toast.success(response.message);
      fetchProductsHandler();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    }
  };

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const fetchProductsHandler = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "product/all?category=indirect",
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

  const fetchAllStores = async () => {
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
      let modifiedStores = [{ value: "", label: "All" }];
      modifiedStores.push(
        ...data.stores.map((store: any) => ({
          value: store._id,
          label: store.name,
        }))
      );
      setStoreOptions(modifiedStores);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const bulkUploadHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileRef?.current?.files?.[0];
    if (!file) {
      toast.error("CSV file not selected");
      return;
    }

    try {
      setBulkUploading(true);
      const formData = new FormData();
      formData.append("excel", file);

      const response = await bulkUpload(formData).unwrap();
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setBulkUploading(false);
    }
  };

  useEffect(() => {
    fetchProductsHandler();
    fetchAllStores();
  }, []);

  useEffect(() => {
    const searchTxt = searchKey?.toLowerCase();
    // // @ts-ignore
    const results = data.filter(
      (prod: any) =>
        (prod.product_or_service?.toLowerCase().includes(productServiceFilter) &&
          (storeFilter &&
            (storeFilter?.value === "" ||
              prod?.store?._id === storeFilter?.value))) &&
        (prod.name?.toLowerCase()?.includes(searchTxt) ||
          prod.product_id?.toLowerCase()?.includes(searchTxt) ||
          prod.category?.toLowerCase()?.includes(searchTxt) ||
          prod.price
            ?.toString()
            ?.toLowerCase()
            ?.toString()
            .includes(searchTxt) ||
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
              ?.includes(searchTxt?.replaceAll("/", "") || "")) ||
          (prod?.updatedAt &&
            new Date(prod?.updatedAt)
              ?.toISOString()
              ?.substring(0, 10)
              ?.split("-")
              ?.reverse()
              ?.join("")
              ?.includes(searchTxt?.replaceAll("/", "") || "")))
    );
    setFilteredData(results);
  }, [searchKey, productServiceFilter, storeFilter]);

  if (!isAllowed) {
    return <div className="text-center text-red-500">You are not allowed to access this route.</div>
  }

  return (
    <div className="bg-white shadow-2xl p-4 rounded-md ">
      {/* Add Product Drawer */}
      {isAddProductDrawerOpened && (
        <AddProduct
          closeDrawerHandler={closeProductDrawerHandler}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {/* Update Product Drawer */}
      {isUpdateProductDrawerOpened && (
        <UpdateProduct
          closeDrawerHandler={closeUpdateProductDrawerHandler}
          productId={productId}
          fetchProductsHandler={fetchProductsHandler}
        />
      )}
      {/* Product Details Drawer */}
      {isProductDetailsDrawerOpened && (
        <ProductDetails
          closeDrawerHandler={closeProductDetailsDrawerHandler}
          productId={productId}
        />
      )}

      {/* Products Page */}
      <div>
        <h1 className="text-center font-[700] text-[25px] pb-4">
          Inventory
        </h1>

        <div className="mt-2  flex flex-wrap pb-4  justify-center  w-full gap-4">
        <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 200 }}
            onClick={openAddProductDrawerHandler}
            color="white"
            backgroundColor="#2D3748"
            _hover={{ bg: "#2e2e4f" }}
          >
            Add New Product
          </Button>

          <Button
            fontSize={{ base: "14px", md: "14px" }}
            paddingX={{ base: "10px", md: "12px" }}
            paddingY={{ base: "0", md: "3px" }}
            width={{ base: "-webkit-fill-available", md: 100 }}
            onClick={fetchProductsHandler}
            leftIcon={<MdOutlineRefresh />}
            color="#import {
              Select,
              Table,
              TableContainer,
              Tbody,
              Td,
              Th,
              Thead,
              Tr,
            } from "@chakra-ui/react";
            import moment from "moment";
            import { useMemo } from "react";
            import { FaCaretDown, FaCaretUp } from "react-icons/fa";
            import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
            import { FcApproval, FcDatabase } from "react-icons/fc";
            import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
            import {
              usePagination,
              useSortBy,
              useTable,
              Column,
            } from "react-table";
            import Loading from "../../ui/Loading";
            
            interface ProductTableProps {
              products: Array<{
                name: string;
                product_id: string;
                uom: string;
                category: string;
                sub_category?: string;
                item_type: string;
                product_or_service: string;
                current_stock: number;
                price: number;
                min_stock?: number;
                max_stock?: number;
                hsn_code?: number;
                inventory_category?: string;
                createdAt: string;
                updatedAt: string;
                change_type?: string;
                quantity_changed?: number;
                _id?: string;
              }>;
              isLoadingProducts: boolean;
              openUpdateProductDrawerHandler?: (id: string) => void;
              openProductDetailsDrawerHandler?: (id: string) => void;
              deleteProductHandler?: (id: string) => void;
              approveProductHandler?: (id: string) => void;
            }
            
            const ProductTable: React.FC<ProductTableProps> = ({
              products,
              isLoadingProducts,
              openUpdateProductDrawerHandler,
              openProductDetailsDrawerHandler,
              deleteProductHandler,
              approveProductHandler,
            }) => {
              const columns: Column<ProductTableProps["products"][number]>[] = useMemo(
                () => [
                  {
                    Header: "ID",
                    accessor: "product_id",
                  },
                  {
                    Header: "Name",
                    accessor: "name",
                  },
                  {
                    Header: "Inventory Category",
                    accessor: "inventory_category",
                  },
                  {
                    Header: "Category",
                    accessor: "category",
                  },
                  {
                    Header: "Sub Category",
                    accessor: "sub_category",
                  },
                  {
                    Header: "Type",
                    accessor: "item_type",
                  },
                  {
                    Header: "Product/Service",
                    accessor: "product_or_service",
                  },
                  {
                    Header: "UOM",
                    accessor: "uom",
                  },
                  {
                    Header: "Price",
                    accessor: "price",
                  },
                  {
                    Header: "Current stock",
                    accessor: "current_stock",
                  },
                  {
                    Header: "Last Change",
                    accessor: "change_type",
                  },
                  {
                    Header: "Min stock",
                    accessor: "min_stock",
                  },
                  {
                    Header: "Max stock",
                    accessor: "max_stock",
                  },
                  {
                    Header: "Created On",
                    accessor: "createdAt",
                  },
                  {
                    Header: "Last Updated",
                    accessor: "updatedAt",
                  },
                ],
                []
              );
            
              const {
                getTableProps,
                getTableBodyProps,
                headerGroups,
                prepareRow,
                page,
                nextPage,
                previousPage,
                canNextPage,
                canPreviousPage,
                state: { pageIndex },
                pageCount,
                setPageSize,
              } = useTable(
                {
                  columns,
                  data: products,
                  initialState: { pageIndex: 0 },
                },
                useSortBy,
                usePagination
              );
            
              return (
                <div className="h-full">
                  {isLoadingProducts && <Loading />}
                  {!isLoadingProducts && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                      <FcDatabase size={100} />
                      <p className="text-lg font-medium mt-2">No Products Found</p>
                    </div>
                  )}
                  {!isLoadingProducts && products.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <Select
                          onChange={(e) => setPageSize(Number(e.target.value))}
                          width={["100px", "120px"]}
                          size="sm"
                        >
                          {[10, 20, 50, 100, 100000].map((val) => (
                            <option key={val} value={val}>
                              {val === 100000 ? "All" : val}
                            </option>
                          ))}
                        </Select>
                      </div>
            
                      <TableContainer
                        maxHeight="600px"
                        overflowY="auto"
                        border="1px solid #E2E8F0"
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        <Table variant="striped" colorScheme="gray" size="sm" {...getTableProps()}>
                          <Thead position="sticky" top={0} zIndex="docked" bg="gray.50">
                            {headerGroups.map((hg) => (
                              <Tr {...hg.getHeaderGroupProps()}>
                                {hg.headers.map((column: any) => (
                                  <Th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    fontSize="13px"
                                    textTransform="capitalize"
                                    color="gray.800"
                                    whiteSpace="nowrap"
                                    bg={column.id === "product_id" ? "#e2e8f0" : undefined}
                                  >
                                    <div className="flex items-center gap-1 font-semibold">
                                      {column.render("Header")}
                                      {column.isSorted ? (
                                        column.isSortedDesc ? <FaCaretDown /> : <FaCaretUp />
                                      ) : null}
                                    </div>
                                  </Th>
                                ))}
                                <Th fontSize="13px" whiteSpace="nowrap">Actions</Th>
                              </Tr>
                            ))}
                          </Thead>
            
                          <Tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                              prepareRow(row);
                              return (
                                <Tr {...row.getRowProps()} _hover={{ bg: "gray.100" }}>
                                  {row.cells.map((cell) => {
                                    const value = cell.value;
                                    return (
                                      <Td
                                        {...cell.getCellProps()}
                                        fontSize="13px"
                                        bg={cell.column.id === "product_id" ? "#edf2f7" : undefined}
                                        fontWeight={cell.column.id === "product_id" ? "bold" : "normal"}
                                      >
                                        {cell.column.id === "createdAt"
                                          ? moment(value).format("DD/MM/YYYY")
                                          : cell.column.id === "updatedAt"
                                          ? moment(value).format("DD/MM/YYYY")
                                          : cell.column.id === "change_type" && row.original.change_type ? (
                                            <div className="flex items-center gap-1">
                                              {row.original.change_type === "increase" ? (
                                                <FaArrowUpLong color="#0dac51" />
                                              ) : (
                                                <FaArrowDownLong color="#c70505" />
                                              )}
                                              <span style={{ color: row.original.change_type === "increase" ? "#0dac51" : "#c70505" }}>
                                                {row.original.quantity_changed}
                                              </span>
                                            </div>
                                          ) : (
                                            value
                                          )}
                                      </Td>
                                    );
                                  })}
                                  <Td>
                                    <div className="flex gap-2 text-gray-600 items-center">
                                      {openProductDetailsDrawerHandler && (
                                        <MdOutlineVisibility
                                          size={18}
                                          className="hover:text-blue-500 cursor-pointer"
                                          onClick={() => openProductDetailsDrawerHandler(row.original?._id)}
                                        />
                                      )}
                                      {openUpdateProductDrawerHandler && (
                                        <MdEdit
                                          size={18}
                                          className="hover:text-yellow-500 cursor-pointer"
                                          onClick={() => openUpdateProductDrawerHandler(row.original?._id)}
                                        />
                                      )}
                                      {deleteProductHandler && (
                                        <MdDeleteOutline
                                          size={18}
                                          className="hover:text-red-500 cursor-pointer"
                                          onClick={() => deleteProductHandler(row.original?._id)}
                                        />
                                      )}
                                      {approveProductHandler && (
                                        <FcApproval
                                          size={18}
                                          className="hover:scale-110 cursor-pointer"
                                          onClick={() => approveProductHandler(row.original?._id)}
                                        />
                                      )}
                                    </div>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
            
                      <div className="flex justify-center items-center gap-4">
                        <button
                          className="px-4 py-1 text-sm font-medium rounded-full bg-blue-600 text-white disabled:bg-gray-300"
                          disabled={!canPreviousPage}
                          onClick={previousPage}
                        >
                          Prev
                        </button>
                        <span className="text-sm font-semibold">
                          Page {pageIndex + 1} of {pageCount}
                        </span>
                        <button
                          className="px-4 py-1 text-sm font-medium rounded-full bg-blue-600 text-white disabled:bg-gray-300"
                          disabled={!canNextPage}
                          onClick={nextPage}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            };
            
            export default ProductTable;
            "
            borderColor="#2D3748"
            variant="outline"
            _hover={{ bg: "#2D3748", color: "white" }}
          >
            Refresh
          </Button>
   
          <div className="w-[200px]">
            <Button
              fontSize={{ base: "14px", md: "14px" }}
              paddingX={{ base: "10px", md: "12px" }}
              paddingY={{ base: "0", md: "3px" }}
              width={{ base: "-webkit-fill-available", md: 200 }}
              onClick={() => setShowBulkUploadMenu(true)}
              color="white"
              backgroundColor="#2D3748"
              rightIcon={<AiFillFileExcel size={22} />}
              _hover={{ bg: "#2e2e4f" }}
            >
              Bulk Upload
            </Button>
            {showBulkUploadMenu && (
              <div className="mt-1 border border-[#a9a9a9] rounded p-1">
                <form>
                  <FormControl>
                    <FormLabel fontWeight="bold">Choose File (.csv)</FormLabel>
                    <Input
                      ref={fileRef}
                      borderWidth={1}
                      borderColor={"#a9a9a9"}
                      paddingTop={1}
                      type="file"
                      accept=".csv, .xlsx"
                    />
                  </FormControl>
                  <div className="flex gap-1">
                    <Button
                      type="submit"
                      fontSize={{ base: "14px", md: "14px" }}
                      onClick={bulkUploadHandler}
                      color="white"
                      backgroundColor="#2D3748"
                      className="mt-1"
                      rightIcon={<AiFillFileExcel size={22} />}
                      isLoading={bulkUploading}
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      fontSize={{ base: "14px", md: "14px" }}
                      onClick={() => setShowBulkUploadMenu(false)}
                      color="white"
                      backgroundColor="#2D3748"
                      className="mt-1"
                      rightIcon={<RxCross2 size={22} />}
                    >
                      Close
                    </Button>
                    <textarea
                      className="rounded-[10px] w-full md:flex-1 px-2 py-2 md:px-3 md:py-2 text-sm focus:outline-[#2D3748] hover:outline:[#2D3748] border resize-none border-[#bbbbbb] bg-[#f9f9f9]"
                      rows={1}
                      placeholder="Search..."
                      value={searchKey}
                      onChange={(e) => setSearchKey(e.target.value)}
                    />
                  </div>
                  <a href={SampleCSV}>
                    <Button
                      type="button"
                      fontSize={{ base: "14px", md: "14px" }}
                      width={{ base: "-webkit-fill-available", md: 190 }}
                      color="white"
                      backgroundColor="#2D3748"
                      className="mt-1"
                      rightIcon={<AiFillFileExcel size={22} />}
                    >
                      Sample CSV
                    </Button>
                  </a>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-2 mb-2">
        <FormControl width={"-webkit-max-content"}>
          <FormLabel fontWeight="bold" marginBottom={0}>
            Products/Services
          </FormLabel>
          <select
            value={productServiceFilter}
            onChange={(e: any) => setProductServiceFilter(e.target.value)}
            className="w-[200px] mt-2 rounded border border-[#a9a9a9] py-2 px-2"
          >
            <option value="">All</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </select>
        </FormControl>
        <FormControl width={"-webkit-max-content"}>
          <FormLabel fontWeight="bold">Store</FormLabel>
          <Select
            className="w-[200px] rounded mt-2 border border-[#a9a9a9]"
            options={storeOptions}
            value={storeFilter}
            onChange={(d: any) => setStoreFilter(d)}
          />
        </FormControl>
      </div>

      <div>
        <ProductTable
          isLoadingProducts={isLoadingProducts}
          products={filteredData}
          openUpdateProductDrawerHandler={openUpdateProductDrawerHandler}
          openProductDetailsDrawerHandler={openProductDetailsDrawerHandler}
          deleteProductHandler={deleteProductHandler}
        />
      </div>
    </div>
  );
};

export default IndirectProducts;
