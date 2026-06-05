// Helpers de rangos de fechas por periodo

export function rangoMensual(anio: number, mes: number) {
  return {
    inicio: new Date(anio, mes - 1, 1),
    fin: new Date(anio, mes, 0, 23, 59, 59, 999),
  };
}

export function rangoTrimestral(anio: number, trimestre: number) {
  const mesInicio = (trimestre - 1) * 3;
  return {
    inicio: new Date(anio, mesInicio, 1),
    fin: new Date(anio, mesInicio + 3, 0, 23, 59, 59, 999),
  };
}

export const MESES_OPCIONES = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

export const TRIMESTRES_OPCIONES = [
  { value: "1", label: "Q1 (Ene - Mar)" },
  { value: "2", label: "Q2 (Abr - Jun)" },
  { value: "3", label: "Q3 (Jul - Sep)" },
  { value: "4", label: "Q4 (Oct - Dic)" },
];
