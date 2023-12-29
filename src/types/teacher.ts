import { EnrolledAcademicYearsTeacherType } from "./academicYear"
export interface ListTeacherTableType {
  id: string,
  fullname: string,
  email: string,
  phone: string,
  status: string,
  createdDate: string,
  name?: string,
  username?: string,
  bornIn?: string,
  bornAt?: Date
}

// export interface ParentTypeListStudentTable {
//   fullname: string,
//   id: string,
//   phone: string | undefined
// }

// export interface EnrollStudentTypeListStudentTable {
//   id: string,
//   className: string
// }

export type FormDataAddTeacher = {
  username: string;
  fullname: string;
  name: string;
  email: string;
  bornIn: string;
  // bornAt: string;
  phone: string | undefined;
};

export type TeacherStatus = {
  ACTIVE: string
  INACTIVE: string
}

export type TeacherDetail = {
  id: string
  fullname: string
  name: string
  email: string
  phone: string | null
  status: string
  createdDate: string
  bornIn: string
  bornAt: Date
  startAt: Date
  endAt: Date | null
  enrolledAcademicYears: EnrolledAcademicYearsTeacherType[] | undefined
}
