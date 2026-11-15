import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in to continue.",
      });
    }

    req.user = {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
    req.session = session;

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired. Please log in again.",
    });
  }
};
