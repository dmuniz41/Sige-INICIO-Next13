"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { FormEvent, useState } from "react";

import { Toast } from "@/helpers/customAlert";
import logo from "../../../assets/inicio.svg";

export default function Login() {
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();

    const res = await signIn("credentials", {
      user: formData.get("user"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Usuario o contraseña incorrecto",
      });

      return setError(res.error as string);
    }
    if (res?.ok) {
      return router.push("/dashboard");
    }
  };
  return (
    <div className=" flex flex-col bg-background_light items-center justify-center w-screen h-screen font-segoe animate-fade animate-once animate-duration-150">
      <div className="mb-[3rem] w-[15rem]">
        <Image src={logo} width={500} height={300} alt="Inicio logo" priority={true} />
      </div>
      <form onSubmit={handleSubmit} className="grid w-[380px] p-[30px] h-[300px] border-t-[4px] border-solid border-t-primary-500 font-bold bg-white-100 rounded-[5px] shadow-xl">
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
        <button type="submit">
          <a className="cursor-pointer text-xl justify-center items-center uppercase flex bg-primary-500 rounded-md mt-2 w-full h-[50px] border-none transition ease-in delay-50 hover:bg-primary-600 shadow-md">
            <span className="text-white-100 font-bold">Entrar</span>
          </a>
        </button>
      </form>
      <p className="font-semibold mt-20 text-border_input">Copyright © INICIO-TEAM 2022</p>
    </div>
  );
}
