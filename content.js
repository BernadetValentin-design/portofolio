/* All the text of the site, in three languages.
   A value is either a plain string (same in every language) or {en, fr, es}. */

const EMAIL = 'valentin.bernadet@edu.devinci.fr';
const PHONE = { href: '+33670401097', label: '+33 6 70 40 10 97' };
const LINKEDIN = 'https://www.linkedin.com/in/valentin-bernadet';
const GITHUB = 'https://github.com/BernadetValentin-design';
const CV = 'content/Bernadet_Valentin_Resume.pdf';
const PORTRAIT = 'content/web/portrait.jpg';

const LANGS = { en: 'English', fr: 'Français', es: 'Español' };

/* ---------- Interface ---------- */
const UI = {
    title: { en: 'Valentin Bernadet', fr: 'Valentin Bernadet', es: 'Valentin Bernadet' },
    nav_projects: { en: 'Projects', fr: 'Projets', es: 'Proyectos' },
    nav_contact: { en: 'Contact', fr: 'Contact', es: 'Contacto' },
    theme_dark: { en: 'Dark theme', fr: 'Thème sombre', es: 'Tema oscuro' },
    theme_light: { en: 'Light theme', fr: 'Thème clair', es: 'Tema claro' },
    search_label: { en: 'Search Valentin', fr: 'Rechercher Valentin', es: 'Buscar a Valentin' },
    btn_search: { en: 'Valentin Search', fr: 'Recherche Valentin', es: 'Búsqueda Valentin' },
    btn_lucky: { en: "I'm Feeling Lucky", fr: "J'ai de la chance", es: 'Voy a tener suerte' },
    note: {
        en: 'Looking for a <strong>6-month internship</strong> from <strong>February 2027</strong>',
        fr: 'Cherche un <strong>stage de 6 mois</strong> à partir de <strong>février 2027</strong>',
        es: 'Busca unas <strong>prácticas de 6 meses</strong> a partir de <strong>febrero de 2027</strong>',
    },
    offered_in: { en: 'Valentin is offered in:', fr: 'Valentin est disponible en :', es: 'Valentin está disponible en:' },
    back_home: { en: 'Back to search', fr: "Retour à l'accueil", es: 'Volver al inicio' },
    search_go: { en: 'Search', fr: 'Rechercher', es: 'Buscar' },
    lang_group: { en: 'Site language', fr: 'Langue du site', es: 'Idioma de la web' },
    lang_toast: { en: 'Site now in English.', fr: 'Site affiché en français.', es: 'Web en español.' },

    tab_all: { en: 'All', fr: 'Tous', es: 'Todo' },
    tab_projects: { en: 'Projects', fr: 'Projets', es: 'Proyectos' },
    tab_experience: { en: 'Experience', fr: 'Parcours', es: 'Trayectoria' },
    tab_skills: { en: 'Skills', fr: 'Skills', es: 'Habilidades' },
    tab_about: { en: 'About', fr: 'À propos', es: 'Sobre mí' },

    seg_projects: { en: 'projects', fr: 'projets', es: 'proyectos' },
    seg_experience: { en: 'experience', fr: 'parcours', es: 'trayectoria' },
    seg_questions: { en: 'questions', fr: 'questions', es: 'preguntas' },
    seg_skills: { en: 'skills', fr: 'skills', es: 'habilidades' },

    stats_all: {
        en: (s) => `About 1 result (${s} seconds). It's probably the one you're looking for.`,
        fr: (s) => `Environ 1 résultat (${s} secondes). C'est sûrement celui que vous cherchez.`,
        es: (s) => `Aproximadamente 1 resultado (${s} segundos). Seguramente es el que buscas.`,
    },
    stats_n: {
        en: (n, s) => `About ${n} results (${s} seconds)`,
        fr: (n, s) => `Environ ${n} résultats (${s} secondes)`,
        es: (n, s) => `Aproximadamente ${n} resultados (${s} segundos)`,
    },
    stats_about: {
        en: (s) => `1 result (${s} seconds). It's a person.`,
        fr: (s) => `1 résultat (${s} secondes). C'est une personne.`,
        es: (s) => `1 resultado (${s} segundos). Es una persona.`,
    },
    stats_search: {
        en: (n, q, s) => `About ${n} result${n === 1 ? '' : 's'} for “${q}” (${s} seconds)`,
        fr: (n, q, s) => `Environ ${n} résultat${n > 1 ? 's' : ''} pour « ${q} » (${s} secondes)`,
        es: (n, q, s) => `Aproximadamente ${n} resultado${n === 1 ? '' : 's'} para «${q}» (${s} segundos)`,
    },

    did_you_mean: { en: 'Did you mean:', fr: 'Essayez avec cette orthographe :', es: 'Quizás quisiste decir:' },
    hire: { en: 'hire Valentin', fr: 'embaucher Valentin', es: 'contratar a Valentin' },
    paa: { en: 'People also ask', fr: 'Autres questions posées', es: 'Otras preguntas de los usuarios' },
    related: { en: 'Related searches', fr: 'Recherches associées', es: 'Búsquedas relacionadas' },
    related_words: {
        en: ['RAG', 'WebGPU', 'robot', 'Kickstarter', 'Madrid', 'FPGA'],
        fr: ['RAG', 'WebGPU', 'robot', 'Kickstarter', 'Madrid', 'FPGA'],
        es: ['RAG', 'WebGPU', 'robot', 'Kickstarter', 'Madrid', 'FPGA'],
    },
    next: { en: 'Next', fr: 'Suivant', es: 'Siguiente' },
    prev: { en: 'Previous', fr: 'Précédent', es: 'Anterior' },
    close: { en: 'Close', fr: 'Fermer', es: 'Cerrar' },
    demo: { en: 'Live demo', fr: 'Voir la démo', es: 'Ver la demo' },
    code: { en: 'Source code', fr: 'Voir le code', es: 'Ver el código' },
    demo_s: { en: 'Demo', fr: 'Démo', es: 'Demo' },
    code_s: { en: 'Code', fr: 'Code', es: 'Código' },
    details: { en: 'Details', fr: 'Détails', es: 'Detalles' },
    drawer_tip: {
        en: 'Tip: the ← and → keys move between projects.',
        fr: 'Astuce : les flèches ← et → passent d’un projet à l’autre.',
        es: 'Consejo: las flechas ← y → pasan de un proyecto a otro.',
    },
    ongoing: { en: 'ongoing', fr: 'en cours', es: 'en curso' },
    tissu_title: { en: 'Anti-pressure-sore capacitive matrix', fr: 'Matrice capacitive anti-escarres', es: 'Matriz capacitiva antiescaras' },
    cushion_hint: {
        en: 'Live demo · hover the cushion, click to press with the finger. Hold still: after 4 s (30 min in real life) the alert goes off.',
        fr: 'Démo en direct · survolez le coussin, cliquez pour appuyer avec le doigt. Restez immobile : après 4 s (30 min en vrai), l’alerte se déclenche.',
        es: 'Demo en directo · pasa el cursor por el cojín y haz clic para presionar con el dedo. Quédate quieto: tras 4 s (30 min en la realidad) salta la alerta.',
    },
    cushion_assemble: { en: 'Assemble the layers', fr: 'Assembler les couches', es: 'Ensamblar las capas' },
    cushion_explode: { en: 'Explode the layers', fr: 'Éclater les couches', es: 'Separar las capas' },
    tissu_layers: {
        en: ['Cover', 'Comfort fabric', 'Columns (RX)', 'Dielectric felt', 'Rows (TX)', 'Insulating felt', 'Ground shield'],
        fr: ['Housse', 'Tissu confort', 'Colonnes (RX)', 'Feutre diélectrique', 'Rangées (TX)', 'Feutre isolant', 'Blindage masse'],
        es: ['Funda', 'Tejido de confort', 'Columnas (RX)', 'Fieltro dieléctrico', 'Filas (TX)', 'Fieltro aislante', 'Blindaje a masa'],
    },
    tissu_map: { en: 'Pressure map · 32 × 32', fr: 'Carte de pression · 32 × 32', es: 'Mapa de presión · 32 × 32' },
    tissu_idle: { en: 'Touch the cushion', fr: 'Touchez le coussin', es: 'Toca el cojín' },
    tissu_still: { en: (s) => `Still for ${s} s`, fr: (s) => `Immobile depuis ${s} s`, es: (s) => `Inmóvil desde hace ${s} s` },
    tissu_alert: { en: 'Change position', fr: 'Changez d’appui', es: 'Cambie de apoyo' },
    tissu_relief: { en: 'Pressure relieved · counter reset', fr: 'Pression relâchée · compteur à zéro', es: 'Presión aliviada · contador a cero' },
    play_hint: {
        en: 'The CNN from this project (99% on the MNIST test set) runs right here, in your browser.',
        fr: 'Le CNN de ce projet (99 % sur le jeu de test MNIST) tourne ici même, dans votre navigateur.',
        es: 'La CNN de este proyecto (99 % en el conjunto de test de MNIST) se ejecuta aquí mismo, en tu navegador.',
    },
    z_draw: { en: 'Draw a digit from 0 to 9', fr: 'Dessinez un chiffre de 0 à 9', es: 'Dibuja un número del 0 al 9' },
    z_says: { en: 'Zoltar says', fr: 'Zoltar dit', es: 'Zoltar dice' },
    z_is: { en: (d) => `It's a ${d}.`, fr: (d) => `C’est un ${d}.`, es: (d) => `Es un ${d}.` },
    z_seen: { en: 'What the network sees', fr: 'Ce que voit le réseau', es: 'Lo que ve la red' },
    z_clear: { en: 'Clear', fr: 'Effacer', es: 'Borrar' },
    z_loading: { en: 'Waking up the network…', fr: 'Réveil du réseau…', es: 'Despertando la red…' },
    live_badge: { en: 'Live · WebGPU', fr: 'En direct · WebGPU', es: 'En directo · WebGPU' },
    live_hint: {
        en: 'Rendered live on your graphics card with WebGPU raymarching. Move your mouse: one sphere follows it.',
        fr: 'Rendu en direct sur votre carte graphique, en raymarching WebGPU. Bougez la souris : une sphère la suit.',
        es: 'Renderizado en directo en tu tarjeta gráfica, con raymarching WebGPU. Mueve el ratón: una esfera lo sigue.',
    },
    model_hint: { en: 'Drag to turn the robot, scroll to zoom.', fr: 'Faites glisser pour tourner le robot, molette pour zoomer.', es: 'Arrastra para girar el robot, rueda para hacer zoom.' },
    portrait: { en: 'Portrait of Valentin Bernadet', fr: 'Portrait de Valentin Bernadet', es: 'Retrato de Valentin Bernadet' },

    kp_sub: { en: 'AI & Software Engineering Student', fr: 'Étudiant ingénieur, IA et logiciel', es: 'Estudiante de ingeniería, IA y software' },
    kp_desc: {
        en: 'Final-year engineering student at ESILV, Creative Technology major. Builds LLM / RAG systems, WebGPU graphics and FPGA hardware.',
        fr: 'Étudiant en dernière année à l’ESILV, majeure Creative Technology. Construit des systèmes LLM / RAG, du rendu WebGPU et du matériel sur FPGA.',
        es: 'Estudiante de último año en ESILV, especialidad Creative Technology. Desarrolla sistemas LLM / RAG, gráficos WebGPU y hardware con FPGA.',
    },
    kp_source: { en: 'Source: his CV', fr: 'Source : son CV', es: 'Fuente: su CV' },
    kp_facts: {
        en: [['Studies', 'ESILV, Master of Engineering (2022 – 2027)'], ['Available', 'February 2027, 6 months'], ['Based in', 'Paris area, open to relocation'], ['Languages', 'French, Spanish, English'], ['Last seen', 'Madrid, at IFS (2026)']],
        fr: [['Études', 'ESILV, diplôme d’ingénieur (2022 – 2027)'], ['Disponible', 'Février 2027, 6 mois'], ['Basé', 'Région parisienne, mobile'], ['Langues', 'Français, espagnol, anglais'], ['Vu pour la dernière fois', 'Madrid, chez IFS (2026)']],
        es: [['Estudios', 'ESILV, título de ingeniero (2022 – 2027)'], ['Disponible', 'Febrero de 2027, 6 meses'], ['Ubicación', 'Región de París, con movilidad'], ['Idiomas', 'Francés, español, inglés'], ['Visto por última vez', 'Madrid, en IFS (2026)']],
    },
    email_btn: { en: 'Email', fr: 'E-mail', es: 'Correo' },

    skills_hint: { en: 'Tip: hover a skill to highlight it.', fr: 'Astuce : survolez une compétence pour la surligner.', es: 'Consejo: pasa el cursor por una habilidad para resaltarla.' },

    about_hi: { en: "Hi, I'm Valentin.", fr: 'Salut, c’est Valentin.', es: 'Hola, soy Valentin.' },
    about_p: {
        en: [
            'I grew up between Paris and the Basque coast. I like projects that go from an idea to something you can use or touch: a RAG pipeline deployed on Kubernetes, a 3D editor in the browser, a crab-shaped robot or a recycled-leather pocket.',
            'At IFS in Madrid, I built a semantic search path in an LLM-driven analytics service, in an international team working in English.',
            'Outside of engineering, I play rugby and tennis, train for triathlons and play guitar.',
        ],
        fr: [
            'J’ai grandi entre Paris et la côte basque. J’aime les projets qui passent d’une idée à quelque chose qu’on peut utiliser ou toucher : un pipeline RAG déployé sur Kubernetes, un éditeur 3D dans le navigateur, un robot en forme de crabe ou une poche en cuir recyclé.',
            'Chez IFS à Madrid, j’ai construit un parcours de recherche sémantique dans un service d’analyse piloté par LLM, dans une équipe internationale qui travaillait en anglais.',
            'En dehors de l’ingénierie, je joue au rugby et au tennis, je m’entraîne pour des triathlons et je joue de la guitare.',
        ],
        es: [
            'Crecí entre París y la costa vasca. Me gustan los proyectos que pasan de una idea a algo que se puede usar o tocar: un pipeline RAG desplegado en Kubernetes, un editor 3D en el navegador, un robot con forma de cangrejo o un bolsillo de cuero reciclado.',
            'En IFS, en Madrid, construí un flujo de búsqueda semántica en un servicio de análisis basado en LLM, dentro de un equipo internacional que trabajaba en inglés.',
            'Fuera de la ingeniería, juego al rugby y al tenis, entreno para triatlones y toco la guitarra.',
        ],
    },
    contact_title: { en: 'Contact', fr: 'Me contacter', es: 'Contacto' },
    c_email: { en: 'Email', fr: 'E-mail', es: 'Correo' },
    c_phone: { en: 'Phone', fr: 'Téléphone', es: 'Teléfono' },
    play_cap: {
        en: 'Grab them, throw them, or tap them to make them jump.',
        fr: 'Attrapez-les, lancez-les, ou touchez-les pour les faire sauter.',
        es: 'Agárralos, lánzalos o tócalos para que salten.',
    },

    empty_h: { en: (q) => `No results for “${q}”`, fr: (q) => `Aucun résultat pour « ${q} »`, es: (q) => `Ningún resultado para «${q}»` },
    empty_p: {
        en: 'The portfolio has nothing on this. Try one of these:',
        fr: 'Le portfolio ne contient rien là-dessus. Essayez plutôt :',
        es: 'El portfolio no tiene nada sobre esto. Prueba con:',
    },
    lucky_toast: { en: (t) => `Feeling lucky? Here's “${t}”.`, fr: (t) => `Coup de chance : « ${t} ».`, es: (t) => `¿Suerte? Aquí tienes «${t}».` },

    placeholders: {
        en: ['valentin bernadet', 'valentin bernadet projects', 'who knows RAG and rugby?', 'AI intern february 2027'],
        fr: ['valentin bernadet', 'valentin bernadet projets', 'qui connaît le RAG et le rugby ?', 'stage IA février 2027'],
        es: ['valentin bernadet', 'valentin bernadet proyectos', '¿quién sabe de RAG y de rugby?', 'prácticas IA febrero 2027'],
    },
    suggestions: {
        en: [['valentin bernadet', 'all'], ['valentin bernadet <b>projects</b>', 'projects'], ['valentin bernadet <b>experience</b>', 'experience'], ['valentin bernadet <b>skills</b>', 'skills'], ['is valentin bernadet <b>fun</b>?', 'about']],
        fr: [['valentin bernadet', 'all'], ['valentin bernadet <b>projets</b>', 'projects'], ['valentin bernadet <b>parcours</b>', 'experience'], ['valentin bernadet <b>skills</b>', 'skills'], ['valentin bernadet est-il <b>drôle</b> ?', 'about']],
        es: [['valentin bernadet', 'all'], ['valentin bernadet <b>proyectos</b>', 'projects'], ['valentin bernadet <b>trayectoria</b>', 'experience'], ['valentin bernadet <b>habilidades</b>', 'skills'], ['¿es <b>divertido</b> valentin bernadet?', 'about']],
    },
    hello: {
        en: 'Hi! I work in English every day, professional proficiency.',
        fr: 'Salut ! Je parle français, c’est ma langue maternelle.',
        es: '¡Hola! También hablo español, es mi lengua materna.',
    },
};

