<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH + '/excel/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xls'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="'http://localhost:9001/service/subject/import'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传服务器
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        BASE_API: process.env.BABEL_ENV,
        importBtnDisabled: false,
        loading: false
      }
    },
    created() {
    },
    methods: {
      submitUpload() {
        this.importBtnDisabled = true
        this.loading = true
        this.$refs.upload.submit()
      },
      fileUploadSuccess(response) {
        if (response.success == 20000) {
          this.loading = false
          this.$message({
            type: 'success',
            message: '导入成功'
          })
        } else {
          const messages = response.data.messageList
          let msgString = '<ul>'
          messages.forEach(msg => {
            msgString += `<li>${msg}</li>`
          })
          msgString += '</ul>'
          this.$alert(msgString, response.message, {
            dangerouslyUseHTMLString: true
          })
        }
      },
      fileUploadError() {
        this.$message({
          type:"error",
          message:"导入失败"
        })
      }
    }
  }
</script>

<style scoped>

</style>
