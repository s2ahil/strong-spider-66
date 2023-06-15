import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const router = new Router();
router
  
  .get("/", async (context) => {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart");
    const jokes = await res.json();
    let text = jokes.setup.replace(/<.*?>/g, '');
    text += ` ${jokes.delivery}`;
    context.response.body = text;
  })
  .get("/api/random", async (context) => {
    const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
    const randomJoke = await res.json();
    let text = randomJoke.setup.replace(/<.*?>/g, '');
    text += ` ${randomJoke.punchline}`;
    context.response.body = text;
  });

const app = new Application();
app.use(oakCors());  
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
