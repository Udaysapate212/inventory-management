import { z } from 'zod'
import { format, addDays } from 'date-fns'

// Atomic validation units
const NameSchema = z.string().min(1, "Product name required").max(50)
const QuantitySchema = z.number().int().positive("Must be positive integer")
const DateSchema = z.date()
  .min(addDays(new Date(), -1), "Expiry date must be in future")
  .transform(date => format(date, 'yyyy-MM-dd'))

// Nuclear validation matrix
export const ProductSchema = z.object({
  name: NameSchema,
  quantity: QuantitySchema,
  expDate: DateSchema,
  image: z.instanceof(File).optional()
}).superRefine((val, ctx) => {
  if (val.image && !val.image.type.startsWith('image/')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "File must be an image",
      path: ["image"]
    })
  }
})