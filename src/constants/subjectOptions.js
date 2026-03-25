export const departmentOptions = [
  { value: 1, label: "Informatika" },
  { value: 2, label: "Mehatronika" },
  { value: 3, label: "Elektrotehnika" },
  { value: 4, label: "Mašinstvo" },
  { value: 5, label: "Inženjerski menadžment" },
];

export const yearOptions = [
  { value: 1, label: "Prva" },
  { value: 2, label: "Druga" },
  { value: 3, label: "Treća" },
  { value: 4, label: "Master 1" },
  { value: 5, label: "Master 2" },
];

export const yearLabelMap = Object.fromEntries(
  yearOptions.map((y) => [y.value, y.label])
);

export const departmentLabelMap = Object.fromEntries(
  departmentOptions.map((d) => [d.value, d.label])
);