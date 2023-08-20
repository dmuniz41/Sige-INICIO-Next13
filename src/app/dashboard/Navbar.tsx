"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import userImage from "../../assets/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png";
import logo from "../../assets/inicio.svg";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";

// TODO: Añadir encabezado dinámico a las secciones y breadcrum  

export const Navbar = () => {
  const {data:sessionData} = useSession()
  localStorage.setItem('accessToken', sessionData?.user?.accessToken)
  // let sectionName: string[] = ["DASHBOARD"];

  // useEffect(() => {
  //   sectionName = window.location.toString().split("/");
  // }, [window.location]);

  return (
    <>
      <div className="flex justify-between items-center h-[5rem] bg-primary-500 w-full absolute">
        <Image src={logo} width={250} height={"10"} alt="inicio-logo" className="h-5rem bg-background_light p-7" />
        <div className="flex items-center justify-end bg-primary-500 w-full h-full p-[1rem]">
          <ul className="list-none">
            <li className="flex items-center gap-[0.5rem] font-bold text-white text-base">
              <Image src={userImage} width={50} height={50} priority={false} alt="user image" className="rounded-full" />
              <span>Daniel</span>
              <LogoutOutlined onClick={()=>{signOut()}} className="mb-0.5 text-md"/>
            </li>
          </ul>
        </div>
      </div>
      <div className="font-bold  text-3xl font-segoe items-center p-8 flex absolute left-80 top-[3rem] mr-[5rem] h-[4rem] rounded-md w-[75%] bg-white shadow-md">
        <span>{"Dashboard"}</span>
      </div>
    </>
  );
};
