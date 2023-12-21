/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Svg } from "@react-pdf/renderer";

const BORDER_COLOR = "#000";
const BORDER_STYLE = "solid";

const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 35,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    // height: "100%",
    width: "100%",
    borderStyle: "solid",
    borderWidth: "1px",
  },
  headerText: {
    fontSize: 12,
  },
  header: {
    textAlign: "center",
    minHeight: 40,
    borderStyle: "solid",
    borderTop: "0px",
    borderLeft: "0px",
    borderRight: "0px",
    borderBottom: "1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: 60,
  },
  subtitle: {
    fontSize: 10,
    marginLeft: 1,
  },

  subsectionContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderStyle: "solid",
    borderBottom: "1px",
    minHeight: 30,
  },
  subsectionHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    borderStyle: "solid",
    width: "40%",
  },
  subsectionTableContainer: {
    display: "flex",
    flexDirection: "row",
    borderStyle: "solid",
    borderLeft: "1px",
    width: "60%",
  },
});

function checkStrEmpty(str) {
  return !(str && str.length > 1 && str.split(" ").join("").length > 0);
}

// const CustomTablePDF = (props) => {
//   const { fields = [], data = [] } = props;
//   let tableCol = {
//     borderStyle: BORDER_STYLE,
//     borderColor: BORDER_COLOR,
//     borderBottomColor: "#000",
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//   };
//   return (
//     <View style={styles.table}>
//       <View style={[styles.tableRow, styles.headerBg]}>
//         {fields.map((_item, _idx) => (
//           <View key={_idx} style={[tableCol, { width: _item.width + "%" }]}>
//             <Text style={[styles.tableCellHeader, { textAlign: "center" }]}>{_item.title}</Text>
//           </View>
//         ))}
//       </View>

//       {data.map(
//         (item, idx) =>
//           item && (
//             <View key={idx} style={styles.tableRow}>
//               {fields.map((_item, _idx) => {
//                 let val = item[_item.value] || "";
//                 let value_alt = (_item.value_alt && item[_item.value_alt]) || "";

//                 if (_item.custom) {
//                   return (
//                     <View key={_idx} style={[tableCol, { width: _item.width + "%" }]}>
//                       <Text style={[styles.tableCell, item.style ? item.style : {}]}>{_item.component(item)}</Text>
//                     </View>
//                   );
//                 } else {
//                   return (
//                     <View key={_idx} style={[styles.tableCol, { width: _item.width + "%" }]}>
//                       <Text style={[styles.tableCell, item.style ? item.style : {}]}>{checkStrEmpty(val) ? value_alt : val || "-"}</Text>
//                     </View>
//                   );
//                 }
//               })}
//             </View>
//           )
//       )}
//     </View>
//   );
// };

const Subsection = (props) => {
  const { number = 1, name = "" } = props;

  return (
    <View wrap={false} style={styles.subsectionContainer}>
      <View style={styles.subsectionHeaderContainer}>
        <View style={{ justifyContent: "center", alignItems: "center", width: "20%", borderStyle: "solid", borderRight: "1px" }}>
          <Text style={styles.subtitle}>{number}</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "column", width: "80%", minHeight: 50 }}>
          <View style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 40 }}>
            <Text style={styles.subtitle}>{name}</Text>
          </View>
          <View style={{ display: "flex", borderStyle: "solid", borderTop: "1px", justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.subtitle}>Subtotal</Text>
          </View>
        </View>
      </View>

      <View style={styles.subsectionTableContainer}></View>
    </View>
  );
};

export default function CostSheetPDFReport(props) {
  // const date = new Date().toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" });
  const { fields = [], data = [], title = "" } = props;
  return (
    <Document>
      <Page wrap orientation="portrait" size={"LETTER"} style={styles.body}>
        <View  style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{title.toUpperCase()}</Text>
          </View>
          {/* Subheader */}
          <View style={styles.subHeader}>
            {/* Parte izquierda del subheader */}
            <View style={{ display: "flex", flexDirection: "column", width: "40%", borderBottom: "1px", borderStyle: "solid", justifyContent: "space-between" }}>
              <View style={{ minHeight: 10, justifyContent: "center", borderBottom: "1px", borderStyle: "solid" }}>
                <Text style={styles.subtitle}>Creador: INICIO</Text>
              </View>
              <View style={{ minHeight: 10, justifyContent: "center", borderBottom: "1px", borderStyle: "solid" }}>
                <Text style={styles.subtitle}>Cantidad de empleados: 4 </Text>
              </View>
              <View style={{ minHeight: 10, justifyContent: "center" }}>
                <Text style={styles.subtitle}>Cliente </Text>
              </View>
            </View>
            {/* Parte derecha del subheader */}
            <View style={{ display: "flex", flexDirection: "column", width: "60%", borderBottom: "1px", borderLeft: "1px", borderStyle: "solid" }}>
              <View style={{ display: "flex", flexDirection: "row", minHeight: 10 }}>
                <View style={{ width: "30%", borderBottom: "1px", justifyContent: "center" }}>
                  <Text style={styles.subtitle}>Fecha:</Text>
                </View>
                <View style={{ width: "70%", borderStyle: "solid", borderLeft: "1px", borderBottom: "1px", justifyContent: "center" }}>
                  <Text style={styles.subtitle}>9/11/97</Text>
                </View>
              </View>
              <View style={{ minHeight: 50, display: "flex" }}>
                <Text style={styles.subtitle}>Descripcion de la actividad</Text>
              </View>
            </View>
          </View>
          {/* Subsecciones */}
          <Subsection number={1} name={"Gasto Material"} />
          <Subsection number={2} name={"Salarios Directos"} />
          <Subsection number={3} name={"Otros Gastos Directos"} />
          <Subsection number={4} name={"Gastos Asociados a la Producción"} />
          <Subsection number={5} name={"Gastos Generales y de Administración"} />
          <Subsection number={6} name={"Gastos de Distribución y Ventas"} />
          <Subsection number={7} name={"Gastos Financieros"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
          <Subsection number={8} name={"Gastos Tributarios"} />
        </View>
      </Page>
    </Document>
  );
}
{
  /* <CustomTablePDF fields={fields} data={data} />  */
}
