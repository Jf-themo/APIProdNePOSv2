import { Request, Response } from "express";

function index(req: Request, res: Response) {
  res.json({
    message: "Si funciono desde el controlador",
  });
}

export { index };
