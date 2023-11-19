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
  <div class="order-box">
    <!-- 标题 -->
    <s-header :name="'我的订单'" :back="'/user'"></s-header>
    <!-- 状态tab -->
    <van-tabs @click-tab="onChangeTab" :color="'#1baeae'" :title-active-color="'#1baeae'" class="order-tab" v-model="state.status">
      <van-tab title="全部" name=''></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待确认" name="1"></van-tab>
      <van-tab title="待发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>
    <!-- 订单内容 -->
    <div class="content">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="order-list-refresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
          @offset="10"
        >
          <!-- 下单的商品 -->
          <div v-for="(item, index) in state.list" :key="index" class="order-item-box" @click="goTo(item.orderNo)">
            <div class="order-item-header">
              <span>订单时间：{{ item.createTime }}</span>
              <!-- 支付状态 -->
              <span>{{ item.orderStatusString }}</span>
            </div>
            <van-card
              v-for="one in item.newBeeMallOrderItemVOS"
              :key="one.orderId"
              :num="one.goodsCount"
              :price="one.sellingPrice"
              desc="全场包邮"
              :title="one.goodsName"
              :thumb="$filters.prefix(one.goodsCoverImg)"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import sHeader from '@/components/SimpleHeader.vue'
import { getOrderList } from '@/service/order'
import { useRouter } from 'vue-router'

const router = useRouter()
const state = reactive({
  status: '', // 筛选的状态
  loading: false, // loading状态
  finished: false, // 页数是否到达最大
  refreshing: false, // 下拉刷新的loading状态
  list: [], // 下单的商品
  page: 1, // 当前页码
  totalPage: 0 // 总商品数
})

const loadData = async () => {
  // 获取order中的商品数据
  const { data, data: { list } } = await getOrderList({ pageNumber: state.page, status: state.status })
  state.list = state.list.concat(list)
  state.totalPage = data.totalPage
  state.loading = false;

  // 判断当前页是否大于等于总页数。是的话 finished 置为 true
  if (state.page >= data.totalPage) state.finished = true
}

// 切换状态
const onChangeTab = ({ name }) => {
  // 这里 Tab 最好采用点击事件，@click，如果用 @change 事件，会默认进来执行一次。
  // 更换 status 状态，重新获取数据
  state.status = name
  onRefresh()
}

const goTo = (id) => {
  // 进入订单详情
  router.push({ path: '/order-detail', query: { id } })
}

const goBack = () => {
  // 当前历史后退一步
  // baidu -> vue -> react
  router.go(-1)
}

const onLoad = () => {
  // 下拉刷新没在 loading 的状态
  if (!state.refreshing && state.page < state.totalPage) {
    // 页数+1
    state.page = state.page + 1
  }

  // 下拉刷新直接将 list 置空
  if (state.refreshing) {
    state.list = [];
    state.refreshing = false;
  }

  // 获取订单数据
  loadData()
}

// 下拉刷新
const onRefresh = () => {
  state.refreshing = true
  state.finished = false
  state.loading = true
  state.page = 1
  onLoad()
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .order-box {
    .order-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .order-name {
        font-size: 14px;
      }
    }
    .order-tab {
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
    }
    .skeleton {
      margin-top: 60px;
    }
    .content {
      height: calc(~"(100vh - 70px)");
      overflow: hidden;
      overflow-y: scroll; 
      margin-top: 34px;
    }
    .order-list-refresh {
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      .order-item-box {
        margin: 20px 10px;
        background-color: #fff;
        .order-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #fff;
          margin-top: 0;
        }
      }
    }
  }
</style>
