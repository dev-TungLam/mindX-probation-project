import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

const CLIENT_ID = "mindx-onboarding";
const CLIENT_SECRET =
  "cHJldmVudGJvdW5kYmF0dHJlZWV4cGxvcmVjZWxsbmVydm91c3ZhcG9ydGhhbnN0ZWU="; // Ideally from env
const REDIRECT_URI =
  "https://mindx-devtunglam.52.234.236.158.nip.io/api/auth/callback";
const AUTH_ENDPOINT = "https://id-dev.mindx.edu.vn/auth";
const TOKEN_ENDPOINT = "https://id-dev.mindx.edu.vn/token";

export class AuthController {
  // Initiates the login flow
  public login(req: Request, res: Response) {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
    });

    res.redirect(`${AUTH_ENDPOINT}?${params.toString()}`);
  }

  // Handles the callback from IDP
  public async callback(req: Request, res: Response) {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await axios.post(
        TOKEN_ENDPOINT,
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code as string,
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { id_token, access_token } = tokenResponse.data;

      // Decode token to get user info (or use userinfo endpoint)
      const decoded: any = jwt.decode(id_token);

      // Redirect back to frontend with token
      // In production, set a detailed cookie, but for now passing via query param for simplicity
      res.redirect(
        `https://mindx-devtunglam.52.234.236.158.nip.io/login/callback?token=${id_token}&username=${decoded.email}`
      );
    } catch (error: any) {
      console.error("Callback error:", error.response?.data || error.message);
      res.status(500).json({ message: "Authentication failed" });
    }
  }

  public register(req: Request, res: Response) {
    res.status(405).json({ message: "Register via MindX ID" });
  }
}
