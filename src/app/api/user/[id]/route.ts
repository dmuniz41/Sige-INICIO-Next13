import { db } from "@/db/drizzle";
import { users } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
  const id = params.id;
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente"
        },
        {
          status: 401
        }
      );
    }
    // await connectDB();
    // const userToDelete = await User.findById(params.get("id"));

    const userToDelete = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (userToDelete.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          message: "El usuario a borrar no existe"
        },
        {
          status: 404
        }
      );
    }

    // const deletedUser = await User.findByIdAndDelete(params.get("id"));
    const deletedUser = await db.delete(users).where(eq(users.id, id));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: deletedUser
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ DELETE ~ error:", error);
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 500
        }
      );
    }
  }
}
