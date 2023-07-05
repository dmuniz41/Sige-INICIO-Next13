//  http://localhost:3000/api

export const fetchSinToken = (endpoint:string, data: any, method = "GET") => {
  const url = `${process.env.SERVER_URL}/${endpoint}`;

  if (method === "GET") {
    return fetch(url);
  } else {
    return fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
};

// export const fetchConToken = (endpoint, data, method = "GET") => {
//   const url = `${import.meta.env.VITE_BACKEND_API_URL}/${endpoint}`;
//   const token = localStorage.getItem("token") || "";

//   if (method === "GET") {
//     return fetch(url, {
//       method,
//       headers: {
//         "x-token": token,
//       },
//     });
//   } else {
//     return fetch(url, {
//       method,
//       headers: {
//         "Content-type": "application/json",
//         "x-token": token,
//       },
//       body: JSON.stringify(data),
//     });
//   }
// };