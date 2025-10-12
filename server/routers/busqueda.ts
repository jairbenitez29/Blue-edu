// 1. Importar dependencias necesarias
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { buscarEnGoogle } from "@/lib/google-search";

export const busquedaRouter = router({
  // Búsqueda global en toda la plataforma
  global: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "La búsqueda debe tener al menos 1 carácter"),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = input.query;

      // 1. Buscar en artículos de investigación
      const articulos = await ctx.prisma.articuloInvestigacion.findMany({
        where: {
          OR: [
            { titulo: { contains: query } },
            { resumen: { contains: query } },
            { contenido: { contains: query } },
            { palabras_clave: { contains: query } },
            { autor: { contains: query } },
          ],
          activo: true,
        },
        take: 5,
        orderBy: { fecha_publicacion: "desc" },
      });

      // 2. Buscar en especies marinas
      const especies = await ctx.prisma.especieMarina.findMany({
        where: {
          OR: [
            { nombre_comun: { contains: query } },
            { nombre_cientifico: { contains: query } },
            { descripcion: { contains: query } },
            { habitat: { contains: query } },
          ],
        },
        take: 5,
        orderBy: { nombre_comun: "asc" },
      });

      // 3. Buscar en ecosistemas del simulador
      const ecosistemas = await ctx.prisma.ecosistema.findMany({
        where: {
          nombre: { contains: query },
          activo: true,
        },
        take: 3,
        include: {
          usuario: {
            select: {
              nombre: true,
            },
          },
        },
      });

      return {
        articulos: articulos.map((a) => ({
          id: a.id,
          tipo: "articulo" as const,
          titulo: a.titulo,
          descripcion: a.resumen,
          categoria: a.categoria,
          fecha: a.fecha_publicacion,
        })),
        especies: especies.map((e) => ({
          id: e.id,
          tipo: "especie" as const,
          titulo: e.nombre_comun,
          descripcion: e.nombre_cientifico,
          categoria: e.categoria || "Sin categoría",
          estado: e.estado_conservacion,
        })),
        ecosistemas: ecosistemas.map((eco) => ({
          id: eco.id,
          tipo: "ecosistema" as const,
          titulo: eco.nombre,
          descripcion: `Por ${eco.usuario.nombre}`,
          salud: eco.salud_coral,
        })),
        total:
          articulos.length +
          especies.length +
          ecosistemas.length,
      };
    }),

  // Búsqueda rápida (solo títulos, más rápida)
  rapida: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = input.query;

      const [articulos, especies] = await Promise.all([
        ctx.prisma.articuloInvestigacion.findMany({
          where: {
            titulo: { contains: query },
            activo: true,
          },
          select: {
            id: true,
            titulo: true,
            categoria: true,
          },
          take: 3,
        }),
        ctx.prisma.especieMarina.findMany({
          where: {
            OR: [
              { nombre_comun: { contains: query } },
              { nombre_cientifico: { contains: query } },
            ],
          },
          select: {
            id: true,
            nombre_comun: true,
            nombre_cientifico: true,
          },
          take: 3,
        }),
      ]);

      return {
        articulos,
        especies,
      };
    }),

  // 2. Búsqueda global híbrida (Base de datos local + Google web)
  globalWeb: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "La búsqueda debe tener al menos 1 carácter"),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = input.query;

      // 3. Ejecutar búsquedas en paralelo (base de datos + Google)
      const [resultadosLocales, resultadosWeb] = await Promise.all([
        // 4. Búsqueda en base de datos local
        (async () => {
          const [articulos, especies, ecosistemas] = await Promise.all([
            // 5. Buscar artículos
            ctx.prisma.articuloInvestigacion.findMany({
              where: {
                OR: [
                  { titulo: { contains: query } },
                  { resumen: { contains: query } },
                  { contenido: { contains: query } },
                  { palabras_clave: { contains: query } },
                  { autor: { contains: query } },
                ],
                activo: true,
              },
              take: 3,
              orderBy: { fecha_publicacion: "desc" },
            }),
            // 6. Buscar especies
            ctx.prisma.especieMarina.findMany({
              where: {
                OR: [
                  { nombre_comun: { contains: query } },
                  { nombre_cientifico: { contains: query } },
                  { descripcion: { contains: query } },
                  { habitat: { contains: query } },
                ],
              },
              take: 3,
              orderBy: { nombre_comun: "asc" },
            }),
            // 7. Buscar ecosistemas
            ctx.prisma.ecosistema.findMany({
              where: {
                nombre: { contains: query },
                activo: true,
              },
              take: 2,
              include: {
                usuario: {
                  select: {
                    nombre: true,
                  },
                },
              },
            }),
          ]);

          return {
            articulos: articulos.map((a) => ({
              id: a.id,
              tipo: "articulo" as const,
              titulo: a.titulo,
              descripcion: a.resumen,
              categoria: a.categoria,
              fecha: a.fecha_publicacion,
            })),
            especies: especies.map((e) => ({
              id: e.id,
              tipo: "especie" as const,
              titulo: e.nombre_comun,
              descripcion: e.nombre_cientifico,
              categoria: e.categoria || "Sin categoría",
              estado: e.estado_conservacion,
            })),
            ecosistemas: ecosistemas.map((eco) => ({
              id: eco.id,
              tipo: "ecosistema" as const,
              titulo: eco.nombre,
              descripcion: `Por ${eco.usuario.nombre}`,
              salud: eco.salud_coral,
            })),
          };
        })(),
        // 8. Búsqueda en Google (resultados web)
        buscarEnGoogle(query),
      ]);

      // 9. Retornar resultados combinados
      return {
        local: resultadosLocales,
        web: resultadosWeb,
        totalLocal:
          resultadosLocales.articulos.length +
          resultadosLocales.especies.length +
          resultadosLocales.ecosistemas.length,
        totalWeb: resultadosWeb.length,
      };
    }),
});
