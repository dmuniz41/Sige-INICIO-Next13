"use client";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import WarehouseReport from "./WarehouseReport";

export default function Page() {
  return (
    <div>
      <PDFViewer  className="app w-screen h-screen">
        <WarehouseReport />
      </PDFViewer>
    </div>
  );
}
