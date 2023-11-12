<!--
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 *
-->

<template>
  <div>
    <!-- 首页头部 -->
    <header class="home-header wrap" :class="{'active' : state.headerScroll}">
      <router-link tag="i" to="./category"><i class="nbicon nbmenu2"></i></router-link>
      <div class="header-search">
        <span class="app-name">新蜂商城</span>
        <i class="iconfont icon-search"></i>
        <router-link tag="span" class="search-title" to="./product-list?from=home">山河无恙，人间皆安</router-link>
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!state.isLogin">登录</router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o" />
      </router-link>
    </header>
    <!-- 底部导航 -->
    <nav-bar />
    <!-- 页面轮播图 -->
    <swiper :list="state.swiperList"></swiper>
    <!-- 新蜂超市等入口 -->
    <div class="category-list">
      <div v-for="item in state.categoryList" v-bind:key="item.categoryId" @click="tips">
        <img :src="item.imgUrl">
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-- 新品上线板块 -->
    <div class="good">
      <header class="good-header">新品上线</header>
      <van-skeleton title :row="3" :loading="state.loading">
        <div class="good-box">
          <div class="good-item" v-for="item in state.newGoodses" :key="item.goodsId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <!-- 热门商品板块 -->
    <div class="good">
      <header class="good-header">热门商品</header>
      <van-skeleton title :row="3" :loading="state.loading">
        <div class="good-box">
          <div class="good-item" v-for="item in state.hots" :key="item.goodsId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <!-- 最新推荐板块 -->
    <div class="good" :style="{ paddingBottom: '100px'}">
      <header class="good-header">最新推荐</header>
      <van-skeleton title :row="3" :loading="state.loading">
        <div class="good-box">
          <div class="good-item" v-for="item in state.recommends" :key="item.goodsId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
            <div class="good-desc">
              <div class="title">{{ item.goodsName }}</div>
              <div class="price">¥ {{ item.sellingPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import swiper from '@/components/Swiper.vue'
import navBar from '@/components/NavBar.vue'
import { getHome } from '@/service/home'
import { getLocal } from '@/common/js/utils'
import { showLoadingToast, closeToast, showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
// pinia 状态
const cart = useCartStore()
// 获取路由对象
const router = useRouter()
const state = reactive({
  swiperList: [], // 轮播图列表
  isLogin: false, // 是否已登录
  headerScroll: false, // 滚动透明判断
  hots: [], // 热门商品板块 数据
  newGoodses: [], // 新品上线板块数据
  recommends: [], // 最新推荐板块 数据
  // 新蜂超市等入口数据，写死的
  categoryList: [
    {
      name: '新蜂超市',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E8%B6%85%E5%B8%82%402x.png',
      categoryId: 100001
    }, {
      name: '新蜂服饰',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E6%9C%8D%E9%A5%B0%402x.png',
      categoryId: 100003
    }, {
      name: '全球购',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E7%90%83%E8%B4%AD%402x.png',
      categoryId: 100002
    }, {
      name: '新蜂生鲜',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%94%9F%E9%B2%9C%402x.png',
      categoryId: 100004
    }, {
      name: '新蜂到家',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%88%B0%E5%AE%B6%402x.png',
      categoryId: 100005
    }, {
      name: '充值缴费',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%85%E5%80%BC%402x.png',
      categoryId: 100006
    }, {
      name: '9.9元拼',
      imgUrl: 'https://s.yezgea02.com/1604041127880/9.9%402x.png',
      categoryId: 100007
    }, {
      name: '领劵',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E9%A2%86%E5%88%B8%402x.png',
      categoryId: 100008
    }, {
      name: '省钱',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E7%9C%81%E9%92%B1%402x.png',
      categoryId: 100009
    }, {
      name: '全部',
      imgUrl: 'https://s.yezgea02.com/1604041127880/%E5%85%A8%E9%83%A8%402x.png',
      categoryId: 100010
    }
  ],
  // 新品上线板块 加载状态
  loading: true
})
// 一个组件从 0 到 1
// 未渲染 -> 渲染 -> 更新前 -> 更新后（逻辑）
// diff，patch 
// ---（执行用户传进来的函数）-----（执行用户传进来的函数）-------
// 渲染后立刻执行我的逻辑
// 在特定的时间做某件事情（你传进来的回调函数）
// 第一种方法：每隔一段，来看组件是否渲染完毕了。渲染完毕的情况，执行逻辑。没渲染完毕，下次再看
// 第二种方法：作者在编写组件渲染的时候，预留一个空位。让用户可以在这个阶段执行渲染逻辑。用户就可以把想要执行的逻辑放到空位上，这样逻辑就可以直接在组件渲染完毕后执行了
onMounted(async () => {
  // 获取用户登录的 token
  const token = getLocal('token')
  if (token) {
    state.isLogin = true
    // 获取购物车数据.
    cart.updateCart()
  }
  // 全局 loading，表示正在加载中
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });
  // 获取首页数据
  const { data } = await getHome()
  state.swiperList = data.carousels
  state.newGoodses = data.newGoodses
  state.hots = data.hotGoodses
  state.recommends = data.recommendGoodses
  // 关闭 loading
  state.loading = false
  // 关闭全局 loading
  closeToast()
})

// 监听滚动事件，当滚轮距离顶部的值超过 100px 后，state.headerScroll 设置为 true
// state.headerScroll 的作用主要是用来判断 header 是否需要添加 active 类
nextTick(() => {
  document.body.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
  })
})

