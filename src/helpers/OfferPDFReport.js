import { Page, Text, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
// import font from "../assets/arial-font/arialceb.ttf";

// Font.register({ family: "Arial", src: font, fontStyle: "normal", fontWeight: "bold" });

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
    fontSize: "10pt",
    fontWeight: "bold",
    marginRight: "2px",
    // fontFamily: "Arial"
  },
  clientInfoElementText: {
    fontSize: "10pt"
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
    borderRightWidth: 1,
    borderLeftWidth: 1,
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
    fontSize: "10pt",
    fontWeight: "bold",
    // fontFamily: "Arial"
  },
  tableCell: {
    margin: 2,
    fontSize: "10pt"
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

  const fields = [
    {
      title: "Descripción",
      custom: true,
      component: (item) => `${item.description}`,
      width: "50"
    },
    {
      title: "U/M",
      custom: true,
      component: (item) => `${item.unitMeasure}`,
      width: "15"
    },
    {
      title: "Cant.",
      custom: true,
      component: (item) =>
        `${item.amount.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "10"
    },
    {
      title: "Precio CUP",
      custom: true,
      component: (item) =>
        `$ ${item.price.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "15"
    },
    {
      title: "Importe CUP",
      custom: true,
      component: (item) =>
        `$ ${item.value.toLocaleString("DE", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
      width: "10"
    }
  ];
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
            borderTopWidth: "1px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              borderBottomWidth: "1px",
              borderStyle: "solid",
              paddingHorizontal: 4,
              borderLeftWidth: 1,
              borderRightWidth: 1
            }}
          >
            <Text style={styles.clientInfoElementHeader}>{title}</Text>
          </View>
          {/* LISTA DE ITEMS */}
          {data?.map((item, index) => {
            return (
              <View wrap={false} key={index} style={styles.itemContainer}>
                {/* NUMERO DE ITEM */}
                <View
                  style={{
                    backgroundColor: "#cccccc",
                    width: "25px",
                    justifyContent: "center",
                    display: "flex"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      // fontFamily: "Arial",
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
                      style={{
                        display: "flex",
                        backgroundColor: "#cccccc",
                        borderLeftStyle: "solid",
                        borderLeftWidth: "1px",
                        borderStyle: "solid",
                        width: "90%",
                        padding: 2
                      }}
                    >
                      <Text
                        style={{
                          //  fontFamily: "Arial",
                          fontWeight: "bold",
                          fontSize: "10pt"
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        backgroundColor: "#cccccc",
                        alignItems: "center",
                        flexGrow: 1,
                        borderLeftStyle: "solid",
                        borderLeftWidth: "1px"
                      }}
                    >
                      <Text
                        style={{
                          // fontFamily: "Arial",
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
                  <CustomTablePDF fields={fields} data={item.activities} />
                </View>
              </View>
            );
          })}
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View
              style={{
                display: "flex",
                backgroundColor: "#cccccc",
                borderLeftStyle: "solid",
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderStyle: "solid",
                width: "90.5%",
                padding: 2
              }}
            >
              <Text
                style={{
                  //  fontFamily: "Arial",
                  fontWeight: "bold",
                  fontSize: "10pt"
                }}
              >
                VALOR TOTAL
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                backgroundColor: "#cccccc",
                alignItems: "center",
                flexGrow: 1,
                borderLeftStyle: "solid",
                borderRightWidth: 1,
                borderBottomWidth: 1
              }}
            >
              <Text
                style={{
                  // fontFamily: "Arial",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 10
                }}
              >
                ${" "}
                {totalValue?.toLocaleString("DE", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

const CustomTablePDF = (props) => {
  const { fields = [], data = [] } = props;
  let tableCol = {
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderLeft: "1px",
    borderBottom: "0px",
    borderTopWidth: "1px"
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
                      <Text style={[styles.tableCell, item.style ? item.style : {}]}>
                        {_item.component(item)}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <View key={_idx} style={[styles.tableCol, { width: _item.width + "%" }]}>
                      <Text style={[styles.tableCell, item.style ? item.style : {}]}>
                        {checkStrEmpty(val) ? value_alt : val || "-"}
                      </Text>
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
