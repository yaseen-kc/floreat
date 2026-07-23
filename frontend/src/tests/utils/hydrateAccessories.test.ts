import { describe, it, expect } from 'vitest'
import { mapAccessoriesResponseToDraft } from '@/utils/hydrateAccessories'
import type { Accessories } from '@/api/quotation/accessories/getAccessories'

const mockAccessories: Accessories = {
  id: 'acc-123',
  jobId: 'job-123',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',

  gutterType: 'PPGL',
  gutterSize: 'IN_6',
  gutterQuantity: '100.5',
  gutterQuantityManual: false,
  downTakeType: null,
  downTakeSize: null,
  downTakeQuantity: null,
  downTakeQuantityManual: null,
  dripTrimType: null,
  dripTrimThickness: null,
  dripTrimQuantity: null,
  dripTrimQuantityManual: null,
  gableEndFlashingType: null,
  gableEndFlashingThickness: null,
  gableEndFlashingQuantity: null,
  gableEndFlashingQuantityManual: null,
  cornerFlashType: null,
  cornerFlashThickness: null,
  cornerFlashQuantity: null,
  cornerFlashQuantityManual: null,
  ridgeType: null,
  ridgeThickness: null,
  ridgeQuantity: null,
  ridgeQuantityManual: null,

  partitionType: 'AEROCON_PANEL',
  partitionThickness: 'MM_50',
  partitionQuantity: 5,

  rollingShutterLength: '3.5',
  rollingShutterWidth: '2.5',
  rollingShutterNos: 2,
  rollingShutterQuantity: '17.5',

  louverLength: null,
  louverWidth: null,
  louverNos: null,
  louverQuantity: null,
  skyLightLength: null,
  skyLightWidth: null,
  skyLightNos: null,
  skyLightQuantity: null,
  wallLightLength: null,
  wallLightWidth: null,
  wallLightNos: null,
  wallLightQuantity: null,

  roofInsulationType: null,
  wallInsulationType: null,

  turboVentilatorDiameter: null,
  turboVentilatorNos: null,

  handrailWeightKg: null,

  deckSheetFlashingEnabled: true,
  gantryGirderEnabled: false,
  liftStructureEnabled: null,

  framesPrimerCoats: 2,
  framesPrimerType: 'EPOXY_PRIMER',
  framesPaintCoats: null,
  framesPaintType: null,
  purlinsGirtsFinish: 'PRE_GALVANISED',
  purlinsGirtsGsm: 120,
  purlinsGirtsPaint: 'UNPAINTED',
  foundationBoltFinish: 'BLACK_UNPAINTED',

  doorHeight: '2.1',
  doorWidth: '0.9',
  doorNos: 3,
  doorQuantity: '5.67',

  windowHeight: null,
  windowWidth: null,
  windowNos: null,
  windowQuantity: null,

  foldedPlateLength: null,
  foldedPlateWidth: null,
  foldedPlateNos: null,
  foldedPlateQuantity: null,
}

describe('mapAccessoriesResponseToDraft', () => {
  it('maps scalar fields and converts Decimals to numbers', () => {
    const draft = mapAccessoriesResponseToDraft(mockAccessories)

    expect(draft.gutterType).toBe('PPGL')
    expect(draft.gutterQuantity).toBe(100.5)

    expect(draft.partitionQuantity).toBe(5)
    
    expect(draft.doorHeight).toBe(2.1)
    expect(draft.doorWidth).toBe(0.9)
    expect(draft.doorNos).toBe(3)
  })

  it('maps missing values to undefined', () => {
    const draft = mapAccessoriesResponseToDraft(mockAccessories)
    expect(draft.windowHeight).toBeUndefined()
    expect(draft.downTakeSize).toBeUndefined()
  })
})
