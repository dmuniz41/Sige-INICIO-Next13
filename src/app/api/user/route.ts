import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import { db } from "@/db/drizzle";
import { generateRandomString } from "@/helpers/randomStrings";
import { IUser } from "@/models/user";
import { User, users } from "@/db/migrations/schema";
import { verifyJWT } from "@/libs/jwt";
import logger from "@/utils/logger";

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

    const decoded = jwt.decode(accessToken) as JwtPayload;
    logger.info("Crear Usuario", { method: request.method, url: request.url, user: decoded.userName });

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
      logger.error("Error al crear usuario", {
        error: error.message,
        stack: error.stack,
        route: "/api/user",
        method: "POST"
      });
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

    const decoded = jwt.decode(accessToken) as JwtPayload;
    logger.info("Listar Usuarios", { method: request.method, url: request.url, user: decoded.userName });

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
      logger.error("Error al listar usuarios", {
        error: error.message,
        stack: error.stack,
        route: "/api/user",
        method: "GET"
      });
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

    const decoded = jwt.decode(accessToken) as JwtPayload;
    logger.info("Actualizar Usuario", { method: request.method, url: request.url, user: decoded.userName });

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
      logger.error("Error al actualizar usuario", {
        error: error.message,
        stack: error.stack,
        route: "/api/user",
        method: "PUT"
      });
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
