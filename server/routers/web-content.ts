import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { extraerContenidoWeb } from "@/lib/web-extractor";

export const webContentRouter = router({
  // 1. Extraer contenido de una URL y guardarlo automáticamente
  extraerContenido: publicProcedure
    .input(
      z.object({
        url: z.string().url("URL inválida"),
      })
    )
    .query(async ({ ctx, input }) => {
      // 2. Extraer contenido de la URL
      const contenido = await extraerContenidoWeb(input.url);

      if (!contenido) {
        throw new Error("No se pudo extraer el contenido de esta URL");
      }

      // 3. Verificar si ya existe en la base de datos
      try {
        if (contenido.tipo === "articulo") {
          // 4. Buscar si ya existe un artículo con esta URL
          const existente = await ctx.prisma.articuloInvestigacion.findFirst({
            where: {
              OR: [
                { fuente: input.url },
                { titulo: contenido.titulo },
              ],
            },
          });

          // 5. Si no existe, guardarlo
          if (!existente) {
            await ctx.prisma.articuloInvestigacion.create({
              data: {
                titulo: contenido.titulo,
                autor: contenido.fuente,
                resumen: contenido.descripcion,
                contenido: contenido.contenido,
                categoria: "Web - No verificado",
                fecha_publicacion: new Date(),
                fuente: input.url,
                palabras_clave: "Web, Externo",
                activo: false, // Desactivado por defecto hasta que admin lo verifique
                vistas: 1,
              },
            });

            console.log(`✅ Artículo guardado: ${contenido.titulo}`);
          } else {
            // 6. Si existe, incrementar vistas
            await ctx.prisma.articuloInvestigacion.update({
              where: { id: existente.id },
              data: {
                vistas: {
                  increment: 1,
                },
              },
            });

            console.log(`📊 Vista registrada para: ${contenido.titulo}`);
          }
        } else if (contenido.tipo === "especie") {
          // 7. Intentar extraer nombre científico del contenido
          const nombreCientifico = extraerNombreCientifico(contenido.contenido) || "No especificado";

          // 8. Buscar si ya existe una especie con este nombre
          const existente = await ctx.prisma.especieMarina.findFirst({
            where: {
              OR: [
                { nombre_comun: contenido.titulo },
                { nombre_cientifico: nombreCientifico },
              ],
            },
          });

          // 9. Si no existe, guardarla
          if (!existente) {
            await ctx.prisma.especieMarina.create({
              data: {
                nombre_comun: contenido.titulo,
                nombre_cientifico: nombreCientifico,
                descripcion: contenido.descripcion,
                habitat: contenido.contenido.substring(0, 500),
                estado_conservacion: null,
                categoria: "Web - No verificado",
                profundidad_min: null,
                profundidad_max: null,
                temperatura_min: null,
                temperatura_max: null,
                url_imagen: null,
              },
            });

            console.log(`✅ Especie guardada: ${contenido.titulo}`);
          } else {
            console.log(`📊 Especie ya existe: ${contenido.titulo}`);
          }
        }
      } catch (error) {
        // 10. Si hay error al guardar, solo registrar pero devolver el contenido
        console.error("Error al guardar contenido en BD:", error);
      }

      // 11. Devolver el contenido para mostrarlo
      return contenido;
    }),
});

// 12. Función auxiliar para extraer nombre científico del texto
function extraerNombreCientifico(texto: string): string | null {
  // Buscar patrones como "Nombre científico: Genus species" o texto en cursiva
  const patrones = [
    /nombre\s+científico[:\s]+([A-Z][a-z]+\s+[a-z]+)/i,
    /scientific\s+name[:\s]+([A-Z][a-z]+\s+[a-z]+)/i,
    /\(([A-Z][a-z]+\s+[a-z]+)\)/,
    /\b([A-Z][a-z]+\s+[a-z]+)\b/,
  ];

  for (const patron of patrones) {
    const match = texto.match(patron);
    if (match && match[1]) {
      // Validar que sea un nombre científico válido (dos palabras, primera con mayúscula)
      const nombre = match[1].trim();
      const partes = nombre.split(" ");
      if (partes.length === 2 && partes[0][0] === partes[0][0].toUpperCase()) {
        return nombre;
      }
    }
  }

  return null;
}
