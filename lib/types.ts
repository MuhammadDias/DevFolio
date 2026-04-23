// lib/types.ts

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
  created_at: string
  updated_at: string
}

export interface PortfolioItem {
  id: string
  user_id: string
  title: string
  description: string | null
  image_url: string | null
  project_url: string | null
  github_url: string | null
  tech_stack: string[] | null
  order_index: number
  is_featured: boolean
  created_at: string
}

export interface Experience {
  id: string
  user_id: string
  company: string
  position: string
  start_date: string | null
  end_date: string | null
  is_current: boolean
  description: string | null
  location: string | null
}

export interface Skill {
  id: string
  user_id: string
  name: string
  category: string | null
  level: number | null
}

export interface PublicPortfolioData {
  profile: Profile
  projects: PortfolioItem[]
  experiences: Experience[]
  skills: Skill[]
}

// Form types (omit server-generated fields)
export type ProfileFormData = Pick<
  Profile,
  'full_name' | 'bio' | 'website' | 'github' | 'linkedin' | 'twitter' | 'avatar_url'
>

export type ProjectFormData = Omit<
  PortfolioItem,
  'id' | 'user_id' | 'created_at'
>

export type ExperienceFormData = Omit<Experience, 'id' | 'user_id'>

export type SkillFormData = Omit<Skill, 'id' | 'user_id'>
