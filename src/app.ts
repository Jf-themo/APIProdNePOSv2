import express, { Application } from "express";
import morgan from "morgan";
import userRoute from "./routes/user.routes";
import authRoute from "./routes/auth.routes";
import billRouter from "./routes/bill.routes";
import cors from "cors";

export class App {
  private app: Application;
  private port: number | string;

  constructor(port?: number | string) {
    this.app = express();
    this.port = port || process.env.PORT || 3000;
    this.app.use(express.json());
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(cors()); // Permitir peticiones de cualquier origen
  }

  routes() {
    this.app.use(userRoute);
    this.app.use(authRoute);
    this.app.use(billRouter);
  }

  async listen() {
    await this.app.listen(this.port);
    console.log("Server on port", this.port);
  }
}
