import { env } from "../env.ts";
import { app } from "./server.ts";

app.listen(env.PORT, () => {
  console.log(
    `🚀 Server running in ${env.NODE_ENV} mode at http://${env.HOST}:${env.PORT}`,
  );
});
