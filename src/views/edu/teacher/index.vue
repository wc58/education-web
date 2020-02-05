<template>
  <div class="app-container">
    <!--表单查询-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-input v-model="searchobj.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-itme>
        <el-select v-model="searchobj.level" placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-itme>

      <el-form-item>
        <el-date-picker
          v-model="searchobj.begin"
          type="datetime"
          placeholder="开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchobj.end"
          type="datetime"
          placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getListTeacher(1)">查询</el-button>
      <el-button type="default" @click="resetData">清空</el-button>
    </el-form>
    <!--列表数据-->
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
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页条-->
    <el-pagination
      background
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      :current-page="page"
      :page-size="limit"
      :total="total"
      @current-change="getListTeacher"
    />
  </div>
</template>
<script>
  import teacher from '@/api/teacher'

  export default {
    data() {
      return {
        listLoading: true,
        page: 1,
        limit: 8,
        searchobj: {},
        total: null,
        list: null
      }
    },
    created() {
      this.getListTeacher()
    },
    methods: {
      getListTeacher(page=1) {
        this.page=page
        this.listLoading = true
        teacher.getTeacherPageList(this.page, this.limit, this.searchobj)
          .then(response => {
            this.list = response.data.items
            this.total = response.data.total
            this.listLoading = false
          })
          .catch(response => {

          })
      },
      removeDataById: function(id) {
        this.$confirm('此操作将会永久删除，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring'
        }).then(() => {
          return teacher.removeTeacherById(id)
        }).then(() => {
          this.getListTeacher()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).catch(response => {
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      },
      resetData() {
        this.searchobj = {}
        this.getListTeacher()
      }
    }
  }
</script>
