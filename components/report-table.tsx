"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Download, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// What the printed header says about the report. Captured when the report is
// submitted, so editing the form afterwards does not change a printed report.
export type ReportPrintMeta = {
  periodLabel: string;
  companyLabel: string;
  from: string;
  to: string;
  createdAt: string;
};

const formatNumber = (n: number) => n.toLocaleString("en-US");

// Print rules for this report only. They live in a <style> rendered with the
// results instead of a CSS file: Next.js keeps imported stylesheets after
// navigating away, so a stylesheet would leak these rules into other pages.
// This tag is removed when the report unmounts.
const PRINT_CSS = `
@media print {
  @page { size: A4 portrait; margin: 12mm; }
  html, body { background: #fff !important; }
  .report-print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .report-print, .report-print * {
    color: #000 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  .report-print .print-label { background: #e5e7eb !important; }
  .report-print [data-slot="table-container"] { overflow: visible !important; }
  .report-print table { font-size: 10pt; border-collapse: collapse; }
  .report-print thead { display: table-header-group; }
  /* Print the totals row once at the end, not at the bottom of every page */
  .report-print tfoot { display: table-row-group; }
  .report-print tr { break-inside: avoid; page-break-inside: avoid; }
  .report-print th, .report-print td {
    border: 1px solid #9ca3af !important;
    padding: 2px 6px !important;
    height: auto !important;
  }
  .report-print tfoot td { font-weight: 700; }
}
`;

