import express, { Application } from "express";
import morgan from "morgan";
import userRoute from "./routes/user.routes";
import authRoute from "./routes/auth.routes";
import billRouter from "./routes/bill.routes";
import noteCreditRoute from "./routes/noteCredit.routes";
import referenceRoute from "./routes/reference.routes";
import healthRoute from "./routes/health.routes";
import v3Router from "./routes/v3.routes";
import cors from "cors";
import Logger from "./services/Logger";
import { errorHandler, notFoundHandler, requestIdMiddleware } from "./middleware/errorHandler";
import { apiVersionMiddleware, getAllVersions, getLatestVersion } from "./middleware/apiVersion";

export class App {
  private app: Application;
  private port: number | string;

  constructor(port?: number | string) {
    this.app = express();
    this.port = port || process.env.PORT || 3000;
    this.app.use(express.json());
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  middlewares() {
    this.app.use(requestIdMiddleware);
    this.app.use(apiVersionMiddleware);
    this.app.use(morgan("combined", {
      stream: {
        write: (message: string) => {
          Logger.http(message.trim());
        }
      }
    }));
    this.app.use(cors());
    
    this.app.use((req, res, next) => {
      Logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        method: req.method,
        path: req.path
      });
      next();
    });
  }

  routes() {
    this.app.use(healthRoute);
    
    this.app.get("/api/versions", (req, res) => {
      res.json({
        versions: getAllVersions(),
        latest: getLatestVersion(),
        default: getLatestVersion()
      });
    });
    
    this.app.use("/v3", v3Router);
    
    this.app.use(userRoute);
    this.app.use(authRoute);
    this.app.use(billRouter);
    this.app.use(noteCreditRoute);
    this.app.use(referenceRoute);
  }

  errorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  async listen() {
    await this.app.listen(this.port);
    Logger.info(`Server started on port ${this.port}`, {
      environment: process.env.NODE_ENV || "development",
      port: this.port,
      apiVersion: getLatestVersion()
    });
  }
}