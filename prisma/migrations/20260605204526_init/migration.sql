-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'GERENTE', 'SUPERVISOR', 'VENDEDOR', 'MARKETING');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('DNI', 'RUC');

-- CreateEnum
CREATE TYPE "Segmento" AS ENUM ('CORPORATIVO', 'PYME', 'MINORISTA', 'EMPRENDEDOR', 'NUEVO');

-- CreateEnum
CREATE TYPE "NivelActividad" AS ENUM ('ALTO', 'MEDIO', 'BAJO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoMeta" AS ENUM ('INDIVIDUAL', 'GRUPAL');

-- CreateEnum
CREATE TYPE "PeriodoMeta" AS ENUM ('MENSUAL', 'TRIMESTRAL');

-- CreateEnum
CREATE TYPE "EstadoKpi" AS ENUM ('ALTO', 'MODERADO', 'BAJO');

-- CreateEnum
CREATE TYPE "NivelAlerta" AS ENUM ('INFO', 'ADVERTENCIA', 'CRITICO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'VENDEDOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "telefono" TEXT,
    "avatarUrl" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL DEFAULT 'DNI',
    "documento" TEXT NOT NULL,
    "segmento" "Segmento" NOT NULL DEFAULT 'NUEVO',
    "nivelActividad" "NivelActividad" NOT NULL DEFAULT 'MEDIO',
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "sku" TEXT,
    "descripcion" TEXT,
    "precio" DECIMAL(12,2) NOT NULL,
    "categoria" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(14,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoMeta" NOT NULL DEFAULT 'INDIVIDUAL',
    "periodo" "PeriodoMeta" NOT NULL DEFAULT 'MENSUAL',
    "montoObjetivo" DECIMAL(14,2) NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER,
    "trimestre" INTEGER,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "vendedorId" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "nivel" "NivelAlerta" NOT NULL DEFAULT 'INFO',
    "estadoKpi" "EstadoKpi",
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "metaId" TEXT,
    "vendedorId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_documento_key" ON "clientes"("documento");

-- CreateIndex
CREATE INDEX "clientes_segmento_idx" ON "clientes"("segmento");

-- CreateIndex
CREATE INDEX "clientes_nivelActividad_idx" ON "clientes"("nivelActividad");

-- CreateIndex
CREATE UNIQUE INDEX "productos_sku_key" ON "productos"("sku");

-- CreateIndex
CREATE INDEX "ventas_vendedorId_idx" ON "ventas"("vendedorId");

-- CreateIndex
CREATE INDEX "ventas_clienteId_idx" ON "ventas"("clienteId");

-- CreateIndex
CREATE INDEX "ventas_fecha_idx" ON "ventas"("fecha");

-- CreateIndex
CREATE INDEX "metas_vendedorId_idx" ON "metas"("vendedorId");

-- CreateIndex
CREATE INDEX "metas_anio_idx" ON "metas"("anio");

-- CreateIndex
CREATE INDEX "alertas_leida_idx" ON "alertas"("leida");

-- CreateIndex
CREATE INDEX "alertas_vendedorId_idx" ON "alertas"("vendedorId");

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "metas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
