import User from "@/models/user";
import bcrypt from "bcryptjs";

interface RequestBody {
  user: string;
  password: string;
}

export async function POST(request: Request) {
  const { user, password } = await request.json();
  try {
    const DBUser = await User.findOne({ user });
    
    

    if (DBUser && (await bcrypt.compare(password, DBUser.password))) {
      return new Response(JSON.stringify(DBUser));
    }
  } catch (error) {
    console.log(error);
    
    return new Response(JSON.stringify(error));
  }
}
