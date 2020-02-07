<template>
  <div class="app-container">
    <el-form label-width="120px">

      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" min="0" max="20"/>
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!--讲师头像-->
      <el-form-item label="讲师头像">
        <pan-thumb :image="teacher.avatar"/>
        <el-button type="primary" icon="el-icon-upload" @click="imageCropperShow=true">更换头像</el-button>
        <image-cropper
          v-show="imageCropperShow"
          :width="300"
          :height="300"
          :key="imageCropperKey"
          :url="'/edu_service/oss/uploadAvatar'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import teacher from '@/api/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  const defaultTeacher = {
    name: '',
    sort: 0,
    level: 1,
    career: '',
    intro: '',
    avatar: ''
  }

  export default {
    components: { ImageCropper, PanThumb },
    data() {
      return {
        imageCropperKey: 0,
        imageCropperShow: false,
        BASE_API: process.env.BABEL_ENV,
        teacher: defaultTeacher
      }
    },
    watch: {
      $route(to, from) {
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      //上传成功
      cropSuccess(data) {
        this.imageCropperShow = false
        console.log(data.imageUrl)
        this.teacher.avatar = data.imageUrl
        this.imageCropperKey = this.imageCropperKey + 1
      },
      //头像窗口关闭
      close() {
        this.imageCropperShow = false
        this.imageCropperKey = this.imageCropperKey + 1
      },
      //页面初始化
      init() {
        if (this.$route.params && this.$route.params.id) {
          this.getTeacherById(this.$route.params.id)
        } else {
          this.teacher = { ...defaultTeacher }
        }
      },
      //执行修改或保存操作
      saveOrUpdate() {
        if (this.teacher.id) {
          this.updateTeacher()
        } else {
          this.saveTeacher()
        }
      },
      //保存
      saveTeacher() {
        this.$confirm('请确定信息无误，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          return teacher.saveTeacher(this.teacher)
        }).then(() => {
          this.$router.push({ path: '/teacher/list' })
          this.$message({
            type: 'success', message: '添加成功哦'
          })
        }).catch(reason => {
          if (reason === 'cancel') {
            this.$message({
              type: 'info',
              message: '操作取消'
            })
          } else {
            this.$message({
              type: 'error',
              message: '系统异常'
            })
          }
        })
      },
      //查询
      getTeacherById(id) {
        teacher.getTeacherById(id)
          .then(response => {
            this.teacher = response.data.eduTeacher
          })
      },
      //修改
      updateTeacher() {

        this.$confirm('请确定信息无误，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          return teacher.updateTeacher(this.teacher)
        }).then(() => {
          this.$router.push({ path: '/teacher/list' })
          this.$message({
            type: 'success', message: '修改成功哦'
          })
        }).catch(reason => {
          if (reason === 'cancel') {
            this.$message({
              type: 'info',
              message: '操作取消'
            })
          } else {
            this.$message({
              type: 'error',
              message: '系统异常'
            })
          }
        })

      }
    }
  }
</script>

