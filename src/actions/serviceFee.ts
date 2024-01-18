import { Toast } from "@/helpers/customAlert";
import { IServiceFee } from "@/models/serviceFees";
import { types } from "@/types/types";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { nomenclatorsStartLoading } from "./nomenclator";

export const startAddServiceFee = ({ ...serviceFee }): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/serviceFee`,
        {
          artisticTalentValue: serviceFee.artisticTalentValue,
          category: serviceFee.category,
          commercialMargin: serviceFee.commercialMargin,
          electricityExpense: serviceFee.electricityExpense,
          equipmentDepreciation: serviceFee.equipmentDepreciation,
          equipmentMaintenance: serviceFee.equipmentMaintenance,
          feedingExpense: serviceFee.feedingExpense,
          fuelExpense: serviceFee.fuelExpense,
          indirectSalaries: serviceFee.indirectSalaries,
          leaseExpense: serviceFee.leaseExpense,
          nomenclatorId: serviceFee.nomenclatorId,
          ONAT: serviceFee.ONAT,
          payMethodCoef: serviceFee.payMethodCoef,
          phoneExpense: serviceFee.phoneExpense,
          rawMaterials: serviceFee.rawMaterials,
          rawMaterialsByClient: serviceFee.rawMaterialsByClient,
          rawMaterialsTransportationExpenses: serviceFee.rawMaterialsTransportationExpenses,
          salesAndDistributionExpenses: serviceFee.salesAndDistributionExpenses,
          subcontractExpenses: serviceFee.subcontractExpenses,
          taskList: serviceFee.taskList,
          taskName: serviceFee.taskName,
          valuePerUnitMeasure: serviceFee.valuePerUnitMeasure,
          workersAmount: serviceFee.workersAmount,
        },
        { headers: { accessToken: token } }
      )
      .then((serviceFee) => {
        dispatch(addServiceFee(serviceFee));
        dispatch(nomenclatorsStartLoading());
        dispatch(serviceFeeStartLoading());
        Toast.fire({
          icon: "success",
          title: "Tarifa de Servicio Creada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:96 ~ return ~ message:", message);
        Swal.fire("Error", "Error al crear la tarifa de servicio", "error");
      });
  };
};

export const startUpdateServiceFee = ({...serviceFee}): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/serviceFee`,
        {
          _id: serviceFee._id,
          artisticTalentValue: serviceFee.artisticTalentValue,
          category: serviceFee.category,
          commercialMargin: serviceFee.commercialMargin,
          electricityExpense: serviceFee.electricityExpense,
          equipmentDepreciation: serviceFee.equipmentDepreciation,
          equipmentMaintenance: serviceFee.equipmentMaintenance,
          feedingExpense: serviceFee.feedingExpense,
          fuelExpense: serviceFee.fuelExpense,
          indirectSalaries: serviceFee.indirectSalaries,
          leaseExpense: serviceFee.leaseExpense,
          nomenclatorId: serviceFee.nomenclatorId,
          ONAT: serviceFee.ONAT,
          payMethodCoef: serviceFee.payMethodCoef,
          phoneExpense: serviceFee.phoneExpense,
          rawMaterials: serviceFee.rawMaterials,
          rawMaterialsByClient: serviceFee.rawMaterialsByClient,
          rawMaterialsTransportationExpenses: serviceFee.rawMaterialsTransportationExpenses,
          salesAndDistributionExpenses: serviceFee.salesAndDistributionExpenses,
          subcontractExpenses: serviceFee.subcontractExpenses,
          taskList: serviceFee.taskList,
          taskName: serviceFee.taskName,
          valuePerUnitMeasure: serviceFee.valuePerUnitMeasure,
          workersAmount: serviceFee.workersAmount,
        },
        { headers: { accessToken: token } }
      )
      .then((serviceFee) => {
        dispatch(
          updateServiceFee(serviceFee)
        );
        dispatch(serviceFeeStartLoading());
        Toast.fire({
          icon: "success",
          title: `Tarifa de Servicio Actualizada`,
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:104 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al editar la tarifa de servicio', "error");
      });
  };
};

