import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Offer, { IActivity, IOffer } from "@/models/offer";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";

export async function POST(request: Request) {
  const { ...offer }: IOffer = await request.json();
  const activitiesList: [{ description: string; amount: number }] = [
    { description: "", amount: 0 }
  ];
  const aux: [{ description: string; amount: number }] = [{ description: "", amount: 0 }];
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
      if (aux.some((value) => value.description === activity.description)) {
        aux.forEach((value, index, arr) => {
          if (value.description === activity.description) {
            arr[index] = {
              ...value,
              amount: value.amount + activity.amount
            };
            return arr[index];
          }
        });
      } else {
        aux.push({
          description: activity.description,
          amount: activity.amount
        });
      }
    });
    console.log("🚀 ~ activitiesList.map ~ aux:", aux);
    // // ? BUSCAR EN LA BD LOS MATERIALES DE CADA UNA DE LAS ACTIVIDADES
    // const serviceFeeList = activitiesList.map(async (act) => {
    //   return await ServiceFee.where(`taskName`)
    //     .equals(act.description)
    //     .exec()
    //     .then((result) => result.map((r) => r.rawMaterials))
    //     .catch((err) => console.log(err));
    // });

    let DBOffer = await Offer.findOne({ projectName: offer.projectName });

    if (DBOffer) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una oferta con ese nombre"
        },
        {
          status: 409
        }
      );
    }

    let newKey = generateRandomString(26);

    const newOffer = new Offer({
      itemsList: offer.itemsList,
      key: newKey,
      projectId: offer.projectId,
      projectName: offer.projectName,
      value: offer.value
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
        }
      }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
        }
      );
    }
  }
}

export async function GET(request: Request) {
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
        }
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
          status: 400
        }
      );
    }
  }
}

export async function PUT(request: Request) {
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
      return NextResponse.json({
        ok: false,
        message: "La oferta a actualizar no existe"
      });
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      offer._id,
      {
        itemsList: offer.itemsList,
        projectName: offer.projectName,
        value: offer.value
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
        }
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
          status: 400
        }
      );
    }
  }
}

export async function PATCH(request: Request) {
  const { id } = await request.json();
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
    const offerToDelete = await Offer.findById(id);

    if (!offerToDelete) {
      return NextResponse.json({
        ok: true,
        message: "La oferta a borrar no existe"
      });
    }

    const deletedOffer = await Offer.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedOffer
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
      return NextResponse.json(
        {
          ok: false,
          message: error.message
        },
        {
          status: 400
        }
      );
    }
  }
}
