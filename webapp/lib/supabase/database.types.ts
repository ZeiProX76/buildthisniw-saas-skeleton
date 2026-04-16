export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          created_at: string | null
          expires_at: string
          fixture_id: string
          id: string
          language: string
          plan_tier: string
          probabilities: Json
          scenarios: Json
          stats: Json
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          fixture_id: string
          id?: string
          language?: string
          plan_tier: string
          probabilities?: Json
          scenarios?: Json
          stats?: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          fixture_id?: string
          id?: string
          language?: string
          plan_tier?: string
          probabilities?: Json
          scenarios?: Json
          stats?: Json
        }
        Relationships: [
          {
            foreignKeyName: "analyses_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_user: {
        Row: {
          analysis_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          analysis_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          analysis_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_user_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          analysis_id: string
          content: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          analysis_id: string
          content: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          analysis_id?: string
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      fixtures: {
        Row: {
          api_id: number
          away_score: number | null
          away_team_id: string
          created_at: string | null
          home_score: number | null
          home_team_id: string
          id: string
          league_id: string
          match_date: string
          referee: string | null
          round: string | null
          season: number | null
          status: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          api_id: number
          away_score?: number | null
          away_team_id: string
          created_at?: string | null
          home_score?: number | null
          home_team_id: string
          id?: string
          league_id: string
          match_date: string
          referee?: string | null
          round?: string | null
          season?: number | null
          status?: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          api_id?: number
          away_score?: number | null
          away_team_id?: string
          created_at?: string | null
          home_score?: number | null
          home_team_id?: string
          id?: string
          league_id?: string
          match_date?: string
          referee?: string | null
          round?: string | null
          season?: number | null
          status?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          architecture_summary: string | null
          category: string | null
          competition_count: number | null
          competition_level: string | null
          competition_score: number | null
          created_at: string
          difficulty: number | null
          estimated_build_hours: number | null
          features: Json
          id: string
          market_gap: string | null
          money_potential: number | null
          name: string
          pricing_hook: string | null
          proof_signals: Json | null
          published_at: string | null
          slug: string
          status: string
          tagline: string | null
          tam: string | null
          target_audience: string | null
          tech_stack: Json
          trend: string | null
          trend_description: string | null
          updated_at: string
        }
        Insert: {
          architecture_summary?: string | null
          category?: string | null
          competition_count?: number | null
          competition_level?: string | null
          competition_score?: number | null
          created_at?: string
          difficulty?: number | null
          estimated_build_hours?: number | null
          features?: Json
          id?: string
          market_gap?: string | null
          money_potential?: number | null
          name: string
          pricing_hook?: string | null
          proof_signals?: Json | null
          published_at?: string | null
          slug: string
          status?: string
          tagline?: string | null
          tam?: string | null
          target_audience?: string | null
          tech_stack?: Json
          trend?: string | null
          trend_description?: string | null
          updated_at?: string
        }
        Update: {
          architecture_summary?: string | null
          category?: string | null
          competition_count?: number | null
          competition_level?: string | null
          competition_score?: number | null
          created_at?: string
          difficulty?: number | null
          estimated_build_hours?: number | null
          features?: Json
          id?: string
          market_gap?: string | null
          money_potential?: number | null
          name?: string
          pricing_hook?: string | null
          proof_signals?: Json | null
          published_at?: string | null
          slug?: string
          status?: string
          tagline?: string | null
          tam?: string | null
          target_audience?: string | null
          tech_stack?: Json
          trend?: string | null
          trend_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kit_purchases: {
        Row: {
          created_at: string
          id: string
          kit_slug: string
          purchased_at: string
          stripe_checkout_session_id: string | null
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kit_slug: string
          purchased_at?: string
          stripe_checkout_session_id?: string | null
          tier: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kit_slug?: string
          purchased_at?: string
          stripe_checkout_session_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      kit_step_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          purchase_id: string
          status: string
          step_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          purchase_id: string
          status?: string
          step_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          purchase_id?: string
          status?: string
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kit_step_progress_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "kit_purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kit_step_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "kit_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_steps: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          idea_id: string
          prompt_content: string | null
          step_number: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          idea_id: string
          prompt_content?: string | null
          step_number: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          idea_id?: string
          prompt_content?: string | null
          step_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "kit_steps_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      league_seasons: {
        Row: {
          coverage: Json
          created_at: string
          current: boolean
          end_date: string | null
          id: string
          league_id: number
          start_date: string | null
          updated_at: string
          year: number
        }
        Insert: {
          coverage?: Json
          created_at?: string
          current?: boolean
          end_date?: string | null
          id?: string
          league_id: number
          start_date?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          coverage?: Json
          created_at?: string
          current?: boolean
          end_date?: string | null
          id?: string
          league_id?: number
          start_date?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["api_id"]
          },
        ]
      }
      league_teams: {
        Row: {
          created_at: string
          league_id: number
          season: number
          team_id: number
        }
        Insert: {
          created_at?: string
          league_id: number
          season: number
          team_id: number
        }
        Update: {
          created_at?: string
          league_id?: number
          season?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "league_teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["api_id"]
          },
          {
            foreignKeyName: "league_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["api_id"]
          },
        ]
      }
      leagues: {
        Row: {
          api_id: number
          country: string
          country_code: string | null
          country_flag: string | null
          created_at: string | null
          current_season: number | null
          id: string
          logo_url: string | null
          name: string
          season: number
          type: string | null
          updated_at: string | null
        }
        Insert: {
          api_id: number
          country: string
          country_code?: string | null
          country_flag?: string | null
          created_at?: string | null
          current_season?: number | null
          id?: string
          logo_url?: string | null
          name: string
          season: number
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          api_id?: number
          country?: string
          country_code?: string | null
          country_flag?: string | null
          created_at?: string | null
          current_season?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          season?: number
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      player_stats: {
        Row: {
          appearances: number | null
          assists: number | null
          blocks: number | null
          captain: boolean | null
          created_at: string
          dribbles_attempts: number | null
          dribbles_success: number | null
          duels_total: number | null
          duels_won: number | null
          fouls_committed: number | null
          fouls_drawn: number | null
          goals: number | null
          id: string
          interceptions: number | null
          league_id: number
          lineups: number | null
          minutes: number | null
          passes_accuracy: number | null
          passes_key: number | null
          passes_total: number | null
          penalty_missed: number | null
          penalty_saved: number | null
          penalty_scored: number | null
          player_id: number
          position: string | null
          red_cards: number | null
          season: number
          shots_on_target: number | null
          shots_total: number | null
          tackles_total: number | null
          team_id: number
          updated_at: string
          yellow_cards: number | null
        }
        Insert: {
          appearances?: number | null
          assists?: number | null
          blocks?: number | null
          captain?: boolean | null
          created_at?: string
          dribbles_attempts?: number | null
          dribbles_success?: number | null
          duels_total?: number | null
          duels_won?: number | null
          fouls_committed?: number | null
          fouls_drawn?: number | null
          goals?: number | null
          id?: string
          interceptions?: number | null
          league_id: number
          lineups?: number | null
          minutes?: number | null
          passes_accuracy?: number | null
          passes_key?: number | null
          passes_total?: number | null
          penalty_missed?: number | null
          penalty_saved?: number | null
          penalty_scored?: number | null
          player_id: number
          position?: string | null
          red_cards?: number | null
          season: number
          shots_on_target?: number | null
          shots_total?: number | null
          tackles_total?: number | null
          team_id: number
          updated_at?: string
          yellow_cards?: number | null
        }
        Update: {
          appearances?: number | null
          assists?: number | null
          blocks?: number | null
          captain?: boolean | null
          created_at?: string
          dribbles_attempts?: number | null
          dribbles_success?: number | null
          duels_total?: number | null
          duels_won?: number | null
          fouls_committed?: number | null
          fouls_drawn?: number | null
          goals?: number | null
          id?: string
          interceptions?: number | null
          league_id?: number
          lineups?: number | null
          minutes?: number | null
          passes_accuracy?: number | null
          passes_key?: number | null
          passes_total?: number | null
          penalty_missed?: number | null
          penalty_saved?: number | null
          penalty_scored?: number | null
          player_id?: number
          position?: string | null
          red_cards?: number | null
          season?: number
          shots_on_target?: number | null
          shots_total?: number | null
          tackles_total?: number | null
          team_id?: number
          updated_at?: string
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["api_id"]
          },
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["api_id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["api_id"]
          },
        ]
      }
      players: {
        Row: {
          age: number | null
          api_id: number
          created_at: string
          firstname: string | null
          height: string | null
          lastname: string | null
          name: string
          nationality: string | null
          photo: string | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          age?: number | null
          api_id: number
          created_at?: string
          firstname?: string | null
          height?: string | null
          lastname?: string | null
          name: string
          nationality?: string | null
          photo?: string | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          age?: number | null
          api_id?: number
          created_at?: string
          firstname?: string | null
          height?: string | null
          lastname?: string | null
          name?: string
          nationality?: string | null
          photo?: string | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          favorite_team_id: number | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          preference_experience: string | null
          preference_interest: string | null
          preference_motivation: string | null
          preferred_language: string
          stripe_customer_id: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          favorite_team_id?: number | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          preference_experience?: string | null
          preference_interest?: string | null
          preference_motivation?: string | null
          preferred_language?: string
          stripe_customer_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          favorite_team_id?: number | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          preference_experience?: string | null
          preference_interest?: string | null
          preference_motivation?: string | null
          preferred_language?: string
          stripe_customer_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_favorite_team"
            columns: ["favorite_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["api_id"]
          },
        ]
      }
      standings: {
        Row: {
          away_drawn: number | null
          away_goals_against: number | null
          away_goals_for: number | null
          away_lost: number | null
          away_played: number | null
          away_won: number | null
          created_at: string
          description: string | null
          drawn: number
          form: string | null
          goals_against: number
          goals_diff: number
          goals_for: number
          group_name: string | null
          home_drawn: number | null
          home_goals_against: number | null
          home_goals_for: number | null
          home_lost: number | null
          home_played: number | null
          home_won: number | null
          id: string
          league_id: number
          lost: number
          played: number
          points: number
          rank: number
          season: number
          team_id: number
          updated_at: string
          won: number
        }
        Insert: {
          away_drawn?: number | null
          away_goals_against?: number | null
          away_goals_for?: number | null
          away_lost?: number | null
          away_played?: number | null
          away_won?: number | null
          created_at?: string
          description?: string | null
          drawn?: number
          form?: string | null
          goals_against?: number
          goals_diff?: number
          goals_for?: number
          group_name?: string | null
          home_drawn?: number | null
          home_goals_against?: number | null
          home_goals_for?: number | null
          home_lost?: number | null
          home_played?: number | null
          home_won?: number | null
          id?: string
          league_id: number
          lost?: number
          played?: number
          points?: number
          rank: number
          season: number
          team_id: number
          updated_at?: string
          won?: number
        }
        Update: {
          away_drawn?: number | null
          away_goals_against?: number | null
          away_goals_for?: number | null
          away_lost?: number | null
          away_played?: number | null
          away_won?: number | null
          created_at?: string
          description?: string | null
          drawn?: number
          form?: string | null
          goals_against?: number
          goals_diff?: number
          goals_for?: number
          group_name?: string | null
          home_drawn?: number | null
          home_goals_against?: number | null
          home_goals_for?: number | null
          home_lost?: number | null
          home_played?: number | null
          home_won?: number | null
          id?: string
          league_id?: number
          lost?: number
          played?: number
          points?: number
          rank?: number
          season?: number
          team_id?: number
          updated_at?: string
          won?: number
        }
        Relationships: [
          {
            foreignKeyName: "standings_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["api_id"]
          },
          {
            foreignKeyName: "standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["api_id"]
          },
        ]
      }
      swarm_waitlist: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          api_id: number
          code: string | null
          country: string | null
          created_at: string | null
          founded: number | null
          id: string
          logo_url: string | null
          name: string
          national: boolean | null
          updated_at: string | null
          venue_capacity: number | null
          venue_city: string | null
          venue_name: string | null
        }
        Insert: {
          api_id: number
          code?: string | null
          country?: string | null
          created_at?: string | null
          founded?: number | null
          id?: string
          logo_url?: string | null
          name: string
          national?: boolean | null
          updated_at?: string | null
          venue_capacity?: number | null
          venue_city?: string | null
          venue_name?: string | null
        }
        Update: {
          api_id?: number
          code?: string | null
          country?: string | null
          created_at?: string | null
          founded?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          national?: boolean | null
          updated_at?: string | null
          venue_capacity?: number | null
          venue_city?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      top_players: {
        Row: {
          created_at: string
          id: string
          league_id: number
          player_api_id: number
          season: number
          stats: Json
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          league_id: number
          player_api_id: number
          season: number
          stats?: Json
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          league_id?: number
          player_api_id?: number
          season?: number
          stats?: Json
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "top_players_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["api_id"]
          },
        ]
      }
      user_idea_reactions: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          reaction: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          reaction: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          reaction?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_idea_reactions_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _stripe_resolve_customer_id: {
        Args: { p_user_id: string }
        Returns: string
      }
      admin_get_recent_activity: { Args: { p_limit?: number }; Returns: Json }
      admin_get_subscriber_list: {
        Args: { p_limit?: number; p_page?: number; p_status?: string }
        Returns: Json
      }
      consume_credits:
        | {
            Args: { p_cost: number; p_credit_type: string; p_user_id: string }
            Returns: Json
          }
        | {
            Args: {
              p_allocation: number
              p_cost: number
              p_credit_type: string
              p_period: string
              p_user_id: string
            }
            Returns: Json
          }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_build_summaries: {
        Args: { p_user_id: string }
        Returns: {
          completed_steps: number
          current_step_number: number
          current_step_title: string
          idea_name: string
          idea_slug: string
          idea_status: string
          kit_slug: string
          last_activity: string
          purchase_id: string
          purchased_at: string
          tier: string
          total_steps: number
        }[]
      }
      get_idea_reaction_counts: {
        Args: { p_idea_id: string }
        Returns: {
          interested_count: number
          not_interested_count: number
        }[]
      }
      get_kit_purchase_tier: {
        Args: { p_kit_slug: string; p_user_id: string }
        Returns: string
      }
      get_my_subscription: { Args: never; Returns: Json }
      is_room_member: { Args: { p_room_id: string }; Returns: boolean }
      list_active_products: { Args: never; Returns: Json }
      process_notification_queue: { Args: never; Returns: undefined }
      refund_credits: {
        Args: { p_amount: number; p_credit_type: string; p_user_id: string }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      plan_type: "free" | "starter" | "pro" | "lifetime"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      plan_type: ["free", "starter", "pro", "lifetime"],
    },
  },
} as const
