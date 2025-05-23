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
  Select,
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

interface ProcessTableProps {
  process: Array<{
    creator: any;
    item: string;
    rm_store: string;
    fg_store: string;
    scrap_store: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  }>;
  isLoadingProcess: boolean;
  openUpdateProcessDrawerHandler?: (id: string) => void;
  openProcessDetailsDrawerHandler?: (id: string) => void;
  deleteProcessHandler?: (id: string) => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({
  process,
  isLoadingProcess,
  openUpdateProcessDrawerHandler,
  openProcessDetailsDrawerHandler,
  deleteProcessHandler,
}) => {
  const columns = useMemo(
    () => [
      { Header: "Created By", accessor: "creator" },
      { Header: "Status", accessor: "status" },
      { Header: "Item", accessor: "item" },
      { Header: "RM Store", accessor: "rm_store" },
      { Header: "FG Store", accessor: "fg_store" },
      { Header: "Scrap Store", accessor: "scrap_store" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const statusStyles = {
    'raw material approval pending': {
      bg: "#F03E3E",
      text: "#ffffff",
    },
    "raw materials approved": {
      bg: "#3392F8",
      text: "#ffffff",
    },
    "work in progress": {
      bg: "#E48C27",
      text: "#ffffff",
    },
    completed: {
      bg: "#409503",
      text: "#ffffff",
    }
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
    process: string;
    description: string;
    creator: any;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: process,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      {isLoadingProcess && <Loading />}
      {process.length === 0 && !isLoadingProcess && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingProcess && process.length > 0 && (
        <div>
          <div className="flex justify-end mb-2">
            <Select
              onChange={(e) => setPageSize(e.target.value)}
              width="80px"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={100000}>All</option>
            </Select>
          </div>
          <TableContainer maxHeight="600px" overflowY="auto" className=" mx-3  bg-white rounded-md">
            <Table variant="simple" {...getTableProps()}>
              <Thead className="text-sm font-semibold">
                {headerGroups.map(
                  (
                    hg: HeaderGroup<{
                      process: string;
                      description: string;
                      creator: any;
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
                              fontSize="14px"
                              fontWeight="600"
                              color="black"
                              backgroundColor="#2D3748"
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
                          fontSize="14px"
                          fontWeight="600"
                          color="black"
                          backgroundColor="#2D3748"
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
                              cell.column.id !== "creator" &&
                              cell.column.id !== "rm_store" &&
                              cell.column.id !== "fg_store" &&
                              cell.column.id !== "scrap_store" &&
                              cell.column.id !== "item" &&
                              cell.column.id !== "status" &&
                              cell.render("Cell")}

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
                            {cell.column.id === "creator" && (
                              <span>
                                {row.original.creator.first_name +
                                  " " +
                                  row.original.creator.last_name}
                              </span>
                            )}
                            {cell.column.id === "item" && (
                              <span>{row.original.item.name}</span>
                            )}
                            {cell.column.id === "rm_store" && (
                              <span>{row.original.rm_store.name}</span>
                            )}
                            {cell.column.id === "fg_store" && (
                              <span>{row.original.fg_store.name}</span>
                            )}
                            {cell.column.id === "scrap_store" && (
                              <span>{row.original.scrap_store.name}</span>
                            )}
                            {cell.column.id === "status" && (
                              <span className="px-2 py-1 rounded-md" style={{
                                backgroundColor: statusStyles[row.original.status].bg,
                                color: statusStyles[row.original.status].text}}>{row.original.status.toUpperCase()}</span>
                            )}
                          </Td>
                        );
                      })}
                      <Td className="flex gap-x-2">
                        {openProcessDetailsDrawerHandler && (
                          <MdOutlineVisibility
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openProcessDetailsDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {openUpdateProcessDrawerHandler && (
                          <MdEdit
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              openUpdateProcessDrawerHandler(row.original?._id)
                            }
                          />
                        )}
                        {deleteProcessHandler && (
                          <MdDeleteOutline
                            className="hover:scale-110"
                            size={16}
                            onClick={() =>
                              deleteProcessHandler(row.original?._id)
                            }
                          />
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          <div className="w-[max-content] m-auto my-7">
            <button
              className="text-sm mt-2 bg-[#2D3748] py-1 px-4 text-white border-[1px] border-[#1640d6] rounded-3xl disabled:bg-[#b2b2b2] disabled:border-[#b2b2b2] disabled:cursor-not-allowed md:text-lg md:py-1 md:px-4 lg:text-xl lg:py-1 xl:text-base"
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

export default ProcessTable;
