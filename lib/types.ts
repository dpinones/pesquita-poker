export type LeaderboardEntry = {
  player_id: string
  name: string
  emoji: string
  total_points: number
  games_played: number
  sessions_attended: number
  wins: number
  avg_position: number
}

export type Player = {
  id: string
  name: string
  emoji: string
  created_at: string
}

export type Session = {
  id: string
  date: string
  notes: string | null
  created_at: string
}

export type Game = {
  id: string
  session_id: string
  game_number: number
  created_at: string
}

export type Result = {
  id: string
  game_id: string
  player_id: string
  position: number
  points: number
}

export type GameWithResults = Game & {
  results: (Result & { player: Player })[]
}

export type SessionWithGames = Session & {
  games: GameWithResults[]
}
