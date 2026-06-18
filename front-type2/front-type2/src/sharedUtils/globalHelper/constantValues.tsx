export const AMPS = [
  "admin",
  "management",
  "partner",
  "sales_rep",
  "everyone",
  "Admin",
  "Management",
  "Partner",
  "Sales Rep",
];
export const AM = ["admin", "management", "Admin", "Management"];
export const AMS = [
  "admin",
  "management",
  "sales_rep",
  "Admin",
  "Management",
  "Sales Rep",
];
export const AMP = [
  "admin",
  "management",
  "partner",
  "Admin",
  "Management",
  "Partner",
];
export const MP = ["management", "partner", "Management", "Partner"];
export const A = ["admin", "Admin"];
export const ASI = ["Installer", "Surveyor"];
export const LeadPresetFilter = [
  "New Lead",
  "Existing Client Lead",
  "Lead Contacted",
  "Sales Intro Email Sent",
  "Sales Text Sent",
  "Client Interested",
  "Proposal Sent",
  "Waiting",
  "Final Stage",
  "Lead Closed",
  "DND",
  "Lead Imported",
  "No Ans",
  "Not Interested",
];
export const SearchLength = 0;

export const appointmentTypeOptions = [
  {
    label: "Eco Surveys",
    value: "Eco Surveys",
    type: [],
  },
  {
    label: "Scaffolding Installs",
    value: "Scaffolding Installs",
    type: [
      {
        label: "Scaffolding Up",
        value: "Scaffolding Up",
      },
      {
        label: "Scaffolding Down",
        value: "Scaffolding Down",
      },
    ],
  },
  {
    label: "Solar Installs",
    value: "Solar Installs",
    type: [
      {
        label: "Full Solar",
        value: "Full Solar",
      },
      {
        label: "Battery Only",
        value: "Battery Only",
      },
      {
        label: "Solar Only",
        value: "Solar Only",
      },
      {
        label: "EV Charger",
        value: "EV Charger",
      },
    ],
  },
  {
    label: "ECO Installs",
    value: "ECO Installs",
    type: [
      {
        label: "LI",
        value: "LI",
      },
      {
        label: "CWI",
        value: "CWI",
      },
      {
        label: "UFI",
        value: "UFI",
      },
      {
        label: "IWI",
        value: "IWI",
      },
      {
        label: "EWI",
        value: "EWI",
      },
      {
        label: "Tvents",
        value: "Tvents",
      },
      {
        label: "Exfans",
        value: "Exfans",
      },
      {
        label: "FTCH",
        value: "FTCH",
      },
      {
        label: "Boiler",
        value: "Boiler",
      },
      {
        label: "Heating Controllers",
        value: "Heating Controllers",
      },
      {
        label: "TTZC",
        value: "TTZC",
      },
      {
        label: "Solar",
        value: "Solar",
      },
      {
        label: "Air-source Heat Pumps",
        value: "Air-source Heat Pumps",
      },
      {
        label: "Room In Roof",
        value: "Room In Roof",
      },
    ],
  },
  {
    label: "Solar Survey",
    value: "Solar Survey",
    type: [],
  },
  {
    label: "Edan Scaffolding Down",
    value: "Edan Scaffolding Down",
    type: [],
  },
];

export const ManufacturerOptions = [
  {
    label: "Vaillant",
    value: "Vaillant",
    models: [
      {
        label: "VU 156/6-3 (H-GB) ecoFIT sustain 615",
        value: "VU 156/6-3 (H-GB) ecoFIT sustain 615",
      },
      {
        label: "VU 186/6-3 (H-GB) ecoFIT sustain 618",
        value: "VU 186/6-3 (H-GB) ecoFIT sustain 618",
      },
      {
        label: "VU 306/6-3 (H-GB) ecoFIT sustain 630",
        value: "VU 306/6-3 (H-GB) ecoFIT sustain 630",
      },
      {
        label: "VU 186/6-3 OV (H-GB) ecoFIT sustain 418",
        value: "VU 186/6-3 OV (H-GB) ecoFIT sustain 418",
      },
      {
        label: "VU 156/6-3 OV (H-GB) ecoFIT sustain 415",
        value: "VU 156/6-3 OV (H-GB) ecoFIT sustain 415",
      },
      {
        label: "VU 306/6-3 OV (H-GB) ecoFIT sustain 430",
        value: "VU 306/6-3 OV (H-GB) ecoFIT sustain 430",
      },
      {
        label: "VUW 246/7-2 (H-GB) ecoTEC sustain 24",
        value: "VUW 246/7-2 (H-GB) ecoTEC sustain 24",
      },
      {
        label: "VUW 286/7-2 (H-GB) ecoTEC sustain 28",
        value: "VUW 286/7-2 (H-GB) ecoTEC sustain 28",
      },
      {
        label: "VUW 346/7-2 (H-GB) ecoTEC sustain 34",
        value: "VUW 346/7-2 (H-GB) ecoTEC sustain 34",
      },
    ],
  },
  {
    label: "Worcester",
    value: "Worcester",
    models: [
      {
        label: "WORCESTER GREENSTAR 4000 25KW ERP COMBI BOILER",
        value: "WORCESTER GREENSTAR 4000 25KW ERP COMBI BOILER",
      },
      {
        label: "WORCESTER GREENSTAR 4000 30KW ERP COMBI BOILER",
        value: "WORCESTER GREENSTAR 4000 30KW ERP COMBI BOILER",
      },
      {
        label: "WORCESTER GREENSTAR 8000 LIFE 35KW ERP COMBI BOILER",
        value: "WORCESTER GREENSTAR 8000 LIFE 35KW ERP COMBI BOILER",
      },
    ],
  },
  {
    label: "Horstmaan",
    value: "Horstmaan",
    models: [
      {
        label: "SECURE HORSTMANN PLUG-IN WIFI MODULE SCW100-000",
        value: "SECURE HORSTMANN PLUG-IN WIFI MODULE SCW100-000",
      },
      {
        label:
          "SECURE HORSTMANN C1727 SMART PROGRAMMER WITH 2 CHANNEL RECEIVER INCLUDING THERMOSTAT DISPLAY AND APP SCT200-000",
        value:
          "SECURE HORSTMANN C1727 SMART PROGRAMMER WITH 2 CHANNEL RECEIVER INCLUDING THERMOSTAT DISPLAY AND APP SCT200-000",
      },
      {
        label:
          "SECURE HORSTMANN RADBOT 1 INTELLIGENT TRV (HEAD ONLY) SCV100- 000 x 2",
        value:
          "SECURE HORSTMANN RADBOT 1 INTELLIGENT TRV (HEAD ONLY) SCV100- 000 x 2",
      },
    ],
  },
];

export const EPCRatingOptions = [
  {
    label: "A",
    value: "A",
  },
  {
    label: "B",
    value: "B",
  },
  {
    label: "C",
    value: "C",
  },
  {
    label: "D",
    value: "D",
  },
  {
    label: "E",
    value: "E",
  },
  {
    label: "F",
    value: "F",
  },
  {
    label: "G",
    value: "G",
  },
  {
    label: "NO EPC",
    value: "NO EPC",
  },
];

export const leadTypes = [
  {
    label: "B2B Sales",
    value: "B2B Sales",
  },
  {
    label: "Paid Solar Sales",
    value: "Paid Solar Sales",
  },
  {
    label: "ECO Sales",
    value: "ECO Sales",
  },
];

// Consumer-relevant lead types (used for consumer CRM flow)
export const consumerLeadTypes = [
  { label: "Paid Solar", value: "Paid Solar" },
  { label: "Eco", value: "Eco" },
  { label: "Scaffolding", value: "Scaffolding" },
  { label: "Telecoms", value: "Telecoms" },
  { label: "ASHP", value: "ASHP" },
];

export const InstallerTypeOptions = [
  {
    label: "Scaffolders",
    value: "Scaffolders",
  },
  {
    label: "Roofers",
    value: "Roofers",
  },
  {
    label: "Electricians",
    value: "Electricians",
  },
  {
    label: "Gas Engineers",
    value: "GasEngineers",
  },
  {
    label: "Cavity Wall Installer",
    value: "CavityWallInstaller",
  },
  {
    label: "Under Floor Installer",
    value: "UnderFloorInstaller",
  },
  {
    label: "Loft Installer",
    value: "LoftInstaller",
  },
  {
    label: "Ventilation Installer",
    value: "VentilationInstaller",
  },
  {
    label: "Internal Wall Insulation",
    value: "InternalWallInsulation",
  },
  {
    label: "External Wall Insulation",
    value: "ExternalWallInsulation",
  },
  {
    label: "Room In Roof Installer",
    value: "RoomInRoofInstaller",
  },
  {
    label: "ASHP Installer",
    value: "ASHPInstaller",
  },
];

export const SurveyforOptions = [
  {
    value: "Gas",
    label: "Gas",
  },
  {
    value: "Electric",
    label: "Electric",
  },
  {
    label: "Telecoms & Broadband",
    value: "Telecoms & Broadband",
  },
  {
    value: "Water",
    label: "Water",
  },
  {
    value: "Chip And Pin",
    label: "Chip And Pin",
  },
  {
    value: "Telecoms",
    label: "Telecoms",
  },
  {
    value: "Broadband",
    label: "Broadband",
  },
  {
    value: "Energy",
    label: "Energy",
  },
  { value: "Waste", label: "Waste" },
  { value: "Insurance", label: "Insurance" },
  { value: "Businessrates", label: "Businessrates" },
  { value: "Eco-Boilers", label: "Eco-Boilers" },
  { value: "Eco-Ufi Underfloor", label: "Eco-Ufi Underfloor" },
  { value: "Eco-Cavity Wall", label: "Eco-Cavity Wall" },
  { value: "Eco-Esh", label: "Eco-Esh" },
  { value: "Eco-Ftch", label: "Eco-Ftch" },
  { value: "Eco-Ewi", label: "Eco-Ewi" },
  { value: "Eco-Iwi", label: "Eco-Iwi" },
  { value: "Eco-Room In A Roof", label: "Eco-Room In A Roof" },
  { value: "Eco-Loft Insulation", label: "Eco-Loft Insulation" },
  { value: "Eco-Solar", label: "Eco-Solar" },
  { value: "Eco-Battery Storage", label: "Eco-Battery Storage" },
  { value: "Eco-Invertor", label: "Eco-Invertor" },
];

export const AppointmentStatusOptions = [
  {
    label: "Follow Up",
    value: "5",
  },
  {
    label: "Revisit",
    value: "6",
  },
  {
    label: "Scaffolding",
    value: "7",
  },
  {
    label: "Installation",
    value: "8",
  },
  // OLD STATUS
  {
    label: "Booked",
    value: "1",
  },
  {
    label: "Finished",
    value: "2",
  },
  {
    label: "Schedule",
    value: "3",
  },
  {
    label: "Survey",
    value: "4",
  },
];

export const AppointmentServices = [
  {
    label: "Solar",
    value: "Solar",
  },
  {
    label: "Energy",
    value: "Energy",
  },
  {
    label: "Business Rates",
    value: "Business Rates",
  },
  {
    label: "Eco",
    value: "Eco",
  },
];

export const MonthlyPaymentPlans = [
  {
    label: "Bronze - £17.09",
    value: "Bronze - £17.09",
    age: 50,
  },
  {
    label: "Zinc - £20.88",
    value: "Zinc - £20.88",
    age: 50,
  },
  {
    label: "Silver - £24.32",
    value: "Silver - £24.32",
    age: 50,
  },
  {
    label: "Gold - £26.74",
    value: "Gold - £26.74",
    age: 50,
  },
  {
    label: "Platinum - £28.44",
    value: "Platinum - £28.44",
    age: 50,
  },

  {
    label: "Bronze - £17.40",
    value: "Bronze - £17.40",
    age: 51,
  },
  {
    label: "Zinc - £21.26",
    value: "Zinc - £21.26",
    age: 51,
  },
  {
    label: "Silver - £24.76",
    value: "Silver - £24.76",
    age: 51,
  },
  {
    label: "Gold - £27.22",
    value: "Gold - £27.22",
    age: 51,
  },
  {
    label: "Platinum - £28.96",
    value: "Platinum - £28.96",
    age: 51,
  },

  {
    label: "Bronze - £17.73",
    value: "Bronze - £17.73",
    age: 52,
  },
  {
    label: "Zinc - £21.66",
    value: "Zinc - £21.66",
    age: 52,
  },
  {
    label: "Silver - £25.23",
    value: "Silver - £25.23",
    age: 52,
  },
  {
    label: "Gold - £27.74",
    value: "Gold - £27.74",
    age: 52,
  },
  {
    label: "Platinum - £29.50",
    value: "Platinum - £29.50",
    age: 52,
  },

  {
    label: "Bronze - £18.08",
    value: "Bronze - £18.08",
    age: 53,
  },
  {
    label: "Zinc - £22.08",
    value: "Zinc - £22.08",
    age: 53,
  },
  {
    label: "Silver - £25.72",
    value: "Silver - £25.72",
    age: 53,
  },
  {
    label: "Gold - £28.28",
    value: "Gold - £28.28",
    age: 53,
  },
  {
    label: "Platinum - £30.08",
    value: "Platinum - £30.08",
    age: 53,
  },

  {
    label: "Bronze - £18.44",
    value: "Bronze - £18.44",
    age: 54,
  },
  {
    label: "Zinc - £22.53",
    value: "Zinc - £22.53",
    age: 54,
  },
  {
    label: "Silver - £26.25",
    value: "Silver - £26.25",
    age: 54,
  },
  {
    label: "Gold - £28.86",
    value: "Gold - £28.86",
    age: 54,
  },
  {
    label: "Platinum - £30.70",
    value: "Platinum - £30.70",
    age: 54,
  },

  {
    label: "Bronze - £18.83",
    value: "Bronze - £18.83",
    age: 55,
  },
  {
    label: "Zinc - £23.01",
    value: "Zinc - £23.01",
    age: 55,
  },
  {
    label: "Silver - £26.80",
    value: "Silver - £26.80",
    age: 55,
  },
  {
    label: "Gold - £29.46",
    value: "Gold - £29.46",
    age: 55,
  },
  {
    label: "Platinum - £31.34",
    value: "Platinum - £31.34",
    age: 55,
  },

  {
    label: "Bronze - £19.24",
    value: "Bronze - £19.24",
    age: 56,
  },
  {
    label: "Zinc - £23.50",
    value: "Zinc - £23.50",
    age: 56,
  },
  {
    label: "Silver - £27.37",
    value: "Silver - £27.37",
    age: 56,
  },
  {
    label: "Gold - £30.10",
    value: "Gold - £30.10",
    age: 56,
  },
  {
    label: "Platinum - £32.01",
    value: "Platinum - £32.01",
    age: 56,
  },

  {
    label: "Bronze - £19.66",
    value: "Bronze - £19.66",
    age: 57,
  },
  {
    label: "Zinc - £24.02",
    value: "Zinc - £24.02",
    age: 57,
  },
  {
    label: "Silver - £27.98",
    value: "Silver - £27.98",
    age: 57,
  },
  {
    label: "Gold - £30.76",
    value: "Gold - £30.76",
    age: 57,
  },
  {
    label: "Platinum - £32.72",
    value: "Platinum - £32.72",
    age: 57,
  },

  {
    label: "Bronze - £20.11",
    value: "Bronze - £20.11",
    age: 58,
  },
  {
    label: "Zinc - £24.56",
    value: "Zinc - £24.56",
    age: 58,
  },
  {
    label: "Silver - £28.61",
    value: "Silver - £28.61",
    age: 58,
  },
  {
    label: "Gold - £31.46",
    value: "Gold - £31.46",
    age: 58,
  },
  {
    label: "Platinum - £33.46",
    value: "Platinum - £33.46",
    age: 58,
  },

  {
    label: "Bronze - £20.58",
    value: "Bronze - £20.58",
    age: 59,
  },
  {
    label: "Zinc - £25.14",
    value: "Zinc - £25.14",
    age: 59,
  },
  {
    label: "Silver - £29.29",
    value: "Silver - £29.29",
    age: 59,
  },
  {
    label: "Gold - £32.20",
    value: "Gold - £32.20",
    age: 59,
  },
  {
    label: "Platinum - £34.25",
    value: "Platinum - £34.25",
    age: 59,
  },

  {
    label: "Bronze - £21.09",
    value: "Bronze - £21.09",
    age: 60,
  },
  {
    label: "Zinc - £25.76",
    value: "Zinc - £25.76",
    age: 60,
  },
  {
    label: "Silver - £30.01",
    value: "Silver - £30.01",
    age: 60,
  },
  {
    label: "Gold - £32.99",
    value: "Gold - £32.99",
    age: 60,
  },
  {
    label: "Platinum - £35.09",
    value: "Platinum - £35.09",
    age: 60,
  },

  {
    label: "Bronze - £21.63",
    value: "Bronze - £21.63",
    age: 61,
  },
  {
    label: "Zinc - £26.42",
    value: "Zinc - £26.42",
    age: 61,
  },
  {
    label: "Silver - £30.78",
    value: "Silver - £30.78",
    age: 61,
  },
  {
    label: "Gold - £33.84",
    value: "Gold - £33.84",
    age: 61,
  },
  {
    label: "Platinum - £36.00",
    value: "Platinum - £36.00",
    age: 61,
  },

  {
    label: "Bronze - £22.21",
    value: "Bronze - £22.21",
    age: 62,
  },
  {
    label: "Zinc - £27.14",
    value: "Zinc - £27.14",
    age: 62,
  },
  {
    label: "Silver - £31.61",
    value: "Silver - £31.61",
    age: 62,
  },
  {
    label: "Gold - £34.76",
    value: "Gold - £34.76",
    age: 62,
  },
  {
    label: "Platinum - £36.97",
    value: "Platinum - £36.97",
    age: 62,
  },

  {
    label: "Bronze - £22.85",
    value: "Bronze - £22.85",
    age: 63,
  },
  {
    label: "Zinc - £27.91",
    value: "Zinc - £27.91",
    age: 63,
  },
  {
    label: "Silver - £32.51",
    value: "Silver - £32.51",
    age: 63,
  },
  {
    label: "Gold - £35.75",
    value: "Gold - £35.75",
    age: 63,
  },
  {
    label: "Platinum - £38.02",
    value: "Platinum - £38.02",
    age: 63,
  },

  {
    label: "Bronze - £23.53",
    value: "Bronze - £23.53",
    age: 64,
  },
  {
    label: "Zinc - £28.75",
    value: "Zinc - £28.75",
    age: 64,
  },
  {
    label: "Silver - £33.49",
    value: "Silver - £33.49",
    age: 64,
  },
  {
    label: "Gold - £36.82",
    value: "Gold - £36.82",
    age: 64,
  },
  {
    label: "Platinum - £39.16",
    value: "Platinum - £39.16",
    age: 64,
  },

  {
    label: "Bronze - £24.27",
    value: "Bronze - £24.27",
    age: 65,
  },
  {
    label: "Zinc - £29.65",
    value: "Zinc - £29.65",
    age: 65,
  },
  {
    label: "Silver - £34.53",
    value: "Silver - £34.53",
    age: 65,
  },
  {
    label: "Gold - £37.97",
    value: "Gold - £37.97",
    age: 65,
  },
  {
    label: "Platinum - £40.39",
    value: "Platinum - £40.39",
    age: 65,
  },

  {
    label: "Bronze - £25.07",
    value: "Bronze - £25.07",
    age: 66,
  },
  {
    label: "Zinc - £30.62",
    value: "Zinc - £30.62",
    age: 66,
  },
  {
    label: "Silver - £35.67",
    value: "Silver - £35.67",
    age: 66,
  },
  {
    label: "Gold - £39.22",
    value: "Gold - £39.22",
    age: 66,
  },
  {
    label: "Platinum - £41.72",
    value: "Platinum - £41.72",
    age: 66,
  },

  {
    label: "Bronze - £25.93",
    value: "Bronze - £25.93",
    age: 67,
  },
  {
    label: "Zinc - £31.68",
    value: "Zinc - £31.68",
    age: 67,
  },
  {
    label: "Silver - £36.90",
    value: "Silver - £36.90",
    age: 67,
  },
  {
    label: "Gold - £40.57",
    value: "Gold - £40.57",
    age: 67,
  },
  {
    label: "Platinum - £43.16",
    value: "Platinum - £43.16",
    age: 67,
  },

  {
    label: "Bronze - £26.87",
    value: "Bronze - £26.87",
    age: 68,
  },
  {
    label: "Zinc - £32.83",
    value: "Zinc - £32.83",
    age: 68,
  },
  {
    label: "Silver - £38.24",
    value: "Silver - £38.24",
    age: 68,
  },
  {
    label: "Gold - £42.04",
    value: "Gold - £42.04",
    age: 68,
  },
  {
    label: "Platinum - £44.72",
    value: "Platinum - £44.72",
    age: 68,
  },

  {
    label: "Bronze - £27.89",
    value: "Bronze - £27.89",
    age: 69,
  },
  {
    label: "Zinc - £34.07",
    value: "Zinc - £34.07",
    age: 69,
  },
  {
    label: "Silver - £39.69",
    value: "Silver - £39.69",
    age: 69,
  },
  {
    label: "Gold - £43.64",
    value: "Gold - £43.64",
    age: 69,
  },
  {
    label: "Platinum - £46.42",
    value: "Platinum - £46.42",
    age: 69,
  },

  {
    label: "Bronze - £28.98",
    value: "Bronze - £28.98",
    age: 70,
  },
  {
    label: "Zinc - £35.40",
    value: "Zinc - £35.40",
    age: 70,
  },
  {
    label: "Silver - £41.24",
    value: "Silver - £41.24",
    age: 70,
  },
  {
    label: "Gold - £45.34",
    value: "Gold - £45.34",
    age: 70,
  },
  {
    label: "Platinum - £48.23",
    value: "Platinum - £48.23",
    age: 70,
  },

  {
    label: "Bronze - £30.16",
    value: "Bronze - £30.16",
    age: 71,
  },
  {
    label: "Zinc - £36.85",
    value: "Zinc - £36.85",
    age: 71,
  },
  {
    label: "Silver - £42.92",
    value: "Silver - £42.92",
    age: 71,
  },
  {
    label: "Gold - £47.19",
    value: "Gold - £47.19",
    age: 71,
  },
  {
    label: "Platinum - £50.20",
    value: "Platinum - £50.20",
    age: 71,
  },

  {
    label: "Bronze - £31.45",
    value: "Bronze - £31.45",
    age: 72,
  },
  {
    label: "Zinc - £38.42",
    value: "Zinc - £38.42",
    age: 72,
  },
  {
    label: "Silver - £44.75",
    value: "Silver - £44.75",
    age: 72,
  },
  {
    label: "Gold - £49.20",
    value: "Gold - £49.20",
    age: 72,
  },
  {
    label: "Platinum - £52.34",
    value: "Platinum - £52.34",
    age: 72,
  },

  {
    label: "Bronze - £32.85",
    value: "Bronze - £32.85",
    age: 73,
  },
  {
    label: "Zinc - £40.14",
    value: "Zinc - £40.14",
    age: 73,
  },
  {
    label: "Silver - £46.75",
    value: "Silver - £46.75",
    age: 73,
  },
  {
    label: "Gold - £51.40",
    value: "Gold - £51.40",
    age: 73,
  },
  {
    label: "Platinum - £54.68",
    value: "Platinum - £54.68",
    age: 73,
  },

  {
    label: "Bronze - £34.40",
    value: "Bronze - £34.40",
    age: 74,
  },
  {
    label: "Zinc - £42.03",
    value: "Zinc - £42.03",
    age: 74,
  },
  {
    label: "Silver - £48.96",
    value: "Silver - £48.96",
    age: 74,
  },
  {
    label: "Gold - £53.82",
    value: "Gold - £53.82",
    age: 74,
  },
  {
    label: "Platinum - £57.25",
    value: "Platinum - £57.25",
    age: 74,
  },

  {
    label: "Bronze - £36.11",
    value: "Bronze - £36.11",
    age: 75,
  },
  {
    label: "Zinc - £44.12",
    value: "Zinc - £44.12",
    age: 75,
  },
  {
    label: "Silver - £51.39",
    value: "Silver - £51.39",
    age: 75,
  },
  {
    label: "Gold - £56.50",
    value: "Gold - £56.50",
    age: 75,
  },
  {
    label: "Platinum - £60.10",
    value: "Platinum - £60.10",
    age: 75,
  },
];

