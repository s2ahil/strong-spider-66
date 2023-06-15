import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const marqueeItems = await fetch("https://raw.githubusercontent.com/davakh/top-marquee/main/marquee-items.json").then(response => response.json());

const styles = `
  body {
    background-color: #1e1e1e;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0;
    padding: 0;
  }

  .marquee {
    display: flex;
    align-items: center;
    overflow: hidden;
    height: 50px;
    margin: 10px 0;
  }

  .marquee-item {
    margin-right: 30px;
  }
`;

const router = new Router();

router.get("/", (context) => {
  context.response.body = `<!DOCTYPE html>
    <html>
    <head>
      <style>${styles}</style> 
    </head>
    <body>
      <h1>Top Marquee Items</h1>
      <div class="marquee">
        ${marqueeItems.map(item => `<div class="marquee-item">${item}</div>`).join("")}
      </div>
    </body>
    </html>`;
});

const app = new Application();
app.use(oakCors());  
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
