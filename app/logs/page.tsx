import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { db } from "@/drizzle";
import { auditLogs } from "@/drizzle/db/schema";
import { formateARDate } from "@/lib/utils";
import { desc } from "drizzle-orm";
import { X } from "lucide-react";

const Logs = async () => {
  const Logs = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt));
  return (
    <main className="container mx-auto">
      {Logs.length > 0 ? (
        <div className="space-y-4">
          {Logs.map((i) => {
            const date = new Date(i.createdAt);
            const result =
              date.toDateString() + " " + date.toTimeString().split(" ")[0];

            let metaData =
              i.entity == "Flight Details"
                ? ({ ...i.metadata, objType: "Flight" } as logFlightDetails)
                : ({ ...i.metadata, objType: "Company" } as logCompanyDetails);

            if (metaData.objType == "Flight") {
              metaData = { ...metaData, date: formateARDate(result, true) };
            }
            return (
              // < !--Card -- >
              <div
                key={i.id}
                className={`${metaData.objType == "Flight" ? "bg-gray-900 hover:bg-gray-800" : "bg-orange-900 hover:bg-orange-800"} rounded-2xl p-5 shadow transition`}
              >
                {/* <!-- Header --> */}
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
                        {formateARDate(date.toDateString())}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`${i.action == "CREATE" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} text-xs px-3 py-1 rounded-full`}
                  >
                    {i.action == "CREATE" ? "انشاء" : "حذف"}
                  </span>
                </div>

                {/* <!-- Meta --> */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-400 max-w-[550px]">
                  {metaData.objType == "Flight" && (
                    <>
                      <div className="col-span-1">مسلسل: {metaData.id}</div>
                      <div className="col-span-1">
                        تاريخ الرحلة: {metaData.date}
                      </div>
                      <div className="col-span-1">
                        الشركة: {metaData.customerId}
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
    </main>
  );
};

export default Logs;
