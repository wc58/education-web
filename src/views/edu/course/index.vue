<template>
  <div class="app-container">
    <!--表单查询-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="searchObj.teacherId" placeholder="讲师名">
          <el-option
            v-for="teacher in teachers"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.courseName" placeholder="课堂名"/>
      </el-form-item>
      <el-form-itme>
        <!--<el-select v-model="searchObj.subjectParentId"
                   placeholder="一级分类"
                   @change="getTwoLevelSubject">
          <el-option
            v-for="subject in oneLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>-->
        <el-select v-model="searchObj.subjectId" placeholder="分类">
          <el-option
            v-for="subject in twoLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-itme>
      <el-form-item>
        <el-input v-model="searchObj.price" placeholder="价格"/>
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

      <el-table-column prop="title" label="课程"/>

      <el-table-column prop="teacherName" label="讲师"/>

      <el-table-column prop="subjectName" label="分类"/>

      <el-table-column prop="lessonNum" label="节数" width="160"/>

      <el-table-column prop="price" label="价格" align="center"/>

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
  import course from '@/api/course'
  import subject from '@/api/subject'
  import teacher from '@/api/teacher'

  export default {
    data() {
      return {
        listLoading: true,
        /*分类*/
        page: 1,
        limit: 8,
        total: null,
        subjectParentId: '',
        /*下拉框*/
        teachers: [],
        courses: [],
        oneLevelSubjectList: [],
        twoLevelSubjectList: [],

        searchObj: {
          teacherId: '',
          courseName: '',
          price: '',
          subjectId: ''
        },
        list: null
      }
    },
    created() {
      this.getListCourse()
      this.init()
    },
    methods: {
      //初始化条件下拉框
      init() {
        //查询所有课程信息
        course.getCourseList().then(response => {
          this.courses = response.data.items
        })
        //查询所有讲师信息
        teacher.getTeacherList().then(response => {
          this.teachers = response.data.itmes
        })
        //查询所有分类信息
        subject.getNestedTreeList().then(response => {
          this.oneLevelSubjectList = response.data.items
          let temp = []
          for (let i = 0; i < this.oneLevelSubjectList.length; i++) {
            temp = temp.concat(this.oneLevelSubjectList[i].children)

          }
          this.twoLevelSubjectList = temp
        })
      },
      //分页查询
      getListCourse(page = 1) {
        this.page = page
        this.listLoading = true
        course.getCoursePageList(this.page, this.limit, this.searchObj)
          .then(response => {
            this.list = response.data.items
            this.total = response.data.total
            this.listLoading = false
          })
          .catch(response => {

          })
      },
      //根据一级分类变化查找二级分类
      getTwoLevelSubject: function(oneLevelSubjectId) {
        for (let i = 0; i < this.oneLevelSubjectList.length; i++) {
          let oneLevel = this.oneLevelSubjectList[i]
          if (oneLevel.id === oneLevelSubjectId) {
            this.twoLevelSubjectList = oneLevel.children
            this.searchObj.subjectId = ''
          }
        }
      },
      //清空查询信息
      resetData() {
        this.searchObj = {}
        this.getListCourse()
      },
      removeDataById: function(id) {
        this.$confirm('此操作将会永久删除，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring'
        }).then(() => {
          return course.removeCourseById(id)
        }).then(() => {
          this.getListCourse()
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
      }

    }
  }
</script>
