"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";

import logo from "../../assets/inicio.svg";
import { Tooltip } from "antd";
import { RootState, useAppSelector } from "@/store/store";
import { IWarehouse } from "@/models/warehouse";

export const Navbar = () => {
  const pathname = usePathname();
  let mainPath = pathname.split("/");
  let warehouseId = mainPath[3];
  let secondaryPath = mainPath[2];
  const router = useRouter();
  let currentWarehouseName = "";
  const { data: sessionData } = useSession();
  const username = sessionData?.user?.user;

  const { warehouses }: { warehouses: IWarehouse[] } = useAppSelector(
    (state: RootState) => state?.warehouse
  );

  warehouses.map((warehouse) => {
    if (warehouse._id === warehouseId) {
      currentWarehouseName = `/ ${warehouse.name}`;
    }
  });

  switch (secondaryPath) {
    case "users":
      secondaryPath = "Usuarios";
      break;
    case "nomenclators":
      secondaryPath = "Nomencladores";
      break;
    case "humanResources":
      secondaryPath = "Recursos Humanos";
      break;
    case "office":
      secondaryPath = "Gastos de Oficina";
      break;
    case "warehouse":
      secondaryPath = `Almacén ${currentWarehouseName}`;
      break;
    case "ticketsWarehouse":
      secondaryPath = "Almacén de Vales";
      break;
    case "project":
      secondaryPath = "Proyectos";
      break;
    case "projectExpenses":
      secondaryPath = "Gastos de Proyectos";
      break;
    case "costSheets":
      secondaryPath = "Fichas de Costo";
      break;
    case "serviceFees":
      secondaryPath = "Tarifas de Servicio";
      break;
    case "serviceFeesAuxiliary":
      secondaryPath = "Auxiliares";
      break;
    case "serviceFeesTasks":
      secondaryPath = "Tareas para Tarifas de Servicio";
      break;
    case "offer":
      secondaryPath = "Ofertas";
      break;

    default:
      break;
  }

  if (mainPath.includes("dashboard")) mainPath[1] = "Menú Principal";

  return (
    <>
      <div className="flex justify-between items-center h-[5rem] bg-primary-500 w-full absolute">
        <a
          className="min-w-[240px] h-full flex items-center justify-center bg-background_light"
          href="/dashboard"
        >
          <Image
            src={logo}
            width={100}
            height={10}
            alt="inicio-logo"
            className="h-full w-full p-2 mt-8 bg-background_light"
          />
        </a>
        <div className="flex items-center justify-end bg-primary-500 w-full h-full p-[1rem] bg-transparent">
          <ul className="list-none flex items-center text-white-100 ">
            <li className="flex items-center gap-[0.5rem] font-semibold text-white-100 text-base mr-3">
              <UserOutlined className="text-2xl mb-2" />
              <span className="text-xl">{`${username}`}</span>
            </li>
          </ul>
          <Tooltip placement="topLeft" title={"Salir"} arrow={{ pointAtCenter: true }}>
            <button
              className="flex cursor-pointer left-3 text-xl bg-primary-500 text-white-100 hover:bg-primary-400 items-center rounded-full p-2 ease-in-out duration-300"
              onClick={() => {
                signOut();
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                <path d="M9 12h12l-3 -3"></path>
                <path d="M18 15l3 -3"></path>
              </svg>
            </button>
          </Tooltip>
        </div>
      </div>
      <article
        className={
          !secondaryPath
            ? `items-center flex justify-start gap-2 relative top-[3rem] ml-[18rem] h-[4rem] w-[70%]`
            : `items-center flex justify-start gap-2 relative top-[3rem] ml-[16.5rem] h-[4rem] w-[70%]`
        }
      >
        <section className={!secondaryPath ? `hidden` : ""}>
          <Tooltip placement="top" title={"Atrás"} arrow={{ pointAtCenter: true }}>
            <a
              onClick={() => router.back()}
              className=" shadow-md cursor-pointer bg-white-500 hover:bg-white-600 ease-in-out duration-300 flex justify-center items-center w-[2.5rem] h-[2.5rem] text-xl rounded-full"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </a>
          </Tooltip>
        </section>
        <section className="items-center p-4 flex relative  rounded-md w-full bg-white-100 shadow-md">
          {secondaryPath ? (
            <span className="font-semibold text-2xl font-segoe ">{`${secondaryPath}`}</span>
          ) : (
            <span className="font-semibold text-2xl font-segoe ">{`${mainPath[1]}`}</span>
          )}
        </section>
      </article>
    </>
  );
};
