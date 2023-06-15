import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno/x/cors@v1.2.2/mod.ts";
import { open, DB } from "https://deno.land/x/sqlite/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const styles = `
  body {
    background-color:#86EFAC;
    font-family: sans-serif;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    height:100vh;
    font-weight: 900;
    color: black;
    font-size: 1em;
  }
  h1 {
    color: blue;
  }
`;

const router = new Router();
const db = new DB("kv.db");

async function getRandomJoke() {
  const res = await fetch(
    "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart",
  );
  const jokes = await res.json();
  let text = jokes.setup.replace(/<.*?>/g, "");
  text += `\n\n<h1>${jokes.delivery}</h1>`;
  return text;
}

router.get("/", async (context) => {
  let text;
  const storedJoke = db.query("SELECT value FROM kv WHERE key = 'joke'");
  if (storedJoke.length > 0) {
    text = storedJoke[0].value;
  } else {
    text = await getRandomJoke();
    db.query("INSERT INTO kv (key, value) VALUES (?, ?)", ["joke", text]);
    db.query("INSERT INTO kv (key, value) VALUES (?, ?)", ["likes", 0]);
  }
  const likes = db.query("SELECT value FROM kv WHERE key = 'likes'")[0].value;
  context.response.body = `<!DOCTYPE html>
    <html>
    <head>
      <style>${styles}</style> 
      <meta http-equiv="refresh" content="15">
    </head>
    <body>
      ${text}
      <br>
      <button onclick="fetch('/like', { method: 'POST' }).then(() => location.reload())">Like</button>
      <p>Likes: ${likes}</p>
    </body>
    </html>`;
});

router.post("/like", async (context) => {
  const likes = db.query("SELECT value FROM kv WHERE key = 'likes'")[0].value;
  db.query("UPDATE kv SET value = ? WHERE key = 'likes'", [likes + 1]);
  context.response.status = 200;
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
