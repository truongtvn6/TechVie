import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request interface to support req.user in TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: "admin" | "user";
      };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Read token from HttpOnly cookie first, then fall back to Authorization header
    let token = req.cookies.techvie_session;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không tồn tại hoặc đã hết hạn. Vui lòng đăng nhập lại."
      });
    }

    // 2. Verify token
    const jwtSecret = process.env.JWT_SECRET || "techvie_jwt_secret_key_2026";
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: "admin" | "user";
    };

    // 3. Attach decoded user payload to req
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error: any) {
    console.error("JWT auth verification failed:", error.message);
    
    // Clear the invalid cookie
    res.clearCookie("techvie_session");
    
    return res.status(401).json({
      success: false,
      message: "Chữ ký phiên xác thực không hợp lệ. Vui lòng đăng nhập lại."
    });
  }
};
