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
  
  interface UserRoleTableProps {
    roles: Array<{
      role: string,
      description: string,
      createdAt: string,
      updatedAt: string
    }>;
    isLoadingRoles: boolean;
    openUpdateRoleDrawerHandler?: (id: string) => void;
    openRoleDetailsDrawerHandler?: (id: string) => void;
    deleteRoleHandler?: (id: string) => void;
    // approveRoleHandler?: (id: string) => void;
  }
  
  const UserRoleTable: React.FC<UserRoleTableProps> = ({
    roles,
    isLoadingRoles,
    openUpdateRoleDrawerHandler,
    openRoleDetailsDrawerHandler,
    deleteRoleHandler,
    approveRoleHandler,
  }) => {
    const columns: Column<{
        role: string,
        description: string,
        createdAt: string,
        updatedAt: string
    }>[] = useMemo(
      () => [
        {
          Header: "Role",
          accessor: "role",
        },
        {
          Header: "Description",
          accessor: "description",
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
        role: string,
        description: string,
        createdAt: string,
        updatedAt: string
    }> = useTable(
      {
        columns,
        data: roles,
        initialState: { pageIndex: 0 },
      },
      useSortBy,
      usePagination
    );
  
    return (
      <div>
        {isLoadingRoles && <Loading />}
        {roles.length === 0 && !isLoadingRoles && (
          <div className="mx-auto w-max">
            <FcDatabase size={100} />
            <p className="text-lg">No Data Found</p>
          </div>
        )}
        {!isLoadingRoles && roles.length > 0 && (
          <div>
            <TableContainer>
              <Table variant="simple" {...getTableProps()}>
                <Thead className="text-sm font-semibold">
                  {headerGroups.map(
                    (
                      hg: HeaderGroup<{
                        role: string,
                        description: string,
                        createdAt: string,
                        updatedAt: string
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
                            </Td>
                          );
                        })}
                        <Td className="flex gap-x-2">
                          {openRoleDetailsDrawerHandler && (
                            <MdOutlineVisibility
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                openRoleDetailsDrawerHandler(row.original?._id)
                              }
                            />
                          )}
                          {openUpdateRoleDrawerHandler && (
                            <MdEdit
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                openUpdateRoleDrawerHandler(row.original?._id)
                              }
                            />
                          )}
                          {deleteRoleHandler && (
                            <MdDeleteOutline
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                deleteRoleHandler(row.original?._id)
                              }
                            />
                          )}
                          {/* {approveStoreHandler && (
                            <FcApproval
                              className="hover:scale-110"
                              size={16}
                              onClick={() =>
                                approveStoreHandler(row.original?._id)
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
  
  export default UserRoleTable;
  