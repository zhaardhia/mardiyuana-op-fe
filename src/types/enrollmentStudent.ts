import { InitGetAllClass, ActiveAcademicYearType } from "@/types"
export interface EnrollmentStudentDetailPage {
  id: string,
  className: string,
  academicYear: string | undefined,
  academicYearId: string | undefined,
  status: string
}

export type EnrollmentStudentStatus = {
  ACTIVE: string
  GRADUATED: string
  INACTIVE: string
}

export type InitialDataBeforeEnroll = {
  activeAcademicYear: ActiveAcademicYearType
  classes: InitGetAllClass[]
}