export const serviceFeeStartLoading = () => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee`, { headers: { accessToken: token } })
      .then((resp) => {
        let { listOfServiceFees } = resp.data;
        dispatch(serviceFeeLoaded(listOfServiceFees));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:69 ~ return ~ message:", message);
        Swal.fire("Error", "Error al cargar las tarifas de servicio", "error");
      });
  };
};

export const startDeleteServiceFee = (id: string): any => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee`, { id }, { headers: { accessToken: token } })
      .then(() => {
        dispatch(deleteServiceFee(id));
        dispatch(serviceFeeStartLoading());
        Toast.fire({
          icon: "success",
          title: "Tarifa de Servicio Eliminada",
        });
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:90 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al eliminar la tarifa de servicio', "error");
      });
  };
};

export const loadSelectedServiceFee = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return async (dispatch: any) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/serviceFee/${id}`, { headers: { accessToken: token } })
      .then((resp) => {
        let { BDServiceFee } = resp.data;
        console.log("🚀 ~ .then ~ BDServiceFee:", BDServiceFee)
        dispatch(selectedServiceFee(BDServiceFee));
      })
      .catch((error: AxiosError) => {
        let { message }: any = error.response?.data;
        console.log("🚀 ~ file: serviceFee.ts:159 ~ return ~ message:", message)
        Swal.fire("Error", 'Error al cargar tarifa de servicio seleccionada', "error");
      });
  };
};

const addServiceFee = ({ ...serviceFee }) => ({
  type: types.addServiceFee,
  payload: {
    artisticTalentValue: serviceFee.artisticTalentValue,
    category: serviceFee.category,
    commercialMargin: serviceFee.commercialMargin,
    electricityExpense: serviceFee.electricityExpense,
    equipmentDepreciation: serviceFee.equipmentDepreciation,
    equipmentMaintenance: serviceFee.equipmentMaintenance,
    feedingExpense: serviceFee.feedingExpense,
    fuelExpense: serviceFee.fuelExpense,
    indirectSalaries: serviceFee.indirectSalaries,
    leaseExpense: serviceFee.leaseExpense,
    nomenclatorId: serviceFee.nomenclatorId,
    ONAT: serviceFee.ONAT,
    payMethodCoef: serviceFee.payMethodCoef,
    phoneExpense: serviceFee.phoneExpense,
    rawMaterials: serviceFee.rawMaterials,
    rawMaterialsByClient: serviceFee.rawMaterialsByClient,
    rawMaterialsTransportationExpenses: serviceFee.rawMaterialsTransportationExpenses,
    salesAndDistributionExpenses: serviceFee.salesAndDistributionExpenses,
    subcontractExpenses: serviceFee.subcontractExpenses,
    taskList: serviceFee.taskList,
    taskName: serviceFee.taskName,
    valuePerUnitMeasure: serviceFee.valuePerUnitMeasure,
    workersAmount: serviceFee.workersAmount,
  },
});

const updateServiceFee = ({ ...serviceFee }) => ({
  type: types.updateServiceFee,
  payload: {
    artisticTalentValue: serviceFee.artisticTalentValue,
    category: serviceFee.category,
    commercialMargin: serviceFee.commercialMargin,
    electricityExpense: serviceFee.electricityExpense,
    equipmentDepreciation: serviceFee.equipmentDepreciation,
    equipmentMaintenance: serviceFee.equipmentMaintenance,
    feedingExpense: serviceFee.feedingExpense,
    fuelExpense: serviceFee.fuelExpense,
    indirectSalaries: serviceFee.indirectSalaries,
    leaseExpense: serviceFee.leaseExpense,
    nomenclatorId: serviceFee.nomenclatorId,
    ONAT: serviceFee.ONAT,
    payMethodCoef: serviceFee.payMethodCoef,
    phoneExpense: serviceFee.phoneExpense,
    rawMaterials: serviceFee.rawMaterials,
    rawMaterialsByClient: serviceFee.rawMaterialsByClient,
    rawMaterialsTransportationExpenses: serviceFee.rawMaterialsTransportationExpenses,
    salesAndDistributionExpenses: serviceFee.salesAndDistributionExpenses,
    subcontractExpenses: serviceFee.subcontractExpenses,
    taskList: serviceFee.taskList,
    taskName: serviceFee.taskName,
    valuePerUnitMeasure: serviceFee.valuePerUnitMeasure,
    workersAmount: serviceFee.workersAmount,
  },
});
export const serviceFeeLoaded = (serviceFees: any) => ({
  type: types.serviceFeesLoaded,
  payload: serviceFees,
});
const deleteServiceFee = (id: string) => ({
  type: types.deleteServiceFee,
  payload: {
    id,
  },
});
const selectedServiceFee = (serviceFee: any) => ({
  type: types.selectedServiceFee,
  payload: serviceFee,
});

