import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const especieRouter = router({
  // 1. Crear nueva especie marina (solo admin)
  create: publicProcedure
    .input(
      z.object({
        nombre_comun: z.string().min(1, "El nombre común es requerido"),
        nombre_cientifico: z.string().min(1, "El nombre científico es requerido"),
        descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
        habitat: z.string().optional(),
        estado_conservacion: z.string().optional(),
        profundidad_min: z.number().optional(),
        profundidad_max: z.number().optional(),
        temperatura_min: z.number().optional(),
        temperatura_max: z.number().optional(),
        url_imagen: z.string().optional(),
        categoria: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const especie = await ctx.prisma.especieMarina.create({
        data: input,
      });

      return especie;
    }),

  // 2. Obtener todas las especies
  getAll: publicProcedure
    .input(
      z
        .object({
          categoria: z.string().optional(),
          estado_conservacion: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const especies = await ctx.prisma.especieMarina.findMany({
        where: {
          ...(input?.categoria && { categoria: input.categoria }),
          ...(input?.estado_conservacion && { estado_conservacion: input.estado_conservacion }),
        },
        orderBy: { nombre_comun: "asc" },
      });

      return especies;
    }),

  // 3. Obtener una especie específica
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const especie = await ctx.prisma.especieMarina.findUnique({
        where: { id: input.id },
      });

      if (!especie) {
        throw new Error("Especie no encontrada");
      }

      return especie;
    }),

  // 4. Actualizar especie (solo admin)
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre_comun: z.string().optional(),
        nombre_cientifico: z.string().optional(),
        descripcion: z.string().optional(),
        habitat: z.string().optional(),
        estado_conservacion: z.string().optional(),
        profundidad_min: z.number().optional(),
        profundidad_max: z.number().optional(),
        temperatura_min: z.number().optional(),
        temperatura_max: z.number().optional(),
        url_imagen: z.string().optional(),
        categoria: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const updated = await ctx.prisma.especieMarina.update({
        where: { id },
        data,
      });

      return updated;
    }),

  // 5. Eliminar especie (solo admin)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.especieMarina.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // 6. Obtener estadísticas por estado de conservación
  getConservationStats: publicProcedure.query(async ({ ctx }) => {
    const especies = await ctx.prisma.especieMarina.findMany({
      select: { estado_conservacion: true },
    });

    const stats = especies.reduce((acc: any, especie) => {
      const estado = especie.estado_conservacion || "Desconocido";
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    return stats;
  }),

  // 7. Buscar especies
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const especies = await ctx.prisma.especieMarina.findMany({
        where: {
          OR: [
            { nombre_comun: { contains: input.query } },
            { nombre_cientifico: { contains: input.query } },
            { descripcion: { contains: input.query } },
          ],
        },
        orderBy: { nombre_comun: "asc" },
      });

      return especies;
    }),
});
