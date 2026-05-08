import env from "./env.js";
import app from "./server.js";

app.listen(env.PORT, () => {
  console.log(
    `🚀 Server running at http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`,
  );
});
