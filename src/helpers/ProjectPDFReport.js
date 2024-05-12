import { Page, Text, Document, StyleSheet, View, Font, Image, Svg } from "@react-pdf/renderer";
// import font from "../assets/arial-font/arialceb.ttf";
// import logo from "../assets/inicioLogoPNG.jpg";

// Font.register({ family: "Arial", src: font, fontStyle: "normal", fontWeight: "bold" });

const BORDER_COLOR = "#000";
const BORDER_STYLE = "solid";

const styles = StyleSheet.create({
  body: {
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 35
  },
  header: {
    marginBottom: 20,
    textAlign: "center"
  },
  subheader: {
    fontSize: 14,
    fontWeight: "black",
    color: "black",
    marginBottom: 5
  },
  date: {
    fontSize: 12,
    color: "gray"
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey"
  },
  headerBg: {
    fontWeight: "black",
    backgroundColor: "#F3DEBE"
  },

  // ? ESTILOS DE LA SECCION DEL HEADER DONDE ESTA LA INFO DEL PROYECTO //
  headerSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between"
  },
  subtitleHeaderContainer: {
    display: "flex",
    flexDirection: "row"
  },
  labelText: {
    // fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: "8pt"
  },
  infoText: {
    fontSize: "8pt",
    display: "flex",
    flex: 1
  },

  // ? ESTILOS DE LA TABLA DE ITEMS //

  itemListContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    marginTop: 8
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableCellHeader: {
    margin: 2,
    fontSize: "8pt",
    fontWeight: "bold"
    // fontFamily: "Arial"
  },
  tableCell: {
    margin: 2,
    fontSize: "8pt"
  }
});

function checkStrEmpty(str) {
  return !(str && str.length > 1 && str.split(" ").join("").length > 0);
}

const fields = [
  {
    title: "No.",
    custom: true,
    component: (item) => (
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "red"
        }}
      >
        <Text
          style={{
            fontSize: "8pt"
          }}
        >
          {item?.idNumber}
        </Text>
      </View>
    ),
    width: "5"
  },
  {
    title: "DESCRIPCIÓN DEL SERVICIO",
    custom: true,
    component: (item) => `${item?.description}`,
    width: "95"
  }
];

