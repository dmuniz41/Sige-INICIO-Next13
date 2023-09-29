import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const { user, userName, lastName, privileges, password, area } = await request.json();
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          ok: false,
          message: "La contraseña debe tener mas de 7 caracteres",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();
    const BDuser = await User.findOne({ user });

    if (BDuser) {
      return NextResponse.json(
        {
          ok: false,
          message: "El usuario ya existe en la base de datos",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      key: user,
      user,
      userName,
      lastName,
      privileges,
      password: hashedPassword,
      area,
    });

    await newUser.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newUser,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al crear el usuario",
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function GET(request: Request) {
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const listOfUsers = (await User.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfUsers,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al listar los usuarios",
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const { _id, user, userName, lastName, privileges, area } = await request.json();
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const userToUpdate = await User.findOne({ _id });

    if (!userToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "El usuario a actualizar no existe",
        },
        {
          status: 409,
        }
      );
    }
    // const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await User.findOneAndUpdate({ _id }, { user, userName, lastName, privileges, area }, { new: true });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedUser,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al actualizar el usuario (Revise que los datos introducidos son correctos)",
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
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const userToDelete = await User.findOne({ user });

    if (!userToDelete) {
      return NextResponse.json({
        ok: true,
        message: "El usuario a borrar no existe",
      });
    }

    const deletedUser = await User.findOneAndDelete({ user });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedUser,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al eliminar el usuario",
        },
        {
          status: 400,
        }
      );
    }
  }
}
