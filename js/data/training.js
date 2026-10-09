/**
 * Material educativo y ejercicios de repaso para el Centro de Entrenamiento
 */

export const TRAINING_TOPICS = [
  {
    id: "topic_algorithms",
    title: "1. ¿Qué es un Algoritmo?",
    badgeName: "Secuencias Lógicas",
    summary: "Una serie finita, ordenada e inequívoca de instrucciones destinadas a resolver un problema específico o completar una tarea.",
    keyPoints: [
      "Finitud: Todo algoritmo debe tener un inicio y un fin definido.",
      "Determinismo: Si se le proporcionan las mismas entradas, siempre produce idéntico resultado.",
      "Orden estricto: Las computadoras no infieren intenciones; ejecutan exactamente en el orden indicado."
    ],
    quickQuiz: {
      question: "¿Por qué una computadora no puede 'adivinar' un paso que falta en una receta de código?",
      options: [
        { text: "Porque solo procesa instrucciones precisas y no posee intuición humana.", isCorrect: true },
        { text: "Porque se queda sin batería si intenta adivinar.", isCorrect: false },
        { text: "Porque todas las computadoras tienen errores de fábrica.", isCorrect: false }
      ],
      feedback: "Exacto: el hardware solo ejecuta instrucciones binarias y lógicas explícitas. El orden y la precisión dependen del programador."
    }
  },
  {
    id: "topic_decomposition",
    title: "2. Descomposición de Problemas",
    badgeName: "Estrategia Dividir y Vencerás",
    summary: "Habilidad de dividir un desafío grande o confuso en partes más pequeñas, manejables y comprobables por separado.",
    keyPoints: [
      "Reducción de complejidad: Resolver cuatro pasos sencillos es más fácil que abordar un reto gigante de golpe.",
      "Reutilización: Las soluciones a problemas pequeños pueden combinarse para resolver otros mayores.",
      "Localización de fallos: Si algo falla, es rápido aislar en qué subparte ocurrió el error."
    ],
    quickQuiz: {
      question: "Para programar un robot que limpie una habitación, ¿cuál es un ejemplo de descomposición correcta?",
      options: [
        { text: "Separar la tarea en: 1) Explorar paredes, 2) Trazar cuadrícula, 3) Aspirar por filas, 4) Regresar a base.", isCorrect: true },
        { text: "Escribir una sola orden mágica llamada 'limpiar_todo_ya()'.", isCorrect: false },
        { text: "Comprar un robot más caro.", isCorrect: false }
      ],
      feedback: "¡Correcto! Descomponer en fases lógicas permite diseñar algoritmos modulares y robustos."
    }
  },
  {
    id: "topic_conditionals",
    title: "3. Estructuras Condicionales",
    badgeName: "Lógica SI / ENTONCES",
    summary: "Bifurcaciones de control que permiten a un programa tomar caminos distintos según se cumpla o no una condición lógica (booleana).",
    keyPoints: [
      "SI (condición): Evalúa si una expresión es VERDADERA (true) o FALSA (false).",
      "SINO (else): Camino alternativo cuando la condición primaria no se cumple.",
      "Operadores lógicos: Y (AND - ambas obligatorias), O (OR - basta con una), NO (NOT - invierte el valor)."
    ],
    quickQuiz: {
      question: "Si `temperatura = 20` y evaluamos `SI (temperatura > 30) ENTONCES encender_aire() SINO abrigarse()`, ¿qué sucede?",
      options: [
        { text: "Se ejecuta `abrigarse()` porque 20 no es mayor que 30.", isCorrect: true },
        { text: "Se enciende el aire acondicionado.", isCorrect: false },
        { text: "El sistema produce un cortocircuito.", isCorrect: false }
      ],
      feedback: "¡Exacto! Al ser la condición falsa (20 no es mayor que 30), el flujo pasa de inmediato al bloque alternativo SINO."
    }
  },
  {
    id: "topic_loops",
    title: "4. Bucles y Reconocimiento de Patrones",
    badgeName: "Estructuras Repetitivas",
    summary: "Permiten repetir un conjunto de instrucciones de manera controlada sin necesidad de reescribir código una y otra vez.",
    keyPoints: [
      "Bucle definido (REPETIR N VECES / FOR): Se conoce de antemano el número exacto de iteraciones.",
      "Bucle condicional (MIENTRAS / WHILE): Se repite mientras una condición lógica siga siendo verdadera.",
      "Riesgo de Bucle Infinito: Ocurre si la condición de parada nunca llega a volverse falsa."
    ],
    quickQuiz: {
      question: "¿Cuál es la principal ventaja de utilizar un bucle frente a copiar y pegar 50 veces la misma línea?",
      options: [
        { text: "Hace el código más conciso, fácil de mantener y previene errores tipográficos.", isCorrect: true },
        { text: "Obliga a la pantalla a parpadear más rápido.", isCorrect: false },
        { text: "Ocupa más memoria en el disco duro.", isCorrect: false }
      ],
      feedback: "Muy bien. Un bucle modulariza la intención y permite modificar el comportamiento cambiando un solo valor o condición."
    }
  },
  {
    id: "topic_debugging",
    title: "5. Técnicas de Depuración (Debugging)",
    badgeName: "Caza de Bugs",
    summary: "El proceso metódico de identificar, aislar y corregir errores que impiden el funcionamiento esperado de un programa.",
    keyPoints: [
      "Error sintáctico: La computadora no entiende la estructura de la orden (falta un paréntesis, palabra mal escrita).",
      "Error lógico / semántico: El programa corre sin caerse, pero produce un resultado equivocado o inesperado.",
      "Prueba de escritorio / Trazado manual: Simular paso a paso en papel o consola el valor de las variables.",
      "Error Off-by-one: Desfase común al iterar una vez de más o de menos en los límites de un bucle."
    ],
    quickQuiz: {
      question: "Si tu programa compila bien pero muestra que 2 + 2 = 5, ¿qué tipo de error es?",
      options: [
        { text: "Un error lógico (el algoritmo o fórmula contiene un fallo conceptual).", isCorrect: true },
        { text: "Un error de conexión a internet.", isCorrect: false },
        { text: "Un error de sintaxis que impide la ejecución.", isCorrect: false }
      ],
      feedback: "¡Correcto! La computadora obedeció una instrucción matemáticamente equivocada creada por el programador."
    }
  }
];
