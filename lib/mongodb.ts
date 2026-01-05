import mongoose, { ConnectOptions, Mongoose } from 'mongoose'

// Read MongoDB connection string from environment. Throw early if missing so errors are obvious.
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Extend globalThis to hold a cached mongoose connection across module reloads (useful for Next.js dev).
declare global {
  // Use a global variable to avoid creating multiple connections during hot reloads.
  // `globalThis._mongoose` will hold the connection and a promise while a connection is being established.
  // This avoids `any` by explicitly typing the shape using `Mongoose` and `Promise<Mongoose>`.
  var _mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

// Use the global cached object if available, otherwise initialize.
const cached = globalThis._mongoose || { conn: null, promise: null }

/**
 * Connect to MongoDB using Mongoose and cache the connection.
 * Subsequent calls will return the cached Mongoose instance.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Return cached connection if present
  if (cached.conn) {
    return cached.conn
  }

  // If there is no ongoing connection attempt, start one and store the promise
  if (!cached.promise) {
    const opts: ConnectOptions = {
      // Disables mongoose buffering; in production you may want different settings
      bufferCommands: false,
      // Other options can be set here if needed (tls, authSource, etc.)
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m)
  }

  // Await the connection promise and cache the result
  cached.conn = await cached.promise
  // Persist back to globalThis so hot reloads reuse the cached connection
  globalThis._mongoose = cached
  return cached.conn
}

export default connectToDatabase
