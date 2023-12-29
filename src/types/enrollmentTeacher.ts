import { Option } from "./index"
export type EnrollmentTeacherType = {
  id: string
  academicYearId: string
  academicYear: string
  classId: string
  className: string
  courseId?: string | undefined
  courseName?: string | undefined
  status: string
  teacherType: string
}

export type EnrollmentTeacherTeacherType = {
  HOMEROOM: string
  NORMAL: string
}

export type InitialTeacherEnrollData = {
  classId: string,
  className: string,
  courseLabel?: string | undefined,
  courseValue?: string | undefined,
  isSupportEnroll: boolean
}

export type InitialTeacherData = {
  classes: Option[],
  enroll_data: InitialTeacherEnrollData[]
}
