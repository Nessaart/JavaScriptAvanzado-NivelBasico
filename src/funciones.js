/*
  FUNCIONES QUE COMPARTEN LAS TRES VERSIONES
  
  Este archivo existe para NO repetir la misma lógica en callbacks,
  promesas y async/await.

  Solo usamos conceptos necesarios para el laboratorio:
  funciones, objetos, arreglos, setTimeout y métodos de arreglos.
*/

import { THRESHOLD } from "./datos.js";

/*
  Esta función crea el objeto donde guardamos la información de una ejecución.

  inicio:
  Guarda la hora en la que empezó el simulador.

  resultados:
  Empieza como un arreglo vacío. Cada vez que ocurre un evento,
  guardaremos un objeto dentro de este arreglo con push().
*/

export function createContext() {
  return {
    startTime: Date.now(),
    results: []
  };
}

/*
  Date.now() devuelve la hora actual en milisegundos.

  Restamos el momento inicial para saber cuántos milisegundos
  han pasado desde que empezó el simulador.
*/

export function getElapsedTime(context) {
  return Date.now() - context.startTime;
}

/*
  registrarEvento()

  Se ejecuta cuando un temporizador realmente logra ejecutar su callback.

  Aquí creamos el objeto-evento que pide el laboratorio con los 4 atributos
  obligatorios exactos.
*/

export function registerEvent(definition, context, scheduledTime) {

  // Momento REAL en que ejecutó el evento.

  const realTime = getElapsedTime(context);

  // Latencia o desviación = tiempo real - tiempo programado.

  const delay = realTime - scheduledTime;

  // Objeto que representa el evento ocurrido (cumpliendo los 4 nombres solicitados).

  const eventObj = {
    id: definition.id,
    type: definition.type,
    scheduledTime: scheduledTime,
    realTime: realTime
  };

  // Guardamos el objeto en la bitácora de resultados.

  context.results.push(eventObj);

  // Usamos concatenación normal de strings para que sea fácil de leer.

  console.log(
    eventObj.id + " | " +
    eventObj.type + " | programado=" +
    eventObj.scheduledTime + " ms | real=" +
    eventObj.realTime + " ms | latencia=" +
    delay + " ms"
  );
}

/*
  esperarConCallback()
  
  Se usa en la versión de callbacks.

  1. Definimos cuándo debería ejecutarse el evento.
  2. setTimeout espera el tiempo programado.
  3. Cuando termina la espera, registramos el evento.
  4. Luego llamamos callback() para continuar.
*/

export function waitForCallback(definition, context, callback) {
  const scheduledTime = definition.wait;

  setTimeout(function () {
    registerEvent(definition, context, scheduledTime);
    if (callback) callback();
  }, definition.wait);
}

/*
  esperarConPromesa()
  
  Hace la misma espera, pero usando una Promise.

  resolve() significa: "la operación terminó correctamente".
  reject() significa: "ocurrió un error".
*/

export function waitForPromise(definition, context) {
  return new Promise(function (resolve, reject) {
    try {
      const scheduledTime = definition.wait;

      setTimeout(function () {
        try {
          registerEvent(definition, context, scheduledTime);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, definition.wait);
    } catch (error) {
      reject(error);
    }
  });
}

/*
  procesarResultados()
 
  Aquí resolvemos el Paso 4 SIN usar un for tradicional.
*/

export function processResults(results) {

  /*
    1. REDUCE
    Queremos convertir todo el arreglo en un solo número:
    la suma de las desviaciones absolutas entre tiempo real y programado.
  */

  const totalDelay = results.reduce(function (accumulator, eventObj) {
    const delay = Math.abs(eventObj.realTime - eventObj.scheduledTime);
    return accumulator + delay;
  }, 0);

  // Promedio = suma de latencias / cantidad de eventos.

  const averageDelay = totalDelay / results.length;

  /*
    2. FILTER
    Crea un nuevo arreglo solamente con los eventos cuya latencia
    supera el umbral que elegimos.
  */

  const deviatedEvents = results.filter(function (eventObj) {
    const delay = Math.abs(eventObj.realTime - eventObj.scheduledTime);
    return delay > THRESHOLD;
  });

  /*
    3. MAP
    Del arreglo anterior ya no necesitamos todo el objeto.
    Solo queremos los identificadores.
  */

  const deviatedIds = deviatedEvents.map(function (eventObj) {
    return eventObj.id;
  });

  /*
    Para detectar el primer evento fuera de orden necesitamos comparar:
    - orden real: el arreglo resultados.
    - orden programado: los mismos eventos ordenados por su tiempo programado.

    slice() crea una copia para no modificar el arreglo original.
  */

  const scheduledOrder = results.slice();

  scheduledOrder.sort(function (a, b) {
    return a.scheduledTime - b.scheduledTime;
  });

  /*
    4. FIND
    Busca el PRIMER evento cuyo id no coincide con el evento que
    debería estar en esa misma posición según el tiempo programado.
  */

  const firstOutOfOrder = results.find(function (eventObj, index) {
    return eventObj.id !== scheduledOrder[index].id;
  });

  console.log("\n PROCESAMIENTO FUNCIONAL ");
  console.log("Latencia promedio: " + averageDelay.toFixed(2) + " ms");
  console.log("Eventos con latencia mayor a " + THRESHOLD + " ms: " + (deviatedIds.join(", ") || "Ninguno"));

  if (firstOutOfOrder) {
    console.log("Primer evento fuera de orden: " + firstOutOfOrder.id);
  } else {
    console.log("Primer evento fuera de orden: ninguno");
  }

  // Devolvemos los resultados por si luego queremos usarlos.
  
  return {
    averageDelay: averageDelay,
    deviatedIds: deviatedIds,
    firstOutOfOrder: firstOutOfOrder
  };
}