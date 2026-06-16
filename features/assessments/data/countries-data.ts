export interface CountryOption {
  id: string;
  name: string;
  states: { id: string; name: string }[];
}

export const COUNTRIES: CountryOption[] = [
  {
    id: "nigeria",
    name: "Nigeria",
    states: [
      { id: "lagos", name: "Lagos" },
      { id: "abuja-fct", name: "Abuja (FCT)" },
      { id: "rivers", name: "Rivers" },
      { id: "kano", name: "Kano" },
      { id: "ibadan", name: "Oyo" },
      { id: "delta", name: "Delta" },
      { id: "kaduna", name: "Kaduna" },
      { id: "edo", name: "Edo" },
      { id: "enugu", name: "Enugu" },
      { id: "cros-river", name: "Cross River" },
      { id: "ogun", name: "Ogun" },
      { id: "akwa-ibom", name: "Akwa Ibom" },
      { id: "abia", name: "Abia" },
      { id: "anambra", name: "Anambra" },
      { id: "bauchi", name: "Bauchi" },
      { id: "bayelsa", name: "Bayelsa" },
      { id: "benue", name: "Benue" },
      { id: "borno", name: "Borno" },
      { id: "ebonyi", name: "Ebonyi" },
      { id: "ekiti", name: "Ekiti" },
      { id: "gombe", name: "Gombe" },
      { id: "imo", name: "Imo" },
      { id: "jigawa", name: "Jigawa" },
      { id: "katsina", name: "Katsina" },
      { id: "kebbi", name: "Kebbi" },
      { id: "kogi", name: "Kogi" },
      { id: "kwara", name: "Kwara" },
      { id: "nasarawa", name: "Nasarawa" },
      { id: "niger", name: "Niger" },
      { id: "ondo", name: "Ondo" },
      { id: "osun", name: "Osun" },
      { id: "plateau", name: "Plateau" },
      { id: "sokoto", name: "Sokoto" },
      { id: "taraba", name: "Taraba" },
      { id: "yobe", name: "Yobe" },
      { id: "zamfara", name: "Zamfara" },
    ],
  },
];

/** MVP-limited set: Nigeria only, 5 states */
export const ASSESSMENT_COUNTRIES: CountryOption[] = [
  {
    id: "nigeria",
    name: "Nigeria",
    states: [
      { id: "lagos", name: "Lagos" },
      { id: "oyo", name: "Oyo" },
      { id: "abuja-fct", name: "Abuja (FCT)" },
      { id: "rivers", name: "Rivers" },
      { id: "kano", name: "Kano" },
    ],
  },
];

export function getCountryById(id: string): CountryOption | undefined {
  return ASSESSMENT_COUNTRIES.find((c) => c.id === id);
}

export function getStateById(countryId: string, stateId: string): string | undefined {
  const country = getCountryById(countryId);
  return country?.states.find((s) => s.id === stateId)?.name;
}
