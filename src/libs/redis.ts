// lib/redis.ts
import { createClient } from "redis";

// Use environment variables for Redis connection details
// The 'redis' package expects the URL directly for the client creation
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// It's good practice to connect the client once and export the connected client
// This ensures the client is ready when imported
async function connectRedis() {
  if (!redisClient.isReady) {
    try {
      await redisClient.connect();
      console.log("Redis client connected successfully!");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      // You might want to throw the error or handle it based on your app's needs
    }
  }
  return redisClient;
}

// Export a promise that resolves to the connected client
// or directly export the client if you ensure connection externally
// For Next.js App Router, ensure connection happens once, e.g., on server start or first request.
// A simpler approach for individual route handlers is to ensure it's connected before use.

// For simplicity and common use in route handlers:
// Call connect() when the client is first needed, or ensure it's a singleton pattern
// that handles connection internally.

// Let's create a singleton-like pattern for the client connection
let connectedClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!connectedClient) {
    const client = createClient({
      url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
    });
    client.on("error", (err) => console.error("Redis Client Error", err));
    await client.connect();
    connectedClient = client;
    console.log("🚀 ~ getRedisClient ~ connectedClient:", connectedClient)
  }
  return connectedClient;
}

export default getRedisClient;
