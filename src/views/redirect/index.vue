<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
// 重定向用
router.replace({ path: "/" + route.params.path, query: route.query })
</script>

<template>
  <div />
</template>
