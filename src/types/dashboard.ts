import { AnnouncementDashboard, EventType } from "./index"

export type DashboardData = {
  eventNormal: EventType[]
  eventVote: EventType[]
  announcement: AnnouncementDashboard[]
}
