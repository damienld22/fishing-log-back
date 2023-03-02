import express, { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes";
import { MongoClient } from "mongodb";
import { ShoppingService } from "./services/shopping";
import { PreparationService } from "./services/preparation";
import { PlacesService } from "./services/places";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

RegisterRoutes(app);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

// MongoDB connection
const mongodbClient = new MongoClient(process.env.MONGODB_URL!);

async function main() {
  await mongodbClient.connect();
  console.log("[database] Sucessful connection");
  const db = mongodbClient.db(process.env.MONGODB_NAME!);

  // Services configuration
  ShoppingService.setDb(db);
  PreparationService.setDb(db);
  PlacesService.setDb(db);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

main();
