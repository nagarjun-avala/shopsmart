// Currency utility functions for multi-currency support
export type SupportedCurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CHF"
  | "CNY"
  | "INR"
  | "KRW"
  | "MXN"
  | "BRL";

export interface CurrencyDetails {
  symbol: string;
  name: string;
  code: SupportedCurrencyCode;
  position: "before" | "after";
}

export const SUPPORTED_CURRENCIES: Record<SupportedCurrencyCode, CurrencyDetails> = {
  USD: { symbol: "$", name: "US Dollar", code: "USD", position: "before" },
  EUR: { symbol: "€", name: "Euro", code: "EUR", position: "after" },
  GBP: { symbol: "£", name: "British Pound", code: "GBP", position: "before" },
  CAD: {
    symbol: "C$",
    name: "Canadian Dollar",
    code: "CAD",
    position: "before",
  },
  AUD: {
    symbol: "A$",
    name: "Australian Dollar",
    code: "AUD",
    position: "before",
  },
  JPY: { symbol: "¥", name: "Japanese Yen", code: "JPY", position: "before" },
  CHF: { symbol: "CHF", name: "Swiss Franc", code: "CHF", position: "after" },
  CNY: { symbol: "¥", name: "Chinese Yuan", code: "CNY", position: "before" },
  INR: { symbol: "₹", name: "Indian Rupee", code: "INR", position: "before" },
  KRW: {
    symbol: "₩",
    name: "South Korean Won",
    code: "KRW",
    position: "before",
  },
  MXN: { symbol: "MX$", name: "Mexican Peso", code: "MXN", position: "before" },
  BRL: {
    symbol: "R$",
    name: "Brazilian Real",
    code: "BRL",
    position: "before",
  },
};

// Currency exchange rates (in production, fetch from API)
export const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110.0,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5,
  KRW: 1180.0,
  MXN: 20.15,
  BRL: 5.25,
};

// Format currency with proper symbol placement and decimal handling
export interface FormatCurrencyOptions {
  showDecimals?: boolean;
  showSymbol?: boolean;
  showCode?: boolean;
}

export const formatCurrency = (
  amount: number | null | undefined,
  currencyCode = "INR",
  options: FormatCurrencyOptions = {}
) => {
  if (amount == null || isNaN(amount)) return "—";

  const currency =
    SUPPORTED_CURRENCIES?.[
    currencyCode as SupportedCurrencyCode
    ];
  if (!currency) return `${amount?.toFixed(2)}`;

  const { showDecimals = true, showSymbol = true, showCode = false } = options;

  const formattedAmount = showDecimals
    ? amount?.toFixed(2)
    : Math.round(amount)?.toString();

  let result = formattedAmount;

  if (showSymbol) {
    result =
      currency?.position === "before"
        ? `${currency?.symbol}${formattedAmount}`
        : `${formattedAmount} ${currency?.symbol}`;
  }

  if (showCode) {
    result = `${result} ${currency?.code}`;
  }

  return result;
};

// Convert between currencies
export const convertCurrency = (amount: number | null | undefined, fromCurrency: SupportedCurrencyCode, toCurrency: SupportedCurrencyCode) => {
  if (amount == null || isNaN(amount)) return 0;
  if (fromCurrency === toCurrency) return amount;

  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];

  if (!fromRate || !toRate) return amount;

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  const convertedAmount = usdAmount * toRate;

  return convertedAmount;
};

// Get currency options for dropdowns
// (removed duplicate declaration)

// (Removed duplicate getCurrencySymbol function and misplaced code)

// Get currency options for dropdowns
export const getCurrencyOptions = () => {
  return Object.entries(SUPPORTED_CURRENCIES)?.map(([code, details]) => ({
    value: code,
    label: `${details?.name} (${details?.symbol})`,
  }));
};

// Get currency symbol only
export const getCurrencySymbol = (currencyCode: string) => {
  if (currencyCode in SUPPORTED_CURRENCIES) {
    return SUPPORTED_CURRENCIES[currencyCode as SupportedCurrencyCode].symbol;
  }
  return "$";
};

// Parse currency string to number
export const parseCurrency = (currencyString: string | null | undefined) => {
  if (typeof currencyString !== "string") return 0;

  // Remove all non-numeric characters except decimal point and minus sign
  const numericString = currencyString?.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(numericString);

  return isNaN(parsed) ? 0 : parsed;
};

// Default currency preference (can be overridden by user settings)
export const DEFAULT_CURRENCY = "INR";
