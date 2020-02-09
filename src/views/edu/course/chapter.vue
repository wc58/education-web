<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterNestedList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
                <el-button type="text" @click="editChapter(chapter.id)">添加课时</el-button>
                <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
                <el-button type="text" v-if="chapter.children==0"  @click="deleteChapter(chapter.id)" >删除</el-button>
            </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                      <el-button type="text">编辑</el-button>
                      <el-button type="text">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>


    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import chapter from '../../../api/chapter'
  import course from '../../../api/course'

  export default {
    data() {
      return {
        courseId: '',
        saveBtnDisabled: false,
        dialogChapterFormVisible: false,
        chapterNestedList: [],
        chapter: {
          courseId: '',
          title: '',
          sort: ''
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      //页面初始化
      init() {
        //课堂id
        this.courseId = this.$route.params.id
        if (this.courseId) {
          chapter.getChapterById(this.courseId)
            .then(response => {
              this.chapterNestedList = response.data.items
            })
        }
      },
      //保存或修改章节
      saveOrUpdate() {
        this.chapter.courseId = this.courseId
        chapter.saveChapter(this.chapter)
          .then(response => {
            this.dialogChapterFormVisible = false
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.init()
          })
      },
      //修改回显章节信息
      editChapter(id) {
        chapter.getChapter(id)
          .then(response => {
            this.chapter = response.data.item
            this.dialogChapterFormVisible = true
          })
      },
      //删除章节信息
      deleteChapter(id) {
        chapter.deleteChapter(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.init()
          })
      },
      //上一步
      previous() {
        this.$router.push({ path: `/course/info/${this.courseId}` })
      }
      ,
      //下一步
      next() {
        this.$router.push({ path: `/course/publish/${this.courseId}` })
      }
    }
  }
</script>

