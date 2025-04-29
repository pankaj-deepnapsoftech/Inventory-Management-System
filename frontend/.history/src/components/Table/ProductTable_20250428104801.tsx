// @ts-nocheck

import {
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
  TableState,
  TableInstance,
  HeaderGroup,
  Row,
  Cell,
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
  const columns: Column<{
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
  }>[] = useMemo(
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
        accessor: "change",
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

  const inventoryCategoryStyles = {
    indirect: {
      bg: "#F03E3E",
      text: "#ffffff",
    },
    direct: {
      bg: "#409503",
      text: "#ffffff",
    },
  };

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
    state: { pageIndex, pageSize },
    pageCount,
    setPageSize,
  }: TableInstance<{
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
    createdAt: string;
    updatedAt: string;
  }> = useTable(
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
                        textTransform="capitalize"
                        fontSize="13px"
                        color="gray.800"
                        borderBottom="1px solid #CBD5E0"
                        whiteSpace="nowrap"
                      >
                        <div className="flex items-center gap-1">
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaCaretDown />
                            ) : (
                              <FaCaretUp />
                            )
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
                        const value = cell.render("Cell");
                        return (
                          <Td fontSize="14px" {...cell.getCellProps()}>
                            {cell.column.id === "createdAt" && (
                              <span>{moment(row.original?.createdAt).format("DD/MM/YYYY")}</span>
                            )}
                            {cell.column.id === "updatedAt" && (
                              <span>{moment(row.original?.updatedAt).format("DD/MM/YYYY")}</span>
                            )}
                            {cell.column.id === "inventory_category" && (
                              <span
                                className="px-2 py-1 rounded-full text-xs"
                                style={{
                                  backgroundColor:
                                    inventoryCategoryStyles[row.original.inventory_category]?.bg || "#CBD5E0",
                                  color:
                                    inventoryCategoryStyles[row.original.inventory_category]?.text || "#1A202C",
                                }}
                              >
                                {row.original.inventory_category?.charAt(0).toUpperCase() +
                                  row.original.inventory_category?.slice(1)}
                              </span>
                            )}
                            {cell.column.id === "change" && row.original.change_type && (
                              <div className="flex items-center gap-1">
                                {row.original.change_type === "increase" ? (
                                  <FaArrowUpLong color="#0dac51" />
                                ) : (
                                  <FaArrowDownLong color="#c70505" />
                                )}
                                <span
                                  className="text-sm font-semibold"
                                  style={{
                                    color:
                                      row.original.change_type === "increase" ? "#0dac51" : "#c70505",
                                  }}
                                >
                                  {row.original.quantity_changed}
                                </span>
                              </div>
                            )}
                            {!["createdAt", "updatedAt", "inventory_category", "change"].includes(
                              cell.column.id
                            ) && value}
                          </Td>
                        );
                      })}
                      <Td>
                        <div className="flex gap-2 items-center text-gray-600">
                          {openProductDetailsDrawerHandler && (
                            <MdOutlineVisibility
                              size={18}
                              className="hover:text-blue-500 cursor-pointer"
                              title="View Details"
                              onClick={() => openProductDetailsDrawerHandler(row.original?._id)}
                            />
                          )}
                          {openUpdateProductDrawerHandler && (
                            <MdEdit
                              size={18}
                              className="hover:text-yellow-500 cursor-pointer"
                              title="Edit Product"
                              onClick={() => openUpdateProductDrawerHandler(row.original?._id)}
                            />
                          )}
                          {deleteProductHandler && (
                            <MdDeleteOutline
                              size={18}
                              className="hover:text-red-500 cursor-pointer"
                              title="Delete Product"
                              onClick={() => deleteProductHandler(row.original?._id)}
                            />
                          )}
                          {approveProductHandler && (
                            <FcApproval
                              size={18}
                              className="hover:scale-110 cursor-pointer"
                              title="Approve Product"
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
  ;
};

export default ProductTable;
