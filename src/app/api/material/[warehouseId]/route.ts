import { eq, and, desc, sum } from 'drizzle-orm'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

import { db } from '@/db/drizzle'
import { materials, warehouse } from '@/db/migrations/schema'
import { UpdateMaterial } from '@/types/DTOs/materials/materials'
import { verifyJWT } from '@/libs/jwt'
import getRedisClient from '@/libs/redis'
import logger from '@/utils/logger'

export async function GET(request: NextRequest, { params }: { params: { warehouseId: number } }) {
  const warehouseId = params.warehouseId
  const accessToken = request.headers.get('accessToken')
  let redisClient
  const CACHE_EXPIRATION_SECONDS = 10 // Cache expiration time in seconds

  try {
    redisClient = await getRedisClient()
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
    logger.info('Listar Materiales', {
      method: request.method,
      url: request.url,
      user: decoded.userName,
    })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10) // Default to page 1
    const limit = parseInt(searchParams.get('limit') || '10', 10) // Default to 10 items per page

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
    const cacheKey = `materials:${warehouseId}:${page}:${limit}`

    // 1. Try to get data from Redis cache
    const cachedData = await redisClient.get(cacheKey)

    if (cachedData) {
      logger.info('Serving Materials from Redis Cache', {
        cacheKey,
        user: decoded.userName,
      })
      return new NextResponse(cachedData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        status: 200,
      })
    }

    const responseData = await db
      .select()
      .from(materials)
      .where(eq(materials.warehouseId, warehouseId))
      .orderBy(desc(materials.id))
      .limit(limit)
      .offset(offset)

    const totalCount = await db.$count(materials)

    // 3. Store the database result in Redis cache
    await redisClient.set(cacheKey, JSON.stringify(responseData), {
      EX: CACHE_EXPIRATION_SECONDS,
    })

    logger.info('Fetched Materials from DB and cached in Redis', {
      cacheKey,
      user: decoded.userName,
    })

    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: responseData.length,
        total: totalCount,
        page,
        limit,
        data: responseData,
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
      logger.error('Error al listar los materiales', {
        error: error.message,
        stack: error.stack,
        route: '/api/material/[warehouseId]',
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

export async function PUT(request: NextRequest, { params }: { params: { warehouseId: number } }) {
  const warehouseId = params.warehouseId // Id del almacen
  const { ...materialToUpdate }: UpdateMaterial = await request.json()
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
    logger.info('Actualizar Material', {
      method: request.method,
      url: request.url,
      user: decoded.userName,
    })

    const { searchParams } = new URL(request.url)
    const materialId = parseInt(searchParams.get('materialId')!) // Default to page 1

    if (materialId < 1 || isNaN(materialId) || !searchParams.has('materialId')) {
      return NextResponse.json(
        {
          ok: false,
          message: 'MaterialId es requerido y no puede ser menor a 1.',
        },
        {
          status: 400,
        },
      )
    }

    const isMaterialExist = await db
      .select()
      .from(materials)
      .where(and(eq(materials.id, materialId), eq(materials.warehouseId, warehouseId)))
    if (isMaterialExist.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message: 'El material a actualizar no existe',
        },
        {
          status: 404,
        },
      )
    }

    // ? PARA ACTUALIZAR EL STOCK UTILIZE LAS FUNCIONES DE MOVER INVENTARIO
    isMaterialExist[0].name = materialToUpdate.name
    isMaterialExist[0].category = materialToUpdate.category
    isMaterialExist[0].description = materialToUpdate.description
    isMaterialExist[0].modifyDate = new Date() // Registra la fecha de modificación
    isMaterialExist[0].unitMeasure = materialToUpdate.unitMeasure
    isMaterialExist[0].costPerUnit = materialToUpdate.costPerUnit
    isMaterialExist[0].minimumExistence = materialToUpdate.minimumExistence
    isMaterialExist[0].provider = materialToUpdate.provider
    isMaterialExist[0].totalValue = materialToUpdate.costPerUnit * materialToUpdate.stock

    // TODO: VERIFICAR QUE SI EL MATERIAL MODIFICADO COINCIDE CON OTRO EXISTENTE, ACTUALIZAR EL NOMENCLADOR DE FICHAS DE MATERIALES

    const updatedMaterial = await db
      .update(materials)
      .set(isMaterialExist[0])
      .where(eq(materials.id, materialId))
      .returning()

    // ? ACTUALIZA EL VALOR TOTAL DEL ALMACEN //
    const newWarehouseValue = await db
      .select({ totalAmount: sum(materials.totalValue) })
      .from(materials)
      .where(eq(materials.warehouseId, updatedMaterial[0].warehouseId))

    await db
      .update(warehouse)
      .set({ totalValue: Number(newWarehouseValue[0].totalAmount) })
      .where(eq(warehouse.id, updatedMaterial[0].warehouseId))

    return new NextResponse(
      JSON.stringify({
        ok: true,
        data: updatedMaterial,
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
      logger.error(`Error al actualizar un material`, {
        error: error.message,
        stack: error.stack,
        route: '/api/material/[warehouseId]',
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
