<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form label-width="120px">
        <el-form-item label="课程标题">
          <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>
        <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>
        <!-- 所属分类 TODO -->
        <el-form-item label="课程类别">
          <el-select
            v-model="courseInfo.subjectParentId"
            @change="getTwoLevelSubject"
            placeholder="请选择">
            <el-option
              v-for="subject in oneLevelSubjectList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
          <el-select
            v-model="courseInfo.subjectId"
            @change="getTwoLevelSubject"
            placeholder="请选择">
            <el-option
              v-for="subject in twoLevelSubjectList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
        </el-form-item>
        <!-- 课程讲师 TODO -->

        <el-form-item label="课程讲师 ">
          <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="总课时">
          <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程封面-->
        <el-form-item label="课程封面">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="'http://localhost:9001/edu_service/oss/uploadCover'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
          </el-upload>
        </el-form-item>

        <el-form-item label="课程价格">
          <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
          元
        </el-form-item>
        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </div>
</template>
<script>
  import course from '@/api/course'
  import teacher from '@/api/teacher'
  import subject from '@/api/subject'
  import Tinymce from '@/components/Tinymce'

  export default {
    components: { Tinymce },
    data() {
      return {
        BASE_API: process.env.BABEL_ENV,
        saveBtnDisabled: false,
        teacherList: [],
        oneLevelSubjectList: [],
        twoLevelSubjectList: [],
        courseInfo: {
          id: '',
          title: '',
          description: '',
          lessonNum: 0,
          price: 0,
          subjectId: '',
          subjectParentId: '',
          teacherId: '',
          cover: 'https://eduction.oss-cn-beijing.aliyuncs.com/avatar/2020/02/04/d6a6f95b-ae2c-411b-81a4-2b6eafc28dd6file.png'
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        //获得ID并查询课程信息
        this.courseInfo.id = this.$route.params.id
        if (this.courseInfo.id) {
          course.getCourseById(this.courseInfo.id)
            .then(response => {
              this.courseInfo = response.data.item
            })
        }

        //获得下拉分类列表
        subject.getNestedTreeList()
          .then(response => {
            this.oneLevelSubjectList = response.data.items
            for (let i = 0; i < this.oneLevelSubjectList.length; i++) {
              let oneLevel = this.oneLevelSubjectList[i]
              let twoLevel = this.oneLevelSubjectList[i].children
              for (let j = 0; j < twoLevel.length; j++) {
                let two = twoLevel[j]
                if (two.id === this.courseInfo.subjectId) {
                  this.courseInfo.subjectParentId = oneLevel.id
                  this.twoLevelSubjectList = twoLevel
                }
              }
            }
          })

        //获得下拉老师列表
        teacher.getTeacherList()
          .then(response => {
            this.teacherList = response.data.itmes
          })
      },
      //根据一级分类变化查找二级分类
      getTwoLevelSubject: function(oneLevelSubjectId) {
        for (let i = 0; i < this.oneLevelSubjectList.length; i++) {
          let oneLevel = this.oneLevelSubjectList[i]
          if (oneLevel.id === oneLevelSubjectId) {
            this.twoLevelSubjectList = oneLevel.children
            this.courseInfo.subjectId = ''
          }
        }
      },
      //下一步
      next() {
        course.saveCourse(this.courseInfo)
          .then(response => {
            console.log(response)
            if (response.code === 20000) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.id = response.data.courseId
              this.$router.push({ path: `/course/chapter/${this.id}` })
            }
          })
      },
      //封面上传成功
      handleAvatarSuccess(response){
        this.courseInfo.cover = response.data.imageUrl
      },
      //封面上传前
      beforeAvatarUpload(file){
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt2M
      }
    }
  }
</script>
<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
