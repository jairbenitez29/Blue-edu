import { router } from "../trpc";
import { authRouter } from "./auth";
import { ecosystemRouter } from "./ecosystem";
import { progressRouter } from "./progress";
import { articuloRouter } from "./articulo";
import { especieRouter } from "./especie";
import { ods14Router } from "./ods14";
import { busquedaRouter } from "./busqueda";
import { webContentRouter } from "./web-content";

export const appRouter = router({
  auth: authRouter,
  ecosystem: ecosystemRouter,
  progress: progressRouter,
  articulo: articuloRouter,
  especie: especieRouter,
  ods14: ods14Router,
  busqueda: busquedaRouter,
  webContent: webContentRouter,
});

export type AppRouter = typeof appRouter;