export const FuneralProviderOptions = [
  {
    label: "Suppliers is Golden leaves",
    value: "Suppliers is Golden leaves",
  },
  {
    label: "A new company will be available soon",
    value: "A new company will be available soon",
  },
];

export const Title = [
  {
    label: "Mr",
    value: "Mr",
  },
  {
    label: "Mrs",
    value: "Mrs",
  },
  {
    label: "Miss",
    value: "Miss",
  },
  {
    label: "Ms",
    value: "Ms",
  },
  {
    label: "Dr",
    value: "Dr",
  },
];

export const LESStatusOptions = [
  {
    label: "Les Status",
    value: 1000,
  },
  {
    label: "Abandoned",
    value: 1001,
  },
  {
    label: "Awaiting Registration",
    value: 1002,
  },
  {
    label: "Contract Accepted",
    value: 1003,
  },
  {
    label: "Contract Sent",
    value: 1004,
  },
  {
    label: "Failed Registration",
    value: 1005,
  },
  {
    label: "Live",
    value: 1006,
  },
  {
    label: "Objection in Progress",
    value: 1007,
  },
  {
    label: "Registration Pending",
    value: 1008,
  },
  {
    label: "Return",
    value: 1009,
  },
];

export const HeadlineStatusOptions = [
  {
    label: "Dead",
    value: 1000,
  },
  {
    label: "Needs Attention",
    value: 1001,
  },
  {
    label: "New Sale No Status Recieved",
    value: 1002,
  },
  {
    label: "Over 7 days no status check",
    value: 1003,
  },
  {
    label: "Paid",
    value: 1004,
  },
  {
    label: "Partner Payment Reconcile",
    value: 1005,
  },
  {
    label: "Partner Pending for Payment",
    value: 1006,
  },
  {
    label: "Waiting for Supplier Payment",
    value: 1007,
  },
  {
    label: "Work in Progress",
    value: 1008,
  },
];

export const FuneralTypes = [
  {
    label: "Cremation",
    value: "Cremation",
  },
  {
    label: "Burial",
    value: "Burial",
  },
];

export const FuneralPaymentTypes = [
  {
    label: "SINGLE PAYMENT",
    value: "SINGLE PAYMENT",
  },
  {
    label: "12MTHS",
    value: "12MTHS",
  },
  {
    label: "24MTHS",
    value: "24MTHS",
  },
  {
    label: "36MTHS",
    value: "36MTHS",
  },
  {
    label: "60MTHS",
    value: "60MTHS",
  },
];

export const MorgageType = [
  {
    label: "First Time Buyer",
    value: "First Time Buyer",
  },
  {
    label: "Second Purchase",
    value: "Second Purchase",
  },
  {
    label: "Buy To Let",
    value: "Buy To Let",
  },
  {
    label: "Let to Buy",
    value: "Let to Buy",
  },
  {
    label: "Remortgage",
    value: "Remortgage",
  },
  {
    label: "Commercial",
    value: "Commercial",
  },
];

export const ContractLengthOption = [
  {
    label: "1 year",
    value: "1 year",
  },
  {
    label: "2 year",
    value: "2 years",
  },
  {
    label: "3 year",
    value: "3 years",
  },
  {
    label: "4 year",
    value: "4 years",
  },
  {
    label: "5 year",
    value: "5 years",
  },
];

export const ContractLengthValue = {
  "1 year": 1,
  "2 years": 2,
  "3 years": 3,
  "4 years": 4,
  "5 years": 5,
};

export const yesAndNoOptions = [
  {
    label: "YES",
    value: "YES",
  },
  {
    label: "NO",
    value: "NO",
  },
];

export const PropertyOptions = [
  {
    label: "DETACHED",
    value: "DETACHED",
  },
  {
    label: "SEMI-DETACHED",
    value: "SEMI-DETACHED",
  },
  {
    label: "ATTACHED",
    value: "ATTACHED",
  },
  {
    label: "BUNGALOW",
    value: "BUNGALOW",
  },
];

export const DebtServiceTypes = [
  {
    label: "COMMERCIAL LITIGATION & ABITRATION",
    value: "COMMERCIAL LITIGATION & ABITRATION",
  },
  {
    label: "COMPANY CLOSURE & WINDING UP",
    value: "COMPANY CLOSURE & WINDING UP",
  },
  {
    label: "LIQUIDATION & DISSOLUTION",
    value: "LIQUIDATION & DISSOLUTION",
  },
  {
    label: "COMPANY VOLUNTARY ARRANGEMENT",
    value: "COMPANY VOLUNTARY ARRANGEMENT",
  },
  {
    label: "BUSINESS RECOVERY & RESCUE",
    value: "BUSINESS RECOVERY & RESCUE",
  },
  {
    label: "PERSONAL GUARANTEE & DIRECTOR LIABILITY",
    value: "PERSONAL GUARANTEE & DIRECTOR LIABILITY",
  },
  {
    label: "COMPANY ADMINISTRATION & RECEIVERSHIP",
    value: "COMPANY ADMINISTRATION & RECEIVERSHIP",
  },
  {
    label: "BUSINESS DEBT RESTRUCTURING",
    value: "BUSINESS DEBT RESTRUCTURING",
  },
  {
    label: "HMRC TAX INVESTIGATION",
    value: "HMRC TAX INVESTIGATION",
  },
  {
    label: "BANKRUPTCY &SEQUESTRATION",
    value: "BANKRUPTCY &SEQUESTRATION",
  },
  {
    label: "ASSET & PROPERTY PROTECTION",
    value: "ASSET & PROPERTY PROTECTION",
  },
  {
    label: "OTHER",
    value: "OTHER",
  },
];

export const PDQFinanceStatusOptions = [
  {
    label: "Faster Payments ",
    value: "Faster Payments",
  },
  {
    label: "Standard Payments ",
    value: "Standard Payments",
  },
];

export const CustomerTypeOptions = [
  {
    label: "Domestic",
    value: "Domestic",
  },
  {
    label: "Commercial",
    value: "Commercial",
  },
];

export const ConnectionTypeOptions = [
  {
    label: "Landline ",
    value: "Landline",
  },
  {
    label: "Ethernet ",
    value: "Ethernet",
  },
  {
    label: "Wifi ",
    value: "Wifi",
  },
  {
    label: "Simcard ",
    value: "Simcard",
  },
];

export const MachineTypeOptions = [
  {
    label: "Desktop ICT250",
    value: "Desktop ICT250",
  },
  {
    label: "Portable IWL252",
    value: "Portable IWL252",
  },
  {
    label: "GPRS IWL258",
    value: "GPRS IWL258",
  },
  {
    label: "Pinpad ICT250 +pad",
    value: "Pinpad ICT250 +pad",
  },
  {
    label: "Pax desktop wifi",
    value: "Pax desktop wifi",
  },
  {
    label: "Pax GPRS",
    value: "Pax GPRS",
  },
  {
    label: "Payment gateway",
    value: "Payment gateway",
  },
];

export const ConnectionOptions = [
  {
    label: "£10",
    value: "10",
  },
  {
    label: "£19",
    value: "19",
  },
  {
    label: "£20",
    value: "20",
  },
  {
    label: "£29",
    value: "29",
  },
  {
    label: "£30",
    value: "30",
  },
  {
    label: "£39",
    value: "39",
  },
  {
    label: "£40",
    value: "40",
  },
  {
    label: "£49",
    value: "49",
  },
  {
    label: "£50",
    value: "50",
  },
  {
    label: "£59",
    value: "59",
  },
  {
    label: "£60",
    value: "60",
  },
  {
    label: "£70",
    value: "70",
  },
  {
    label: "£80",
    value: "80",
  },
  {
    label: "£90",
    value: "90",
  },
  {
    label: "£99",
    value: "99",
  },
  {
    label: "£100",
    value: "100",
  },
  {
    label: "£110",
    value: "110",
  },
  {
    label: "£120",
    value: "120",
  },
  {
    label: "£129",
    value: "129",
  },
  {
    label: "£130",
    value: "130",
  },
  {
    label: "£140",
    value: "140",
  },
  {
    label: "£150",
    value: "150",
  },
  {
    label: "£160",
    value: "160",
  },
  {
    label: "£170",
    value: "170",
  },
  {
    label: "£180",
    value: "180",
  },
  {
    label: "£190",
    value: "190",
  },
  {
    label: "£200",
    value: "200",
  },
];

export const LineRentalOptions = [
  {
    label: "SINGLE LINE £15",
    value: "SINGLE LINE £15",
  },
  {
    label: "STANDARD £25",
    value: "STANDARD £25",
  },
  {
    label: "BRONZE £35",
    value: "BRONZE £35",
  },
  {
    label: "SILVER £40",
    value: "SILVER £40",
  },
  {
    label: "GOLD £60",
    value: "GOLD £60",
  },
  {
    label: "PLATINUM £100",
    value: "PLATINUM £100",
  },
  {
    label: "SETUP COST £59",
    value: "SETUP COST £59",
  },
  {
    label: "SETUP DISC £39",
    value: "SETUP DISC £39",
  },
  {
    label: "NEW LINE INSTALL £99",
    value: "NEW LINE INSTALL £99",
  },
  {
    label: "BASE VOIP £8",
    value: "BASE VOIP £8",
  },
  {
    label: "SPECIAL LINE £10",
    value: "SPECIAL LINE £10",
  },
  {
    label: "SPECIAL PACKAGE £20",
    value: "SPECIAL PACKAGE £20",
  },
  {
    label: "MULTI LINE 2 £30",
    value: "MULTI LINE 2 £30",
  },
  {
    label: "MULTILINE 3 £45",
    value: "MULTILINE 3 £45",
  },
  {
    label: "VOIP BASIC £10",
    value: "VOIP BASIC £10",
  },
  {
    label: "VOIP SILVER £15",
    value: "VOIP SILVER £15",
  },
  {
    label: "VOIP GOLD £25",
    value: "VOIP GOLD £25",
  },
  {
    label: "MOBILE VOICE AND DATA VRU VODARED UNLIMITED £25",
    value: "MOBILE VOICE AND DATA VRU VODARED UNLIMITED £25",
  },
  {
    label: "MOBILE VOICE AND DATA VR24 DWS VODARED24GB £20",
    value: "MOBILE VOICE AND DATA VR24 DWS VODARED24GB £20",
  },
  {
    label: "MOBILE VOICE AND DATA ODWSOOU 02 UNLIMITED  £20",
    value: "MOBILE VOICE AND DATA ODWSOOU 02 UNLIMITED  £20",
  },
];

export const TelecomConnectionOptions = [
  {
    label: "PHONELINE",
    value: "PHONELINE",
  },
  {
    label: "VOIP",
    value: "VOIP",
  },
  {
    label: "MOBILE",
    value: "MOBILE",
  },
];

export const TeleBroadPhoneSystem = [
  {
    label: "STANDARD",
    value: "STANDARD",
  },
  {
    label: "VOIP",
    value: "VOIP",
  },
];

export const AddExtrasOptions = [
  // 2, 3, 4 , 5 ,10
  {
    label: "£0",
    value: "0",
  },
  {
    label: "£1",
    value: "1",
  },
  {
    label: "£1.5",
    value: "1.5",
  },
  {
    label: "£2",
    value: "2",
  },
  {
    label: "£2.5",
    value: "2.5",
  },
  {
    label: "£3",
    value: "3",
  },
  {
    label: "£3.5",
    value: "3.5",
  },
  {
    label: "£4",
    value: "4",
  },
  {
    label: "£4.5",
    value: "4.5",
  },
  {
    label: "£5",
    value: "5",
  },
  {
    label: "£5.5",
    value: "5.5",
  },
  {
    label: "£6",
    value: "6",
  },
  {
    label: "£6.5",
    value: "6.5",
  },
  {
    label: "£7",
    value: "7",
  },
  {
    label: "£7.5",
    value: "7.5",
  },
  {
    label: "£8",
    value: "8",
  },
  {
    label: "£8.5",
    value: "8.5",
  },
  {
    label: "£9",
    value: "9",
  },
  {
    label: "£9.5",
    value: "9.5",
  },
  {
    label: "£10",
    value: "10",
  },
  {
    label: "£10.5",
    value: "10.5",
  },
  {
    label: "£11",
    value: "11",
  },
  {
    label: "£11.5",
    value: "11.5",
  },
  {
    label: "£12",
    value: "12",
  },
  {
    label: "£12.5",
    value: "12.5",
  },
  {
    label: "£13",
    value: "13",
  },
  {
    label: "£13.5",
    value: "13.5",
  },
  {
    label: "£14",
    value: "14",
  },
  {
    label: "£14.5",
    value: "14.5",
  },
  {
    label: "£15",
    value: "15",
  },
  {
    label: "£15.5",
    value: "15.5",
  },
  {
    label: "£16",
    value: "16",
  },
  {
    label: "£16.5",
    value: "16.5",
  },
  {
    label: "£17",
    value: "17",
  },
  {
    label: "£17.5",
    value: "17.5",
  },
  {
    label: "£18",
    value: "18",
  },
  {
    label: "£18.5",
    value: "18.5",
  },
  {
    label: "£19",
    value: "19",
  },
  {
    label: "£19.5",
    value: "19.5",
  },
  {
    label: "£20",
    value: "20",
  },
  {
    label: "£20.5",
    value: "20.5",
  },
  {
    label: "£21",
    value: "21",
  },
  {
    label: "£21.5",
    value: "21.5",
  },
  {
    label: "£22",
    value: "22",
  },
  {
    label: "£22.5",
    value: "22.5",
  },
  {
    label: "£23",
    value: "23",
  },
  {
    label: "£23.5",
    value: "23.5",
  },
  {
    label: "£24",
    value: "24",
  },
  {
    label: "£24.5",
    value: "24.5",
  },
  {
    label: "£25",
    value: "25",
  },
];

export const ExtrasOptions = [
  {
    label: "Call Divert",
    value: "Call Divert",
  },
  {
    label: "Smart divert",
    value: "Smart divert",
  },
  {
    label: "Callers display",
    value: "Callers display",
  },
  {
    label: "Call waiting care level 2",
    value: "Call waiting care level 2",
  },
  {
    label: "Care level 4",
    value: "Care level 4",
  },
  {
    label: "Last five callers",
    value: "Last five callers",
  },
  {
    label: "Anonymous call reject",
    value: "Anonymous call reject",
  },
];

export const BroadbandConnectionOptions = [
  {
    label: "0",
    value: "0",
  },
  {
    label: "£10",
    value: "10",
  },
  {
    label: "£15",
    value: "15",
  },
  {
    label: "£20",
    value: "20",
  },
  {
    label: "£25",
    value: "25",
  },
  {
    label: "£30",
    value: "30",
  },
  {
    label: "£35",
    value: "35",
  },
  {
    label: "£40",
    value: "40",
  },
  {
    label: "£45",
    value: "45",
  },
  {
    label: "£50",
    value: "50",
  },
  {
    label: "£55",
    value: "55",
  },
  {
    label: "£60",
    value: "60",
  },
  {
    label: "£65",
    value: "65",
  },
  {
    label: "£70",
    value: "70",
  },
  {
    label: "£75",
    value: "75",
  },
  {
    label: "£80",
    value: "80",
  },
  {
    label: "£85",
    value: "85",
  },
  {
    label: "£90",
    value: "90",
  },
  {
    label: "£95",
    value: "95",
  },
  {
    label: "£100",
    value: "100",
  },
  {
    label: "£150",
    value: "150",
  },
  {
    label: "£200",
    value: "200",
  },
];

export const broadbandStatusOptions = [
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Out Of Contract",
    value: "Out Of Contract",
  },
  {
    label: "Closed",
    value: "Closed",
  },
];

export const telecomStatusOptions = [
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "Out Of Contract",
    value: "Out Of Contract",
  },
  {
    label: "Closed",
    value: "Closed",
  },
];

export const BroadbandRouterPriceOptions = [
  {
    label: "£29.99",
    value: "29.99",
  },
  {
    label: "£39.99",
    value: "39.99",
  },
  {
    label: "£59.99",
    value: "59.99",
  },
  {
    label: "£99.99",
    value: "99.99",
  },
  {
    label: "£149.99",
    value: "149.99",
  },
  {
    label: "£199.99",
    value: "199.99",
  },
  {
    label: "£249.99",
    value: "249.99",
  },
];

export const UserPaymentStatus = [
  {
    label: "Paid",
    value: "Paid",
  },
  {
    label: "Payout Pending",
    value: "Payout Pending",
  },
];

export const RentalOptions = [
  {
    label: "£3 ",
    value: "3",
  },
  {
    label: "£13.50 ",
    value: "13.50",
  },
  {
    label: "£15 ",
    value: "15",
  },
  {
    label: "£20 ",
    value: "20",
  },
  {
    label: "£25 ",
    value: "25",
  },
  {
    label: "£30 ",
    value: "30",
  },
  {
    label: "£35 ",
    value: "35",
  },
];

export const teleBroadProducts = [
  {
    label: "STANDARD",
    value: "STANDARD",
  },
  {
    label: "SOGEA",
    value: "SOGEA",
  },
  {
    label: "FTTP",
    value: "FTTP",
  },
];

export const HandSetsPrice = [
  {
    label: "£37",
    value: "£37",
  },
  {
    label: "£43",
    value: "£43",
  },
  {
    label: "£43",
    value: "£43",
  },
  {
    label: "£57",
    value: "£57",
  },
  {
    label: "£65",
    value: "£65",
  },
];

export const HandSetsTypes = [
  {
    label: "FTTC SOGEA",
    value: "FTTC SOGEA",
  },
  {
    label: "FTTP SOGFAST",
    value: "FTTP SOGFAST",
  },
  {
    label: "FTTP",
    value: "FTTP",
  },
  {
    label: "FTTC",
    value: "FTTC",
  },
];

export const combinedPackgeOptions = [
  {
    label: "ADSL + with Line £22",
    value: "ADSL + with Line £22",
  },
  {
    label: "FTTC 40/10 with Line £26",
    value: "FTTC 40/10 with Line £26",
  },
  {
    label: "FTTC 80/20 with Line £28",
    value: "FTTC 80/20 with Line £28",
  },
  {
    label: "SOGEA 0.5/0.5 1 HANDSET £37",
    value: "SOGEA 0.5/0.5 1 HANDSET £37",
  },
  {
    label: "SOGEA 0.5/0.5 2 HANDSET £47",
    value: "SOGEA 0.5/0.5 2 HANDSET £47",
  },
  {
    label: "SOGEA 40/10 1 HANDSET £43",
    value: "SOGEA 40/10 1 HANDSET £43",
  },
  {
    label: "SOGEA 40/10 2 HANDSET £53",
    value: "SOGEA 40/10 2 HANDSET £53",
  },
  {
    label: "SOGEA 80/20 1 HANDSET £45",
    value: "SOGEA 80/20 1 HANDSET £45",
  },
  {
    label: "SOGEA 80/20 2 HANDSET £55",
    value: "SOGEA 80/20 2 HANDSET £55",
  },
  {
    label: "SOGEA 160/30 1 HANDSET £57",
    value: "SOGEA 160/30 1 HANDSET £57",
  },
  {
    label: "SOGEA 160/30 2 HANDSET £67",
    value: "SOGEA 160/30 2 HANDSET £67",
  },
  {
    label: "SOGEA 330/50 1 HANDSET £65",
    value: "SOGEA 330/50 1 HANDSET £65",
  },
  {
    label: "SOGEA 330/50 2 HANDSET £75",
    value: "SOGEA 330/50 2 HANDSET £75",
  },
  {
    label: "FTTP 0.5/0.5 1 HANDSET £37",
    value: "FTTP 0.5/0.5 1 HANDSET £37",
  },
  {
    label: "FTTP 0.5/0.5 2 HANDSET £47",
    value: "FTTP 0.5/0.5 2 HANDSET £47",
  },
  {
    label: "FTTP 40/10 1 HANDSET £43",
    value: "FTTP 40/10 1 HANDSET £43",
  },
  {
    label: "FTTP 40/10 2 HANDSET £53",
    value: "FTTP 40/10 2 HANDSET £53",
  },
  {
    label: "FTTP 80/20 1 HANDSET £45",
    value: "FTTP 80/20 1 HANDSET £45",
  },
  {
    label: "FTTP 80/20 2 HANDSET £55",
    value: "FTTP 80/20 2 HANDSET £55",
  },
  {
    label: "FTTP 160/30 1 HANDSET £57",
    value: "FTTP 160/30 1 HANDSET £57",
  },
  {
    label: "FTTP 160/30 2 HANDSET £67",
    value: "FTTP 160/30 2 HANDSET £67",
  },
  {
    label: "FTTP 330/50 1 HANDSET £65",
    value: "FTTP 330/50 1 HANDSET £65",
  },
  {
    label: "FTTP 330/50 2 HANDSET £75",
    value: "FTTP 330/50 2 HANDSET £75",
  },
];

export const ProductsOptions = [
  {
    label: "ADSL2+",
    value: "ADSL2+",
  },
  {
    label: "Advance FTTC 40/10",
    value: "Advance FTTC 40/10",
  },
  {
    label: "Pro FTTC 80/20",
    value: "Pro FTTC 80/20",
  },
  {
    label: "Static IP",
    value: "Static IP",
  },
  {
    label: "FTTP",
    value: "FTTP",
  },
  {
    label: "SOGEA",
    value: "SOGEA",
  },
  {
    label: "ADSL + with Line",
    value: "ADSL + with Line",
  },
  {
    label: "FTTC 40/10 with Line",
    value: "FTTC 40/10 with Line",
  },
  {
    label: "FTTC 80/20 with Line",
    value: "FTTC 80/20 with Line",
  },
  {
    label: "SOGEA 0.5/0.5 1",
    value: "SOGEA 0.5/0.5 1",
  },
  {
    label: "SOGEA 0.5/0.5 2",
    value: "SOGEA 0.5/0.5 2",
  },
  {
    label: "SOGEA 40/10 1",
    value: "SOGEA 40/10 1",
  },
  {
    label: "SOGEA 40/10 2",
    value: "SOGEA 40/10 2",
  },
  {
    label: "SOGEA 80/20 1",
    value: "SOGEA 80/20 1",
  },
  {
    label: "SOGEA 80/20 2",
    value: "SOGEA 80/20 2",
  },
  {
    label: "SOGEA 160/30 1",
    value: "SOGEA 160/30 1",
  },
  {
    label: "SOGEA 160/30 2",
    value: "SOGEA 160/30 2",
  },
  {
    label: "SOGEA 330/50 1",
    value: "SOGEA 330/50 1",
  },
  {
    label: "SOGEA 330/50 2",
    value: "SOGEA 330/50 2",
  },
  {
    label: "FTTP 0.5/0.5 1",
    value: "FTTP 0.5/0.5 1",
  },
  {
    label: "FTTP 0.5/0.5 2",
    value: "FTTP 0.5/0.5 2",
  },
  {
    label: "FTTP 40/10 1",
    value: "FTTP 40/10 1",
  },
  {
    label: "FTTP 40/10 2",
    value: "FTTP 40/10 2",
  },
  {
    label: "FTTP 80/20 1",
    value: "FTTP 80/20 1",
  },
  {
    label: "FTTP 80/20 2",
    value: "FTTP 80/20 2",
  },
  {
    label: "FTTP 160/30 1",
    value: "FTTP 160/30 1",
  },
  {
    label: "FTTP 160/30 2",
    value: "FTTP 160/30 2",
  },
  {
    label: "FTTP 330/50 1",
    value: "FTTP 330/50 1",
  },
  {
    label: "FTTP 330/50 2",
    value: "FTTP 330/50 2",
  },
  {
    label: "O2 MOBILE DATA ODWSMB30 - O&O MBB 30GB £20",
    value: "O2 MOBILE DATA ODWSMB30 - O&O MBB 30GB £20",
  },
  {
    label: "O2 MOBILE DATA ODWSMB50 - O&O MBB 50GB £25",
    value: "O2 MOBILE DATA ODWSMB50 - O&O MBB 50GB £25",
  },
  {
    label: "MOBILE DATA VR24 DWS VODARED24GB £20",
    value: "MOBILE DATA VR24 DWS VODARED24GB £20",
  },
  {
    label: "MOBILE DATA VMBBU - VodaMBB Unlimited £25",
    value: "MOBILE DATA VMBBU - VodaMBB Unlimited £25",
  },
  {
    label: "VMBBUSNP - VodaMBB Unlimited Special (new/ports only) £25",
    value: "VMBBUSNP - VodaMBB Unlimited Special (new/ports only) £25",
  },
];

