"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, ChevronRight, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DeliveryOrder } from "@/Types/DeliveryOrder"
import { useServiceStore } from "@/Stores/ServicesStore"
import { useEffect, useState } from "react"
import { ProductsInOrder } from "@/Types/ProductsInOrder"
import { ProductPlacement } from "@/Types/ProductPlacement"
import { Employee } from "@/Types/Employee"
import { EmployeePosition } from "@/Types/EmployeePosition"
import { Supplier } from "@/Types/Supplier"
import { data } from "react-router-dom"


import CustomRow from "./CustomRow"
import { Progress } from "@/components/ui/progress"


export const columns: ColumnDef<DeliveryOrder>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "deliveryOrderStatus",
        header: "Status",
        cell: ({ row }) => <div className="capitalize">{row.getValue("deliveryOrderStatus")}</div>,
    },
    {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
    },
    {
        accessorKey: "number",
        header: "Number",
        cell: ({ row }) => <div>{row.getValue("number")}</div>,
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => <div>{row.getValue("paymentMethod")}</div>,
    },
    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => <div>{row.getValue("employee")}</div>,
    },
    {
        accessorKey: "sum",
        header: "Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("sum"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "orderDate",
        header: "Order Date",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(row.original.id)}
                        >
                            Copy Order ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => <div>{row.getValue("endDate")}</div>,
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    },
    {
        id: "expand",
        cell: ({ row }) => (
            <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => row.toggleExpanded()}
            >
                {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
            </Button>
        ),
        enableHiding: false,
    },
];

export default function DeliveryOrder() {

    const { deliveryOrderService, supplierService, deliveryOrderStatusService, productsInOrderService, productPlacementService, productService, employeeService, employeePositionService } = useServiceStore();

    const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);




    useEffect(() => {
        const fetchData = async () => {

            const deliveryOrders = await deliveryOrderService.getAll("", "", 1, 1000000);

            setDeliveryOrders(deliveryOrders);
            const [suppliers] = await supplierService.getAll("", "", 1, 100000);

            const [productsInOrder, setProductsInOrder] = await productsInOrderService.getAll("")


        }
        fetchData();

    }, [])
    return (

        <div>
            <Progress />
            <table className="mt-12">
                <tbody>

                    {deliveryOrders.map(d => {
                        return <CustomRow deliveryOrderId={d.deliveryOrderId} key={d.deliveryOrderId} />
                    })}

                </tbody>
            </table>
        </div>
    )
}
