import express from "express";
import cors from "cors";
import { optimize, SVGOConfig } from "svgo";

interface OptimizationRequest {
  svgString: string;
  config?: SVGOConfig;
}

interface OptimizationResponse {
  success: boolean;
  data?: string;
  error?: string;
  originalSize?: number;
  optimizedSize?: number;
  reductionPercentage?: number;
}

export class SVGOptimizationServer {
  private app: express.Application;
  private server: any;
  private port: number;

  constructor(port: number = 3600) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req: express.Request, res: express.Response) => {
      res.json({ status: "ok", message: "SVG Optimization Server is running" });
    });

    // Main optimization endpoint
    this.app.post(
      "/api/optimize",
      (req: express.Request, res: express.Response) => {
        try {
          const { svgString, config }: OptimizationRequest = req.body;

          if (!svgString) {
            return res.status(400).json({
              success: false,
              error: "SVG string is required",
            } as OptimizationResponse);
          }

          // Validate that the input is actually an SVG
          if (!svgString.trim().startsWith("<svg")) {
            return res.status(400).json({
              success: false,
              error: "Invalid SVG format",
            } as OptimizationResponse);
          }

          const originalSize = Buffer.byteLength(svgString, "utf8");

          // Default SVGO configuration
          const defaultConfig: SVGOConfig = {
            multipass: true,
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                    removeTitle: false,
                    removeDesc: false,
                  },
                },
              },
            ],
          };

          // Merge user config with default config
          const finalConfig = config
            ? { ...defaultConfig, ...config }
            : defaultConfig;

          // Optimize the SVG
          const result = optimize(svgString, {
            path: "input.svg",
            ...finalConfig,
          });

          if (!result.data) {
            return res.status(500).json({
              success: false,
              error: "Failed to optimize SVG",
              data: JSON.stringify(result.info),
            } as OptimizationResponse);
          }

          const optimizedSize = Buffer.byteLength(result.data, "utf8");
          const reductionPercentage =
            originalSize > 0
              ? ((originalSize - optimizedSize) / originalSize) * 100
              : 0;

          const response: OptimizationResponse = {
            success: true,
            data: result.data,
            originalSize,
            optimizedSize,
            reductionPercentage: Math.round(reductionPercentage * 100) / 100,
          };

          res.json(response);
        } catch (error) {
          console.error("Optimization error:", error);
          res.status(500).json({
            success: false,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          } as OptimizationResponse);
        }
      }
    );
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.port, () => {
          console.log(`SVG Optimization Server running on port ${this.port}`);
          resolve();
        });

        this.server.on("error", (error: any) => {
          if (error.code === "EADDRINUSE") {
            reject(new Error(`Port ${this.port} is already in use`));
          } else {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close((error: any) => {
          if (error) {
            reject(error);
          } else {
            console.log("SVG Optimization Server stopped");
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  public isRunning(): boolean {
    return this.server && this.server.listening;
  }

  public getPort(): number {
    return this.port;
  }
}
