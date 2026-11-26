# Niñas Pro — Galería de juegos Pygame

Galería web hecha con **Astro + Tailwind CSS v4** para mostrar los videojuegos que las estudiantes crean en Python/Pygame, organizados por **sede** y, dentro de cada sede, por semestre. Los juegos corren en el navegador gracias a **pygbag** (WebAssembly). El código original de cada alumna (`game.py`) no se modifica. Solo se hacen excepciones puntuales, documentadas en el README de la carpeta de fuentes del semestre (`pygames-AAAA-N`). Hasta ahora son **Dear Witch** y **JumpBlast**.

## Comandos

| Comando             | Acción                                         |
| :------------------ | :--------------------------------------------- |
| `npm install`       | Instala dependencias                           |
| `npm run dev`       | Levanta el servidor de desarrollo en `localhost:4321` (se detiene con `Ctrl+C`) |
| `npx astro dev --background` | Igual que `npm run dev`, pero en segundo plano |
| `npx astro dev stop` | Detiene el servidor que quedó en segundo plano |
| `npx astro dev status` | Muestra si hay un servidor corriendo y en qué dirección |
| `npm run build`     | Genera el sitio en `./dist/`                   |
| `npm run preview`   | Previsualiza el build                          |

### Cómo detener el servidor

- **Si lo levantaste con `npm run dev`:** en esa misma terminal, aprieta `Ctrl+C`.
- **Si `npm run dev` dice que ya hay un servidor corriendo:** quedó uno en segundo plano (por ejemplo, uno que dejó Claude Code). Detenlo con:

  ```sh
  npx astro dev stop
  ```

  Escribe `npx` adelante. `astro dev stop` a secas da "command not found", porque `astro` está instalado en el proyecto y no en el computador. También sirve `npm run astro -- dev stop`.
- **Si nada de eso funciona:** busca qué proceso usa el puerto y ciérralo:

  ```sh
  lsof -i :4321      # muestra el PID en la segunda columna
  kill <PID>
  ```

## Estructura

```text
public/juegos/<sede>/<semestre>/<juego>/  # build de pygbag (index.html, <juego>.tar.gz, .apk, favicon.png)
src/content/sedes/<sede>.yaml         # una sede (colección "sedes")
src/content/games/<juego>.md          # ficha del juego (colección "games")
src/content.config.ts                 # esquemas de las colecciones
src/components/SedeSection.astro      # bloque de una sede, se abre y se cierra
src/components/GameCard.astro         # tarjeta del catálogo
src/lib/url.ts                        # withBase(): agrega la ruta base a los enlaces (GitHub Pages)
.github/workflows/deploy.yml          # publica en GitHub Pages en cada push a main
wrangler.jsonc                        # configuración para Cloudflare (por si se usa más adelante)
src/layouts/Layout.astro              # layout (carga src/styles/global.css con Tailwind)
src/pages/index.astro                 # catálogo: sedes → semestres → juegos
src/pages/jugar/[id].astro            # página del juego, con un <iframe> hacia gameUrl
```

## Publicar en internet

El sitio se publica con **GitHub Pages** en `https://ninaspro.github.io/game-gallery-web/`. Cada `git push` a la rama `main` lo compila y publica solo, con el workflow `.github/workflows/deploy.yml`. Para que funcione, el repositorio debe tener activado **Settings → Pages → Source: GitHub Actions** (se hace una sola vez). El avance de cada publicación se ve en la pestaña **Actions**.

**Enlaces internos:** en GitHub Pages el sitio no vive en `/` sino en `/game-gallery-web/`. Por eso, todo enlace a una página o archivo del sitio se escribe con `withBase()`:

```astro
---
import { withBase } from '../lib/url';
---
<a href={withBase('/jugar/sushi')}>Jugar</a>      <!-- bien -->
<a href="/jugar/sushi">Jugar</a>                  <!-- se rompe en GitHub Pages -->
```

En local no se nota la diferencia, así que para probar la versión de GitHub Pages:

```sh
BASE_PATH=/game-gallery-web npm run build
BASE_PATH=/game-gallery-web npx astro preview --port 4400   # abrir http://localhost:4400/game-gallery-web/
```

Los `gameUrl` de las fichas se escriben igual que siempre (`/juegos/...`): la página del juego les agrega la ruta base.

## Sedes

Hoy hay una sola sede: **Las Condes**. En el catálogo, cada sede es un bloque que se abre y se cierra con un clic. Dentro van sus semestres, del más reciente al más antiguo. Arriba, en la portada, hay un botón por sede que lleva directo a su bloque.

### Cómo agregar una sede

1. Crea `src/content/sedes/<sede>.yaml`. El nombre del archivo, en minúsculas, sin tildes y con guiones, es el identificador de la sede:

   ```yaml
   # src/content/sedes/san-joaquin.yaml
   nombre: "San Joaquín"
   orden: 2   # las sedes se muestran de menor a mayor
   ```

