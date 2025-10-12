# BlueEdu - Plataforma Educativa ODS 14: Vida Submarina

Plataforma educativa interactiva enfocada en la conservación marina y los ecosistemas submarinos, alineada con el Objetivo de Desarrollo Sostenible #14 de las Naciones Unidas.

## Stack Tecnológico

- **Frontend**: Next.js 15 + React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: MySQL con Prisma ORM
- **API**: tRPC (Type-safe APIs)
- **Validaciones**: Zod
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **Autenticación**: Sistema custom con bcrypt

## Características Implementadas

### ✅ Configuración Completa
- Proyecto Next.js con TypeScript
- Tailwind CSS configurado con paleta de colores temática oceánica
- Prisma ORM con MySQL
- tRPC para APIs tipo-seguras
- Estructura de proyecto organizada

### ✅ Base de Datos (Schema Prisma)
- **Users**: Sistema de usuarios con autenticación
- **Ecosystems**: Simulador de ecosistemas marinos con parámetros configurables
- **Progress**: Seguimiento de progreso en cursos educativos
- **Certificates**: Sistema de certificados digitales
- **Articles**: Wiki de artículos educativos

### ✅ APIs tRPC
- **Auth Router**: Login, registro y gestión de usuarios
- **Ecosystem Router**: CRUD completo de ecosistemas marinos
- **Progress Router**: Seguimiento de progreso educativo

## Próximos Pasos

### PASO 1: Configurar Base de Datos MySQL

Necesitas tener MySQL instalado. Luego ejecuta:

\`\`\`bash
# En Windows PowerShell o CMD
cd "C:\Users\ASUS\OneDrive\Desktop\DESARROLLO SOSTENIBLE\blue-edu"

# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push
\`\`\`

### PASO 2: Variables de Entorno

Edita el archivo `.env` y ajusta la conexión a MySQL:

\`\`\`env
DATABASE_URL="mysql://root:TU_CONTRASEÑA@localhost:3306/blue_edu"
\`\`\`

### PASO 3: Iniciar el Proyecto

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

\`\`\`
blue-edu/
├── app/                      # Next.js App Router
│   ├── api/trpc/            # Endpoints tRPC
│   ├── _trpc/               # Provider de tRPC
│   ├── globals.css          # Estilos globales
│   └── layout.tsx           # Layout raíz
├── components/              # Componentes React (próximo)
├── lib/                     # Utilidades
│   └── prisma.ts           # Cliente de Prisma
├── prisma/                  # Configuración de base de datos
│   └── schema.prisma       # Schema de la BD
├── public/                  # Assets estáticos
├── server/                  # Backend tRPC
│   ├── routers/            # Routers de API
│   ├── context.ts          # Contexto de tRPC
│   └── trpc.ts             # Configuración tRPC
└── utils/                   # Utilidades compartidas
    └── trpc.ts             # Cliente tRPC

\`\`\`

## Parámetros del Simulador de Ecosistema

- **Temperatura**: -2°C a 35°C (óptimo: 22-28°C)
- **Salinidad**: 0-50 ppt (partes por mil)
- **Nivel de CO2**: 200-1000 ppm (óptimo: 350-450)
- **Población de Peces**: 0-500 individuos
- **Crecimiento Coral**: 0-100%
- **Salud del Coral**: 0-100% (calculado automáticamente)
- **Biodiversidad**: 0-100% (basado en salud del coral)
- **Oxígeno Disuelto**: 0-15 mg/L

## Scripts Disponibles

\`\`\`bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar en producción
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema con BD
npm run db:studio    # Abrir Prisma Studio (GUI de BD)
\`\`\`

## Próximas Implementaciones

1. **Páginas de Login y Registro** (siguiente)
2. **Dashboard de Usuario**
3. **Simulador Interactivo de Ecosistema**
4. **Wiki Educativa**
5. **Sistema de Cursos**
6. **Generador de Certificados**

## Autor

Proyecto desarrollado para educación sobre conservación marina - ODS #14

## Licencia

ISC
 
