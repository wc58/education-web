import request from '@/utils/request'

const path = '/service/subject'

export default {
  getNestedTreeList() {
    return request({
      url: `${path}`,
      method: 'get'
    })
  },
  deleteNodeById(id) {
    return request({
      url: `${path}/${id}`,
      method: 'delete'
    })
  },
  addNode(node){
    return request({
      url:`${path}`,
      method:'post',
      data: node
    })
  }
}
