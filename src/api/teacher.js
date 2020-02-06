// 模板提供的axios封装
import request from '@/utils/request'

const path = '/edu_service/edu-teacher/'

export default {
  // 条件分页查询
  getTeacherList() {
    return request({
      url: `${path}`,
      method: 'get',
    })
  },
  // 条件分页查询
  getTeacherPageList(page, limit, searchobj) {
    return request({
      url: `${path}/moreConditionPageList/${page}/${limit}`,
      method: 'post',
      data: searchobj
    })
  },
  //删除讲师
  removeTeacherById(id) {
    return request({
      url: `${path}/${id}`,
      method: 'delete'
    })
  },
  //添加讲师
  saveTeacher(teacher) {
    return request({
      url: `${path}/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  //根据id查询
  getTeacherById(id) {
    return request({
      url: `${path}/getTeacherInfo/${id}`,
      method: 'get'
    })
  },
  //修改讲师
  updateTeacher(teacher){
    return request({
      url: `${path}/updateTeacher`,
      method:'post',
      data:teacher
    })
  }
}
