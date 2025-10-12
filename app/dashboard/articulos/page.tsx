"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowLeft, Search, Calendar, User, Eye } from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function ArticulosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  // 1. Verificar autenticación
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 2. Obtener todos los artículos
  const { data: articulos, isLoading } = trpc.articulo.getAll.useQuery({ activo: true });

  // 3. Filtrar artículos
  const articulosFiltrados = articulos?.filter((articulo) => {
    const coincideBusqueda =
      busqueda === "" ||
      articulo.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      articulo.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
      articulo.resumen.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "Todas" || articulo.categoria === categoriaFiltro;

    return coincideBusqueda && coincideCategoria;
  });

  // 4. Obtener categorías únicas
  const categorias = ["Todas", ...new Set(articulos?.map((a) => a.categoria) || [])];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 5. Header */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Biblioteca de Investigación</h1>
              <p className="text-gray-600">
                Explora artículos científicos sobre vida marina y conservación oceánica
              </p>
            </div>
          </div>

          {/* 6. Barra de búsqueda y filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artículos por título, autor o contenido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            {isLoading ? (
              <span>Cargando artículos...</span>
            ) : (
              <span>
                Mostrando {articulosFiltrados?.length || 0} de {articulos?.length || 0} artículos
              </span>
            )}
          </div>
        </div>

        {/* 8. Grid de artículos */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : articulosFiltrados && articulosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articulosFiltrados.map((articulo) => (
              <Link
                key={articulo.id}
                href={`/dashboard/articulos/${articulo.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
              >
                {/* 9. Imagen del artículo */}
                {articulo.url_imagen ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={articulo.url_imagen}
                      alt={articulo.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}

                {/* 10. Contenido */}
                <div className="p-6">
                  {/* Categoría */}
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3">
                    {articulo.categoria}
                  </span>

                  {/* Título */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {articulo.titulo}
                  </h3>

                  {/* Resumen */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{articulo.resumen}</p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{articulo.autor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(articulo.fecha_publicacion).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{articulo.vistas}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron artículos</h3>
            <p className="text-gray-600">
              {busqueda || categoriaFiltro !== "Todas"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no hay artículos publicados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
