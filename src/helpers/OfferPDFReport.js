/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
import font from "../assets/arial-font/arialceb.ttf";

Font.register({ family: "Arial", src: font, fontStyle: "normal", fontWeight: "bold" });

const BORDER_COLOR = "#000";
const BORDER_STYLE = "solid";

const styles = StyleSheet.create({
  body: {
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 25
  },

  // ? ESTILOS DE LA SECCION DE LA INFO DEL CLIENTE //
  clientInfoSectionContainer: {
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: "1px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    width: "100%",
    padding: 4,
    marginBottom: 5
  },
  clientInfoElementHeader: {
    fontSize: "12pt",
    fontWeight: "bold",
    marginRight: "2px",
    fontFamily: "Arial"
  },
  clientInfoElementText: {
    fontSize: "12pt"
  },

  // ? ESTILOS DE LA SECCION DE LA LISTA DE ITEMS //

  offerNameContainer: {
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomWidth: "1px"
  },

  // ? ESTILOS DE UN ITEM //
  itemContainer: {
    width: "100%",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: "1px",
    display: "flex",
    flexDirection: "row"
  },

  // ? ESTILOS DE LAS TABLAS DE ITEMS //
  table: {
    display: "table",
    width: "auto",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableCellHeader: {
    margin: 2,
    fontSize: "12pt",
    fontWeight: "bold",
    fontFamily: "Arial"
  },
  tableCell: {
    margin: 2,
    fontSize: "12pt"
  },
  textCenter: {
    textAlign: "center"
  }
});

function checkStrEmpty(str) {
  return !(str && str.length > 1 && str.split(" ").join("").length > 0);
}

export default function OfferPDFReport(props) {
  const { clientInfo, data, title, totalValue } = props;
  return (
    <Document>
      <Page wrap orientation="landscape" size={"LETTER"} style={styles.body}>
        {/* ENCABEZADO DONDE VA LA INFO DE EL CLIENTE Y LA AGENCIA DE REPRESENTACION */}
        <View style={styles.clientInfoSectionContainer}>
          <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Text style={styles.clientInfoElementHeader}>Entidad Encargante:</Text>
            <Text style={styles.clientInfoElementText}>{clientInfo?.name}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Text style={styles.clientInfoElementHeader}>Domicilio Legal:</Text>
            <Text style={styles.clientInfoElementText}>{clientInfo?.address}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Text style={styles.clientInfoElementHeader}>Email:</Text>
            <Text style={styles.clientInfoElementText}>{clientInfo?.email}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Text style={styles.clientInfoElementHeader}>Teléfono:</Text>
            <Text style={styles.clientInfoElementText}>{clientInfo?.phoneNumber}</Text>
          </View>
        </View>
        {/* SECCION DONDE VAN LOS ITEMS Y EL NOMBRE DEL PROYECTO */}
        <View
          style={{
            width: "100%",
            borderStyle: BORDER_STYLE,
            borderColor: BORDER_COLOR,
            borderLeftWidth: "1px",
            borderRightWidth: "1px",
            borderTopWidth: "1px",
            borderBottomWidth: "0px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <View style={styles.offerNameContainer}>
            <View
              style={{ borderBottomWidth: "1px", borderBottomStyle: "solid", paddingHorizontal: 4 }}
            >
              <Text style={styles.clientInfoElementHeader}>{title}</Text>
            </View>
            {/* LISTA DE ITEMS */}
            {data.map((item, index) => {
              return (
                <View key={index} style={styles.itemContainer}>
                  {/* NUMERO DE ITEM */}
                  <View
                    style={{
                      backgroundColor: "#f4f6f9",
                      width: "15px",
                      borderRightWidth: "1px",
                      borderRightStyle: "solid",
                      justifyContent: "center",
                      display: "flex"
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: "Arial",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  {/* DESCRIPCION, LISTA DE ACTIVIDADES Y VALOR DEL ITEM */}
                  <View style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    {/* DESCRIPCION Y VALOR DEL ITEM */}
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <View
                        wrap
                        style={{
                          display: "flex",
                          backgroundColor: "#f4f6f9",
                          borderRightWidth: "1px",
                          borderStyle: "solid",
                          width: "90%",
                          padding: 2
                        }}
                      >
                        <Text style={{ fontFamily: "Arial", fontWeight: "bold", fontSize: "10pt" }}>
                          {item.description}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          backgroundColor: "#f4f6f9",
                          alignItems: "center",
                          width: "80px"
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Arial",
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: 10
                          }}
                        >
                          ${" "}
                          {item.value.toLocaleString("DE", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                          })}
                        </Text>
                      </View>
                    </View>
                    {/* LISTA DE ACTIVIDADES */}
                    <View>TABLA DE ACTIVIDADES</View>
                  </View>
                </View>
              );
            })}
            <View></View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// const CustomTablePDF = (props) => {
//   const { fields = [], data = [] } = props;
//   let tableCol = {
//     borderStyle: BORDER_STYLE,
//     borderColor: BORDER_COLOR,
//     borderBottomColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//     borderLeft: "1px",
//     borderBottom: "1px"
//   };
//   return (
//     <View style={styles.subsectionTable}>
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
//                       <Text style={[styles.tableCell, item.style ? item.style : {}]}>
//                         {_item.component(item)}
//                       </Text>
//                     </View>
//                   );
//                 } else {
//                   return (
//                     <View key={_idx} style={[styles.tableCol, { width: _item.width + "%" }]}>
//                       <Text style={[styles.tableCell, item.style ? item.style : {}]}>
//                         {checkStrEmpty(val) ? value_alt : val || "-"}
//                       </Text>
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
