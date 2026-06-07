import crypto from "node:crypto";

import {NextRequest} from "next/server";
import {prisma} from "@/lib/db";

export async function POST(request: NextRequest) {
  const {email, password, username} = await request.json();

  if (!email || !password || !username) {
    return new Response(JSON.stringify({error: "Missing required fields"}), {
      status: 400,
    });
  }

  const checkUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (checkUser) {
    return new Response(JSON.stringify({error: "User already exists"}), {
      status: 400,
    });
  }

  const salt = await crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hash,
      salts: salt,
    },
  });

  return new Response(
    JSON.stringify({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }),
    {
      status: 201,
    },
  );
}
