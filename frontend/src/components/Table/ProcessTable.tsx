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

interface ProcessTableProps {
  process: Array<{
    process: string;
    description: string;
    creator: any;
    createdAt: string;
    updatedAt: string;
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
  deleteProcessHandler
}) => {
  const columns = useMemo(
    () => [
      { Header: "Created By", accessor: "creator" },
      { Header: "Process", accessor: "process" },
      { Header: "Description", accessor: "description" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
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
          <TableContainer>
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
                              cell.column.id !== "creator" &&
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
                            {cell.column.id === "creator" &&
                                <span>{row.original.creator.first_name + ' ' + row.original.creator.last_name}</span>}
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
                        {/* {approveAgentHandler && (
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

export default ProcessTable;