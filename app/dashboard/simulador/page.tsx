"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FlaskConical,
  ArrowLeft,
  Save,
  RotateCcw,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  AlertTriangle,
  CheckCircle,
  Fish,
  Loader2
} from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function SimuladorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // 1. Estados de los parámetros del simulador
  const [parametros, setParametros] = useState({
    temperatura: 25,
    ph: 8.1,
    salinidad: 35,
    co2: 400,
    profundidad: 50,
  });

  const [nombreSimulacion, setNombreSimulacion] = useState("");

  // 2. Verificar autenticación
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // 3. Mutación para guardar simulación
  const guardarMutation = trpc.ecosystem.create.useMutation({
    onSuccess: () => {
      alert("Simulación guardada exitosamente");
      setNombreSimulacion("");
    },
    onError: (error) => {
      alert("Error al guardar: " + error.message);
    },
  });

  // 4. Calcular salud del ecosistema (0-100)
  const calcularSalud = () => {
    let salud = 100;

    // 5. Temperatura óptima: 20-28°C
    if (parametros.temperatura < 20 || parametros.temperatura > 28) {
      const desvio = Math.abs(parametros.temperatura - 24);
      salud -= desvio * 3;
    }

    // 6. pH óptimo: 7.8-8.3
    if (parametros.ph < 7.8 || parametros.ph > 8.3) {
      const desvio = Math.abs(parametros.ph - 8.1) * 10;
      salud -= desvio * 15;
    }

    // 7. Salinidad óptima: 32-37 PSU
    if (parametros.salinidad < 32 || parametros.salinidad > 37) {
      const desvio = Math.abs(parametros.salinidad - 35);
      salud -= desvio * 2;
    }

    // 8. CO2 óptimo: 280-420 ppm
    if (parametros.co2 > 420) {
      const exceso = parametros.co2 - 420;
      salud -= exceso * 0.1;
    }

    return Math.max(0, Math.min(100, Math.round(salud)));
  };

  // 9. Calcular salud específica para cada grupo
  const calcularSaludCoral = () => {
    let salud = 100;
    if (parametros.temperatura > 30) salud -= (parametros.temperatura - 30) * 10;
    if (parametros.ph < 8.0) salud -= (8.0 - parametros.ph) * 50;
    if (parametros.co2 > 450) salud -= (parametros.co2 - 450) * 0.15;
    return Math.max(0, Math.min(100, Math.round(salud)));
  };

  const calcularSaludPeces = () => {
    let salud = 100;
    if (parametros.temperatura < 18 || parametros.temperatura > 32) {
      salud -= Math.abs(parametros.temperatura - 25) * 2;
    }
    if (parametros.salinidad < 30 || parametros.salinidad > 38) salud -= 20;
    return Math.max(0, Math.min(100, Math.round(salud)));
  };

  const calcularSaludMamiferos = () => {
    let salud = 100;
    if (parametros.temperatura < 10 || parametros.temperatura > 30) {
      salud -= Math.abs(parametros.temperatura - 20) * 1.5;
    }
    if (parametros.co2 > 500) salud -= (parametros.co2 - 500) * 0.08;
    return Math.max(0, Math.min(100, Math.round(salud)));
  };

  const saludTotal = calcularSalud();
  const saludCoral = calcularSaludCoral();
  const saludPeces = calcularSaludPeces();
  const saludMamiferos = calcularSaludMamiferos();

  // 10. Función para obtener color según salud
  const obtenerColor = (valor: number) => {
    if (valor >= 80) return "bg-green-500";
    if (valor >= 60) return "bg-yellow-500";
    if (valor >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const obtenerColorTexto = (valor: number) => {
    if (valor >= 80) return "text-green-600";
    if (valor >= 60) return "text-yellow-600";
    if (valor >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // 11. Resetear valores a óptimos
  const resetear = () => {
    setParametros({
      temperatura: 25,
      ph: 8.1,
      salinidad: 35,
      co2: 400,
      profundidad: 50,
    });
  };

  // 12. Guardar simulación
  const guardarSimulacion = () => {
    if (!nombreSimulacion.trim()) {
      alert("Por favor ingresa un nombre para la simulación");
      return;
    }

    if (!user?.id) {
      alert("Error: Usuario no identificado");
      return;
    }

    guardarMutation.mutate({
      usuario_id: user.id,
      nombre: nombreSimulacion,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 13. Header */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 14. Panel de controles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Simulador de Ecosistema Marino</h1>
                  <p className="text-gray-600">Ajusta los parámetros y observa el impacto en tiempo real</p>
                </div>
              </div>

              {/* 15. Controles de parámetros */}
              <div className="space-y-6">
                {/* Temperatura */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-orange-600" />
                      <label className="font-medium text-gray-700">Temperatura</label>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{parametros.temperatura}°C</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="0.5"
                    value={parametros.temperatura}
                    onChange={(e) => setParametros({ ...parametros, temperatura: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0°C</span>
                    <span className="text-green-600 font-medium">Óptimo: 20-28°C</span>
                    <span>40°C</span>
                  </div>
                </div>

                {/* pH */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      <label className="font-medium text-gray-700">pH del Agua</label>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{parametros.ph.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="9"
                    step="0.01"
                    value={parametros.ph}
                    onChange={(e) => setParametros({ ...parametros, ph: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>6.0 (Ácido)</span>
                    <span className="text-green-600 font-medium">Óptimo: 7.8-8.3</span>
                    <span>9.0 (Alcalino)</span>
                  </div>
                </div>

                {/* Salinidad */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Waves className="w-5 h-5 text-cyan-600" />
                      <label className="font-medium text-gray-700">Salinidad</label>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{parametros.salinidad} PSU</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="45"
                    step="0.5"
                    value={parametros.salinidad}
                    onChange={(e) => setParametros({ ...parametros, salinidad: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>20 PSU</span>
                    <span className="text-green-600 font-medium">Óptimo: 32-37 PSU</span>
                    <span>45 PSU</span>
                  </div>
                </div>

                {/* CO2 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wind className="w-5 h-5 text-gray-600" />
                      <label className="font-medium text-gray-700">CO2 Atmosférico</label>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{parametros.co2} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="280"
                    max="800"
                    step="10"
                    value={parametros.co2}
                    onChange={(e) => setParametros({ ...parametros, co2: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>280 ppm (Pre-industrial)</span>
                    <span className="text-green-600 font-medium">Actual: ~420 ppm</span>
                    <span>800 ppm</span>
                  </div>
                </div>

                {/* Profundidad */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-purple-600" />
                      <label className="font-medium text-gray-700">Profundidad</label>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{parametros.profundidad} m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={parametros.profundidad}
                    onChange={(e) => setParametros({ ...parametros, profundidad: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 m (Superficie)</span>
                    <span>200 m (Profundo)</span>
                  </div>
                </div>
              </div>

              {/* 16. Botones de acción */}
              <div className="flex gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={resetear}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Resetear
                </button>
                <div className="flex-1 flex gap-3">
                  <input
                    type="text"
                    value={nombreSimulacion}
                    onChange={(e) => setNombreSimulacion(e.target.value)}
                    placeholder="Nombre de la simulación..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={guardarSimulacion}
                    disabled={guardarMutation.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {guardarMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 17. Panel de resultados */}
          <div className="space-y-6">
            {/* Salud general */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Salud del Ecosistema</h3>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${obtenerColorTexto(saludTotal)}`}>
                  {saludTotal}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${obtenerColor(saludTotal)} transition-all duration-500`}
                    style={{ width: `${saludTotal}%` }}
                  />
                </div>
              </div>

              {/* Alertas */}
              {saludTotal >= 80 ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Ecosistema saludable</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg text-orange-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">Ecosistema en riesgo</span>
                </div>
              )}
            </div>

            {/* Impacto por especies */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Impacto por Especies</h3>
              <div className="space-y-4">
                {/* Corales */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Corales</span>
                    <span className={`text-sm font-bold ${obtenerColorTexto(saludCoral)}`}>
                      {saludCoral}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${obtenerColor(saludCoral)} transition-all duration-500`}
                      style={{ width: `${saludCoral}%` }}
                    />
                  </div>
                </div>

                {/* Peces */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Peces</span>
                    <span className={`text-sm font-bold ${obtenerColorTexto(saludPeces)}`}>
                      {saludPeces}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${obtenerColor(saludPeces)} transition-all duration-500`}
                      style={{ width: `${saludPeces}%` }}
                    />
                  </div>
                </div>

                {/* Mamíferos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Mamíferos</span>
                    <span className={`text-sm font-bold ${obtenerColorTexto(saludMamiferos)}`}>
                      {saludMamiferos}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${obtenerColor(saludMamiferos)} transition-all duration-500`}
                      style={{ width: `${saludMamiferos}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información educativa */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="font-bold mb-3">Sabías que...</h3>
              <p className="text-sm text-blue-100">
                Los océanos absorben aproximadamente el 30% del CO2 producido por humanos,
                lo que causa acidificación oceánica y afecta a corales y organismos con caparazón.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
