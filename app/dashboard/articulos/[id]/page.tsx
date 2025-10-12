"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowLeft, Calendar, User, Eye, ExternalLink, Tag } from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function ArticuloDetallePage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const articuloId = params.id as string;

  // 1. Verificar autenticación
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 2. Obtener artículo por ID
  const { data: articulo, isLoading } = trpc.articulo.getById.useQuery(
    { id: articuloId },
    { enabled: !!articuloId }
  );

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!articulo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Artículo no encontrado</h2>
            <p className="text-gray-600 mb-6">El artículo que buscas no existe o ha sido eliminado.</p>
            <Link
              href="/dashboard/articulos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a la biblioteca
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 3. Botón de regreso */}
        <Link
          href="/dashboard/articulos"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la biblioteca
        </Link>

        {/* 4. Card del artículo */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 5. Imagen destacada */}
          {articulo.url_imagen && (
            <div className="h-96 overflow-hidden">
              <img
                src={articulo.url_imagen}
                alt={articulo.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 6. Contenido */}
          <div className="p-8 md:p-12">
            {/* 7. Categoría */}
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              {articulo.categoria}
            </span>

            {/* 8. Título */}
            <h1 className="text-4xl font-bold text-gray-800 mb-6">{articulo.titulo}</h1>

            {/* 9. Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>
                  <span className="font-medium">Autor:</span> {articulo.autor}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>
                  {new Date(articulo.fecha_publicacion).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>{articulo.vistas} vistas</span>
              </div>
            </div>

            {/* 10. Resumen */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Resumen</h2>
              <p className="text-gray-700 leading-relaxed">{articulo.resumen}</p>
            </div>

            {/* 11. Contenido principal */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: articulo.contenido.replace(/\n/g, "<br />") }}
              />
            </div>

            {/* 12. Palabras clave */}
            {articulo.palabras_clave && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-800">Palabras clave</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {articulo.palabras_clave.split(",").map((palabra, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {palabra.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 13. Fuente */}
            {articulo.fuente && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-2 text-gray-600">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Fuente:</span>
                  <a
                    href={articulo.fuente}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {articulo.fuente}
                  </a>
                </div>
              </div>
            )}

            {/* 14. Acción */}
            <div className="mt-12 pt-8 border-t">
              <Link
                href="/dashboard/articulos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a la biblioteca
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
