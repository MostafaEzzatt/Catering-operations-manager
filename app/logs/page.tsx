import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
import { X } from "lucide-react";

const Logs = async () => {
  const Logs = await db.select().from(auditLogs);
  console.log(Logs);
  return (
    <main className="container mx-auto">
      {Logs.length > 0 ? (
        <Accordion type="single" collapsible>
          {Logs.map((i) => {
            const date = new Date(i.createdAt);
            const result =
              date.toDateString() + " " + date.toTimeString().split(" ")[0];
            return (
              <AccordionItem key={i.id} value={`${i.id}`}>
                <AccordionTrigger>
                  <div>
                    <Badge
                      variant={i.action == "CREATE" ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {i.action == "CREATE" ? "انشاء" : "حذف"}
                    </Badge>{" "}
                    {` ${i.entity} من طرف ${i.user} فى تاريخ ${result} `}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre>{JSON.stringify(i.metadata, null, 4)}</pre>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
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
