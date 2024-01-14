export type AnnouncementDashboard = {
  id: string 
  title: string 
  body: string
}

export type AnnouncementData = {
  id: string
  title: string | undefined
  body: string | undefined
  createdDate: Date
  updatedDate: Date
}