2. Pon los juegos de esa sede en `public/juegos/<sede>/<semestre>/<juego>/`.
3. En la ficha de cada juego, usa `sede: "<sede>"` (ver el paso 5 de "Cómo agregar un juego").
4. Levanta el servidor (`npm run dev`) y revisa en http://localhost:4321 que:
   - [ ] aparezca el botón de la sede nueva arriba, en la portada, y que lleve a su bloque;
   - [ ] el bloque muestre el nombre correcto y la cantidad de juegos;
   - [ ] el bloque se abra y se cierre con un clic;
   - [ ] la página de cada juego diga "Sede <nombre>".

No hay que tocar el código de las páginas. Una sede sin juegos no aparece en el catálogo.

Si una ficha tiene una sede que no existe, por ejemplo `sede: "las-kondes"`, el sitio no compila y el error dice qué juego tiene el problema: `entry "sushi" ... references "las-kondes" in collection "sedes", but that entry does not exist`.

## Cómo agregar un juego

### Antes de empezar: revisar el código

Antes de compilar, conviene revisar el código de las alumnas:

- **Archivo principal.** Normalmente es `game.py`. Si tiene otro nombre (por ejemplo `sushi.py`), hay que cambiar `GAME_FILE` en `main.py`.
- **Imágenes y sonidos.** Anota todos los archivos que carga el código (`pygame.image.load`, `pygame.mixer...`). Todos deben estar en la carpeta del juego, con el nombre **exacto**: en el navegador, `Fondo.jpg` y `fondo.jpg` son archivos distintos.
- **Música.** Debe estar en formato **`.ogg`**. Los `.mp3` y `.wav` pueden no sonar en el navegador. Si viene en otro formato, conviértela y actualiza el nombre en el código.
- **Tamaño de la ventana.** Busca `pygame.display.set_mode((ancho, alto))`. Esos números van en la ficha del juego.
- **Nombre del juego.** Si usa el nombre de un juego comercial (como "Cuphead"), conviene ponerle otro título en la ficha.

### Si el juego llega ya compilado

A veces el juego llega ya compilado, con `index.html`, `.apk`, `.tar.gz` y `favicon.png` (como pasó con **Dear Witch**). En ese caso, sáltate los pasos 1 a 3, pero revisa igual:

- que el `main.py` del tar sea el universal: `diff <(tar -xzOf <nuevo>.tar.gz assets/main.py) <(tar -xzOf public/juegos/las-condes/2026-2/atrapa-los-deseos/grupo.3.atrapa.los.deseos.tar.gz assets/main.py)`;
- que estén todas las imágenes y sonidos: `tar -tzf <nuevo>.tar.gz`;
- el código del juego, para sacar el tamaño de la ventana y los controles: `tar -xzOf <nuevo>.tar.gz assets/game.py`.

Casi siempre falta el **parche del paso 4**, y luego hay que crear la ficha (paso 5).

### 1. Preparar la carpeta del juego

La carpeta debe tener:

- el código original de las alumnas (`game.py`), **sin modificarlo**;
- todas las imágenes y sonidos;
- el `main.py` universal.

Para el `main.py`, usa siempre la versión más reciente, la de **Atrapa los deseos** (`2026-2`). Para sacarla del juego compilado:

```sh
tar -xzOf public/juegos/las-condes/2026-2/atrapa-los-deseos/grupo.3.atrapa.los.deseos.tar.gz assets/main.py > main.py
```

Este `main.py`:

- reemplaza `colab_window` por una versión falsa, porque los juegos hechos en Google Colab hacen `import colab_window` y esa librería no funciona en el navegador;
- crea `pygame.locals` si falta;
- se ubica en la carpeta del juego, para que `pygame.image.load("imagen.png")` encuentre los archivos;
- con `ast`, agrega `await asyncio.sleep(0)` a los bucles del juego. Funciona tanto si el `while` está suelto en el archivo como si está dentro de una función (`def juego(): while True:`).

Lo que **no** maneja: bucles del juego dentro de métodos de una clase. Si aparece un juego así, habrá que adaptar `main.py`.

### 2. Compilar con pygbag

Se usa pygbag 0.9.3 con Python 3.12:

```sh
python3 -m pygbag <juego>          # prueba en http://localhost:8000
python3 -m pygbag --build <juego>  # solo genera <juego>/build/web/
```

### 3. Copiar el build a Astro

Copia el contenido de `<juego>/build/web/` a `public/juegos/<sede>/<semestre>/<juego>/`. Debe quedar así:

```text
public/juegos/las-condes/2026-2/atrapa-los-deseos/
├── index.html
├── <nombre>.apk
├── <nombre>.tar.gz
└── favicon.png
```

Los archivos `.apk` y `.tar.gz` toman el nombre de la carpeta que se compiló (por ejemplo `grupo.3.atrapa.los.deseos`), y ese nombre puede ser distinto al de la carpeta en `public/`. Está bien así, porque el `index.html` los nombra igual. Si los renombras, cambia también todas las menciones en `index.html`.

Para confirmar que no falta ningún archivo dentro del juego:

```sh
tar -tzf public/juegos/<sede>/<semestre>/<juego>/<nombre>.tar.gz
```

### 4. Aplicar el parche obligatorio en `index.html`