export const MeterTypeOption = [
  {
    label: "AMR",
    value: "AMR",
  },
  {
    label: "STANDARD",
    value: "STANDARD",
  },
];

export const EconomyOptions = [
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
];

export const warmHomeDiscounts = [
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "No",
    value: "No",
  },
];

export const PaymentOptions = [
  {
    label: "DD",
    value: "DD",
  },
  {
    label: "PREPAYMENT",
    value: "PREPAYMENT",
  },
  {
    label: "QUARTERLY",
    value: "QUARTERLY",
  },
];

export const BillDateTypeOption = [
  {
    label: "Date range",
    value: "Date range",
  },
  {
    label: "Number days",
    value: "Number days",
  },
];

export const RenewalServicesForDropdown = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Water",
    value: "Water",
  },
  {
    label: "Chip And Pin",
    value: "ChipAndPin",
  },
  {
    label: "Telecoms & Broadband",
    value: "TelecomAndBroadband",
  },
  {
    label: "Telecoms",
    value: "Telecoms",
  },
  {
    label: "Broadband",
    value: "Broadband",
  },
  {
    label: "Energy",
    value: "Energy",
  },
  {
    label: "Waste",
    value: "Waste",
  },
  {
    label: "Insurance",
    value: "Insurance",
  },
  {
    label: "Business Rates",
    value: "BusinessRates",
  },
];

export const QuoteServicesForDropdown = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Telecoms & Broadband",
    value: "TelecomAndBroadband",
  },
  {
    label: "Water",
    value: "Water",
  },
  {
    label: "Chip And Pin",
    value: "ChipAndPin",
  },
  {
    label: "Telecoms",
    value: "Telecoms",
  },
  {
    label: "Broadband",
    value: "Broadband",
  },
  {
    label: "Energy",
    value: "Energy",
  },
  {
    label: "Waste",
    value: "Waste",
  },
  {
    label: "Insurance",
    value: "Insurance",
  },
  {
    label: "Business Rates",
    value: "BusinessRates",
  },
  {
    label: "Eco",
    value: "Eco",
  },
  {
    label: "Paid Solar",
    value: "PaidSolar",
  },
];

export const MeterReadingServices = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Water",
    value: "Water",
  },
  {
    label: "Energy",
    value: "Energy",
  },
];

export const BusinessTypeOption = [
  {
    label: "Sole trader",
    value: "Sole trader",
  },
  {
    label: "Partnership",
    value: "Partnership",
  },
  {
    label: "Limited company",
    value: "Limited company",
  },
  {
    label: "PLCSub",
    value: "PLCSub",
  },
  {
    label: "Registered charity",
    value: "Registered charity",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const SupplierServices = [
  {
    name: "Gas",
    value: "Gas",
  },
  {
    name: "Electric",
    value: "Electric",
  },
  {
    name: "Water",
    value: "Water",
  },
  {
    name: "VOIP",
    value: "VOIP",
  },
  {
    name: "Chip and Pin",
    value: "Chip and Pin",
  },
  {
    name: "Mobile",
    value: "Mobile",
  },
  {
    name: "EPOS",
    value: "EPOS",
  },
  {
    name: "Waste",
    value: "Waste",
  },
  {
    name: "Business Rates",
    value: "BusinessRates",
  },
  {
    name: "Insurance",
    value: "Insurance",
  },
  {
    name: "Finance",
    value: "Finance",
  },
  {
    name: "Phone Line",
    value: "PhoneLine",
  },
  {
    name: "Bank Account",
    value: "BankAccount",
  },
  {
    name: "Renewable Energy",
    value: "Renewable Energy",
  },
  {
    name: "Marketing",
    value: "Marketing",
  },
];

//salse task:  HOT CLIENT, SALES CALL BACK, DEAD DEAL, CED CONFIRM DATE, READY FOR QUOTE, QUOTED CONFIRMED CALL, QUOTED CLOSE CALL

//not found sales task CED CONFIRM DATE ,QUOTED CONFIRMED CALL,
export const salesTasks = [
  {
    label: "CROSS SELL",
    value: 1049,
  },
  {
    label: "SALES CALL BACK",
    value: 1019,
  },
  {
    label: "CED CONFIRMATION CALL",
    value: 1017,
  },
  {
    label: "COURTESY CALL",
    value: 1027,
  },
  {
    label: "INTERESTED",
    value: 1050,
  },
  {
    label: "DEAD DEAL",
    value: 1008,
  },
  {
    label: "COMPLETE",
    value: 1010,
  },
  {
    label: "REJECTED",
    value: 1007,
  },
  {
    label: "APPROVED",
    value: 1009,
  },
  {
    label: "COMPLAINTS",
    value: 1016,
  },
];
export const AdminTasks = [
  {
    label: "METER ISSUE",
    value: 1028,
  },
  {
    label: "METER READING LODGE",
    value: 1012,
  },
  {
    label: "INVOICE AND PAYMENT",
    value: 1026,
  },
  {
    label: "PCI COMPLIANCE",
    value: 1015,
  },
  {
    label: "PCI UPLOAD NEW CLIENT",
    value: 1048,
  },
  {
    label: "SOLAR DESIGN REQUESTED",
    value: 1060,
  },
  {
    label: "SOLAR DESIGN COMPLETED",
    value: 1061,
  },
];

export const ComplaintTask = [
  {
    label: "NEW COMPLAINT",
    value: 1062,
  },
  {
    label: "IN PROCESS",
    value: 1063,
  },
  {
    label: "RESOLVED",
    value: 1064,
  },
  {
    label: "CAN'T RESOLVE",
    value: 1065,
  },
  {
    label: "DEAD",
    value: 1066,
  },
];

export const DeveloperTask = [
  {
    label: "BACKLOG",
    value: 1067,
  },
  {
    label: "NEW REQUEST",
    value: 1068,
  },
  {
    label: "IN PROGRESS",
    value: 1069,
  },
  {
    label: "IN TESTING",
    value: 1070,
  },
  {
    label: "ON STAGE",
    value: 1071,
  },
  {
    label: "ON LIVE",
    value: 1072,
  },
  {
    label: "BLOCKER",
    value: 1073,
  },
];

export const CommercialTask = [
  {
    label: "UPLOAD NEW CLIENT",
    value: 1034,
  },
  {
    label: "SERVICES",
    value: 1000,
  },
  {
    label: "INFO REQUESTED",
    value: 1035,
  },
  {
    label: "INFO ACCEPTED",
    value: 1002,
  },
  {
    label: "LOA LODGE",
    value: 1020,
  },
  {
    label: "LOA SENT",
    value: 1036,
  },
  {
    label: "LOA RECIEVED",
    value: 1037,
  },
  {
    label: "LOA CONFIRMED",
    value: 1038,
  },
  {
    label: "COT",
    value: 1013,
  },
  {
    label: "COT INPROCESS",
    value: 1039,
  },
  {
    label: "COT ACCEPTED",
    value: 1040,
  },
  {
    label: "COT REJECTED",
    value: 1041,
  },
  {
    label: "CONTRACT SENT",
    value: 1042,
  },
  {
    label: "CONTRACT RECIEVED",
    value: 1043,
  },
  {
    label: "CONTRACT CONFIRMED",
    value: 1044,
  },
  {
    label: "CONTRACT LIVE",
    value: 1046,
  },
  {
    label: "CONTRACT PROCESSING",
    value: 1014,
  },
  {
    label: "PROCESSING LIVE CHASE",
    value: 1045,
  },
  {
    label: "OBJECTED",
    value: 1006,
  },
  {
    label: "RENEWAL DATE SET",
    value: 1047,
  },
  {
    label: "COMPLETE",
    value: 1010,
  },
  {
    label: "REJECTED",
    value: 1007,
  },
  {
    label: "PENDING INFO",
    value: 1001,
  },
  {
    label: "PROCESSED",
    value: 1003,
  },
  {
    label: "PROBLEMATIC",
    value: 1004,
  },
  {
    label: "REQUESTED FURTHER INFO",
    value: 1005,
  },
  {
    label: "APPROVED",
    value: 1009,
  },
  {
    label: "UPLOAD",
    value: 1011,
  },
  {
    label: "COMPLAINTS",
    value: 1016,
  },
  {
    label: "HOT CLIENT",
    value: 1018,
  },
  {
    label: "BILL REQUESTED",
    value: 1021,
  },
  {
    label: "PROPOSAL CHASE",
    value: 1022,
  },
  {
    label: "READY FOR QUOTE",
    value: 1023,
  },
  {
    label: "QUOTED CONFIRM CALL",
    value: 1024,
  },
  {
    label: "QUOTED CLOSE CALL",
    value: 1025,
  },
  {
    label: "DOCUSIGN SENT",
    value: 1029,
  },
  {
    label: "DOCUSIGN RECIEVED",
    value: 1030,
  },
  {
    label: "LIVE DATE CHASE",
    value: 1031,
  },
  {
    label: "LOCK IN CONFIRM CHASE",
    value: 1032,
  },
  {
    label: "BOOK CLIENT MEETING",
    value: 1033,
  },
];

export const TaskStatus = [
  {
    label: "SERVICES",
    value: 1000,
  },
  {
    label: "PENDING INFO",
    value: 1001,
  },
  {
    label: "INFO ACCEPTED",
    value: 1002,
  },
  {
    label: "INFO REQUESTED",
    value: 1035,
  },
  {
    label: "PROCESSED",
    value: 1003,
  },
  {
    label: "PROBLEMATIC",
    value: 1004,
  },
  {
    label: "REQUESTED FURTHER INFO",
    value: 1005,
  },
  {
    label: "OBJECTED",
    value: 1006,
  },
  {
    label: "REJECTED",
    value: 1007,
  },
  {
    label: "DEAD DEAL",
    value: 1008,
  },
  {
    label: "APPROVED",
    value: 1009,
  },
  {
    label: "COMPLETE",
    value: 1010,
  },
  {
    label: "UPLOAD",
    value: 1011,
  },
  {
    label: "METER READING LODGE",
    value: 1012,
  },
  {
    label: "COT",
    value: 1013,
  },
  {
    label: "COT INPROCESS",
    value: 1039,
  },
  {
    label: "COT ACCEPTED",
    value: 1040,
  },
  {
    label: "COT REJECTED",
    value: 1041,
  },
  {
    label: "CONTRACT SENT",
    value: 1042,
  },
  {
    label: "CONTRACT RECIEVED",
    value: 1043,
  },
  {
    label: "CONTRACT CONFIRMED",
    value: 1044,
  },
  {
    label: "CONTRACT LIVE",
    value: 1046,
  },
  {
    label: "CONTRACT PROCESSING",
    value: 1014,
  },
  {
    label: "PROCESSING LIVE CHASE",
    value: 1045,
  },
  {
    label: "RENEWAL DATE SET",
    value: 1047,
  },
  {
    label: "PCI COMPLIANCE",
    value: 1015,
  },
  {
    label: "PCI UPLOAD NEW CLIENT",
    value: 1048,
  },
  {
    label: "COMPLAINTS",
    value: 1016,
  },
  {
    label: "CED CONFIRMATION CALL",
    value: 1017,
  },
  {
    label: "HOT CLIENT",
    value: 1018,
  },
  {
    label: "SALES CALL BACK",
    value: 1019,
  },
  {
    label: "LOA LODGE",
    value: 1020,
  },
  {
    label: "LOA SENT",
    value: 1036,
  },
  {
    label: "LOA RECIEVED",
    value: 1037,
  },
  {
    label: "LOA CONFIRMED",
    value: 1038,
  },
  {
    label: "BILL REQUESTED",
    value: 1021,
  },
  {
    label: "PROPOSAL CHASE",
    value: 1022,
  },
  {
    label: "READY FOR QUOTE",
    value: 1023,
  },
  {
    label: "QUOTED CONFIRM CALL",
    value: 1024,
  },
  {
    label: "QUOTED CLOSE CALL",
    value: 1025,
  },
  {
    label: "INVOICE AND PAYMENT",
    value: 1026,
  },
  {
    label: "COURTESY CALL",
    value: 1027,
  },
  {
    label: "METER ISSUE",
    value: 1028,
  },
  {
    label: "DOCUSIGN SENT",
    value: 1029,
  },
  {
    label: "DOCUSIGN RECIEVED",
    value: 1030,
  },
  {
    label: "LIVE DATE CHASE",
    value: 1031,
  },
  {
    label: "LOCK IN CONFIRM CHASE",
    value: 1032,
  },
  {
    label: "BOOK CLIENT MEETING",
    value: 1033,
  },
  {
    label: "UPLOAD NEW CLIENT",
    value: 1034,
  },
  {
    label: "CROSS SELL",
    value: 1049,
  },
  {
    label: "INTERESTED",
    value: 1050,
  },
  {
    label: "RENEWAL PRICE PROVIDED",
    value: 1051,
  },
  {
    label: "PRICES ACCEPTED",
    value: 1052,
  },
  {
    label: "LOA RENEWED",
    value: 1053,
  },
  {
    label: "RENEWAL PRICES ACCEPTED",
    value: 1054,
  },
  {
    label: "RENEWAL CONTRACT SENT",
    value: 1055,
  },
  {
    label: "RENEWAL CONTRACT PROCESSING",
    value: 1056,
  },
  {
    label: "RENEWAL LOA SENT",
    value: 1057,
  },
  {
    label: "RENEWAL LOA LODGED",
    value: 1058,
  },
  {
    label: "RENEWAL SERVICE",
    value: 1059,
  },
  {
    label: "SOLAR DESIGN REQUESTED",
    value: 1060,
  },
  {
    label: "SOLAR DESIGN COMPLETED",
    value: 1061,
  },
  {
    label: "NEW COMPLAINT",
    value: 1062,
  },
  {
    label: "IN PROCESS",
    value: 1063,
  },
  {
    label: "RESOLVED",
    value: 1064,
  },
  {
    label: "CAN'T RESOLVE",
    value: 1065,
  },
  {
    label: "DEAD",
    value: 1066,
  },
  {
    label: "BACKLOG",
    value: 1067,
  },
  {
    label: "NEW REQUEST",
    value: 1068,
  },
  {
    label: "IN PROGRESS",
    value: 1069,
  },
  {
    label: "IN TESTING",
    value: 1070,
  },
  {
    label: "ON STAGE",
    value: 1071,
  },
  {
    label: "ON LIVE",
    value: 1072,
  },
  {
    label: "BLOCKER",
    value: 1073,
  },
];

export const TaskStatusForComplain = [
  {
    label: "NEW COMPLAINT",
    value: 1062,
  },
  {
    label: "IN PROCESS",
    value: 1063,
  },
  {
    label: "RESOLVED",
    value: 1064,
  },
  {
    label: "CAN'T RESOLVE",
    value: 1065,
  },
  {
    label: "DEAD",
    value: 1066,
  },
];

export const TaskSeprator = [
  {
    label: "Sales Tasks",
    value: "Sales Tasks",
  },
  {
    label: "Other Tasks",
    value: "Other Tasks",
  },
];

export const TaskStatusInEdit = [
  {
    label: "SERVICES",
    value: "SERVICES",
    id: 1000,
  },
  {
    label: "PENDING INFO",
    value: "PENDING INFO",
    id: 1001,
  },
  {
    label: "INFO ACCEPTED",
    value: "INFO ACCEPTED",
    id: 1002,
  },
  {
    label: "INFO REQUESTED",
    value: "INFO REQUESTED",
    id: 1035,
  },
  {
    label: "PROCESSED",
    value: "PROCESSED",
    id: 1003,
  },
  {
    label: "PROBLEMATIC",
    value: "PROBLEMATIC",
    id: 1004,
  },
  {
    label: "REQUESTED FURTHER INFO",
    value: "REQUESTED FURTHER INFO",
    id: 1005,
  },
  {
    label: "OBJECTED",
    value: "OBJECTED",
    id: 1006,
  },
  {
    label: "REJECTED",
    value: "REJECTED",
    id: 1007,
  },
  {
    label: "DEAD DEAL",
    value: "DEAD DEAL",
    id: 1008,
  },
  {
    label: "APPROVED",
    value: "APPROVED",
    id: 1009,
  },
  {
    label: "COMPLETE",
    value: "COMPLETE",
    id: 1010,
  },
  {
    label: "UPLOAD",
    value: "UPLOAD",
    id: 1011,
  },
  {
    label: "METER READING LODGE",
    value: "METER READING LODGE",
    id: 1012,
  },
  {
    label: "COT",
    value: "COT",
    id: 1013,
  },
  {
    label: "COT INPROCESS",
    value: "COT INPROCESS",
    id: 1039,
  },
  {
    label: "COT ACCEPTED",
    value: "COT ACCEPTED",
    id: 1040,
  },
  {
    label: "COT REJECTED",
    value: "COT REJECTED",
    id: 1041,
  },
  {
    label: "CONTRACT SENT",
    value: "CONTRACT SENT",
    id: 1042,
  },
  {
    label: "CONTRACT RECIEVED",
    value: "CONTRACT RECIEVED",
    id: 1043,
  },
  {
    label: "CONTRACT CONFIRMED",
    value: "CONTRACT CONFIRMED",
    id: 1044,
  },
  {
    label: "CONTRACT LIVE",
    value: "CONTRACT LIVE",
    id: 1046,
  },
  {
    label: "CONTRACT PROCESSING",
    value: "CONTRACT PROCESSING",
    id: 1014,
  },
  {
    label: "PROCESSING LIVE CHASE",
    value: "PROCESSING LIVE CHASE",
    id: 1045,
  },
  {
    label: "RENEWAL DATE SET",
    value: "RENEWAL DATE SET",
    id: 1047,
  },
  {
    label: "PCI COMPLIANCE",
    value: "PCI COMPLIANCE",
    id: 1015,
  },
  {
    label: "PCI UPLOAD NEW CLIENT",
    value: "PCI UPLOAD NEW CLIENT",
    id: 1048,
  },
  {
    label: "COMPLAINTS",
    value: "COMPLAINTS",
    id: 1016,
  },
  {
    label: "CED CONFIRMATION CALL",
    value: "CED CONFIRMATION CALL",
    id: 1017,
  },
  {
    label: "HOT CLIENT",
    value: "HOT CLIENT",
    id: 1018,
  },
  {
    label: "SALES CALL BACK",
    value: "SALES CALL BACK",
    id: 1019,
  },
  {
    label: "LOA LODGE",
    value: "LOA LODGE",
    id: 1020,
  },
  {
    label: "LOA SENT",
    value: "LOA SENT",
    id: 1036,
  },
  {
    label: "LOA RECIEVED",
    value: "LOA RECIEVED",
    id: 1037,
  },
  {
    label: "LOA CONFIRMED",
    value: "LOA CONFIRMED",
    id: 1038,
  },
  {
    label: "BILL REQUESTED",
    value: "BILL REQUESTED",
    id: 1021,
  },
  {
    label: "PROPOSAL CHASE",
    value: "PROPOSAL CHASE",
    id: 1022,
  },
  {
    label: "READY FOR QUOTE",
    value: "READY FOR QUOTE",
    id: 1023,
  },
  {
    label: "QUOTED CONFIRM CALL",
    value: "QUOTED CONFIRM CALL",
    id: 1024,
  },
  {
    label: "QUOTED CLOSE CALL",
    value: "QUOTED CLOSE CALL",
    id: 1025,
  },
  {
    label: "INVOICE AND PAYMENT",
    value: "INVOICE AND PAYMENT",
    id: 1026,
  },
  {
    label: "COURTESY CALL",
    value: "COURTESY CALL",
    id: 1027,
  },
  {
    label: "METER ISSUE",
    value: "METER ISSUE",
    id: 1028,
  },
  {
    label: "DOCUSIGN SENT",
    value: "DOCUSIGN SENT",
    id: 1029,
  },
  {
    label: "DOCUSIGN RECIEVED",
    value: "DOCUSIGN RECIEVED",
    id: 1030,
  },
  {
    label: "LIVE DATE CHASE",
    value: "LIVE DATE CHASE",
    id: 1031,
  },
  {
    label: "LOCK IN CONFIRM CHASE",
    value: "LOCK IN CONFIRM CHASE",
    id: 1032,
  },
  {
    label: "BOOK CLIENT MEETING",
    value: "BOOK CLIENT MEETING",
    id: 1033,
  },
  {
    label: "UPLOAD NEW CLIENT",
    value: "UPLOAD NEW CLIENT",
    id: 1034,
  },
  {
    label: "CROSS SELL",
    value: "CROSS SELL",
    id: 1049,
  },
  {
    label: "INTERESTED",
    value: "INTERESTED",
    id: 1050,
  },
  {
    label: "RENEWAL PRICE PROVIDED",
    value: "RENEWAL PRICE PROVIDED",
    id: 1051,
  },
  {
    label: "PRICES ACCEPTED",
    value: "PRICES ACCEPTED",
    id: 1052,
  },
  {
    label: "LOA RENEWED",
    value: "LOA RENEWED",
    id: 1053,
  },
  {
    label: "RENEWAL PRICES ACCEPTED",
    value: "RENEWAL PRICES ACCEPTED",
    id: 1054,
  },
  {
    label: "RENEWAL CONTRACT SENT",
    value: "RENEWAL CONTRACT SENT",
    id: 1055,
  },
  {
    label: "RENEWAL CONTRACT PROCESSING",
    value: "RENEWAL CONTRACT PROCESSING",
    id: 1056,
  },
  {
    label: "RENEWAL LOA SENT",
    value: "RENEWAL LOA SENT",
    id: 1057,
  },
  {
    label: "RENEWAL LOA LODGED",
    value: "RENEWAL LOA LODGED",
    id: 1058,
  },
  {
    label: "RENEWAL SERVICE",
    value: "RENEWAL SERVICE",
    id: 1059,
  },
  {
    label: "SOLAR DESIGN REQUESTED",
    value: "SOLAR DESIGN REQUESTED",
    id: 1060,
  },
  {
    label: "SOLAR DESIGN COMPLETED",
    value: "SOLAR DESIGN COMPLETED",
    id: 1061,
  },
  {
    label: "NEW COMPLAINT",
    value: "NEW COMPLAINT",
    id: 1062,
  },
  {
    label: "IN PROCESS",
    value: "IN PROCESS",
    id: 1063,
  },
  {
    label: "RESOLVED",
    value: "RESOLVED",
    id: 1064,
  },
  {
    label: "CAN'T RESOLVE",
    value: "CAN'T RESOLVE",
    id: 1065,
  },
  {
    label: "DEAD",
    value: "DEAD",
    id: 1066,
  },
  {
    label: "BACKLOG",
    value: "BACKLOG",
    id: 1067,
  },
  {
    label: "NEW REQUEST",
    value: "NEW REQUEST",
    id: 1068,
  },
  {
    label: "IN PROGRESS",
    value: "IN PROGRESS",
    id: 1069,
  },
  {
    label: "IN TESTING",
    value: "IN TESTING",
    id: 1070,
  },
  {
    label: "ON STAGE",
    value: "ON STAGE",
    id: 1071,
  },
  {
    label: "ON LIVE",
    value: "ON LIVE",
    id: 1072,
  },
  {
    label: "BLOCKER",
    value: "BLOCKER",
    id: 1073,
  },
];

export const RenewalTask = [
  {
    label: "RENEWAL PRICE PROVIDED",
    value: 1051,
  },
  {
    label: "RENEWAL PRICES ACCEPTED",
    value: 1054,
  },
  {
    label: "RENEWAL CONTRACT SENT",
    value: 1055,
  },
  {
    label: "RENEWAL CONTRACT PROCESSING",
    value: 1056,
  },
  {
    label: "LOA RENEWED",
    value: 1053,
  },
  {
    label: "RENEWAL LOA SENT",
    value: 1057,
  },
  {
    label: "RENEWAL LOA LODGED",
    value: 1058,
  },
  {
    label: "RENEWAL SERVICE",
    value: 1059,
  },
];

export const TaskTypesOptions = [
  {
    label: "Quote",
    value: "Quote",
  },
  {
    label: "Lead",
    value: "Lead",
  },
  // {
  //     label: 'Company',
  //     value: 'Company'
  // },
  // {
  //     label: 'Consumer',
  //     value: 'Consumer'
  // }
];

export const PriorityOption = [
  {
    label: "Normal",
    value: "Normal",
  },
  {
    label: "High",
    value: "High",
  },
];

export const ReminderTypeOption = [
  {
    label: "Hour",
    value: "Hour",
  },
  {
    label: "Day",
    value: "Day",
  },
  {
    label: "Week",
    value: "Week",
  },
];

export const contractLengthConvertInMonths = {
  "3 Months": 3,
  "6 Months": 6,
  "1 Year": 12,
  "1 year": 12,
  "2 Years": 24,
  "2 years": 24,
  "3 Years": 36,
  "3 years": 36,
  "4 Years": 48,
  "4 years": 48,
  "5 Years": 60,
  "5 years": 60,
  "6 Years": 72,
  "6 years": 72,
};

export const TaskValueToStatus = {
  1000: "SERVICES",
  1001: "PENDING INFO",
  1002: "INFO ACCEPTED",
  1003: "PROCESSED",
  1004: "PROBLEMATIC",
  1005: "REQUESTED FURTHER INFO",
  1006: "OBJECTED",
  1007: "REJECTED",
  1008: "DEAD DEAL",
  1009: "APPROVED",
  1010: "COMPLETE",
  1011: "UPLOAD",
  1012: "METER READING LODGE",
  1013: "COT",
  1014: "CONTRACT PROCESSING",
  1015: "PCI COMPLIANCE",
  1016: "COMPLAINTS",
  1017: "CED CONFIRMATION CALL",
  1018: "HOT CLIENT",
  1019: "SALES CALL BACK",
  1020: "LOA LODGE",
  1021: "BILL REQUESTED",
  1022: "PROPOSAL CHASE",
  1023: "READY FOR QUOTE",
  1024: "QUOTED CONFIRM CALL",
  1025: "QUOTED CLOSE CALL",
  1026: "INVOICE AND PAYMENT",
  1027: "COURTESY CALL",
  1028: "METER ISSUE",
  1029: "DOCUSIGN SENT",
  1030: "DOCUSIGN RECIEVED",
  isBlock: "Blocked",
  isActive: "Active",
  isDelete: "Delete Requested",
  DeleteRequest: "Delete Requested",
  0: "Blocked",
  1: "Active",
};

export const wasteTypeOptions = [
  { label: "NON-HAZARDOUS", value: "NON-HAZARDOUS" },
  { label: "HARARDOUS", value: "HARARDOUS" },
];

export const insuranceTypeOptions = [
  { label: "New", value: "New" },
  { label: "Renewal", value: "Renewal" },
];
export const insuranceProductsOptions = [
  { label: "Buildings", value: "Buildings" },
  { label: "Contents", value: "Contents" },
  { label: "Public Liability", value: "Public Liability" },
  { label: "Employer Liability", value: "Employer Liability" },
];

export const typeOfBusinessRatesWorkOptions = [
  { label: "COT", value: "COT" },
  { label: "REVALUATION", value: "REVALUATION" },
  { label: "CHANGE OF USE", value: "CHANGE OF USE" },
];

export const wasteContainerTypeOptions = [
  { label: "Sacks", value: "Sacks" },
  { label: "Pps", value: "Pps" },
  { label: "60L", value: "60L" },
  { label: "240L", value: "240L" },
  { label: "360L", value: "360L" },
  { label: "1100L", value: "1100L" },
  { label: "1280L", value: "1280L" },
];

export const wasteMonthlyDDOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const wasteServiceFrequency = [
  { label: "Weekly", value: "Weekly" },
  { label: "Fortnightly", value: "Fortnightly" },
  { label: "Monthly", value: "Monthly" },
];
export const CompanyImportExportTypes = [
  {
    label: "Company",
    value: "Company",
  },
  {
    label: "Contact",
    value: "Contact",
  },
  {
    label: "Site",
    value: "Site",
  },
];

export const OnlyCompany = [
  {
    label: "Company",
    value: "Company",
  },
];

export const ImportExportServiceTypes = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Water",
    value: "Water",
  },
  {
    label: "Chip And Pin",
    value: "ChipAndPin",
  },
  {
    label: "Telecoms",
    value: "Telecoms",
  },
  {
    label: "Broadband",
    value: "Broadband",
  },
];

