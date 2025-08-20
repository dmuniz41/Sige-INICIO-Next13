import { and, eq, ne, isNull } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import { NextRequest, NextResponse } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { verifyJWT } from '@/libs/jwt'
import logger from '@/utils/logger'
import { UpdateProviderNomenclator } from '@/types/DTOs/nomenclators/provider'
import { providerNomenclators } from '@/db/migrations/schema'

export async function PUT(request: Request, { params }: { params: { id: number } }) {
  const { ...requestData }: UpdateProviderNomenclator = await request.json()
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
    logger.info('Actualizar Nomenclador de Proveedor', {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName,
    })

    const isNomenclatorExist = await db
      .select()
      .from(providerNomenclators)
      .where(eq(providerNomenclators.id, params.id))

    if (isNomenclatorExist.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: 'El nomenclador de unidad de medida a actualizar no existe ',
        },
        {
          status: 404,
        },
      )
    }
    const isNomenclatorExistWithName = await db
      .select()
      .from(providerNomenclators)
      .where(
        and(
          isNull(providerNomenclators.deleted_at),
          eq(providerNomenclators.name, requestData.name),
          ne(providerNomenclators.id, params.id),
        ),
      )

    if (isNomenclatorExistWithName.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Ya existe un nomenclador de proveedor con ese nombre',
        },
        {
          status: 409,
        },
      )
    }

    await db
      .update(providerNomenclators)
      .set({ ...requestData, updated_at: new Date() })
      .where(eq(providerNomenclators.id, params.id))

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
      logger.error('Error al actualizar nomenclador de proveedor', {
        error: error.message,
        stack: error.stack,
        route: '/api/nomenclators/provider/[id]',
        method: 'PUT',
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

export async function DELETE(request: NextRequest, { params }: { params: { id: number } }) {
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
    logger.info('Eliminar Nomenclador de Proveedor', {
      method: request.method,
      url: request.url,
      body: request.body,
      user: decoded.userName,
    })

    const nomenclatorToDelete = await db
      .select()
      .from(providerNomenclators)
      .where(
        and(
          isNull(providerNomenclators.deleted_at), // Ignore deleted nomenclators
          eq(providerNomenclators.id, params.id),
        ),
      )

    if (nomenclatorToDelete.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: 'El nomenclador de proveedor a borrar no existe',
        },
        {
          status: 404,
        },
      )
    }

    await db
      .update(providerNomenclators)
      .set({ deleted_at: new Date() })
      .where(eq(providerNomenclators.id, params.id))

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
      logger.error('Error al eliminar nomenclador de proveedor', {
        error: error.message,
        stack: error.stack,
        route: '/api/nomenclators/provider/[id]',
        method: 'DELETE',
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
