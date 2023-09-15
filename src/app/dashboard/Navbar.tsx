"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";

import logo from "../../assets/inicio.svg";
import userImage from "../../assets/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png";

export const Navbar = () => {
  const pathname = usePathname();
  let mainPath = pathname.split("/");
  let secondaryPath = mainPath[2];
  const { data: sessionData } = useSession();
  const username = sessionData?.user?.user;
  

  if (mainPath.includes("dashboard")) mainPath[1] = "Menú Principal";

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
      secondaryPath = "Almacenes";
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

    default:
      break;
  }

  return (
    <>
      <div className="flex justify-between items-center h-[5rem] bg-primary-500 w-full absolute">
        <div className="min-w-[240px] h-full flex items-center justify-center bg-background_light">
        <Image src={logo} width={100} height={10} alt="inicio-logo" className="h-full w-full p-2 mt-8 bg-background_light"/>
        </div>
        <div className="flex items-center justify-end bg-primary-500 w-full h-full p-[1rem] bg-transparent">
          <ul className="list-none flex items-center text-white-100 ">
            <li className="flex items-center gap-[0.5rem] font-bold text-white-100 text-base mr-3">
              <UserOutlined className="text-2xl mb-2"/>
              <span className="text-xl">{`${username}`}</span>
            </li>
          </ul>
          <div className="flex left-3 text-xl bg-primary-500 text-white-100 hover:bg-primary-400 items-center rounded-full p-2 ease-in-out duration-300">
              <LogoutOutlined
              style={{fontSize: '24px', fontWeight: 'bolder'}}
                onClick={() => {
                  signOut();
                }}
                className=""
              />
          </div>
        </div>
      </div>
      <div className=" items-center p-8 flex relative top-[3rem] ml-[16.5rem] h-[4rem] rounded-md w-[73%] bg-white-100 shadow-md">
        {secondaryPath ? (
          <span className="font-bold text-2xl font-segoe ">{`${secondaryPath}`}</span>
        ) : (
          <span className="font-bold text-2xl font-segoe ">{`${mainPath[1]}`}</span>
        )}
      </div>
    </>
  );
};
