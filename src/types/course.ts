export type CourseList = {
  id: string
  name: string
  courseIdentifier: string
  grade: number
  curriculumId: string
  curriculumName: string
}

export type CourseSectionList = {
  id: string
  courseId: string
  numberSection: number
  name: string | undefined
  description: string | undefined
  createdDate: Date,
  updatedDate: Date
}

export type CourseInCourseSection = {
  id: string
  name: string
  grade: number
}

export type ResponseCourseSectionList = {
  course: CourseInCourseSection,
  sections: CourseSectionList
}

export type ModuleList = {
  id: string
  courseSectionId: string
  courseId: string
  numberModule: number
  content: string | undefined
  url?: string | undefined
  type: string
  createdDate: Date,
  updatedDate: Date
}

export type CourseSectionInCourseModule = {
  id: string
  name: string
}

export type ResponseCourseModuleList = {
  course: CourseInCourseSection
  courseSection: CourseSectionInCourseModule
  courseModules: {
    modules: ModuleList[] | []
    supportedMaterials: ModuleList[] | []
  }
}
