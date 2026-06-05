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
  {
    id: "ghana",
    name: "Ghana",
    states: [
      { id: "greater-accra", name: "Greater Accra" },
      { id: "ashanti", name: "Ashanti" },
      { id: "western", name: "Western" },
      { id: "eastern", name: "Eastern" },
      { id: "central", name: "Central" },
      { id: "volta", name: "Volta" },
      { id: "northern", name: "Northern" },
      { id: "upper-east", name: "Upper East" },
      { id: "upper-west", name: "Upper West" },
      { id: "bono", name: "Bono" },
      { id: "ahafo", name: "Ahafo" },
      { id: "bono-east", name: "Bono East" },
      { id: "oti", name: "Oti" },
      { id: "savannah", name: "Savannah" },
      { id: "north-east", name: "North East" },
      { id: "western-north", name: "Western North" },
    ],
  },
  {
    id: "kenya",
    name: "Kenya",
    states: [
      { id: "nairobi", name: "Nairobi" },
      { id: "mombasa", name: "Mombasa" },
      { id: "kisumu", name: "Kisumu" },
      { id: "nakuru", name: "Nakuru" },
      { id: "eldoret", name: "Eldoret" },
      { id: "thika", name: "Thika" },
      { id: "malindi", name: "Malindi" },
      { id: "naivasha", name: "Naivasha" },
      { id: "nanyuki", name: "Nanyuki" },
      { id: "machakos", name: "Machakos" },
    ],
  },
  {
    id: "south-africa",
    name: "South Africa",
    states: [
      { id: "gauteng", name: "Gauteng" },
      { id: "western-cape", name: "Western Cape" },
      { id: "kwazulu-natal", name: "KwaZulu-Natal" },
      { id: "eastern-cape", name: "Eastern Cape" },
      { id: "limpopo", name: "Limpopo" },
      { id: "mpumalanga", name: "Mpumalanga" },
      { id: "north-west", name: "North West" },
      { id: "free-state", name: "Free State" },
      { id: "northern-cape", name: "Northern Cape" },
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
  return COUNTRIES.find((c) => c.id === id);
}

export function getStateById(countryId: string, stateId: string): string | undefined {
  const country = getCountryById(countryId);
  return country?.states.find((s) => s.id === stateId)?.name;
}
