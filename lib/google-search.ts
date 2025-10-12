// 1. Importar Prisma Client para acceder al caché
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 2. Interfaz para los resultados de búsqueda de Google
export interface ResultadoGoogleSearch {
  titulo: string;
  url: string;
  descripcion: string;
  fuente: string;
}

// 3. Función principal para buscar en Google Custom Search API
export async function buscarEnGoogle(query: string): Promise<ResultadoGoogleSearch[]> {
  try {
    console.log('🔍 [Google Search] Iniciando búsqueda para:', query);

    // 4. Verificar primero si existe en caché
    const ahora = new Date();
    const cacheExistente = await prisma.cacheBusqueda.findUnique({
      where: { query: query.toLowerCase() },
    });

    // 5. Si existe en caché y no ha expirado, devolver resultados del caché
    if (cacheExistente && cacheExistente.fecha_expiracion > ahora) {
      console.log('✅ [Google Search] Resultados encontrados en caché (no expiraron)');
      const resultadosCache: ResultadoGoogleSearch[] = JSON.parse(cacheExistente.resultados);
      console.log('✅ [Google Search] Retornando', resultadosCache.length, 'resultados desde caché');
      return resultadosCache;
    }

    console.log('⚠️ [Google Search] No hay caché válido, consultando Google API...');

    // 6. Obtener credenciales del archivo .env
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    console.log('🔑 [Google Search] API Key presente:', !!apiKey);
    console.log('🆔 [Google Search] Search Engine ID presente:', !!searchEngineId);

    // 7. Validar que existan las credenciales
    if (!apiKey || !searchEngineId) {
      console.error('❌ [Google Search] Faltan credenciales de Google Search API en .env');
      return [];
    }

    // 5. Construir la URL de la API de Google Custom Search
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('cx', searchEngineId);
    url.searchParams.append('q', query);
    url.searchParams.append('num', '5'); // Máximo 5 resultados
    url.searchParams.append('lr', 'lang_es'); // Idioma español preferido
    url.searchParams.append('safe', 'active'); // Búsqueda segura activada

    // 6. Realizar la petición a la API de Google
    console.log('📡 [Google Search] URL de petición:', url.toString().replace(apiKey, 'API_KEY_OCULTA'));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    // 7. Validar respuesta exitosa
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Google Search] Error en Google Search API:', response.status, response.statusText);
      console.error('❌ [Google Search] Detalle del error:', errorText);
      return [];
    }

    // 8. Parsear la respuesta JSON
    const data = await response.json();
    console.log('✅ [Google Search] Respuesta recibida. Items encontrados:', data.items?.length || 0);

    // 9. Verificar si hay resultados
    if (!data.items || data.items.length === 0) {
      console.log('⚠️ [Google Search] No se encontraron resultados para:', query);
      return [];
    }

    // 10. Formatear los resultados al formato de nuestra interfaz
    const resultados: ResultadoGoogleSearch[] = data.items.map((item: any) => ({
      titulo: item.title || 'Sin título',
      url: item.link || '',
      descripcion: item.snippet || 'Sin descripción disponible',
      fuente: extraerDominio(item.link || '')
    }));

    console.log('✅ [Google Search] Retornando', resultados.length, 'resultados formateados');

    // 11. Guardar resultados en caché para futuras búsquedas
    try {
      const fechaExpiracion = new Date();
      fechaExpiracion.setDate(fechaExpiracion.getDate() + 7); // Expira en 7 días

      await prisma.cacheBusqueda.upsert({
        where: { query: query.toLowerCase() },
        update: {
          resultados: JSON.stringify(resultados),
          fecha_expiracion: fechaExpiracion,
        },
        create: {
          query: query.toLowerCase(),
          resultados: JSON.stringify(resultados),
          fecha_expiracion: fechaExpiracion,
        },
      });

      console.log('💾 [Google Search] Resultados guardados en caché (expiran en 7 días)');
    } catch (errorCache) {
      console.error('⚠️ [Google Search] No se pudo guardar en caché:', errorCache);
      // No bloqueamos la respuesta si falla el guardado en caché
    }

    return resultados;

  } catch (error) {
    console.error('❌ [Google Search] Error al buscar en Google:', error);
    return [];
  }
}

// 11. Función auxiliar para extraer el dominio de una URL
function extraerDominio(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Fuente desconocida';
  }
}
