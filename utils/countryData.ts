export interface CountryData {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export const countries: CountryData[] = [
  { name: "Canada", code: "CA", dial_code: "+1", flag: "🇨🇦" },
  { name: "United States", code: "US", dial_code: "+1", flag: "🇺🇸" },
  { name: "France", code: "FR", dial_code: "+33", flag: "🇫🇷" },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "🇬🇧" },
  { name: "Germany", code: "DE", dial_code: "+49", flag: "🇩🇪" },
  { name: "Spain", code: "ES", dial_code: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "IT", dial_code: "+39", flag: "🇮🇹" },
  { name: "Australia", code: "AU", dial_code: "+61", flag: "🇦🇺" },
  { name: "Japan", code: "JP", dial_code: "+81", flag: "🇯🇵" },
  { name: "China", code: "CN", dial_code: "+86", flag: "🇨🇳" },
  { name: "India", code: "IN", dial_code: "+91", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", dial_code: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dial_code: "+52", flag: "🇲🇽" },
  { name: "Russia", code: "RU", dial_code: "+7", flag: "🇷🇺" },
  { name: "South Korea", code: "KR", dial_code: "+82", flag: "🇰🇷" },
  { name: "Netherlands", code: "NL", dial_code: "+31", flag: "🇳🇱" },
  { name: "Belgium", code: "BE", dial_code: "+32", flag: "🇧🇪" },
  { name: "Switzerland", code: "CH", dial_code: "+41", flag: "🇨🇭" },
  { name: "Portugal", code: "PT", dial_code: "+351", flag: "🇵🇹" },
  { name: "Poland", code: "PL", dial_code: "+48", flag: "🇵🇱" },
  { name: "Sweden", code: "SE", dial_code: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dial_code: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", dial_code: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "FI", dial_code: "+358", flag: "🇫🇮" },
  { name: "Austria", code: "AT", dial_code: "+43", flag: "🇦🇹" },
  { name: "Greece", code: "GR", dial_code: "+30", flag: "🇬🇷" },
  { name: "Turkey", code: "TR", dial_code: "+90", flag: "🇹🇷" },
  { name: "Saudi Arabia", code: "SA", dial_code: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", code: "AE", dial_code: "+971", flag: "🇦🇪" },
  { name: "South Africa", code: "ZA", dial_code: "+27", flag: "🇿🇦" },
  { name: "Egypt", code: "EG", dial_code: "+20", flag: "🇪🇬" },
  { name: "Nigeria", code: "NG", dial_code: "+234", flag: "🇳🇬" },
  { name: "Morocco", code: "MA", dial_code: "+212", flag: "🇲🇦" },
  { name: "Argentina", code: "AR", dial_code: "+54", flag: "🇦🇷" },
  { name: "Colombia", code: "CO", dial_code: "+57", flag: "🇨🇴" },
  { name: "Chile", code: "CL", dial_code: "+56", flag: "🇨🇱" },
  { name: "Peru", code: "PE", dial_code: "+51", flag: "🇵🇪" },
  { name: "Venezuela", code: "VE", dial_code: "+58", flag: "🇻🇪" },
  { name: "Indonesia", code: "ID", dial_code: "+62", flag: "🇮🇩" },
  { name: "Philippines", code: "PH", dial_code: "+63", flag: "🇵🇭" },
  { name: "Thailand", code: "TH", dial_code: "+66", flag: "🇹🇭" },
  { name: "Malaysia", code: "MY", dial_code: "+60", flag: "🇲🇾" },
  { name: "Singapore", code: "SG", dial_code: "+65", flag: "🇸🇬" },
  { name: "Vietnam", code: "VN", dial_code: "+84", flag: "🇻🇳" },
  { name: "New Zealand", code: "NZ", dial_code: "+64", flag: "🇳🇿" },
  { name: "Pakistan", code: "PK", dial_code: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "BD", dial_code: "+880", flag: "🇧🇩" },
  { name: "Ireland", code: "IE", dial_code: "+353", flag: "🇮🇪" },
  { name: "Czech Republic", code: "CZ", dial_code: "+420", flag: "🇨🇿" },
  { name: "Romania", code: "RO", dial_code: "+40", flag: "🇷🇴" },
  { name: "Hungary", code: "HU", dial_code: "+36", flag: "🇭🇺" },
  { name: "Ukraine", code: "UA", dial_code: "+380", flag: "🇺🇦" },
];

export const getCountryByCode = (code: string): CountryData | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): CountryData | undefined => {
  return countries.find(country => country.dial_code === dialCode);
};