import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/libs/mongodb";
import { signJwtAccessToken } from "@/libs/jwt";
import User from "@/models/user";

interface RequestBody {
  user: string;
  password: string;
}

export async function POST(request: Request) {
  const { user, password } = await request.json();
  try {
    connectDB();
    const DBUser = await User.findOne({ user });

    if (DBUser && (await bcrypt.compare(password, DBUser.password))) {
      const accessToken = signJwtAccessToken(DBUser.toJSON());
      const DBUserJSON = DBUser.toJSON();
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

    return new NextResponse(JSON.stringify(error));
  }
}
