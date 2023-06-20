import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";

export async function POST(request: Request) {
  const { user, userName, lastName, privileges, password, area } = await request.json();

  if (!password || password.length < 6) {
    return NextResponse.json(
      {
        ok: false,
        msg: "La contraseña debe tener mas de 6 caracteres",
      },
      {
        status: 400,
      }
    );
  }

  try {
    await connectDB();
    const BDuser = await User.findOne({ user });

    if (BDuser) {
      return NextResponse.json(
        {
          ok: false,
          msg: "El usuario ya existe en la base de datos",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      user,
      userName,
      lastName,
      privileges,
      password: hashedPassword,
      area,
    });

    const savedUser = await newUser.save();

    return NextResponse.json({
      ok: true,
      savedUser,
    });
  } catch (error) {
    console.log("🚀 ~ file: route.ts:52 ~ POST ~ error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          msg: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
