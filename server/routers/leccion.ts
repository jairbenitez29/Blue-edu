import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const leccionRouter = router({
  // 1. Crear nueva lección (solo admin)
  create: publicProcedure
    .input(
      z.object({
        curso_id: z.string(),
        titulo: z.string().min(1, "El título es requerido"),
        contenido: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
        orden: z.number().min(1, "El orden debe ser al menos 1"),
        duracion_minutos: z.number().min(1, "La duración debe ser al menos 1 minuto"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const leccion = await ctx.prisma.leccion.create({
        data: {
          curso_id: input.curso_id,
          titulo: input.titulo,
          contenido: input.contenido,
          orden: input.orden,
          duracion_minutos: input.duracion_minutos,
        },
      });

      return leccion;
    }),

  // 2. Obtener todas las lecciones de un curso
  getByCurso: publicProcedure
    .input(z.object({ curso_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const lecciones = await ctx.prisma.leccion.findMany({
        where: { curso_id: input.curso_id },
        orderBy: { orden: "asc" },
      });

      return lecciones;
    }),

  // 3. Obtener una lección específica
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const leccion = await ctx.prisma.leccion.findUnique({
        where: { id: input.id },
        include: {
          curso: true,
        },
      });

      if (!leccion) {
        throw new Error("Lección no encontrada");
      }

      return leccion;
    }),

  // 4. Actualizar lección (solo admin)
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().optional(),
        contenido: z.string().optional(),
        orden: z.number().optional(),
        duracion_minutos: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const updated = await ctx.prisma.leccion.update({
        where: { id },
        data,
      });

      return updated;
    }),

  // 5. Eliminar lección (solo admin)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.leccion.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // 6. Reordenar lecciones de un curso
  reorder: publicProcedure
    .input(
      z.object({
        curso_id: z.string(),
        lecciones: z.array(
          z.object({
            id: z.string(),
            orden: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatePromises = input.lecciones.map((leccion) =>
        ctx.prisma.leccion.update({
          where: { id: leccion.id },
          data: { orden: leccion.orden },
        })
      );

      await Promise.all(updatePromises);

      return { success: true };
    }),
});
