import { prisma } from '../lib/prisma.js'
import {
  SideWallSide,
  TypeOfWall,
  PurlinMaterialType,
  TypeOfWindBracing,
  CoveringType,
  RoofFrameBaseFixing,
  PlateMaterialGrade,
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
      sideColumnsWidthHeight: 3.0, sideColumnsMidFrameCount: 8, sideColumnsEndFrameCount: 2,
      gradeOfPlateMaterial: PlateMaterialGrade.FE_345,
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
      sideColumnsWidthHeight: 4.0, sideColumnsMidFrameCount: 10, sideColumnsEndFrameCount: 2,
      gradeOfPlateMaterial: PlateMaterialGrade.FE_400,
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
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