const goToDetail = (item) => {
  router.push({ path: `/product/${item.goodsId}` })
}

const tips = () => {
  showToast('敬请期待');
}
</script>

<style lang="less" scoped >
  @import '../common/style/mixin';
  .home-header {
      position: fixed;
      left: 0;
      top: 0;
      .wh(100%, 50px);
      .fj();
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #fff;
      z-index: 10000;
      .nbmenu2 {
        color: @primary;
      }
      &.active {
        background: @primary;
        .nbmenu2 {
          color: #fff;
        }
        .login {
          color: #fff;
        }
      }

      .header-search {
          display: flex;
          width: 74%;
          line-height: 20px;
          margin: 10px 0;
          padding: 5px 0;
          color: #232326;
          background: rgba(255, 255, 255, .7);
          border-radius: 20px;
          .app-name {
              padding: 0 10px;
              color: @primary;
              font-size: 20px;
              font-weight: bold;
              border-right: 1px solid #666;
          }
          .icon-search {
              padding: 0 10px;
              font-size: 17px;
          }
          .search-title {
              font-size: 12px;
              color: #666;
              line-height: 21px;
          }
      }
      .icon-iconyonghu{
        color: #fff;
        font-size: 22px;
      }
      .login {
        color: @primary;
        line-height: 52px;
        .van-icon-manager-o {
          font-size: 20px;
          vertical-align: -3px;
        }
      }
  }
  .category-list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 13px;
    div {
      display: flex;
      flex-direction: column;
      width: 20%;
      text-align: center;
      img {
        .wh(36px, 36px);
        margin: 13px auto 8px auto;
      }
    }
  }
  .good {
    .good-header {
      background: #f9f9f9;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: @primary;
      font-size: 16px;
      font-weight: 500;
    }
    .good-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .good-item {
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1PX solid #e9e9e9;
        padding: 10px 10px;
        img {
          display: block;
          width: 120px;
          margin: 0 auto;
        }
        .good-desc {
          text-align: center;
          font-size: 14px;
          padding: 10px 0;
          .title {
            color: #222333;
          }
          .price {
            color: @primary;
          }
        }
        &:nth-child(2n + 1) {
          border-right: 1PX solid #e9e9e9;
        }
      }
    }
  }
  .floor-list {
      width: 100%;
      padding-bottom: 50px;
      .floor-head {
        width: 100%;
        height: 40px;
        background: #F6F6F6;
      }
      .floor-content {
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        width: 100%;
        .boxSizing();
        .floor-category {
          width: 50%;
          padding: 10px;
          border-right: 1px solid #dcdcdc;
          border-bottom: 1px solid #dcdcdc;
          .boxSizing();
          &:nth-child(2n) {
            border-right: none;
          }
          p {
            font-size: 17px;
            color: #333;
            &:nth-child(2) {
              padding: 5px 0;
              font-size: 13px;
              color: @primary;
            }
          }
          .floor-products {
            .fj();
            width: 100%;
            img {
              .wh(65px, 65px);
            }
          }
      }
    }
  }
</style>