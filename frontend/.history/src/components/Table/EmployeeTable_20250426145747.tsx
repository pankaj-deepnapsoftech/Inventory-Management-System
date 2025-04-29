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

interface EmployeeTableProps {
  employees: Array<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  isLoadingEmployees: boolean;
  openUpdateEmployeeDrawerHandler?: (id: string) => void;
  openEmployeeDetailsDrawerHandler?: (id: string) => void;
  deleteEmployeeHandler?: (id: string) => void;
  approveEmployeeHandler?: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoadingEmployees,
  openUpdateEmployeeDrawerHandler,
  openEmployeeDetailsDrawerHandler,
  deleteEmployeeHandler,
  approveEmployeeHandler,
}) => {
  const columns = useMemo(
    () => [
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone", accessor: "phone" },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }: Cell) => (
          <span style={{ color: "white" }}>{value}</span>
        ),
      },
      { Header: "isVerified", accessor: "isVerified" },
      { Header: "Created On", accessor: "createdAt" },
      { Header: "Last Updated", accessor: "updatedAt" },
    ],
    []
  );

  const verificationStyles = {
    "not verified": {
      bg: "#F03E3E",
      text: "#ffffff",
    },
    verified: {
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
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }> = useTable(
    {
      columns,
      data: employees,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      {isLoadingEmployees && <Loading />}
      {employees.length === 0 && !isLoadingEmployees && (
        <div className="mx-auto w-max">
          <FcDatabase size={100} />
          <p className="text-lg">No Data Found</p>
        </div>
      )}
      {!isLoadingEmployees && employees.length > 0 && (
        <div>
          <div className="flex justify-end mb-2">
            <Select
              onChange={(e) => setPageSize(Number(e.target.value))}
              width="80px"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={100000}>All</option>
            </Select>
          </div>
          <TableContainer
            overflowY="auto"
            className="mx-3 bg-white rounded-md"
          >
            <Table variant="striped" {...getTableProps()}>
              <Thead className="text-sm font-semibold bg-[#2D3748]">
                {headerGroups.map((hg: HeaderGroup<any>) => (
                  <Tr {...hg.getHeaderGroupProps()}>
                    {hg.headers.map((column: any) => (
                      <Th
                        textTransform="capitalize"
                        fontSize="12px"
                        fontWeight="700"
                        color="white"
                        borderLeft="1px solid #d7d7d7"
                        borderRight="1px solid #d7d7d7"
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                      >
                        <p className="flex font-light text-[15px]">
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
                    ))}
                    <Th
                      textTransform="capitalize"
                      fontSize="12px"
                      fontWeight="700"
                      color="black"
                      backgroundColor="#edf2f6"
                      borderLeft="1px solid #d7d7d7"
                      borderRight="1px solid #d7d7d7"
                    >
                      Actions
                    </Th>
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page.map((row: any) => {
                  prepareRow(row);
                  return (
                    <Tr
                      className="relative hover:bg-[#e4e4e4] hover:cursor-pointer text-base lg:text-sm"
                      {...row.getRowProps()}
                    >
                      {row.cells.map((cell: Cell) => (
                        <Td fontWeight="500" {...cell.getCellProps()}>
                          {cell.column.id !== "createdAt" &&
                          cell.column.id !== "updatedAt" &&
                          cell.column.id !== "isVerified" &&
                          cell.column.id !== "role" ? (
                            cell.render("Cell")
                          ) : cell.column.id === "createdAt" &&
                            row.original?.createdAt ? (
                            <span>
                              {moment(row.original
::contentReference[oaicite:1]{index=1}
 
export 