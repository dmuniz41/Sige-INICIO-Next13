/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
import font from "../assets/arial-font/arialceb.ttf";

Font.register({ family: "Arial", src: font, fontStyle: "normal", fontWeight: "bold" });

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
    width: "100%",
  },
  headerText: {
    fontSize: "12pt",
    fontFamily: "Arial",
    fontWeight: "bold",
  },
  header: {
    textAlign: "center",
    minHeight: 25,
    borderStyle: "solid",
    borderTop: "1px",
    borderLeft: "1px",
    borderRight: "1px",
    borderBottom: "1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subHeader: {
    display: "flex",
    borderLeft: "1px",
    borderRight: "1px",
    borderStyle: "solid",
    flexDirection: "row",
    width: "100%",
    minHeight: 50,
  },
  subtitle: {
    fontSize: "8pt",
    marginLeft: 1,
  },

  subsectionContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderStyle: "solid",
    borderBottom: "1px",
    borderLeft: "1px",
    borderRight: "1px",
  },
  subsectionHeaderAndTableContainer: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    flex: 1,
  },
  subsectionTableContainer: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    borderStyle: "solid",
    borderLeft: "1px",
  },

  smallSubsectionContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: 10,
    borderStyle: "solid",
    borderLeft: "1px",
    borderRight: "1px",
    borderBottom: "1px",
  },

  //*   Estilos para las tablas dentro de las subsecciones

  subsectionTable: {
    display: "flex",
    width: "100%",
  },
  tableCellHeader: {
    fontSize: "8pt",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  tableCell: {
    fontSize: "8pt",
  },
  tableRow: {
    flexDirection: "row",
  },
});

function checkStrEmpty(str) {
  return !(str && str.length > 1 && str.split(" ").join("").length > 0);
}

const CustomTablePDF = (props) => {
  const { fields = [], data = [] } = props;
  let tableCol = {
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "1px",
    borderBottom: "1px",
  };
  return (
    <View style={styles.subsectionTable}>
      <View style={[styles.tableRow, styles.headerBg]}>
        {fields.map((_item, _idx) => (
          <View key={_idx} style={[tableCol, { width: _item.width + "%" }]}>
            <Text style={[styles.tableCellHeader, { textAlign: "center" }]}>{_item.title}</Text>
          </View>
        ))}
      </View>

      {data.map(
        (item, idx) =>
          item && (
            <View key={idx} style={styles.tableRow}>
              {fields.map((_item, _idx) => {
                let val = item[_item.value] || "";
                let value_alt = (_item.value_alt && item[_item.value_alt]) || "";

                if (_item.custom) {
                  return (
                    <View key={_idx} style={[tableCol, { width: _item.width + "%" }]}>
                      <Text style={[styles.tableCell, item.style ? item.style : {}]}>{_item.component(item)}</Text>
                    </View>
                  );
                } else {
                  return (
                    <View key={_idx} style={[styles.tableCol, { width: _item.width + "%" }]}>
                      <Text style={[styles.tableCell, item.style ? item.style : {}]}>{checkStrEmpty(val) ? value_alt : val || "-"}</Text>
                    </View>
                  );
                }
              })}
            </View>
          )
      )}
    </View>
  );
};

