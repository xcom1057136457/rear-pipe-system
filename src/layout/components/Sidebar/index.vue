<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        settings.sideTheme === 'theme-dark'
          ? variables.menuBg
          : variables.menuLightBg
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuBg
            : variables.menuLightBg
        "
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuText
            : 'rgba(0,0,0,.65)'
        "
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-if="!roles.includes('visitor')">
          <sidebar-item
            v-for="(route, index) in sidebarRouters"
            :key="route.path + index"
            :item="route"
            :base-path="route.path"
          />
        </template>

        <template v-else>
          <app-link :to="'/index'">
            <el-menu-item index="/index" popper-append-to-body>
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
          </app-link>

          <app-link :to="'/alarm/emsAlarm'">
            <el-menu-item index="/alarm/emsAlarm" popper-append-to-body>
              <i class="el-icon-menu"></i>
              <span slot="title">EMS设备告警</span>
            </el-menu-item>
          </app-link>

          <app-link :to="'/alarm/powerAlarm'">
            <el-menu-item index="/alarm/powerAlarm" popper-append-to-body>
              <i class="el-icon-menu"></i>
              <span slot="title">2kW电源告警</span>
            </el-menu-item>
          </app-link>

          <app-link :to="'/alarm/4g4Alarm'">
            <el-menu-item index="/alarm/4g4Alarm" popper-append-to-body>
              <i class="el-icon-menu"></i>
              <span slot="title">4G4设备告警</span>
            </el-menu-item>
          </app-link>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";
import AppLink from "./Link.vue";
import { isExternal } from "@/utils/validate";

export default {
  components: { SidebarItem, Logo, AppLink },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar", "roles"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
