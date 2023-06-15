import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const styles = `
  body {
    font-family: sans-serif;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    height:100vh;
  }
  h1 {
    color: blue;
  }
`;

const router = new Router();
router
  
  .get("/", async (context) => {
    const res = await fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart");
    const jokes = await res.json();
    let text = jokes.setup.replace(/<.*?>/g, '');
    text += `\n\n<h1>${jokes.delivery}</h1>`;
    context.response.body = `<!DOCTYPE html>
<html>
<head>
  <style>${styles}</style> 
</head>
<body>
  ${text}
</body>
</html>`;
  })
  .get("/api/random", async (context) => {
    // ...
  });

const app = new Application();
app.use(oakCors());  
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
