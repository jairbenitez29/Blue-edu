"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  BookOpen,
  User,
  Settings,
  LogOut,
  Search,
  Waves,
  Fish,
  FlaskConical,
  TrendingUp,
  Users,
  Flame,
  Droplets,
  Globe
} from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // 1. Cargar usuario desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 2. Obtener artículos recientes
  const { data: articulos } = trpc.articulo.getAll.useQuery({ activo: true });
  const articulosRecientes = articulos?.slice(0, 3) || [];

  // 3. Obtener datos del ODS 14 desde API de la ONU
  const { data: indicadoresONU, isLoading: loadingONU } = trpc.ods14.getIndicadores.useQuery();

  // 4. Búsqueda global híbrida (local + web)
  const { data: resultadosBusqueda, isLoading: loadingBusqueda } = trpc.busqueda.globalWeb.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  // 5. Manejo de búsqueda
  useEffect(() => {
    setShowSearchResults(searchQuery.length >= 2);
  }, [searchQuery]);

  // 6. Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return null;
  }

  // 7. Estadísticas del ODS 14
  const estadisticas = [
    {
      titulo: "Especies Registradas",
      valor: "247",
      cambio: "+12 este mes",
      icono: Fish,
      color: "from-blue-500 to-cyan-500"
    },
    {
      titulo: "Artículos de Investigación",
      valor: articulos?.length.toString() || "0",
      cambio: "Actualizado",
      icono: BookOpen,
      color: "from-green-500 to-emerald-500"
    },
    {
      titulo: "Simulaciones Activas",
      valor: "45",
      cambio: "+8 hoy",
      icono: FlaskConical,
      color: "from-purple-500 to-pink-500"
    },
    {
      titulo: "Temperatura Oceánica",
      valor: "25.3°C",
      cambio: "+0.2°C",
      icono: Flame,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Navegación lateral */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BlueEdu</h1>
              <p className="text-xs text-gray-500">ODS 14 - Vida Submarina</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
              <Home className="w-5 h-5" />
              Inicio
            </Link>
            {user.rol === "admin" && (
              <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users className="w-5 h-5" />
                Administración
              </Link>
            )}
            <Link href="/dashboard/articulos" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <BookOpen className="w-5 h-5" />
              Investigación
            </Link>
            <Link href="/dashboard/especies" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Fish className="w-5 h-5" />
              Especies Marinas
            </Link>
            <Link href="/dashboard/simulador" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <FlaskConical className="w-5 h-5" />
              Simulador
            </Link>
            <Link href="/dashboard/perfil" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <User className="w-5 h-5" />
              Perfil
            </Link>
            <Link href="/dashboard/configuracion" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="ml-64 p-8">
        {/* Barra superior */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar en la plataforma y en la web..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(searchQuery.length >= 2)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Resultados de búsqueda */}
            {showSearchResults && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-y-auto">
                {loadingBusqueda ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-500">Buscando en la plataforma y la web...</p>
                  </div>
                ) : resultadosBusqueda && (resultadosBusqueda.totalLocal > 0 || resultadosBusqueda.totalWeb > 0) ? (
                  <div className="p-4">
                    {/* 1. Sección de resultados locales */}
                    {resultadosBusqueda.totalLocal > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3 px-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <h3 className="text-sm font-bold text-gray-700 uppercase">En la Plataforma ({resultadosBusqueda.totalLocal})</h3>
                        </div>

                        {/* Artículos */}
                        {resultadosBusqueda.local.articulos.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-gray-500 mb-2 px-2">Artículos de Investigación</h4>
                            {resultadosBusqueda.local.articulos.map((item) => (
                              <Link
                                key={item.id}
                                href={`/dashboard/articulos/${item.id}`}
                                className="block p-3 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => {
                                  setSearchQuery("");
                                  setShowSearchResults(false);
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium text-gray-800">{item.titulo}</p>
                                    <p className="text-sm text-gray-500 line-clamp-1">{item.descripcion}</p>
                                    <span className="text-xs text-blue-600">{item.categoria}</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Especies */}
                        {resultadosBusqueda.local.especies.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-gray-500 mb-2 px-2">Especies Marinas</h4>
                            {resultadosBusqueda.local.especies.map((item) => (
                              <Link
                                key={item.id}
                                href={`/dashboard/especies/${item.id}`}
                                className="block p-3 hover:bg-green-50 rounded-lg transition-colors"
                                onClick={() => {
                                  setSearchQuery("");
                                  setShowSearchResults(false);
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <Fish className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium text-gray-800">{item.titulo}</p>
                                    <p className="text-sm text-gray-500 italic">{item.descripcion}</p>
                                    {item.estado && (
                                      <span className="text-xs text-green-600">{item.estado}</span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Ecosistemas */}
                        {resultadosBusqueda.local.ecosistemas.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 mb-2 px-2">Simulaciones</h4>
                            {resultadosBusqueda.local.ecosistemas.map((item) => (
                              <Link
                                key={item.id}
                                href={`/dashboard/simulador?id=${item.id}`}
                                className="block p-3 hover:bg-purple-50 rounded-lg transition-colors"
                                onClick={() => {
                                  setSearchQuery("");
                                  setShowSearchResults(false);
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <FlaskConical className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium text-gray-800">{item.titulo}</p>
                                    <p className="text-sm text-gray-500">{item.descripcion}</p>
                                    <span className="text-xs text-purple-600">Salud: {item.salud}%</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. Separador */}
                    {resultadosBusqueda.totalLocal > 0 && resultadosBusqueda.totalWeb > 0 && (
                      <div className="border-t border-gray-200 my-4"></div>
                    )}

                    {/* 3. Sección de resultados web */}
                    {resultadosBusqueda.totalWeb > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 px-2">
                          <Globe className="w-4 h-4 text-orange-600" />
                          <h3 className="text-sm font-bold text-gray-700 uppercase">En la Web ({resultadosBusqueda.totalWeb})</h3>
                        </div>
                        {resultadosBusqueda.web.map((item, index) => (
                          <Link
                            key={index}
                            href={`/dashboard/web?url=${encodeURIComponent(item.url)}`}
                            className="block p-3 hover:bg-orange-50 rounded-lg transition-colors"
                            onClick={() => {
                              setSearchQuery("");
                              setShowSearchResults(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <Globe className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-800">{item.titulo}</p>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.descripcion}</p>
                                <span className="text-xs text-orange-600">{item.fuente}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No se encontraron resultados para "{searchQuery}"</p>
                    <p className="text-sm text-gray-400 mt-1">Intenta con otros términos de búsqueda</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 ml-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Bienvenido</p>
              <p className="font-semibold text-gray-800">{user.nombre}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Banner ODS 14 */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Waves className="w-16 h-16" />
              <div>
                <h2 className="text-3xl font-bold mb-2">ODS 14: Vida Submarina</h2>
                <p className="text-blue-100 text-lg">Conservar y utilizar sosteniblemente los océanos, los mares y los recursos marinos</p>
              </div>
            </div>
            {loadingONU && (
              <div className="text-blue-100 text-sm flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Actualizando datos...
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {loadingONU ? (
              // Skeleton loader mientras carga
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white/20 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-white/30 rounded mb-2"></div>
                    <div className="h-8 bg-white/30 rounded"></div>
                  </div>
                ))}
              </>
            ) : (
              indicadoresONU?.slice(0, 4).map((indicador, index) => (
                <div key={index} className="bg-white/20 rounded-lg p-4 hover:bg-white/30 transition-colors group cursor-help" title={`Fuente: ${indicador.fuente}`}>
                  <p className="text-blue-100 text-sm">{indicador.nombre}</p>
                  <p className="text-2xl font-bold">{indicador.valor}{indicador.unidad}</p>
                  {indicador.tendencia && (
                    <p className="text-blue-200 text-xs mt-1">{indicador.tendencia}</p>
                  )}
                  <p className="text-blue-200/70 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Actualizado: {indicador.ultimaActualizacion}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Panel de Datos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estadisticas.map((stat, index) => {
            const Icon = stat.icono;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="text-gray-600 text-sm font-medium mb-1">{stat.titulo}</h4>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.valor}</p>
                <p className="text-sm text-gray-500">{stat.cambio}</p>
              </div>
            );
          })}
        </div>

        {/* Acceso Rápido */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Acceso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/simulador" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <FlaskConical className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Simulador de Ecosistema</h4>
            </div>
            <p className="text-gray-600">Experimenta con parámetros oceánicos y observa el impacto en tiempo real</p>
          </Link>

          <Link href="/dashboard/articulos" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Biblioteca de Investigación</h4>
            </div>
            <p className="text-gray-600">Explora artículos científicos sobre vida marina y conservación</p>
          </Link>

          <Link href="/dashboard/especies" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Fish className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Catálogo de Especies</h4>
            </div>
            <p className="text-gray-600">Descubre especies marinas, su hábitat y estado de conservación</p>
          </Link>
        </div>

        {/* Artículos Recientes */}
        {articulosRecientes.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Investigación Reciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articulosRecientes.map((articulo) => (
                <div key={articulo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {articulo.url_imagen && (
                    <img src={articulo.url_imagen} alt={articulo.titulo} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {articulo.categoria}
                    </span>
                    <h4 className="text-lg font-bold text-gray-800 mt-3 mb-2">{articulo.titulo}</h4>
                    <p className="text-sm text-gray-500 mb-2">Por {articulo.autor}</p>
                    <p className="text-gray-600 text-sm line-clamp-3">{articulo.resumen}</p>
                    <Link href={`/dashboard/articulos/${articulo.id}`} className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Leer más →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
