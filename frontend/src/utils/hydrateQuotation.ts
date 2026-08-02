import type { Quotation } from '@/api/quotation/quotation/getQuotation'
import type { QuotationDraft } from '@/stores/quotation-store'

/**
 * Maps a `Quotation` API response into a Step 13 {@link QuotationDraft}.
 * Quotation is flat with no child arrays, so this is a straight field-by-field coercion.
 */
export function mapQuotationResponseToDraft(q: Quotation): QuotationDraft {
  const num = (v: number | null | undefined) => v ?? undefined
  return {
    fabricationAmount:  num(q.fabricationAmount),
    installationAmount: num(q.installationAmount),
    grandTotal:         num(q.grandTotal),

    qtyRoofStructure:      num(q.qtyRoofStructure),
    qtyRoofPurlins:        num(q.qtyRoofPurlins),
    qtyMezzanineStructure: num(q.qtyMezzanineStructure),
    qtyCladdingStructure:  num(q.qtyCladdingStructure),
    qtyBracings:           num(q.qtyBracings),
    qtyCanopyStructure:    num(q.qtyCanopyStructure),
    qtyCanopyPurlins:      num(q.qtyCanopyPurlins),
    qtyStair:              num(q.qtyStair),
    qtyPlinthArea:         num(q.qtyPlinthArea),
    qtyRoofSheetArea:      num(q.qtyRoofSheetArea),
    qtyDeckingSheet:       num(q.qtyDeckingSheet),
    qtyCladdingSheetArea:  num(q.qtyCladdingSheetArea),
    qtyCanopySheetArea:    num(q.qtyCanopySheetArea),
    qtySheetAccessories:   num(q.qtySheetAccessories),
    qtyDoors:              num(q.qtyDoors),
    qtyWindows:            num(q.qtyWindows),
    qtyRollingShutter:     num(q.qtyRollingShutter),
    qtyLouvers:            num(q.qtyLouvers),
    qtyTurboVentilators:   num(q.qtyTurboVentilators),
    qtySkyLights:          num(q.qtySkyLights),
    qtyWallLights:         num(q.qtyWallLights),
    qtyRoofInsulation:     num(q.qtyRoofInsulation),
    qtyWallInsulation:     num(q.qtyWallInsulation),
    qtyPolycarbonateSheet: num(q.qtyPolycarbonateSheet),
    qtyFasciaStructure:    num(q.qtyFasciaStructure),
  }
}