export const ServiceTypes = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Water",
    value: "Water",
  },
  {
    label: "Chip And Pin",
    value: "ChipAndPin",
  },
  {
    label: "Telecoms",
    value: "Telecoms",
  },
  {
    label: "Broadband",
    value: "Broadband",
  },
  {
    label: "Energy",
    value: "Energy",
  },
];

export const CompanyServiceTypes = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Water",
    value: "Water",
  },
  // {
  //   label: "Telecoms & Broadband",
  //   value: "TelecomAndBroadband",
  // },
  {
    label: "Chip And Pin",
    value: "ChipAndPin",
  },
  {
    label: "Telecoms",
    value: "Telecoms",
  },
  {
    label: "Broadband",
    value: "Broadband",
  },
  {
    label: "Waste",
    value: "Waste",
  },
  {
    label: "Insurance",
    value: "Insurance",
  },
  {
    label: "Business Rates",
    value: "BusinessRates",
  },
  {
    label: "Eco",
    value: "Eco",
  },
  {
    label: "Paid Solar",
    value: "PaidSolar",
  },
];

export const ConsumerServiceTypes = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Energy",
    value: "Energy",
  },
  {
    label: "Eco",
    value: "Eco",
  },
  {
    label: "Paid Solar",
    value: "PaidSolar",
  },
];

export const B2BConsumerServices = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Energy",
    value: "Energy",
  },
];

export const B2BCompanyServices = [
  {
    label: "Gas",
    value: "Gas",
  },
  {
    label: "Electric",
    value: "Electric",
  },
  {
    label: "Water",
    value: "Water",
  },
  {
    label: "Chip And Pin",
    value: "ChipAndPin",
  },
  {
    label: "Telecoms",
    value: "Telecoms",
  },
  {
    label: "Broadband",
    value: "Broadband",
  },
  {
    label: "Waste",
    value: "Waste",
  },
  {
    label: "Insurance",
    value: "Insurance",
  },
  {
    label: "Business Rates",
    value: "BusinessRates",
  },
];

export const ConsumerType = [
  {
    label: "Consumer",
    value: "Consumer",
  },
];

export const sourceOptions = [
  {
    label: "Google Ads",
    value: "Google Ads",
  },
  {
    label: "Facebook Ads",
    value: "Facebook Ads",
  },
  {
    label: "Website",
    value: "Website",
  },
  {
    label: "Client Referral",
    value: "Client Referral",
  },
  {
    label: "Telesales",
    value: "Telesales",
  },
  {
    label: "Self",
    value: "Self",
  },
  {
    label: "Checkatrade",
    value: "Checkatrade",
  },
  {
    label: "Leads.io",
    value: "Leads.io",
  },
  {
    label: "Prism",
    value: "Prism",
  },
  {
    label: "Besthopesolutions",
    value: "Besthopesolutions",
  },
];

export const leadOptions = [
  {
    label: "New Lead",
    value: "New Lead",
  },
  {
    label: "Lead With Data Imported",
    value: "Lead With Data Imported",
  },
  {
    label: "Lead Imported",
    value: "Lead Imported",
  },
  {
    label: "New Paid Solar",
    value: "New Paid Solar",
  },
  {
    label: "New Lead B2B",
    value: "New Lead B2B",
  },
  {
    label: "New Lead Eco4",
    value: "New Lead Eco4",
  },
  {
    label: "Existing Client Lead",
    value: "Existing Client Lead",
  },
  {
    label: "Lead Contacted",
    value: "Lead Contacted",
  },
  {
    label: "Call Back or Missing Info",
    value: "Call Back or Missing Info",
  },
  {
    label: "Client Interested",
    value: "Client Interested",
  },
  {
    label: "Proposal Sent",
    value: "Proposal Sent",
  },
  {
    label: "No Ans",
    value: "No Ans",
  },
  {
    label: "RA Survey Booked",
    value: "RA Survey Booked",
  },
  {
    label: "RA Survey Completed",
    value: "RA Survey Completed",
  },
  {
    label: "Data Match/La Flex Sent",
    value: "Data Match/La Flex Sent",
  },
  {
    label: "Data Match/La Flex Unverified",
    value: "Data Match/La Flex Unverified",
  },
  {
    label: "Data Match Unmatched",
    value: "Data Match Unmatched",
  },
  {
    label: "Data Match Received",
    value: "Data Match Received",
  },
  {
    label: "Data Match/La Flex Confirmed",
    value: "Data Match/La Flex Confirmed",
  },
  {
    label: "Pre Install Paperwork Needed",
    value: "Pre Install Paperwork Needed",
  },
  {
    label: "Tech Survey",
    value: "Tech Survey",
  },
  {
    label: "Tech Survey Booked",
    value: "Tech Survey Booked",
  },
  {
    label: "Need Costings",
    value: "Need Costings",
  },
  {
    label: "Installer Paper Work Needed",
    value: "Installer Paper Work Needed",
  },
  {
    label: "Ready for Installation",
    value: "Ready for Installation",
  },
  {
    label: "Installation In Progress",
    value: "Installation In Progress",
  },
  {
    label: "Installation Complete",
    value: "Installation Complete",
  },
  {
    label: "Submission Started",
    value: "Submission Started",
  },
  {
    label: "Submission Completed",
    value: "Submission Completed",
  },
  {
    label: "Funder Query",
    value: "Funder Query",
  },
  {
    label: "Project Paid",
    value: "Project Paid",
  },
  {
    label: "Reject Funding",
    value: "Reject Funding",
  },
  {
    label: "Not Interested",
    value: "Not Interested",
  },
  {
    label: "Dead Lead",
    value: "Dead Lead",
  },
  {
    label: "DND",
    value: "DND",
  },
  {
    label: "Lead Closed",
    value: "Lead Closed",
  },
  {
    label: "Contact Needed",
    value: "Contact Needed",
  },
  {
    label: "Deal Closed",
    value: "Deal Closed",
  },
  {
    label: "On Hold",
    value: "On Hold",
  },
  {
    label: "Solar Survey Booked",
    value: "Solar Survey Booked",
  },
  {
    label: "Desktop Survey",
    value: "Desktop Survey",
  },
  {
    label: "Tele Surveyed",
    value: "Tele Surveyed",
  },
  {
    label: "Paperwork Accepted",
    value: "Paperwork Accepted",
  },
  {
    label: "Plan of Works",
    value: "Plan of Works",
  },
  {
    label: "Installer Signer Off",
    value: "Installer Signer Off",
  },
  {
    label: "Remedial",
    value: "Remedial",
  },
  {
    label: "Job Rejected",
    value: "Job Rejected",
  },
  {
    label: "Solar Desktop Questionaire Completed",
    value: "Solar Desktop Questionaire Completed",
  },
  {
    label: "Solar Design Requested",
    value: "Solar Design Requested",
  },
  {
    label: "Solar Design Received",
    value: "Solar Design Received",
  },
  {
    label: "Survey Booked For Rep",
    value: "Survey Booked For Rep",
  },
  {
    label: "Redesign Requested",
    value: "Redesign Requested",
  },
  {
    label: "Final Design Sent To Customer",
    value: "Final Design Sent To Customer",
  },
  {
    label: "Final Design Sent To Rep",
    value: "Final Design Sent To Rep",
  },
  {
    label: "Deal Needs Special Pricing",
    value: "Deal Needs Special Pricing",
  },
];

export const paidSolarLeadStatus = [
  {
    label: "New Quote",
    value: "New Quote",
  },
  {
    label: "Inquiry from website",
    value: "Inquiry from website",
  },
  {
    label: "Survey Booked",
    value: "Survey Booked",
  },
  {
    label: "Redesign",
    value: "Redesign",
  },
  {
    label: "Contract Sent",
    value: "Contract Sent",
  },
  {
    label: "Contract Signed",
    value: "Contract Signed",
  },
  {
    label: "Deposit Paid",
    value: "Deposit Paid",
  },
  {
    label: "Hies Started",
    value: "Hies Started",
  },
  {
    label: "Don applied",
    value: "Don applied",
  },
  {
    label: "DNO Rejected",
    value: "DNO Rejected",
  },
  {
    label: "DNO accepted",
    value: "DNO accepted",
  },
  {
    label: "Scaffolding Booked",
    value: "Scaffolding Booked",
  },
  {
    label: "Roofer Booked",
    value: "Roofer Booked",
  },
  {
    label: "Electrian Booked",
    value: "Electrian Booked",
  },
  {
    label: "Install Complete",
    value: "Install Complete",
  },
  {
    label: "MCS Registered",
    value: "MCS Registered",
  },
  {
    label: "Hies completed",
    value: "Hies completed",
  },
  {
    label: "Building Regulations Done",
    value: "Building Regulations Done",
  },
];

export const ecoLeadStatus = [
  {
    label: "New Quote",
    value: "New Quote",
  },
  {
    label: "EPC Checked",
    value: "EPC Checked",
  },
  {
    label: "Phone Vetted",
    value: "Phone Vetted",
  },
  {
    label: "Data Matched",
    value: "Data Matched",
  },
  {
    label: "LA Flex Sent",
    value: "LA Flex Sent",
  },
  {
    label: "LA Flex Accepted",
    value: "LA Flex Accepted",
  },
  {
    label: "Post EPR",
    value: "Post EPR",
  },
  {
    label: "Survey Booked",
    value: "Survey Booked",
  },
  {
    label: "Survey Docs and Picture",
    value: "Survey Docs and Picture",
  },
  {
    label: "Job Rejected",
    value: "Job Rejected",
  },
  {
    label: "Job Accepted",
    value: "Job Accepted",
  },
  {
    label: "RC Assigned",
    value: "RC Assigned",
  },
  {
    label: "RC Completed",
    value: "RC Completed",
  },
  {
    label: "Tech Survey",
    value: "Tech Survey",
  },
  {
    label: "Insulation Booked",
    value: "Insulation Booked",
  },
  {
    label: "Ventilation Booked",
    value: "Ventilation Booked",
  },
  {
    label: "Heating Booked",
    value: "Heating Booked",
  },
  {
    label: "Solar Renewables Booked",
    value: "Solar Renewables Booked",
  },
  {
    label: "Install Complete",
    value: "Install Complete",
  },
  {
    label: "Trust Mark",
    value: "Trust Mark",
  },
  {
    label: "Submissions Started",
    value: "Submissions Started",
  },
  {
    label: "Submitted to Funders",
    value: "Submitted to Funders",
  },
  {
    label: "Funder Quiries",
    value: "Funder Quiries",
  },
  {
    label: "Funded Approved",
    value: "Funded Approved",
  },
  {
    label: "Payment Received",
    value: "Payment Received",
  },
  {
    label: "Completed",
    value: "Completed",
  },
];

export const WholeSaleProviderOptions = [
  {
    label: "ICTEL UK",
    value: "ICTEL UK",
  },
  {
    label: "DAISY UK",
    value: "DAISY UK",
  },
];

export const TeleBroadProviderOptions = [
  {
    label: "ICTEL",
    value: "ICTEL",
  },
  {
    label: "DAITEL",
    value: "DAITEL",
  },
];

export const DivertsCostOptions = [
  {
    label: "CALLER DISPLAY",
    value: "CALLER DISPLAY",
  },
  {
    label: "CALL DIVERSION",
    value: "CALL DIVERSION",
  },
  {
    label: "SMART DIVERT",
    value: "SMART DIVERT",
  },
  {
    label: "OTHERS",
    value: "OTHERS",
  },
];

export const Months = [
  {
    label: "January",
    value: 1,
  },
  {
    label: "February",
    value: 2,
  },
  {
    label: "March",
    value: 3,
  },
  {
    label: "April",
    value: 4,
  },
  {
    label: "May",
    value: 5,
  },
  {
    label: "June",
    value: 6,
  },
  {
    label: "July",
    value: 7,
  },
  {
    label: "August",
    value: 8,
  },
  {
    label: "September",
    value: 9,
  },
  {
    label: "October",
    value: 10,
  },
  {
    label: "November",
    value: 11,
  },
  {
    label: "December",
    value: 12,
  },
];

export const Year = [
  {
    label: "2020",
    value: "2020",
  },
  {
    label: "2021",
    value: "2021",
  },
  {
    label: "2022",
    value: "2022",
  },
  {
    label: "2023",
    value: "2023",
  },
  {
    label: "2024",
    value: "2024",
  },
  {
    label: "2025",
    value: "2025",
  },
  {
    label: "2026",
    value: "2026",
  },
  {
    label: "2027",
    value: "2027",
  },
  {
    label: "2028",
    value: "2028",
  },
  {
    label: "2029",
    value: "2029",
  },
  {
    label: "2030",
    value: "2030",
  },
];

export const lifeInsuranceOptions = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

export const criticalIllnessOptions = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

export const homeInsuranceOptions = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

export const funeralPlanOptions = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

