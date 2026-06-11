"use client";

import { deleteCustomer, updateCustomer } from "@/actions/customer";
import { cutomersTable } from "@/drizzle/db/schema";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import { Pen, Trash } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
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
  isAdmin,
}: {
  customers: InferSelectModel<typeof cutomersTable>[];
  isAdmin: boolean;
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
  ];

  const adminColumns: ColumnDef<InferSelectModel<typeof cutomersTable>>[] = [
    {
      accessorKey: "Delete",
      header: "مسح",
      cell: (info) => {
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isPending} variant={"outline"}>
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  حذف شركة {info.row.original.name}؟
                </AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم حذف الشركة نهائياً مع جميع سجلات الرحلات والوجبات الخاصة
                  بها. لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => handleDelete(info.row.original.id)}
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
    {
      accessorKey: "Update",
      header: "تعديل",
      cell: (info) => {
        return (
          <Link href={`/add-companys/update/${info.row.original.id}`}>
            <Pen />
          </Link>
        );
      },
    },
  ];

  const visibleColumns = isAdmin ? [...columns, ...adminColumns] : columns;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns: visibleColumns,
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
              <TableCell
                colSpan={visibleColumns.length}
                className="h-24 text-center"
              >
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
