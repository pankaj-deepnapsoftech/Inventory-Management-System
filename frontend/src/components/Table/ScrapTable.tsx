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

interface ScrapTableProps {
    scraps: Array<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }>;
    isLoadingScraps: boolean;
    // openUpdateProductDrawerHandler?: (id: string) => void;
    openScrapDetailsDrawerHandler?: (id: string) => void;
    // deleteProductHandler?: (id: string) => void;
    // approveProductHandler?: (id: string) => void;
}

const ScrapTable: React.FC<ScrapTableProps> = ({
    scraps,
    isLoadingScraps,
    openScrapDetailsDrawerHandler,
}) => {
    const columns: Column<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }>[] = useMemo(
        () => [
            {
                Header: "Item",
                accessor: "item",
            },
            {
                Header: "BOM",
                accessor: "bom",
            },
            {
                Header: "Estimated Quantity",
                accessor: "estimated_quantity",
            },
            {
                Header: "Produced Quantity",
                accessor: "produced_quantity",
            },
            {
                Header: "Total Part Cost",
                accessor: "total_part_cost",
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
        state: { pageIndex },
        pageCount,
    }: TableInstance<{
        item: string;
        bom: string;
        estimated_quantity: string;
        produced_quantity: string;
        total_part_cost: string;
        createdAt: string;
        updatedAt: string;
    }> = useTable(
        {
            columns,
            data: scraps,
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
            {isLoadingScraps && <Loading />}
            {scraps.length === 0 && !isLoadingScraps && (
                <div className="mx-auto w-max">
                    <FcDatabase size={100} />
                    <p className="text-lg">No Data Found</p>
                </div>
            )}
            {!isLoadingScraps && scraps.length > 0 && (
                <div>
                    {/* <button onClick={getSelectedProducts}>Get</button> */}
                    <TableContainer>
                        <Table variant="simple" {...getTableProps()}>
                            <Thead className="text-sm font-semibold">
                                {headerGroups.map(
                                    (
                                        hg: HeaderGroup<{
                                            item: string;
                                            bom: string;
                                            estimated_quantity: string;
                                            produced_quantity: string;
                                            total_part_cost: string;
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
                                                            cell.column.id !== "item" &&
                                                            cell.column.id !== "bom" &&
                                                            cell.column.id !== "estimated_quantity" &&
                                                            cell.column.id !== "produced_quantity" &&
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
                                                        {cell.column.id === "item" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original.item.name}
                                                            </span>
                                                        )}
                                                        {cell.column.id === "bom" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original.bom.bom_name}
                                                            </span>
                                                        )}
                                                        {cell.column.id === "estimated_quantity" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original.quantity}
                                                            </span>
                                                        )}
                                                        {cell.column.id === "produced_quantity" && (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                            >
                                                                {row.original.produced_quantity}
                                                            </span>
                                                        )}
                                                    </Td>
                                                );
                                            })}
                                            <Td className="flex gap-x-2">
                                                {openScrapDetailsDrawerHandler && (
                                                    <MdOutlineVisibility
                                                        className="hover:scale-110"
                                                        size={16}
                                                        onClick={() =>
                                                            openScrapDetailsDrawerHandler(row.original?._id)
                                                        }
                                                    />
                                                )}
                                                {/* {openUpdateProductDrawerHandler && (
                                                    <MdEdit
                                                        className="hover:scale-110"
                                                        size={16}
                                                        onClick={() =>
                                                            openUpdateProductDrawerHandler(row.original?._id)
                                                        }
                                                    />
                                                )} */}
                                                {/* {deleteProductHandler && (
                                                    <MdDeleteOutline
                                                        className="hover:scale-110"
                                                        size={16}
                                                        onClick={() =>
                                                            deleteProductHandler(row.original?._id)
                                                        }
                                                    />
                                                )} */}
                                                {/* {approveProductHandler && (
                                                    <FcApproval
                                                        className="hover:scale-110"
                                                        size={16}
                                                        onClick={() =>
                                                            approveProductHandler(row.original?._id)
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

export default ScrapTable;
