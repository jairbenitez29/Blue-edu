import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const cursoRouter = router({
  // 1. Crear nuevo curso (solo admin)
  create: publicProcedure
    .input(
      z.object({
        nombre: z.string().min(1, "El nombre es requerido"),
        instructor: z.string().min(1, "El instructor es requerido"),
        descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
        categoria: z.string().min(1, "La categoría es requerida"),
        duracion_horas: z.number().min(1, "La duración debe ser al menos 1 hora"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const curso = await ctx.prisma.curso.create({
        data: {
          nombre: input.nombre,
          instructor: input.instructor,
          descripcion: input.descripcion,
          categoria: input.categoria,
          duracion_horas: input.duracion_horas,
        },
      });

      return curso;
    }),

  // 2. Obtener todos los cursos
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
      const cursos = await ctx.prisma.curso.findMany({
        where: {
          ...(input?.categoria && { categoria: input.categoria }),
          ...(input?.activo !== undefined && { activo: input.activo }),
        },
        orderBy: { creado_en: "desc" },
        include: {
          lecciones: {
            orderBy: { orden: "asc" },
          },
        },
      });

      return cursos;
    }),

  // 3. Obtener un curso específico
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const curso = await ctx.prisma.curso.findUnique({
        where: { id: input.id },
        include: {
          lecciones: {
            orderBy: { orden: "asc" },
          },
        },
      });

      if (!curso) {
        throw new Error("Curso no encontrado");
      }

      return curso;
    }),

  // 4. Actualizar curso (solo admin)
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string().optional(),
        instructor: z.string().optional(),
        descripcion: z.string().optional(),
        categoria: z.string().optional(),
        duracion_horas: z.number().optional(),
        activo: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const updated = await ctx.prisma.curso.update({
        where: { id },
        data,
      });

      return updated;
    }),

  // 5. Eliminar curso (solo admin)
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.curso.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // 6. Obtener categorías disponibles
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const cursos = await ctx.prisma.curso.findMany({
      select: { categoria: true },
      distinct: ["categoria"],
    });

    return cursos.map((c) => c.categoria);
  }),
});
