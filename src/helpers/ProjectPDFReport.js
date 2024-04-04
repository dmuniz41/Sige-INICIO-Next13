/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, Document, StyleSheet, View, Font, Image, Svg } from "@react-pdf/renderer";
import font from "../assets/arial-font/arialceb.ttf";
import logo from "../assets/inicioLogoPNG.jpg";

Font.register({ family: "Arial", src: font, fontStyle: "normal", fontWeight: "bold" });

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
    backgroundColor: "#aaa"
  },

  // ? ESTILOS DE LA SECCION DEL HEADER DONDE ESTA LA INFO DEL PROYECTO //
  headerSection: {
    display: "flex",
    flexShrink: 1,
    width: "100%"
  },

  subtitleHeaderContainer: {
    display: "flex",
    flexDirection: "row",
  },

  labelText: {
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: "10pt"
  },

  infoText: {
    fontSize: "10pt",
    display: "flex",
    flex: 1
  },

  // ? ESTILOS DE LA TABLA DE ITEMS //
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
    fontSize: "10pt",
    fontWeight: "bold",
    fontFamily: "Arial"
  },
  tableCell: {
    margin: 2,
    fontSize: 10
  },
  textCenter: {
    textAlign: "center"
  }
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
  const { data = [], title = "" } = props;
  return (
    <Document>
      <Page wrap orientation="portrait" size={"LETTER"} style={styles.body}>
        <View style={{display:'flex', width: '100%', justifyContent: 'center', flexDirection: 'row'}}>
          <Text style={{fontFamily:'Arial', fontSize: '14pt', fontWeight: 'bold'}}>SOLICITUD DE SERVICIO</Text>
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
          <View></View>
        </View>

        {/* <CustomTablePDF fields={fields} data={data} /> */}
      </Page>
    </Document>
  );
}
