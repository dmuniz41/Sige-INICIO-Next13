import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";

export async function POST(request: Request) {
  const { user, userName, lastName, privileges, password, area } = await request.json();
  const accessToken = request.headers.get("accessToken");
  try {
  if (!accessToken || !verifyJWT(accessToken)) {
    return NextResponse.json(
      {
        ok: false,
        message: "No hay token en la peticion",
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

    return NextResponse.json({
      ok: true,
      message: "Usuario creado",
      newUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Error al crear el usuario',
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
          message: "No hay token en la peticion",
        },
        {
          status: 401,
        }
      );
    }
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
          message: 'Error al listar los usuarios',
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function PUT(request: Request) {
  const { _id ,user, userName, lastName, privileges, password, area } = await request.json();
  const accessToken = request.headers.get("accessToken");

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "No hay token en la peticion",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const userToUpdate = await User.findOne({ _id });

    if (!userToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "El usuario a actualizar no existe",
      },
      {
        status: 409
      }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await User.findOneAndUpdate({ _id }, { user, userName, lastName, privileges, password: hashedPassword, area }, { new: true });

    return NextResponse.json({
      ok: true,
      message: "Usuario actualizado",
      updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Error al actualizar el usuario (Revise que los datos introducidos son correctos)',
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
          message: "No hay token en la peticion",
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
          message: 'Error al eliminar el usuario',
        },
        {
          status: 400,
        }
      );
    }
  }
}
