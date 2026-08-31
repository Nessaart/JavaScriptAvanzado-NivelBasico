/*
  DATOS DEL LABORATORIO

  Aquí están los 8 eventos que usaremos en las tres versiones.

  Cada evento tiene:
  - id: nombre del evento.
  - tipo: categoría inventada.
  - espera: cuántos milisegundos debe esperar.

  Los tiempos son diferentes porque el PDF pide 8 avisos con
  tiempos de espera distintos.
*/

export const baseEvents = [
  { id: "EV-01", type: "aviso corto", wait: 100 },
  { id: "EV-02", type: "aviso medio", wait: 130 },
  { id: "EV-03", type: "aviso corto", wait: 80 },
  { id: "EV-04", type: "aviso largo", wait: 160 },
  { id: "EV-05", type: "aviso corto", wait: 60 },
  { id: "EV-06", type: "aviso medio", wait: 110 },
  { id: "EV-07", type: "aviso corto", wait: 90 },
  { id: "EV-08", type: "aviso largo", wait: 140 }
];

// Umbral elegido por nosotros para el Paso 4.
// Si la latencia supera 5 ms, consideramos que hubo una desviación notable.

export const THRESHOLD = 5;

/*
  Función para asegurar que cada objeto generado en la bitácora
  tenga estrictamente los 4 datos mínimos solicitados en la guía.
*/
export function createEventObject(id, type, scheduledTime, realTime) {
  return {
    id: id,
    type: type,
    scheduledTime: scheduledTime,
    realTime: realTime
  };
}