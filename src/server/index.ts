import { PrismaClient } from "../../prisma/@prisma/client";
import { router, publicProcedures } from "./trpc";
import z from "zod";

const prisma = new PrismaClient();

const pokemonSchema = z.object({
  name: z.string().refine((value) => value.trim().length > 0, {
    message: "Name cannot be empty or contain only spaces",
  }),
  types: z.array(z.string()).refine((value) => value.length > 0, {
    message: "At least one type must be specified",
  }),
  sprite: z.string().refine(
    (value) => {
      return (
        typeof value === "string" &&
        (value.startsWith("http") || value.startsWith("https"))
      );
    },
    {
      message: 'Sprite must be a string starting with "http" or "https"',
    }
  ),
});

export const appRouter = router({
  getPokemonBasedOnPage: publicProcedures
    .input(
      z.object({
        page: z.number(),
        pageSize: z.number(),
        query: z.optional(z.string()),
      })
    )
    .query(async (opts) => {
      const {
        input: { page, pageSize, query },
      } = opts;
      const limit = Math.max(1, pageSize || 10);
      const skip = (page - 1) * limit;
      const total = await prisma.pokemon.count();
      if (skip >= total || skip < 0) {
        return { data: [], total };
      }

      const types = query?.split(",").map((e) => e.trim()) || [];
      if (!query || types.length === 0) {
        const data = await prisma.pokemon.findMany({
          skip: skip,
          take: limit,
        });
        return { data, total };
      }
      const dbQuery = {
        skip: skip,
        take: limit,
        where: {
          types: {
            hasSome: types,
          },
        },
      };
      const filteredTotal = await prisma.pokemon.count(dbQuery);
      const data = await prisma.pokemon.findMany(dbQuery);
      return { data, total: filteredTotal };
    }),
  createPokemon: publicProcedures
    .input(pokemonSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const total = await prisma.pokemon.count();
      return prisma.pokemon.create({ data: { ...input, id: total + 1 } });
    }),
});

export type AppRouter = typeof appRouter;
