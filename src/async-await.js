/*
  
  VERSIÓN 3: ASYNC / AWAIT - npm.cmd run async - 

  async permite crear una función asincrónica.
  await espera a que una Promise termine antes de continuar
  con la siguiente línea de ESTA función.

  No bloquea todo JavaScript; solo pausa esta función async.

*/

import { baseEvents } from "./datos.js";
import { createContext, waitForPromise, processResults } from "./funciones.js";

const context = createContext();

console.log("=== ASYNC / AWAIT ===");

async function execute() {
  try {
    // Se lee de arriba hacia abajo.
    await waitForPromise(baseEvents[0], context);
    await waitForPromise(baseEvents[1], context);
    await waitForPromise(baseEvents[2], context);
    await waitForPromise(baseEvents[3], context);
    await waitForPromise(baseEvents[4], context);
    await waitForPromise(baseEvents[5], context);
    await waitForPromise(baseEvents[6], context);
    await waitForPromise(baseEvents[7], context);

    // Cuando terminaron los ocho eventos, procesa el arreglo.

    processResults(context.results);
  } catch (error) {

    // try/catch permite manejar los errores.

    console.log("Ocurrió un error: " + error.message);
  }
}

// Llamamos la función para iniciar el programa.

execute(); 
