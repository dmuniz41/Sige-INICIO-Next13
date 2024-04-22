//  http://localhost:3000/api

export const fetchSinToken = (endpoint:string, data: any, method = "GET") => {
  const url = `${process.env.API_URL}/${endpoint}`;

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