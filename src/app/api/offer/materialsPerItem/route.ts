import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { verifyJWT } from "@/libs/jwt";
import Offer, { IActivity, IOffer } from "@/models/offer";
import ServiceFee, { IServiceFee } from "@/models/serviceFees";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const finalOfferId = searchParams.get("finalOfferId");
  const activity_materials: {
    itemDescription: string;
    itemId: string;
    description: string;
    amount: number;
    materials: {
      itemId: string;
      description: string;
      amount: number;
      unitMeasure: string;
    }[];
  }[] = [];

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
    const DBOffer = await Offer.findById<IOffer>(finalOfferId);

    if (!DBOffer) {
      return NextResponse.json(
        {
          ok: false,
          message: "La oferta no existe"
        },
        {
          status: 404
        }
      );
    }

    const itemsList = DBOffer.itemsList ?? [];

    await Promise.all(
      itemsList.map(async (item) => {
        await Promise.all(
          item.activities.map(async (activity) => {
            try {
              const materials = await getMaterialsPerActivity(activity);
              activity_materials.push({
                itemDescription: item.description,
                itemId: activity.itemId,
                description: activity.description,
                amount: activity.amount,
                materials: materials ?? [] // Use empty array if materials is undefined
              });
            } catch (error) {
              console.error(
                `Error fetching materials for activity ${activity.itemId}:`,
                error
              );
            }
          })
        );
      })
    );

    const groupedActivities = groupActivitiesByItemId(activity_materials);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        groupedActivities
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

//? RECIBE UNA ACTIVIDAD Y RETORNA LOS MATERIALES CORRESPONDIENTES A LA FICHA DE COSTO DE DICHA ACTIVIDAD
const getMaterialsPerActivity = async (activity: IActivity) => {
  const activity_serviceFee = await ServiceFee.findOne<IServiceFee>({
    taskName: `${activity.description.trim()}`
  });
  if (activity_serviceFee?.rawMaterials) {
    return activity_serviceFee.rawMaterials?.map((material) => ({
      itemId: activity.itemId,
      description: material?.description,
      amount: material?.amount,
      unitMeasure: material?.unitMeasure ?? ""
    }));
  }
};

//? AGRUPA LOS ACTIVIDADES POR EL ID DE LA ACTIVIDAD
const groupActivitiesByItemId = (
  data: {
    itemId: string;
    itemDescription: string;
    description: string;
    amount: number;
    materials: any[];
  }[]
) => {
  const grouped = data.reduce(
    (acc, activity) => {
      const { itemId, itemDescription, description, amount, materials } =
        activity;

      // Check if the itemId already exists in the accumulator
      let itemGroup = acc.find((item) => item.itemId === itemId);

      // If it doesn't exist, create a new entry
      if (!itemGroup) {
        itemGroup = {
          itemId,
          itemDescription,
          activities: []
        };
        acc.push(itemGroup);
      }

      // Add the current activity to the activities array
      itemGroup.activities.push({
        description,
        amount,
        materials
      });

      return acc;
    },
    [] as {
      itemId: string;
      itemDescription: string;
      activities: { description: string; amount: number; materials: any[] }[];
    }[]
  );

  return grouped;
};
