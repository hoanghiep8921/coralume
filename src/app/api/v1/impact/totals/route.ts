import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ============================================================
// GET — public aggregate impact metrics
// ============================================================

// Estimated constants per SRS
const REEF_AREA_PER_CORAL_M2 = 0.25; // ~0.25 m² per coral fragment
const CO2_PER_CORAL_KG = 2.5; // ~2.5 kg CO₂ absorbed per coral per year (estimated)
const MARINE_LIFE_PER_CORAL = 15; // ~15 marine species supported per coral

export async function GET() {
  try {
    const [totalCorals, totalAdopters, activeAdoptions] = await Promise.all([
      prisma.coral.count({ where: { status: { in: ['assigned', 'growing'] } } }),
      prisma.user.count({ where: { role: { in: ['adopter', 'ambassador'] } } }),
      prisma.adoption.count({ where: { status: { in: ['active'] } } }),
    ]);

    const reefArea = Math.round(totalCorals * REEF_AREA_PER_CORAL_M2 * 10) / 10;
    const co2Absorbed = Math.round(totalCorals * CO2_PER_CORAL_KG);
    const marineLife = totalCorals * MARINE_LIFE_PER_CORAL;

    return NextResponse.json({
      data: {
        totalCorals,
        totalAdopters,
        activeAdoptions,
        reefArea, // m²
        co2Absorbed, // kg
        marineLife, // estimated species
      },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