/* ---------- Projects ---------- */
const PROJECTS = [
    {
        id: 'rag', img: 'content/web/llmresearch.jpg', thumb: 'content/web/llmresearch-thumb.jpg', slug: 'llm-agent',
        demo: 'https://bernadetvalentin-design.github.io/LLM_ResearchPaper_Analysis/',
        code: 'https://github.com/BernadetValentin-design/LLM_ResearchPaper_Analysis',
        title: 'Research Paper LLM Agent',
        sub: { en: 'A research assistant that runs entirely in the browser', fr: 'Assistant de recherche 100 % dans le navigateur', es: 'Asistente de investigación 100 % en el navegador' },
        tags: ['LLM', 'RAG', 'WebLLM', 'PDF.js'],
        desc: {
            en: 'A research assistant that runs in the browser: drop in a paper as a PDF, then ask it questions. Nothing is sent to a server: the text is read with PDF.js, split into overlapping 500-character chunks and indexed for a vector search that also takes the list of loaded files into account. Temperature and system prompt are adjustable.',
            fr: 'Un assistant de recherche qui tourne dans le navigateur : on dépose un article en PDF, puis on l’interroge. Rien n’est envoyé à un serveur : le texte est lu avec PDF.js, découpé en morceaux de 500 caractères qui se chevauchent, puis indexé pour une recherche vectorielle qui tient aussi compte de la liste des fichiers chargés. Température et prompt système sont réglables.',
            es: 'Un asistente de investigación que funciona en el navegador: se sube un artículo en PDF y se le hacen preguntas. No se envía nada a ningún servidor: el texto se lee con PDF.js, se divide en fragmentos de 500 caracteres que se solapan y se indexa para una búsqueda vectorial que también tiene en cuenta la lista de archivos cargados. La temperatura y el prompt de sistema son ajustables.',
        },
        facts: {
            en: [['Date', 'January 2026'], ['LLM', 'Llama-3.2-1B-Instruct, run with WebLLM'], ['Embeddings', 'all-MiniLM-L6-v2, with Transformers.js'], ['RAG', 'Overlapping 500-character chunks, vector search, plus awareness of the file list'], ['Privacy', 'Everything runs in the browser; no document leaves the machine'], ['Screenshot', 'Summary of an optimisation paper on parcel delivery by trucks and drones, temperature 0.7']],
            fr: [['Date', 'Janvier 2026'], ['LLM', 'Llama-3.2-1B-Instruct, exécuté avec WebLLM'], ['Embeddings', 'all-MiniLM-L6-v2, avec Transformers.js'], ['RAG', 'Morceaux de 500 caractères qui se chevauchent, recherche vectorielle et liste des fichiers'], ['Confidentialité', 'Tout tourne dans le navigateur, aucun document ne sort de la machine'], ['Capture', 'Résumé d’un article d’optimisation sur la livraison de colis par camions et drones, température 0,7']],
            es: [['Fecha', 'Enero de 2026'], ['LLM', 'Llama-3.2-1B-Instruct, ejecutado con WebLLM'], ['Embeddings', 'all-MiniLM-L6-v2, con Transformers.js'], ['RAG', 'Fragmentos de 500 caracteres que se solapan, búsqueda vectorial y lista de archivos'], ['Privacidad', 'Todo se ejecuta en el navegador; ningún documento sale del equipo'], ['Captura', 'Resumen de un artículo de optimización sobre el reparto de paquetes con camiones y drones, temperatura 0,7']],
        },
    },
    {
        id: 'mnist', img: 'content/web/mnist.jpg', slug: 'zoltar', play: true,
        demo: 'https://bernadetvalentin-design.github.io/ZoltarDigit_Valentin/',
        code: 'https://github.com/BernadetValentin-design/ZoltarDigit_Valentin',
        title: 'MNIST Digit Recognition',
        sub: { en: '“Zoltar”, the digit fortune-teller', fr: '« Zoltar », le devin des chiffres', es: '«Zoltar», el adivino de cifras' },
        tags: ['Python', 'TinyGrad', 'WebGPU'],
        desc: {
            en: 'Draw a digit and Zoltar guesses it. An MLP and a CNN were trained on MNIST with TinyGrad; the CNN, the more accurate one, is the one running above, straight in the browser.',
            fr: 'On dessine un chiffre et Zoltar le devine. Un MLP et un CNN ont été entraînés sur MNIST avec TinyGrad ; le CNN, le plus précis des deux, est celui qui tourne juste au-dessus, directement dans le navigateur.',
            es: 'Se dibuja un número y Zoltar lo adivina. Se entrenaron un MLP y una CNN con MNIST mediante TinyGrad; la CNN, la más precisa, es la que funciona justo arriba, directamente en el navegador.',
        },
        facts: {
            en: [['Date', 'November 2025'], ['CNN', '2 conv layers with 32 filters, then 2 with 64, with pooling. About 140,000 parameters, 99.00% test accuracy'], ['MLP', '784 → 512 → 512 → 10, about 660,000 parameters, 96.84% test accuracy'], ['Stack', 'Trained with TinyGrad, inference in the browser on WebGPU']],
            fr: [['Date', 'Novembre 2025'], ['CNN', '2 couches de convolution à 32 filtres, puis 2 à 64, avec pooling. Environ 140 000 paramètres, 99,00 % sur le jeu de test'], ['MLP', '784 → 512 → 512 → 10, environ 660 000 paramètres, 96,84 % sur le jeu de test'], ['Technos', 'Entraînés avec TinyGrad, prédictions dans le navigateur en WebGPU']],
            es: [['Fecha', 'Noviembre de 2025'], ['CNN', '2 capas de convolución con 32 filtros y luego 2 con 64, con pooling. Unos 140 000 parámetros, 99,00 % en el conjunto de test'], ['MLP', '784 → 512 → 512 → 10, unos 660 000 parámetros, 96,84 % en el conjunto de test'], ['Tecnologías', 'Entrenados con TinyGrad, predicciones en el navegador con WebGPU']],
        },
    },
    {
        id: 'scene', img: 'content/web/sceneeditor.jpg', slug: 'webgpu',
        demo: 'https://bernadetvalentin-design.github.io/WebGPU_Project_Interative_Scene/',
        code: 'https://github.com/BernadetValentin-design/WebGPU_Project_Interative_Scene',
        title: '3D Scene Editor',
        sub: { en: 'A 3D scene editor in WebGPU, built from scratch', fr: 'Éditeur de scène 3D en WebGPU, écrit de zéro', es: 'Editor de escenas 3D en WebGPU, desde cero' },
        tags: ['WebGPU', 'WGSL', 'Raymarching'],
        desc: {
            en: 'An interactive scene editor written from scratch in WebGPU, with raymarching WGSL shaders. You add spheres, boxes and tori, set their position, size and colour, and the shapes melt into each other as they get close.',
            fr: 'Éditeur de scène interactif écrit de zéro en WebGPU, avec des shaders WGSL en raymarching. On ajoute des sphères, des boîtes et des tores, on règle leur position, leur taille et leur couleur, et les formes se fondent entre elles quand elles se rapprochent.',
            es: 'Editor de escenas interactivo escrito desde cero en WebGPU, con shaders WGSL de raymarching. Se añaden esferas, cajas y toros, se ajustan su posición, tamaño y color, y las formas se funden entre sí cuando se acercan.',
        },
        facts: {
            en: [['Date', 'December 2025'], ['Rendering', 'Raymarching in WGSL shaders, written from scratch'], ['Primitives', 'Sphere, box, torus, blending together when close'], ['Controls', 'Mouse camera, keyboard movement (ZQSD), scroll to zoom, FPS counter']],
            fr: [['Date', 'Décembre 2025'], ['Rendu', 'Raymarching dans des shaders WGSL, écrits de zéro'], ['Primitives', 'Sphère, boîte, tore, qui fusionnent quand elles sont proches'], ['Commandes', 'Caméra à la souris, déplacement au clavier (ZQSD), zoom à la molette, compteur de FPS']],
            es: [['Fecha', 'Diciembre de 2025'], ['Renderizado', 'Raymarching en shaders WGSL, escritos desde cero'], ['Primitivas', 'Esfera, caja y toro, que se funden cuando están cerca'], ['Controles', 'Cámara con el ratón, teclado (ZQSD), zoom con la rueda, contador de FPS']],
        },
    },
    {
        id: 'etextile', img: 'content/web/fpga.jpg', slug: 'e-textile', ongoing: true, cushion: true,
        title: 'E-textile Capacitive Matrix',
        sub: { en: 'An anti-pressure-sore cushion that sees pressure', fr: 'Un coussin anti-escarres qui voit la pression', es: 'Un cojín antiescaras que ve la presión' },
        tags: { en: ['FPGA', 'Sensors', 'E-textile'], fr: ['FPGA', 'Capteurs', 'E-textile'], es: ['FPGA', 'Sensores', 'E-textile'] },
        desc: {
            en: 'A wheelchair cushion that maps pressure, to prevent pressure sores. Silver knit strips sewn into the fabric form 32 rows and 32 columns separated by felt: a body above a crossing takes part of the signal, which gives one dot of the map. If an area stays under pressure too long, the device asks the person to change position. The first prototype, in the project’s first year, was a 12 × 12 matrix read by an FPGA board.',
            fr: 'Un coussin de fauteuil roulant qui cartographie la pression, pour prévenir les escarres. Des bandes de tricot d’argent cousues dans le tissu forment 32 rangées et 32 colonnes séparées par du feutre : un corps au-dessus d’un croisement prend une partie du signal, ce qui donne un point de la carte. Si une zone reste trop longtemps sous pression, l’appareil demande de changer d’appui. Le premier prototype, la première année du projet, était une matrice de 12 × 12 lue par une carte FPGA.',
            es: 'Un cojín de silla de ruedas que mapea la presión para prevenir las escaras. Tiras de punto de plata cosidas en la tela forman 32 filas y 32 columnas separadas por fieltro: un cuerpo sobre un cruce absorbe parte de la señal, lo que da un punto del mapa. Si una zona está demasiado tiempo bajo presión, el dispositivo pide cambiar de apoyo. El primer prototipo, el primer año del proyecto, era una matriz de 12 × 12 leída por una placa FPGA.',
        },
        facts: {
            en: [['Status', 'In progress, second version'], ['Sensor', '32 × 32 crossings, silver knit strips 8 mm wide every 12.5 mm'], ['Layers', 'Cover, comfort fabric, columns (RX), felt, rows (TX), felt, ground shield'], ['Alert', 'Above 60 mmHg for 30 minutes on the same area'], ['First prototype', '12 × 12 capacitive matrix read by an FPGA board']],
            fr: [['Statut', 'En cours, deuxième version'], ['Capteur', '32 × 32 croisements, bandes de tricot d’argent de 8 mm tous les 12,5 mm'], ['Couches', 'Housse, tissu confort, colonnes (RX), feutre, rangées (TX), feutre, blindage de masse'], ['Alerte', 'Au-delà de 60 mmHg pendant 30 minutes sur la même zone'], ['Premier prototype', 'Matrice capacitive de 12 × 12 lue par une carte FPGA']],
            es: [['Estado', 'En curso, segunda versión'], ['Sensor', '32 × 32 cruces, tiras de punto de plata de 8 mm cada 12,5 mm'], ['Capas', 'Funda, tejido de confort, columnas (RX), fieltro, filas (TX), fieltro, blindaje a masa'], ['Alerta', 'Más de 60 mmHg durante 30 minutos en la misma zona'], ['Primer prototipo', 'Matriz capacitiva de 12 × 12 leída por una placa FPGA']],
        },
    },
    {
        id: 'pocket', img: 'content/web/extrapocket.jpg', slug: 'extra-pocket',
        title: 'The Extra Pocket',
        sub: { en: 'A belt pocket in recycled leather', fr: 'Une poche de ceinture en cuir recyclé', es: 'Un bolsillo de cinturón de cuero reciclado' },
        tags: { en: ['Product design', 'Manufacturing', 'Kickstarter'], fr: ['Design produit', 'Production', 'Kickstarter'], es: ['Diseño de producto', 'Producción', 'Kickstarter'] },
        desc: {
            en: 'A small test project to learn the whole chain of a product: design, production, marketing and sales. A belt pocket made from recycled leather, funded through a Kickstarter campaign.',
            fr: 'Un petit projet test pour apprendre toute la chaîne d’un produit : design, production, communication et vente. Une poche de ceinture en cuir recyclé, financée par une campagne Kickstarter.',
            es: 'Un pequeño proyecto de prueba para aprender toda la cadena de un producto: diseño, producción, comunicación y venta. Un bolsillo de cinturón de cuero reciclado, financiado con una campaña de Kickstarter.',
        },
        facts: {
            en: [['Material', 'Recycled leather'], ['Price', '€18 per pocket'], ['Campaign', 'About €500 raised, around thirty backers (≈ 28)'], ['Goal', 'Learn the full chain: design, production, marketing, sales']],
            fr: [['Matériau', 'Cuir recyclé'], ['Prix', '18 € la poche'], ['Campagne', 'Environ 500 € récoltés, une trentaine de contributeurs (≈ 28)'], ['Objectif', 'Apprendre la chaîne complète : design, production, communication, vente']],
            es: [['Material', 'Cuero reciclado'], ['Precio', '18 € por bolsillo'], ['Campaña', 'Unos 500 € recaudados, una treintena de contribuyentes (≈ 28)'], ['Objetivo', 'Aprender la cadena completa: diseño, producción, comunicación, venta']],
        },
    },
    {
        // To show the robot in 3D, export the CAD model as .glb and set: model: 'content/web/robot.glb'
        id: 'robot', img: 'content/web/octopode.jpg', slug: 'robot', model: null,
        title: { en: 'Octopod robot', fr: 'Robot octopode', es: 'Robot octópodo' },
        sub: { en: 'A robot that delivers medication', fr: 'Un robot qui distribue des médicaments', es: 'Un robot que distribuye medicamentos' },
        tags: { en: ['Robotics', 'Electronics', '3D printing'], fr: ['Robotique', 'Électronique', 'Impression 3D'], es: ['Robótica', 'Electrónica', 'Impresión 3D'] },
        desc: {
            en: 'A robot that delivers medication by following a line on the floor, with a fold-out gripper to pick it up. The crab shape is a design choice. In the photo: a red 3D-printed shell, an LCD screen on the back and an ultrasonic sensor at the front.',
            fr: 'Un robot qui distribue des médicaments en suivant une ligne tracée au sol, avec une pince dépliable pour les saisir. La forme de crabe est un choix de design. Sur la photo : coque rouge imprimée en 3D, écran LCD sur le dos et capteur à ultrasons à l’avant.',
            es: 'Un robot que distribuye medicamentos siguiendo una línea en el suelo, con una pinza desplegable para cogerlos. La forma de cangrejo es una decisión de diseño. En la foto: carcasa roja impresa en 3D, pantalla LCD en el dorso y sensor de ultrasonidos delante.',
        },
        facts: {
            en: [['Purpose', 'Delivering medication along a route marked on the floor'], ['Navigation', 'Line following'], ['Gripping', 'Fold-out gripper'], ['Shape', 'A crab, by design'], ['Build', '3D-printed shell, LCD screen, ultrasonic sensor']],
            fr: [['Usage', 'Distribuer des médicaments le long d’un trajet marqué au sol'], ['Navigation', 'Suivi de ligne'], ['Préhension', 'Pince dépliable'], ['Forme', 'Un crabe, par choix de design'], ['Fabrication', 'Coque imprimée en 3D, écran LCD, capteur à ultrasons']],
            es: [['Uso', 'Distribuir medicamentos a lo largo de un recorrido marcado en el suelo'], ['Navegación', 'Seguimiento de línea'], ['Agarre', 'Pinza desplegable'], ['Forma', 'Un cangrejo, por diseño'], ['Fabricación', 'Carcasa impresa en 3D, pantalla LCD, sensor de ultrasonidos']],
        },
    },
];

