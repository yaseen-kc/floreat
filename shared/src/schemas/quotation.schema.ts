/**
 * Canonical Quotation request contract shared by the Floreat frontend and
 * backend. Quotation is a flat, 1-to-1 resource per job that stores the
 * computed pricing and quantity snapshot shown in the Step 13 document preview.
 * All fields are optional so partial drafts can be saved.
 */
import { z } from 'zod'

/** Schema for creating/upserting a quotation — all fields optional. */
export const createQuotationSchema = z.object({
  // Pricing snapshot
  fabricationAmount:  z.number().optional(),
  installationAmount: z.number().optional(),
  grandTotal:         z.number().optional(),

  // Quantity estimation snapshot (rows 1–25)
  qtyRoofStructure:      z.number().optional(),
  qtyRoofPurlins:        z.number().optional(),
  qtyMezzanineStructure: z.number().optional(),
  qtyCladdingStructure:  z.number().optional(),
  qtyBracings:           z.number().optional(),
  qtyCanopyStructure:    z.number().optional(),
  qtyCanopyPurlins:      z.number().optional(),
  qtyStair:              z.number().optional(),
  qtyPlinthArea:         z.number().optional(),
  qtyRoofSheetArea:      z.number().optional(),
  qtyDeckingSheet:       z.number().optional(),
  qtyCladdingSheetArea:  z.number().optional(),
  qtyCanopySheetArea:    z.number().optional(),
  qtySheetAccessories:   z.number().optional(),
  qtyDoors:              z.number().optional(),
  qtyWindows:            z.number().optional(),
  qtyRollingShutter:     z.number().optional(),
  qtyLouvers:            z.number().optional(),
  qtyTurboVentilators:   z.number().optional(),
  qtySkyLights:          z.number().optional(),
  qtyWallLights:         z.number().optional(),
  qtyRoofInsulation:     z.number().optional(),
  qtyWallInsulation:     z.number().optional(),
  qtyPolycarbonateSheet: z.number().optional(),
  qtyFasciaStructure:    z.number().optional(),
})

/** Schema for updating a quotation — all fields optional (partial update). */
export const updateQuotationSchema = createQuotationSchema.partial()

/** Validated payload for creating/upserting a quotation. */
export type CreateQuotationInput = z.infer<typeof createQuotationSchema>

/** Validated payload for updating a quotation (all fields optional). */
export type UpdateQuotationInput = z.infer<typeof updateQuotationSchema>
