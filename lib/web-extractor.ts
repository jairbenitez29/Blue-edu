// 1. Interfaz para el contenido extraído
export interface ContenidoWeb {
  titulo: string;
  descripcion: string;
  contenido: string;
  url: string;
  fuente: string;
  tipo: "articulo" | "especie";
}

// 2. Función para extraer contenido de una URL
export async function extraerContenidoWeb(url: string): Promise<ContenidoWeb | null> {
  try {
    // 3. Realizar petición a la URL
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Error al obtener la página:', response.status);
      return null;
    }

    // 4. Obtener el HTML
    const html = await response.text();

    // 5. Extraer información básica usando regex y manipulación de strings
    const titulo = extraerTitulo(html, url);
    const descripcion = extraerDescripcion(html);
    const contenido = extraerContenidoPrincipal(html);
    const fuente = extraerDominio(url);
    const tipo = detectarTipo(url, html);

    return {
      titulo,
      descripcion,
      contenido,
      url,
      fuente,
      tipo,
    };
  } catch (error) {
    console.error('Error al extraer contenido:', error);
    return null;
  }
}

// 6. Función para extraer el título
function extraerTitulo(html: string, url: string): string {
  // Buscar tag <title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }

  // Buscar meta og:title
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    return ogTitleMatch[1].trim();
  }

  // Buscar primer h1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return limpiarHTML(h1Match[1]);
  }

  return 'Sin título';
}

// 7. Función para extraer la descripción
function extraerDescripcion(html: string): string {
  // Buscar meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescMatch && metaDescMatch[1]) {
    return metaDescMatch[1].trim();
  }

  // Buscar meta og:description
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDescMatch && ogDescMatch[1]) {
    return ogDescMatch[1].trim();
  }

  // Buscar primer párrafo
  const pMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
  if (pMatch && pMatch[1]) {
    return limpiarHTML(pMatch[1]).substring(0, 200) + '...';
  }

  return 'Sin descripción disponible';
}

// 8. Función para extraer el contenido principal
function extraerContenidoPrincipal(html: string): string {
  // Buscar article, main, o div con clase content
  let contenido = '';

  // Intentar extraer de <article>
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch && articleMatch[1]) {
    contenido = articleMatch[1];
  } else {
    // Intentar extraer de <main>
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch && mainMatch[1]) {
      contenido = mainMatch[1];
    } else {
      // Extraer todos los párrafos
      const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
      if (paragraphs && paragraphs.length > 0) {
        contenido = paragraphs.slice(0, 10).join('\n\n');
      }
    }
  }

  // 9. Limpiar el contenido
  if (contenido) {
    // Remover scripts y styles
    contenido = contenido.replace(/<script[\s\S]*?<\/script>/gi, '');
    contenido = contenido.replace(/<style[\s\S]*?<\/style>/gi, '');

    // Convertir algunos tags a texto
    contenido = contenido.replace(/<br\s*\/?>/gi, '\n');
    contenido = contenido.replace(/<\/p>/gi, '\n\n');
    contenido = contenido.replace(/<h[1-6][^>]*>/gi, '\n\n**');
    contenido = contenido.replace(/<\/h[1-6]>/gi, '**\n\n');

    // Remover todos los tags HTML
    contenido = limpiarHTML(contenido);

    // Limpiar espacios múltiples
    contenido = contenido.replace(/\n{3,}/g, '\n\n');
    contenido = contenido.trim();

    return contenido.substring(0, 5000); // Limitar a 5000 caracteres
  }

  return 'No se pudo extraer el contenido de esta página.';
}

// 10. Función para limpiar HTML
function limpiarHTML(texto: string): string {
  return texto
    .replace(/<[^>]+>/g, '') // Remover tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// 11. Función para extraer dominio
function extraerDominio(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Fuente desconocida';
  }
}

// 12. Función para detectar el tipo de contenido
function detectarTipo(url: string, html: string): "articulo" | "especie" {
  const urlLower = url.toLowerCase();
  const htmlLower = html.toLowerCase();

  // Detectar si es sobre especies
  if (
    urlLower.includes('species') ||
    urlLower.includes('especie') ||
    urlLower.includes('animal') ||
    urlLower.includes('wildlife') ||
    urlLower.includes('iucn') ||
    urlLower.includes('wikipedia') ||
    htmlLower.includes('nombre científico') ||
    htmlLower.includes('scientific name') ||
    htmlLower.includes('conservación') ||
    htmlLower.includes('conservation status')
  ) {
    return 'especie';
  }

  return 'articulo';
}

// 13. Función simplificada para búsqueda específica de especies
export async function buscarEspecieWeb(nombreEspecie: string): Promise<ContenidoWeb[]> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.error('Faltan credenciales de Google Search API');
      return [];
    }

    // Construir query específico para especies marinas
    const query = `${nombreEspecie} especie marina nombre científico hábitat`;

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('cx', searchEngineId);
    url.searchParams.append('q', query);
    url.searchParams.append('num', '3');
    url.searchParams.append('lr', 'lang_es');

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('Error en Google Search API:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Extraer contenido de los primeros resultados
    const resultados: ContenidoWeb[] = [];

    for (const item of data.items.slice(0, 2)) {
      const contenido = await extraerContenidoWeb(item.link);
      if (contenido) {
        resultados.push(contenido);
      }
    }

    return resultados;
  } catch (error) {
    console.error('Error al buscar especie en web:', error);
    return [];
  }
}

// 14. Función simplificada para búsqueda de artículos científicos
export async function buscarArticuloWeb(tema: string): Promise<ContenidoWeb[]> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      console.error('Faltan credenciales de Google Search API');
      return [];
    }

    // Construir query específico para artículos científicos
    const query = `${tema} investigación científica océano marina ODS 14`;

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('cx', searchEngineId);
    url.searchParams.append('q', query);
    url.searchParams.append('num', '3');
    url.searchParams.append('lr', 'lang_es');

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('Error en Google Search API:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Extraer contenido de los primeros resultados
    const resultados: ContenidoWeb[] = [];

    for (const item of data.items.slice(0, 2)) {
      const contenido = await extraerContenidoWeb(item.link);
      if (contenido) {
        resultados.push(contenido);
      }
    }

    return resultados;
  } catch (error) {
    console.error('Error al buscar artículo en web:', error);
    return [];
  }
}
