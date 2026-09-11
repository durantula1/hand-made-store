type StoreIconName =
  | "account"
  | "arrow"
  | "bag"
  | "chevron"
  | "close"
  | "filter"
  | "gift"
  | "instagram"
  | "mail"
  | "menu"
  | "minus"
  | "pinterest"
  | "plus"
  | "search"
  | "share";

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
          <path d="M4 8.5h16M4 15.5h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.7" cy="10.7" r="6.35" stroke="currentColor" strokeWidth="1.4" />
          <path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 8.2h12l-.65 11.1H6.65L6 8.2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
          <path d="M9 8.2V6.8a3 3 0 0 1 6 0v1.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "account":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.1" r="3.4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 19.2c.7-3.2 3.3-5.1 7-5.1s6.3 1.9 7 5.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
    case "gift":
      return (
        <svg {...common}>
          <rect x="4.2" y="10" width="15.6" height="9.4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M4.2 13.4h15.6M12 10v9.4M9.2 7.3c0-1.4 1-2.3 2.8-1.3C12 8.2 12 10 12 10s0-1.8.1-4c1.8-1 2.8-.1 2.8 1.3 0 1.4-1.6 2.7-2.9 2.7H9.2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M5 8h14M7.5 12h9M10 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <circle cx="6.2" cy="12" r="2.1" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="17.8" cy="6.5" r="2.1" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="17.8" cy="17.5" r="2.1" stroke="currentColor" strokeWidth="1.4" />
          <path d="m8 11 7.6-3.6M8 13.1 15.6 16.4" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case "minus":
      return (
        <svg {...common}>
          <path d="M6 12h12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M6 12h12M12 6v12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.65" y="3.65" width="16.7" height="16.7" rx="4.3" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="17.45" cy="6.65" r=".85" fill="currentColor" />
        </svg>
      );
    case "pinterest":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.2 19.25c.8-1.85 1.24-3.07 1.55-4.43M10.05 13.55c-.62-1.4-.36-4.23 2.5-4.23 1.94 0 2.77 1.4 2.77 3.03 0 2.3-.98 4.02-2.43 4.02-.8 0-1.4-.65-1.2-1.48l.47-1.93" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3.4" y="5.25" width="17.2" height="13.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="m4.35 6.35 7.65 6.18 7.65-6.18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
  }
}
