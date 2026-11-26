import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Una sede por archivo en src/content/sedes/<sede>.yaml
const sedes = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/sedes" }),
  schema: z.object({
    nombre: z.string(),
    orden: z.number().default(99),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/games" }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    // Debe calzar con un archivo de src/content/sedes/. Si no existe, el sitio no compila.
    sede: reference('sedes'),
    semester: z.string(),
    description: z.string(),
    controls: z.string().default("Flechas izquierda y derecha"),
    gameUrl: z.string(),
    width: z.number().default(600),
    height: z.number().default(344),
  }),
});

export const collections = { games, sedes };
