// export {default} from "next-auth/middleware"
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {

    // //* Allow only users with administrator role to access the users page  */
    // if (request.nextUrl.pathname.startsWith("/dashboard/users") && !request.nextauth.token?.user?.role?.includes("ADMIN")) {
    //   return NextResponse.rewrite(new URL("/unauthorized", request.url));
    // }
    // //* Allow only users with administrator and human resources roles to access the human resources page */
    // if (
    //   request.nextUrl.pathname.startsWith("/dashboard/humanResources") &&
    //   !request.nextauth.token?.user?.role?.includes("ADMIN") &&
    //   !request.nextauth.token?.user?.role?.includes("HR")
    // ) {
    //   return NextResponse.rewrite(new URL("/unauthorized", request.url));
    // }
    // //* Allow only users with administrator and office roles to access the office page  */
    // if (
    //   request.nextUrl.pathname.startsWith("/dashboard/office") &&
    //   !request.nextauth.token?.user?.role?.includes("ADMIN") &&
    //   !request.nextauth.token?.user?.role?.includes("OFFICE")
    // ) {
    //   return NextResponse.rewrite(new URL("/unauthorized", request.url));
    // }
    // //* Allow only users with administrator and warehouse roles to access the warehouse page  */
    // if (
    //   request.nextUrl.pathname.startsWith("/dashboard/warehouse") &&
    //   !request.nextauth.token?.user?.role?.includes("ADMIN") &&
    //   !request.nextauth.token?.user?.role?.includes("WAREHOUSE")
    // ) {
    //   return NextResponse.rewrite(new URL("/unauthorized", request.url));
    // }
    // //* Allow only users with administrator and warehouse roles to access the tickets warehouse page  */
    // if (
    //   request.nextUrl.pathname.startsWith("/dashboard/ticketsWarehouse") &&
    //   !request.nextauth.token?.user?.role?.includes("ADMIN") &&
    //   !request.nextauth.token?.user?.role?.includes("WAREHOUSE")
    // ) {
    //   return NextResponse.rewrite(new URL("/unauthorized", request.url));
    // }
    // //* Allow only users with administrator and project roles to access the project page  */
    // if (
    //   request.nextUrl.pathname.startsWith("/dashboard/project") &&
    //   !request.nextauth.token?.user?.role?.includes("ADMIN") &&
    //   !request.nextauth.token?.user?.role?.includes("PROJECT")
    // ) {
    //   return NextResponse.rewrite(new URL("/unauthorized", request.url));
    // }
    // //* Allow only users with administrator and project roles to access the project expenses page  */
    // if (
    //   request.nextUrl.pathname.startsWith("/dashboard/projectExpenses") &&
    //   !request.nextauth.token?.user?.role?.includes("ADMIN") &&
    //   !request.nextauth.token?.user?.role?.includes("PROJECT")
    // ) {
    //   return NextResponse.rewrite(new URL("/unauthorized", request.url));
    // }
    // TODO: Establecer los permisos de acceso del rol COMERCIAL
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
