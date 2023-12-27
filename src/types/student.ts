import { EnrollmentStudentDetailPage } from './enrollmentStudent'
export interface ListStudentTableType {
  id: string,
  fullname: string,
  createdDate: string,
  bornIn: string,
  bornAt: string,
  parent: ParentTypeListStudentTable,
  enrollment_student: EnrollStudentTypeListStudentTable | undefined
}

export interface ParentTypeListStudentTable {
  fullname: string,
  id: string,
  phone: string | undefined
}

export interface EnrollStudentTypeListStudentTable {
  id: string,
  className: string
}

export type FormDataAddStudent = {
  student: {
    username: string;
    fullname: string;
    name: string;
    email: string;
    bornIn: string;
    // bornAt: string;
    phone: string | undefined;
    startAcademicYear: string
  },
  parent: {
    username: string;
    fullname: string;
    name: string;
    email: string;
    bornIn: string;
    // bornAt: string;
    phone: string;
    startAcademicYear: string
  }
};

export type DetailStudent = {
  id: string
  fullname: string
  name: string
  email: string
  phone: string | null
  status: string
  createdDate: string
  bornIn: string
  bornAt: string
  startAcademicYear: string
  endAcademicYear: string | null
  parent: {
    id: string
    fullname: string
    name: string
    email: string
    phone: string | null
    createdDate: string
    bornIn: string
    bornAt: string
  }
  enrollment_students: EnrollmentStudentDetailPage[]
}

export type StudentStatus = {
  ACTIVE: string
  GRADUATED: string
  DROPOUT: string
  RESIGN: string
}
