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
             