const CustomTablePDF = (props) => {
  const { fields = [], data = [] } = props;
  let tableCol = {
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderBottomColor: "#000",
    borderRightWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 1
  };
  return (
    <View style={styles.table}>
      <View fixed style={[styles.tableRow, styles.headerBg]}>
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
              {/* <View wrap={false} style={[tableCol, { width: "5%" }]}>
                <Text style={[styles.tableCell, { textAlign: "center" }]}>{idx + 1}</Text>
              </View> */}
              {fields.map((_item, _idx) => {
                let val = item[_item.value] || "";
                let value_alt = (_item.value_alt && item[_item.value_alt]) || "";

                if (_item.custom) {
                  return (
                    <View wrap={false} key={_idx} style={[tableCol, { width: _item.width + "%" }]}>
                      <Text style={[styles.tableCell, item.style ? item.style : {}]}>
                        {_item.component(item)}
                      </Text>
                    </View>
                  );
                } else {
                  return (
                    <View
                      wrap={false}
                      key={_idx}
                      style={[styles.tableCol, { width: _item.width + "%" }]}
                    >
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

export default function ProjectPDFReport(props) {
  const { data, itemsList } = props;

  return (
    <Document>
      <Page wrap orientation="portrait" size={"LETTER"} style={styles.body}>
        <View
          style={{ display: "flex", width: "100%", justifyContent: "center", flexDirection: "row" }}
        >
          <Text
            style={{
              //  fontFamily: "Arial",
              fontSize: "14pt",
              fontWeight: "bold"
            }}
          >
            SOLICITUD DE SERVICIO
          </Text>
        </View>
        <View style={styles.headerSection}>
          {/* SECCION DONDE VA NO. DE CLIENTE, NOMBRE, PROYECTO, REPRESENTANTE, FECHA DE ENTREGA */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80%"
            }}
          >
            {/* NO. DE CLIENTE */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>No. de Cliente: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{data?.clientNumber}</Text>
              </View>
            </View>
            {/* NOMBRE DE CLIENTE */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Nombre de Cliente: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{data?.clientName}</Text>
              </View>
            </View>
            {/* NOMBRE DE PROYECTO */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Proyecto: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{data?.projectName}</Text>
              </View>
            </View>
            {/* REPRESENTANTE */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Cobrado por: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{data?.payMethod}</Text>
              </View>
            </View>
            {/* FECHA DE ENTREGA */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Fecha en la que se necesita el servicio: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{data?.deliveryDate}</Text>
              </View>
            </View>
          </View>
          {/* SECCION DONDE VA : FECHA DE CREACION, NO. DE SOLICITUD, MONEDA */}
          <View style={{ display: "flex", width: "15%" }}>
            <View style={{ display: "flex", border: 1, marginBottom: 4 }}>
              {/* FECHA DE CREACION */}
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  height: "12px",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    // fontFamily: "Arial",
                    fontSize: "8pt",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  FECHA
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  border: 1,
                  height: "20px",
                  width: "100%",
                  borderLeft: 0,
                  borderRight: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: "8pt",
                    textAlign: "center"
                  }}
                >
                  {data?.initDate}
                </Text>
              </View>
              {/* NO. DE SOLICITUD */}
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  height: "12px",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: "8pt",
                    fontWeight: "bold",
                    // fontFamily: "Arial",
                    textAlign: "center"
                  }}
                >
                  {data?.projectNumber}
                </Text>
              </View>
            </View>
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Moneda: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{data?.currency}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* SECCION DE LA LISTA DE ITEMS */}
        <View style={styles.itemListContainer}>
          <View style={{ display: "flex", flexDirection: "column", width: "80%" }}>
            <CustomTablePDF fields={fields} data={itemsList} />
          </View>
          {/* PRECIO */}
          <View
            style={{
              display: "flex",
              width: "20%",
              flexDirection: "column",
              borderStyle: "solid",
              borderBottom: 1,
              borderRight: 1,
              borderTop: 1
            }}
          >
            <View
              style={{
                display: "flex",
                backgroundColor: "#F3DEBE",
                width: "100%",
                borderStyle: "solid",
                borderBottom: 1,
                borderLeft: 1
              }}
            >
              <Text
                style={{
                  margin: 2,
                  // fontFamily: "Arial",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "8pt"
                }}
              >
                Precio
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor:'red'
              }}
            >
              <Text
                style={{
                  // fontFamily: "Arial",
                  fontWeight: "bold",
                  fontSize: "8pt",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                ${" "}
                {data?.totalValue?.toLocaleString("DE", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", width: "100%", marginTop: 8 }}>
          <View style={{ display: "flex", flexDirection: "column", width: "70%" }}>
            {/* SOLICITADO POR */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Solicitado por: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>__________</Text>
              </View>
            </View>
            {/* RECIBIDO POR */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Recibido por: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>__________</Text>
              </View>
            </View>
          </View>
          {/* TELEFONO */}
          <View style={{ display: "flex", flexDirection: "row", flex: 1 }}>
            <View style={{ display: "flex" }}>
              <Text style={styles.labelText}>Teléfono: </Text>
            </View>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", width: "100%", marginTop: 8 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              alignItems: "flex-end"
            }}
          >
            {/* TERMINADO */}
            <View style={{ ...styles.subtitleHeaderContainer, marginRight: 4, width: "30%" }}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Terminado: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{`__________`}</Text>
              </View>
            </View>
            {/* COBRADO */}
            <View style={{ ...styles.subtitleHeaderContainer, marginRight: 4, width: "30%" }}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Cobrado: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{`__________`}</Text>
              </View>
            </View>
            {/* CERRADO */}
            <View style={{ ...styles.subtitleHeaderContainer, marginRight: 4, width: "30%" }}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Cerrado: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>{`__________`}</Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "column", width: "20%" }}>
            {/* GASTOS */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Gastos: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>
                  ${" "}
                  {data?.expenses?.toLocaleString("DE", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </Text>
              </View>
            </View>
            {/* GANANCIA */}
            <View style={styles.subtitleHeaderContainer}>
              <View style={{ display: "flex" }}>
                <Text style={styles.labelText}>Ganancia: </Text>
              </View>
              <View style={styles.infoText}>
                <Text>
                  ${" "}
                  {data?.profits?.toLocaleString("DE", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