/* ---------- Experience & education ---------- */
const EXPERIENCE = [
    {
        id: 'ifs', when: { en: 'Apr – Aug 2026 · Madrid, Spain', fr: 'avr. – août 2026 · Madrid, Espagne', es: 'abr. – ago. 2026 · Madrid, España' },
        title: { en: 'AI / ML Engineering Intern, IFS', fr: 'Stage ingénieur IA / ML, IFS', es: 'Prácticas de ingeniería IA / ML, IFS' },
        bullets: {
            en: ['Built a semantic search / RAG path in an LLM-driven analytics service: Azure OpenAI embeddings, PostgreSQL / pgvector, answers grounded in retrieved evidence.', 'Deployed on Azure Kubernetes with Helm and Docker, 198 tests in CI.'],
            fr: ['Parcours de recherche sémantique / RAG dans un service d’analyse piloté par LLM : embeddings Azure OpenAI, PostgreSQL / pgvector, réponses fondées sur les notes retrouvées.', 'Déploiement sur Azure Kubernetes avec Helm et Docker, 198 tests en CI.'],
            es: ['Flujo de búsqueda semántica / RAG en un servicio de análisis basado en LLM: embeddings de Azure OpenAI, PostgreSQL / pgvector, respuestas basadas en las notas recuperadas.', 'Despliegue en Azure Kubernetes con Helm y Docker, 198 tests en CI.'],
        },
    },
    {
        id: 'esilv', when: { en: '2022 – 2027 · Paris-La Défense', fr: '2022 – 2027 · Paris-La Défense', es: '2022 – 2027 · París-La Défense' },
        title: { en: 'Master of Engineering, ESILV', fr: 'Diplôme d’ingénieur, ESILV', es: 'Título de ingeniero, ESILV' },
        text: {
            en: 'Major in Creative Technology (Institute for Future Technologies). Machine learning, deep learning, HCI, embedded systems.',
            fr: 'Majeure Creative Technology (Institute for Future Technologies). Machine learning, deep learning, IHM, systèmes embarqués.',
            es: 'Especialidad Creative Technology (Institute for Future Technologies). Machine learning, deep learning, HCI, sistemas embebidos.',
        },
    },
    {
        id: 'bde', when: { en: '2024 – 2025 · Pôle Léonard de Vinci', fr: '2024 – 2025 · Pôle Léonard de Vinci', es: '2024 – 2025 · Pôle Léonard de Vinci' },
        title: { en: 'Vice-President, Student Union (BDE Chronos)', fr: 'Vice-président du BDE Chronos', es: 'Vicepresidente de la asociación de estudiantes Chronos' },
        text: {
            en: 'Co-led events across 3 schools, up to 3,000 attendees. Logistics and budgets.',
            fr: 'Événements pour 3 écoles, jusqu’à 3 000 participants. Logistique et budgets.',
            es: 'Eventos para 3 escuelas, con hasta 3000 asistentes. Logística y presupuestos.',
        },
    },
    {
        id: 'purenat', when: { en: 'Jun – Sep 2024 · Biarritz', fr: 'juin – sept. 2024 · Biarritz', es: 'jun. – sept. 2024 · Biarritz' },
        title: { en: 'Engineering Intern, Purenat', fr: 'Stage ingénieur, Purenat', es: 'Prácticas de ingeniería, Purenat' },
        text: {
            en: 'Air-treatment start-up: security protocols and airflow engineering, with a look at fundraising and patent filing.',
            fr: 'Start-up de traitement de l’air : protocoles de sécurité et ingénierie aéraulique, avec un aperçu de la levée de fonds et du dépôt de brevet.',
            es: 'Start-up de tratamiento del aire: protocolos de seguridad e ingeniería aeráulica, con un primer contacto con la captación de fondos y las patentes.',
        },
    },
    {
        id: 'coast', when: { en: '2022 – 2025 · Biarritz & Paris', fr: '2022 – 2025 · Biarritz et Paris', es: '2022 – 2025 · Biarritz y París' },
        title: { en: 'Tutor, waiter, lifeguard', fr: 'Prof particulier, serveur, sauveteur', es: 'Profesor particular, camarero, socorrista' },
        text: {
            en: 'Math tutoring, a Michelin-starred restaurant, head waiter, lifeguard for hundreds of beachgoers. Pressure, but make it human.',
            fr: 'Cours de maths, un restaurant étoilé, chef de rang, sauveteur pour des centaines de baigneurs. De la pression, mais avec des humains.',
            es: 'Clases de matemáticas, un restaurante con estrella Michelin, jefe de rango, socorrista para cientos de bañistas. Presión, pero con personas.',
        },
    },
    {
        id: 'lakanal', when: { en: '2022 · Sceaux', fr: '2022 · Sceaux', es: '2022 · Sceaux' },
        title: { en: 'Baccalaureate, highest honors, Lycée Lakanal', fr: 'Baccalauréat, mention très bien, lycée Lakanal', es: 'Bachillerato con la mención más alta, Lycée Lakanal' },
        text: { en: 'Math, physics-chemistry, engineering sciences.', fr: 'Maths, physique-chimie, sciences de l’ingénieur.', es: 'Matemáticas, física y química, ciencias de la ingeniería.' },
    },
];

