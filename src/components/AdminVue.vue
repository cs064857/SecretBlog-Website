<template>

    <el-container class="common-layout">
      <el-header style="height: 75px;background-color: cadetblue;">
        Header
      </el-header>
      <el-container>
        <el-aside style="width: 200px">
          <!--   NavMenu導航菜單     -->
          <el-row style="height: 100%">
            <el-col :span="12" style="height: 100%">
<!--              <h5 class="mb-2">導航菜單</h5>-->
              <el-menu
                  style="position: absolute;height: 100%; width: 100%;border-right-width: 0"
                  active-text-color="#ffd04b"
                  background-color="#545c64"
                  class="el-menu-vertical-demo"
                  default-active="2"
                  text-color="#fff"
                  router
                  @open="handleOpen"
                  @close="handleClose"
                  @select="handleSelect"
              >
                <el-sub-menu  index="1">
                  <template #title >
                    <el-icon >
                      <location />
                    </el-icon>
                    <span >Navigator One</span>
                  </template>
                  <el-menu-item-group title="Group One">
                    <el-menu-item index="MainGrid">MainGrip</el-menu-item>
                    <el-menu-item index="FlexBoxTest" >FlexBoxTest</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="Group Two">
                    <el-menu-item index="Home">Home</el-menu-item>
                  </el-menu-item-group>
                  <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                  </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                  <el-icon>
                    <icon-menu/>
                  </el-icon>
                  <span>Navigator Two</span>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                  <el-icon>
                    <document/>
                  </el-icon>
                  <span>Navigator Three</span>
                </el-menu-item>
                <el-menu-item index="TinyMceEdit">
                  <el-icon>
                    <setting/>
                  </el-icon>
                  <span>編輯器</span>

                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <el-main style="padding: 0;min-height: 90%;min-width: 100%;" >
            <router-view  name="MainRouter"></router-view>

            <!--            <div class="grid-item">-->
            <!--              <el-button class="b1" type="primary" round>新增</el-button>-->
            <!--            </div>-->
          </el-main>
          <el-footer style="background: #1b192d;min-height: 10%;">Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>

</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import {ref} from 'vue'
const router = useRouter()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

// const handleGoTinyMceEditor =function (){ //使用@click綁定於el-menu-item上,點擊觸發此方法並且跳轉路由
//   router.push({name:'TinyMceEdit'})
// }

const handleSelect =function (index:string){
  //利用@select放置於el-menu上,當點擊其中的el-menu-item的話,會獲得index參數並且觸發方法將參數傳入,並跳轉路由
  router.push({name:index})
}
</script>

<style scoped>



.common-layout{

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

:deep(.el-main) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-button) {
  width: 90px;
  height: auto;
}

:deep(.el-container) {

  width: 100%;
  height: 100%; /* 讓容器高度佔滿整個視窗 */
}


</style>
