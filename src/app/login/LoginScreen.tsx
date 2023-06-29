"use client";
import React, { FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import logo from "../../assets/inicio.svg";

export const LoginScreen = () => {
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className=" flex flex-col bg-background_light items-center justify-center w-screen h-screen font-segoe animate-fade animate-once animate-duration-150">
      <div className="mb-[3rem] w-[15rem]">
        <Image src={logo} width={500} height={300} alt="Inicio logo" priority={true} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid w-[380px] p-[30px] h-[300px] border-t-[4px] border-solid border-t-primary-500 font-bold bg-white rounded-[5px] shadow-xl"
      >
        <h5 className="h-[15px] mb-0">Usuario</h5>
        <input
          className="w-full h-[50px] font-medium pl-[10px] outline-none border-solid border-[1px] rounded-md border-border_input  focus:border-primary-500 "
          autoFocus
          type="text"
          name="user"
          id="input_user"
          autoComplete="user"
        />
        <h5 className="h-[15px] mb-0">Contraseña</h5>
        <input
          className="w-full h-[50px] font-medium pl-[10px] outline-none border-solid border-[1px] rounded-md border-border_input focus:border-primary-500"
          type="password"
          name="password"
          id="input_password"
          autoComplete="current-password"
        />
        <button className="text-white font-bold pointer bg-primary-500 rounded-md mt-2 w-full h-[50px] border-none transition ease-in delay-50 hover:bg-primary-600">
          ENTRAR
        </button>
      </form>
      <p className="font-semibold mt-20 text-border_input">Copyright © INICIO-TEAM 2022</p>
    </div>
  );
};
