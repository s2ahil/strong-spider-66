import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const router = new Router();
router
  
  .get("/", async (context) => {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
    const jokes = await res.json();
    context.response.body = jokes;
  })
  .get("/api/random", async (context) => {
    const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
    const randomJoke = await res.json();
    context.response.body = randomJoke;
  });

const app = new Application();
app.use(oakCors()); 
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
