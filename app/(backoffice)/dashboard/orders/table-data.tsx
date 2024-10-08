"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import {  TOrder } from "@/types/supabaseTypes";
import { DataTableRowActions } from "@/components/DataTable/data-table-row-action";
import { Ellipsis, SquareCheckBig } from "lucide-react";
import { formatDateTime } from "@/lib/formatDate";

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: Ellipsis,
  },
  {
    value: "completed",
    label: "Completed",
    icon: SquareCheckBig,
  },
];

export const columns: ColumnDef<TOrder>[] = [
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => {
      return (

          <h2 className="font-semibold">
            {row.original.orderId}
          </h2>

      );
    },
  },
  {
    accessorKey: "firstname",
    header: "Owner",
    cell: ({ row }) => {
      return (

          <h2 className="font-semibold w-full">
            {row.original.firstname} {row.original.lastname}
          </h2>

      );
    },
  },
  {
    accessorKey: "orderItems",
    header: "Products ordered",
    cell: ({ row }) => {
      return (

          <p className="">
            {row.original.noOfProducts}
          </p>

      );
    },
  },
  {
    accessorKey: "status",
    header: "Delivery Status",
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          {row.original.status === "completed" ? (
            <span className="bg-green-600/10 px-4 py-1 rounded-md text-green-600">
              Completed
            </span>
          ) :  (
            <span className="bg-red-600/10 px-4 py-1 rounded-md text-red-600">
              Pending
            </span>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "PaymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          {row.original.PaymentStatus === "completed" ? (
            <span className="bg-green-600/10 px-4 py-1 rounded-md text-green-600">
              Completed
            </span>
          ) :  (
            <span className="bg-red-600/10 px-4 py-1 rounded-md text-red-600">
              Pending
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Total Price",
    cell: ({ row }) => {

      return (
        <div className="">
          <span>${row.original.totalPrice && row.original.totalPrice.toFixed(2)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Placed",
    cell: ({ row }) => {
      return (

          <p className="text-gray-600 text-xs">
            {formatDateTime(row.original.created_at)}
          </p>

      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions
        editPageLabel="View Order details"
        editPageUrl={`/dashboard/orders/${row.original.orderId}`}
      />;
    },
  },
];
