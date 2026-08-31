/*
 
  CALLBACKS ANIDADOS - npm.cmd run callbacks -

  Un callback es una función que se pasa a otra función para que
  sea llamada cuando termine una tarea.

  Aquí cada evento empieza después de terminar el anterior.
*/

import { baseEvents } from "./datos.js";
import { createContext, waitForCallback, processResults } from "./funciones.js";

const context = createContext();

console.log("=== CALLBACKS ANIDADOS ===");

/*
  Como el laboratorio pide callbacks ANIDADOS, ponemos cada llamada
  dentro del callback de la anterior.
*/
waitForCallback(baseEvents[0], context, function () {
  waitForCallback(baseEvents[1], context, function () {
    waitForCallback(baseEvents[2], context, function () {
      waitForCallback(baseEvents[3], context, function () {
        waitForCallback(baseEvents[4], context, function () {
          waitForCallback(baseEvents[5], context, function () {
            waitForCallback(baseEvents[6], context, function () {
              waitForCallback(baseEvents[7], context, function () {
                // Cuando terminó el último evento, analizamos el arreglo.
                processResults(context.results);
              });
            });
          });
        });
      });
    });
  });
});