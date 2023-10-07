/* eslint-disable jsx-a11y/alt-text */
import React, { Fragment, useEffect, useState } from "react";
import { Page, Text, Document, StyleSheet, View } from "@react-pdf/renderer";
import logo from "../../assets/inicioLogoPNG.jpg";

const BORDER_COLOR = "#000";
const BORDER_STYLE = "solid";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },

  headerBg: {
    backgroundColor: "#aaa",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: BORDER_STYLE,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCellHeader: {
    margin: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 2,
    fontSize: 12,
  },
  textCenter: {
    textAlign: "center",
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
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  };
  return (
    <View style={styles.table}>
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

const fields = [
  {
    title: " Agent Name",
    custom: true,
    component: (item) => `${item.agent_name}`,
    width: "30",
  },
  {
    title: " Policy No",
    custom: true,
    component: (item) => `${item.policy_no}`,
    width: "35",
  },
  {
    title: "Amount",
    custom: true,
    className: "font-bold",
    component: (item) => `${item.contribution}`,
    width: "35",
  },
];

const data = [
  {
    contribution: 2,
    agent_name: "asd",
    policy_no: 123,
  },
  {
    contribution: 2,
    agent_name: "asd",
    policy_no: 123,
  },
  {
    contribution: 2,
    agent_name: "asd",
    policy_no: 123,
  },
];

export default function WarehouseReport() {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header}>Reporte de Almacén</Text>
        <CustomTablePDF fields={fields} data={data} />
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
