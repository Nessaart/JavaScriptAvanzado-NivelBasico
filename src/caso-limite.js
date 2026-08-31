/*

  CASO LÍMITE PROPIO - npm.cmd run limite - 

  IDEA:
  Se registran varios temporizadores y después vamos a bloquear
  voluntariamente la pila de ejecución durante aproximadamente 120 ms.

  También creamos una microtarea con Promise.resolve().then().

  ¿QUÉ QUEREMOS DEMOSTRAR?
  Aunque los timers ya hayan terminado su tiempo de espera, NO pueden
  ejecutar sus callbacks mientras la pila de ejecución siga ocupada.

  Cuando la pila finalmente queda libre:
  1. primero se procesa la microtarea pendiente;
  2. después pueden ejecutarse los callbacks de los timers.

  Este caso sirve para observar call stack, microtareas y macrotareas
  sin usar un ejemplo de timestamp idéntico, una excepción en .then()
  ni una Promise que nunca resuelve.
  
*/

import { processResults } from "./funciones.js";

// Creamos eventos especiales para este caso.

const limitEvents = [
  { id: "CL-01", type: "timer", wait: 20 },
  { id: "CL-02", type: "timer", wait: 40 },
  { id: "CL-03", type: "timer", wait: 60 },
  { id: "CL-04", type: "timer", wait: 80 }
];

const startTime = Date.now();
const results = [];

console.log("=== CASO LÍMITE: PILA BLOQUEADA ===");

/*
  Esta función ocupa la pila de ejecución durante el tiempo indicado.

  El while se usa A PROPÓSITO: necesitamos impedir que JavaScript
  pueda atender otras tareas durante unos milisegundos.
*/

function blockStack(milliseconds) {
  const startBlock = Date.now();

  while (Date.now() - startBlock < milliseconds) {
    // No hacemos nada. Solo mantenemos ocupada la pila.
  }
}

/*
  Registramos los cuatro timers.
  forEach se usa para recorrer el arreglo; NO es el procesamiento
  funcional solicitado en el Paso 4.
*/

limitEvents.forEach(function (definition) {
  const scheduledTime = definition.wait;

  setTimeout(function () {
    const realTime = Date.now() - startTime;

    // Objeto con la estructura estricta exigida
    const eventObj = {
      id: definition.id,
      type: definition.type,
      scheduledTime: scheduledTime,
      realTime: realTime
    };

    results.push(eventObj);

    const delay = realTime - scheduledTime;

    console.log(
      eventObj.id + " | programado=" +
      eventObj.scheduledTime + " ms | real=" +
      eventObj.realTime + " ms | latencia=" +
      delay + " ms"
    );

    // Cuando ya se guardaron los 4 timers, procesamos el arreglo.

    if (results.length === limitEvents.length) {
      processResults(results);
    }
  }, definition.wait);
});

/*
  Creamos una microtarea.
  Su mensaje NO aparece inmediatamente porque todavía estamos
  ejecutando el código principal.
*/

Promise.resolve().then(function () {
  console.log("\nMICROTAREA: se ejecutó antes de los timers pendientes.");
});

console.log("La pila se bloqueará durante 120 ms...");

// Mientras esta función se ejecuta, los timers no pueden ejecutar sus callbacks.

blockStack(120);

console.log("La pila quedó libre.");

/*
  PREDICCIÓN DEL CASO:

  1. Se registran los timers en Web APIs / Node.
  2. Se registra la microtarea en la cola de microtareas.
  3. blockStack() ocupa el Call Stack por 120 ms.
  4. Durante ese tiempo vencen los cuatro timers y se mueven a la cola de macrotareas.
  5. Al quedar libre el Call Stack, el Event Loop atiende PRIMERO la cola de microtareas.
  6. Después se ejecutan las macrotareas (los callbacks de los timers).
  7. Las latencias serán elevadas (> 100 ms) ya que todos los callbacks sufrieron 
     el retraso impuesto por el bloqueo del Call Stack.
*/