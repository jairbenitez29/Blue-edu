import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const ecosystemRouter = router({
  // 1. Crear nuevo ecosistema
  create: publicProcedure
    .input(
      z.object({
        usuario_id: z.string(),
        nombre: z.string().min(1, "El nombre es requerido"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ecosystem = await ctx.prisma.ecosistema.create({
        data: {
          usuario_id: input.usuario_id,
          nombre: input.nombre,
        },
      });

      return ecosystem;
    }),

  // 2. Obtener todos los ecosistemas de un usuario
  getByUser: publicProcedure
    .input(z.object({ usuario_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ecosystems = await ctx.prisma.ecosistema.findMany({
        where: { usuario_id: input.usuario_id },
        orderBy: { actualizado_en: "desc" },
      });

      return ecosystems;
    }),

  // 3. Obtener un ecosistema específico
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ecosystem = await ctx.prisma.ecosistema.findUnique({
        where: { id: input.id },
      });

      if (!ecosystem) {
        throw new Error("Ecosistema no encontrado");
      }

      return ecosystem;
    }),

  // 4. Actualizar parámetros del ecosistema
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        temperatura: z.number().min(-2).max(35).optional(),
        salinidad: z.number().min(0).max(50).optional(),
        nivel_co2: z.number().min(200).max(1000).optional(),
        poblacion_peces: z.number().min(0).max(500).optional(),
        crecimiento_coral: z.number().min(0).max(100).optional(),
        salud_coral: z.number().min(0).max(100).optional(),
        biodiversidad: z.number().min(0).max(100).optional(),
        nivel_oxigeno: z.number().min(0).max(15).optional(),
        activo: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (data.temperatura !== undefined || data.nivel_co2 !== undefined) {
        const ecosystem = await ctx.prisma.ecosistema.findUnique({
          where: { id },
        });

        if (ecosystem) {
          const temp = data.temperatura ?? ecosystem.temperatura;
          const co2 = data.nivel_co2 ?? ecosystem.nivel_co2;

          let healthPenalty = 0;

          if (temp < 22 || temp > 28) {
            healthPenalty += Math.abs(temp - 25) * 2;
          }

          if (co2 < 350 || co2 > 450) {
            healthPenalty += Math.abs(co2 - 400) * 0.05;
          }

          const newHealth = Math.max(0, Math.min(100, 100 - healthPenalty));
          data.salud_coral = newHealth;
          data.biodiversidad = newHealth * 0.9;
        }
      }

      const updated = await ctx.prisma.ecosistema.update({
        where: { id },
        data,
      });

      return updated;
    }),

  // 5. Eliminar ecosistema
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.ecosistema.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
