export interface UserInfo {
  name: string
  sex: number
  phone: string
  birthPlace: string
  nation: string
  zzmm: string
  email: string
  birthday: string
  idnum: string
  married: string
  nativePlace: string
  address: string
  specialtiesCertificates: string
}

export interface Education {
  id: number
  school: string
  graduationTime: string
  degree: number
  education: number
  specialty: string
}

export interface WorkExperience {
  id: number
  company: string
  work_time_start: string
  work_time_end: string
  position: string
}

export interface Paper {
  id: number
  journal: string
  title: string
  time: string
  journal_num: string
}

export interface Project {
  type: number
  id: number
  time: string
  title: string
  level: string
  rank: string
}

export interface Research {
  id: number
  name: string
}

export interface FamilyConnections {
  name: string
  connection: string
  work: string
}

export interface FormDataPartA {
  info: UserInfo
  code: string
  recruitId: number
  education: Education[]
  workExperience: WorkExperience[]
}

export interface FormDataPartB {
  paper: Paper[]
  project: Project[]
}

export interface FormDataPartC {
  research: Research[]
  awardsAndPunishments: string
  family: FamilyConnections[]
  note: string
}

export type SubmitDataRequest = ApiResponseData<null>
