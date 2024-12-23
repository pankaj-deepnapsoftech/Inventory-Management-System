// @ts-nocheck

import {
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
  
  interface WIPProductTableProps {
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
  
  const WIPProductTable: React.FC<WIPProductTableProps> = ({
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
          Header: "BOM",
          accessor: "bom",
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
          Header: "UOM",
          accessor: "uom",
        },
        {
          Header: "Used Quantity",
          accessor: "quantity",
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
  
    // const getSelectedProducts = ()=>{
    //   const rows = document.getElementsByClassName('select');
    //   const rowsArr = Array.from(rows);
    //   const selectedIds = rowsArr
    //   .filter(checkbox => checkbox.checked)  // Filter only the checked checkboxes
    //   .map(checkbox => checkbox.value);
    //   console.log(selectedIds)
    // }
  
    return (
      <div>
        {isLoadingProducts && <Loading />}
        {products.length === 0 && !isLoadingProducts && (
          <div className="mx-auto w-max">
            <FcDatabase size={100} />
            <p className="text-lg">No Data Found</p>
          </div>
        )}
        {!isLoadingProducts && products.length > 0 && (
          <div>
            {/* <button onClick={getSelectedProducts}>Get</button> */}
            <TableContainer>
              <Table variant="simple" {...getTableProps()}>
                <Thead className="text-sm font-semibold">
                  {headerGroups.map(
                    (
                      hg: HeaderGroup<{
                        name: string;
                        product_id: string;
                        uom: string;
                        category: string;
                        current_stock: number;
                        price: number;
                        min_stock?: number;
                        max_stock?: number;
                        hsn_code?: number;
                        createdAt: string;
                        updatedAt: string;
                      }>
                    ) => {
                      return (
                        <Tr {...hg.getHeaderGroupProps()}>
                          {hg.headers.map((column: any) => {
                            return (
                              <Th
                                textTransform="capitalize"
                                fontSize="12px"
                                fontWeight="700"
                                color="black"
                                backgroundColor="#fafafa"
                                borderLeft="1px solid #d7d7d7"
                                borderRight="1px solid #d7d7d7"
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                              >
                                <p className="flex">
                                  {column.render("Header")}
                                  {column.isSorted && (
                                    <span>
                                      {column.isSortedDesc ? (
                                        <FaCaretDown />
                                      ) : (
                                        <FaCaretUp />
                                      )}
                                    </span>
                                  )}
                                </p>
                              </Th>
                            );
                          })}
                          {/* <Th
                            textTransform="capitalize"
                            fontSize="12px"
                            fontWeight="700"
                            color="black"
                            backgroundColor="#fafafa"
                            borderLeft="1px solid #d7d7d7"
                            borderRight="1px solid #d7d7d7"
                          >
                            Actions
                          </Th> */}
                        </Tr>
                      );
                    }
                  )}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                  {page.map((row: any) => {
                    prepareRow(row);
  
                    return (
                      <Tr
                        className="relative hover:bg-[#e4e4e4] hover:cursor-pointer text-base lg:text-sm"
                        {...row.getRowProps()}
                      >
                        {row.cells.map((cell: Cell) => {
                          return (
                            <Td fontWeight="500" {...cell.getCellProps()}>
                              {cell.column.id !== "createdAt" &&
                                cell.column.id !== "updatedAt" &&
                                cell.column.id !== "bom" &&
                                cell.column.id !== "name" &&
                                cell.column.id !== "product_id" &&
                                cell.column.id !== "uom" &&
                                cell.column.id !== "category" &&
                                cell.column.id !== "sub_category" &&
                                cell.column.id !== "estimated_quantity" &&
                                cell.render("Cell")}
  
                              {/* {cell.column.id === 'select' && <input value={row.original._id} type="checkbox" className="select" />} */}
  
                              {cell.column.id === "createdAt" &&
                                row.original?.createdAt && (
                                  <span>
                                    {moment(row.original?.createdAt).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </span>
                                )}
                              {cell.column.id === "updatedAt" &&
                                row.original?.updatedAt && (
                                  <span>
                                    {moment(row.original?.updatedAt).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </span>
                                )}
                              {cell.column.id === "bom" &&
                                row.original?.bom && (
                                  <span>
                                    {row.original?.bom?.bom_name}
                                  </span>
                                )}
                              {cell.column.id === "product_id" &&
                                row.original?.item && (
                                  <span>
                                    {row.original?.item?.product_id}
                                  </span>
                                )}
                              {cell.column.id === "name" &&
                                row.original?.item && (
                                  <span>
                                    {row.original?.item?.name}
                                  </span>
                                )}
                              {cell.column.id === "category" &&
                                row.original?.item && (
                                  <span>
                                    {row.original?.item?.category}
                                  </span>
                                )}
                              {cell.column.id === "sub_category" &&
                                row.original?.item && (
                                  <span>
                                    {row.original?.item?.sub_category}
                                  </span>
                                )}
                              {cell.column.id === "uom" &&
                                row.original?.item && (
                                  <span>
                                    {row.original?.item?.uom}
                                  </span>
                                )}
                            </Td>
                          );
                        })}
                        {/* <Td className="flex gap-x-2">
                          {openProductDetailsDrawerHandler && (
                            <MdOutlineVisibility
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                openProductDetailsDrawerHandler(row.original?._id)
                              }
                            />
                          )}
                          {openUpdateProductDrawerHandler && (
                            <MdEdit
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                openUpdateProductDrawerHandler(row.original?._id)
                              }
                            />
                          )}
                          {deleteProductHandler && (
                            <MdDeleteOutline
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                deleteProductHandler(row.original?._id)
                              }
                            />
                          )}
                          {approveProductHandler && (
                            <FcApproval
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                approveProductHandler(row.original?._id)
                              }
                            />
                          )}
                        </Td> */}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
  
            <div className="w-[max-content] m-auto my-7">
              <button
                className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border-[1px] border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
                disabled={!canPreviousPage}
                onClick={previousPage}
              >
                Prev
              </button>
              <span className="mx-3 text-sm md:text-lg lg:text-xl xl:text-base">
                {pageIndex + 1} of {pageCount}
              </span>
              <button
                className="text-sm mt-2 bg-[#1640d6] py-1 px-4 text-white border-[1px] border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
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
  
  export default WIPProductTable;
  