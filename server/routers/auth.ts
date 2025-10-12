import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const authRouter = router({
  // 1. Registro de usuario
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.usuario.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("El email ya está registrado");
      }

      const hashedPassword = await bcrypt.hash(input.contrasena, 10);

      const user = await ctx.prisma.usuario.create({
        data: {
          email: input.email,
          nombre: input.nombre,
          contrasena: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          nombre: true,
          rol: true,
          creado_en: true,
        },
      });

      return {
        success: true,
        user,
      };
    }),

  // 2. Login de usuario
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        contrasena: z.string().min(1, "La contraseña es requerida"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.usuario.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error("Credenciales inválidas");
      }

      const validPassword = await bcrypt.compare(input.contrasena, user.contrasena);

      if (!validPassword) {
        throw new Error("Credenciales inválidas");
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol,
        },
      };
    }),

  // 3. Obtener usuario por ID
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.usuario.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          email: true,
          nombre: true,
          rol: true,
          creado_en: true,
        },
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return user;
    }),
});
