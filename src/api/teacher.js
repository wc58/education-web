// 模板提供的axios封装
import request from '@/utils/request'

export default {
  // 条件分页查询
  getTeacherPageList(page, limit, searchobj) {
    return request({
      url: '/edu_service/edu-teacher/moreConditionPageList/' + page + '/' + limit,
      method: 'post',
      data: searchobj
    })
  }
}
