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
