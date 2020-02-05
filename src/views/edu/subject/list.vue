<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="输入关键字过滤" style="margin-bottom:30px;"/>
    <el-button type="text" @click="dialogFormVisible = true">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level==1"
            type="text"
            size="mini"
            @click="() => openDialog(data)">
            添加
          </el-button>
          <el-button
            v-if="node.childNodes==0"
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="appendLevelOne()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import subject from '@/api/subject'

  export default {

    data() {
      return {
        dialogFormVisible: false,
        subject: {
          title: '',
          parentId: ''
        },
        filterText: '',
        subjectList: [],
        defaultProps: {
          label: 'title',
          children: 'children'
        }
      }
    },

    watch: {
      filterText(val) {
        this.$refs.subjectTree.filter(val)
      }
    },

    created() {
      this.initTree()
    },

    methods: {
      //清除残留信息
      clearInfo() {
        this.dialogFormVisible = false
        this.subject.parentId = ''
        this.subject.title = ''
      },
      //关闭窗口
      closeDialog() {
        this.clearInfo()
      },
      //打开窗口
      openDialog(data) {
        this.subject.parentId = data.id
        this.dialogFormVisible = true
      },
      //添加节点
      appendLevelOne() {
        subject.addNode(this.subject)
          .then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.clearInfo()
            this.initTree()
          }).catch(() => {
          this.$message({
            type: 'error',
            message: '添加失败'
          })
          this.clearInfo()
          this.initTree()
        })
      },
      //删除节点
      remove(node, data) {
        this.$confirm('此操作将会永远删除，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring'
        }).then(() => {
          return subject.deleteNodeById(data.id)
            .then(response => {
              if (response.code == 20000) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
              }
            })
        }).then(() => {
          this.initTree()
        }).catch(response => {
          if (response == 'cancel') {
            this.$message({
              type: 'info',
              message: '操作取消'
            })
          }
        })
      },
      //查询所有节点
      initTree() {
        subject.getNestedTreeList().then(response => {
          this.subjectList = response.data.items
        })
      },
      //节点过滤
      filterNode(value, data) {
        if (!value) return true
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    }

  }
</script>
