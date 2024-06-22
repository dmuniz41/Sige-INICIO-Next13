import React from "react";

export default function page() {
  return (
    <div className="flex max-w-screen min-h-screen items-center  justify-center bg-background_light animate-fade animate-once animate-duration-500">
      <div className="flex flex-col gap-5 items-center justify-center ">
        <h1 className="text-7xl font-bold text-primary-500 ">Acceso Denegado</h1>
        <span className="font-segoe text-2xl font-normal">
          Usted no tiene autorización para acceder a esta página
        </span>
        <a
          href="/dashboard"
          className="font-segoe mt-6 cursor-pointer text-2xl font-bold bg-secondary-500 py-3 px-4 rounded-md text-white hover:bg-secondary-700 transition-all ease-in delay-50 shadow-xl text-white-100"
        >
          Ir al Menú Principal
        </a>
      </div>
    </div>
  );
}
