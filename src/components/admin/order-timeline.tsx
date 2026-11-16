import { formatDateTime } from "@/lib/admin/format";
import { orderStatusLabels } from "@/lib/admin/order-status";
import type { OrderEvent } from "@/lib/admin/types";

export function OrderTimeline({ events }: { events: OrderEvent[] }) {
  return (
    <ol className="a-timeline">
      {[...events].reverse().map((event) => (
        <li className={`a-timeline__item a-timeline__item--${event.type}`} key={event.id}>
          <div className="a-timeline__head">
            <strong>{event.toStatus ? orderStatusLabels[event.toStatus] : event.type === "note" ? "Бележка" : "Плащане"}</strong>
            <time dateTime={event.createdAt}>{formatDateTime(event.createdAt)}</time>
          </div>
          {event.message ? <p>{event.message}</p> : null}
          {event.actorId ? <span className="a-timeline__actor">от админа</span> : null}
        </li>
      ))}
    </ol>
  );
}