/* ---------- People also ask ---------- */
const PAA = {
    en: [
        ['Is Valentin available right now?', 'Yes, for a <b>6-month end-of-studies internship from February 2027</b>, in AI / R&D, software engineering or technical consulting. France or abroad.'],
        ['What did he build at IFS?', 'A semantic search (RAG) path in an LLM-driven analytics service: Azure OpenAI embeddings, pgvector, deployment on Azure Kubernetes and 198 tests in CI.'],
        ['Which languages does he speak?', 'French and Spanish as native languages, and professional English (B2+), his working language at IFS.'],
        ['Does he have a GitHub or live demos?', 'Yes: <a href="' + GITHUB + '" target="_blank" rel="noopener">github.com/BernadetValentin-design</a>. Three projects have a live demo: the LLM agent, the 3D scene editor and Zoltar.'],
        ['Is this website a real search engine?', 'No. It only knows about one person. But it knows him very well.'],
    ],
    fr: [
        ['Valentin est-il disponible ?', 'Oui, pour un <b>stage de fin d’études de 6 mois à partir de février 2027</b>, en IA / R&D, en ingénierie logicielle ou en conseil technique. En France ou à l’étranger.'],
        ['Qu’a-t-il construit chez IFS ?', 'Un parcours de recherche sémantique (RAG) dans un service d’analyse piloté par LLM : embeddings Azure OpenAI, pgvector, déploiement sur Azure Kubernetes et 198 tests en CI.'],
        ['Quelles langues parle-t-il ?', 'Français et espagnol en langue maternelle, anglais professionnel (B2+), sa langue de travail chez IFS.'],
        ['A-t-il un GitHub ou des démos en ligne ?', 'Oui : <a href="' + GITHUB + '" target="_blank" rel="noopener">github.com/BernadetValentin-design</a>. Trois projets ont une démo en ligne : l’agent LLM, l’éditeur de scène 3D et Zoltar.'],
        ['Ce site est-il un vrai moteur de recherche ?', 'Non. Il ne connaît qu’une seule personne. Mais il la connaît très bien.'],
    ],
    es: [
        ['¿Está disponible Valentin?', 'Sí, para unas <b>prácticas de fin de estudios de 6 meses a partir de febrero de 2027</b>, en IA / I+D, ingeniería de software o consultoría técnica. En Francia o en el extranjero.'],
        ['¿Qué construyó en IFS?', 'Un flujo de búsqueda semántica (RAG) en un servicio de análisis basado en LLM: embeddings de Azure OpenAI, pgvector, despliegue en Azure Kubernetes y 198 tests en CI.'],
        ['¿Qué idiomas habla?', 'Francés y español como lenguas maternas, e inglés profesional (B2+), su idioma de trabajo en IFS.'],
        ['¿Tiene GitHub o demos en línea?', 'Sí: <a href="' + GITHUB + '" target="_blank" rel="noopener">github.com/BernadetValentin-design</a>. Tres proyectos tienen demo en línea: el agente LLM, el editor de escenas 3D y Zoltar.'],
        ['¿Esta web es un buscador de verdad?', 'No. Solo conoce a una persona. Pero la conoce muy bien.'],
    ],
};

