/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Svg } from "@react-pdf/renderer";

const BORDER_COLOR = "#000";
const BORDER_STYLE = "solid";

const styles = StyleSheet.create({
  body: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 35,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    borderStyle: "solid",
    borderWidth: "1px",
  },
  headerText: {
    fontSize: 12,
  },
  header: {
    textAlign: "center",
    height: 40,
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
    height: 40,
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

export default function CostSheetPDFReport(props) {
  // const date = new Date().toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" });
  const { fields = [], data = [], title = "" } = props;
  return (
    <Document>
      <Page wrap orientation="portrait" size={"LETTER"} style={styles.body}>
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{title.toUpperCase()}</Text>
          </View>
          <View style={styles.subHeader}>
            <View style={{ display: "flex", flexDirection: "column", height: "100%", width: "40%", borderBottom: "1px", borderStyle: "solid" }}></View>
            <View style={{ display: "flex", flexDirection: "column", height: "100%", width: "60%", borderBottom: "1px", borderLeft: "1px", borderStyle: "solid" }}></View>
          </View>
        </View>
        {/* <CustomTablePDF fields={fields} data={data} />  */}
      </Page>
    </Document>
  );
}
