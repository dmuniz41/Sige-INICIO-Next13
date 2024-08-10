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
      callbackUrl: "/dashboard"
    });

    if (res?.error) {
      Toast.fire({
        icon: "error",
        title: "Usuario o contraseña incorrecto"
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[25%] px-8 py-10 border-t-[4px] border-solid border-t-primary-500 font-semibold bg-white-100 rounded-[5px] shadow-md"
      >
        <div className="grid">
          <h5 className="mb-0 font-bold">Usuario</h5>
          <input
            className="w-full h-[50px] font-medium pl-[10px] outline-none border-solid border-[1px] rounded-md border-border_input  focus:border-primary-500 "
            autoFocus
            type="text"
            name="user"
            id="input_user"
            autoComplete="user"
          />
        </div>
        <div className="grid">
          <h5 className="mb-0 font-bold">Contraseña</h5>
          <input
            className="w-full h-[50px] font-medium pl-[10px] outline-none border-solid border-[1px] rounded-md border-border_input focus:border-primary-500"
            type="password"
            name="password"
            id="input_password"
            autoComplete="current-password"
          />
        </div>
        <button type="submit">
          <a className="cursor-pointer text-xl mt-4 justify-center items-center uppercase flex bg-primary-500 rounded-md w-full h-[50px] border-none transition ease-in delay-50 hover:bg-primary-600 shadow-md">
            <span className="text-white-100 font-semibold">Entrar</span>
          </a>
        </button>
      </form>
      <p className="font-semibold mt-10 text-border_input">Copyright © INICIO-TEAM {new Date().getFullYear()}</p>
    </div>
  );
}
