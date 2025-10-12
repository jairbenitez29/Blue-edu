"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, ArrowLeft, Clock } from "lucide-react";

export default function PerfilPage() {
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
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Perfil de Usuario
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full mb-6">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Función en desarrollo</span>
          </div>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Esta sección te permitirá gestionar tu perfil, ver tu progreso y
            personalizar tu experiencia en la plataforma.
          </p>
          <div className="bg-blue-50 rounded-xl p-6 text-left">
            <h3 className="font-bold text-gray-800 mb-3">Características próximamente:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Editar información personal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Cambiar contraseña y configuración de seguridad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ver historial de actividad y progreso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Certificados y logros obtenidos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
