import {DefaultSession, DefaultUser} from 'next-auth'
import {JWT, DefaultJWT} from 'next-auth/jwt'
import {User} from '@/db/migrations/schema'

declare module 'next-auth'{
  interface Session {
    user: {
      role: string[];
      accessToken: string | undefined;
      user: {
        password: string;
        id: number;
        name: string;
        lastName: string | null;
        key: string;
        userName: string | null;
        privileges: string[] | null;
        area: string[] | null;
      };
    } & DefaultSession;
  }
  interface User extends DefaultUser {
    role: string[],
  }
}

declare module "next-auth/jwt"{
  interface JWT extends DefaultJWT{
    role: string[]
  }
}