"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, BookOpen, Fish, Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function WebContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);

  // 1. Obtener URL del query string
  const url = searchParams.get("url");

  // 2. Verificar autenticación
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 3. Extraer contenido de la URL
  const { data: contenido, isLoading, error } = trpc.webContent.extraerContenido.useQuery(
    { url: url || "" },
    { enabled: !!url && !!user }
  );

  if (!user) {
    return null;
  }

  if (!url) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">URL no proporcionada</h2>
            <p className="text-gray-600 mb-6">No se especificó una URL para extraer contenido.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Extrayendo contenido de la web...</p>
          <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (error || !contenido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Globe className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al extraer contenido</h2>
            <p className="text-gray-600 mb-4">
              No se pudo extraer el contenido de esta página. Esto puede deberse a:
            </p>
            <ul className="text-left max-w-md mx-auto text-gray-600 mb-6 space-y-2">
              <li>• La página requiere autenticación</li>
              <li>• El sitio bloquea el acceso automatizado</li>
              <li>• La URL no es válida o la página no existe</li>
            </ul>
            <div className="flex gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al inicio
              </Link>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abrir enlace original
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Determinar el ícono según el tipo
  const Icono = contenido.tipo === "especie" ? Fish : BookOpen;
  const colorGradient = contenido.tipo === "especie"
    ? "from-green-500 to-emerald-500"
    : "from-blue-500 to-cyan-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 5. Botón de regreso */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>

        {/* 6. Card del contenido */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 7. Header */}
          <div className={`bg-gradient-to-r ${colorGradient} p-8 text-white`}>
            <div className="flex items-center gap-3 mb-4">
              <Icono className="w-8 h-8" />
              <span className="text-sm font-medium opacity-90">
                {contenido.tipo === "especie" ? "Especie Marina" : "Artículo de Investigación"}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{contenido.titulo}</h1>
            <div className="flex items-center gap-2 text-blue-100">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{contenido.fuente}</span>
            </div>
          </div>

          {/* 8. Contenido */}
          <div className="p-8 md:p-12">
            {/* 9. Descripción */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Resumen</h2>
              <p className="text-gray-700 leading-relaxed">{contenido.descripcion}</p>
            </div>

            {/* 10. Contenido principal */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {contenido.contenido}
              </div>
            </div>

            {/* 11. Enlace original */}
            <div className="mt-12 pt-8 border-t">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  Fuente Original
                </h3>
                <a
                  href={contenido.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline break-all"
                >
                  {contenido.url}
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Este contenido ha sido extraído automáticamente. Para ver la versión completa y más
                  información, visita el enlace original.
                </p>
              </div>
            </div>

            {/* 12. Acciones */}
            <div className="mt-8 flex gap-3">
              <Link
                href="/dashboard"
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colorGradient} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al inicio
              </Link>
              <a
                href={contenido.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ver original
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
