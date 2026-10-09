# Código Cero: El Rescate de Ciudad Algoritmia 🏙️⚡

Aplicación web educativa gamificada orientada a estudiantes de **15 a 16 años (4.º de ESO)**, diseñada para una unidad didáctica introductoria de **pensamiento computacional, algoritmos y programación**.

Desarrollada con **HTML5 semántico, CSS3 moderno (Variables, Grid, Flexbox) y JavaScript Vanilla (ES Modules)**, conectada en tiempo real a **Firebase Firestore (SDK v11.10.0 modular)**.

---

## 1. Arquitectura de Archivos

```text
/
├── index.html                   # Documento semántico y vistas SPA de la experiencia
├── README.md                    # Documentación técnica, despliegue y pedagogía
├── firestore.rules.example      # Reglas de seguridad documentadas para Firestore
├── css/
│   ├── styles.css               # Sistema de diseño, tokens, paleta y layouts
│   ├── components.css           # Botones, terminales, modales, toasts, rejillas
│   └── responsive.css           # Adaptabilidad para móvil, tablet y reducciones de movimiento
└── js/
    ├── app.js                   # Controlador orquestador principal
    ├── firebase.js              # Inicialización modular de Firebase App, Firestore y Analytics
    ├── navigation.js            # Enrutador SPA y accesibilidad del menú
    ├── state.js                 # Gestor reactivo de estado de sesión
    ├── data/
    │   ├── gameConfig.js        # Rangos, umbrales de XP, distritos de la ciudad
    │   ├── missions.js          # Metadatos curriculares y narrativos de las 6 misiones
    │   ├── challenges.js        # Banco de desafíos interactivos con validación
    │   ├── badges.js            # Definición e iconografía SVG nativa de 6 insignias
    │   └── training.js          # Temario y miniquizzes para el Centro de Entrenamiento
    ├── services/
    │   ├── playerService.js     # CRUD de participantes, alias y localStorage
    │   ├── missionService.js    # Avance de misiones, bonificaciones y validaciones
    │   ├── scoreService.js      # Registro atómico e idempotente de puntuaciones
    │   ├── badgeService.js      # Otorgamiento y consulta de insignias
    │   └── leaderboardService.js# Consulta en tiempo real de los 20 mejores agentes
    ├── components/
    │   ├── audioEffects.js      # Síntesis procedural con Web Audio API (sin archivos externos)
    │   ├── toast.js             # Notificaciones emergentes
    │   ├── modal.js             # Modales accesibles y diálogos narrativos con NEXO
    │   ├── progressBar.js       # Medidores de restauración y rangos
    │   └── missionCard.js       # Tarjetas del mapa con estados de desbloqueo
    └── games/
        ├── sequenceGame.js      # Misión 1: Ordenamiento algorítmico
        ├── routeGame.js         # Misión 2: Navegación de robot en cuadrícula
        ├── conditionalGame.js   # Misión 3: Evaluación condicional SI/ENTONCES
        ├── loopGame.js          # Misión 4: Reconocimiento de patrones y bucles
        ├── debuggingGame.js     # Misión 5: Operación Depuración (encuentra el error)
        └── finalChallenge.js    # Misión 6: Desafío integrador del Núcleo Cero
```

---

## 2. Cómo Ejecutar la Aplicación en Desarrollo

Dado que la aplicación utiliza **JavaScript ES Modules** (`import` / `export`), debe servirse mediante un servidor HTTP local (los módulos no se cargan directamente abriendo el archivo mediante el protocolo `file://` debido a restricciones de seguridad CORS del navegador).

### Opción A: Con Python (muy común en equipos de aula)
Abre un terminal en la carpeta del proyecto y ejecuta:
```bash
python -m http.server 8080
```
Luego abre tu navegador en: `http://localhost:8080`

### Opción B: Con Node.js / npx
```bash
npx serve -l 8080 .
```

### Opción C: Con Live Server en VS Code
Haz clic derecho en `index.html` y selecciona **«Open with Live Server»**.

---

## 3. Publicación en Hosting Estático (Producción con HTTPS)

La aplicación es un frontend 100% estático listo para desplegarse sin servidores Node.js ni PHP.

### Opción 1: Firebase Hosting (Recomendado)
El proyecto ya cuenta con el identificador `sistemagammy`. Para desplegar:
```bash
# 1. Instalar la herramienta CLI de Firebase si no la tienes
npm install -g firebase-tools

# 2. Iniciar sesión en Google Firebase
firebase login

# 3. Inicializar el proyecto en la carpeta actual
firebase init hosting
# Selecciona "Use an existing project" -> sistemagammy
# Directorio público: . (punto, el directorio actual)
# Configure as single-page app: No (o Yes si prefieres reescritura)

# 4. Desplegar
firebase deploy --only hosting
```

### Opción 2: GitHub Pages
1. Sube los archivos a un repositorio en GitHub.
2. Ve a **Settings -> Pages**.
3. En **Branch**, selecciona `main` (o `master`) y carpeta `/ (root)`.
4. Pulsa **Save**. GitHub Pages servirá la aplicación de inmediato bajo HTTPS.

