import { db } from "@/db/drizzle";
import { users } from "@/db/migrations/schema";
import { signJwtAccessToken } from "@/libs/jwt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { user, password } = await request.json();

  try {
    const DBUser = await db.select().from(users).where(eq(users.userName, user));

    if (DBUser.length === 0) {
      return new NextResponse(
        JSON.stringify({
          ok: false,
          message: "El usuario no existe"
        }),
        {
          status: 404
        }
      );
    }

    if (DBUser && (await bcrypt.compare(password, DBUser[0].password))) {
      const DBUserJSON = DBUser[0];
      const accessToken = signJwtAccessToken({ id: DBUserJSON.id, user: DBUserJSON.userName });

      return new NextResponse(JSON.stringify({ id: DBUserJSON.id, user: DBUserJSON.userName, accessToken }), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });
    } else {
      console.log("🚀 ~ POST ~ Incorrect password"); // Add log for incorrect password
      return new NextResponse(
        JSON.stringify({
          ok: false,
          message: "Credenciales inválidas"
        }),
        {
          status: 401 // Return 401 for invalid credentials
        }
      );
    }
  } catch (error) {
    console.error("🚀 ~ POST ~ Error in login endpoint:", error);
    return new NextResponse(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
