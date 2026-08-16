type StoreIconName =
  | "account"
  | "bag"
  | "close"
  | "instagram"
  | "mail"
  | "menu"
  | "pinterest"
  | "search";

type StoreIconProps = {
  name: StoreIconName;
  size?: number;
};

export function StoreIcon({ name, size = 22 }: StoreIconProps) {
  const common = {
    "aria-hidden": true,
    fill: "none",
    height: size,
    viewBox: "0 0 24 24",
    width: size,
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (name) {
    case "menu":
      return (
        <svg {...common}>
          <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.7" cy="10.7" r="6.35" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M5.25 8.25h13.5l-.7 11H5.95l-.7-11Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.65" />
          <path d="M8.8 8.25V6.7a3.2 3.2 0 0 1 6.4 0v1.55" stroke="currentColor" strokeLinecap="round" strokeWidth="1.65" />
        </svg>
      );
    case "account":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.1" r="3.6" stroke="currentColor" strokeWidth="1.65" />
          <path d="M4.55 20c.62-3.5 3.48-5.7 7.45-5.7s6.83 2.2 7.45 5.7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.65" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.65" y="3.65" width="16.7" height="16.7" rx="4.3" stroke="currentColor" strokeWidth="1.65" />
          <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.65" />
          <circle cx="17.45" cy="6.65" r=".85" fill="currentColor" />
        </svg>
      );
    case "pinterest":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.65" />
          <path d="M10.2 19.25c.8-1.85 1.24-3.07 1.55-4.43M10.05 13.55c-.62-1.4-.36-4.23 2.5-4.23 1.94 0 2.77 1.4 2.77 3.03 0 2.3-.98 4.02-2.43 4.02-.8 0-1.4-.65-1.2-1.48l.47-1.93" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3.4" y="5.25" width="17.2" height="13.5" rx="1.5" stroke="currentColor" strokeWidth="1.65" />
          <path d="m4.35 6.35 7.65 6.18 7.65-6.18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65" />
        </svg>
      );
  }
}
