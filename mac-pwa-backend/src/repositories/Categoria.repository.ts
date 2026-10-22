import { PrismaClient, type Categoria, type Prisma } from "@prisma/client";

export type CrearCategoriaData = Pick<
  Prisma.CategoriaCreateInput,
  | "tipus"
  | "anyNaixement"
  | "diesActivitat"
  | "horaEntrada"
  | "horaSortida"
  | "detalls"
>;

export type ActualizarCategoriaData = Partial<CrearCategoriaData>;

/** Acceso persistente a las categorias del club. */
export class CategoriaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Categoria[]> {
    return this.prisma.categoria.findMany({
      orderBy: { tipus: "asc" },
    });
  }

  async findById(id: string): Promise<Categoria | null> {
    return this.prisma.categoria.findUnique({
      where: { id },
    });
  }

  async findByTipus(tipus: Prisma.TCategoria): Promise<Categoria[]> {
    return this.prisma.categoria.findMany({
      where: { tipus },
      orderBy: { id: "asc" },
    });
  }

  async create(data: CrearCategoriaData): Promise<Categoria> {
    return this.prisma.categoria.create({ data });
  }

  async update(
    id: string,
    data: ActualizarCategoriaData,
  ): Promise<Categoria> {
    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Categoria> {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
