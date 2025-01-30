import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { IUser } from "@/models/user";
// import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import { generateRandomString } from "@/helpers/randomStrings";
import { db } from "@/db/drizzle";
import { User, users } from "@/db/migrations/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const { ...user }: IUser = await request.json();
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

    if (!user.password || user.password.length < 6) {
      return NextResponse.json(
        {
          ok: false,
          message: "La contraseña debe tener mas de 6 caracteres"
        },
        {
          status: 400
        }
      );
    }

    // await connectDB();
    // const BDuser = await User.findOne({ user: user.user });

    // if (BDuser) {
    //   return NextResponse.json(
    //     {
    //       ok: false,
    //       message: "El usuario ya existe en la base de datos"
    //     },
    //     {
    //       status: 409
    //     }
    //   );
    // }

    const existingUser = await db.select().from(users).where(eq(users.userName, user.userName));

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El usuario ya existe en la base de datos"
        },
        {
          status: 409
        }
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);
    const newKey = generateRandomString(26);

    const newUser = await db
      .insert(users)
      .values({
        name: user.userName,
        lastName: user.lastName,
        key: newKey,
        userName: user.userName,
        privileges: user.privileges,
        area: user.area,
        password: hashedPassword
      })
      .returning();

    // const newUser = new User({ ...user, password: hashedPassword, key: newKey });
    // await newUser.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newUser
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
      console.log("🚀 ~ POST ~ error:", error);
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

export async function GET(request: NextRequest) {
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
    // const listOfUsers = (await User.find()).reverse();

    const listOfUsers = await db.select().from(users);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: listOfUsers
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
      console.log("🚀 ~ GET ~ error:", error);
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

export async function PUT(request: NextRequest) {
  const { ...user }: User = await request.json();
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
    // const userToUpdate = await User.findById(user._id);

    const userToUpdate = await db.select().from(users).where(eq(users.id, user.id));

    if (userToUpdate.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "El usuario a actualizar no existe"
        },
        {
          status: 409
        }
      );
    }

    // const updatedUser = await User.findByIdAndUpdate(user._id, { ...user }, { new: true });

    // Perform the update
    const updatedUser = await db.update(users).set(user).where(eq(users.id, user.id)).returning();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: updatedUser
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
      console.log("🚀 ~ PUT ~ error:", error);
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
