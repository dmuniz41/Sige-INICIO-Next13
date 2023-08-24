"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from 'next/navigation'
import userImage from "../../assets/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png";
import logo from "../../assets/inicio.svg";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";

// TODO: Añadir logica para que el encabezado cambie de acuredor a la seccion

export const Navbar = () => {
  const pathname = usePathname()
  const currentPath = pathname.split('/')
  const {data:sessionData} = useSession()
  const username = sessionData?.user?.user
  localStorage.setItem('accessToken', sessionData?.user?.accessToken)
  
  return (
    <>
      <div className="flex justify-between items-center h-[5rem] bg-primary-500 w-full absolute">
        <Image src={logo} width={250} height={"10"} alt="inicio-logo" className="h-5rem bg-background_light p-7" />
        <div className="flex items-center justify-end bg-primary-500 w-full h-full p-[1rem]">
          <ul className="list-none">
            <li className="flex items-center gap-[0.5rem] font-bold text-white text-base">
              <Image src={userImage} width={50} height={50} priority={false} alt="user image" className="rounded-full" />
              <span>{`${username}`}</span>
              <LogoutOutlined onClick={()=>{signOut()}} className="mb-0.5 text-md"/>
            </li>
          </ul>
        </div>
      </div>
      <div className=" items-center p-8 flex relative top-[3rem] ml-[19.5rem] h-[4rem] rounded-md w-[70%] bg-white shadow-md">
        <span className="font-bold text-2xl font-segoe ">{`${currentPath[1].toUpperCase()}`}</span>
      </div>
    </>
  );
};
