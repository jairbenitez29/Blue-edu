"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Fish, ArrowLeft, Search, AlertCircle } from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function EspeciesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  // 1. Verificar autenticación
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 2. Obtener todas las especies
  const { data: especies, isLoading } = trpc.especie.getAll.useQuery();

  // 3. Filtrar especies
  const especiesFiltradas = especies?.filter((especie) => {
    const coincideBusqueda =
      busqueda === "" ||
      especie.nombre_comun.toLowerCase().includes(busqueda.toLowerCase()) ||
      especie.nombre_cientifico.toLowerCase().includes(busqueda.toLowerCase()) ||
      especie.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "Todas" || especie.categoria === categoriaFiltro;

    const coincideEstado =
      estadoFiltro === "Todos" || especie.estado_conservacion === estadoFiltro;

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  // 4. Obtener categorías y estados únicos
  const categorias = ["Todas", ...new Set(especies?.map((e) => e.categoria).filter(Boolean) || [])];
  const estados = [
    "Todos",
    ...new Set(especies?.map((e) => e.estado_conservacion).filter(Boolean) || []),
  ];

  // 5. Función para obtener color según estado de conservación
  const obtenerColorEstado = (estado: string | null) => {
    if (!estado) return "bg-gray-100 text-gray-700";
    if (estado.includes("Preocupación Menor")) return "bg-green-100 text-green-700";
    if (estado.includes("Casi Amenazado")) return "bg-yellow-100 text-yellow-700";
    if (estado.includes("Vulnerable")) return "bg-orange-100 text-orange-700";
    if (estado.includes("Peligro")) return "bg-red-100 text-red-700";
    if (estado.includes("Extinto")) return "bg-gray-800 text-white";
    return "bg-gray-100 text-gray-700";
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 6. Header */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
              <Fish className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Catálogo de Especies Marinas</h1>
              <p className="text-gray-600">
                Descubre la biodiversidad marina y su estado de conservación
              </p>
            </div>
          </div>

          {/* 7. Barra de búsqueda y filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar especies..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Todas" ? "Todas las categorías" : cat}
                </option>
              ))}
            </select>

            {/* Filtro por estado de conservación */}
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado === "Todos" ? "Todos los estados" : estado}
                </option>
              ))}
            </select>
          </div>

          {/* 8. Contador de resultados */}
          <div className="mt-4 text-sm text-gray-600">
            {isLoading ? (
              <span>Cargando especies...</span>
            ) : (
              <span>
                Mostrando {especiesFiltradas?.length || 0} de {especies?.length || 0} especies
              </span>
            )}
          </div>
        </div>

        {/* 9. Grid de especies */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        ) : especiesFiltradas && especiesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {especiesFiltradas.map((especie) => (
              <Link
                key={especie.id}
                href={`/dashboard/especies/${especie.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
              >
                {/* 10. Imagen de la especie */}
                {especie.url_imagen ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={especie.url_imagen}
                      alt={especie.nombre_comun}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Fish className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}

                {/* 11. Contenido */}
                <div className="p-6">
                  {/* Estado de conservación */}
                  {especie.estado_conservacion && (
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-3 ${obtenerColorEstado(
                        especie.estado_conservacion
                      )}`}
                    >
                      {especie.estado_conservacion.includes("Peligro") && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {especie.estado_conservacion}
                    </span>
                  )}

                  {/* Nombre común */}
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                    {especie.nombre_comun}
                  </h3>

                  {/* Nombre científico */}
                  <p className="text-sm text-gray-500 italic mb-3">{especie.nombre_cientifico}</p>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{especie.descripcion}</p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                      {especie.categoria || "Sin categoría"}
                    </span>
                    {especie.profundidad_min !== null && especie.profundidad_max !== null && (
                      <span>
                        {especie.profundidad_min}-{especie.profundidad_max}m
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Fish className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No se encontraron especies</h3>
            <p className="text-gray-600">
              {busqueda || categoriaFiltro !== "Todas" || estadoFiltro !== "Todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no hay especies registradas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
