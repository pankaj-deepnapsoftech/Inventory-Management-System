// @ts-nocheck

import { useMemo } from "react";
import {
  Cell,
  Column,
  HeaderGroup,
  TableInstance,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Loading from "../../ui/Loading";
import { FcApproval, FcDatabase } from "react-icons/fc";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import moment from "moment";
import { MdDeleteOutline, MdEdit, MdOutlineVisibility } from "react-icons/md";
import { log } from "console";

interface ProformaInvoiceTableProps {
  proformaInvoices: Array<{
    creator: string;
    created_on: string;
    customer?: string;
    startdate: string;
    subtotal: string;
    total: string;
    status: string;
  }>;
  isLoadingProformaInvoices: boolean;
  openProformaInvoiceDetailsDrawerHandler?: (id: string) => void;
}

const ProformaInvoiceTable: React.FC<AgentTableProps> = ({
  proformaInvoices,
  isLoadingProformaInvoices,
  openProformaInvoiceDetailsDrawerHandler,
}) => {
  const columns = useMemo(
    () => [
      // { Header: "Number", accessor: "number" },
      { Header: "Created By", accessor: "creator" },
      { Header: "Created On", accessor: "created_on" },
      { Header: "Customer", accessor: "customer" },
      { Header: "Date", accessor: "startdate" },
      { Header: "Sub Total", accessor: "subtotal" },
      { Header: "Total", accessor: "total" },
      { Header: "Status", accessor: "status" },
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
    createdBy: string;
    createdOn: string;
    customer?: string;
    startdate: string;
    subtotal: string;
    total: string;
    status: string;
  }> = useTable(
    {
      columns,
      data: proformaInvoices,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      {isLoadingProformaInvoices && <Loading />}
      {proformaInvoices.length === 0 && !isLoadingProformaInvoices && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingProformaInvoices && proformaInvoices.length > 0 && (
        <div>
          <TableContainer>
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      createdBy: string;
                      createdOn: string;
                      customer?: string;
                      startdate: string;
                      subtotal: string;
                      total: string;
                      status: string;
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
                        <Th
                          textTransform="capitalize"
                          fontSize="12px"
                          fontWeight="700"
                          color="black"
                          backgroundColor="#fafafa"
                          borderLeft="1px solid #d7d7d7"
                          borderRight="1px solid #d7d7d7"
                        >
                          Actions
                        </Th>
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
                              cell.render("Cell")}

                            {cell.column.id === "created_on" &&
                              row.original?.createdAt && (
                                <span>
                                  {moment(row.original?.created_on).format(
                                    "DD/MM/YYYY"
                                  )}
                                </span>
                              )}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2">
                        {openProformaInvoiceDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openAgentDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {/* {openUpdateAgentDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateAgentDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteAgentHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              deleteAgentHandler(row.original?._id)
                            }
                          />
                        )}
                        {approveAgentHandler && (
                          <FcApproval
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              approveAgentHandler(row.original?._id)
                            }
                          />
                        )} */}
                      </Td>
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

export default ProformaInvoiceTable;
