"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CrearArticuloPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [resumen, setResumen] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [fuente, setFuente] = useState("");
  const [palabrasClave, setPalabrasClave] = useState("");
  const [error, setError] = useState("");

  const createMutation = trpc.articulo.create.useMutation({
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

    if (!titulo || !autor || !resumen || !contenido || !categoria) {
      setError("Los campos título, autor, resumen, contenido y categoría son requeridos");
      return;
    }

    createMutation.mutate({
      titulo,
      autor,
      resumen,
      contenido,
      categoria,
      url_imagen: urlImagen || undefined,
      fuente: fuente || undefined,
      palabras_clave: palabrasClave || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 1. Encabezado */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Administración
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Artículo de Investigación</h1>
          <p className="text-gray-600 mt-2">Completa la información del artículo</p>
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
              label="Título del Artículo"
              placeholder="Ej: Impacto del Cambio Climático en los Arrecifes de Coral"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <Input
              type="text"
              label="Autor"
              placeholder="Ej: Dr. Juan Pérez, PhD en Biología Marina"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen
              </label>
              <textarea
                value={resumen}
                onChange={(e) => setResumen(e.target.value)}
                placeholder="Breve resumen del artículo (150-300 palabras)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido Completo
              </label>
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Contenido completo del artículo de investigación..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px]"
                required
              />
            </div>

            <Input
              type="text"
              label="Categoría"
              placeholder="Ej: Cambio Climático, Conservación, Biodiversidad, Ecosistemas"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />

            <Input
              type="url"
              label="URL de Imagen (opcional)"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={urlImagen}
              onChange={(e) => setUrlImagen(e.target.value)}
            />

            <Input
              type="text"
              label="Fuente/Publicación (opcional)"
              placeholder="Ej: Nature, Science, Marine Biology Journal"
              value={fuente}
              onChange={(e) => setFuente(e.target.value)}
            />

            <Input
              type="text"
              label="Palabras Clave (opcional)"
              placeholder="coral, arrecifes, temperatura, océano, conservación"
              value={palabrasClave}
              onChange={(e) => setPalabrasClave(e.target.value)}
            />

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex items-center gap-2" isLoading={createMutation.isPending}>
                <Save className="w-5 h-5" />
                Crear Artículo
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
