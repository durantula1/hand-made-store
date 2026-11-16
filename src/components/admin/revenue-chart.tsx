import { formatMoney, formatShortDay } from "@/lib/admin/format";

/** Прост бар-чарт на прихода по дни (SVG, без библиотека). */
export function RevenueChart({ data }: { data: { date: string; cents: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.cents));
  const width = 560;
  const height = 180;
  const pad = { top: 12, bottom: 28, left: 6, right: 6 };
  const gap = data.length > 40 ? 2 : 6;
  const barWidth = (width - pad.left - pad.right - gap * (data.length - 1)) / data.length;
  const chartHeight = height - pad.top - pad.bottom;
  const total = data.reduce((s, d) => s + d.cents, 0);

  return (
    <figure className="a-chart">
      <svg aria-label={`Приход по дни, общо ${formatMoney(total)}`} role="img" viewBox={`0 0 ${width} ${height}`}>
        <line className="a-chart__axis" x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} />
        {data.map((d, index) => {
          const h = Math.max(d.cents > 0 ? 3 : 0, (d.cents / max) * chartHeight);
          const x = pad.left + index * (barWidth + gap);
          return (
            <g key={d.date}>
              <rect className="a-chart__bar" height={h} rx="2" width={barWidth} x={x} y={height - pad.bottom - h}>
                <title>{`${formatShortDay(d.date)}: ${formatMoney(d.cents)}`}</title>
              </rect>
              {index % Math.ceil(data.length / 8) === 0 ? (
                <text className="a-chart__label" textAnchor="middle" x={x + barWidth / 2} y={height - 10}>
                  {formatShortDay(d.date)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <figcaption className="a-chart__caption">Приход за последните {data.length} дни: {formatMoney(total)}</figcaption>
    </figure>
  );
}
