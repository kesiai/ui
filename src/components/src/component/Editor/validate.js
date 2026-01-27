
const area = ["11", "12", "13", "14", "15", "21", "22", "23", "31", "32", "33", "34", "35", "36",
  "37", "41", "42", "43", "44", "45", "46", "51", "52", "53", "54", "50", "61", "62", "63", "64", "65", ]
const idcardTest = (idcard) => {
  if( idcard == null || idcard == undefined ) return

  const Errors = [ null, '身份证号码位数不对!', '身份证号码出生日期超出范围或含有非法字符!', '身份证号码校验错误!', '身份证地区非法!' ]

  let Y, JYM, ereg
  let S, M
  let idcard_array = new Array()
  idcard_array = idcard.split('')
  if (area.indexOf(idcard.substr(0, 2)) == -1) return Errors[4]

  switch (idcard.length) {
    case 15:
      if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ //测试出生日期的合法性 
      } else {
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ //测试出生日期的合法性 
      }
      if (ereg.test(idcard)) return Errors[0]
      else return Errors[2]
    case 18:
      if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/ //闰年出生日期的合法性正则表达式 
      } else {
        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/ //平年出生日期的合法性正则表达式 
      }
      if (ereg.test(idcard)) {
        return Errors[0]
      } else {
        return Errors[2]
      }
    default:
      return Errors[1]
  }
}

/**
 * 各个属性生成 schema 表单校验，参照 AJV
 */
const fieldValidate = (value) => {
  let result = {...value}

  if (value.config === '文本') {
    if (value.textContent === 'email') { // 邮箱
      result.vali = '^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$'
      result.valiMsg = _r('请输入正确的邮箱格式')
    } else if (value.textContent === 'tel') { // 电话
      result.vali = '^((([0-9]{3,4}-?)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)[0-9]{9}))$'
      result.valiMsg = _r('请输入正确的电话号')
    } else if (value.textContent === 'mobile') { // 手机号
      result.vali = '^((1(3|4|5|6|7|8|9)[0-9]{9}))$'
      result.valiMsg = _r('请输入正确的手机号')
    } else if (value.textContent === 'identityID') { // 身份证号
      // result.vali = '^([1-6][1-9]|50)\\d{4}(18|19|20)\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$'
      result.valiFun = 'idcardTest'
      result.valiMsg = _r('请输入正确的身份证号')
    } else {
      delete result.vali
      delete result.valiFun
      delete result.valiMsg
      delete result.pattern
    }
    if (value.numRange && value.numRange.split('-').length === 2) { // 字数限制
      if (value.numRange.split('-')[0]) {
        result.minLength = Number(value.numRange.split('-')[0])
      } else {
        delete result.minLength
      }
      if (value.numRange.split('-')[1]) {
        result.maxLength = Number(value.numRange.split('-')[1])
      } else {
        delete result.maxLength
      }
    }
  } else if (value.config === '数字') {
    if (!_.isNull(value.max)) { // 最大值
      result.maximum = value.max
    } else {
      delete result.maximum
    }
    if (!_.isNull(value.min)) { // 最小值
      result.minimum = value.min
    } else {
      delete result.minimum
    }
  } else if (value.config === '选择器') {
    if (value.numRange && value.numRange.split('-').length === 2) { // 可选项数
      if (value.numRange.split('-')[0]) {
        result.minItems = Number(value.numRange.split('-')[0])
      } else {
        delete result.minItems
      }
      if (value.numRange.split('-')[1]) {
        result.maxItems = Number(value.numRange.split('-')[1])
      } else {
        delete result.maxItems
      }
    }
  }
  return result
}

export { idcardTest }

export default fieldValidate