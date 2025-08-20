import { and, eq, desc, ilike, isNull } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import { NextRequest, NextResponse } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { verifyJWT } from '@/libs/jwt'
import logger from '@/utils/logger'
import { providerNomenclators } from '@/db/migrations/schema'
import { CreateProviderNomenclator } from '@/types/DTOs/nomenclators/provider'

export async function POST(request: NextRequest) {
  const { ...requestData }: CreateProviderNomenclator = await request.json()
  const accessToken = request.headers.get('accessToken')

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Su sesión ha expirado, por favor autentiquese nuevamente',
        },
        {
          status: 401,
        },
      )
    }

    const decoded = jwt.decode(accessToken) as JwtPayload
    logger.info('Crear Nomenclador de Proveedor', {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName,
    })

    const DBNomenclator = await db
      .select()
      .from(providerNomenclators)
      .where(
        and(
          isNull(providerNomenclators.deleted_at),
          eq(providerNomenclators.name, requestData.name),
        ),
      )

    if (DBNomenclator.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `Ya existe un nomenclador de proveedor con el nombre: ${DBNomenclator[0].name}`,
        },
        {
          status: 409,
        },
      )
    }

    await db.insert(providerNomenclators).values({
      name: requestData.name,
      contact: requestData.contact,
      created_at: new Date(),
      updated_at: new Date(),
    })

    return new NextResponse(
      JSON.stringify({
        ok: true,
      }),
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error al crear nomenclador de proveedor', {
        error: error.message,
        stack: error.stack,
        route: '/api/nomenclators/provider',
        method: 'POST',
      })
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 500,
        },
      )
    }
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get('accessToken')

  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Su sesión ha expirado, por favor autentiquese nuevamente',
        },
        {
          status: 401,
        },
      )
    }

    const decoded = jwt.decode(accessToken) as JwtPayload
    logger.info('Listar Nomencladores de Proveedores', {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName,
    })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const name = searchParams.get('name') ?? ''
    const contact = searchParams.get('contact') ?? ''

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        {
          ok: false,
          message: "Parámetros de paginacion inválidos. 'page' y 'limit' deben ser mayor a 0.",
        },
        {
          status: 400,
        },
      )
    }

    const offset = (page - 1) * limit
    const conditions = []
    conditions.push(isNull(providerNomenclators.deleted_at))

    if (name) {
      conditions.push(ilike(providerNomenclators.name, `%${name}%`))
    }

    if (contact) {
      conditions.push(ilike(providerNomenclators.contact, `%${contact}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const paginatedData = await db
      .select()
      .from(providerNomenclators)
      .where(whereClause)
      .orderBy(desc(providerNomenclators.created_at))
      .limit(limit)
      .offset(offset)

    const totalCount = await db.$count(providerNomenclators)

    const responseData = {
      ok: true,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit,
      data: paginatedData,
    }

    return new NextResponse(JSON.stringify(responseData), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      status: 200,
    })
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error al listar los nomencladores de proveedores', {
        error: error.message,
        stack: error.stack,
        route: '/api/nomenclators/provider',
        method: 'GET',
      })
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 500,
        },
      )
    }
  }
}