### Opción 3: Vercel o Netlify
Arrastra y suelta la carpeta en el panel de control de Vercel o Netlify. Se asignará automáticamente un certificado SSL HTTPS.

> **IMPORTANTE SOBRE HTTPS:** Los navegadores modernos exigen HTTPS para habilitar Firebase Analytics, síntesis de audio limpia en dispositivos móviles y almacenamiento seguro de `localStorage`.

---

## 4. Activación y Reglas de Firebase Firestore

### Paso a paso en la consola de Firebase
1. Accede a [Firebase Console](https://console.firebase.google.com/).
2. Selecciona el proyecto **`sistemagammy`**.
3. En el menú lateral izquierdo, ve a **Compilación -> Firestore Database**.
4. Si aún no está activada, pulsa **Crear base de datos**, selecciona una ubicación cercana (ejemplo: `europe-west1` o `us-central1`) y elige el modo de inicio.
5. Ve a la pestaña **Reglas (Rules)**.
6. Copia el contenido del archivo [`firestore.rules.example`](./firestore.rules.example) y pégalo en el editor de reglas.
7. Haz clic en **Publicar (Publish)**.

---

## 5. Colecciones Creadas Automáticamente en Firestore

En Firestore, los documentos y subcolecciones se crean en el momento en que se escribe el primer dato. No es necesario crear tablas previamente.

1. **`players/{playerId}`**:
   - `alias`: Nombre del estudiante saneado.
   - `experience`: Puntos de experiencia (XP) totales.
   - `completedMissions`: Array de IDs de misiones completadas (`['mission_1', ...]`).
   - `unlockedBadges`: Array de insignias desbloqueadas.
   - `currentMission`: Misión activa.
   - `rank`: Rango alcanzado (*Aprendiz Digital*, *Técnico de Algoritmos*, etc.).
   - `createdAt`, `updatedAt`, `lastActivityAt`: Marcas de tiempo de servidor.

2. **`players/{playerId}/missionProgress/{missionId}`**:
   - Subcolección con el estado (`in_progress`, `completed`), puntuación, intentos, pistas usadas y desafíos resueltos.

3. **`players/{playerId}/challengeResults/{challengeId}`**:
   - Subcolección idempotente que registra si el reto fue superado, XP otorgado y fecha. Evita que un alumno sume puntos infinitos repitiendo el mismo reto.

4. **`players/{playerId}/badgeAwards/{badgeId}`**:
   - Subcolección con la fecha exacta de otorgamiento de cada condecoración.

5. **`activityLog/{logId}`**:
   - Registro de auditoría pedagógica con eventos como registro de participante, misiones completadas e insignias ganadas.

---

## 6. Verificación de Datos en Firebase Console

Para confirmar que la aplicación está escribiendo correctamente:
1. Abre la aplicación en el navegador y crea un agente (ej. `Ada_Lovelace`).
2. En la consola de Firebase, ve a **Firestore Database -> Datos**.
3. Verás aparecer inmediatamente la colección `players` con el documento correspondiente al jugador y su subcolección `activityLog`.
4. Al completar el Desafío 1 de la Misión 1, observarás cómo se crean `missionProgress` y `challengeResults` con sus marcas de tiempo.

---

## 7. Prueba Multijugador (Probar con Dos Participantes)

Para verificar la clasificación global y la persistencia independiente:
1. **Participante 1:** Abre la aplicación en una ventana normal de tu navegador (ej. Chrome) con el alias `Agente_Alfa`.
2. Completa la Misión 1 (obtendrás 500 XP y la insignia «Arquitecto de Secuencias»).
3. **Participante 2:** Abre una **Ventana de Incógnito** (o un segundo navegador como Firefox/Edge) con el alias `Agente_Beta`.
4. Completa la Misión 1 y la Misión 2 con `Agente_Beta`.
5. Ve a la sección **Clasificación Global**:
   - Verás a `Agente_Beta` en la posición 1 (por mayor experiencia y misiones) y a `Agente_Alfa` en la posición 2.
   - El participante actual verá su fila resaltada con el indicador `(Tú)`.

---

## 8. Consideraciones de Seguridad y Protección de Menores (4.º ESO)

De acuerdo con el Reglamento General de Protección de Datos (RGPD) y la LOPDGDD:

1. **Sin Datos Personales (PII):** La aplicación no solicita nombres y apellidos reales, correos electrónicos, números de teléfono ni contraseñas. Solo se utiliza un **alias ficticio** y un identificador seudoaleatorio (`p_...`).
2. **Acceso de Aula:** El sistema está optimizado para su uso en aulas de informática sin fricción de cuentas olvidadas o validaciones de correo.
3. **Limitación de Seguridad sin Backend:** Al realizarse las lecturas y escrituras directamente desde el cliente con reglas permisivas de alias, un estudiante avanzado con conocimientos de consola web podría alterar sus propios puntos de experiencia. Para un examen formal o evaluación sumativa con calificación oficial, se recomienda integrar *Firebase Anonymous Authentication* o *Cloud Functions* que ejecuten la validación del código en el servidor.
4. **Reinicio Seguro:** El botón de reinicio en el perfil solo restablece el documento del propio participante autenticado localmente mediante su identificador, garantizando que un alumno no pueda borrar el progreso de sus compañeros.
