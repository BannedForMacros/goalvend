import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Sembrando datos de GoalVend...");

  // Limpieza (orden por dependencias)
  await prisma.alerta.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.meta.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.usuario.deleteMany();

  // ---------------- Usuarios ----------------
  const hash = (p: string) => bcrypt.hashSync(p, 10);

  const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador GoalVend",
      email: "admin@goalvend.pe",
      passwordHash: hash("admin123"),
      rol: "ADMIN",
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: "Giuliana Gerente",
      email: "gerente@goalvend.pe",
      passwordHash: hash("gerente123"),
      rol: "GERENTE",
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: "Roberto Supervisor",
      email: "supervisor@goalvend.pe",
      passwordHash: hash("super123"),
      rol: "SUPERVISOR",
    },
  });

  const vendedoresData = [
    { nombre: "Carlos Quispe", email: "carlos@goalvend.pe" },
    { nombre: "María Flores", email: "maria@goalvend.pe" },
    { nombre: "José Ramírez", email: "jose@goalvend.pe" },
    { nombre: "Lucía Torres", email: "lucia@goalvend.pe" },
    { nombre: "César Mendoza", email: "cesar@goalvend.pe" },
  ];
  const vendedores = [];
  for (const v of vendedoresData) {
    vendedores.push(
      await prisma.usuario.create({
        data: { ...v, passwordHash: hash("vendedor123"), rol: "VENDEDOR" },
      }),
    );
  }

  await prisma.usuario.create({
    data: {
      nombre: "Ana Marketing",
      email: "marketing@goalvend.pe",
      passwordHash: hash("mkt123"),
      rol: "MARKETING",
    },
  });

  // ---------------- Productos ----------------
  const productosData = [
    { nombre: "Plan Software Empresarial", precio: 3500, categoria: "Software" },
    { nombre: "Licencia CRM Pro", precio: 1200, categoria: "Software" },
    { nombre: "Consultoría Comercial", precio: 2800, categoria: "Servicios" },
    { nombre: "Capacitación de Ventas", precio: 900, categoria: "Servicios" },
    { nombre: "Soporte Premium Anual", precio: 1500, categoria: "Soporte" },
    { nombre: "Módulo de Analítica", precio: 2200, categoria: "Software" },
    { nombre: "Integración API", precio: 1800, categoria: "Servicios" },
    { nombre: "Dashboard Ejecutivo", precio: 2600, categoria: "Software" },
  ];
  const productos = [];
  for (let i = 0; i < productosData.length; i++) {
    productos.push(
      await prisma.producto.create({
        data: { ...productosData[i], sku: `GV-${1000 + i}` },
      }),
    );
  }

  // ---------------- Clientes ----------------
  const segmentos = ["CORPORATIVO", "PYME", "MINORISTA", "EMPRENDEDOR", "NUEVO"] as const;
  const niveles = ["ALTO", "MEDIO", "BAJO"] as const;
  const clientesData = [
    "Comercial Andina S.A.C.",
    "Inversiones del Sur E.I.R.L.",
    "Distribuidora Lima Norte S.A.",
    "Tecnología Global Perú S.A.C.",
    "Grupo Empresarial Pacífico",
    "Servicios Integrales Arequipa",
    "Corporación Textil del Norte",
    "Agroexportadora Valle Verde",
    "Constructora Los Andes S.A.C.",
    "Farmacéutica Salud Total",
    "Logística Express Perú",
    "Retail Moda Urbana S.A.C.",
  ];
  const clientes = [];
  for (let i = 0; i < clientesData.length; i++) {
    clientes.push(
      await prisma.cliente.create({
        data: {
          razonSocial: clientesData[i],
          tipoDocumento: "RUC",
          documento: `20${randInt(100000000, 599999999)}`,
          segmento: rand([...segmentos]),
          nivelActividad: rand([...niveles]),
          email: `contacto${i + 1}@cliente.pe`,
          telefono: `9${randInt(10000000, 99999999)}`,
        },
      }),
    );
  }

  // ---------------- Ventas (últimos 6 meses) ----------------
  const ahora = new Date();
  let totalVentas = 0;
  for (let i = 0; i < 220; i++) {
    const producto = rand(productos);
    const cantidad = randInt(1, 6);
    const precio = Number(producto.precio);
    const total = precio * cantidad;
    const diasAtras = randInt(0, 175);
    const fecha = new Date(ahora);
    fecha.setDate(fecha.getDate() - diasAtras);

    await prisma.venta.create({
      data: {
        clienteId: rand(clientes).id,
        vendedorId: rand(vendedores).id,
        productoId: producto.id,
        cantidad,
        precioUnitario: precio,
        total,
        fecha,
      },
    });
    totalVentas++;
  }

  // ---------------- Metas (mes actual + trimestre) ----------------
  const anio = ahora.getFullYear();
  const mes = ahora.getMonth() + 1;
  const trimestre = Math.floor(ahora.getMonth() / 3) + 1;
  const inicioMes = new Date(anio, mes - 1, 1);
  const finMes = new Date(anio, mes, 0);

  for (const v of vendedores) {
    await prisma.meta.create({
      data: {
        nombre: `Meta mensual ${v.nombre.split(" ")[0]}`,
        tipo: "INDIVIDUAL",
        periodo: "MENSUAL",
        montoObjetivo: randInt(15, 35) * 1000,
        anio,
        mes,
        fechaInicio: inicioMes,
        fechaFin: finMes,
        vendedorId: v.id,
      },
    });
  }

  // Meta grupal mensual
  await prisma.meta.create({
    data: {
      nombre: "Meta grupal de la empresa",
      tipo: "GRUPAL",
      periodo: "MENSUAL",
      montoObjetivo: 120000,
      anio,
      mes,
      fechaInicio: inicioMes,
      fechaFin: finMes,
    },
  });

  // Meta trimestral grupal
  await prisma.meta.create({
    data: {
      nombre: `Meta trimestral Q${trimestre}`,
      tipo: "GRUPAL",
      periodo: "TRIMESTRAL",
      montoObjetivo: 380000,
      anio,
      trimestre,
      fechaInicio: new Date(anio, (trimestre - 1) * 3, 1),
      fechaFin: new Date(anio, trimestre * 3, 0),
    },
  });

  console.log(`Listo: ${vendedores.length} vendedores, ${clientes.length} clientes, ${productos.length} productos, ${totalVentas} ventas.`);
  console.log("Admin: admin@goalvend.pe / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
