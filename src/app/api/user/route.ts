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
        msg: "La contraseña debe tener mas de 7 caracteres",
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

    await newUser.save();

    return NextResponse.json({
      ok: true,
      user,
      userName,
      lastName,
      privileges,
      area,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function GET() {
  try {
    await connectDB();
    const listOfUsers = await User.find();
    return NextResponse.json({
      ok: true,
      listOfUsers,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const { user, userName, lastName, privileges, password, area } = await request.json();

  try {
    await connectDB();
    const userToUpdate = await User.findOne({ user });

    if (!userToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El usuario a actualizar no existe",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate({ user }, { user, userName, lastName, privileges, password: hashedPassword, area }, { new: true });

    return NextResponse.json({
      ok: true,
      message: "Usuario actualizado",
      userToUpdate,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PATCH(request: Request) {
  const { user } = await request.json();

  try {
    await connectDB();
    const userToDelete = await User.findOne({ user });

    if (!userToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El usuario a borrar no existe",
      });
    }

    const deletedUser = await User.findOneAndDelete({ user });

    return NextResponse.json({
      ok: true,
      message: "Usuario eliminado",
      deletedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
