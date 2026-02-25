export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string
          created_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          id: string
          session_id: string
          game_number: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          game_number: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          game_number?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'games_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          },
        ]
      }
      results: {
        Row: {
          id: string
          game_id: string
          player_id: string
          position: number
          points: number
        }
        Insert: {
          id?: string
          game_id: string
          player_id: string
          position: number
          points: number
        }
        Update: {
          id?: string
          game_id?: string
          player_id?: string
          position?: number
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: 'results_game_id_fkey'
            columns: ['game_id']
            isOneToOne: false
            referencedRelation: 'games'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'results_player_id_fkey'
            columns: ['player_id']
            isOneToOne: false
            referencedRelation: 'players'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          player_id: string
          name: string
          emoji: string
          total_points: number
          games_played: number
          sessions_attended: number
          wins: number
          avg_position: number
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
