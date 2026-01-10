import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Clear any existing model to avoid conflicts
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;