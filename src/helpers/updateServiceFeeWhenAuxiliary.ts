
import { IServiceFeeAuxiliary } from "@/models/serviceFeeAuxiliary";
import { IServiceFee, IServiceFeeSubItem } from "@/models/serviceFees";

// ? Cuando se modifica cualquier valor de la hoja de auxiliares se actualizan todas las fichas de costo y se vuelven a calcular sus precios ?//

export const updateServiceFeeWhenAuxiliary = async (auxiliary: IServiceFeeAuxiliary, serviceFees: IServiceFee[]) => {
  console.log("🚀 ~ updateServiceFeeWhenAuxiliary ~ auxiliary:", auxiliary);

  const administrativeExpensesNames = auxiliary.administrativeExpensesCoefficients.map(ae => ae.name)

  const administrativeExpenses: IServiceFeeSubItem[] = [];
  const equipmentDepreciation: IServiceFeeSubItem[] = [];
  const equipmentMaintenance: IServiceFeeSubItem[] = [];
  const transportationExpenses: IServiceFeeSubItem[] = [];

  serviceFees.forEach((serviceFee, index, serviceFees) => {
    let administrativeExpenses = serviceFees[index].administrativeExpenses;



    administrativeExpenses.forEach((administrativeExpense, index, administrativeExpenses)=>{
      if(administrativeExpensesNames.includes(administrativeExpense.description)) {
        const price = auxiliary.administrativeExpensesCoefficients.find(ae => ae.name === administrativeExpense.description )
        administrativeExpense={
          description: administrativeExpense.description,
          unitMeasure: administrativeExpense.unitMeasure,
          amount: administrativeExpense.amount,
          price: price?.value!,
          value: price?.value! * administrativeExpense.amount,
        }
        console.log("🚀 ~ administrativeExpenses.forEach ~ administrativeExpense:", administrativeExpense)
        return administrativeExpense
      }   
    })




  })

  console.log(serviceFees.map(sf=> sf.administrativeExpenses));
  
};
