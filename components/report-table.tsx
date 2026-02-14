"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import Paragraph from "./typo-p";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const ReportTable = ({ records }: { records: reportResponseType[] }) => {
  const Totals = useMemo(() => {
    if (records.length >= 1) {
      return records.reduce(
        (p, c) => {
          return {
            flightCount: p.flightCount + c.flightCount,
            c: p.c + c.c,
            h: p.h + c.h,
            y: p.y + c.y,
            totalMeals: p.totalMeals + c.c + c.h + c.y,
          };
        },
        { flightCount: 0, c: 0, h: 0, y: 0, totalMeals: 0 },
      );
    } else {
      return { flightCount: 0, c: 0, h: 0, y: 0, totalMeals: 0 };
    }
  }, [records]);

  const columns: ColumnDef<reportResponseType>[] = [
    {
      id: "index", // Required for display columns
      header: "#",
      cell: (info) => info.row.index + 1, // +1 because indices are 0-based
    },
    {
      accessorKey: "date",
      header: "التاريخ",
    },
    {
      accessorKey: "customer",
      header: "الشركة",
    },
    {
      accessorKey: "flightCount",
      header: "عدد الرحلات",
    },
    {
      accessorKey: "c",
      header: "كرو",
    },
    {
      accessorKey: "h",
      header: "بزنس",
    },
    {
      accessorKey: "y",
      header: "سياحى",
    },
    {
      id: "Total Meals",
      header: "مجموع الوجبات",
      cell: (info) => {
        const calc =
          info.row.original["c"] +
          info.row.original["h"] +
          info.row.original["y"];
        return <Paragraph txt={calc.toString()} className="rtl" />;
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: records,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لم يتم اضافة اعداد رحلات للشركات.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="print:hidden">
            <TableRow>
              <TableCell colSpan={3}>المجموع</TableCell>
              <TableCell>{Totals.flightCount}</TableCell>
              <TableCell>{Totals.c}</TableCell>
              <TableCell>{Totals.h}</TableCell>
              <TableCell>{Totals.y}</TableCell>
              <TableCell>{Totals.totalMeals}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="hidden print:block">
        <div className="font-extrabold mt-8">
          <Paragraph
            className="text-2xl"
            txt={`يشمل التقرير الفترة من ${records[0].date} الى ${records[records.length - 1].date}`}
          />
        </div>

        <div className="flex flex-col gap-2.5 mt-4 items-start mr-40 pr-5 border-r py-4">
          <div className="flex gap-4 items-center text-2xl relative thick-border-right">
            <div className="font-extrabold bg-gray-400 w-28 text-center">
              عدد الرحلات
            </div>
            <div>
              <Paragraph txt={Totals.flightCount.toString()} />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t">
            <div className="bg-white text-black text-center w-fit px-2 -mt-10 mx-auto mb-4">
              عدد الوجبات
            </div>
            <div className="flex gap-4 items-center text-2xl relative thick-border-right">
              <div className="font-extrabold bg-gray-400 w-28 text-center">
                كرو
              </div>
              <div>
                <Paragraph txt={Totals.c.toString()} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center text-2xl relative thick-border-right">
            <div className="font-extrabold bg-gray-400 w-28 text-center">
              حورس
            </div>
            <div>
              <Paragraph txt={Totals.h.toString()} />
            </div>
          </div>

          <div className="flex gap-4 items-center text-2xl relative thick-border-right">
            <div className="font-extrabold bg-gray-400 w-28 text-center">
              سياحى
            </div>
            <div>
              <Paragraph txt={Totals.y.toString()} />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t">
            <div className="bg-white text-black text-center w-fit px-2 -mt-10 mx-auto mb-4">
              مجموع الوجبات
            </div>
            <div className="flex gap-4 items-center text-2xl relative thick-border-right">
              <div className="w-[192.69px] text-center">
                <Paragraph txt={Totals.totalMeals.toString()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportTable;
