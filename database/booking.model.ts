import mongoose, { Document, Schema, Model, Types } from 'mongoose'
import { Event } from './event.model'

// Strongly-typed Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    strict: true
  }
)

// Index eventId for faster lookups of bookings by event
BookingSchema.index({ eventId: 1 })

// Simple email regex for basic validation (RFC5322-complete regex is overly large)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Pre-save: ensure referenced Event exists and email is valid
BookingSchema.pre<IBooking>('save', async function (next) {
  try {
    if (!this.eventId) throw new Error('eventId is required')

    // Validate email format
    if (typeof this.email !== 'string' || !EMAIL_RE.test(this.email)) {
      throw new Error('Invalid email format')
    }

    // Verify referenced Event exists
    // Using the Event model ensures the reference is valid before saving a Booking
    const exists = await Event.exists({ _id: this.eventId })
    if (!exists) throw new Error('Referenced Event does not exist')

    next()
  } catch (err) {
    next(err as Error)
  }
})

export const Booking: Model<IBooking> = (mongoose.models.Booking as Model<IBooking>) || mongoose.model<IBooking>('Booking', BookingSchema)

export default Booking
