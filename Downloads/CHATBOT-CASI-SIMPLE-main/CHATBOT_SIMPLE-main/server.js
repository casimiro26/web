require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:5173";

// === OLLAMA CLOUD CONFIG ===
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "https://ollama.com";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3-coder:480b-cloud";

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// === CORS ===
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  WEBSITE_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// === CONEXIÓN A MONGODB ===
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB (Sr_web_2)"))
  .catch((err) => console.error("Error MongoDB:", err.message));

// === INFO TIENDA ===
const STORE_INFO = {
  ubicacion: "Huánuco",
  direccion:
    "Jr. Ayacucho N.º 574, oficina 4, galería Millenium, a media cuadra del Mercado Modelo de Huánuco. Y sí, ¡estamos en el mejor clima del mundo: la región de Huánuco!",
  horario: "Lunes a sábado, de 8:00 a.m. a 8:00 p.m.",
  contactos: {
    productos: "923 389 988",
    servicio: "975 167 294",
  },
  sobre: "Soy Sr. Robot, una tienda tecnológica dedicada a ofrecer productos originales y servicios de soporte técnico confiables.",
  servicios: [
    "Reparación de hardware",
    "Reparación de software",
    "Instalación de programas",
    "Asesoría tecnológica personalizada",
  ],
  garantias: {
    "Pantallas de laptops": "4 meses",
    Impresoras: "8 meses",
    Laptops: "1 año",
    "PC": "1 año",
    Teclados: "2 meses",
    Mouse: "2 meses",
    Coolers: "2 meses",
    Baterías: "3 meses",
    Cables: "1 mes",
    Cargadores: "1 mes",
    "Placas y componentes": "1 mes",
    "Otros componentes": "2 meses",
    // === NUEVAS GARANTÍAS ===
    Audífonos: "3 meses",
    Parlantes: "6 meses",
    "Memorias USB/SSD": "6 meses",
    "Ventiladores USB": "1 mes",
  },
  garantia_explicacion:
    "La garantía cubre fallas de fábrica. Si el producto tiene golpes, caídas o daños por mal uso, no se cubre. Pero si falla sin daños físicos, será atendido correctamente y sin costo.",
};

// === FALLBACK DATA ===
function getFallbackData() {
  console.log("ADVERTENCIA: Usando fallback (DB vacía)");
  return {
    products: [],
    categories: [
      { id_categoria: 1, nombre: "Laptops", descripcion: "Computadoras portátiles" },
      { id_categoria: 2, nombre: "Smartphones", descripcion: "Teléfonos inteligentes" },
      { id_categoria: 3, nombre: "Tablets", descripcion: "Tabletas y iPads" },
      { id_categoria: 4, nombre: "Accesorios", descripcion: "Accesorios tecnológicos" },
    ],
  };
}

// === CARGAR DATOS REALES ===
async function getStoreData() {
  try {
    if (!mongoose.connection.readyState)
      throw new Error("MongoDB no conectado");
    const db = mongoose.connection.db;
    const [products, categories] = await Promise.all([
      db.collection("productos").find({}).toArray(),
      db.collection("categorias").find({}).toArray(),
    ]);

    if (products.length > 0 || categories.length > 0) {
      console.log(
        `Datos reales: ${products.length} productos, ${categories.length} categorías`
      );
      const cleanedProducts = products.map((doc) => {
        const { contrasena, ...clean } = doc;
        const imagenes =
          doc.imagenes || [doc.imagen || doc.image].filter(Boolean) || [];
        return {
          ...clean,
          specs: doc.characteristics || "No especificado",
          imagenes,
        };
      });
      const cleanedCategories = categories.map((doc) => {
        const { contrasena, ...clean } = doc;
        return clean;
      });
      return { products: cleanedProducts, categories: cleanedCategories };
    }
    return getFallbackData();
  } catch (err) {
    console.error("Error cargando datos:", err.message);
    return getFallbackData();
  }
}

