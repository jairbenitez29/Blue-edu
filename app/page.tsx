import Link from "next/link";
import { Waves } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex justify-center mb-8">
          <div className="bg-ocean-600 p-6 rounded-full shadow-2xl">
            <Waves className="w-20 h-20 text-white" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-ocean-900 mb-4">
          BlueEdu
        </h1>

        <p className="text-2xl text-ocean-700 mb-6">
          Plataforma Educativa sobre Vida Submarina
        </p>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Aprende sobre conservación marina, ecosistemas submarinos y contribuye al
          <span className="font-semibold text-ocean-600"> ODS #14: Vida Submarina</span>
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="bg-ocean-600 hover:bg-ocean-700 text-white font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            Iniciar Sesión
          </Link>

          <Link
            href="/register"
            className="bg-white hover:bg-gray-50 text-ocean-600 font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-ocean-600 text-lg"
          >
            Registrarse
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="card hover:scale-105">
            <h3 className="text-xl font-bold text-ocean-700 mb-3">
              Aprende
            </h3>
            <p className="text-gray-600">
              Accede a cursos interactivos sobre oceanografía, biología marina y conservación
            </p>
          </div>

          <div className="card hover:scale-105">
            <h3 className="text-xl font-bold text-ocean-700 mb-3">
              Simula
            </h3>
            <p className="text-gray-600">
              Experimenta con ecosistemas marinos virtuales y observa el impacto de tus decisiones
            </p>
          </div>

          <div className="card hover:scale-105">
            <h3 className="text-xl font-bold text-ocean-700 mb-3">
              Certifícate
            </h3>
            <p className="text-gray-600">
              Obtén certificados digitales al completar los cursos y demuestra tu conocimiento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
