import { signJwtAccessToken } from "@/libs/jwt";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

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
        accessToken,
      };

      return new Response(JSON.stringify(result));
    }
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify(error));
  }
}
