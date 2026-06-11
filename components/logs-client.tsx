"use client";

import { auditLogs } from "@/drizzle/db/schema";
import { formateARDate } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import LogsFilter from "./logs-filter";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

type LogEntry = InferSelectModel<typeof auditLogs>;

const actionLabels: Record<string, string> = {
  CREATE: "انشاء",
  UPDATE: "تعديل",
  DELETE: "حذف",
  REQUEST_DELETE: "طلب حذف",
  REJECT_DELETE: "رفض طلب حذف",
};

const actionStyles: Record<string, string> = {
  CREATE: "bg-green-500/20 text-green-700 dark:text-green-400",
  UPDATE: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  DELETE: "bg-red-500/20 text-red-700 dark:text-red-400",
  REQUEST_DELETE: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
  REJECT_DELETE: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
};

const LogsClient = ({
  logs,
  users,
  customers,
  logsPerPage,
}: {
  logs: LogEntry[];
  users: string[];
  customers: { id: number; name: string }[];
  logsPerPage: number;
}) => {
  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const filteredLogs = logs.filter((log) => {
    if (selectedUsers.length > 0 && !selectedUsers.includes(log.user))
      return false;

    if (selectedCompanyId !== null) {
      if (log.entity === "Flight Details") {
        const meta = log.metadata as logFlightDetails | null;
        if (!meta || meta.customerId !== selectedCompanyId) return false;
      } else {
        const meta = log.metadata as logCompanyDetails | null;
        if (!meta || meta.id !== selectedCompanyId) return false;
      }
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (new Date(log.createdAt) < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(log.createdAt) > to) return false;
    }

    return true;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const hasActiveFilters =
    selectedUsers.length > 0 ||
    selectedCompanyId !== null ||
    dateFrom !== undefined ||
    dateTo !== undefined;

  useEffect(() => {
    if (hasActiveFilters && currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(1);
    }
  }, [hasActiveFilters, currentPage, totalPages]);

  return (
    <>
      {users.length > 0 && (
        <LogsFilter
          users={users}
          selectedUsers={selectedUsers}
          onUsersChange={setSelectedUsers}
          customers={customers}
          selectedCompanyId={selectedCompanyId}
          onCompanyChange={setSelectedCompanyId}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onResetFilters={() => setCurrentPage(1)}
        />
      )}

      {paginatedLogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedLogs.map((i, idx) => {
              let metaData =
                i.entity == "Flight Details"
                  ? ({ ...i.metadata, objType: "Flight" } as logFlightDetails)
                  : ({
                      ...i.metadata,
                      objType: "Company",
                    } as logCompanyDetails);

              if (metaData.objType == "Flight") {
                const flightDate = metaData.date ?? i.createdAt;
                metaData = {
                  ...metaData,
                  date: formateARDate(flightDate, true),
                };
              }

              return (
                <div
                  key={i.id}
                  className={`${metaData.objType == "Flight" ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800" : "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800"} col-span-1 rounded-2xl p-5 shadow transition relative`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="text-2xl">
                        {metaData.objType == "Flight" ? "✈️" : "🏢"}
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          {i.entity}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          بواسطة {i.user}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formateARDate(i.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`${actionStyles[i.action] ?? actionStyles.DELETE} text-xs px-3 py-1 rounded-full`}
                    >
                      {actionLabels[i.action] ?? i.action}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-muted-foreground max-w-[550px]">
                    {metaData.objType == "Flight" && (
                      <>
                        <div className="col-span-1">مسلسل: {metaData.id}</div>
                        <div className="col-span-1">
                          تاريخ الرحلة: {metaData.date}
                        </div>
                        <div className="col-span-1">
                          الشركة:{" "}
                          {customerMap.get(metaData.customerId) ??
                            metaData.customerId}
                        </div>
                        <div className="col-span-1">
                          عدد الرحلات: {metaData.flightCount}
                        </div>
                        {/* <div className="col-span-1">
                          عدد وجبات الكرو: {metaData.c}
                        </div>
                        <div className="col-span-1">
                          عدد وجبات البزنس: {metaData.h}
                        </div>
                        <div className="col-span-1">
                          عدد وجبات السياحى: {metaData.y}
                        </div> */}
                      </>
                    )}

                    {metaData.objType == "Company" && (
                      <>
                        <div className="col-span-1">مسلسل: {metaData.id}</div>
                        <div className="col-span-1">الاسم: {metaData.name}</div>
                        <div className="col-span-1">
                          كود العميل: {metaData.code}
                        </div>
                        <div className="col-span-1">
                          رقم العميل: {metaData.cNumber}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-black/10 dark:bg-black/50 rounded-bl-2xl rounded-tr-2xl flex items-center justify-center font-bold text-foreground">
                    {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                عرض {paginatedLogs.length} من {filteredLogs.length} سجل
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded cursor-pointer"
                >
                  السابق
                </button>

                <span className="text-sm text-muted-foreground">
                  صفحة {currentPage} من {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded cursor-pointer"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <X />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>No data found</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>No One Did Any Action Until Now</EmptyContent>
        </Empty>
      )}
    </>
  );
};

export default LogsClient;
