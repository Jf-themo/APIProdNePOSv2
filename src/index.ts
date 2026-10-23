import { App } from "./app";

async function main() {
  const app = new App(6000);
  await app.listen();
}

main();
