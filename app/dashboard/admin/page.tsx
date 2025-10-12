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
  Waves,
  Plus,
  Edit,
  Trash2,
  Users
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 1. Cargar usuario desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);

    // Verificar si es admin
    if (parsedUser.rol !== "admin") {
      router.push("/dashboard");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  // 2. Obtener todos los artículos
  const { data: articulos, refetch } = trpc.articulo.getAll.useQuery();

  // 3. Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // 4. Eliminar artículo
  const deleteMutation = trpc.articulo.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este artículo?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* 5. Navegación lateral */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl">
              <Waves className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BlueEdu</h1>
              <p className="text-xs text-gray-500">ODS 14 - Admin</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Home className="w-5 h-5" />
              Inicio
            </Link>
            <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
              <Users className="w-5 h-5" />
              Administración
            </Link>
            <Link href="/dashboard/cursos" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <BookOpen className="w-5 h-5" />
              Mis Cursos
            </Link>
            <Link href="/dashboard/simulador" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Waves className="w-5 h-5" />
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

      {/* 6. Contenido principal */}
      <main className="ml-64 p-8">
        {/* 7. Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Administración de Contenido</h2>
            <p className="text-gray-600 mt-2">Gestiona artículos de investigación y especies marinas</p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/admin/crear-articulo">
              <Button className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Crear Artículo
              </Button>
            </Link>
            <Link href="/dashboard/admin/crear-especie">
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="w-5 h-5" />
                Crear Especie
              </Button>
            </Link>
          </div>
        </div>

        {/* 8. Lista de artículos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Artículo</th>
                <th className="px-6 py-4 text-left font-semibold">Autor</th>
                <th className="px-6 py-4 text-left font-semibold">Categoría</th>
                <th className="px-6 py-4 text-left font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left font-semibold">Vistas</th>
                <th className="px-6 py-4 text-left font-semibold">Estado</th>
                <th className="px-6 py-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos?.map((articulo, index) => (
                <tr key={articulo.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{articulo.titulo}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{articulo.resumen}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{articulo.autor}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {articulo.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(articulo.fecha_publicacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{articulo.vistas}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        articulo.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {articulo.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/dashboard/admin/editar-articulo/${articulo.id}`}>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(articulo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!articulos || articulos.length === 0) && (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay artículos creados aún</p>
              <p className="text-gray-400 mt-2">Crea tu primer artículo de investigación para comenzar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
