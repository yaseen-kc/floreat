import { prisma } from '../lib/prisma.js'
import {
  SideWallSide,
  TypeOfWall,
  PurlinMaterialType,
  TypeOfWindBracing,
  CoveringType,
  RoofFrameBaseFixing,
  PlateMaterialGrade,
  MezzanineType,
  MezzanineFloorLevel,
  MezzanineHeightFrom,
  CanopyHeightFrom,
  CanopySheetType,
  YesNo,
  StairStepType,
  StairFloorLevel,
  StairStringerType,
  AreaDeductionType,
  AreaDeductionFor,
  ApprovalDrawingsTimeUnit,
} from '../generated/prisma/client.js'

async function main() {
  // ── Users ───────────────────────────────────────────────────
  const users = [
    { clerkId: 'user_3EfmONmZWOmsqVwUa3RgGLeNVbp', email: 'admin@floreat.dev', firstName: 'Yash', lastName: 'Kumar' },
    { clerkId: 'user_fake_seed_2', email: 'engineer@floreat.dev', firstName: 'Rahul', lastName: 'Sharma' },
    { clerkId: 'user_fake_seed_3', email: 'sales@floreat.dev', firstName: 'Priya', lastName: 'Patel' },
  ]

  for (const u of users) {
    await prisma.user.upsert({ where: { clerkId: u.clerkId }, update: u, create: u })
  }
  console.log('✓ Users seeded')

  // ── Jobs ────────────────────────────────────────────────────
  const jobs = [
    {
      id: 'seed_job_1',
      projectNo: 'PRJ-2024-001',
      subject: 'Industrial Warehouse - Phase 1',
      refNo: 'REF-IW-001',
      date: new Date('2024-06-15'),
      designedByName: 'Yash Kumar',
      designedByMobile: '9876543210',
      clientName: 'Tata Steel Ltd',
      estimationEngineerName: 'Rahul Sharma',
      estimationEngineerMobile: '9876543211',
      headOfSalesName: 'Priya Patel',
      headOfSalesMobile: '9876543212',
      firmName: 'Floreat Structures Pvt Ltd',
      buildingUsage: 'Industrial',
      numberOfBuilding: 2,
      frameType: 'Multi-Span',
      configuration: 'Multi-Bay Portal Frame',
    },
    {
      id: 'seed_job_2',
      projectNo: 'PRJ-2024-002',
      subject: 'Commercial Showroom',
      refNo: 'REF-CS-002',
      date: new Date('2024-07-20'),
      designedByName: 'Rahul Sharma',
      designedByMobile: '9876543211',
      clientName: 'Reliance Retail',
      buildingUsage: 'Commercial',
      numberOfBuilding: 1,
      frameType: 'Single-Span Clear',
      configuration: 'Clear Span Portal Frame',
    },
    {
      id: 'seed_job_3',
      projectNo: 'PRJ-2024-003',
      subject: 'Manufacturing Unit - Block A',
      refNo: 'REF-MU-003',
      date: new Date('2024-08-10'),
      designedByName: 'Yash Kumar',
      designedByMobile: '9876543210',
      firmName: 'Godrej Industries',
      buildingUsage: 'Factory',
      numberOfBuilding: 3,
      frameType: 'Multi-Bay',
      configuration: 'Crane Supported Frame',
    },
    {
      id: 'seed_job_4',
      projectNo: 'PRJ-2024-004',
      subject: 'Agricultural Cold Storage',
      refNo: 'REF-AG-004',
      date: new Date('2024-09-05'),
      designedByName: 'Rahul Sharma',
      designedByMobile: '9876543211',
      clientName: 'Amul Cooperative',
      headOfSalesName: 'Priya Patel',
      headOfSalesMobile: '9876543212',
      buildingUsage: 'Agricultural',
      numberOfBuilding: 1,
      frameType: 'Portal Frame',
      configuration: 'Single Span Portal Frame',
    },
    {
      id: 'seed_job_5',
      projectNo: 'PRJ-2024-005',
      subject: 'Logistics Hub - Warehouse B',
      refNo: 'REF-LH-005',
      date: new Date('2024-10-01'),
      designedByName: 'Yash Kumar',
      designedByMobile: '9876543210',
      clientName: 'Delhivery Pvt Ltd',
      estimationEngineerName: 'Rahul Sharma',
      estimationEngineerMobile: '9876543211',
      firmName: 'Floreat Structures Pvt Ltd',
      buildingUsage: 'Logistics',
      numberOfBuilding: 1,
      frameType: 'Pre-Engineered',
      configuration: 'Multi-Span with Mezzanine',
    },
  ]

  for (const { id, ...data } of jobs) {
    await prisma.job.upsert({ where: { id }, update: data, create: { id, ...data } })
  }
  console.log('✓ Jobs seeded')

  // ── Roofs & Sidewalls ───────────────────────────────────────
  const roofs = [
    {
      jobId: 'seed_job_1',
      // Full roof with all optional sections
      buildingOverallLength: 72.0, buildingOverallWidth: 36.0, eaveHeight: 10.5, roofSlope: 5.71,
      mainRoofFrames: 10, endRoofFrames: 2, roofPurlinSpacing: 1.5, claddingPurlins: 8,
      internalColumnsForMainRoofFrames: 1, internalColumnsForEndRoofFrames: 0,
      roofFrameBaseFixing: RoofFrameBaseFixing.FOUNDATION_BOLT,
      columnSegmentsInMainFrame: 2, raftersInOneHalfOfMainFrame: 3,
      columnSegmentsInEndFrame: 1, raftersInOneHalfOfEndFrame: 2, endFrameHorizontalTieBeam: 1,
      roofPurlinType: PurlinMaterialType.Z_C, roofPurlinDepth: 200.0, roofPurlinUnitWeight: 7.5,
      claddingPurlinType: PurlinMaterialType.Z_C, claddingPurlinDepth: 150.0, claddingPurlinUnitWeight: 5.2,
      roofCoveringType: CoveringType.BARE_GALVALUME, roofCoveringThickness: 0.5,
      claddingCoveringType: CoveringType.PPGL, claddingCoveringThickness: 0.47, roofAreaDeduction: 12.0,
      roofFlangeBraceAverageLength: 1.8, claddingFlangeBraceAverageLength: 1.5, endFrameFlangeBraceAverageLength: 1.6,
      polycarbonateRoofLength: 3.0, polycarbonateRoofWidth: 1.2, polycarbonateRoofCount: 10,
      roofWindBracingSegmentsInOneHalf: 2, columnWindBracingSegments: 2,
      roofWindBracingProvidedBays: 4, columnWindBracingProvidedBays: 4,
      windBracingColumnHeight: 10.5, windBracingUnitWeight: 3.8,
      roofWindBracingBaySpacing: 8.0, columnWindBracingBaySpacing: 8.0,
      roofWindBracingLength: 9.5, columnWindBracingLength: 7.2, windBracingType: TypeOfWindBracing.ROD,
      frontCladdingOpeningArea: 25.0, backCladdingOpeningArea: 10.0,
      rightCladdingOpeningArea: 5.0, leftCladdingOpeningArea: 5.0,
      fasciaBoardArea: 45.0, fasciaMaterialWeightPerSqft: 2.5,
      roofExtensionWidthHeight: 3.0, roofExtensionMidFrameCount: 8, roofExtensionEndFrameCount: 2,
      claddingExtensionWidthHeight: 2.5, claddingExtensionMidFrameCount: 8, claddingExtensionEndFrameCount: 2,
      // sideColumnsWidthHeight is derived: eaveHeight − claddingExt × tan(roofSlope°) = 10.5 − 2.5·tan(5.71°) ≈ 10.25
      sideColumnsWidthHeight: 10.25, sideColumnsMidFrameCount: 8, sideColumnsEndFrameCount: 2,
      gradeOfPlateMaterial: PlateMaterialGrade.FE_345,
      materialConsumptionExcludingPurlin: 18.5, DiaOfRoofSagRod: 12.0, DiaOfCladdingSagRod: 10.0,
      sidewalls: [
        { side: SideWallSide.FRONT, wallType: TypeOfWall.PANEL, thickness: 0.5, height: 3.0 },
        { side: SideWallSide.BACK, wallType: TypeOfWall.BRICK, thickness: 230.0, height: 3.5 },
        { side: SideWallSide.RIGHT, wallType: TypeOfWall.PANEL, thickness: 0.5, height: 3.0 },
        { side: SideWallSide.LEFT, wallType: TypeOfWall.PANEL, thickness: 0.5, height: 3.0 },
      ],
    },
    {
      jobId: 'seed_job_2',
      // Core dimensions only
      buildingOverallLength: 30.0, buildingOverallWidth: 18.0, eaveHeight: 7.0, roofSlope: 8.0,
      mainRoofFrames: 6, endRoofFrames: 2, roofPurlinSpacing: 1.2, claddingPurlins: 5,
      internalColumnsForMainRoofFrames: 0, internalColumnsForEndRoofFrames: 0,
      roofFrameBaseFixing: RoofFrameBaseFixing.ANCHOR_BOLT,
      sidewalls: [
        { side: SideWallSide.FRONT, wallType: TypeOfWall.BRICK, thickness: 230.0, height: 4.0 },
        { side: SideWallSide.BACK, wallType: TypeOfWall.BRICK, thickness: 230.0, height: 4.0 },
      ],
    },
    {
      jobId: 'seed_job_3',
      // Core + purlin + covering
      buildingOverallLength: 60.0, buildingOverallWidth: 30.0, eaveHeight: 9.0, roofSlope: 6.0,
      mainRoofFrames: 8, endRoofFrames: 2, roofPurlinSpacing: 1.4, claddingPurlins: 7,
      internalColumnsForMainRoofFrames: 2, internalColumnsForEndRoofFrames: 1,
      roofFrameBaseFixing: RoofFrameBaseFixing.JOINT_BOLT_ON_STEEL_COLUMN,
      roofPurlinType: PurlinMaterialType.TUBE, roofPurlinDepth: 180.0, roofPurlinUnitWeight: 8.2,
      claddingPurlinType: PurlinMaterialType.Z_C, claddingPurlinDepth: 150.0, claddingPurlinUnitWeight: 5.5,
      roofCoveringType: CoveringType.PUFF_SHEET, roofCoveringThickness: 40.0,
      claddingCoveringType: CoveringType.PPGL, claddingCoveringThickness: 0.5,
      gradeOfPlateMaterial: PlateMaterialGrade.FE_250,
      materialConsumptionExcludingPurlin: 15.2, DiaOfRoofSagRod: 10.0, DiaOfCladdingSagRod: 8.0,
      sidewalls: [
        { side: SideWallSide.FRONT, wallType: TypeOfWall.AAC, thickness: 200.0, height: 3.0 },
        { side: SideWallSide.BACK, wallType: TypeOfWall.AAC, thickness: 200.0, height: 3.0 },
        { side: SideWallSide.RIGHT, wallType: TypeOfWall.BLOCK, thickness: 150.0, height: 3.0 },
        { side: SideWallSide.LEFT, wallType: TypeOfWall.LATERITE, thickness: 300.0, height: 3.5 },
      ],
    },
    {
      jobId: 'seed_job_4',
      // Core + wind bracing + polycarbonate
      buildingOverallLength: 24.0, buildingOverallWidth: 15.0, eaveHeight: 6.0, roofSlope: 10.0,
      mainRoofFrames: 5, endRoofFrames: 2, roofPurlinSpacing: 1.2, claddingPurlins: 4,
      internalColumnsForMainRoofFrames: 0, internalColumnsForEndRoofFrames: 0,
      roofFrameBaseFixing: RoofFrameBaseFixing.FOUNDATION_BOLT,
      roofWindBracingSegmentsInOneHalf: 1, columnWindBracingSegments: 1,
      roofWindBracingProvidedBays: 2, columnWindBracingProvidedBays: 2,
      windBracingColumnHeight: 6.0, windBracingUnitWeight: 2.8,
      roofWindBracingBaySpacing: 6.0, columnWindBracingBaySpacing: 6.0,
      roofWindBracingLength: 7.0, columnWindBracingLength: 5.5, windBracingType: TypeOfWindBracing.TUBE,
      polycarbonateRoofLength: 2.4, polycarbonateRoofWidth: 1.0, polycarbonateRoofCount: 6,
      sidewalls: [
        { side: SideWallSide.FRONT, wallType: TypeOfWall.PANEL, thickness: 50.0, height: 2.5 },
      ],
    },
    {
      jobId: 'seed_job_5',
      // Core + side extension + fascia board
      buildingOverallLength: 80.0, buildingOverallWidth: 40.0, eaveHeight: 12.0, roofSlope: 5.0,
      mainRoofFrames: 12, endRoofFrames: 2, roofPurlinSpacing: 1.6, claddingPurlins: 10,
      internalColumnsForMainRoofFrames: 1, internalColumnsForEndRoofFrames: 0,
      roofFrameBaseFixing: RoofFrameBaseFixing.ANCHOR_BOLT,
      fasciaBoardArea: 60.0, fasciaMaterialWeightPerSqft: 3.0,
      roofExtensionWidthHeight: 4.0, roofExtensionMidFrameCount: 10, roofExtensionEndFrameCount: 2,
      claddingExtensionWidthHeight: 3.5, claddingExtensionMidFrameCount: 10, claddingExtensionEndFrameCount: 2,
      // sideColumnsWidthHeight is derived: eaveHeight − claddingExt × tan(roofSlope°) = 12.0 − 3.5·tan(5°) ≈ 11.694
      sideColumnsWidthHeight: 11.694, sideColumnsMidFrameCount: 10, sideColumnsEndFrameCount: 2,
      gradeOfPlateMaterial: PlateMaterialGrade.FE_400,
      materialConsumptionExcludingPurlin: 21.0, DiaOfRoofSagRod: 12.0, DiaOfCladdingSagRod: 10.0,
      sidewalls: [
        { side: SideWallSide.FRONT, wallType: TypeOfWall.BRICK, thickness: 230.0, height: 4.0 },
        { side: SideWallSide.BACK, wallType: TypeOfWall.BRICK, thickness: 230.0, height: 4.0 },
        { side: SideWallSide.RIGHT, wallType: TypeOfWall.PANEL, thickness: 0.5, height: 3.5 },
      ],
    },
  ]

  for (const { jobId, sidewalls, ...data } of roofs) {
    const sw = sidewalls ?? []
    await prisma.roof.upsert({
      where: { jobId },
      create: { jobId, ...data, sidewalls: { createMany: { data: sw } } },
      update: { ...data, sidewalls: { deleteMany: {}, createMany: { data: sw } } },
    })
  }
  console.log('✓ Roofs & Sidewalls seeded')

  // ── Mezzanines (floors + extensions) ────────────────────────
  const mezzanines = [
    {
      jobId: 'seed_job_1',
      // Full: multiple floors + extensions
      floors: [
        {
          code: 'MZ-1', floor: MezzanineFloorLevel.FLOOR_1, type: MezzanineType.DECK_SHEET,
          heightFrom: MezzanineHeightFrom.GROUND,
          thicknessMm: 150.0, lengthM: 36.0, widthM: 18.0, heightM: 4.5, materialConsumptionKgPerSqft: 12.5,
          beamsMidPrimary: 6, beamsEndPrimary: 2, beamsSecondary: 14,
          jointsMidPrimary: 4, jointsEndPrimary: 2,
          internalColumnsMidPrimary: 3, internalColumnsEndPrimary: 1,
        },
        {
          code: 'MZ-2', floor: MezzanineFloorLevel.FLOOR_2, type: MezzanineType.RCC_SLAB,
          heightFrom: MezzanineHeightFrom.FIRST_FLOOR,
          thicknessMm: 175.0, lengthM: 36.0, widthM: 18.0, heightM: 4.0, materialConsumptionKgPerSqft: 14.0,
          beamsMidPrimary: 6, beamsEndPrimary: 2, beamsSecondary: 16,
          jointsMidPrimary: 4, jointsEndPrimary: 2,
          internalColumnsMidPrimary: 3, internalColumnsEndPrimary: 1,
        },
      ],
      extensions: [
        {
          type: MezzanineType.FOLDED_PLATE, heightFrom: MezzanineHeightFrom.GROUND,
          typicalTo: MezzanineFloorLevel.FLOOR_2,
          thicknessMm: 120.0, lengthM: 12.0, widthM: 6.0, heightM: 4.5,
          beamsMidPrimary: 2, beamsEndPrimary: 1, beamsSecondary: 5,
          jointsMidPrimary: 2, jointsEndPrimary: 1,
          extendedColumnsMidPrimary: 2, extendedColumnsEndPrimary: 1,
        },
      ],
    },
    {
      jobId: 'seed_job_3',
      // Floors only, no extensions
      floors: [
        {
          code: 'MZ-1', floor: MezzanineFloorLevel.FLOOR_1, type: MezzanineType.PANEL,
          heightFrom: MezzanineHeightFrom.GROUND,
          thicknessMm: 100.0, lengthM: 30.0, widthM: 15.0, heightM: 4.0, materialConsumptionKgPerSqft: 10.0,
          beamsMidPrimary: 5, beamsEndPrimary: 2, beamsSecondary: 10,
          jointsMidPrimary: 3, jointsEndPrimary: 2,
          internalColumnsMidPrimary: 2, internalColumnsEndPrimary: 1,
        },
      ],
    },
    {
      jobId: 'seed_job_5',
      // Minimal: single floor, required fields only
      floors: [
        {
          code: 'MZ-1', floor: MezzanineFloorLevel.FLOOR_1, type: MezzanineType.BOARD,
          heightFrom: MezzanineHeightFrom.GROUND,
          thicknessMm: 80.0, lengthM: 40.0, widthM: 20.0, heightM: 5.0, materialConsumptionKgPerSqft: 8.0,
          beamsMidPrimary: 4, beamsEndPrimary: 2, beamsSecondary: 8,
          jointsMidPrimary: 2, jointsEndPrimary: 1,
          internalColumnsMidPrimary: 1, internalColumnsEndPrimary: 0,
        },
      ],
    },
  ]

  for (const { jobId, floors = [], extensions = [] } of mezzanines) {
    await prisma.mezzanine.upsert({
      where: { jobId },
      create: { jobId, floors: { createMany: { data: floors } }, extensions: { createMany: { data: extensions } } },
      update: {
        floors: { deleteMany: {}, createMany: { data: floors } },
        extensions: { deleteMany: {}, createMany: { data: extensions } },
      },
    })
  }
  console.log('✓ Mezzanines seeded')

  // ── Canopies (canopy items) ─────────────────────────────────
  const canopies = [
    {
      jobId: 'seed_job_1',
      // Full: multiple items + all optional sections
      canopies: [
        {
          code: 'CANOPY-1', heightFrom: CanopyHeightFrom.GROUND,
          length: 6.0, width: 3.0, height: 3.5, materialConsumptionKgPerSqft: 9.5,
          numberOfBeams: 4, numberOfPurlins: 6, purlinDepth: 150.0, unitWeightOfPurlin: 5.2,
          canopySheet: CanopySheetType.PPGL, sheetThick: 0.5, canopySideCoveringHeight: 1.2,
          gutter: YesNo.YES, downTake: YesNo.YES, flashing: YesNo.YES,
        },
        {
          code: 'CANOPY-2', heightFrom: CanopyHeightFrom.FF,
          length: 4.5, width: 2.5, height: 3.0, materialConsumptionKgPerSqft: 8.0,
          numberOfBeams: 3, numberOfPurlins: 5, purlinDepth: 120.0, unitWeightOfPurlin: 4.5,
          canopySheet: CanopySheetType.PUFF, sheetThick: 40.0, canopySideCoveringHeight: 1.0,
          gutter: YesNo.YES, downTake: YesNo.NO, flashing: YesNo.YES,
        },
      ],
    },
    {
      jobId: 'seed_job_3',
      // Mid: dimensions + members + covering, no accessories
      canopies: [
        {
          code: 'CANOPY-1', heightFrom: CanopyHeightFrom.SF,
          length: 5.0, width: 2.8, height: 3.2, materialConsumptionKgPerSqft: 8.5,
          numberOfBeams: 3, numberOfPurlins: 4, purlinDepth: 130.0, unitWeightOfPurlin: 4.8,
          canopySheet: CanopySheetType.NCGL, sheetThick: 0.47,
        },
      ],
    },
    {
      jobId: 'seed_job_5',
      // Minimal: dimensions only
      canopies: [
        {
          code: 'CANOPY-1', heightFrom: CanopyHeightFrom.GROUND,
          length: 3.5, width: 2.0, height: 2.8,
        },
      ],
    },
  ]

  for (const { jobId, canopies: items = [] } of canopies) {
    await prisma.canopy.upsert({
      where: { jobId },
      create: { jobId, canopies: { createMany: { data: items } } },
      update: { canopies: { deleteMany: {}, createMany: { data: items } } },
    })
  }
  console.log('✓ Canopies seeded')

  // ── Stairs (stair items + area deductions) ──────────────────
  const stairs = [
    {
      jobId: 'seed_job_1',
      stairs: [
        {
          code: 'STR-1', typeOfStep: StairStepType.CHQ_PLATE_6MM, location: 'Bay 3 - Main access',
          startingFrom: StairFloorLevel.GROUND, endingUpTo: StairFloorLevel.FIRST_FLOOR,
          length: 4.5, width: 1.2, height: 4.5, numberOfMidLanding: 1,
          typeOfStringer: StairStringerType.HR_SECTION, unitWeightOfStringer: 28.5,
        },
        {
          code: 'STR-2', typeOfStep: StairStepType.TUBE, location: 'Bay 7 - Emergency exit',
          startingFrom: StairFloorLevel.FIRST_FLOOR, endingUpTo: StairFloorLevel.SECOND_FLOOR,
          length: 5.0, width: 1.0, height: 4.0, numberOfMidLanding: 2,
          typeOfStringer: StairStringerType.FAB_SECTION, unitWeightOfStringer: 32.0,
        },
      ],
      areaDeductions: [
        { type: AreaDeductionType.LIFT, location: 'Bay 5 center', areaM2: 6.5, numbers: 1, deductionFor: AreaDeductionFor.BOTH },
        { type: AreaDeductionType.DUCT, location: 'Bay 2 side', areaM2: 2.0, numbers: 2, deductionFor: AreaDeductionFor.STRUCTURE_DEDUCTION },
      ],
    },
    {
      jobId: 'seed_job_2',
      stairs: [
        {
          code: 'STR-1', typeOfStep: StairStepType.CHQ_PLATE_4MM, location: 'Front entrance',
          startingFrom: StairFloorLevel.GROUND, endingUpTo: StairFloorLevel.FIRST_FLOOR,
          length: 3.5, width: 1.0, height: 3.5,
        },
      ],
      areaDeductions: [
        { type: AreaDeductionType.CUT_OUT, location: 'Stair opening', areaM2: 4.2, numbers: 1, deductionFor: AreaDeductionFor.COVERING_DEDUCTION },
      ],
    },
    {
      jobId: 'seed_job_3',
      stairs: [
        {
          code: 'STR-1', typeOfStep: StairStepType.CHQ_PLATE_6MM, location: 'Block A - West',
          startingFrom: StairFloorLevel.GROUND, endingUpTo: StairFloorLevel.FIRST_FLOOR,
          length: 4.0, width: 1.2, height: 4.0, numberOfMidLanding: 1,
          typeOfStringer: StairStringerType.HR_SECTION, unitWeightOfStringer: 26.0,
        },
        {
          code: 'STR-2', typeOfStep: StairStepType.TUBE, location: 'Block A - East',
          startingFrom: StairFloorLevel.GROUND, endingUpTo: StairFloorLevel.SECOND_FLOOR,
          length: 8.0, width: 1.1, height: 8.0, numberOfMidLanding: 3,
          typeOfStringer: StairStringerType.FAB_SECTION, unitWeightOfStringer: 35.0,
        },
      ],
    },
    {
      jobId: 'seed_job_4',
      stairs: [
        {
          code: 'STR-1', length: 3.0, width: 0.9, height: 3.0,
        },
      ],
    },
    {
      jobId: 'seed_job_5',
      stairs: [
        {
          code: 'STR-1', typeOfStep: StairStepType.CHQ_PLATE_6MM, location: 'Mezzanine access - North',
          startingFrom: StairFloorLevel.GROUND, endingUpTo: StairFloorLevel.FIRST_FLOOR,
          length: 5.0, width: 1.2, height: 5.0, numberOfMidLanding: 1,
          typeOfStringer: StairStringerType.HR_SECTION, unitWeightOfStringer: 30.0,
        },
        {
          code: 'STR-2', typeOfStep: StairStepType.CHQ_PLATE_4MM, location: 'Loading dock side',
          startingFrom: StairFloorLevel.GROUND, endingUpTo: StairFloorLevel.FIRST_FLOOR,
          length: 3.8, width: 1.0, height: 5.0,
          typeOfStringer: StairStringerType.HR_SECTION, unitWeightOfStringer: 28.0,
        },
      ],
      areaDeductions: [
        { type: AreaDeductionType.LIFT, location: 'Goods lift bay', areaM2: 9.0, numbers: 1, deductionFor: AreaDeductionFor.BOTH },
      ],
    },
  ]

  for (const { jobId, stairs: items = [], areaDeductions = [] } of stairs) {
    await prisma.stair.upsert({
      where: { jobId },
      create: { jobId, stairs: { createMany: { data: items } }, areaDeductions: { createMany: { data: areaDeductions } } },
      update: {
        stairs: { deleteMany: {}, createMany: { data: items } },
        areaDeductions: { deleteMany: {}, createMany: { data: areaDeductions } },
      },
    })
  }
  console.log('✓ Stairs seeded')

  // ── Loads ───────────────────────────────────────────────────
  const loads = [
    {
      jobId: 'seed_job_1',
      deadLoadOnRoofRafters: 0.15, liveLoadOnRoofRafters: 0.75, collateralLoadOnRoofRafters: 0.10,
      windLoadOnRoofRaftersUpward: 150.0, windLoadHorizontal: 150.0,
      deadLoadOnRoofFloor: 0.20, liveLoadOnRoofFloor: 1.50,
      floorDeadLoad: 3.5, floorFinishLoad: 1.5, floorLiveLoad: 4.0,
      snowLoad: 0.0, earthquakeLoad: 0.10,
      approvalDrawingsTime: 3, approvalDrawingsUnit: ApprovalDrawingsTimeUnit.WEEKS,
      supplyOfMaterialsDays: 45, erectionOfStructureDays: 30,
    },
    {
      jobId: 'seed_job_3',
      deadLoadOnRoofRafters: 0.18, liveLoadOnRoofRafters: 0.75, collateralLoadOnRoofRafters: 0.12,
      windLoadOnRoofRaftersUpward: 140.0, windLoadHorizontal: 140.0,
      deadLoadOnRoofFloor: 0.25, liveLoadOnRoofFloor: 1.50,
      floorDeadLoad: 4.0, floorFinishLoad: 1.5, floorLiveLoad: 5.0,
      snowLoad: 0.0, earthquakeLoad: 0.15,
    },
    {
      jobId: 'seed_job_4',
      deadLoadOnRoofRafters: 0.12, liveLoadOnRoofRafters: 0.75,
      windLoadOnRoofRaftersUpward: 130.0, windLoadHorizontal: 130.0,
      approvalDrawingsTime: 10, approvalDrawingsUnit: ApprovalDrawingsTimeUnit.DAYS,
      supplyOfMaterialsDays: 30, erectionOfStructureDays: 20,
    },
    {
      jobId: 'seed_job_5',
      deadLoadOnRoofRafters: 0.20, liveLoadOnRoofRafters: 0.75,
      windLoadOnRoofRaftersUpward: 155.0,
    },
  ]

  for (const { jobId, ...data } of loads) {
    await prisma.load.upsert({
      where: { jobId },
      create: { jobId, ...data },
      update: data,
    })
  }
  console.log('✓ Loads seeded')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
