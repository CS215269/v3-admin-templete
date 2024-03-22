/** 将学位转换成汉字 */
export const getDegree = (arg: number) => {
  switch (arg) {
    case 0:
      return "暂无"
    case 1:
      return "学士"
    case 2:
      return "硕士"
    case 3:
      return "博士"

    default:
      return "异常"
  }
}

/** 将学历转换成汉字 */
export const getEducation = (arg: number) => {
  switch (arg) {
    case 0:
      return "专科"
    case 1:
      return "本科"
    case 2:
      return "研究生"

    default:
      return "异常"
  }
}
/** 将学位转换成汉字 */
export const setDegree = (arg: string) => {
  switch (arg) {
    case "暂无":
      return 0
    case "学士":
      return 1
    case "硕士":
      return 2
    case "博士":
      return 3

    default:
      return -1
  }
}

/** 将学历转换成汉字 */
export const setEducation = (arg: string) => {
  switch (arg) {
    case "专科":
      return 0
    case "本科":
      return 1
    case "研究生":
      return 2

    default:
      return -1
  }
}
