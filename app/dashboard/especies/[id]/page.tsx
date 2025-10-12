"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Fish,
  ArrowLeft,
  AlertCircle,
  Waves,
  Thermometer,
  MapPin,
} from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function EspecieDetallePage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const especieId = params.id as string;

  // 1. Verificar autenticación
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 2. Obtener especie por ID
  const { data: especie, isLoading } = trpc.especie.getById.useQuery(
    { id: especieId },
    { enabled: !!especieId }
  );

  // 3. Función para obtener color según estado
  const obtenerColorEstado = (estado: string | null) => {
    if (!estado) return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    if (estado.includes("Preocupación Menor"))
      return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
    if (estado.includes("Casi Amenazado"))
      return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" };
    if (estado.includes("Vulnerable"))
      return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" };
    if (estado.includes("Peligro"))
      return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
    if (estado.includes("Extinto"))
      return { bg: "bg-gray-800", text: "text-white", border: "border-gray-800" };
    return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando especie...</p>
        </div>
      </div>
    );
  }

  if (!especie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Fish className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Especie no encontrada</h2>
            <p className="text-gray-600 mb-6">
              La especie que buscas no existe o ha sido eliminada.
            </p>
            <Link
              href="/dashboard/especies"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const colorEstado = obtenerColorEstado(especie.estado_conservacion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* 4. Botón de regreso */}
        <Link
          href="/dashboard/especies"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al catálogo
        </Link>

        {/* 5. Card de la especie */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* 6. Imagen */}
            <div className="h-96 lg:h-auto">
              {especie.url_imagen ? (
                <img
                  src={especie.url_imagen}
                  alt={especie.nombre_comun}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Fish className="w-32 h-32 text-white opacity-30" />
                </div>
              )}
            </div>

            {/* 7. Información principal */}
            <div className="p-8 lg:p-12">
              {/* Estado de conservación */}
              {especie.estado_conservacion && (
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${colorEstado.bg} ${colorEstado.text} border ${colorEstado.border}`}
                >
                  {especie.estado_conservacion.includes("Peligro") && (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {especie.estado_conservacion}
                </div>
              )}

              {/* Nombres */}
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{especie.nombre_comun}</h1>
              <p className="text-xl text-gray-500 italic mb-6">{especie.nombre_cientifico}</p>

              {/* Categoría */}
              {especie.categoria && (
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                  {especie.categoria}
                </div>
              )}

              {/* Descripción */}
              <p className="text-gray-700 leading-relaxed mb-8">{especie.descripcion}</p>

              {/* Datos científicos */}
              <div className="space-y-4">
                {/* Profundidad */}
                {especie.profundidad_min !== null && especie.profundidad_max !== null && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Waves className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profundidad</p>
                      <p className="text-lg font-bold text-gray-800">
                        {especie.profundidad_min} - {especie.profundidad_max} metros
                      </p>
                    </div>
                  </div>
                )}

                {/* Temperatura */}
                {especie.temperatura_min !== null && especie.temperatura_max !== null && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Thermometer className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Temperatura óptima</p>
                      <p className="text-lg font-bold text-gray-800">
                        {especie.temperatura_min}°C - {especie.temperatura_max}°C
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 8. Hábitat (sección completa si existe) */}
          {especie.habitat && (
            <div className="p-8 lg:p-12 border-t">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Hábitat</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{especie.habitat}</p>
            </div>
          )}

          {/* 9. Información de conservación */}
          {especie.estado_conservacion && especie.estado_conservacion.includes("Peligro") && (
            <div className="p-8 lg:p-12 bg-red-50 border-t border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Estado de Conservación Crítico</h3>
                  <p className="text-red-800 leading-relaxed">
                    Esta especie se encuentra en peligro según la Lista Roja de la IUCN. Es fundamental
                    tomar acciones de conservación para proteger su hábitat y prevenir su extinción.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 10. Acción */}
          <div className="p-8 lg:p-12 border-t">
            <Link
              href="/dashboard/especies"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
