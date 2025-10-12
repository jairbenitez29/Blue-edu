import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const progressRouter = router({
  // 1. Obtener progreso de un usuario
  getByUser: publicProcedure
    .input(z.object({ usuario_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.prisma.progreso.findMany({
        where: { usuario_id: input.usuario_id },
        orderBy: { actualizado_en: "desc" },
      });

      return progress;
    }),

  // 2. Actualizar progreso de un curso
  update: publicProcedure
    .input(
      z.object({
        usuario_id: z.string(),
        nombre_curso: z.string(),
        instructor: z.string(),
        porcentaje_progreso: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const completado_en =
        input.porcentaje_progreso === 100 ? new Date() : null;

      const progress = await ctx.prisma.progreso.upsert({
        where: {
          usuario_id_nombre_curso: {
            usuario_id: input.usuario_id,
            nombre_curso: input.nombre_curso,
          },
        },
        update: {
          porcentaje_progreso: input.porcentaje_progreso,
          completado_en,
        },
        create: {
          usuario_id: input.usuario_id,
          nombre_curso: input.nombre_curso,
          instructor: input.instructor,
          porcentaje_progreso: input.porcentaje_progreso,
          completado_en,
        },
      });

      return progress;
    }),

  // 3. Calcular progreso general del usuario
  getOverallProgress: publicProcedure
    .input(z.object({ usuario_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const allProgress = await ctx.prisma.progreso.findMany({
        where: { usuario_id: input.usuario_id },
      });

      if (allProgress.length === 0) {
        return { overall: 0, completed: 0, total: 0 };
      }

      const total = allProgress.length;
      const completed = allProgress.filter((p) => p.porcentaje_progreso === 100).length;
      const overall =
        allProgress.reduce((sum, p) => sum + p.porcentaje_progreso, 0) / total;

      return {
        overall: Math.round(overall),
        completed,
        total,
      };
    }),
});
