import { Request } from "express";

// Define the User shape based on your MongoDB Model
interface IUser {
  _id: string;
  name: string;
  level: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
