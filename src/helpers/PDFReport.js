import { Page, Text, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
// import source from "@/assets/arial-font/arialceb.ttf";

// Font.register({ family: "Arial", src: source, fontStyle: "normal", fontWeight: "bold" });

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
    // fontFamily: "Arial"
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
    borderTopWidth: 1,
    justifyContent: "center"
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

export default function PDFReport(props) {
  const date = new Date().toLocaleDateString("es-DO", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const { fields = [], data = [], title = "" } = props;
  return (
    <Document>
      <Page wrap orientation="landscape" size={"LETTER"} style={styles.body}>
        <Text style={styles.header}>
          <Text style={styles.subheader}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </Text>
        <CustomTablePDF fields={fields} data={data} />
      </Page>
    </Document>
  );
}
