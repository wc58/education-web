// 模板提供的axios封装
import request from '@/utils/request'

const path = '/service/course/'

export default {
  saveCourse(course) {
    return request({
      url: `${path}`,
      method: 'post',
      data: course
    })
  },
  getCourseById(courseId) {
    return request({
      url: `${path}/${courseId}`,
      method: 'get',
    })
  },
  //分页条件查询
  getCoursePageList(page, limit, searchobj){
    return request({
      url:`${path}/${page}/${limit}`,
      method:'post',
      data: searchobj
    })
  }

}

