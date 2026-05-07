import { app } from "./server.ts";
import { env } from "../env.ts";

app.listen(env.PORT, () => {
  console.log(
    `🚀 Server running at http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