const ReportTable = ({
  records,
  meta,
}: {
  records: reportResponseType[];
  meta: ReportPrintMeta;
}) => {
  // Hides the rows on screen and in print, leaving the header and totals
  const [hideTable, setHideTable] = useState(false);

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
      // dir="auto": numeric "DD / MM / YYYY" stays left-to-right, while an
      // Arabic month label ("فبراير 2026") reads right-to-left
      cell: (info) => <bdi dir="auto">{info.row.original.date}</bdi>,
    },
    {
      accessorKey: "customer",
      header: "الشركة",
    },
    {
      accessorKey: "flightCount",
      header: "عدد الرحلات",
      cell: (info) => formatNumber(info.row.original.flightCount),
    },
    {
      accessorKey: "c",
      header: "كرو",
      cell: (info) => formatNumber(info.row.original.c),
    },
    {
      accessorKey: "h",
      header: "بزنس",
      cell: (info) => formatNumber(info.row.original.h),
    },
    {
      accessorKey: "y",
      header: "سياحى",
      cell: (info) => formatNumber(info.row.original.y),
    },
    {
      id: "Total Meals",
      header: "مجموع الوجبات",
      cell: (info) =>
        formatNumber(
          info.row.original.c + info.row.original.h + info.row.original.y,
        ),
    },
  ];

  const totalsStrip = [
    { label: "عدد الرحلات", value: Totals.flightCount },
    { label: "كرو", value: Totals.c },
    { label: "بزنس", value: Totals.h },
    { label: "سياحى", value: Totals.y },
    { label: "مجموع الوجبات", value: Totals.totalMeals },
  ];

  const table = useReactTable({
    columns,
    data: records,
    getCoreRowModel: getCoreRowModel(),
  });

  async function downloadExcel() {
    try {
      // Dynamic import keeps exceljs out of the page bundle until needed
      const ExcelJS = (await import("exceljs")).default;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("التقرير", {
        views: [{ rightToLeft: true }],
      });

      sheet.columns = [
        { header: "#", key: "index", width: 6 },
        { header: "التاريخ", key: "date", width: 18 },
        { header: "الشركة", key: "customer", width: 28 },
        { header: "عدد الرحلات", key: "flightCount", width: 12 },
        { header: "كرو", key: "c", width: 10 },
        { header: "بزنس", key: "h", width: 10 },
        { header: "سياحى", key: "y", width: 10 },
        { header: "مجموع الوجبات", key: "totalMeals", width: 14 },
      ];
      sheet.getRow(1).font = { bold: true };

      records.forEach((r, i) => {
        sheet.addRow({
          index: i + 1,
          date: r.date,
          customer: r.customer,
          flightCount: r.flightCount,
          c: r.c,
          h: r.h,
          y: r.y,
          totalMeals: r.c + r.h + r.y,
        });
      });

      const totalsRow = sheet.addRow({
        customer: "المجموع",
        flightCount: Totals.flightCount,
        c: Totals.c,
        h: Totals.h,
        y: Totals.y,
        totalMeals: Totals.totalMeals,
      });
      totalsRow.font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Date strings may contain "/" which is not allowed in file names
      const clean = (s: string) => s.replace(/\s*\/\s*/g, "-");
      const fileName =
        records.length >= 1
          ? `تقرير ${clean(records[0].date)} - ${clean(records[records.length - 1].date)}.xlsx`
          : "تقرير.xlsx";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("حدث خطأ ما عند تحميل ملف Excel.");
    }
  }

  return (
    <div className="report-print">
      <style>{PRINT_CSS}</style>

      <div className="flex justify-end items-center gap-4 mb-2 print:hidden">
        <div className="flex items-center gap-2">
          <Checkbox
            id="report-hide-table"
            checked={hideTable}
            onCheckedChange={(checked) => setHideTable(checked === true)}
          />
          <Label htmlFor="report-hide-table">اخفاء الجدول</Label>
        </div>
        <Button
          variant="outline"
          onClick={() => window.print()}
          disabled={records.length === 0}
        >
          <Printer /> طباعة
        </Button>
      </div>

      {/* Print-only header: what the report is, then the key totals first.
          With the table hidden, the totals strip also shows on screen. */}
      <header className={`${hideTable ? "block" : "hidden"} print:block mb-4`}>
        <h1 className="hidden print:block text-xl font-bold text-center mb-3">
          تقرير اعداد الرحلات
        </h1>
        <dl className="hidden print:grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
          {/* Without the rows, daily / monthly / yearly says nothing */}
          {!hideTable && (
            <div className="flex gap-2">
              <dt className="font-bold">نوع التقرير:</dt>
              <dd>{meta.periodLabel}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="font-bold">الشركات:</dt>
            <dd>{meta.companyLabel}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold">الفترة:</dt>
            <dd>
              من <bdi dir="ltr">{meta.from}</bdi> الى{" "}
              <bdi dir="ltr">{meta.to}</bdi>
            </dd>
          </div>
          <div className="flex gap-2">
            {/* <dt className="font-bold">تاريخ الاستخراج:</dt>
            <dd>
              <bdi dir="ltr">{meta.createdAt}</bdi>
            </dd> */}
          </div>
        </dl>
        <div className="grid grid-cols-5 gap-2">
          {totalsStrip.map((item) => (
            <div
              key={item.label}
              className="border border-gray-400 rounded text-center break-inside-avoid"
            >
              <div className="print-label text-xs font-bold py-1">
                {item.label}
              </div>
              <div className="text-lg font-bold py-1">
                {formatNumber(item.value)}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* <div className="flex justify-end mb-2 print:hidden">
        <Button
          variant="outline"
          onClick={downloadExcel}
          disabled={records.length === 0}
        >
          <Download /> تحميل Excel
        </Button>
      </div> */}

      {/* Sticky header: on md+ the box clips (overflow-clip is not a scroll
          container) so the header sticks to the viewport while the page
          scrolls. On phones it keeps the horizontal scroll instead. */}
      <div
        className="overflow-hidden md:overflow-clip md:[&_[data-slot=table-container]]:overflow-visible rounded-md border print:overflow-visible print:rounded-none print:border-0"
        hidden={hideTable}
      >
        <Table className="text-center">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center md:sticky md:top-0 md:z-10 bg-background shadow-[inset_0_-1px_0_var(--border)] print:static print:shadow-none"
                    >
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
                  لا توجد بيانات فى هذه الفترة.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>المجموع</TableCell>
              <TableCell>{formatNumber(Totals.flightCount)}</TableCell>
              <TableCell>{formatNumber(Totals.c)}</TableCell>
              <TableCell>{formatNumber(Totals.h)}</TableCell>
              <TableCell>{formatNumber(Totals.y)}</TableCell>
              <TableCell>{formatNumber(Totals.totalMeals)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable;
