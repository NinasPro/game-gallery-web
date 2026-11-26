// Agrega la ruta base del sitio a un enlace interno.
// En local y con dominio propio la base es "/", así que no cambia nada.
// En GitHub Pages el sitio vive en /<repositorio>/, por ejemplo /game-gallery-web/,
// y sin esto los enlaces que empiezan con "/" se romperían.
// Uso: withBase('/jugar/sushi')  →  '/game-gallery-web/jugar/sushi'
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
