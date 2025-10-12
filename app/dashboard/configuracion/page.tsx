"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, ArrowLeft, Clock } from "lucide-react";

export default function ConfiguracionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // 1. Verificar autenticación
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 2. Botón de regreso */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>

        {/* 3. Card de función en desarrollo */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="bg-gradient-to-br from-gray-600 to-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Configuración
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full mb-6">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Función en desarrollo</span>
          </div>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Esta sección te permitirá personalizar las preferencias de la plataforma
            y ajustar la configuración de tu cuenta.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 text-left">
            <h3 className="font-bold text-gray-800 mb-3">Características próximamente:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span>Preferencias de idioma y región</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span>Notificaciones y alertas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span>Privacidad y seguridad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span>Tema claro/oscuro</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