/* ---------- Skills (shown as a JSON file in the terminal) ---------- */
const SKILLS = [
    ['ai_data', ['Python', 'LLMs', 'Azure OpenAI', 'RAG', 'Embeddings', 'pgvector', 'Machine Learning', 'Neural Networks', 'SQL / PostgreSQL', 'Cube.dev']],
    ['cloud_mlops', ['Azure (AKS)', 'Docker', 'Kubernetes', 'Helm', 'KServe', 'CI/CD', 'pytest', 'Git', 'Jira', 'Confluence']],
    ['software', ['C#', 'TypeScript', 'React', 'FastAPI', 'HTML / CSS', 'WebGPU']],
    ['hardware', ['FPGA', 'Arduino', 'Embedded systems', 'Sensors', 'KiCad', 'SolidWorks', 'Fusion 360', 'Onshape', '3D printing']],
];
const SKILL_LANGS = {
    en: { fr: 'native', es: 'native', en: 'B2+' },
    fr: { fr: 'natif', es: 'natif', en: 'B2+' },
    es: { fr: 'nativo', es: 'nativo', en: 'B2+' },
};

/* ---------- Interests (stickers on the About tab) ---------- */
const INTERESTS = [
    ['fa-football', { en: 'Rugby', fr: 'Rugby', es: 'Rugby' }],
    ['fa-table-tennis-paddle-ball', { en: 'Tennis', fr: 'Tennis', es: 'Tenis' }],
    ['fa-person-swimming', { en: 'Triathlon', fr: 'Triathlon', es: 'Triatlón' }],
    ['fa-guitar', { en: 'Guitar', fr: 'Guitare', es: 'Guitarra' }],
    ['fa-dna', { en: 'Biotech', fr: 'Biotech', es: 'Biotech' }],
    ['fa-landmark', { en: 'Museums', fr: 'Musées', es: 'Museos' }],
    ['fa-water', { en: 'Biarritz', fr: 'Biarritz', es: 'Biarritz' }],
];
