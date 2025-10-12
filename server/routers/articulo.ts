import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const articuloRouter = router({
  // 1. Crear nuevo artículo de investigación (solo admin)
  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(1, "El título es requerido"),
        autor: z.string().min(1, "El autor es requerido"),
        resumen: z.string().min(10, "El resumen debe tener al menos 10 caracteres"),
        contenido: z.string().min(50, "El contenido debe tener al menos 50 caracteres"),
        categoria: z.string().min(1, "La categoría es requerida"),
        url_imagen: z.string().optional(),
        fuente: z.string().optional(),
        palabras_clave: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const articulo = await ctx.prisma.articuloInvestigacion.create({
        data: {
          titulo: input.titulo,
          autor: input.autor,
          resumen: input.resumen,
          contenido: input.contenido,
          categoria: input.categoria,
          url_imagen: input.url_imagen,
          fuente: input.fuente,
          palabras_clave: input.palabras_clave,
        },
      });

      return articulo;
    }),

  // 2. Obtener todos los artículos
  getAll: publicProcedure
    .input(
      z
        .object({
          categoria: z.string().optional(),
          activo: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const articulos = await ctx.prisma.articuloInvestigacion.findMany({
        where: {
          ...(input?.categoria && { categoria: input.categoria }),
          ...(input?.activo !== undefined && { activo: input.activo }),
        },
        orderBy: { fecha_publicacion: "desc" },
      });

      return articulos;
    }),

  // 3. Obtener un artículo específico
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const articulo = await ctx.prisma.articuloInvestigacion.findUnique({
        where: { id: input.id },
      });

      if (!articulo) {
        throw new Error("Artículo no encontrado");
      }

      // Incrementar contador de vistas
      await ctx.prisma.articuloInvestigacion.update({
        where: { id: input.id },
        data: { vistas: { increment: 1 } },
      });

      return articulo;
    }),

  // 4. Actualizar artículo (solo admin)
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().optional(),
        autor: z.string().optional(),
        resumen: z.string().optional(),
        contenido: z.string().optional(),
        categoria: z.string().optional(),
        url_imagen: z.string().optional(),
        fuente: z.string().optional(),
        palabras_clave: z.string().optional(),
        activo: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const updated = await ctx.prisma.articuloInvestigacion.update({
        where: { id },
        data,
      });

      return updated;
    }),

  // 5. Eliminar artículo (solo admin)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.articuloInvestigacion.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // 6. Obtener categorías disponibles
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const articulos = await ctx.prisma.articuloInvestigacion.findMany({
      select: { categoria: true },
      distinct: ["categoria"],
    });

    return articulos.map((a) => a.categoria);
  }),

  // 7. Buscar artículos
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const articulos = await ctx.prisma.articuloInvestigacion.findMany({
        where: {
          OR: [
            { titulo: { contains: input.query } },
            { resumen: { contains: input.query } },
            { contenido: { contains: input.query } },
            { palabras_clave: { contains: input.query } },
          ],
          activo: true,
        },
        orderBy: { fecha_publicacion: "desc" },
      });

      return articulos;
    }),
});
