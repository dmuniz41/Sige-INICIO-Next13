import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User, { IUser } from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import { generateRandomString } from "@/helpers/randomStrings";

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

    await connectDB();
    const BDuser = await User.findOne({ user: user.user });

    if (BDuser) {
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

    const newUser = new User({ ...user, key: newKey });

    await newUser.save();

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
    console.log("🚀 ~ POST ~ error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al crear el usuario"
        },
        {
          status: 400
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

    await connectDB();
    const listOfUsers = (await User.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfUsers
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al listar los usuarios"
        },
        {
          status: 400
        }
      );
    }
  }
}

export async function PUT(request: NextRequest) {
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
    await connectDB();
    const userToUpdate = await User.findById(user._id);

    if (!userToUpdate) {
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

    const updatedUser = await User.findByIdAndUpdate(user._id, { ...user }, { new: true });

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedUser
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.log("🚀 ~ PUT ~ error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Error al actualizar el usuario (Revise que los datos introducidos son correctos)"
        },
        {
          status: 500
        }
      );
    }
  }
}

export async function DELETE(request: NextRequest) {
  const params = request.nextUrl.searchParams;
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
    await connectDB();
    const userToDelete = await User.findById(params.get("id"));

    if (!userToDelete) {
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

    const deletedUser = await User.findByIdAndDelete(params.get("id"));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedUser
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.log("🚀 ~ DELETE ~ error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error al eliminar el usuario"
        },
        {
          status: 500
        }
      );
    }
  }
}
