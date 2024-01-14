export type EventType = {
  id: string
  name: string
  description: string
  eventVoteType: string
  eventDate: Date
  imageUrl: string | undefined
  createdDate: string
  updatedDate: string
}

export type EventData = {
  id: string
  name: string | undefined
  description: string | undefined
  eventVoteType: string
  eventDate: Date
  imageUrl: string
}

export type EventVoteDetail = {
  id: string
  name: string
  description: string
  eventVoteType: string
  eventDate: Date
  imageUrl: string | undefined
  createdDate: string
  updatedDate: string
  totalAgree: number
  totalDisagree: number
  percentageAgree: string
  percentageDisagree: string
  totalStudent: number
  event_votes: AllVoteEventVote[]
}

export type AllVoteEventVote = {
  id: string
  eventId: string
  isAgree: string
  parentId: string
}
