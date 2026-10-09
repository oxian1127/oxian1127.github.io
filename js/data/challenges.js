/**
 * Banco completo de desafíos interactivos para las 6 Misiones de Código Cero
 */

export const CHALLENGES = {
  // ==========================================
  // MISIÓN 1: REINICIO DEL SISTEMA (Secuencias)
  // ==========================================
  mission_1: [
    {
      id: "m1_c1",
      missionId: "mission_1",
      title: "Desafío 1: Protocolo de Arranque del Generador",
      instruction: "Ordena las instrucciones para que el generador auxiliar inicie de forma segura y sin cortocircuitos.",
      explanation: "Un algoritmo requiere que las precondiciones (verificar corriente y lubricación) se cumplan antes de activar los motores.",
      hint: "Primero debes inspeccionar que no haya sobrecargas antes de permitir la entrada de combustible y chispa.",
      initialOrder: [
        { id: "step_c", text: "Inyectar refrigerante al núcleo" },
        { id: "step_a", text: "Verificar suministro de energía en la red" },
        { id: "step_d", text: "Activar el interruptor de potencia maestro" },
        { id: "step_b", text: "Desbloquear las válvulas de combustible" }
      ],
      correctOrderIds: ["step_a", "step_b", "step_c", "step_d"],
      feedbacks: {
        success: "¡Secuencia perfecta! El generador ha arrancado de forma estable sin fluctuaciones de tensión.",
        error: "El orden no es seguro. Si activas la potencia antes de enfriar o verificar la red, se producirá un cortocircuito."
      }
    },
    {
      id: "m1_c2",
      missionId: "mission_1",
      title: "Desafío 2: Enrutamiento de Energía de Emergencia",
      instruction: "Organiza el algoritmo para redirigir la energía hacia las torres de control del distrito.",
      explanation: "Los sistemas informáticos ejecutan las órdenes en un flujo secuencial estricto de arriba hacia abajo.",
      hint: "Aísla las subestaciones dañadas antes de transferir la carga de alta tensión.",
      initialOrder: [
        { id: "step_e", text: "Confirmar que la tensión en las torres es estable" },
        { id: "step_b", text: "Aislar las líneas con cortocircuito" },
        { id: "step_d", text: "Cerrar los relés hacia las torres de control" },
        { id: "step_a", text: "Escanear la red en busca de líneas dañadas" },
        { id: "step_c", text: "Abrir el conmutador de la subestación principal" }
      ],
      correctOrderIds: ["step_a", "step_b", "step_c", "step_d", "step_e"],
      feedbacks: {
        success: "¡Enrutamiento exitoso! Las torres de control reciben energía limpia y estable.",
        error: "Cuidado: intentaste transferir energía a líneas no aisladas o sin haber escaneado los daños."
      }
    },
    {
      id: "m1_c3",
      missionId: "mission_1",
      title: "Desafío 3: Calibración del Reloj del Sistema",
      instruction: "La sincronización temporal de la planta está desfasada. Ordena el algoritmo de sincronización.",
      explanation: "La sincronía algorítmica exige tomar la referencia externa antes de ajustar los osciladores internos.",
      hint: "Conecta con el satélite antes de sincronizar el oscilador local y emitir la señal horaria.",
      initialOrder: [
        { id: "step_d", text: "Bloquear la configuración del reloj maestro" },
        { id: "step_b", text: "Obtener la marca de tiempo del satélite atómico" },
        { id: "step_e", text: "Emitir pulso de sincronización a toda la planta" },
        { id: "step_a", text: "Establecer enlace de radio con el satélite atómico" },
        { id: "step_c", text: "Ajustar el oscilador interno con la diferencia horaria" }
      ],
      correctOrderIds: ["step_a", "step_b", "step_c", "step_d", "step_e"],
      feedbacks: {
        success: "¡Excelente! Los servidores de la planta operan ahora con sincronización atómica precisa.",
        error: "Revisa la secuencia: no puedes obtener la hora de un satélite sin haber establecido el enlace primero."
      }
    }
  ],

  // ==========================================
  // MISIÓN 2: RUTAS INTELIGENTES (Descomposición y Cuadrícula)
  // ==========================================
  mission_2: [
    {
      id: "m2_c1",
      missionId: "mission_2",
      title: "Nivel 1: Ruta Directa al Conector A-1",
      instruction: "Programa el robot de servicio para que llegue a la estación de recarga (⚡). Evita caídas fuera del mapa.",
      gridSize: 4,
      start: { x: 0, y: 3, direction: "N" }, // N = Norte (arriba), E = Este (derecha), S = Sur, W = Oeste
      target: { x: 0, y: 0 },
      obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
      maxCommands: 6,
      hint: "El robot mira hacia el Norte (arriba). Solo necesita avanzar 3 casillas para alcanzar el conector.",
      feedbacks: {
        success: "¡Objetivo alcanzado! El dron se ha acoplado al conector A-1 sin desvíos.",
        error: "El robot no llegó a la meta o colisionó. Verifica el número de avances y los giros."
      }
    },
    {
      id: "m2_c2",
      missionId: "mission_2",
      title: "Nivel 2: Desvío por Campo de Fuerza",
      instruction: "Esquiva los campos de fuerza activos (❌) y conduce al robot hasta la consola de mando (⚡).",
      gridSize: 5,
      start: { x: 0, y: 4, direction: "E" }, // Mira al Este (derecha)
      target: { x: 4, y: 2 },
      obstacles: [
        { x: 2, y: 4 },
        { x: 2, y: 3 },
        { x: 2, y: 2 },
        { x: 1, y: 1 }
      ],
      maxCommands: 10,
      hint: "Avanza una casilla al Este, gira al Norte para rodear el muro de fuerza, avanza, y vuelve a girar al Este.",
      feedbacks: {
        success: "¡Maniobra brillante! Has descompuesto el trayecto en giros y avances seguros evitando el muro.",
        error: "Colisión o trayectoria incompleta. Observa dónde están las barreras rojas antes de avanzar."
      }
    },
    {
      id: "m2_c3",
      missionId: "mission_2",
      title: "Nivel 3: El Laberinto de la Subestación",
      instruction: "Navega por el sector de alta densidad hasta el núcleo de comunicaciones (⚡).",
      gridSize: 5,
      start: { x: 0, y: 0, direction: "S" }, // Mira al Sur (abajo)
      target: { x: 4, y: 4 },
      obstacles: [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 1, y: 4 }
      ],
      maxCommands: 14,
      hint: "Baja una o dos casillas, gira al Este para cruzar el pasillo central y luego baja hacia el cuadrante inferior derecho.",
      feedbacks: {
        success: "¡Misión de navegación cumplida! El autómata ha conectado el enlace del transporte urbano.",
        error: "El robot se ha desorientado o impactó con un obstáculo. Revisa cada giro en tu cabeza antes de ejecutar."
      }
    }
  ],

  // ==========================================
  // MISIÓN 3: EL CENTRO DE DECISIONES (Condicionales)
  // ==========================================
  mission_3: [
    {
      id: "m3_c1",
      missionId: "mission_3",
      title: "Situación 1: Reserva Energética Crítica",
      context: "El sensor de la subestación reporta: `nivel_energia = 18%` y `umbral_minimo = 25%`.",
      codeSnippet: `SI (nivel_energia < umbral_minimo) ENTONCES
    [ Acción A ]
SINO
    [ Acción B ]`,
      options: [
        { id: "opt_1", text: "Activar generador auxiliar de respaldo inmediatamente.", isCorrect: true },
        { id: "opt_2", text: "Apagar los ventiladores para ahorrar electricidad.", isCorrect: false },
        { id: "opt_3", text: "Enviar mensaje de 'Todo funcionando con normalidad'.", isCorrect: false },
        { id: "opt_4", text: "Desactivar las alarmas sonoras y continuar la carga.", isCorrect: false }
      ],
      hint: "Si la energía es inferior al umbral, el sistema debe garantizar la continuidad con una fuente de respaldo.",
      explanation: "Al ser 18% < 25%, la condición es VERDADERA. La rama `ENTONCES` debe activar el soporte de respaldo para no perder el servicio."
    },
    {
      id: "m3_c2",
      missionId: "mission_3",
      title: "Situación 2: Compuerta Blindada de Seguridad",
      context: "Un técnico solicita acceso: `tarjeta_valida = VERDADERO`, pero `alarma_intruso = VERDADERO`.",
      codeSnippet: `SI (tarjeta_valida == VERDADERO Y alarma_intruso == FALSO) ENTONCES
    abrir_compuerta()
SINO
    bloquear_acceso_y_alertar()`,
      options: [
        { id: "opt_1", text: "La compuerta se abrirá porque la tarjeta del técnico es válida.", isCorrect: false },
        { id: "opt_2", text: "Se bloqueará el acceso y se alertará porque hay alarma de intruso activa.", isCorrect: true },
        { id: "opt_3", text: "El sistema ignorará la alarma y preguntará una segunda contraseña.", isCorrect: false },
        { id: "opt_4", text: "Se abrirá la mitad de la compuerta para permitir paso con precaución.", isCorrect: false }
      ],
      hint: "El operador lógico 'Y' (AND) exige que AMBAS condiciones se cumplan simultáneamente.",
      explanation: "Aunque la tarjeta es válida, `alarma_intruso == FALSO` se evalúa como FALSO. Por tanto, toda la condición es FALSA y se ejecuta el bloque `SINO`."
    },
    {
      id: "m3_c3",
      missionId: "mission_3",
      title: "Situación 3: Refrigeración Criogénica de Servidores",
      context: "Temperatura actual de los procesadores: `temperatura = 92°C`.",
      codeSnippet: `SI (temperatura > 85) ENTONCES
    activar_refrigeracion_maxima()
SINO SI (temperatura > 65) ENTONCES
    activar_ventiladores_moderados()
SINO
    modo_ahorro_termico()`,
      options: [
        { id: "opt_1", text: "Se activan los ventiladores moderados.", isCorrect: false },
        { id: "opt_2", text: "Se activa el modo de ahorro térmico.", isCorrect: false },
        { id: "opt_3", text: "Se activa la refrigeración máxima inmediata.", isCorrect: true },
        { id: "opt_4", text: "El procesador se apaga por completo sin aviso.", isCorrect: false }
      ],
      hint: "Compara 92 con la primera condición `temperatura > 85`.",
      explanation: "Como 92 es mayor que 85, la primera condición se cumple (VERDADERO) y se ejecuta `activar_refrigeracion_maxima()`. Las ramas posteriores se ignoran."
    },
    {
      id: "m3_c4",
      missionId: "mission_3",
      title: "Situación 4: Control de Integridad de Paquetes",
      context: "Llega un paquete con `checksum_valido = FALSO` y `reintentos_agotados = FALSO`.",
      codeSnippet: `SI (checksum_valido == VERDADERO) ENTONCES
    procesar_paquete()
SINO SI (reintentos_agotados == VERDADERO) ENTONCES
    descartar_paquete_y_reportar_fallo()
SINO
    solicitar_retransmision()`,
      options: [
        { id: "opt_1", text: "Procesar el paquete corrupto de todos modos.", isCorrect: false },
        { id: "opt_2", text: "Solicitar la retransmisión del paquete a la fuente.", isCorrect: true },
        { id: "opt_3", text: "Descartar el paquete definitivamente y cerrar conexión.", isCorrect: false },
        { id: "opt_4", text: "Reiniciar el servidor central de la ciudad.", isCorrect: false }
      ],
      hint: "El paquete está corrupto, pero los reintentos aún NO se han agotado.",
      explanation: "La primera condición es falsa. La segunda también es falsa (no se han agotado). Por descarte entra en el último `SINO`: solicitar una nueva copia del paquete."
    },
    {
      id: "m3_c5",
      missionId: "mission_3",
      title: "Situación 5: Autenticación de Mando Central",
      context: "El usuario introduce usuario='nexo_admin', clave='1234' (clave incorrecta, la correcta es 'NEXO_ROOT_2026').",
      codeSnippet: `SI (usuario == "nexo_admin" Y clave == "NEXO_ROOT_2026") ENTONCES
    otorgar_privilegios_totales()
SINO
    denegar_acceso_y_registrar_intento()`,
      options: [
        { id: "opt_1", text: "Denegar acceso y registrar el intento en el log de seguridad.", isCorrect: true },
        { id: "opt_2", text: "Otorgar privilegios porque el usuario 'nexo_admin' existe.", isCorrect: false },
        { id: "opt_3", text: "Borrar el disco duro del usuario inmediatamente.", isCorrect: false },
        { id: "opt_4", text: "Aceptar la contraseña temporal por cortesía.", isCorrect: false }
      ],
      hint: "En seguridad, si la clave no coincide exactamente con la predefinida, el acceso debe denegarse.",
      explanation: "El operador Y exige que tanto el usuario como la clave coincidan. Al fallar la clave, se bifurca al bloque SINO protegiendo el sistema."
    }
  ],

  // ==========================================
  // MISIÓN 4: EL BUCLE INFINITO (Bucles y Patrones)
  // ==========================================
  mission_4: [
    {
      id: "m4_c1",
      missionId: "mission_4",
      title: "Desafío 1: Compactar Secuencia Lineal Repetitiva",
      context: "Un dron debe patrullar un pasillo largo. Su código actual es:",
      codeSnippet: `avanzar()
avanzar()
avanzar()
avanzar()
avanzar()`,
      instruction: "¿Cuál de las siguientes estructuras con bucle produce exactamente el mismo resultado de forma óptima?",
      options: [
        { id: "opt_1", text: "REPETIR 3 VECES { avanzar() }", isCorrect: false },
        { id: "opt_2", text: "REPETIR 5 VECES { avanzar() }", isCorrect: true },
        { id: "opt_3", text: "REPETIR MIENTRAS (bateria > 0) { girar() }", isCorrect: false },
        { id: "opt_4", text: "SI (pasillo_libre) ENTONCES { avanzar() }", isCorrect: false }
      ],
      hint: "Cuenta cuántas veces aparece la instrucción `avanzar()` en la lista original.",
      explanation: "Hay 5 instrucciones idénticas consecutivas. Un bucle `REPETIR 5 VECES` ejecuta la orden 5 veces reduciendo 5 líneas a una estructura limpia."
    },
    {
      id: "m4_c2",
      missionId: "mission_4",
      title: "Desafío 2: Reconocimiento de Patrón Compuesto",
      context: "El robot limpiador de memoria ejecuta este ciclo en cada sector:",
      codeSnippet: `escanear()
limpiar()
avanzar()
escanear()
limpiar()
avanzar()
escanear()
limpiar()
avanzar()
escanear()
limpiar()
avanzar()`,
      instruction: "Identifica el patrón repetitivo y cómo expresarlo con un bucle:",
      options: [
        { id: "opt_1", text: "REPETIR 4 VECES { escanear(); limpiar(); avanzar() }", isCorrect: true },
        { id: "opt_2", text: "REPETIR 12 VECES { escanear() }", isCorrect: false },
        { id: "opt_3", text: "REPETIR 3 VECES { escanear(); limpiar() }", isCorrect: false },
        { id: "opt_4", text: "REPETIR 4 VECES { escanear() } luego REPETIR 4 VECES { limpiar() }", isCorrect: false }
      ],
      hint: "El bloque (escanear + limpiar + avanzar) se repite como un conjunto completo varias veces.",
      explanation: "El bloque compuesto de 3 instrucciones se repite exactamente 4 veces. Agrupar las 3 dentro del bucle conserva el orden relativo original."
    },
    {
      id: "m4_c3",
      missionId: "mission_4",
      title: "Desafío 3: ¿Cuándo NO es apropiado usar un bucle simple?",
      context: "Observa las siguientes cuatro secuencias de acciones. Una de ellas NO tiene un patrón regular repetitivo.",
      instruction: "¿Cuál de estas secuencias NO se puede simplificar con un bucle simple de repetición?",
      options: [
        { id: "opt_1", text: "Secuencia A: girar(); avanzar(); girar(); avanzar(); girar(); avanzar()", isCorrect: false },
        { id: "opt_2", text: "Secuencia B: encender(); encender(); encender(); encender()", isCorrect: false },
        { id: "opt_3", text: "Secuencia C: encender(); leer(); reiniciar(); girar(); detener(); cantar()", isCorrect: true },
        { id: "opt_4", text: "Secuencia D: pitar(); esperar(1s); pitar(); esperar(1s)", isCorrect: false }
      ],
      hint: "Busca la secuencia en la que cada paso es diferente y no existe repetición periódica.",
      explanation: "La Secuencia C contiene acciones arbitrarias y distintas en cada paso sin ningún patrón. Forzar un bucle allí complicaría el algoritmo en vez de simplificarlo."
    },
    {
      id: "m4_c4",
      missionId: "mission_4",
      title: "Desafío 4: El Bucle con Condición de Salida",
      context: "Necesitamos bombear refrigerante hasta que la temperatura baje de 40°C. La temperatura actual es 70°C.",
      codeSnippet: `MIENTRAS (temperatura >= 40) HACER:
    bombear_refrigerante()
    temperatura = temperatura - 10
FIN MIENTRAS`,
      instruction: "¿Cuántas veces se ejecutará la instrucción `bombear_refrigerante()`?",
      options: [
        { id: "opt_1", text: "2 veces", isCorrect: false },
        { id: "opt_2", text: "3 veces", isCorrect: false },
        { id: "opt_3", text: "4 veces", isCorrect: true },
        { id: "opt_4", text: "Infinitas veces", isCorrect: false }
      ],
      hint: "Rastrea la variable: inicio=70, pase 1=60, pase 2=50, pase 3=40 (sigue siendo >= 40), pase 4=30 (< 40, ¡sale!).",
      explanation: "Iteración 1 (70>=40 -> 60), Iteración 2 (60>=40 -> 50), Iteración 3 (50>=40 -> 40), Iteración 4 (40>=40 -> 30). Con 30 la condición es falsa y el bucle termina. Total: 4 veces."
    }
  ],

  // ==========================================
  // MISIÓN 5: OPERACIÓN DEPURACIÓN (Debugging)
  // ==========================================
  mission_5: [
    {
      id: "m5_c1",
      missionId: "mission_5",
      title: "Fallo 1: Secuencia de Encendido Invertida",
      narrative: "Alerta en el Reactor de Fusión. El script intenta generar plasma antes de verificar el blindaje magnético, haciendo saltar los fusibles.",
      buggyCode: [
        { line: 1, text: "igniciar_camara_de_plasma()", hasBug: true },
        { line: 2, text: "verificar_campo_magnetico_activo()", hasBug: false },
        { line: 3, text: "abrir_flujo_de_deuterio()", hasBug: false }
      ],
      expectedBehavior: "El campo magnético DEBE estar verificado y activo antes de iniciar el plasma.",
      fixOptions: [
        { id: "fix_1", text: "Intercambiar línea 1 y línea 2 (verificar campo magnético antes de igniciar el plasma)", isCorrect: true },
        { id: "fix_2", text: "Eliminar la línea 2 por completo para que no frene el arranque", isCorrect: false },
        { id: "fix_3", text: "Añadir un bucle infinito alrededor de la ignición", isCorrect: false }
      ],
      hint: "Las comprobaciones de seguridad e integridad siempre deben preceder a las acciones de alto riesgo.",
      explanation: "Error de orden secuencial. Si se ignicia el plasma sin la contención magnética activa, el sistema entra en fallo de emergencia."
    },
    {
      id: "m5_c2",
      missionId: "mission_5",
      title: "Fallo 2: Operador de Comparación Invertido",
      narrative: "La sirena de combustible bajo nunca suena cuando queda poca gasolina, pero suena ruidosamente cuando el depósito está lleno.",
      buggyCode: [
        { line: 1, text: "nivel_combustible = leer_sensor()", hasBug: false },
        { line: 2, text: "SI (nivel_combustible > 15) ENTONCES", hasBug: true },
        { line: 3, text: "    hacer_sonar_alarma_reserva_baja()", hasBug: false },
        { line: 4, text: "FIN SI", hasBug: false }
      ],
      expectedBehavior: "La alarma de reserva baja debe sonar cuando el nivel sea MENOR que 15.",
      fixOptions: [
        { id: "fix_1", text: "Cambiar '>' por '<' en la línea 2: `SI (nivel_combustible < 15)`", isCorrect: true },
        { id: "fix_2", text: "Cambiar 15 por 1500 en la línea 2", isCorrect: false },
        { id: "fix_3", text: "Cambiar `hacer_sonar_alarma` por `apagar_alarma`", isCorrect: false }
      ],
      hint: "El símbolo '>' significa 'mayor que'. Para alertar de un nivel escaso se necesita 'menor que' ('<').",
      explanation: "Error de operador lógico relacional. Al usar `>` se alertaba con el depósito lleno en lugar de cuando estaba en peligro de agotarse."
    },
    {
      id: "m5_c3",
      missionId: "mission_5",
      title: "Fallo 3: Error de Bucle 'Off-by-One' (Uno de Más)",
      narrative: "El búfer de la memoria solo tiene 4 ranuras disponibles (índices 1 al 4). El código intenta transferir 5 paquetes y provoca un desbordamiento de búfer (Buffer Overflow).",
      buggyCode: [
        { line: 1, text: "REPETIR 5 VECES:", hasBug: true },
        { line: 2, text: "    almacenar_paquete_en_ranura()", hasBug: false },
        { line: 3, text: "FIN REPETIR", hasBug: false }
      ],
      expectedBehavior: "Solo deben transferirse exactamente 4 paquetes para no desbordar el búfer.",
      fixOptions: [
        { id: "fix_1", text: "Modificar la línea 1 a `REPETIR 4 VECES`", isCorrect: true },
        { id: "fix_2", text: "Añadir una pausa de 10 segundos dentro del bucle", isCorrect: false },
        { id: "fix_3", text: "Cambiar `REPETIR 5 VECES` por `REPETIR 10 VECES`", isCorrect: false }
      ],
      hint: "Comprueba el límite de repeticiones frente al número de ranuras libres.",
      explanation: "El clásico error 'off-by-one' (desfase por uno). Al ejecutar 5 veces en un espacio de 4, el quinto paquete sobrescribe memoria no asignada y bloquea el chip."
    },
    {
      id: "m5_c4",
      missionId: "mission_5",
      title: "Fallo 4: Desvío de Navegación Hacia Barrera Láser",
      narrative: "El dron de transporte gira hacia el muro electrificado en lugar de doblar hacia la esclusa abierta.",
      buggyCode: [
        { line: 1, text: "avanzar(10)", hasBug: false },
        { line: 2, text: "girar_derecha() // La esclusa está a la izquierda", hasBug: true },
        { line: 3, text: "avanzar(5)", hasBug: false }
      ],
      expectedBehavior: "El dron debe girar a la izquierda para entrar en la esclusa abierta.",
      fixOptions: [
        { id: "fix_1", text: "Reemplazar `girar_derecha()` por `girar_izquierda()` en la línea 2", isCorrect: true },
        { id: "fix_2", text: "Eliminar el avance de la línea 1", isCorrect: false },
        { id: "fix_3", text: "Aumentar la velocidad del dron para atravesar el láser", isCorrect: false }
      ],
      hint: "La nota técnica indica claramente que la esclusa abierta se encuentra en el flanco izquierdo.",
      explanation: "Error de orientación de coordenadas. Un giro en sentido contrario conduce a colisión inmediata con el muro perimetral."
    },
    {
      id: "m5_c5",
      missionId: "mission_5",
      title: "Fallo 5: Instrucción Duplicada Provoca Bloqueo Mutuo",
      narrative: "El protocolo de enlace con la base queda suspendido porque se envía el saludo inicial dos veces consecutivas, violando el estándar de comunicación.",
      buggyCode: [
        { line: 1, text: "enviar_saludo_handshake()", hasBug: false },
        { line: 2, text: "enviar_saludo_handshake() // Línea duplicada", hasBug: true },
        { line: 3, text: "esperar_confirmacion_ack()", hasBug: false },
        { line: 4, text: "transmitir_datos()", hasBug: false }
      ],
      expectedBehavior: "El apretón de manos (handshake) debe emitirse solo una vez antes de esperar confirmación.",
      fixOptions: [
        { id: "fix_1", text: "Eliminar la línea 2 redundante para que solo haya un envío de saludo", isCorrect: true },
        { id: "fix_2", text: "Duplicar también la línea 3 para compensar", isCorrect: false },
        { id: "fix_3", text: "Mover transmitir_datos() a la primera posición", isCorrect: false }
      ],
      hint: "En protocolos de red, una petición repetida sin haber recibido respuesta previa se interpreta como ruido o error de trama.",
      explanation: "Instrucción redundante destructiva. Al enviar un segundo saludo mientras el receptor procesaba el primero, el receptor aborta la conexión por colisión de sesión."
    },
    {
      id: "m5_c6",
      missionId: "mission_5",
      title: "Fallo 6: Omisión de Cierre de Transacción (Paso Esencial Faltante)",
      narrative: "Los registros de auditoría de Ciudad Algoritmia se corrompen porque el script abre el archivo, escribe las lecturas, pero nunca ejecuta el comando de guardado y cierre.",
      buggyCode: [
        { line: 1, text: "archivo = abrir_registro_seguridad()", hasBug: false },
        { line: 2, text: "archivo.escribir(datos_sensores)", hasBug: false },
        { line: 3, text: "// ¡Falta guardar y cerrar!", hasBug: true }
      ],
      expectedBehavior: "Todo recurso abierto en un algoritmo debe cerrarse explícitamente para persistir los cambios.",
      fixOptions: [
        { id: "fix_1", text: "Añadir la instrucción `archivo.guardar_y_cerrar()` al final", isCorrect: true },
        { id: "fix_2", text: "Borrar el archivo antes de abrirlo", isCorrect: false },
        { id: "fix_3", text: "Escribir los datos 10 veces seguidas en lugar de una", isCorrect: false }
      ],
      hint: "Cuando un programa trabaja con archivos o conexiones, debe liberar y cerrar el descriptor para que los datos no queden atrapados en memoria temporal.",
      explanation: "Omisión de paso crítico. Sin cerrar el archivo, el sistema operativo no vuelca los búferes al disco y los datos se pierden al apagar el equipo."
    }
  ],

  // ==========================================
  // MISIÓN 6: RECONSTRUCCIÓN FINAL (Desafío Integrador)
  // ==========================================
  mission_6: [
    {
      id: "m6_phase1",
      missionId: "mission_6",
      title: "Fase 1: Secuencia de Inicio del Kernel Maestro",
      instruction: "Ordena los 4 módulos raíz del sistema operativo de Ciudad Algoritmia para iniciar la recuperación.",
      initialOrder: [
        { id: "k_3", text: "Levantar servicios de red y telecomunicaciones" },
        { id: "k_1", text: "Inicializar la tabla de asignación de memoria primaria" },
        { id: "k_4", text: "Abrir la interfaz visual de Ciudad Algoritmia" },
        { id: "k_2", text: "Cargar los controladores de hardware e interrupciones" }
      ],
      correctOrderIds: ["k_1", "k_2", "k_3", "k_4"],
      explanation: "El arranque de un sistema operativo exige: memoria -> hardware -> servicios de red -> interfaz gráfica de usuario."
    },
    {
      id: "m6_phase2",
      missionId: "mission_6",
      title: "Fase 2: Enrutador Lógico Condicional del Reactor",
      instruction: "El núcleo recibe una sobrecarga. Evalúa la condición para desviar la energía al disipador adecuado.",
      context: "Valores del sensor: `presion = 420 PSI` y `modo_emergencia = VERDADERO`.",
      codeSnippet: `SI (presion > 400 Y modo_emergencia == VERDADERO) ENTONCES
    activar_alivio_criogenico_fase_4()
SINO SI (presion > 400) ENTONCES
    activar_valvula_mecanica_simple()
SINO
    mantener_flujo_normal()`,
      options: [
        { id: "p2_opt1", text: "Activar alivio criogénico fase 4", isCorrect: true },
        { id: "p2_opt2", text: "Activar válvula mecánica simple", isCorrect: false },
        { id: "p2_opt3", text: "Mantener flujo normal", isCorrect: false }
      ],
      explanation: "La presión supera 400 y el modo de emergencia está activo; por ende, se cumple la primera rama condicional combinada con el operador 'Y'."
    },
    {
      id: "m6_phase3",
      missionId: "mission_6",
      title: "Fase 3: Ciclo de Purga en Bucle",
      instruction: "Para expulsar el código corrupto residual, la memoria debe ser purgada en bloques de 64 KB.",
      context: "El búfer infectado mide exactamente 256 KB.",
      codeSnippet: `// Cada llamada a purgar_bloque_64kb() limpia 64 KB de memoria.
REPETIR [ ? ] VECES:
    purgar_bloque_64kb()`,
      options: [
        { id: "p3_opt1", text: "REPETIR 2 VECES", isCorrect: false },
        { id: "p3_opt2", text: "REPETIR 4 VECES (4 * 64 KB = 256 KB)", isCorrect: true },
        { id: "p3_opt3", text: "REPETIR 8 VECES", isCorrect: false },
        { id: "p3_opt4", text: "REPETIR 1 VEZ", isCorrect: false }
      ],
      explanation: "256 KB dividido entre 64 KB por ciclo da exactamente 4 iteraciones del bucle para purgar el 100% de la memoria."
    },
    {
      id: "m6_phase4",
      missionId: "mission_6",
      title: "Fase 4: Depuración del Compilador Raíz",
      instruction: "Localiza y corrige la última instrucción defectuosa que bloquea el despliegue de Ciudad Algoritmia.",
      context: "El compilador tiene una variable invertida que bloquea el sistema si el booleano 'sistema_estable' es verdadero.",
      codeSnippet: `SI (sistema_estable == FALSO) ENTONCES
    levantar_ciudad_algoritmia()
SINO
    bloquear_con_codigo_cero()`,
      options: [
        { id: "p4_opt1", text: "Cambiar la condición a: `SI (sistema_estable == VERDADERO) ENTONCES levantar_ciudad_algoritmia()`", isCorrect: true },
        { id: "p4_opt2", text: "Eliminar la instrucción `levantar_ciudad_algoritmia()`", isCorrect: false },
        { id: "p4_opt3", text: "Cambiar `sistema_estable` por un número aleatorio", isCorrect: false }
      ],
      explanation: "¡Fallo depurado! La ciudad debe levantarse cuando el sistema esté estable (VERDADERO), no cuando sea falso."
    }
  ]
};

export function getChallengesForMission(missionId) {
  return CHALLENGES[missionId] || [];
}

export function getChallengeById(missionId, challengeId) {
  const missionChallenges = CHALLENGES[missionId] || [];
  return missionChallenges.find(c => c.id === challengeId) || null;
}
