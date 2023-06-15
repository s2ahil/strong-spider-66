import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const router = new Router();
router
  // .get("/", (context) => {
  //   context.response.body = `
  //     <h1>Welcome to joke API!</h1>
  //   `;
  // })
  .get("/", async (context) => {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
    const joke = await res.json();
    let html = `<h1>Here is a programming joke:</h1>`;
    html += `<p>${joke.setup} <em>${joke.delivery}</em></p>`;
    context.response.body = html;
  })
  .get("/api/random", async (context) => {
    const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
    const randomJoke = await res.json();
    const html = `
      <h1>Here is a random joke:</h1>
      <p>${randomJoke.setup} <em>${randomJoke.punchline}</em></p>
    `;
    context.response.body = html;
  });

const app = new Application();
app.use(oakCors());  
app.use(router.routes());
app.use(router