const gasMapOptions = [
  { value: `service.gas.meterNumber`, label: "MPRN" },
  { value: "service.gas.accountNumber", label: "Account Number" },
  { value: "service.gas.meterSerialNumber", label: "Meter Serial Number" },
  { value: "service.gas.COT", label: "COT" },
  { value: "service.gas.contract_length", label: "Contract Length" },
  { value: "service.gas.meterType", label: "Meter Type" },
  { value: "service.gas.dailyCharges", label: "Standing Charges" },
  { value: "service.gas.unitRate", label: "Unit Rate" },
  { value: "service.gas.kWH", label: "AQ" },
  {
    value: "service.gas.onlineAccountUserName",
    label: "Online Account Username",
  },
  {
    value: "service.gas.onlineAccountPassword",
    label: "Online Account Password",
  },
  {
    value: "service.gas.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.gas.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.gas.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.gas.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },
  { value: "service.gas.postcode", label: "Postcode" },
  { value: "service.gas.bill_date_type", label: "Bill Date Type" },
  { value: "service.gas.no_of_days", label: "Number of Days" },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];
const electricMapOptions = [
  { value: `service.electric.topLine`, label: "Top line - MPAN" },
  { value: `service.electric.meterNumber`, label: "Bottom line - MPAN" },
  { value: "service.electric.meterSerialNumber", label: "Meter Serial Number" },

  { value: `service.electric.topLineTwo`, label: "Top line - Second MPAN" },
  {
    value: `service.electric.meterNumberTwo`,
    label: "Bottom line - Second MPAN",
  },

  { value: "service.electric.COT", label: "COT" },
  { value: "service.electric.contract_length", label: "Contract Length" },
  { value: "service.electric.dailyCharges", label: "Standing Charges" },
  { value: "service.electric.unitDayRate", label: "Unit Day Rate" },
  { value: "service.electric.unitNightRate", label: "Unit Night Rate" },

  { value: "service.electric.accountNumber", label: "Account Number" },
  {
    value: "service.electric.onlineAccountUserName",
    label: "Online Account Username",
  },
  {
    value: "service.electric.onlineAccountPassword",
    label: "Online Account Password",
  },
  {
    value: "service.electric.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.electric.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.electric.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.electric.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },
  { value: "service.electric.unitDaykWh", label: "Unit Day Usage" },
  { value: "service.electric.unitNightkWH", label: "Unit Night Usage" },
  { value: "service.electric.unitWkdRate", label: "Eve/Wkd Rate" },
  { value: "service.electric.unitWkdkWh", label: "Eve/Wkd Usage" },
  { value: "service.electric.unitWinterRate", label: "Winter Rate" },
  { value: "service.electric.unitWinterkWH", label: "Winter Usage" },
  { value: "service.electric.bill_date_type", label: "Bill Date Type" },
  { value: "service.electric.no_of_days", label: "Number of Days" },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },
  { value: "NA", label: "NA" },
];

const teleBroadOptions = [
  { value: "service.telecomandbroadband.PhoneNumber", label: "Phone Number" },
  {
    value: "service.telecomandbroadband.phoneSystem",
    label: "Type of Phone System",
  },
  { value: "service.telecomandbroadband.provider", label: "Provider" },
  {
    value: "service.telecomandbroadband.oneOffCharge",
    label: "One Off Charge",
  },
  { value: "service.telecomandbroadband.products", label: "Select Product" },
  {
    value: "service.telecomandbroadband.number_of_handset",
    label: "Number of Handsets",
  },
  {
    value: "service.telecomandbroadband.additional_handsets",
    label: "Additional Handsets £10 Per Handsests",
  },
  {
    value: "service.telecomandbroadband.broadband_number",
    label: "Broadband Number",
  },
  {
    value: "service.telecomandbroadband.router",
    label: "Customer got our Router",
  },
  {
    value: "service.telecomandbroadband.noOfRouter",
    label: "Number of Routers",
  },
  { value: "service.telecomandbroadband.UserName", label: "User Name" },
  { value: "service.telecomandbroadband.IPAddress", label: "IP Address" },
  {
    value: "service.telecomandbroadband.contract_length",
    label: "Contract length",
  },
  {
    value: "service.telecomandbroadband.contract_start_date",
    label: "Contract Start Date",
    date: true,
  },
  {
    value: "service.telecomandbroadband.contract_end_date",
    label: "Contract End Date",
    date: true,
  },
  { value: "service.telecomandbroadband.multiline", label: "Multi Line" },
  {
    value: "service.telecomandbroadband.Multiline_PhoneNumber",
    label: "Multi Line Phone Number",
  },
  {
    value: "service.telecomandbroadband.multilineCost",
    label: "Cost For Multi Line",
  },
  {
    value: "service.telecomandbroadband.extraMultiLine",
    label: "Extra on Multi Line",
  },
  { value: "service.telecomandbroadband.divertsCost", label: "Type of Extras" },
  {
    value: "service.telecomandbroadband.costOfExtras",
    label: "Cost of Extras",
  },
  {
    value: "service.telecomandbroadband.overall_customer_cost",
    label: "Overall Cost to Customer",
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

const debtMapOptions = [
  { value: "service.debt.businessAddress", label: "Business Address" },
  { value: "service.debt.businessName", label: "Business Name" },
  {
    value: "service.debt.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.debt.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.debt.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.debt.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },
  { value: "service.debt.contract_length", label: "Contract Length" },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },
  { value: "NA", label: "NA" },
];

const WaterMapOptions = [
  { value: `service.water.SewageApidRates`, label: "Sewage Apid Rates" },
  { value: `service.water.SewageSpid`, label: "Sewage Spid" },
  { value: "service.water.WaterMeterSN", label: "Meter Meter SN" },
  { value: "service.water.WaterCorespId", label: "Water Corespid" },
  { value: "service.water.CoreSpidRates", label: "Core Spid Rates" },
  { value: "service.water.WaterAnnualSpend", label: "Water Annual Spend" },
  // { value: "service.water.unitDayRate", label: "Unit Day Rate" },
  { value: "service.water.accountNumber", label: "Account Number" },
  { value: "service.water.WaterDiscount", label: "Water Discount" },
  { value: "service.water.contract_length", label: "Contract Length" },
  {
    value: "service.water.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.water.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.water.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.water.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },
  {
    value: "service.water.WaterRenewalDate",
    label: "Water Renewal Date",
    date: true,
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

const ChipAndPinOptions = [
  { value: "service.chipAndPin.MachineType", label: "Machine Type" },
  { value: "service.chipAndPin.PDQFinanceStatus", label: "Payment Type" },
  { value: "service.chipAndPin.NumberTerminals", label: "Number of terminals" },
  {
    value: "service.chipAndPin.ProviderRefNumber",
    label: "Provider Ref. number",
  },
  { value: "service.chipAndPin.MerchantRental", label: "Merchant Rental" },
  { value: "service.chipAndPin.Package", label: "Package" },
  { value: "service.chipAndPin.DeploymentCost", label: "Deployment Cost" },
  { value: "service.chipAndPin.AnalyticsCost", label: "Analytics cost" },
  { value: "service.chipAndPin.CreditCardRate", label: "Credit card rates" },
  { value: "service.chipAndPin.DebitCardRate", label: "Debit card rates" },
  {
    value: "service.chipAndPin.BusinessCardRate",
    label: "Business card rates",
  },
  { value: "service.chipAndPin.AuthorizationFee", label: "Authorization fee" },
  { value: "service.chipAndPin.PCIDSSCharge", label: "PCI DSS charge" },
  { value: "service.chipAndPin.ConnectionType", label: "Connection type" },
  { value: "service.chipAndPin.PCIDSSUserName", label: "PCI DSS user name" },
  { value: "service.chipAndPin.PCIDSSPassword", label: "PCI DSS password" },
  { value: "service.chipAndPin.midNumber", label: "MID Number" },
  { value: "service.chipAndPin.accountNumber", label: "Account Number" },
  { value: "service.chipAndPin.contract_length", label: "Contract Length" },
  {
    value: "service.chipAndPin.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.chipAndPin.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.chipAndPin.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.chipAndPin.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },
  {
    value: "service.chipAndPin.DeliveryDate",
    label: "Delivery date",
    date: true,
  },
  {
    value: "service.chipAndPin.FirstTransactionDate",
    label: "First transaction date",
    date: true,
  },
  {
    value: "service.chipAndPin.RenewalDate",
    label: "Renewal Date",
    date: true,
  },
  {
    value: "service.chipAndPin.PCIComplaintDate",
    label: "PCI complaint date",
    date: true,
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

// telecoms: {
//   "PhoneNumber1": String,
//   "PhoneNumber2": String,
//   "PhoneNumber3": String,
//   "PhoneNumber4": String,
//   "PhoneRange4": String,
//   "PhoneNumber5": String,
//   "PhoneRange5": String,
//   "PhoneNumber6": String,
//   "PhoneRange6": String,
//   "status": String,
//   'connectionType': String,
//   "LineRental": String,
//   "ConnectionCharges": String,
//   "CashAmount": String,
//   "AddExtras": String,
//   "Extras": Object,
//   "previous_contract_length": String,
//   "contract_length": String,
//   "contract_start_date": Number,
//   "contract_end_date": Number,
//   "previous_contract_start_date": Number,
//   "TelecomsLiveDate": Number,
//   "TelecomsRenewalDate": Number,
//   "accountNumber": String,
//   "WholeSaleProvider": String
// },

const TelecomsOptions = [
  { value: "service.telecoms.PhoneNumber1", label: "Phone number 1" },
  { value: "service.telecoms.status", label: "Telecom status" },
  { value: "service.telecoms.PhoneNumber2", label: "Phone Number 2" },
  { value: "service.telecoms.PhoneNumber3", label: "Phone number 3" },
  { value: "service.telecoms.PhoneRange4", label: "Phone 4 Range" },
  { value: "service.telecoms.PhoneRange5", label: "Phone 5 Range" },
  { value: "service.telecoms.PhoneNumber5", label: "Show Phone Numbers 5" },
  { value: "service.telecoms.PhoneRange6", label: "Phone 6 Range" },
  { value: "service.telecoms.PhoneNumber6", label: "Show Phone Numbers 6" },
  { value: "service.telecoms.CashAmount", label: "Cash Amount" },
  { value: "service.telecoms.connectionType", label: "Connection Type" },
  { value: "service.telecoms.LineRental", label: "Line rental and Packages" },
  { value: "service.telecoms.ConnectionCharges", label: "Connection charges" },
  { value: "service.telecoms.AddExtras", label: "Plus option to add extras" },
  // { value: "service.telecoms.Extras", label: "Extras" },
  { value: "service.telecoms.WholeSaleProvider", label: "Wholesale Provider" },
  { value: "service.telecoms.accountNumber", label: "Account Number" },
  { value: "service.telecoms.contract_length", label: "Contract Length" },
  {
    value: "service.telecoms.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.telecoms.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.telecoms.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.telecoms.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },
  { value: "service.telecoms.PhoneNumber4", label: "Phone number 4" },
  { value: "service.telecoms.Extras", label: "Extras" },
  {
    value: "service.telecoms.TelecomsLiveDate",
    label: "Telecoms live date",
    date: true,
  },
  {
    value: "service.telecoms.TelecomsRenewalDate",
    label: "Telecoms renewal date",
    date: true,
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

// broadband: {
//   "Products": String,
//   "Rental": String,
//   "ConnectionCharges": String,
//   "RouterPrice": Number,
//   "status": String,
//   "previous_contract_length": String,
//   "contract_length": String,
//   "contract_start_date": Number,
//   "contract_end_date": Number,
//   "previous_contract_start_date": Number,
//   "UserName": String,
//   "Password": String,
//   "IPAddress": String,
//   "RouterModel": String,
//   "SerialNumber": String,
//   "ProgrammedDate": Number,
//   "BroadbandPostageProof": String,
//   "BroadbandLiveDate": Number,
//   "BroadbandRenewalDate": Number,
//   "accountNumber": String,
//   "WholeSaleProvider": String
// },

const BroadbandOptions = [
  { value: "service.broadband.Products", label: "Products" },
  { value: "service.broadband.Rental", label: "Broadband rental" },
  { value: "service.broadband.ConnectionCharges", label: "Connection Charges" },
  { value: "service.broadband.RouterPrice", label: "Router Price" },
  { value: "service.broadband.status", label: "Broadband status" },
  { value: "service.broadband.UserName", label: "User name" },
  { value: "service.broadband.IPAddress", label: "IP Address" },
  { value: "service.broadband.RouterModel", label: "Router model" },
  { value: "service.broadband.SerialNumber", label: "Serial Number" },
  {
    value: "service.broadband.BroadbandPostageProof",
    label: "Broadband postage proof",
  },
  { value: "service.broadband.WholeSaleProvider", label: "Wholesale Provider" },
  { value: "service.broadband.accountNumber", label: "Account Number" },
  { value: "service.broadband.contract_length", label: "Contract Length" },
  {
    value: "service.broadband.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.broadband.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.broadband.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.broadband.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },
  { value: "service.broadband.Password", label: "Password" },
  {
    value: "service.broadband.ProgrammedDate",
    label: "Programmed date",
    date: true,
  },
  {
    value: "service.broadband.BroadbandLiveDate",
    label: "Broadband live date",
    date: true,
  },
  {
    value: "service.broadband.BroadbandRenewalDate",
    label: "Broadband Renewal date",
    date: true,
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

const WasteOptions = [
  { value: "service.waste.EwcCode", label: "EWC code" },
  { value: "service.waste.wasteType", label: "Waste Type" },
  { value: "service.waste.containerType", label: "Container Type" },
  { value: "service.waste.monthlyDD", label: "Monthly DD" },
  { value: "service.waste.numberOfContainers", label: "Number Of Container" },
  { value: "service.waste.chargePerLift", label: "Charge per lift " },
  { value: "service.waste.dailyRental", label: "Daily Rental " },
  { value: "service.waste.serviceFrequency", label: "Service Frequency" },
  { value: "service.waste.deliveryCharge", label: "Delivery Charge" },
  {
    value: "service.waste.WasteTransferNoteComplainceCharge",
    label: "WTN Complaince Charge",
  },
  { value: "service.waste.assumedWeight", label: "Assumed Weight" },
  { value: "service.waste.totalMonthlyCost", label: "Total Monthly Cost" },
  { value: "service.waste.contract_length", label: "Contract Length" },
  {
    value: "service.waste.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.waste.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.waste.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.waste.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },

  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

const InsuranceOptions = [
  { value: "service.insurance.insuranceType", label: "Insurance Type" },
  // { value: "service.insurance.insuranceType", label: " Insurance Product" },
  { value: "service.insurance.email", label: "Email" },
  { value: "service.insurance.typeOfBusiness", label: "Type of Business" },
  { value: "service.insurance.contactNumber", label: "Contact Number " },
  {
    value: "service.insurance.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.insurance.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  { value: "service.insurance.contract_length", label: "Contract Length" },
  { value: "service.insurance.insuranceProduct", label: "Insurance Product" },
  {
    value: "service.insurance.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.insurance.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },

  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

// businessrates: {
//   'previous_contract_length': String,
//   'previous_contract_start_date': Number,
//   'contract_length': String,
//   'contract_start_date': Number,
//   'contract_end_date': Number,
//   'insurance': String,
//   'passportNumber': String,
//   'typeOfBusinessRatesWork': {
//       type: Array,
//       default: undefined
//   },
//   'localAuthorityRefNumber': Number,
//   'currentRateableValue': Number,
//   'businessRatesAccountNo': Number,
//   'businessRatesBill': String,
//   'ratesReliefCompletedForm': String,
//   'britishPassport': String,
//   'homeProof': String,
//   'propertyLayoutDiagram': String,
//   'sitePhotos': String,
//   'lease': String,
//   'directorStatement': String,
//   'directorDetails': String
// }
// },
const BusinessRatesOptions = [
  // { value: "service.businessrates.EwcCode", label: "Type Of Business Rates Work" },
  {
    value: "service.businessrates.localAuthorityRefNumber",
    label: "Local Authority Ref Number",
  },
  {
    value: "service.businessrates.businessRatesAccountNo",
    label: "Business Rates Account No",
  },
  {
    value: "service.businessrates.businessRatesBill",
    label: "Business Rates Bill",
  },
  {
    value: "service.businessrates.ratesReliefCompletedForm",
    label: "Rates Relief Completed Form",
  },
  { value: "service.businessrates.britishPassport", label: "British Passport" },
  { value: "service.businessrates.homeProof", label: "Home Proof" },
  {
    value: "service.businessrates.propertyLayoutDiagram",
    label: "Property Layout Diagram",
  },
  { value: "service.businessrates.sitePhotos", label: "Site Photos" },
  { value: "service.businessrates.lease", label: "Lease" },
  {
    value: "service.businessrates.directorStatement",
    label: "Director Statement",
  },
  { value: "service.businessrates.directorDetails", label: "Director Details" },
  {
    value: "service.businessrates.currentRateableValue",
    label: "Current Rateable value (GDP Pound)",
  },
  { value: "service.businessrates.insurance", label: "Ni Insurance" },
  { value: "service.businessrates.passportNumber", label: "Passport Number" },
  { value: "service.businessrates.contract_length", label: "Contract Length" },
  {
    value: "service.businessrates.contract_start_date",
    label: "Contract start date",
    date: true,
  },
  {
    value: "service.businessrates.contract_end_date",
    label: "Contract end date",
    date: true,
  },
  {
    value: "service.businessrates.typeOfBusinessRatesWork",
    label: "Type Of Business Rates Work",
  },
  {
    value: "service.businessrates.previous_contract_length",
    label: "Current Contract Length",
  },
  {
    value: "service.businessrates.previous_contract_start_date",
    label: "Current Contract End Date",
    date: true,
  },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },

  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Company Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Company.utr", label: "UTR" },

  { value: "NA", label: "NA" },
];

export const mapOptions = [
  { value: "businessName", label: "Company Name" },
  { value: "firstLine", label: "Address line 1" },
  { value: "secondLine", label: "Address line 2" },
  { value: "postcode", label: "Postcode" },
  { value: "town", label: "Town" },
  { value: "country", label: "Country" },
  { value: "registerNumber", label: "Registration Number" },
  { value: "vatNumber", label: "VAT Number" },
  { value: "gatewayNumber", label: "Gateway Number" },
  { value: "bankSortcode", label: "Bank Sortcode" },
  { value: "creditScore", label: "Credit Score" },
  { value: "bankName", label: "Bank Name" },
  { value: "bankAccountNumber", label: "Bank Account Number" },
  { value: "businessType", label: "Company Type" },
  { value: "utr", label: "UTR" },

  { value: "Site.siteName", label: "Site Name" },
  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.country", label: "Site Country" },
  { value: "Site.postcode", label: "Site Postcode" },
  { value: "Site.User[0].name", label: "Site Contact Name" },
  { value: "Site.User[0].email", label: "Site Contact Email" },
  { value: "Site.User[0].phone", label: "Site Contact Phone" },
  { value: "Site.User[0].phone", label: "Contact Office Number" },
  { value: "Site.User[0].mobile", label: "Contact Mobile Number" },

  { value: "Site.User[0].homeAddress", label: "Site Contact Home Address" },
  { value: "Site.User[0].jobTitle", label: "Site Contact Job Title" },
  {
    value: "Site.User[0].nationalInsurance",
    label: "Site Contact National Insurance",
  },
  {
    value: "Site.User[0].previousAddress",
    label: "Site Contact Previous Address",
  },
  {
    value: "Site.User[0].previousAddressYear",
    label: "Site Contact Previous Address Years",
  },
  { value: "Site.User[0].DOB", label: "Site Contact DOB", date: true },

  { value: "Site.gas.MPRN", label: "MPRN" },
  { value: "Site.gas.meterSerialNumber", label: "Gas Meter Serial Number" },
  { value: "Site.electric.topLine", label: "MPAN Top Line" },
  { value: "Site.electric.meterNumber", label: "MPAN Bottom Line" },
  {
    value: "Site.electric.meterSerialNumber",
    label: "Electric Meter Serial Number",
  },
  { value: "Site.water.WaterCorespId", label: "Water Corespid" },
  { value: "Site.water.SewageSpid", label: "Sewage Spid" },
  { value: "Site.water.WaterMeterSN", label: "Meter Meter SN" },
  { value: "Site.chipandpin.ProviderRefNumber", label: "Provider Ref" },
  { value: "Site.chipandpin.midNumber", label: "MID Number" },
  { value: "NA", label: "NA" },
];

export const mapOptionsConsumer = [
  { label: "First Name", value: "firstName" },
  { label: "Consumer ID", value: "consumerId" },
  { label: "Surname", value: "surName" },
  { label: "Title", value: "title" },
  { label: "Postcode", value: "postcode" },
  { label: "Sortcode", value: "sortCode" },
  { label: "Mobile", value: "mobile" },
  { label: "Telephone Number", value: "telephoneNumber" },
  { label: "Email", value: "email" },
  { label: "City", value: "city" },
  { label: "Town", value: "town" },
  { label: "Address One", value: "addressOne" },
  { label: "Address Two", value: "addressTwo" },
  { label: "DOB", value: "DOB", date: true },
  { label: "Account Number", value: "accountNumber" },
  { label: "Bank Name", value: "bankName" },
  { label: "Age", value: "age" },
];

export const ecoMapOptionsConsumer = [
  { value: `consumerFullname`, label: "Consumer Name" },
  { value: `Consumer.consumerId`, label: "Consumer ID" },
  { value: `Consumer.title`, label: "Consumer Title" },
  { value: `Consumer.firstName`, label: "Consumer Firstname" },
  { value: `Consumer.surName`, label: "Consumer Surname" },
  { value: `Consumer.email`, label: "Email" },
  { value: `Consumer.addressOne`, label: "Address 1" },
  { value: `Consumer.addressTwo`, label: "Address 2" },
  { value: `Consumer.town`, label: "Town" },
  { value: `Consumer.city`, label: "City" },
  { value: `Consumer.postcode`, label: "Postcode" },
  { value: `Consumer.sortCode`, label: "SortCode" },
  { value: `Consumer.siteAddress`, label: "Site Address" },
  { value: `Consumer.DOB`, label: "DOB" },
  { value: `Consumer.age`, label: "Age" },
  { value: `Consumer.bankName`, label: "Bank Name" },
  { value: `Consumer.mobile`, label: "Mobile" },
  { value: `Consumer.telephoneNumber`, label: "Telephone Number" },

  { value: `service.eco.subservice.solar.netCost`, label: "Net Price" },
  { value: `service.eco.subservice.solar.netCost`, label: "Net Cost" },
  { value: `service.eco.subservice.solar.vat`, label: "VAT" },
  { value: `service.eco.subservice.solar.discount`, label: "Discount" },
  {
    value: `service.eco.subservice.solar.peakSystemOutput`,
    label: "Peak System Output",
  },
  { value: `service.eco.subservice.solar.systemSize`, label: "System Size" },
  {
    value: `service.eco.subservice.solar.noOfPanels`,
    label: "Total No. of Panels",
  },
  {
    value: `service.eco.subservice.solar.roofsPanelsInstalled`,
    label: "Number of Roof Panels",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].manufacturer`,
    label: "Panels Manufacturer",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    label: "Panels Model",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    label: "Panels Model Name",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].roofPitch`,
    label: "Roof Pitch",
  },
  {
    value: `service.eco.subservice.solar.numberOfInverters[0].manufacturer`,
    label: "Inverter Manufacturer",
  },
  {
    value: `service.eco.subservice.solar.numberOfInverters[0].model`,
    label: "Inverter Model",
  },
  {
    value: `service.eco.subservice.solar.noOfBatteries`,
    label: "No. of Batteries",
  },
  {
    value: `service.eco.subservice.solar.numberOfBatteries[0].model`,
    label: "Battery Model",
  },
  {
    value: `service.eco.subservice.solar.noOfInverters`,
    label: "No. of Inverters",
  },
  {
    value: `service.eco.subservice.solar.numberOfBatteries[0].manufacturer`,
    label: "Battery Manufracturer",
  },
  { value: `Access Equipment`, label: "Access Equipment" },
  { value: `Hies Warranty`, label: "Hies Warranty" },
  { value: `Export Tarriff`, label: "Export Tarriff" },
  { value: `Off Peak Changing`, label: "Off Peak Changing" },
  {
    value: `Full Installation & Registration`,
    label: "Full Installation & Registration",
  },
  { value: `service.eco.subservice.solar.agreedAmount`, label: "Total Cost" },
  { value: `Notes`, label: "Notes" },
];

export const ecoMapOptionsCompany = [
  { value: "Company.businessName", label: "Company Name" },
  { value: "Company.firstLine", label: "Address 1" },
  { value: "Company.firstLine", label: "Address line 1" },
  { value: "Company.secondLine", label: "Address line 2" },
  { value: "Company.postcode", label: "Postcode" },
  { value: "Company.town", label: "Town" },
  { value: "Company.country", label: "Country" },
  { value: "Company.registerNumber", label: "Registration Number" },
  { value: "Company.vatNumber", label: "VAT Number" },
  { value: "Company.gatewayNumber", label: "Gateway Number" },
  { value: "Company.bankSortcode", label: "Bank Sortcode" },
  { value: "Company.creditScore", label: "Credit Score" },
  { value: "Company.bankName", label: "Bank Name" },
  { value: "Company.bankAccountNumber", label: "Bank Account Number" },
  { value: "Company.businessType", label: "Company Type" },
  { value: "Site.siteAddress", label: "Site Address" },

  { value: "Site.siteAddress", label: "Site Address" },
  { value: "Site.town", label: "Site Town" },
  { value: "Site.city", label: "Site City" },
  { value: "Site.postcode", label: "Site Postcode" },

  { value: `service.eco.subservice.solar.netCost`, label: "Net Price" },
  { value: `service.eco.subservice.solar.netCost`, label: "Net Cost" },
  { value: `service.eco.subservice.solar.vat`, label: "VAT" },
  { value: `service.eco.subservice.solar.discount`, label: "Discount" },
  {
    value: `service.eco.subservice.solar.peakSystemOutput`,
    label: "Peak System Output",
  },
  { value: `service.eco.subservice.solar.systemSize`, label: "System Size" },
  {
    value: `service.eco.subservice.solar.noOfPanels`,
    label: "Total No. of Panels",
  },
  {
    value: `service.eco.subservice.solar.roofsPanelsInstalled`,
    label: "Number of Roof Panels",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].manufacturer`,
    label: "Panels Manufacturer",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    label: "Panels Model",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    label: "Panels Model Name",
  },
  {
    value: `service.eco.subservice.solar.numberOfRoofs[0].roofPitch`,
    label: "Roof Pitch",
  },
  {
    value: `service.eco.subservice.solar.numberOfInverters[0].manufacturer`,
    label: "Inverter Manufacturer",
  },
  {
    value: `service.eco.subservice.solar.numberOfInverters[0].model`,
    label: "Inverter Model",
  },
  {
    value: `service.eco.subservice.solar.noOfBatteries`,
    label: "No. of Batteries",
  },
  {
    value: `service.eco.subservice.solar.numberOfBatteries[0].model`,
    label: "Battery Model",
  },
  {
    value: `service.eco.subservice.solar.noOfInverters`,
    label: "No. of Inverters",
  },
  {
    value: `service.eco.subservice.solar.numberOfBatteries[0].manufacturer`,
    label: "Battery Manufracturer",
  },
  { value: `Access Equipment`, label: "Access Equipment" },
  { value: `Hies Warranty`, label: "Hies Warranty" },
  { value: `Export Tarriff`, label: "Export Tarriff" },
  { value: `Off Peak Changing`, label: "Off Peak Changing" },
  {
    value: `Full Installation & Registration`,
    label: "Full Installation & Registration",
  },
  { value: `service.eco.subservice.solar.agreedAmount`, label: "Total Cost" },
  { value: `Notes`, label: "Notes" },
];

export const mapOptionsForService = {
  Gas: gasMapOptions,
  Electric: electricMapOptions,
  Water: WaterMapOptions,
  Waste: WasteOptions,
  ChipAndPin: ChipAndPinOptions,
  Telecoms: TelecomsOptions,
  Broadband: BroadbandOptions,
  Insurance: InsuranceOptions,
  BusinessRates: BusinessRatesOptions,
  TelecomAndBroadband: teleBroadOptions,
  // Debt: debtMapOptions,
  company: mapOptions,
  consumer: mapOptionsConsumer,
  COMMERCIALEco: ecoMapOptionsCompany,
  Eco: ecoMapOptionsConsumer,
};

export const serviceOptions = [
  { value: "Gas", label: "Gas" },
  { value: "Electric", label: "Electric" },
  { value: "Water", label: "Water" },
  { value: "ChipAndPin", label: "ChipAndPin" },
  { value: "Telecoms", label: "Telecoms" },
  { value: "Broadband", label: "Broadband" },
  { value: "Waste", label: "Waste" },
  { value: "Insurance", label: "Insurance" },
  { value: "BusinessRates", label: "BusinessRates" },
  { value: "TelecomAndBroadband", label: "TelecomAndBroadband" },
];

export const RoofStructureOptions = [
  { value: "Curved roof", label: "Curved Roof" },
  { value: "Double gabled roof", label: "Double Gabled Roof" },
  { value: "Double hipped roof", label: "Double Hipped Roof" },
  { value: "Flat roof", label: "Flat Roof" },
  { value: "Gabled roof", label: "Gabled Roof" },
  { value: "Gablet roof", label: "Gablet Roof" },
  { value: "Mono roof", label: "Mono Roof" },
  { value: "Gambrel roof", label: "Gambrel Roof" },
  { value: "Hald hip and gambrel roof", label: "Hald Hip and Gambrel Roof" },
  { value: "Half hipped roof", label: "Half Hipped Roof" },
  { value: "Hipped roof", label: "Hipped Roof" },
  { value: "Lean to roof", label: "Lean to Roof" },
  { value: "Mansard roof", label: "Mansard Roof" },
  { value: "Outshut or catslide roof", label: "Outshut or Catslide Roof" },
];

export const CoverTypesOptions = [
  { value: "Concrete tile", label: "Concrete Tile" },
  { value: "Pan tile", label: "Pan Tile" },
  { value: "Plain tile rosemary tile", label: "Plain Tile Rosemary Tile" },
  { value: "Slate", label: "Slate" },
  { value: "Flat roof", label: "Flat Roof" },
  { value: "Pressed metal", label: "Pressed Metal" },
  { value: "Roll formed", label: "Roll Formed" },
  { value: "Asbestos", label: "*Asbestos" },
];

export const durationOptions = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
  {
    label: "5",
    value: "5",
  },
];

export const flatFileServiceOption = [
  {
    label: "Gas",
    value: "gas",
  },
  {
    label: "Electric",
    value: "electric",
  },
];

export const commissionTypeOptions = [
  {
    label: "Clawback",
    value: "Clawback",
  },
  {
    label: "Commission",
    value: "Commission",
  },
];

export const paymentTypeOptions = [
  {
    label: "Received",
    value: "Received",
  },
  {
    label: "Paid",
    value: "Paid",
  },
  {
    label: "Payout Pending",
    value: "Payout Pending",
  },
];

export const meterTypeOptions = [
  {
    label: "Day",
    value: "Day",
  },
  {
    label: "Night",
    value: "Night",
  },
  {
    label: "EW",
    value: "Ew",
  },
  {
    label: "Winter",
    value: "Winter",
  },
];

export const requiredOption = [
  "Local Distribution Zone",
  "AQ Band Lower",
  "AQ Band Upper",
  "Product Name",
  "Start Date",
  "End Date",
  "Unit Rate",
  "Standing Charge",
];

export const gasHeaders = [
  { value: "ldz", label: "ldz" },
  { value: "minAQ", label: "minAQ" },
  { value: "maxAQ", label: "maxAQ" },
  { value: "duration", label: "duration" },
  { value: "startDate", label: "startDate" },
  { value: "endDate", label: "endDate" },
  { value: "unitRate", label: "unitRate" },
  { value: "standingCharge", label: "standingCharge" },
  { value: "priceFor", label: "priceFor" },
];

export const electricHeaders = [
  { value: "distId", label: "distId" },
  { value: "meterType", label: "meterType" },
  { value: "profileClass", label: "profileClass" },
  { value: "duration", label: "duration" },
  { value: "standingCharge", label: "standingCharge" },
  { value: "dayUnitRate", label: "dayUnitRate" },
  { value: "nightUnitRate", label: "nightUnitRate" },
  { value: "eveningAndWeekendUnitRate", label: "eveningAndWeekendUnitRate" },
  { value: "minAQ", label: "minAQ" },
  { value: "maxAQ", label: "maxAQ" },
  { value: "startDate", label: "startDate" },
  { value: "endDate", label: "endDate" },
  { value: "priceFor", label: "priceFor" },
];

export const SubServiceOptions = [
  { value: "Boilers", label: "BOILERS" },
  { value: "UfiUnderfloor", label: "UFI UNDERFLOOR" },
  { value: "CavityWall", label: "CAVITY WALL" },
  { value: "Esh", label: "ESH" },
  { value: "Ftch", label: "FTCH" },
  { value: "Ewi", label: "EWI" },
  { value: "Iwi", label: "IWI" },
  { value: "RoomInARoof", label: "ROOM IN A ROOF" },
  { value: "LoftInsulation", label: "LOFT INSULATION" },
  { value: "Solar", label: "SOLAR" },
  { value: "BatteryStorage", label: "BATTERY STORAGE" },
  { value: "Invertor", label: "INVERTOR" },
];

export const LeadJobTypeOptions = [
  {
    label: "GBIS",
    value: "GBIS",
  },
  {
    label: "ECO4",
    value: "ECO4",
  },
  {
    label: "HUGS",
    value: "HUGS",
  },
];

export const CompanySubServiceOptions = [
  { value: "Solar", label: "COMMERCIAL SOLAR" },
];

export const SupplierTypeOptions = [
  { value: "ACREDDITATIONS", label: "ACREDDITATIONS" },
  { value: "DNO OFFICE", label: "DNO OFFICE" },
  { value: "LA FLEX", label: "LA FLEX" },
  { value: "SOLAR AND GAS EQUIPMENT", label: "SOLAR AND GAS EQUIPMENT" },
  { value: "INSULATION", label: "INSULATION" },
  { value: "INSTALLERS", label: "INSTALLERS" },
];

export const subServiceMapperObject = {
  boilers: "Boilers",
  ufiunderfloor: "UfiUnderfloor",
  cavitywall: "CavityWall",
  esh: "Esh",
  ftch: "Ftch",
  ewi: "Ewi",
  iwi: "Iwi",
  roominaroof: "RoomInARoof",
  loftinsulation: "LoftInsulation",
  solar: "Solar",
  batterystorage: "BatteryStorage",
  invertor: "Invertor",
};

const CompanyAutofill2 = {
  "Company Name": { datalabel: "Company Name", portal: "businessName" },
  "Site Address": { datalabel: "Site Address", portal: "Site.siteAddress" },
  "Site Postcode": { datalabel: "Site Postcode", portal: "Site.postcode" },
  "Registration Number": {
    datalabel: "Registration Number",
    portal: "registerNumber",
  },
  "Company Number": { datalabel: "Company Number", portal: "registerNumber" },
  "Site Phone Number": {
    datalabel: "Site Phone Number",
    portal: "Site.User[0].phone",
  },
  "Site Contact Name": {
    datalabel: "Site Contact Name",
    portal: "Site.User[0].name",
  },
  "Job Title": { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  Position: { datalabel: "Position", portal: "Site.User[0].jobTitle" },
  "Site Town": { datalabel: "Site Town", portal: "Site.town" },
  "MPAN Bottomline": {
    datalabel: "MPAN Bottomline",
    portal: "Site.electric.meterNumber",
  },
  MPRN: { datalabel: "MPRN", portal: "Site.gas.MPRN" },
  "Registered Number": {
    datalabel: "Registered Number",
    portal: "registerNumber",
  },
  "Office Number": { datalabel: "Office Number", portal: "Site.User[0].phone" },
  "Landline Number": {
    datalabel: "Landline Number",
    portal: "Site.User[0].phone",
  },
  "Mobile Number": { datalabel: "Mobile Number", portal: "Site.User[0].phone" },
  SPID: { datalabel: "SPID", portal: "Site.water.WaterCorespId" },
  "Account Number": {
    datalabel: "Account Number",
    portal: "bankAccountNumber",
  },
  "Site Mobile Number": {
    datalabel: "Site Mobile Number",
    portal: "Site.User[0].phone",
  },
  "Site Contact Number": {
    datalabel: "Site Contact Number",
    portal: "Site.User[0].phone",
  },
  "Email Address": { datalabel: "Email Address", portal: "Site.User[0].email" },
};

const companyAutoFill = [
  { datalabel: "Company Name", portal: "businessName" },
  { datalabel: "Business Sector", portal: "businessSector" },
  { datalabel: "Business Type", portal: "businessType" },
  { datalabel: "Company Type", portal: "businessType" },
  { datalabel: "No of Employees", portal: "Contact.length" },
  { datalabel: "VAT Number", portal: "vatNumber" },
  { datalabel: "Address line 1", portal: "firstLine" },
  { datalabel: "Address line 2", portal: "secondLine" },
  { datalabel: "Town", portal: "town" },
  { datalabel: "County", portal: "country" },
  { datalabel: "Postcode", portal: "postcode" },
  { datalabel: "Gateway Number", portal: "gatewayNumber" },
  { datalabel: "Bank Name", portal: "bankName" },
  { datalabel: "Bank Sortcode", portal: "bankSortcode" },
  { datalabel: "Bank Account Number", portal: "bankAccountNumber" },
  { datalabel: "Credit Score", portal: "creditScore" },
  { datalabel: "Credit Score Date", portal: "creditScoreDate", date: true },
  { datalabel: "Website", portal: "website" },
  { datalabel: "UTR", portal: "utr" },
  { datalabel: "Close Company", portal: "isCompanyClose" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },

  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Registration Number", portal: "registerNumber" },
  { datalabel: "Company Number", portal: "registerNumber" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddress",
  },
  {
    datalabel: "Site Contact Previous Address Years",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },

  { datalabel: "Position", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "MPAN Bottomline", portal: "Site.electric.meterNumber" },
  { datalabel: "MPRN", portal: "Site.gas.MPRN" },
  { datalabel: "Registered Number", portal: "registerNumber" },
  { datalabel: "Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Landline Number", portal: "Site.User[0].phone" },
  { datalabel: "Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "SPID", portal: "Site.water.WaterCorespId" },
  { datalabel: "Account Number", portal: "bankAccountNumber" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Email Address", portal: "Site.User[0].email" },
  { datalabel: "NA", portal: "NA" },
];

const consumerAutoFill = [
  { datalabel: "Consumer ID", portal: "consumerId" },
  { datalabel: "First Name", portal: "firstName" },
  { datalabel: "Surname", portal: "surName" },
  { datalabel: "Title", portal: "title" },
  { datalabel: "Postcode", portal: "postcode" },
  { datalabel: "Sortcode", portal: "sortCode" },
  { datalabel: "Mobile", portal: "mobile" },
  { datalabel: "Telephone Number", portal: "telephoneNumber" },
  { datalabel: "Email", portal: "email" },
  { datalabel: "City", portal: "city" },
  { datalabel: "Town", portal: "town" },
  { datalabel: "Address One", portal: "addressOne" },
  { datalabel: "Address Two", portal: "addressTwo" },
  { datalabel: "DOB", portal: "DOB", date: true },
  { datalabel: "Account Number", portal: "accountNumber" },
  { datalabel: "Bank Name", portal: "bankName" },
  { datalabel: "Age", portal: "age" },
];

const ecoAutoFillConsumer = [
  { portal: `consumerFullname`, datalabel: "Consumer Name" },
  { portal: `Consumer.title`, datalabel: "Consumer Title" },
  { portal: `Consumer.firstName`, datalabel: "Consumer Firstname" },
  { portal: `Consumer.surName`, datalabel: "Consumer Surname" },
  { portal: `Consumer.consumerId`, datalabel: "Consumer ID" },
  { portal: `Consumer.addressOne`, datalabel: "Address 1" },
  { portal: `Consumer.addressTwo`, datalabel: "Address 2" },
  { portal: `Consumer.town`, datalabel: "Town" },
  { portal: `Consumer.city`, datalabel: "City" },
  { portal: `Consumer.postcode`, datalabel: "Postcode" },
  { portal: `Consumer.sortCode`, datalabel: "SortCode" },
  { portal: `Consumer.DOB`, datalabel: "DOB" },
  { portal: `Consumer.age`, datalabel: "Age" },
  { portal: `Consumer.bankName`, datalabel: "Bank Name" },
  { portal: `Consumer.mobile`, datalabel: "Mobile" },
  { portal: `Consumer.telephoneNumber`, datalabel: "Telephone Number" },
  { portal: `Consumer.siteAddress`, datalabel: "Site Address" },

  { portal: `service.eco.subservice.solar.netCost`, datalabel: "Net Price" },
  { portal: `service.eco.subservice.solar.netCost`, datalabel: "Net Cost" },
  { portal: `service.eco.subservice.solar.vat`, datalabel: "VAT" },
  { portal: `service.eco.subservice.solar.discount`, datalabel: "Discount" },
  {
    portal: `service.eco.subservice.solar.peakSystemOutput`,
    datalabel: "Peak System Output",
  },
  {
    portal: `service.eco.subservice.solar.systemSize`,
    datalabel: "System Size",
  },
  {
    portal: `service.eco.subservice.solar.noOfPanels`,
    datalabel: "Number of Panels",
  },
  {
    portal: `service.eco.subservice.solar.roofsPanelsInstalled`,
    datalabel: "Number of Roof Panels",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].manufacturer`,
    datalabel: "Panels Manufacturer",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    datalabel: "Panels Model",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    datalabel: "Panels Model Name",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].roofPitch`,
    datalabel: "Roof Pitch",
  },
  {
    portal: `service.eco.subservice.solar.numberOfInverters[0].manufacturer`,
    datalabel: "Inverter Manufacturer",
  },
  {
    portal: `service.eco.subservice.solar.numberOfInverters[0].model`,
    datalabel: "Inverter Model",
  },
  {
    portal: `service.eco.subservice.solar.noOfBatteries`,
    datalabel: "No. of Batteries",
  },
  {
    portal: `service.eco.subservice.solar.numberOfBatteries[0].model`,
    datalabel: "Battery Model",
  },
  {
    portal: `service.eco.subservice.solar.noOfInverters`,
    datalabel: "No. of Inverters",
  },
  {
    portal: `service.eco.subservice.solar.numberOfBatteries[0].manufacturer`,
    datalabel: "Battery Manufracturer",
  },
  { portal: `Access Equipment`, datalabel: "Access Equipment" },
  { portal: `Hies Warranty`, datalabel: "Hies Warranty" },
  { portal: `Export Tarriff`, datalabel: "Export Tarriff" },
  { portal: `Off Peak Changing`, datalabel: "Off Peak Changing" },
  {
    portal: `Full Installation & Registration`,
    datalabel: "Full Installation & Registration",
  },
  {
    portal: `service.eco.subservice.solar.agreedAmount`,
    datalabel: "Total Cost",
  },
  { portal: `Notes`, datalabel: "Notes" },
];

const ecoAutoFillCompany = [
  { portal: "Company.businessName", datalabel: "Company Name" },
  { portal: "Company.firstLine", datalabel: "Address line 1" },
  { portal: "Company.firstLine", datalabel: "Address 1" },
  { portal: "Company.secondLine", datalabel: "Address line 2" },
  { portal: "Company.postcode", datalabel: "Postcode" },
  { portal: "Company.town", datalabel: "Town" },
  { portal: "Company.country", datalabel: "Country" },
  { portal: "Company.registerNumber", datalabel: "Registration Number" },
  { portal: "Company.vatNumber", datalabel: "VAT Number" },
  { portal: "Company.gatewayNumber", datalabel: "Gateway Number" },
  { portal: "Company.bankSortcode", datalabel: "Bank Sortcode" },
  { portal: "Company.creditScore", datalabel: "Credit Score" },
  { portal: "Company.bankName", datalabel: "Bank Name" },
  { portal: "Company.bankAccountNumber", datalabel: "Bank Account Number" },
  { portal: "Company.businessType", datalabel: "Company Type" },
  { portal: "Site.siteAddress", datalabel: "Site Address" },
  { portal: "Site.town", datalabel: "Site Town" },
  { portal: "Site.city", datalabel: "Site City" },
  { portal: "Site.postcode", datalabel: "Site Postcode" },

  { portal: `service.eco.subservice.solar.netCost`, datalabel: "Net Price" },
  { portal: `service.eco.subservice.solar.netCost`, datalabel: "Net Cost" },
  { portal: `service.eco.subservice.solar.vat`, datalabel: "VAT" },
  { portal: `service.eco.subservice.solar.discount`, datalabel: "Discount" },
  {
    portal: `service.eco.subservice.solar.peakSystemOutput`,
    datalabel: "Peak System Output",
  },
  {
    portal: `service.eco.subservice.solar.systemSize`,
    datalabel: "System Size",
  },
  {
    portal: `service.eco.subservice.solar.noOfPanels`,
    datalabel: "Number of Panels",
  },
  {
    portal: `service.eco.subservice.solar.roofsPanelsInstalled`,
    datalabel: "Number of Roof Panels",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].manufacturer`,
    datalabel: "Panels Manufacturer",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    datalabel: "Panels Model",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].model`,
    datalabel: "Panels Model Name",
  },
  {
    portal: `service.eco.subservice.solar.numberOfRoofs[0].roofPitch`,
    datalabel: "Roof Pitch",
  },
  {
    portal: `service.eco.subservice.solar.numberOfInverters[0].manufacturer`,
    datalabel: "Inverter Manufacturer",
  },
  {
    portal: `service.eco.subservice.solar.numberOfInverters[0].model`,
    datalabel: "Inverter Model",
  },
  {
    portal: `service.eco.subservice.solar.noOfBatteries`,
    datalabel: "No. of Batteries",
  },
  {
    portal: `service.eco.subservice.solar.numberOfBatteries[0].model`,
    datalabel: "Battery Model",
  },
  {
    portal: `service.eco.subservice.solar.noOfInverters`,
    datalabel: "No. of Inverters",
  },
  {
    portal: `service.eco.subservice.solar.numberOfBatteries[0].manufacturer`,
    datalabel: "Battery Manufracturer",
  },
  { portal: `Access Equipment`, datalabel: "Access Equipment" },
  { portal: `Hies Warranty`, datalabel: "Hies Warranty" },
  { portal: `Export Tarriff`, datalabel: "Export Tarriff" },
  { portal: `Off Peak Changing`, datalabel: "Off Peak Changing" },
  {
    portal: `Full Installation & Registration`,
    datalabel: "Full Installation & Registration",
  },
  {
    portal: `service.eco.subservice.solar.agreedAmount`,
    datalabel: "Total Cost",
  },
  { portal: `Notes`, datalabel: "Notes" },
];

const gasAutoFill = [
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Postcode", portal: "Company.postcode" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Consumer Name", portal: "Consumer.firstName" },
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Contact Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Mobile", portal: "Site.User[0].mobile" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },

  { datalabel: "Site Contact Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddress",
  },
  {
    datalabel: "Site Contact Previous Address Years",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Position", portal: "Site.User[0].jobTitle" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site City", portal: "Site.city" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "MPRN", portal: "service.gas.meterNumber" },
  { datalabel: "Second MPRN", portal: "service.gas.meterNumberTwo" },
  { datalabel: "Meter Serial Number", portal: "service.gas.meterSerialNumber" },
  { datalabel: "Meter Type", portal: "service.gas.meterType" },
  { datalabel: "COT", portal: "service.gas.COT" },
  {
    datalabel: "Current Contract Length",
    portal: "service.gas.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.gas.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.gas.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.gas.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.gas.contract_end_date",
    date: true,
  },
  { datalabel: "Unit Rate", portal: "service.gas.unitRate" },
  { datalabel: "Unit Charge", portal: "service.gas.unitRate" },
  { datalabel: "AQ", portal: "service.gas.kWH" },
  { datalabel: "Number of Days", portal: "service.gas.no_of_days" },
  {
    datalabel: "Bill Start Date",
    portal: "service.gas.bill_start_date",
    date: true,
  },
  {
    datalabel: "Bill End Date",
    portal: "service.gas.bill_end_date",
    date: true,
  },
  { datalabel: "Standing Charge", portal: "service.gas.dailyCharges" },
  { datalabel: "Standing Charges", portal: "service.gas.dailyCharges" },
  { datalabel: "Account Number", portal: "service.gas.accountNumber" },
  {
    datalabel: "Online Account Username",
    portal: "service.gas.onlineAccountUserName",
  },
  {
    datalabel: "Online Account Password",
    portal: "service.gas.onlineAccountPassword",
  },

  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Town", portal: "Company.town" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },
  { datalabel: "Site City", portal: "Site.city" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "UTR", portal: "Company.utr" },

  { datalabel: "NA", portal: "NA" },
];

const electricAutoFill = [
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Top line - MPAN", portal: "service.electric.topLine" },
  { datalabel: "Bottom line - MPAN", portal: "service.electric.meterNumber" },
  {
    datalabel: "Top line - Second MPAN",
    portal: "service.electric.topLineTwo",
  },
  {
    datalabel: "Bottom line - Second MPAN",
    portal: "service.electric.meterNumberTwo",
  },
  {
    datalabel: "Meter Serial Number",
    portal: "service.electric.meterSerialNumber",
  },
  { datalabel: "COT", portal: "service.electric.COT" },
  {
    datalabel: "Current Contract Length",
    portal: "service.electric.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.electric.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.electric.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.electric.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.electric.contract_end_date",
    date: true,
  },
  { datalabel: "Standing Charge", portal: "service.electric.dailyCharges" },
  {
    datalabel: "Bill Date Type",
    portal: "service.BillDateTypeArray[electric.bill_date_type]",
  },
  { datalabel: "Unit Day Rate", portal: "service.electric.unitDayRate" },
  { datalabel: "Unit Day Usage", portal: "service.electric.unitDaykWh" },
  { datalabel: "Unit Night Rate", portal: "service.electric.unitNightRate" },
  { datalabel: "Unit Night Usage", portal: "service.electric.unitNightkWH" },
  { datalabel: "Eve/Wkd Rate", portal: "service.electric.unitWkdRate" },
  { datalabel: "Eve/Wkd Usage", portal: "service.electric.unitWkdkWh" },
  { datalabel: "Winter Rate", portal: "service.electric.unitWinterRate" },
  { datalabel: "Winter Usage", portal: "service.electric.unitWinterkWH" },
  { datalabel: "Account Number", portal: "service.electric.accountNumber" },
  {
    datalabel: "Online Account Username",
    portal: "service.electric.onlineAccountUserName",
  },
  {
    datalabel: "Online Account Password",
    portal: "service.electric.onlineAccountPassword",
  },
  { datalabel: "Number of Days", portal: "service.electric.no_of_days" },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const debtAutoFill = [
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "Business Name", portal: "service.debt.businessName" },
  { datalabel: "Business Address", portal: "service.debt.businessAddress" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  {
    datalabel: "Current Contract Length",
    portal: "service.debt.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.debt.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.debt.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.debt.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.debt.contract_end_date",
    date: true,
  },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const teleBroadAutoFill = [
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Postcode", portal: "Company.postcode" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Consumer Name", portal: "Consumer.firstName" },
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Contact Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Mobile", portal: "Site.User[0].mobile" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },

  { datalabel: "Site Contact Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddress",
  },
  {
    datalabel: "Site Contact Previous Address Years",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Position", portal: "Site.User[0].jobTitle" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  {
    datalabel: "Phone Number",
    portal: "service.telecomandbroadband.PhoneNumber",
  },
  {
    datalabel: "Type of Phone System",
    portal: "service.telecomandbroadband.phoneSystem",
  },
  {
    datalabel: "Provider",
    portal: "service.service.telecomandbroadband.provider",
  },
  {
    datalabel: "One Off Charge",
    portal: "service.telecomandbroadband.oneOffCharge",
  },
  {
    datalabel: "Select Product",
    portal: "service.telecomandbroadband.products",
  },
  {
    datalabel: "Number of Handsets",
    portal: "service.telecomandbroadband.number_of_handset",
  },
  {
    datalabel: "Additional Handsets £10 Per Handsests",
    portal: "service.telecomandbroadband.additional_handsets",
  },
  {
    datalabel: "Broadband Number",
    portal: "service.telecomandbroadband.broadband_number",
  },
  {
    datalabel: "Customer got our Router",
    portal: "service.telecomandbroadband.router",
  },
  {
    datalabel: "Number of Routers",
    portal: "service.telecomandbroadband.noOfRouter",
  },
  { datalabel: "User Name", portal: "service.telecomandbroadband.UserName" },
  { datalabel: "IP Address", portal: "service.telecomandbroadband.IPAddress" },
  {
    datalabel: "Contract length",
    portal: "service.telecomandbroadband.contract_length",
  },
  {
    datalabel: "Contract Start Date",
    portal: "service.telecomandbroadband.contract_start_date",
  },
  {
    datalabel: "Contract End Date",
    portal: "service.telecomandbroadband.contract_end_date",
  },
  { datalabel: "Multi Line", portal: "service.telecomandbroadband.multiline" },
  {
    datalabel: "Multi Line Phone Number",
    portal: "service.telecomandbroadband.Multiline_PhoneNumber",
  },
  {
    datalabel: "Cost For Multi Line",
    portal: "service.telecomandbroadband.multilineCost",
  },
  {
    datalabel: "Extra on Multi Line",
    portal: "service.telecomandbroadband.extraMultiLine",
  },
  {
    datalabel: "Type of Extras",
    portal: "service.telecomandbroadband.divertsCost",
  },
  {
    datalabel: "Cost of Extras",
    portal: "service.telecomandbroadband.costOfExtras",
  },
  {
    datalabel: "Overall Cost to Customer",
    portal: "service.telecomandbroadband.overall_customer_cost",
  },

  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Town", portal: "Company.town" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },
  { datalabel: "Site City", portal: "Site.city" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "UTR", portal: "Company.utr" },

  { datalabel: "NA", portal: "NA" },
];

const broadbandAutoFill = [
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddress",
  },
  {
    datalabel: "Site Contact Previous Address Years",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site City", portal: "Site.city" },
  { datalabel: "Site Country", portal: "Site.country" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Products", portal: "service.broadband.Products" },
  { datalabel: "Broadband rental", portal: "service.broadband.Rental" },
  {
    datalabel: "Connection charges",
    portal: "service.broadband.ConnectionCharges",
  },
  { datalabel: "Router price", portal: "service.broadband.RouterPrice" },
  { datalabel: "Broadband Status", portal: "service.broadband.status" },
  {
    datalabel: "Current Contract Length",
    portal: "service.broadband.previous_contract_length",
    date: true,
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.broadband.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.broadband.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.broadband.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.broadband.contract_end_date",
    date: true,
  },
  { datalabel: "User name", portal: "service.broadband.UserName" },
  { datalabel: "Password", portal: "service.broadband.Password" },
  { datalabel: "IP address", portal: "service.broadband.IPAddress" },
  { datalabel: "Router model", portal: "service.broadband.RouterModel" },
  { datalabel: "Serial number", portal: "service.broadband.SerialNumber" },
  {
    datalabel: "Programmed date",
    portal: "service.broadband.ProgrammedDate",
    date: true,
  },
  {
    datalabel: "Broadband postage proof",
    portal: "service.broadband.BroadbandPostageProof",
  },
  {
    datalabel: "Broadband live date",
    portal: "service.broadband.BroadbandLiveDate",
    date: true,
  },
  {
    datalabel: "Broadband Renewal date",
    portal: "service.broadband.BroadbandRenewalDate",
    date: true,
  },
  { datalabel: "Account Number", portal: "service.broadband.accountNumber" },
  {
    datalabel: "Wholesale Provider",
    portal: "service.broadband.WholeSaleProvider",
  },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const waterAutoFill = [
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Water Corespid", portal: "service.water.WaterCorespId" },
  { datalabel: "Core Spid Rates", portal: "service.water.CoreSpidRates" },
  {
    datalabel: "Current Contract Length",
    portal: "service.water.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.water.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.water.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.water.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.water.contract_end_date",
    date: true,
  },
  { datalabel: "Sewage Spid", portal: "service.water.SewageSpid" },
  { datalabel: "Sewage Apid Rates", portal: "service.water.SewageApidRates" },
  { datalabel: "Water Meter SN", portal: "service.water.WaterMeterSN" },
  { datalabel: "Water Annual Spend", portal: "service.water.WaterAnnualSpend" },
  { datalabel: "Water Discount", portal: "service.water.WaterDiscount" },
  {
    datalabel: "Water Renewal Date",
    portal: "service.water.WaterRenewalDate",
    date: true,
  },
  { datalabel: "Account Number", portal: "service.water.accountNumber" },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const telecomsAutoFill = [
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Postcode", portal: "Company.postcode" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "Phone number 1", portal: "service.telecoms.PhoneNumber1" },
  { datalabel: "Telecom status", portal: "service.telecoms.status" },
  { datalabel: "Phone number 2", portal: "service.telecoms.PhoneNumber2" },
  { datalabel: "Phone number 3", portal: "service.telecoms.PhoneNumber3" },
  { datalabel: "Phone numbers 4", portal: "service.telecoms.PhoneNumber4" },
  { datalabel: "Phone number 4", portal: "service.telecoms.PhoneNumber4" },
  { datalabel: "Phone number 4 Range", portal: "service.telecoms.PhoneRange4" },
  { datalabel: "Phone Numbers 5", portal: "service.telecoms.PhoneNumber5" },
  { datalabel: "Phone number 5 Range", portal: "service.telecoms.PhoneRange5" },
  { datalabel: "Phone Numbers 6", portal: "service.telecoms.PhoneNumber6" },
  { datalabel: "Phone number 6 Range", portal: "service.telecoms.PhoneRange6" },
  { datalabel: "Cash Amount", portal: "service.telecoms.CashAmount" },
  {
    datalabel: "Current Contract Length",
    portal: "service.telecoms.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.telecoms.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.telecoms.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.telecoms.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.telecoms.contract_end_date",
    date: true,
  },
  { datalabel: "Connection Type", portal: "service.telecoms.connectionType" },
  {
    datalabel: "Line rental and Packages",
    portal: "service.telecoms.LineRental",
  },
  {
    datalabel: "Connection charges",
    portal: "service.telecoms.ConnectionCharges",
  },
  {
    datalabel: "Plus option to add extras",
    portal: "service.telecoms.AddExtras",
  },
  { datalabel: "Extras", portal: "service.telecoms.Extras" },
  {
    datalabel: "Telecoms live date",
    portal: "service.telecoms.TelecomsLiveDate",
    date: true,
  },
  {
    datalabel: "Telecoms renewal date",
    portal: "service.telecoms.TelecomsRenewalDate",
    date: true,
  },
  { datalabel: "Account Number", portal: "service.telecoms.accountNumber" },
  {
    datalabel: "Wholesale Provider",
    portal: "service.telecoms.WholeSaleProvider",
  },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const wasteAutoFill = [
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "EWC code", portal: "service.waste.EwcCode" },
  { datalabel: "Waste Type", portal: "service.waste.wasteType" },
  { datalabel: "Container Type", portal: "service.waste.containerType" },
  { datalabel: "Monthly DD", portal: "service.waste.monthlyDD" },
  {
    datalabel: "Number of containers",
    portal: "service.waste.numberOfContainers",
  },
  { datalabel: "Charge per lift", portal: "service.waste.chargePerLift" },
  { datalabel: "Daily rental", portal: "service.waste.dailyRental" },
  { datalabel: "Service frequency", portal: "service.waste.serviceFrequency" },
  { datalabel: "Delivery Charge", portal: "service.waste.deliveryCharge" },
  {
    datalabel: "WTN Complaince Charge",
    portal: "service.waste.WasteTransferNoteComplainceCharge",
  },
  { datalabel: "Assumed weight", portal: "service.waste.assumedWeight" },
  { datalabel: "Total monthly cost", portal: "service.waste.totalMonthlyCost" },
  {
    datalabel: "Current Contract Length",
    portal: "service.waste.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.waste.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.waste.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.waste.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.waste.contract_end_date",
    date: true,
  },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const chipAndPinAutoFill = [
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Postcode", portal: "Company.postcode" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "Machine Type", portal: "service.chipAndPin.MachineType" },
  { datalabel: "Payment Type", portal: "service.chipAndPin.PDQFinanceStatus" },
  {
    datalabel: "Number of terminals",
    portal: "service.chipAndPin.NumberTerminals",
  },
  {
    datalabel: "Provider Ref. number",
    portal: "service.chipAndPin.ProviderRefNumber",
  },
  { datalabel: "Merchant rental", portal: "service.chipAndPin.MerchantRental" },
  { datalabel: "Package", portal: "service.chipAndPin.Package" },
  { datalabel: "Deployment Cost", portal: "service.chipAndPin.DeploymentCost" },
  { datalabel: "Analytics cost", portal: "service.chipAndPin.AnalyticsCost" },
  {
    datalabel: "Current Contract Length",
    portal: "service.chipAndPin.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.chipAndPin.previous_contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract Length",
    portal: "service.chipAndPin.contract_length",
  },
  {
    datalabel: "Contract Start Date",
    portal: "service.chipAndPin.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.chipAndPin.contract_end_date",
    date: true,
  },
  {
    datalabel: "Credit card rates",
    portal: "service.chipAndPin.CreditCardRate",
  },
  { datalabel: "Debit card rates", portal: "service.chipAndPin.DebitCardRate" },
  {
    datalabel: "Business card rates",
    portal: "service.chipAndPin.BusinessCardRate",
  },
  {
    datalabel: "Authorization fee",
    portal: "service.chipAndPin.AuthorizationFee",
  },
  { datalabel: "PCI DSS charge", portal: "service.chipAndPin.PCIDSSCharge" },
  { datalabel: "Connection type", portal: "service.chipAndPin.ConnectionType" },
  {
    datalabel: "Delivery date",
    portal: "service.chipAndPin.DeliveryDate",
    date: true,
  },
  {
    datalabel: "First transaction date",
    portal: "service.chipAndPin.FirstTransactionDate",
    date: true,
  },
  {
    datalabel: "Renewal Date",
    portal: "service.chipAndPin.RenewalDate",
    date: true,
  },
  {
    datalabel: "PCI DSS user name",
    portal: "service.chipAndPin.PCIDSSUserName",
  },
  {
    datalabel: "PCI DSS password",
    portal: "service.chipAndPin.PCIDSSPassword",
  },
  {
    datalabel: "PCI complaint date",
    portal: "service.chipAndPin.PCIComplaintDate",
    date: true,
  },
  { datalabel: "MID Number", portal: "service.chipAndPin.midNumber" },
  { datalabel: "Account Number", portal: "service.chipAndPin.accountNumber" },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },

  { datalabel: "NA", portal: "NA" },
];

const insuranceAutoFill = [
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  { datalabel: "Insurance Type", portal: "Company.insuranceType" },
  {
    datalabel: "Insurance Product",
    portal: "service.insurance.insuranceProduct",
  },
  { datalabel: "Contact Number", portal: "service.insurance.contactNumber" },
  { datalabel: "Email", portal: "service.insurance.email" },
  { datalabel: "Type of Business", portal: "service.insurance.typeOfBusiness" },
  {
    datalabel: "Current Contract Length",
    portal: "service.insurance.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.insurance.previous_contract_start_date",
    date: true,
  },
  { datalabel: "Contract Length", portal: "service.insurance.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.insurance.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.insurance.contract_end_date",
    date: true,
  },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const businessAutoFill = [
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Office Number", portal: "Site.User[0].phone" },
  { datalabel: "Contact Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].mobile" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },
  { datalabel: "Site Contact Email", portal: "Site.User[0].email" },
  { datalabel: "Site Contact Phone", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact DOB", portal: "Site.User[0].DOB", date: true },
  {
    datalabel: "Site Contact Home Address",
    portal: "Site.User[0].homeAddress",
  },
  {
    datalabel: "Site Contact Previous Address",
    portal: "Site.User[0].previousAddressYear",
  },
  { datalabel: "Site Contact Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
  { datalabel: "Site Town", portal: "Site.town" },
  { datalabel: "Site Country", portal: "Site.country" },
  { datalabel: "Site City", portal: "Site.city" },
  {
    datalabel: "Site Contact National Insurance",
    portal: "Site.User[0].nationalInsurance",
  },

  {
    datalabel: "Type Of Business Rates Work",
    portal: "service.businessRates.typeOfBusinessRatesWork",
  },
  {
    datalabel: "Local Authority Ref Number",
    portal: "service.businessRates.localAuthorityRefNumber",
  },
  {
    datalabel: "Business Rates Account No",
    portal: "service.businessRates.businessRatesAccountNo",
  },
  {
    datalabel: "Business Rates Bill",
    portal: "service.businessRates.businessRatesBill",
  },
  {
    datalabel: "Rates Relief Completed Form",
    portal: "service.businessRates.ratesReliefCompletedForm",
  },
  {
    datalabel: "British Passport",
    portal: "service.businessRates.britishPassport",
  },
  { datalabel: "Home Proof", portal: "service.businessRates.homeProof" },
  {
    datalabel: "Property Layout Diagram",
    portal: "service.businessRates.propertyLayoutDiagram",
  },
  { datalabel: "Site Photos", portal: "service.businessRates.sitePhotos" },
  { datalabel: "Lease", portal: "service.businessRates.lease" },
  {
    datalabel: "Director Statement",
    portal: "service.businessRates.directorStatement",
  },
  {
    datalabel: "Director Details",
    portal: "service.businessRates.directorDetails",
  },
  {
    datalabel: "Current Rateable value (GDP Pound)",
    portal: "service.businessRates.currentRateableValue",
  },
  { datalabel: "Ni Insurance", portal: "service.businessRates.insurance" },
  {
    datalabel: "Passport Number",
    portal: "service.businessRates.passportNumber",
  },
  {
    datalabel: "Current Contract Length",
    portal: "service.businessRates.previous_contract_length",
  },
  {
    datalabel: "Current Contract End Date",
    portal: "service.businessRates.previous_contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract Length",
    portal: "service.businessRates.contract_length",
  },
  {
    datalabel: "Contract Start Date",
    portal: "service.businessRates.contract_start_date",
    date: true,
  },
  {
    datalabel: "Contract End Date",
    portal: "service.businessRates.contract_end_date",
    date: true,
  },

  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Address line 1", portal: "Company.firstLine" },
  { datalabel: "Address line 2", portal: "Company.secondLine" },
  { datalabel: "Company Postcode", portal: "Company.postcode" },
  { datalabel: "Town", portal: "Company.town" },
  { datalabel: "Country", portal: "Company.country" },
  { datalabel: "Registration Number", portal: "Company.registerNumber" },
  { datalabel: "Credit Score", portal: "Company.creditScore" },
  { datalabel: "Gateway Number", portal: "Company.gatewayNumber" },
  { datalabel: "VAT Number", portal: "Company.vatNumber" },
  { datalabel: "Bank Sortcode", portal: "Company.bankSortcode" },
  { datalabel: "Bank Sort Code", portal: "Company.bankSortcode" },
  { datalabel: "Bank Account Number", portal: "Company.bankAccountNumber" },
  { datalabel: "Bank Name", portal: "Company.bankName" },
  { datalabel: "Business Type", portal: "Company.businessType" },
  { datalabel: "UTR", portal: "Company.utr" },
  { datalabel: "Postcode", portal: "Company.postcode" },

  { datalabel: "NA", portal: "NA" },
];

const energyAutoFill = [
  { datalabel: "Company Name", portal: "Company.businessName" },
  { datalabel: "Consumer Name", portal: "Consumer.firstName" },
  { datalabel: "Site Name", portal: "Site.siteName" },
  { datalabel: "Site Address", portal: "Site.siteAddress" },
  { datalabel: "Site Postcode", portal: "Site.postcode" },
  { datalabel: "Site Phone Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Name", portal: "Site.User[0].name" },
  { datalabel: "Site Mobile Number", portal: "Site.User[0].phone" },
  { datalabel: "Site Contact Number", portal: "Site.User[0].phone" },
  { datalabel: "Current Supplier", portal: "Supplier.supplierName" },

  { datalabel: "Current Tariff", portal: "service.energy.currentTariff" },
  { datalabel: "Economy 7", portal: "service.energy.economy" },
  { datalabel: "Electric Annual Usage", portal: "service.energy.EAnnualCost" },
  {
    datalabel: "Electric Monthly Usage",
    portal: "service.energy.EMonthlyCost",
  },
  { datalabel: "Gas Annual Usage", portal: "service.energy.GAnnualCost" },
  { datalabel: "Gas Monthly Usage", portal: "service.energy.GMonthlyCost" },
  { datalabel: "Payment Option", portal: "service.energy.paymentOption" },
  {
    datalabel: "Warm Home Discount",
    portal: "service.energy.warmHomeDiscount",
  },
  { datalabel: "Promotion Code", portal: "service.energy.pcode" },
  { datalabel: "New Supplier Name", portal: "Supplier.supplierName" },
  { datalabel: "New Supplier Tariff", portal: "service.energy.newTariff" },
  { datalabel: "Contract Length", portal: "service.energy.contract_length" },
  {
    datalabel: "Contract Start Date",
    portal: "service.energy.contract_start_date",
  },
  {
    datalabel: "Contract End Date",
    portal: "service.energy.contract_end_date",
  },
  {
    datalabel: "Contract Review",
    portal: "service.energy.contractReviewOption",
  },
  { datalabel: "Job Title", portal: "Site.User[0].jobTitle" },
];

export const AutoFill = {
  Gas: gasAutoFill,
  Electric: electricAutoFill,
  Water: waterAutoFill,
  Waste: wasteAutoFill,
  ChipAndPin: chipAndPinAutoFill,
  Telecoms: telecomsAutoFill,
  Broadband: broadbandAutoFill,
  Insurance: insuranceAutoFill,
  BusinessRates: businessAutoFill,
  // Debt: debtAutoFill,
  TelecomAndBroadband: teleBroadAutoFill,
  // Energy: energyAutoFill,
  company: companyAutoFill,
  consumer: consumerAutoFill,
  Eco: ecoAutoFillConsumer,
  COMMERCIALEco: ecoAutoFillCompany,
};

export const LeadTenureOptions = [
  {
    label: "OO - Owner Occupied",
    value: "OO - Owner Occupied",
  },
  {
    label: "PRS - Private Rented",
    value: "PRS - Private Rented",
  },
  {
    label: "SH - Social Housing",
    value: "SH - Social Housing",
  },
];

export const LeadProjectStatusOptions = [
  {
    label: "T1 - Traige",
    value: "T1 - Traige",
  },
  {
    label: "U1 - Survey Stage",
    value: "U1 - Survey Stage",
  },
  {
    label: "L1 - Installation",
    value: "L1 - Installation",
  },
  {
    label: "Submission Stage",
    value: "Submission Stage",
  },
  {
    label: "C1 - Project Closure Stage",
    value: "C1 - Project Closure Stage",
  },
  {
    label: "C1 - Project Completed",
    value: "C1 - Project Completed",
  },
  {
    label: "X - Project Canx",
    value: "X - Project Canx",
  },
  {
    label: "Tech Survey",
    value: "Tech Survey",
  },
  {
    label: "Active Installation",
    value: "Active Installation",
  },
  {
    label: "Installation Booked",
    value: "Installation Booked",
  },
  {
    label: "On Hold",
    value: "On Hold",
  },
];

export const LeadBuildOptions = [
  {
    label: "Cavity",
    value: "Cavity",
  },
  {
    label: "System/Timber",
    value: "System/Timber",
  },
  {
    label: "Solid",
    value: "Solid",
  },
];

export const LeadTotalFloorAreaM2 = [
  {
    label: "0-72m2",
    value: "0-72m2",
  },
  {
    label: "73-97m2",
    value: "73-97m2",
  },
  {
    label: "98-199m2",
    value: "98-199m2",
  },
  {
    label: "200+m2",
    value: "200+m2",
  },
];

export const MeasuresBeingOptions = [
  {
    label: "LI",
    value: "LI",
  },
  {
    label: "UFI",
    value: "UFI",
  },
  {
    label: "EWI",
    value: "EWI",
  },
  {
    label: "IWI",
    value: "IWI",
  },
  {
    label: "RIR",
    value: "RIR",
  },
  {
    label: "CI",
    value: "CI",
  },
  {
    label: "FTCH",
    value: "FTCH",
  },
  {
    label: "BO - Upgrade",
    value: "BO - Upgrade",
  },
  {
    label: "Heat Controls",
    value: "Heat Controls",
  },
  {
    label: "VENT",
    value: "VENT",
  },
  {
    label: "Choice 11",
    value: "Choice 11",
  },
  {
    label: "Solar",
    value: "Solar",
  },
  {
    label: "ASHP PUMPS",
    value: "ASHP PUMPS",
  },
  {
    label: "ESH",
    value: "ESH",
  },
  {
    label: "Cavity Bead",
    value: "Cavity Bead",
  },
];

export const MeasuresBeingOptionsForSolar = [
  {
    label: "LI",
    value: "LI",
  },
  {
    label: "UFI",
    value: "UFI",
  },
  {
    label: "EWI",
    value: "EWI",
  },
  {
    label: "IWI",
    value: "IWI",
  },
  {
    label: "RIR",
    value: "RIR",
  },
  {
    label: "CI",
    value: "CI",
  },
  {
    label: "FTCH",
    value: "FTCH",
  },
  {
    label: "BO - Upgrade",
    value: "BO - Upgrade",
  },
  {
    label: "Heat Controls",
    value: "Heat Controls",
  },
  {
    label: "VENT",
    value: "VENT",
  },
  {
    label: "Choice 11",
    value: "Choice 11",
  },
  // {
  //   label: 'Panel',
  //   value: 'Panel'
  // },
  // {
  //   label: 'Mounting',
  //   value: 'Mounting'
  // },
  // {
  //   label: 'Battery',
  //   value: 'Battery'
  // },
  // {
  //   label: 'Invertor',
  //   value: 'Invertor'
  // },
  // {
  //   label: 'Electrical Parts',
  //   value: 'Electrical Parts'
  // },
  // {
  //   label: 'Electrical Labour',
  //   value: 'Electrical Labour'
  // },
];

export const MeasuresBeingOptionsForPaidSolar = [
  {
    label: "Solar",
    value: "Solar",
  },
  {
    label: "Battery Storage",
    value: "Battery Storage",
  },
  {
    label: "ASHP",
    value: "ASHP",
  },
  {
    label: "ESH",
    value: "ESH",
  },
];

export const EligibilityRouteOptions = [
  {
    label: "DataMatch",
    value: "DataMatch",
  },
  {
    label: "GBIS",
    value: "GBIS",
  },
  {
    label: "LAFlex",
    value: "LAFlex",
  },
];

export const EligibilityStatusOptions = [
  {
    label: "Matched",
    value: "Matched",
  },
  {
    label: "Unverified",
    value: "Unverified",
  },
  {
    label: "LAFlex - Low Income",
    value: "LAFlex - Low Income",
  },
  {
    label: "DWP(Child Benefit)",
    value: "DWP(Child Benefit)",
  },
  {
    label: "LAFlex - Health Route",
    value: "LAFlex - Health Route",
  },
  {
    label: "No Records",
    value: "No Records",
  },
  {
    label: "CouncilTaxBands",
    value: "CouncilTaxBands",
  },
  {
    label: "Route 2",
    value: "Route 2",
  },
  {
    label: "Route 4",
    value: "Route 4",
  },
];

export const LandRegistrationCheckOptions = [
  {
    label: "Passed - Land Reg",
    value: "Passed - Land Reg",
  },
  {
    label: "Passed - Manual Docs",
    value: "Passed - Manual Docs",
  },
  {
    label: "Failed",
    value: "Failed",
  },
];

export const LeadInspectionOptions = [
  {
    label: "BAB - Post",
    value: "BAB - Post",
  },
  {
    label: "BAB - Pre, Mid, Post",
    value: "BAB - Pre, Mid, Post",
  },
  {
    label: "BAB - Pre, Post",
    value: "BAB - Pre, Post",
  },
  {
    label: "Gas Safe",
    value: "Gas Safe",
  },
  {
    label: "Tech Monitor",
    value: "Tech Monitor",
  },
  {
    label: "Funder",
    value: "Funder",
  },
];

export const LeadCIInstallStatusOptions = [
  {
    label: "Started",
    value: "Started",
    color: "#008000",
  },
  {
    label: "Completed",
    value: "Completed",
    color: "#FF0000",
  },
  {
    label: "Issues",
    value: "Issues",
    color: "#FFA500",
  },
  {
    label: "N/A",
    value: "N/A",
    color: "#808080",
  },
  {
    label: "Inspection",
    value: "Inspection",
    color: "#0000FF",
  },
];

export const LeadLIStatusOptions = [
  {
    label: "Started",
    value: "Started",
    color: "#008000",
  },
  {
    label: "Completed",
    value: "Completed",
    color: "#FF0000",
  },
  {
    label: "Issues",
    value: "Issues",
    color: "#FFA500",
  },
  {
    label: "Inspection",
    value: "Inspection",
    color: "#0000FF",
  },
  {
    label: "N/A",
    value: "N/A",
    color: "#808080",
  },
];

export const LeadUFIInstallStatusOptions = [
  {
    label: "Started",
    value: "Started",
    color: "#008000",
  },
  {
    label: "Completed",
    value: "Completed",
    color: "#FF0000",
  },
  {
    label: "Issues",
    value: "Issues",
    color: "#FFA500",
  },
  {
    label: "N/A",
    value: "N/A",
    color: "#808080",
  },
  {
    label: "Inspection",
    value: "Inspection",
    color: "#0000FF",
  },
];

export const LeadFTCHStatusOptions = [
  {
    label: "Started",
    value: "Started",
    color: "#008000",
  },
  {
    label: "Completed",
    value: "Completed",
    color: "#FF0000",
  },
  {
    label: "Issues",
    value: "Issues",
    color: "#FFA500",
  },
  {
    label: "N/A",
    value: "N/A",
    color: "#808080",
  },
  {
    label: "Choice 5",
    value: "Choice 5",
    color: "#800080",
  },
];

export const LeadBOUpgradeOptions = [
  {
    label: "Started",
    value: "Started",
    color: "#008000",
  },
  {
    label: "Completed",
    value: "Completed",
    color: "#FF0000",
  },
  {
    label: "Issues",
    value: "Issues",
    color: "#FFA500",
  },
  {
    label: "N/A",
    value: "N/A",
    color: "#808080",
  },
  {
    label: "Choice 5",
    value: "Choice 5",
    color: "#800080",
  },
];

export const LeadHCInstallStatusOptions = [
  {
    label: "Started",
    value: "Started",
    color: "#008000",
  },
  {
    label: "Completed",
    value: "Completed",
    color: "#FF0000",
  },
  {
    label: "Issues",
    value: "Issues",
    color: "#FFA500",
  },
  {
    label: "N/A",
    value: "N/A",
    color: "#808080",
  },
  {
    label: "Choice 5",
    value: "Choice 5",
    color: "#800080",
  },
];

export const LeadIWIInstallStatusOptions = [
  {
    label: "Started",
    value: "Started",
    color: "#008000",
  },
  {
    label: "Completed",
    value: "Completed",
    color: "#FF0000",
  },
  {
    label: "Issues",
    value: "Issues",
    color: "#FFA500",
  },
  {
    label: "N/A",
    value: "N/A",
    color: "#808080",
  },
];

export const leadDropdownColors = {
  Started: "#008000",
  Completed: "#FF0000",
  Issues: "#FFA500",
  "N/A": "#808080",
  "Choice 5": "#800080",
  Inspection: "#0000FF",
};

export const LeadSubmissionStatusOptions = [
  {
    label: "S1 - Prep",
    value: "S1 - Prep",
  },
  {
    label: "S1 - TrustMark",
    value: "S1 - TrustMark",
  },
  {
    label: "S1 - Submitted",
    value: "S1 - Submitted",
  },
  {
    label: "S1 - Paid",
    value: "S1 - Paid",
  },
];

export const LeadSubSubmissionCompleteBy = [
  {
    label: "Kiran",
    value: "Kiran",
  },
  {
    label: "Sapna",
    value: "Sapna",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const LeadSubSubmissionHandoverMonthOptions = [
  {
    label: "Jan",
    value: "Jan",
  },
  {
    label: "Feb",
    value: "Feb",
  },
  {
    label: "Mar",
    value: "Mar",
  },
  {
    label: "Apr",
    value: "Apr",
  },
  {
    label: "May",
    value: "May",
  },
  {
    label: "Jun",
    value: "Jun",
  },
  {
    label: "Jul",
    value: "Jul",
  },
  {
    label: "Aug",
    value: "Aug",
  },
  {
    label: "Sep",
    value: "Sep",
  },
  {
    label: "Oct",
    value: "Oct",
  },
  {
    label: "Nov",
    value: "Nov",
  },
  {
    label: "Dec",
    value: "Dec",
  },
];

export const LeadFunderOptions = [
  {
    label: "Effective Energy",
    value: "Effective Energy",
  },
  {
    label: "Yes",
    value: "Yes",
  },
  {
    label: "Insta",
    value: "Insta",
  },
  {
    label: "Unyte Energy",
    value: "Unyte Energy",
  },
  {
    label: "Agility Eco",
    value: "Agility Eco",
  },
  {
    label: "Network Energy",
    value: "Network Energy",
  },
];

export const RecordTypes = [
  {
    label: "Policies and Procedure",
    value: "Policies and Procedure",
  },
  {
    label: "Management Records",
    value: "Management Records",
  },
  {
    label: "Staff Records",
    value: "Staff Records",
  },
];

export const LeadRCAssignedOptions = [
  {
    label: "Hardial",
    value: "Hardial",
  },
  {
    label: "Shaun Wild",
    value: "Shaun Wild",
  },
  {
    label: "Salman Ahmed",
    value: "Salman Ahmed",
  },
  {
    label: "James McBride",
    value: "James McBride",
  },
];

export const LeadPreEPRRating = [
  {
    label: "High_D",
    value: "High_D",
  },
  {
    label: "Low_D",
    value: "Low_D",
  },
  {
    label: "High_E",
    value: "High_E",
  },
  {
    label: "Low_E",
    value: "Low_E",
  },
  {
    label: "High_F",
    value: "High_F",
  },
  {
    label: "Low_F",
    value: "Low_F",
  },
  {
    label: "High_G",
    value: "High_G",
  },
  {
    label: "Low_G",
    value: "Low_G",
  },
];

export const LeadPostEPRRating = [
  {
    label: "High_A",
    value: "High_A",
  },
  {
    label: "Low_A",
    value: "Low_A",
  },
  {
    label: "High_B",
    value: "High_B",
  },
  {
    label: "Low_B",
    value: "Low_B",
  },
  {
    label: "High_C",
    value: "High_C",
  },
  {
    label: "Low_C",
    value: "Low_C",
  },
  {
    label: "High_D",
    value: "High_D",
  },
  {
    label: "Low_D",
    value: "Low_D",
  },
  {
    label: "Low_D",
    value: "Low_D",
  },
  {
    label: "High_E",
    value: "High_E",
  },
  {
    label: "Low_E",
    value: "Low_E",
  },
  {
    label: "High_F",
    value: "High_F",
  },
  {
    label: "Low_F",
    value: "Low_F",
  },
  {
    label: "High_G",
    value: "High_G",
  },
];

export const LeadSAPOptions = [
  {
    label: "0 - 72 m2",
    value: "less73",
  },
  {
    label: "73 - 97 m2",
    value: "less98",
  },
  {
    label: "98 - 199 m2",
    value: "less200",
  },
  {
    label: "200+ m2",
    value: "more200",
  },
  // {
  //   label: '0 < 73 m2',
  //   value: '0 < 73 m2',
  //   intermediate: [
  //     {
  //       label: 'High_D_High_A',
  //       value: 736
  //     }
  //   ]
  // }
];

export const LeadTotalFloorAreaOptions = {
  less73: {
    High_D_High_A: 736,
    High_D_Low_A: 648,
    High_D_High_B: 526,
    High_D_Low_B: 415,
    High_D_High_C: 277,
    High_D_Low_C: 155,
    High_D_High_D: 0,
    High_D_Low_D: 0,
    High_D_High_E: 0,
    High_D_Low_E: 0,
    High_D_High_F: 0,
    High_D_Low_F: 0,
    High_D_High_G: 0,

    Low_D_High_A: 880,
    Low_D_Low_A: 792,
    Low_D_High_B: 670,
    Low_D_Low_B: 559,
    Low_D_High_C: 421,
    Low_D_Low_C: 299,
    Low_D_High_D: 144,
    Low_D_Low_D: 0,
    Low_D_High_E: 0,
    Low_D_Low_E: 0,
    Low_D_High_F: 0,
    Low_D_Low_F: 0,
    Low_D_High_G: 0,

    High_E_High_A: 1056,
    High_E_Low_A: 968,
    High_E_High_B: 846,
    High_E_Low_B: 735,
    High_E_High_C: 597,
    High_E_Low_C: 475,
    High_E_High_D: 320,
    High_E_Low_D: 176,
    High_E_High_E: 0,
    High_E_Low_E: 0,
    High_E_High_F: 0,
    High_E_Low_F: 0,
    High_E_High_G: 0,

    Low_E_High_A: 1225,
    Low_E_Low_A: 1136,
    Low_E_High_B: 1015,
    Low_E_Low_B: 904,
    Low_E_High_C: 765,
    Low_E_Low_C: 644,
    Low_E_High_D: 489,
    Low_E_Low_D: 345,
    Low_E_High_E: 169,
    Low_E_Low_E: 0,
    Low_E_High_F: 0,
    Low_E_Low_F: 0,
    Low_E_High_G: 0,

    High_F_High_A: 1462,
    High_F_Low_A: 1374,
    High_F_High_B: 1252,
    High_F_Low_B: 1141,
    High_F_High_C: 1003,
    High_F_Low_C: 881,
    High_F_High_D: 726,
    High_F_Low_D: 582,
    High_F_High_E: 406,
    High_F_Low_E: 237,
    High_F_High_F: 0,
    High_F_Low_F: 0,
    High_F_High_G: 0,

    Low_F_High_A: 1727,
    Low_F_Low_A: 1638,
    Low_F_High_B: 1516,
    Low_F_Low_B: 1405,
    Low_F_High_C: 1267,
    Low_F_Low_C: 1145,
    Low_F_High_D: 990,
    Low_F_Low_D: 846,
    Low_F_High_E: 670,
    Low_F_Low_E: 502,
    Low_F_High_F: 265,
    Low_F_Low_F: 0,
    Low_F_High_G: 0,

    High_G_High_A: 2098,
    High_G_Low_A: 2009,
    High_G_High_B: 1887,
    High_G_Low_B: 1777,
    High_G_High_C: 1638,
    High_G_Low_C: 1516,
    High_G_High_D: 1361,
    High_G_Low_D: 1217,
    High_G_High_E: 1042,
    High_G_Low_E: 873,
    High_G_High_F: 636,
    High_G_Low_F: 371,
    High_G_High_G: 0,

    Low_G_High_A: 2522,
    Low_G_Low_A: 2434,
    Low_G_High_B: 2312,
    Low_G_Low_B: 2201,
    Low_G_High_C: 2063,
    Low_G_Low_C: 1941,
    Low_G_High_D: 1786,
    Low_G_Low_D: 1642,
    Low_G_High_E: 1466,
    Low_G_Low_E: 1297,
    Low_G_High_F: 1060,
    Low_G_Low_F: 796,
    Low_G_High_G: 425,
  },
  less98: {
    High_D_High_A: 803,
    High_D_Low_A: 706,
    High_D_High_B: 573,
    High_D_Low_B: 453,
    High_D_High_C: 302,
    High_D_Low_C: 169,
    High_D_High_D: 0,
    High_D_Low_D: 0,
    High_D_High_E: 0,
    High_D_Low_E: 0,
    High_D_High_F: 0,
    High_D_Low_F: 0,
    High_D_High_G: 0,

    Low_D_High_A: 960,
    Low_D_Low_A: 863,
    Low_D_High_B: 730,
    Low_D_Low_B: 610,
    Low_D_High_C: 459,
    Low_D_Low_C: 326,
    Low_D_High_D: 157,
    Low_D_Low_D: 0,
    Low_D_High_E: 0,
    Low_D_Low_E: 0,
    Low_D_High_F: 0,
    Low_D_Low_F: 0,
    Low_D_High_G: 0,

    High_E_High_A: 1151,
    High_E_Low_A: 1055,
    High_E_High_B: 922,
    High_E_Low_B: 801,
    High_E_High_C: 650,
    High_E_Low_C: 518,
    High_E_High_D: 349,
    High_E_Low_D: 192,
    High_E_High_E: 0,
    High_E_Low_E: 0,
    High_E_High_F: 0,
    High_E_Low_F: 0,
    High_E_High_G: 0,

    Low_E_High_A: 1335,
    Low_E_Low_A: 1239,
    Low_E_High_B: 1106,
    Low_E_Low_B: 985,
    Low_E_High_C: 834,
    Low_E_Low_C: 702,
    Low_E_High_D: 533,
    Low_E_Low_D: 376,
    Low_E_High_E: 184,
    Low_E_Low_E: 0,
    Low_E_High_F: 0,
    Low_E_Low_F: 0,
    Low_E_High_G: 0,

    High_F_High_A: 1594,
    High_F_Low_A: 1497,
    High_F_High_B: 1364,
    High_F_Low_B: 1244,
    High_F_High_C: 1093,
    High_F_Low_C: 960,
    High_F_High_D: 791,
    High_F_Low_D: 634,
    High_F_High_E: 442,
    High_F_Low_E: 258,
    High_F_High_F: 0,
    High_F_Low_F: 0,
    High_F_High_G: 0,

    Low_F_High_A: 1882,
    Low_F_Low_A: 1785,
    Low_F_High_B: 1653,
    Low_F_Low_B: 1532,
    Low_F_High_C: 1381,
    Low_F_Low_C: 1248,
    Low_F_High_D: 1079,
    Low_F_Low_D: 922,
    Low_F_High_E: 731,
    Low_F_Low_E: 547,
    Low_F_High_F: 288,
    Low_F_Low_F: 0,
    Low_F_High_G: 0,

    High_G_High_A: 2286,
    High_G_Low_A: 2190,
    High_G_High_B: 2057,
    High_G_Low_B: 1936,
    High_G_High_C: 1786,
    High_G_Low_C: 1653,
    High_G_High_D: 1484,
    High_G_Low_D: 1327,
    High_G_High_E: 1135,
    High_G_Low_E: 951,
    High_G_High_F: 693,
    High_G_Low_F: 405,
    High_G_High_G: 0,

    Low_G_High_A: 2749,
    Low_G_Low_A: 2653,
    Low_G_High_B: 2520,
    Low_G_Low_B: 2399,
    Low_G_High_C: 2248,
    Low_G_Low_C: 2115,
    Low_G_High_D: 1946,
    Low_G_Low_D: 1789,
    Low_G_High_E: 1598,
    Low_G_Low_E: 1414,
    Low_G_High_F: 1155,
    Low_G_Low_F: 867,
    Low_G_High_G: 463,
  },
  less200: {
    High_D_High_A: 933,
    High_D_Low_A: 821,
    High_D_High_B: 667,
    High_D_Low_B: 526,
    High_D_High_C: 351,
    High_D_Low_C: 196,
    High_D_High_D: 0,
    High_D_Low_D: 0,
    High_D_High_E: 0,
    High_D_Low_E: 0,
    High_D_High_F: 0,
    High_D_Low_F: 0,
    High_D_High_G: 0,

    Low_D_High_A: 1115,
    Low_D_Low_A: 1003,
    Low_D_High_B: 849,
    Low_D_Low_B: 709,
    Low_D_High_C: 533,
    Low_D_Low_C: 379,
    Low_D_High_D: 182,
    Low_D_Low_D: 0,
    Low_D_High_E: 0,
    Low_D_Low_E: 0,
    Low_D_High_F: 0,
    Low_D_Low_F: 0,
    Low_D_High_G: 0,

    High_E_High_A: 1338,
    High_E_Low_A: 1226,
    High_E_High_B: 1072,
    High_E_Low_B: 931,
    High_E_High_C: 756,
    High_E_Low_C: 602,
    High_E_High_D: 405,
    High_E_Low_D: 223,
    High_E_High_E: 0,
    High_E_Low_E: 0,
    High_E_High_F: 0,
    High_E_Low_F: 0,
    High_E_High_G: 0,

    Low_E_High_A: 1552,
    Low_E_Low_A: 1440,
    Low_E_High_B: 1285,
    Low_E_Low_B: 1145,
    Low_E_High_C: 970,
    Low_E_Low_C: 815,
    Low_E_High_D: 619,
    Low_E_Low_D: 437,
    Low_E_High_E: 214,
    Low_E_Low_E: 0,
    Low_E_High_F: 0,
    Low_E_Low_F: 0,
    Low_E_High_G: 0,

    High_F_High_A: 1852,
    High_F_Low_A: 1740,
    High_F_High_B: 1586,
    High_F_Low_B: 1446,
    High_F_High_C: 1270,
    High_F_Low_C: 1116,
    High_F_High_D: 919,
    High_F_Low_D: 737,
    High_F_High_E: 514,
    High_F_Low_E: 300,
    High_F_High_F: 0,
    High_F_Low_F: 0,
    High_F_High_G: 0,

    Low_F_High_A: 2188,
    Low_F_Low_A: 2075,
    Low_F_High_B: 1921,
    Low_F_Low_B: 1781,
    Low_F_High_C: 1605,
    Low_F_Low_C: 1451,
    Low_F_High_D: 1254,
    Low_F_Low_D: 1072,
    Low_F_High_E: 849,
    Low_F_Low_E: 636,
    Low_F_High_F: 335,
    Low_F_Low_F: 0,
    Low_F_High_G: 0,

    High_G_High_A: 2658,
    High_G_Low_A: 2546,
    High_G_High_B: 2391,
    High_G_Low_B: 2251,
    High_G_High_C: 2076,
    High_G_Low_C: 1921,
    High_G_High_D: 1725,
    High_G_Low_D: 1542,
    High_G_High_E: 1320,
    High_G_Low_E: 1106,
    High_G_High_F: 805,
    High_G_Low_F: 470,
    High_G_High_G: 0,

    Low_G_High_A: 3196,
    Low_G_Low_A: 3083,
    Low_G_High_B: 2929,
    Low_G_Low_B: 2789,
    Low_G_High_C: 2613,
    Low_G_Low_C: 2459,
    Low_G_High_D: 2263,
    Low_G_Low_D: 2080,
    Low_G_High_E: 1858,
    Low_G_Low_E: 1644,
    Low_G_High_F: 1343,
    Low_G_Low_F: 1008,
    Low_G_High_G: 538,
  },
  more200: {
    High_D_High_A: 1663,
    High_D_Low_A: 1463,
    High_D_High_B: 1188,
    High_D_Low_B: 938,
    High_D_High_C: 625,
    High_D_Low_C: 350,
    High_D_High_D: 0,
    High_D_Low_D: 0,
    High_D_High_E: 0,
    High_D_Low_E: 0,
    High_D_High_F: 0,
    High_D_Low_F: 0,
    High_D_High_G: 0,

    Low_D_High_A: 1988,
    Low_D_Low_A: 1788,
    Low_D_High_B: 1513,
    Low_D_Low_B: 1263,
    Low_D_High_C: 950,
    Low_D_Low_C: 675,
    Low_D_High_D: 325,
    Low_D_Low_D: 0,
    Low_D_High_E: 0,
    Low_D_Low_E: 0,
    Low_D_High_F: 0,
    Low_D_Low_F: 0,
    Low_D_High_G: 0,

    High_E_High_A: 2385,
    High_E_Low_A: 2185,
    High_E_High_B: 1910,
    High_E_Low_B: 1660,
    High_E_High_C: 1347,
    High_E_Low_C: 1072,
    High_E_High_D: 722,
    High_E_Low_D: 397,
    High_E_High_E: 0,
    High_E_Low_E: 0,
    High_E_High_F: 0,
    High_E_Low_F: 0,
    High_E_High_G: 0,

    Low_E_High_A: 2766,
    Low_E_Low_A: 2566,
    Low_E_High_B: 2291,
    Low_E_Low_B: 2041,
    Low_E_High_C: 1728,
    Low_E_Low_C: 1453,
    Low_E_High_D: 1103,
    Low_E_Low_D: 778,
    Low_E_High_E: 381,
    Low_E_Low_E: 0,
    Low_E_High_F: 0,
    Low_E_Low_F: 0,
    Low_E_High_G: 0,

    High_F_High_A: 3302,
    High_F_Low_A: 3102,
    High_F_High_B: 2826,
    High_F_Low_B: 2576,
    High_F_High_C: 2264,
    High_F_Low_C: 1989,
    High_F_High_D: 1639,
    High_F_Low_D: 1314,
    High_F_High_E: 917,
    High_F_Low_E: 535,
    High_F_High_F: 0,
    High_F_Low_F: 0,
    High_F_High_G: 0,

    Low_F_High_A: 3899,
    Low_F_Low_A: 3699,
    Low_F_High_B: 3424,
    Low_F_Low_B: 3174,
    Low_F_High_C: 2861,
    Low_F_Low_C: 2585,
    Low_F_High_D: 2236,
    Low_F_Low_D: 1911,
    Low_F_High_E: 1514,
    Low_F_Low_E: 1133,
    Low_F_High_F: 597,
    Low_F_Low_F: 0,
    Low_F_High_G: 0,

    High_G_High_A: 4737,
    High_G_Low_A: 4537,
    High_G_High_B: 4262,
    High_G_Low_B: 4012,
    High_G_High_C: 3699,
    High_G_Low_C: 3424,
    High_G_High_D: 3074,
    High_G_Low_D: 2749,
    High_G_High_E: 2352,
    High_G_Low_E: 1971,
    High_G_High_F: 1435,
    High_G_Low_F: 838,
    High_G_High_G: 0,

    Low_G_High_A: 5695,
    Low_G_Low_A: 5495,
    Low_G_High_B: 5220,
    Low_G_Low_B: 4970,
    Low_G_High_C: 4658,
    Low_G_Low_C: 4383,
    Low_G_High_D: 4032,
    Low_G_Low_D: 3707,
    Low_G_High_E: 3311,
    Low_G_Low_E: 2929,
    Low_G_High_F: 2394,
    Low_G_Low_F: 1797,
    Low_G_High_G: 959,
  },
};

export const RoofSpacesOptions = [
  {
    label: "Main Property",
    value: "Main Property",
  },
  {
    label: "Extension 1",
    value: "Extension 1",
  },
  {
    label: "Extension 2",
    value: "Extension 2",
  },
  {
    label: "Extension 3",
    value: "Extension 3",
  },
];

export const WallAreasOptions = [
  {
    label: "Main Property",
    value: "Main Property",
  },
  {
    label: "Extension 1",
    value: "Extension 1",
  },
  {
    label: "Extension 2",
    value: "Extension 2",
  },
  {
    label: "Extension 3",
    value: "Extension 3",
  },
];

export const HeatingOptions = [
  {
    label: "Programmer",
    value: "Programmer",
  },
  {
    label: "Room Thermostat",
    value: "Room Thermostat",
  },
  {
    label: "Radiator 1",
    value: "Radiator 1",
  },
  {
    label: "Radiator 2",
    value: "Radiator 2",
  },
  {
    label: "Radiator 3",
    value: "Radiator 3",
  },
  {
    label: "Radiator 4",
    value: "Radiator 4",
  },
  {
    label: "Radiator 5",
    value: "Radiator 5",
  },
  {
    label: "Radiator 6",
    value: "Radiator 6",
  },
  {
    label: "Radiator 7",
    value: "Radiator 7",
  },
  {
    label: "Radiator 8",
    value: "Radiator 8",
  },
  {
    label: "Radiator 9",
    value: "Radiator 9",
  },
];

export const TaxOptions = [
  {
    label: "20 VAT",
    value: 20,
  },
  {
    label: "5 VAT",
    value: 5,
  },
  {
    label: "0 VAT",
    value: 0,
  },
];

export const SolarLane = [
  {
    label: "New Paid Solar",
    value: "New Paid Solar",
  },
  {
    label: "Call Back or Missing Info",
    value: "Call Back or Missing Info",
  },
  {
    label: "Lead Contacted",
    value: "Lead Contacted",
  },
  {
    label: "Solar Survey Booked",
    value: "Solar Survey Booked",
  },
  {
    label: "Desktop Survey",
    value: "Desktop Survey",
  },
  {
    label: "Lead Closed",
    value: "Lead Closed",
  },
  {
    label: "Deal Closed",
    value: "Deal Closed",
  },
  {
    label: "Solar Desktop Questionaire Completed",
    value: "Solar Desktop Questionaire Completed",
  },
  {
    label: "Solar Design Requested",
    value: "Solar Design Requested",
  },
  {
    label: "Solar Design Received",
    value: "Solar Design Received",
  },
  {
    label: "Survey Booked For Rep",
    value: "Survey Booked For Rep",
  },
  {
    label: "Redesign Requested",
    value: "Redesign Requested",
  },
  {
    label: "Final Design Sent To Customer",
    value: "Final Design Sent To Customer",
  },
  {
    label: "Final Design Sent To Rep",
    value: "Final Design Sent To Rep",
  },
  {
    label: "Deal Needs Special Pricing",
    value: "Deal Needs Special Pricing",
  },
];

export const EcoLane = [
  {
    label: "New Lead Eco4",
    value: "New Lead Eco4",
  },
  {
    label: "No Ans",
    value: "No Ans",
  },
  {
    label: "Data Match/La Flex Sent",
    value: "Data Match/La Flex Sent",
  },
  {
    label: "Data Match/La Flex Unverified",
    value: "Data Match/La Flex Unverified",
  },
  {
    label: "Data Match Unmatched",
    value: "Data Match Unmatched",
  },
  {
    label: "Data Match Received",
    value: "Data Match Received",
  },
  {
    label: "Data Match/La Flex Confirmed",
    value: "Data Match/La Flex Confirmed",
  },
  {
    label: "RA Survey Booked",
    value: "RA Survey Booked",
  },
  {
    label: "RA Survey Completed",
    value: "RA Survey Completed",
  },
  {
    label: "Tech Survey Booked",
    value: "Tech Survey Booked",
  },
  {
    label: "Need Costings",
    value: "Need Costings",
  },
  {
    label: "Ready for Installation",
    value: "Ready for Installation",
  },
  {
    label: "Pre Install Paperwork Needed",
    value: "Pre Install Paperwork Needed",
  },
  {
    label: "Installer Paper Work Needed",
    value: "Installer Paper Work Needed",
  },
  {
    label: "Installation In Progress",
    value: "Installation In Progress",
  },
  {
    label: "Installation Complete",
    value: "Installation Complete",
  },
  {
    label: "Submission Started",
    value: "Submission Started",
  },
  {
    label: "Submission Completed",
    value: "Submission Completed",
  },
  {
    label: "Funder Query",
    value: "Funder Query",
  },
  {
    label: "Project Paid",
    value: "Project Paid",
  },
  {
    label: "Reject Funding",
    value: "Reject Funding",
  },
  {
    label: "Tele Surveyed",
    value: "Tele Surveyed",
  },
  {
    label: "Paperwork Accepted",
    value: "Paperwork Accepted",
  },
  {
    label: "Plan of Works",
    value: "Plan of Works",
  },
  {
    label: "Installer Signer Off",
    value: "Installer Signer Off",
  },
  {
    label: "Remedial",
    value: "Remedial",
  },
  {
    label: "Job Rejected",
    value: "Job Rejected",
  },
];
