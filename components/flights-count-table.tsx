"use client";

import { deleteCount } from "@/actions/customer-flight-count";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import { Trash } from "lucide-react";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import Paragraph from "./typo-p";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface recordsType {
  "co-mgr-customer-flight-count": InferSelectModel<
    typeof customerFlightCountTable
  >;
  "co-mgr-customers": InferSelectModel<typeof cutomersTable> | null;
}

const FlightsCountDataTable = ({ records }: { records: recordsType[] }) => {
  const [deleteState, deleteSubmit, deleteIsPending] = useActionState(
    deleteCount,
    null,
  );
  const [transitionPending, startTransition] = useTransition();

  const isPending = transitionPending || deleteIsPending;

  function handleDelete(id: number) {
    startTransition(() => {
      deleteSubmit(id);
    });
  }

  const columns: ColumnDef<recordsType>[] = [
    {
      id: "index", // Required for display columns
      header: "#",
      cell: (info) => info.row.index + 1, // +1 because indices are 0-based
    },
    {
      accessorKey: "co-mgr-customer-flight-count.date",
      header: "التاريخ",
    },
    {
      accessorKey: "co-mgr-customers.name",
      header: "الشركة",
    },
    {
      accessorKey: "co-mgr-customer-flight-count.flightCount",
      header: "عدد الرحلات",
    },
    {
      accessorKey: "co-mgr-customer-flight-count.c",
      header: "كرو",
    },
    {
      accessorKey: "co-mgr-customer-flight-count.h",
      header: "بزنس",
    },
    {
      accessorKey: "co-mgr-customer-flight-count.y",
      header: "سياحى",
    },
    {
      id: "Total Meals",
      header: "اعداد الوجبات",
      cell: (info) => {
        const calc =
          info.row.original["co-mgr-customer-flight-count"]["c"] +
          info.row.original["co-mgr-customer-flight-count"]["h"] +
          info.row.original["co-mgr-customer-flight-count"]["y"];
        return (
          <Paragraph txt={calc.toString()} className="text-center w-full" />
        );
      },
    },
    {
      accessorKey: "Delete",
      header: "Delete",
      cell: (info) => {
        return (
          <Button
            onClick={() =>
              handleDelete(info.row.original["co-mgr-customer-flight-count"].id)
            }
            disabled={isPending}
            variant={"outline"}
          >
            <Trash />
          </Button>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: records,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (isPending) {
      toast.info("نعمل على مسح البيانات");
    } else if (!isPending && deleteState == true) {
      toast.success("تم مسح البيانات.");
    } else if (!isPending && deleteState === false) {
      toast.error("حدث خطاء ما عند مسح البيانات.");
    }
  }, [isPending, deleteState]);
  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="text-center">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                لم يتم اضافة اعداد رحلات للشركات.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FlightsCountDataTable;
