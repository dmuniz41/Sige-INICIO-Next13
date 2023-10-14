import { NextResponse } from "next/server";

import { connectDB } from "@/libs/mongodb";
import { generateRandomString } from "@/helpers/randomStrings";
import { verifyJWT } from "@/libs/jwt";
import CostSheet from "@/models/costSheet";

export async function POST(request: Request) {
  const {
    taskName,
    workersAmount = 1,
    rawMaterials = [],
    tasksList = [],
    equipmentDepreciation = [],
    equipmentMaintenance = [],
    administrativeExpenses = [],
    transportationExpenses = [],
    contractedPersonalExpenses = [],
    artisticTalent = 0,
    ONATTaxes = 0,
    commercialMargin = 0,
  } = await request.json();
    console.log("🚀 ~ file: route.ts:23 ~ POST ~ taskName:", taskName)

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
    let DBCostSheet = await CostSheet.findOne({ taskName });

    if (DBCostSheet) {
      return NextResponse.json(
        {
          ok: false,
          message: "Ya existe una ficha de costo con ese nombre",
        },
        {
          status: 409,
        }
      );
    }

    let rawMaterialsSubtotal: number = 0;
    let tasksListSubtotal: number = 0;
    let equipmentDepreciationSubtotal: number = 0;
    let equipmentMaintenanceSubtotal: number = 0;
    let administrativeExpensesSubtotal: number = 0;
    let transportationExpensesSubtotal: number = 0;
    let contractedPersonalExpensesSubtotal: number = 0;
    let expensesTotalValue: number = 0;
    let salePriceMN: number = 0;
    let salePriceUSD: number = 0;

    let newKey = generateRandomString(26);

    const newCostSheet = new CostSheet({
      key: newKey,
      taskName,
      workersAmount,
      rawMaterials,
      rawMaterialsSubtotal,
      tasksList,
      tasksListSubtotal,
      equipmentDepreciation,
      equipmentDepreciationSubtotal,
      equipmentMaintenance,
      equipmentMaintenanceSubtotal,
      administrativeExpenses,
      administrativeExpensesSubtotal,
      transportationExpenses,
      transportationExpensesSubtotal,
      contractedPersonalExpenses,
      contractedPersonalExpensesSubtotal,
      expensesTotalValue,
      artisticTalent,
      ONATTaxes,
      commercialMargin,
      salePriceMN,
      salePriceUSD,
    });

    await newCostSheet.save();

    return new NextResponse(
      JSON.stringify({
        ok: true,
        newCostSheet,
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
    const listOfCostSheets = (await CostSheet.find()).reverse();
    return new NextResponse(
      JSON.stringify({
        ok: true,
        listOfCostSheets,
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

// export async function PUT(request: Request) {
//   const { id, code, category } = await request.json();
//   const accessToken = request.headers.get("accessToken");

//   try {
//     if (!accessToken || !verifyJWT(accessToken)) {
//       return NextResponse.json(
//         {
//           ok: false,
//           message: "Su sesión ha expirado, por favor autentiquese nuevamente",
//         },
//         {
//           status: 401,
//         }
//       );
//     }
//     await connectDB();
//     const nomenclatorToUpdate = await Nomenclator.findById(id);

//     if (!nomenclatorToUpdate) {
//       return NextResponse.json({
//         ok: false,
//         message: "El nomenclador a actualizar no existe",
//       });
//     }

//     const updatedNomenclator = await Nomenclator.findByIdAndUpdate(id, { code, category }, { new: true });

//     return new NextResponse(
//       JSON.stringify({
//         ok: true,
//         updatedNomenclator,
//       }),
//       {
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json(
//         {
//           ok: false,
//           message: error.message,
//         },
//         {
//           status: 400,
//         }
//       );
//     }
//   }
// }

// export async function PATCH(request: Request) {
//   const { id } = await request.json();
//   const accessToken = request.headers.get("accessToken");
//   try {
//     if (!accessToken || !verifyJWT(accessToken)) {
//       return NextResponse.json(
//         {
//           ok: false,
//           message: "Su sesión ha expirado, por favor autentiquese nuevamente",
//         },
//         {
//           status: 401,
//         }
//       );
//     }
//     await connectDB();
//     const nomenclatorToDelete = await Nomenclator.findById(id);

//     if (!nomenclatorToDelete) {
//       return NextResponse.json({
//         ok: true,
//         message: "El nomenclador a borrar no existe",
//       });
//     }

//     const deletedNomenclator = await Nomenclator.findByIdAndDelete(id);

//     return new NextResponse(
//       JSON.stringify({
//         ok: true,
//         deletedNomenclator,
//       }),
//       {
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json(
//         {
//           ok: false,
//           message: error.message,
//         },
//         {
//           status: 400,
//         }
//       );
//     }
//   }
// }
