// 模板提供的axios封装
import request from '@/utils/request'

const path = '/edu_service/edu-chapter'

export default {
  //根据CourseId查询
  getChapterById(id) {
    return request({
      url: `${path}/${id}`,
      method: 'get'
    })
  },
  //添加讲师
  saveChapter(chapter) {
    return request({
      url: `${path}`,
      method: 'post',
      data: chapter
    })
  },
  //根据id查询
  getChapter(id){
    return request({
      url:`${path}/getChapter/${id}`,
      method:'get'
    })
  },
  //删除章节
  deleteChapter(id) {
    return request({
      url: `${path}/${id}`,
      method: 'delete'
    })
  },
  // 查询全部
  getTeacherList() {
    return request({
      url: `${path}`,
      method: 'get'
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


  //修改讲师
  updateTeacher(teacher) {
    return request({
      url: `${path}/updateTeacher`,
      method: 'post',
      data: teacher
    })
  }
}
