/*

  VERSIÓN 2: PROMESAS ENCADENADAS - npm.cmd run promesas - 
  
  Una Promise representa una operación que terminará en el futuro.

  .then() indica qué hacer cuando la Promise termina correctamente.
  .catch() permite manejar un error de la cadena.

*/

import { baseEvents } from "./datos.js";
import { createContext, waitForPromise, processResults } from "./funciones.js";

const context = createContext();

console.log("=== PROMESAS ENCADENADAS ===");

/*
  La idea es la misma que en callbacks: un evento comienza después
  de terminar el anterior.

  La diferencia es que aquí el orden se ve como una cadena de .then().
*/

waitForPromise(baseEvents[0], context)
  .then(function () {
    return waitForPromise(baseEvents[1], context);
  })
  .then(function () {
    return waitForPromise(baseEvents[2], context);
  })
  .then(function () {
    return waitForPromise(baseEvents[3], context);
  })
  .then(function () {
    return waitForPromise(baseEvents[4], context);
  })
  .then(function () {
    return waitForPromise(baseEvents[5], context);
  })
  .then(function () {
    return waitForPromise(baseEvents[6], context);
  })
  .then(function () {
    return waitForPromise(baseEvents[7], context);
  })
  .then(function () {
    processResults(context.results);
  })
  .catch(function (error) {
    console.log("Ocurrió un error: " + error.message);
  });