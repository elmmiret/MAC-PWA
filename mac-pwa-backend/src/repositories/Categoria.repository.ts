import { PrismaClient, Categoria, TCategoria, DiesSetmana} from "@prisma/client";

const prisma = new PrismaClient();

export class CategoriaRepository {

  /**
   * Finds all categories.
   * @returns A promise resolving to an array of all categories.
   */
  async findAll(): Promise<Categoria[]> {
    return await prisma.categoria.findMany({
      include: {
        usuaris: true,
        rankings: true,
        quotaConfigs: true
      },
      orderBy: { tipus: "asc" },
    });
  }

  async findById(id: string): Promise<Categoria | null> {
    return await prisma.categoria.findUnique({
      where: { id },
      include: {
        usuaris: true,
        rankings: true,
        quotaConfigs: true
      },
    });
  }

  async findByTipus(tipus: TCategoria): Promise<Categoria[]> {
    return await prisma.categoria.findMany({
      where: { tipus },
      include: {
        usuaris: true,
        rankings: true,
        quotaConfigs: true
      },
      orderBy: { id: "asc" },
    });
  }
  

  // async create(data: CrearCategoriaData): Promise<Categoria> {
  //   return await prisma.categoria.create({ data });
  // }

  // async update(
  //   id: string,
  //   data: ActualizarCategoriaData,
  // ): Promise<Categoria> {
  //   return prisma.categoria.update({
  //     where: { id },
  //     data,
  //   });
  // }

  async deleteCategoria(id: string): Promise<void> {
    await prisma.categoria.delete({
      where: { id },
    });
  }

  async deleteCategories(ids: string[]): Promise<void> {
    await prisma.categoria.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
