export const generateAlphanumericCode = (prefix: string): string => {
  // Ensure the prefix is exactly 4 characters long
  if (prefix.length !== 4) {
    throw new Error("El prefix debe tern 4 caracteres.");
  }

  // Define the characters that can be used for the random part
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";

  // Generate the random 4-character part
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPart += characters[randomIndex];
  }

  // Combine the prefix and the random part
  return prefix + randomPart;
};
