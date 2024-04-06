<template>
  <div class="app-container center">
    <el-space direction="vertical">
      <el-text tag="b" style="font-size: 30px">欢迎使用本系统</el-text>
      <el-text :tag="'h5'">请点击左侧菜单进行操作</el-text>
      <el-text tag="p">未实名用户请先在个人信息中进行实名认证</el-text>
    </el-space>
  </div>
</template>

<style lang="scss" scoped>
.center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
