"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CrearCursoPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [instructor, setInstructor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [duracionHoras, setDuracionHoras] = useState("");
  const [error, setError] = useState("");

  const createMutation = trpc.curso.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard/admin");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre || !instructor || !descripcion || !categoria || !duracionHoras) {
      setError("Todos los campos son requeridos");
      return;
    }

    createMutation.mutate({
      nombre,
      instructor,
      descripcion,
      categoria,
      duracion_horas: parseInt(duracionHoras),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* 1. Encabezado */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Administración
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Curso</h1>
          <p className="text-gray-600 mt-2">Completa la información del curso</p>
        </div>

        {/* 2. Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Nombre del Curso"
              placeholder="Ej: Oceanografía Física"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <Input
              type="text"
              label="Instructor"
              placeholder="Ej: Dra. Ana Gómez"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción detallada del curso..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                required
              />
            </div>

            <Input
              type="text"
              label="Categoría"
              placeholder="Ej: Oceanografía, Biología Marina, Conservación"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />

            <Input
              type="number"
              label="Duración (horas)"
              placeholder="Ej: 20"
              value={duracionHoras}
              onChange={(e) => setDuracionHoras(e.target.value)}
              min="1"
              required
            />

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex items-center gap-2" isLoading={createMutation.isPending}>
                <Save className="w-5 h-5" />
                Crear Curso
              </Button>

              <Link href="/dashboard/admin">
                <Button type="button" className="bg-gray-500 hover:bg-gray-600">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