Cambia una sola línea:

```diff
- tar = tarfile.open(fileobj=archive, mode="r:gz")
+ tar = tarfile.open(fileobj=archive, mode="r:*")
```

**Sin este cambio, el juego se queda pegado en "Loading".** Más abajo se explica por qué hace falta. El resto de la plantilla generada se deja tal cual.

### 5. Crear la ficha del juego

Crea `src/content/games/<juego>.md`:

```md
---
title: "Atrapa los deseos"
authors: "Josefina Castro, Julieta Parra y Elizabeth Ocando"
sede: "las-condes"
semester: "2026-2"
description: "Mueve la canasta para atrapar las estrellas..."
controls: "Teclas ← y → para moverse · Espacio para comenzar"
gameUrl: "/juegos/las-condes/2026-2/atrapa-los-deseos/index.html"
width: 600
height: 400
---
```

- `authors`: nombres completos, separados por comas y con "y" antes del último.
- `sede`: el nombre de un archivo de `src/content/sedes/`, sin `.yaml`.
- `semester`: formato `AAAA-N`. Si es un semestre nuevo, la galería crea su sección automáticamente dentro de la sede y la muestra primero.
- `gameUrl`: debe calzar exactamente con la ruta de la carpeta dentro de `public/`.
- `width` / `height`: los números de `set_mode`. Si no coinciden, el juego se ve deformado o con bordes.
- `description`: si la escribes tú, pídele a las autoras que la revisen.

### 6. Probar en el navegador

Levanta el servidor (`npm run dev`), entra a http://localhost:4321 y revisa que:

- [ ] el juego aparezca en su sede y semestre, con el título y las autoras correctas;
- [ ] cargue y no se quede en "Loading";
- [ ] respondan los controles (primero hay que hacer clic dentro del juego);
- [ ] se escuche la música, si tiene;
- [ ] se pueda ganar, perder y reiniciar.

### Detalles del código que conviene comentar con las autoras

Estos detalles no impiden publicar el juego, pero se notan en el navegador. No los corrijas en `game.py`: coméntalos con las autoras.

- **Salir del juego con ESC o `pygame.quit()`.** En el navegador, la pantalla queda congelada y hay que recargar la página.
- **Símbolos especiales en los textos** (◄ ► ★, emojis). Pueden verse como cuadraditos, porque la fuente del navegador no los tiene.
- **Ventanas grandes** (más de ~800 px). No caben completas en pantallas chicas.
- **Imágenes muy pesadas.** Las fotos de varios MB (por ejemplo, `.jpg` de 2 MB que se muestran a 680×420) hacen que el juego tarde en cargar. Se pueden achicar sin cambiar el nombre del archivo ni el código, por ejemplo a 2 veces el tamaño de la ventana: `sips -z <alto> <ancho> -s formatOptions 85 imagen.jpg` (en Mac). Guarda antes las originales fuera de la carpeta del juego. Se hizo así con Dear Witch.

## Problema resuelto: el juego se quedaba en "Loading, please wait..."

### Síntoma

El juego funcionaba en el servidor de pruebas de pygbag (`localhost:8000`). Dentro de Astro (`/jugar/dia-lluvioso`), en cambio, se quedaba en una pantalla gris con el cartel verde **"Loading, please wait..."** y no respondía a los clics.

### Causa

El servidor de desarrollo de Astro (Vite) entrega los archivos `.tar.gz` con el header `Content-Encoding: gzip`. Por eso el navegador descomprime el archivo antes de pasárselo a Python. Luego `tarfile.open(..., mode="r:gz")` intenta descomprimir un `.tar` que ya no está comprimido y falla. `custom_site()` se cae sin mostrar error y el cartel nunca se oculta.

La pista estaba en la consola: `End.cross_file.fetch ... r/w= 532480`. Esa cifra es el tamaño del tar **descomprimido**, mientras que el `.tar.gz` pesa 496 368 bytes. El servidor de pygbag no envía ese header, y por eso allá sí funcionaba.

### Solución

Usar `mode="r:*"`, como se indica en el paso 4. Así `tarfile` detecta solo si el archivo viene comprimido, y funciona con Vite, con pygbag y con cualquier hosting.

### Cosas que no eran la causa (se pueden ignorar)

- `PyMain: BrowserFS not found` y el 404 de `browserfs.min.js`: también aparecen cuando el juego funciona bien.
- El log `window[DEBUG] ... 240, 240` y el recuadro celeste pequeño: son cálculos de tamaño internos de `pythons.js`.
- `** MEDIA USER ACTION REQUIRED **`: con `ume_block: 1`, que es el valor por defecto, el juego espera un clic para activar el audio. La página `/jugar/[id]` ya le pide a la jugadora que haga clic dentro del juego.

### Errores a evitar al editar `index.html`

- La primera parte del `<script>` es **código Python**. Para comentar líneas ahí se usa `#`, no `//`: con `//` el script entero falla por error de sintaxis.
- No hace falta cambiar `ume_block`, `autorun`, `fb_width` ni `fb_height`. El canvas se escala solo al tamaño del `<iframe>`.
