import mongoose, { Document, Schema, Model, Types } from 'mongoose'

// Strongly-typed Event document interface
export interface IEvent extends Document {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string // stored as ISO date string (YYYY-MM-DD)
  time: string // stored as HH:mm (24-hour)
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Schema definition with validations for required non-empty fields
const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true, default: [] },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, default: [] }
  },
  {
    timestamps: true,
    // Ensure strict schema enforcement
    strict: true
  }
)

// Index slug for uniqueness and fast lookup
EventSchema.index({ slug: 1 }, { unique: true })

/**
 * Helper: create a URL-friendly slug from a title.
 * Keeps only alpha-numeric characters and dashes, lowercased.
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Helper: normalize a date string to YYYY-MM-DD (ISO date portion).
 * Throws if the provided date is not a valid date.
 */
function normalizeDate(input: string): string {
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date format')
  }
  return d.toISOString().split('T')[0]
}

/**
 * Helper: normalize time strings into 24-hour HH:mm format.
 * Accepts inputs like '9:00 AM', '09:00', '21:30', etc.
 */
function normalizeTime(input: string): string {
  const s = input.trim()
  // Match HH:MM with optional AM/PM
  const m = s.match(/^([0-9]{1,2}):([0-9]{2})(?:\s*([AaPp][Mm]))?$/)
  if (!m) throw new Error('Invalid time format')
  let hh = parseInt(m[1], 10)
  const mm = parseInt(m[2], 10)
  const ampm = m[3]
  if (mm < 0 || mm > 59) throw new Error('Invalid minutes in time')
  if (ampm) {
    const isPm = /[Pp][Mm]/.test(ampm)
    if (hh === 12) hh = isPm ? 12 : 0
    else if (isPm) hh += 12
  }
  if (hh < 0 || hh > 23) throw new Error('Invalid hour in time')
  const hhStr = String(hh).padStart(2, '0')
  const mmStr = String(mm).padStart(2, '0')
  return `${hhStr}:${mmStr}`
}

// Pre-save hook: generate or update slug only when title changes, and normalize date/time.
EventSchema.pre<IEvent>('save', async function (next) {
  try {
    // Validate required string fields are non-empty after trimming
    const requiredStringFields: Array<keyof IEvent> = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'organizer'
    ]
    for (const field of requiredStringFields) {
      const val = (this as any)[field]
      if (typeof val !== 'string' || val.trim().length === 0) {
        throw new Error(`${String(field)} is required and cannot be empty`)
      }
    }

    // Normalize date and time to consistent formats
    this.date = normalizeDate(this.date)
    this.time = normalizeTime(this.time)

    // Slug generation: only when title modified or slug missing
    if (this.isModified('title') || !this.slug) {
      const base = slugify(this.title)
      let candidate = base
      let suffix = 0
      // Ensure uniqueness by checking existing documents (exclude self by _id)
      // Loop until a unique slug is found. This is safe for small collisions.
      // Use mongoose model access via mongoose.models to avoid circular import issues.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // If no model compiled yet, break and use candidate as-is
        const existing = await mongoose.models.Event?.findOne({ slug: candidate, _id: { $ne: this._id } }).lean()
        if (!existing) break
        suffix += 1
        candidate = `${base}-${suffix}`
      }
      this.slug = candidate
    }

    next()
  } catch (err) {
    next(err as Error)
  }
})

// Export model; use existing compiled model when available to prevent OverwriteModelError in dev
export const Event: Model<IEvent> = (mongoose.models.Event as Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema)

export default Event
