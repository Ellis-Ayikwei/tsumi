import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    email: string;
    userType: "customer" | "agent" | "admin";
  };
}

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;

    socket.data.userId = decoded.user_id;
    socket.data.email = decoded.email;
    socket.data.userType = decoded.user_type;

    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
};


