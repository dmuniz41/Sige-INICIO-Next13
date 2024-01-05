'use client'

import { useSession } from "next-auth/react";
import React from "react";

export default function Page() {
  
  const { data: sessionData } = useSession();
  if(typeof window !== 'undefined'){
  localStorage.setItem("accessToken", sessionData?.user?.accessToken!);
  }
  return (
    <>
    </>
  );
}
