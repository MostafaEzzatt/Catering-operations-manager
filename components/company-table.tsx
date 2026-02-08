"use client";

import { deleteCustomer } from "@/actions/customer";
import { cutomersTable } from "@/drizzle/db/schema";
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
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const CompanyTable = ({
  customers,
}: {
  customers: InferSelectModel<typeof cutomersTable>[];
}) => {
  const [deleteState, deleteSubmit, deleteIsPending] = useActionState(
    deleteCustomer,
    null,
  );
  const [transitionPending, startTransition] = useTransition();

  const isPending = transitionPending || deleteIsPending;

  function handleDelete(id: number) {
    startTransition(() => {
      deleteSubmit(id);
    });
  }

  const columns: ColumnDef<InferSelectModel<typeof cutomersTable>>[] = [
    {
      id: "index", // Required for display columns
      header: "#",
      cell: (info) => info.row.index + 1, // +1 because indices are 0-based
    },
    {
      accessorKey: "name",
      header: "اسم الشركة",
    },
    {
      accessorKey: "cNumber",
      header: "رقم الشركة",
    },
    {
      accessorKey: "code",
      header: "كود الشركة",
    },
    {
      accessorKey: "Delete",
      header: "Delete",
      cell: (info) => {
        return (
          <Button
            onClick={() => handleDelete(info.row.original.id)}
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
    data: customers,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (isPending) {
      toast.info("نعمل على مسح الشركة");
    } else if (!isPending && deleteState == true) {
      toast.success("تم مسح الشركة.");
    } else if (!isPending && deleteState === false) {
      toast.error("حدث خطاء ما عند مسح الشركة.");
    }
  }, [isPending, deleteState]);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                لم يتم اضافة شركات.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
