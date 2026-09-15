export interface Result {
  contests: Contest[]
  filters: {
    level: string
    region?: string
    province?: string
    municipality?: string
    barangay?: string
    precinct?: string
  }
  level: string
}

export interface Contest {
  candidates: Candidate[]
  category: string
  code: string
  name: string
  totalVotes: number
  totals: {
    votesCast: number
    overVotes: number
    underVotes: number
  }
}

export interface Candidate {
  name: string
  party: string
  votes: number
}
