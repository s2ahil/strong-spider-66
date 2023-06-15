import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
const KV = await Deno.openKv();

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
const kv = new KV("jokes");

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
  const storedJoke = await kv.get("joke");
  if (storedJoke) {
    text = storedJoke;
  } else {
    text = await getRandomJoke();
    await kv.set("joke", text);
  }
  context.response.body = `<!DOCTYPE html>
    <html>
    <head>
      <style>${styles}</style> 
      <meta http-equiv="refresh" content="15">
    </head>
    <body>
      ${text}
    </body>
    </html>`;
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
