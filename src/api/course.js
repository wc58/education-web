// 模板提供的axios封装
import request from '@/utils/request'
import effectRipple from '../components/ImageCropper/utils/effectRipple'

const path = '/service/course'

export default {
  //保存
  saveCourse(course) {
    return request({
      url: `${path}`,
      method: 'post',
      data: course
    })
  },
  //根据id获得
  getCourseById(courseId) {
    return request({
      url: `${path}/${courseId}`,
      method: 'get'
    })
  },
  //分页条件查询
  getCoursePageList(page, limit, searchobj) {
    return request({
      url: `${path}/${page}/${limit}`,
      method: 'post',
      data: searchobj
    })
  },
  //查询所有
  getCourseList() {
    return request({
      url: `${path}`,
      method: 'get'
    })
  },
  //根据id删除
  removeCourseById(id) {
    return request({
      url: `${path}/${id}`,
      method:'delete'
    })
  }

}

