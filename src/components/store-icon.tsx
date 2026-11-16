type StoreIconName =
  | "account"
  | "arrow"
  | "bag"
  | "close"
  | "filter"
  | "gift"
  | "hand"
  | "heart"
  | "return"
  | "ruler"
  | "shield"
  | "truck"
  | "chevron"
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
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 19.3s-7.2-4.3-7.2-9.4A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7.2 2.3c0 5.1-7.2 9.4-7.2 9.4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3.5 7h10.3v9.3H3.5zM13.8 10.2h3.6l3.1 3.2v2.9h-6.7" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
          <circle cx="7.3" cy="17.4" r="1.6" stroke="currentColor" strokeWidth="1.4" fill="var(--ivory, #fff)" />
          <circle cx="17" cy="17.4" r="1.6" stroke="currentColor" strokeWidth="1.4" fill="var(--ivory, #fff)" />
        </svg>
      );
    case "return":
      return (
        <svg {...common}>
          <path d="M8.5 6.5 5 10l3.5 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
          <path d="M5.5 10h8.8a4.7 4.7 0 0 1 0 9.4H9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.8 5.5 6.3v5.2c0 4.1 2.8 7.2 6.5 8.7 3.7-1.5 6.5-4.6 6.5-8.7V6.3L12 3.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
          <path d="m9.2 12 2 2 3.7-3.9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
    case "hand":
      return (
        <svg {...common}>
          <path d="M8.2 12.2V6.4a1.3 1.3 0 0 1 2.6 0v5M10.8 11V5.2a1.3 1.3 0 0 1 2.6 0V11M13.4 11V6.3a1.3 1.3 0 0 1 2.6 0v6.2M16 10.2a1.3 1.3 0 0 1 2.6 0v3.6c0 3.6-2.6 6.4-6.2 6.4-2.4 0-3.9-1.1-5.1-3l-2.1-3.4a1.3 1.3 0 0 1 2.1-1.5l.9 1.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
      );
    case "ruler":
      return (
        <svg {...common}>
          <path d="m3.8 15.6 11.8-11.8 4.6 4.6L8.4 20.2z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
          <path d="m7.6 11.8 1.8 1.8M10.4 9l1.2 1.2M13.2 6.2l1.8 1.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
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
