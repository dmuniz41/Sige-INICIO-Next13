import { and, eq, like, sql } from "drizzle-orm";
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
    logger.info("Crear Usuario", { method: request.method, url: request.url, user: decoded.user });

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

    const existingUser = await db.select().from(users).where(eq(users.userName, user.userName));

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe un usuario con ese nombre"
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
    logger.info("Listar Usuarios", { method: request.method, url: request.url, user: decoded.user });

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());

    // Pagination parameters
    const page = parseInt(filters.page || "1");
    const pageSize = parseInt(filters.pageSize || "10");
    const offset = (page - 1) * pageSize;

    // Build the query dynamically based on filters
    const conditions = [];

    if (filters.name) {
      conditions.push(like(users.name, `%${filters.name}%`));
    }

    if (filters.lastName) {
      conditions.push(like(users.lastName, `%${filters.lastName}%`));
    }

    if (filters.userName) {
      conditions.push(like(users.userName, `%${filters.userName}%`));
    }
    
    // Execute count query
    const countQuery = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Execute data query
    const dataQuery = db
      .select()
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(pageSize)
      .offset(offset);

    // Run queries in parallel
    const [countResult, listOfUsers] = await Promise.all([countQuery, dataQuery]);

    const totalCount = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: listOfUsers,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage: page,
          pageSize,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
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