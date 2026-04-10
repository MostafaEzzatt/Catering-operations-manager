"use client";

import { auditLogs } from "@/drizzle/db/schema";
import { formateARDate } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { X } from "lucide-react";
import { useState } from "react";
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

const LogsClient = ({
  logs,
  users,
  customers,
}: {
  logs: LogEntry[];
  users: string[];
  customers: { id: number; name: string }[];
}) => {
  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

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
        />
      )}

      {filteredLogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLogs.map((i, idx) => {
            let metaData =
              i.entity == "Flight Details"
                ? ({ ...i.metadata, objType: "Flight" } as logFlightDetails)
                : ({ ...i.metadata, objType: "Company" } as logCompanyDetails);

            if (metaData.objType == "Flight") {
              const flightDate = metaData.date ?? i.createdAt;
              metaData = { ...metaData, date: formateARDate(flightDate, true) };
            }

            return (
              <div
                key={i.id}
                className={`${metaData.objType == "Flight" ? "bg-gray-900 hover:bg-gray-800" : "bg-orange-900 hover:bg-orange-800"} col-span-1 rounded-2xl p-5 shadow transition relative`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="text-2xl">
                      {metaData.objType == "Flight" ? "✈️" : "🏢"}
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {i.entity}
                      </h2>
                      <p className="text-sm text-gray-400">بواسطة {i.user}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formateARDate(i.createdAt)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`${i.action == "CREATE" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} text-xs px-3 py-1 rounded-full`}
                  >
                    {i.action == "CREATE" ? "انشاء" : "حذف"}
                  </span>
                </div>

                {/* Meta */}
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-gray-400 max-w-[550px]">
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
                      <div className="col-span-1">
                        عدد وجبات الكرو: {metaData.c}
                      </div>
                      <div className="col-span-1">
                        عدد وجبات البزنس: {metaData.h}
                      </div>
                      <div className="col-span-1">
                        عدد وجبات السياحى: {metaData.y}
                      </div>
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

                <div className="absolute bottom-0 left-0 w-12 h-12 bg-black/50 rounded-bl-2xl rounded-tr-2xl flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>
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