const Subsection = (props) => {
  const { number = 1, name = "", data = [], subtotal = 0, fields = [] } = props;

  return (
    <View wrap={false} style={styles.subsectionContainer}>
      <View style={{ justifyContent: "center", alignItems: "center", width: 34, borderStyle: "solid", borderRight: "1px" }}>
        <Text style={styles.subtitle}>{number}</Text>
      </View>
      <View style={styles.subsectionHeaderAndTableContainer}>
        {/* Subsection name and table */}
        <View style={{ display: "flex", flexDirection: "row" }}>
          {/* Subsection name */}
          <View style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 146, borderStyle: "solid", borderBottom: "1px" }}>
            <Text style={styles.subtitle}>{name}</Text>
          </View>
          {/* Subsection table */}
          <View style={{ flex: 1, display: "flex" }}>
            <CustomTablePDF fields={fields} data={data} />
          </View>
        </View>
        {/* Subtotal */}
        <View style={{ display: "flex", flexDirection: "row", borderStyle: "solid", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: 147, borderStyle: "solid", borderRight: "1px" }}>
            <Text style={{ fontSize: "8pt", marginLeft: 1, textAlign: "center" }}>Subtotal</Text>
          </View>
          <View style={{ borderStyle: "solid", backgroundColor: "#B8B8B8", display: "flex", flex: 1 }}></View>
          <View style={{ borderStyle: "solid", borderLeft: "1px", justifyContent: "flex-end", backgroundColor: "#B8B8B8", display: "flex", width: 54 }}>
            <Text style={{ fontSize: "8pt", marginLeft: 1, textAlign: "center", fontFamily: "Arial", fontWeight: "bold" }}>${subtotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const SmallSubsection = (props) => {
  const { number = 1, name = "", value = 0 } = props;

  return (
    <View wrap={false} style={styles.smallSubsectionContainer}>
      <View style={{ width: 34, borderStyle: "solid", borderRight: "1px", justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.subtitle}>{number}</Text>
      </View>
      <View style={{ borderStyle: "solid", justifyContent: "flex-end", alignItems: "center", display: "flex", flexGrow: 1, flexDirection: "row", paddingRight: 2 }}>
        <Text style={{ fontSize: "10pt", fontFamily: "Arial", fontWeight: "bold" }}>{name}</Text>
      </View>
      <View style={{ width: 54, borderStyle: "solid", borderLeft: "1px", justifyContent: "center", backgroundColor: "#B8B8B8", display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: "8pt", marginLeft: 1, fontFamily: "Arial", fontWeight: "bold" }}>${value}</Text>
      </View>
    </View>
  );
};

export default function CostSheetPDFReport(props) {
  const date = new Date().toLocaleDateString("es-DO", { year: "numeric", month: "numeric", day: "numeric" });
  const { fields = [], data = {}, title = "" } = props;
  return (
    <Document>
      <Page wrap orientation="portrait" size={"LETTER"} style={styles.body}>
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{title.toUpperCase()}</Text>
          </View>
          {/* Subheader */}
          <View style={styles.subHeader}>
            {/* Parte izquierda del subheader */}
            <View style={{ display: "flex", flexDirection: "column", width: 180, borderBottom: "1px", borderStyle: "solid", justifyContent: "space-between" }}>
              <View style={{ display: "flex", flexGrow: 1, justifyContent: "center", borderBottom: "1px", borderStyle: "solid" }}>
                <Text style={styles.subtitle}>Creador: INICIO</Text>
              </View>
              <View style={{ display: "flex", flexGrow: 1, justifyContent: "center", borderBottom: "1px", borderStyle: "solid" }}>
                <Text style={styles.subtitle}>Cantidad de empleados: {data.workersAmount} </Text>
              </View>
              <View style={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
                <Text style={styles.subtitle}>Cliente </Text>
              </View>
            </View>
            {/* Parte derecha del subheader */}
            <View style={{ display: "flex", flexDirection: "column", flex: 1, borderBottom: "1px", borderLeft: "1px", borderStyle: "solid" }}>
              <View style={{ display: "flex", flexDirection: "row", minHeight: 10 }}>
                <View style={{ width: "30%", borderBottom: "1px", justifyContent: "center" }}>
                  <Text style={styles.subtitle}>Fecha:</Text>
                </View>
                <View style={{ width: "70%", borderStyle: "solid", borderLeft: "1px", borderBottom: "1px", justifyContent: "center" }}>
                  <Text style={styles.subtitle}>{date}</Text>
                </View>
              </View>
              <View style={{ minHeight: 30, display: "flex", padding: 1 }}>
                <Text style={styles.subtitle}>{data.description}</Text>
              </View>
            </View>
          </View>
          {/* Subsecciones */}
          <Subsection fields={fields} data={data.rawMaterials} subtotal={data.rawMaterialsSubtotal} number={1} name={"Gasto Material"} />
          <Subsection fields={fields} data={data.directSalaries} subtotal={data.directSalariesSubtotal} number={2} name={"Salarios Directos"} />
          <Subsection fields={fields} data={data.otherDirectExpenses} subtotal={data.otherDirectExpensesSubtotal} number={3} name={"Otros Gastos Directos"} />
          <Subsection fields={fields} data={data.productionRelatedExpenses} subtotal={data.productionRelatedExpensesSubtotal} number={4} name={"Gastos Asociados a la Producción"} />
          <SmallSubsection number={5} name={"IMPORTE TOTAL DE COSTOS"} value={(data.costsTotalValue * 250).toFixed(2)} />
          <Subsection fields={fields} data={data.administrativeExpenses} subtotal={data.administrativeExpensesSubtotal} number={6} name={"Gastos Generales y de Administración"} />
          <Subsection fields={fields} data={data.transportationExpenses} subtotal={data.transportationExpensesSubtotal} number={7} name={"Gastos de Distribución y Ventas"} />
          <Subsection fields={fields} data={data.financialExpenses} subtotal={data.financialExpensesSubtotal} number={8} name={"Gastos Financieros"} />
          <Subsection fields={fields} data={data.taxExpenses} subtotal={data.taxExpensesSubtotal} number={9} name={"Gastos Tributarios"} />
          <View wrap={false}>
            <SmallSubsection number={10} name={"IMPORTE TOTAL DE GASTOS"} value={(data.expensesTotalValue * 250).toFixed(2)} />
            <SmallSubsection number={11} name={"IMPORTE TOTAL DE COSTOS Y GASTOS"} value={(data.expensesAndCostsTotalValue * 250).toFixed(2)} />
            <SmallSubsection number={12} name={"TALENTO ARTÍSTICO"} value={(data.artisticTalentValue * 250).toFixed(2)} />
            <SmallSubsection number={13} name={"UTILIDAD"} value={(data.representationCostValue * 250).toFixed(2)} />
            <SmallSubsection number={14} name={"PRECIO DEL CREADOR"} value={(data.creatorPrice * 250).toFixed(2)} />
            <SmallSubsection number={15} name={"MATERIA PRIMAS Y MATERIALES APORTADOS POR EL FCBC"} value={(data.rawMaterialsByClient * 250).toFixed(2)} />
            <SmallSubsection number={16} name={"PRECIO DE VENTA MAYORISTA MÁXIMO"} value={(data.salePrice * 1).toFixed(2)} />
          </View>
          <View wrap={false}>
            <View style={{ width: "100%", borderStyle: "solid", borderBottom: "1px", borderLeft: "1px", borderRight: "1px", textAlign: "left", display: "flex", flexDirection: "row" }}>
              <Text style={{ fontSize: "8pt", marginLeft: 1, width: 180, borderRight: "1px", borderStyle: "solid" }}>Elaborado por creador:</Text>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={{ width: "100%", borderStyle: "solid", borderBottom: "1px", borderLeft: "1px", borderRight: "1px", textAlign: "left" }}>
              <Text style={{ fontSize: "8pt", marginLeft: 1, width: 180, borderRight: "1px", borderStyle: "solid" }}>Fecha:</Text>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={{ width: "100%", borderStyle: "solid", borderBottom: "1px", borderLeft: "1px", borderRight: "1px", textAlign: "left" }}>
              <Text style={{ fontSize: "8pt", marginLeft: 1, width: 180, borderRight: "1px", borderStyle: "solid" }}>Firma:</Text>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={{ width: "100%", borderStyle: "solid", borderBottom: "1px", borderLeft: "1px", borderRight: "1px", textAlign: "left" }}>
              <Text style={{ fontSize: "8pt", marginLeft: 1, width: 180, borderRight: "1px", borderStyle: "solid" }}>Aprobado por (Esp. Comercial): </Text>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={{ width: "100%", borderStyle: "solid", borderBottom: "1px", borderLeft: "1px", borderRight: "1px", textAlign: "left" }}>
              <Text style={{ fontSize: "8pt", marginLeft: 1, width: 180, borderRight: "1px", borderStyle: "solid" }}>Fecha</Text>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={{ width: "100%", borderStyle: "solid", borderBottom: "1px", borderLeft: "1px", borderRight: "1px", textAlign: "left" }}>
              <Text style={{ fontSize: "8pt", marginLeft: 1, width: 180, borderRight: "1px", borderStyle: "solid" }}>Firma</Text>
              <View style={{ flex: 1 }}></View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
{
}
