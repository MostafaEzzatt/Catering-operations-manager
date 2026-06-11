"use client";

import { deleteCustomer, rejectDeleteRequest } from "@/actions/customer";
import { cutomersTable } from "@/drizzle/db/schema";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import { Pen, Trash, X } from "lucide-react";
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
import { Badge } from "./ui/badge";
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
  const [rejectState, rejectSubmit, rejectIsPending] = useActionState(
    rejectDeleteRequest,
    null,
  );

  const [transitionPending, startTransition] = useTransition();

  const isPending = transitionPending || deleteIsPending || rejectIsPending;

  function handleDelete(id: number) {
    startTransition(() => {
      deleteSubmit(id);
    });
  }

  function handleReject(id: number) {
    startTransition(() => {
      rejectSubmit(id);
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
      header: "مسح",
      cell: (info) => {
        const company = info.row.original;
        const pending = company.deleteRequestedBy !== null;

        // Regular users see the pending state instead of a second request
        if (pending && !isAdmin) {
          return <Badge variant="secondary">بانتظار موافقة المشرف</Badge>;
        }

        return (
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isPending} variant={"outline"}>
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isAdmin
                      ? `حذف شركة ${company.name}؟`
                      : `طلب حذف شركة ${company.name}؟`}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isAdmin
                      ? `${pending ? `طلب ${company.deleteRequestedBy} حذف هذه الشركة. ` : ""}سيتم حذف الشركة نهائياً مع جميع سجلات الرحلات والوجبات الخاصة بها. لا يمكن التراجع عن هذا الإجراء.`
                      : "سيتم إرسال طلب الحذف إلى المشرف، ولن يتم حذف الشركة إلا بعد موافقته."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => handleDelete(company.id)}
                  >
                    {isAdmin ? "حذف" : "إرسال الطلب"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {isAdmin && pending && (
              <Button
                disabled={isPending}
                variant={"outline"}
                title="رفض طلب الحذف"
                onClick={() => handleReject(company.id)}
              >
                <X />
              </Button>
            )}
          </div>
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: customers,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (isPending) {
      toast.info("جارى تنفيذ العملية");
    } else if (!isPending && deleteState === 1) {
      toast.success("تم مسح الشركة.");
    } else if (!isPending && deleteState === 2) {
      toast.info("تم إرسال طلب الحذف الى المشرف.");
    } else if (!isPending && deleteState === 0) {
      toast.error("حدث خطاء ما عند مسح الشركة.");
    }
  }, [isPending, deleteState]);

  useEffect(() => {
    if (!isPending && rejectState === true) {
      toast.success("تم رفض طلب الحذف.");
    } else if (!isPending && rejectState === false) {
      toast.error("حدث خطاء ما عند رفض طلب الحذف.");
    }
  }, [isPending, rejectState]);

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