// === SCRAPEAR WEB ===
async function scrapeWebsite(url) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });
    const $ = cheerio.load(data);
    return $("body").text().replace(/\s+/g, " ").trim().substring(0, 4000);
  } catch (err) {
    console.warn("Scrape falló:", err.message);
    return "Sitio web no disponible.";
  }
}

// === JWT ===
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
};

// === LLAMADA A OLLAMA CLOUD ===
async function callOllama(prompt) {
  if (!OLLAMA_API_KEY) throw new Error("OLLAMA_API_KEY no configurada");
  if (!OLLAMA_MODEL) throw new Error("OLLAMA_MODEL no configurado");

  try {
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 600,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${OLLAMA_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const content = response.data.response;
    if (!content) throw new Error("Respuesta vacía de Ollama");
    return content.trim();
  } catch (err) {
    const msg = err.response?.data?.error || err.message;
    console.error("Ollama Cloud Error:", msg);
    throw new Error("Asistente no disponible. Intenta más tarde.");
  }
}

// === HISTORIAL POR SESIÓN (memoria ligera) ===
const chatHistory = new Map(); // { sessionId: { name: "Jhan", greeted: true, context: [...] } }

// === ENDPOINTS ===

// 1. Bienvenida
app.get("/bienvenida", (req, res) => {
  res.json({
    response: `¡Hola! Soy Sr. Robot, tu asesor tecnológico número 1 en productos originales. ¿Cómo te puedo apoyar hoy?`,
  });
});

// 2. Chatbot
app.post("/chat", async (req, res) => {
  const { message, sessionId = "default" } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Mensaje requerido" });
  }

  try {
    const storeData = await getStoreData();
    const webContent = await scrapeWebsite(WEBSITE_URL);

    // === GESTIÓN DE SESIÓN ===
    if (!chatHistory.has(sessionId)) {
      chatHistory.set(sessionId, { name: null, greeted: false, context: [] });
    }
    const session = chatHistory.get(sessionId);

    // === DETECTAR NOMBRE ===
    const nameMatch = message.match(/(?:hola|hi|buenas).*\bsoy\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/i);
    if (nameMatch && !session.greeted) {
      session.name = nameMatch[1].trim();
      session.greeted = true;
    }

    // === PROMPT COMPLETO (Sr. Robot) ===
    const prompt = `Eres "Sr. Robot", asistente de una tienda tecnológica en Huánuco.

${session.greeted ? `El usuario se llama "${session.name}". Ya saludaste, NO repitas el saludo.` : `Si dice "Hola soy [Nombre]", saluda solo una vez con su nombre.`}

REGLAS ESTRICTAS:
- Solo usa datos reales de productos, categorías, precios, garantías.
- Corrige errores de escritura: "lapto" → laptop, "caragador" → cargador, etc.
- Si no existe el producto → “Lo siento, por ahora no tengo información sobre ese producto. ¿Deseas que te muestre otra categoría disponible?”
- Usa emojis suaves, tono cálido, frases cortas.
- Humor ligero si el usuario bromea.
- NO repitas saludos.

INFORMACIÓN DE LA TIENDA:
- Dirección: ${STORE_INFO.direccion}
- Horario: ${STORE_INFO.horario}
- Productos: ${STORE_INFO.contactos.productos}
- Servicio técnico: ${STORE_INFO.contactos.servicio}
- Sobre nosotros: ${STORE_INFO.sobre}
- Servicios: ${STORE_INFO.servicios.join(", ")}
- Garantías: ${JSON.stringify(STORE_INFO.garantias, null, 2)}
- Cómo funciona garantía: "${STORE_INFO.garantia_explicacion}"
- Envíos: “Hacemos envíos a todo Huánuco y regiones cercanas. Costo según distancia, consulta al 923 389 988.”
- Fotos: “Puedo enviarte fotos reales por WhatsApp. ¿Me das tu número o el modelo exacto?”

PRODUCTOS (máx 30):
${JSON.stringify(storeData.products.slice(0, 30), null, 2)}

CATEGORÍAS:
${JSON.stringify(storeData.categories, null, 2)}

PREGUNTA DEL USUARIO: "${message}"

Respuesta (máx 3 líneas, 1 emoji al inicio):`;

    const botResponse = await callOllama(prompt);

    // === IMÁGENES ===
    let images = [];
    let showImages = false;
    const wantsImage = /imagen|foto|ver|muestra|mostrar|visual|foto|photo/i.test(message);
    const wantsAll = /todos.*(producto|lista|cat[áa]logo)/i.test(message);

    if (wantsImage || wantsAll) {
      storeData.products.forEach((p) => {
        if (p.imagenes?.length > 0) images.push(...p.imagenes);
      });
      images = [...new Set(images)].slice(0, 12);
      showImages = true;
    }

    // === GUARDAR CONTEXTO ===
    session.context.push({ user: message, bot: botResponse });
    if (session.context.length > 5) session.context.shift();

    res.json({
      response: botResponse,
      images,
      showImages,
      storeInfo: {
        ubicacion: STORE_INFO.ubicacion,
        direccion: STORE_INFO.direccion,
        horario: STORE_INFO.horario,
        contactos: STORE_INFO.contactos,
      },
    });
  } catch (err) {
    console.error("Error en /chat:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. Imágenes
app.post("/images", async (req, res) => {
  const { productName, limit = 10 } = req.body;
  try {
    const { products } = await getStoreData();
    let images = [];

    if (productName && productName !== "todos") {
      const lower = productName.toLowerCase();
      products.forEach((p) => {
        if (p.nombre?.toLowerCase().includes(lower)) {
          images.push(...(p.imagenes || []));
        }
      });
    } else {
      products.forEach((p) => images.push(...(p.imagenes || [])));
    }

    images = [...new Set(images)].slice(0, limit);

    res.json({
      product: productName || "Todos",
      images,
      total: images.length,
      message:
        images.length > 0 ? `${images.length} imagen(es)` : "Sin imágenes",
    });
  } catch (err) {
    res.status(500).json({ error: "Error al cargar imágenes" });
  }
});

// 4. Productos
app.get("/productos", async (req, res) => {
  try {
    const { products } = await getStoreData();
    const list = products.map((p) => ({
      id: p.id || p._id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagenes?.[0] || null,
      totalImagenes: p.imagenes?.length || 0,
    }));
    res.json({ productos: list, total: list.length });
  } catch (err) {
    res.status(500).json({ error: "Error al cargar productos" });
  }
});

// 5. Garantías
app.get("/garantias", (req, res) => {
  res.json({ garantias: STORE_INFO.garantias });
});

// 6. Tienda
app.get("/tienda", (req, res) => {
  res.json({
    nombre: "Sr Robot",
    ubicacion: STORE_INFO.ubicacion,
    direccion: STORE_INFO.direccion,
    horario: STORE_INFO.horario,
    contactos: STORE_INFO.contactos,
  });
});

// 7. Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "pass") {
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, {
      expiresIn: "2h",
    });
    res.json({ token, message: "Login OK" });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});

// 8. Admin Data
app.get("/admin/data", verifyToken, async (req, res) => {
  const data = await getStoreData();
  res.json({
    data,
    storeInfo: STORE_INFO,
    source: data.products.length > 0 ? "MongoDB Real" : "Fallback",
    timestamp: new Date().toLocaleString("es-PE"),
  });
});

// === INICIAR ===
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Sr. Robot activa en puerto ${PORT}`);
  console.log(`Modelo: ${OLLAMA_MODEL} (Ollama Cloud)`);
  console.log(`API Key: ${OLLAMA_API_KEY ? "Configurada" : "Falta"}`);
  console.log(`URL web: ${WEBSITE_URL}`);
});