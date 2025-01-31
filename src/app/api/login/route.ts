import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/db/drizzle";
import { signJwtAccessToken } from "@/libs/jwt";
import { users } from "@/db/migrations/schema";

export async function POST(request: Request) {
  const { user, password } = await request.json();
  try {
    const DBUser = await db.select().from(users).where(eq(users.userName, user));

    if(DBUser.length === 0) {
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
      const accessToken = signJwtAccessToken(DBUser[0]);
      const DBUserJSON = DBUser[0];
      const result = {
        ...DBUserJSON,
        accessToken
      };

      return new NextResponse(JSON.stringify(result), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify(error));
  }
}
