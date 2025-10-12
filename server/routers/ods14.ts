import { router, publicProcedure } from "../trpc";
import { obtenerDatosODS14Cacheados } from "@/lib/onu-api";

export const ods14Router = router({
  // Obtener todos los indicadores del ODS 14
  getIndicadores: publicProcedure.query(async () => {
    const indicadores = await obtenerDatosODS14Cacheados();
    return indicadores;
  }),

  // Forzar actualización de datos (sin usar caché)
  refreshIndicadores: publicProcedure.mutation(async () => {
    const { obtenerDatosODS14 } = await import("@/lib/onu-api");
    const indicadores = await obtenerDatosODS14();
    return {
      success: true,
      indicadores,
      actualizadoEn: new Date().toISOString()
    };
  }),
});
