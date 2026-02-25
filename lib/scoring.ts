export const POINTS_MAP: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
}

export function getPoints(position: number): number {
  return POINTS_MAP[position] ?? 0
}

export function getPositionLabel(position: number): string {
  const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' }
  return `${position}${suffixes[position] || 'th'}`
}
