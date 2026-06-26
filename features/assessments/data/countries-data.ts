export interface CountryOption {
  id: string;
  name: string;
  states: { id: string; name: string }[];
}

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
