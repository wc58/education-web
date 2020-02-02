<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中……"
      border
      fit
      highlight-current-row
      style="width: 100%">

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{(page-1)*limit + scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" width="180"/>

      <el-table-column
        prop="level"
        label="头衔">
        <template slot-scope="scope">
          {{scope.row.level===1?'高级讲师':'首席讲师'}}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" align="center"/>

      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <touter-link :to="'/edu_service/edu-teacher/updateTeacher'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </touter-link>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import teacher from '@/api/teacher'

  export default {
    data() {
      return {
        listLoading: true,
        page: 1,
        limit: 5,
        searchobj: {},
        total: null,
        list: null
      }
    },
    created() {
      this.getListTeacher()
    },
    methods: {
      getListTeacher(page = 1) {
        this.page = page
        this.listLoading = true
        teacher.getTeacherPageList(this.page, this.limit, this.searchobj)
          .then(response => {
            this.list = response.data.items
            this.total = response.data.total
            this.listLoading = false
          })
          .catch(response => {

          })
      }
    }
  }
</script>
