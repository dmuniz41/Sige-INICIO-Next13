import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Offer, { IOffer } from "@/models/offer";
import ServiceFee, { IServiceFeeSubItem } from "@/models/serviceFees";

export async function POST(request: NextRequest) {
  const { ...offer }: IOffer = await request.json();
  const activitiesList: { description: string; amount: number }[] = [];
  const uniqueActivities: { description: string; amount: number }[] = [];
  const activitiesMaterials: { description: string; amount: number; unitMeasure: string }[] = [];
  const uniqueMaterials: { description: string; amount: number; unitMeasure: string }[] = [];
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

    // ? CREA UN NUEVO ARRAY CON LAS DESCRIPCIONES Y LAS CANTIDADES DE CADA ACTIVIDAD
    offer.itemsList.map((item) =>
      item.activities.map((act) => {
        activitiesList.push({
          description: act.description,
          amount: act.amount
        });
      })
    );
    // ?  AGRUPA TODAS LAS ACTIVIDADES EN UN NUEVO ARRAY DONDE LAS ACTIVIDADES NO SE REPITEN (SI LA ACTIVIDAD EXISTE SUMA LAS CANTIDADES)
    activitiesList.map((activity) => {
      if (uniqueActivities?.some((value) => value.description === activity.description)) {
        uniqueActivities?.forEach((value, index, arr) => {
          if (value.description === activity.description) {
            arr[index] = {
              ...value,
              amount: value.amount + activity.amount
            };
            return arr[index];
          }
        });
      } else {
        uniqueActivities?.push({
          description: activity.description,
          amount: activity.amount
        });
      }
    });

    /* SE UTILIZA Promise.all() PARA PODER ESPERAR A QUE TERMINEN TODAS LAS PETICIONES ASINCRONAS A LA BD ANTES DE CONTINUAR FUERA DEL BUCLE
     DE LO CONTRARIO RETORNA UN ARRAY VACIO */
    // ? BUSCA EN LA BD TODOS LOS MATERIALES ASOCIADOS A CADA ACTIVIDAD Y MULTIPLICA SU CANTIDAD POR LA CANTIDAD DE VECES QUE SE REPITE LA ACTIVIDAD
    await Promise.all(
      uniqueActivities.map(async (uniqueActivity) => {
        const actMaterials = await ServiceFee.findOne({
          taskName: `${uniqueActivity.description.trim()}`
        });
        if (actMaterials?.rawMaterials) {
          actMaterials?.rawMaterials?.forEach((material: IServiceFeeSubItem) => {
            activitiesMaterials.push({
              description: material?.description,
              amount: material?.amount * uniqueActivity.amount,
              unitMeasure: material?.unitMeasure ?? ""
            });
          });
        }
      })
    );

    // ? AGRUPA TODOS LOS MATERIALES EN UN NUEVO ARRAY DONDE LOS MATERIALES NO SE REPITEN (SI EL MATERIAL EXISTE SUMA LAS CANTIDADES)
    activitiesMaterials.map((material) => {
      if (uniqueMaterials?.some((e) => e.description === material.description)) {
        uniqueMaterials?.forEach((um, index, arr) => {
          if (um.description === material.description) {
            arr[index] = {
              ...um,
              amount: um.amount + material.amount
            };
            return arr[index];
          }
        });
      } else {
        uniqueMaterials?.push({
          description: material.description,
          amount: material.amount,
          unitMeasure: material.unitMeasure ?? ""
        });
      }
    });

    let DBOffer = await Offer.findOne({ key: offer.key });

    if (DBOffer) {
      return NextResponse.json(
        {
          ok: false,
          message: "La oferta a crear ya existe"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);
    const finalValue = offer.value! * (offer?.representationPercentage / 100 + 1);

    const newOffer = new Offer({
      ...offer,
      materialsList: uniqueMaterials,
      key: newKey,
      isFinalOffer: offer.isFinalOffer ?? false,
      value: finalValue,
      version: offer.version ?? ""
    });

    await newOffer.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newOffer
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ POST ~ error:", error);
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
  const projectId = request.headers.get("projectId");
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
    const listOfOffers = (await Offer.find({ projectId: projectId })).reverse();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        counter: listOfOffers.length,
        listOfOffers
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ GET ~ error:", error);
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

export async function PUT(request: NextRequest) {
  const { ...offer }: IOffer = await request.json();
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
    const offerToUpdate = await Offer.findById(offer._id);

    if (!offerToUpdate) {
      return NextResponse.json(
        {
          ok: false,
          message: "La oferta a actualizar no existe"
        },
        { status: 404 }
      );
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      offer._id,
      {
        ...offer
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedOffer
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof Error) {
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
    const offerToDelete = await Offer.findById(params.get("id"));

    if (!offerToDelete) {
      return NextResponse.json(
        {
          ok: true,
          message: "La oferta a eliminar no existe"
        },
        { status: 404 }
      );
    }

    const deletedOffer = await Offer.findByIdAndDelete(params.get("id"));

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedOffer
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("🚀 ~ DELETE ~ error:", error);
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
