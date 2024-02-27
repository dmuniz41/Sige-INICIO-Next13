import { NextResponse } from "next/server";

import Nomenclator from "@/models/nomenclator";
import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import Offer, { IOffer } from "@/models/offer";

export async function POST(request: Request) {
  const { ...offer }: IOffer = await request.json();
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    let DBOffer = await Offer.findOne({ name: offer.name });

    if (DBOffer) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una oferta con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    let newKey = generateRandomString(26);

    const newOffer = new Offer({
      itemsList: offer.itemsList,
      key: newKey,
      name: offer.name,
      projectName: offer.projectName,
      value: offer.value,
    });

    await newOffer.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newOffer,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}

export async function GET(request: Request) {
  const accessToken = request.headers.get("accessToken");
  try {
    if (!accessToken || !verifyJWT(accessToken)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const listOfOffers = (await Offer.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfOffers,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
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
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const offerToUpdate = await Offer.findById(offer._id);

    if (!offerToUpdate) {
      return NextResponse.json({
        ok: false,
        message: "La oferta a actualizar no existe",
      });
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      offer._id,
      {
        itemsList: offer.itemsList,
        name: offer.name,
        projectName: offer.projectName,
        value: offer.value,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        ok: true,
        updatedOffer,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
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
          message: "Su sesión ha expirado, por favor autentiquese nuevamente",
        },
        {
          status: 401,
        }
      );
    }
    await connectDB();
    const offerToDelete = await Offer.findById(id);

    if (!offerToDelete) {
      return NextResponse.json({
        ok: true,
        message: "La oferta a borrar no existe",
      });
    }

    const deletedOffer = await Offer.findByIdAndDelete(id);

    return new NextResponse(
      JSON.stringify({
        ok: true,
        deletedOffer,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
}
