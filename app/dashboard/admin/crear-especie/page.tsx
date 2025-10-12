"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Fish, ArrowLeft, Save, Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";

export default function CrearEspeciePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // 1. Estados del formulario
  const [formData, setFormData] = useState({
    nombre_comun: "",
    nombre_cientifico: "",
    descripcion: "",
    habitat: "",
    estado_conservacion: "",
    categoria: "",
    profundidad_min: "",
    profundidad_max: "",
    temperatura_min: "",
    temperatura_max: "",
    url_imagen: "",
  });

  // 2. Verificar autenticación y rol de admin
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.rol !== "admin") {
      router.push("/dashboard");
      return;
    }
    setUser(parsedUser);
  }, [router]);

  // 3. Mutación para crear especie
  const createMutation = trpc.especie.create.useMutation({
    onSuccess: () => {
      alert("Especie creada exitosamente");
      router.push("/dashboard/admin");
    },
    onError: (error) => {
      alert("Error al crear la especie: " + error.message);
    },
  });

  // 4. Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 5. Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 6. Validaciones básicas
    if (!formData.nombre_comun.trim() || !formData.nombre_cientifico.trim()) {
      alert("El nombre común y científico son obligatorios");
      return;
    }

    // 7. Convertir valores numéricos
    const data: any = {
      nombre_comun: formData.nombre_comun.trim(),
      nombre_cientifico: formData.nombre_cientifico.trim(),
      descripcion: formData.descripcion.trim(),
    };

    if (formData.habitat.trim()) data.habitat = formData.habitat.trim();
    if (formData.estado_conservacion) data.estado_conservacion = formData.estado_conservacion;
    if (formData.categoria) data.categoria = formData.categoria;
    if (formData.profundidad_min) data.profundidad_min = parseInt(formData.profundidad_min);
    if (formData.profundidad_max) data.profundidad_max = parseInt(formData.profundidad_max);
    if (formData.temperatura_min) data.temperatura_min = parseFloat(formData.temperatura_min);
    if (formData.temperatura_max) data.temperatura_max = parseFloat(formData.temperatura_max);
    if (formData.url_imagen.trim()) data.url_imagen = formData.url_imagen.trim();

    createMutation.mutate(data);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 8. Header */}
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al panel de administración
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
              <Fish className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Nueva Especie Marina</h1>
              <p className="text-gray-600">Agrega una nueva especie al catálogo</p>
            </div>
          </div>

          {/* 9. Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 10. Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Común <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre_comun"
                  value={formData.nombre_comun}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Tortuga Marina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Científico <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre_cientifico"
                  value={formData.nombre_cientifico}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Chelonia mydas"
                />
              </div>
            </div>

            {/* 11. Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Descripción detallada de la especie..."
              />
            </div>

            {/* 12. Hábitat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hábitat
              </label>
              <textarea
                name="habitat"
                value={formData.habitat}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Descripción del hábitat natural..."
              />
            </div>

            {/* 13. Estado de conservación y categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Conservación
                </label>
                <select
                  name="estado_conservacion"
                  value={formData.estado_conservacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Preocupación Menor">Preocupación Menor (LC)</option>
                  <option value="Casi Amenazado">Casi Amenazado (NT)</option>
                  <option value="Vulnerable">Vulnerable (VU)</option>
                  <option value="En Peligro">En Peligro (EN)</option>
                  <option value="En Peligro Crítico">En Peligro Crítico (CR)</option>
                  <option value="Extinto en Estado Silvestre">Extinto en Estado Silvestre (EW)</option>
                  <option value="Extinto">Extinto (EX)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Mamífero">Mamífero</option>
                  <option value="Pez">Pez</option>
                  <option value="Reptil">Reptil</option>
                  <option value="Molusco">Molusco</option>
                  <option value="Crustáceo">Crustáceo</option>
                  <option value="Coral">Coral</option>
                  <option value="Equinodermo">Equinodermo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {/* 14. Profundidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profundidad Mínima (m)
                </label>
                <input
                  type="number"
                  name="profundidad_min"
                  value={formData.profundidad_min}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: 0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profundidad Máxima (m)
                </label>
                <input
                  type="number"
                  name="profundidad_max"
                  value={formData.profundidad_max}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: 100"
                />
              </div>
            </div>

            {/* 15. Temperatura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura Mínima (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperatura_min"
                  value={formData.temperatura_min}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: 18.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura Máxima (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperatura_max"
                  value={formData.temperatura_max}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: 28.5"
                />
              </div>
            </div>

            {/* 16. URL de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                name="url_imagen"
                value={formData.url_imagen}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            {/* 17. Botones */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Crear Especie
                  </>
                )}
              </button>

              <Link
                href="/dashboard/admin"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
