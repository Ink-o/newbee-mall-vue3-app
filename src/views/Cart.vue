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
  <div class="cart-box">
    <!-- 顶部标题 -->
    <s-header :name="'购物车'" :noback="true"></s-header>
    <!-- 购物车主体 -->
    <div class="cart-body">
      <!-- 复选框组 -->
      <van-checkbox-group @change="groupChange" v-model="state.result" ref="checkboxGroup">
        <!-- 加入的商品 -->
        <van-swipe-cell :right-width="50" v-for="(item, index) in state.list" :key="index">
          <div class="good-item">
            <!-- 复选框 -->
            <van-checkbox :name="item.cartItemId" />
            <!-- 图片 -->
            <div class="good-img"><img :src="$filters.prefix(item.goodsCoverImg)" alt=""></div>
            <!-- 商品描述 -->
            <div class="good-desc">
              <!-- 商品标题 -->
              <div class="good-title">
                <span>{{ item.goodsName }}</span>
                <span>x{{ item.goodsCount }}</span>
              </div>
              <div class="good-btn">
                <!-- 价格 -->
                <div class="price">¥{{ item.sellingPrice }}</div>
                <!-- 商品选择数量 -->
                <van-stepper
                  integer
                  :min="1"
                  :max="5"
                  :model-value="item.goodsCount"
                  :name="item.cartItemId"
                  async-change
                  @change="onChange"
                />
              </div>
            </div>
          </div>
          <template #right>
            <van-button
              square
              icon="delete"
              type="danger"
              class="delete-button"
              @click="deleteGood(item.cartItemId)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <!-- 结算块。结算按钮和金额展示都包含在组件里了 -->
    <van-submit-bar
      v-if="state.list.length > 0"
      class="submit-all van-hairline--top"
      :price="total * 100"
      button-text="结算"
      button-type="primary"
      @submit="onSubmit"
    >
      <!-- 全选按钮 -->
      <van-checkbox @click="allCheck" v-model:checked="state.checkAll">全选</van-checkbox>
    </van-submit-bar>
    <!-- 购物车空页面 -->
    <div class="empty" v-if="!state.list.length">
      <img class="empty-cart" src="https://s.yezgea02.com/1604028375097/empty-car.png" alt="空购物车">
      <div class="title">购物车空空如也</div>
      <van-button round color="#1baeae" type="primary" @click="goTo" block>前往选购</van-button>
    </div>
    <!-- 底部导航 -->
    <nav-bar />
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { showToast, showLoadingToast, closeToast, showFailToast } from 'vant'
import navBar from '@/components/NavBar.vue'
import sHeader from '@/components/SimpleHeader.vue'
import { getCart, deleteCartItem, modifyCart } from '@/service/cart'

const router = useRouter()
const cart = useCartStore()
const state = reactive({
  list: [], // 购物车商品数组
  result: [], // 选中的商品
  checkAll: true // 是否全选
})

onMounted(() => {
  // 操作DOM
  console.log('页面渲染完毕');
  // 初始化
  init()
})

// 获取购物车商品
const init = async () => {
  // 开启加载中loading
  showLoadingToast({ message: '加载中...', forbidClick: true });
  const { data } = await getCart({ pageNumber: 1 })
  state.list = data
  // 商品默认全选，把商品的 id 全部放到 state.result 中
  state.result = data.map(item => item.cartItemId)
  // 关闭加载中loading
  closeToast()
}

// 动态计算选中的商品价格
const total = computed(() => {
  let sum = 0
  // 从 state.list 中筛选出选中的商品。最后进行价格累加
  let _list = state.list.filter(item => state.result.includes(item.cartItemId))
  _list.forEach(item => {
    sum += item.goodsCount * item.sellingPrice
  })
  return sum
})

const goTo = () => {
  router.push({ path: '/home' })
}

// 商品数量选择监听
// detail 是 list 中的项
const onChange = async (value, detail) => {
  if (value > 5) {
    showFailToast('超出单个商品的最大购买数量')
    return
  }
  if (value < 1) {
    showFailToast('商品不得小于0')
    return
  }
  /**
   * 这边做一个拦截处理，如果点击的时候，购物车单项的 goodsCount 等于点击的计步器数字，
   * 那么就不再进行修改操作
  */
  if (state.list.find(item => item.cartItemId == detail.name)?.goodsCount == value) return
  showLoadingToast({ message: '修改中...', forbidClick: true });

  // 更改购物车商品添加数量
  const params = {
    cartItemId: detail.name,
    goodsCount: value
  }
  await modifyCart(params)
  /**
   * 修改完成后，没有请求购物车列表，是因为闪烁的问题，
   * 这边手动给操作的购物车商品修改数据
  */
  state.list.forEach(item => {
    if (item.cartItemId == detail.name) {
      item.goodsCount = value
    }
  })
  closeToast()
}

const onSubmit = async () => {
  // 校验商品选择
  if (state.result.length == 0) {
    showFailToast('请选择商品进行结算')
    return
  }
  // 将 result 转成 json
  const params = JSON.stringify(state.result)
  console.log('params: ', params);
  // 跳转到创建订单
  router.push({ path: '/create-order', query: { cartItemIds: params } })
}

// 删除商品
const deleteGood = async (id) => {
  // 调用接口
  await deleteCartItem(id)
  // 更新 cart store 里的数据
  cart.updateCart()
  // 再次初始化
  init()
}

// 复选框组下面的复选框选中变化
const groupChange = (result) => {
  // 判断是否全选
  if (result.length == state.list.length) {
    state.checkAll = true
  } else {
    state.checkAll = false
  }

  // 更新 state.result(选中商品)
  state.result = result
}

// 全选处理
const allCheck = () => {
  if (!state.checkAll) {
    state.result = state.list.map(item => item.cartItemId)
  } else {
    state.result = []
  }
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .cart-box {
    .cart-header {
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
      .cart-name {
        font-size: 14px;
      }
    }
    .cart-body {
      margin: 16px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 50px;
        height: 100%;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .empty-cart {
        width: 150px;
        margin-bottom: 20px;
      }
      .van-icon-smile-o {
        font-size: 50px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .submit-all {
      margin-bottom: 64px;
      .van-checkbox {
        margin-left: 10px
      }
      .van-submit-bar__text {
        margin-right: 10px
      }
      .van-submit-bar__button {
        background: @primary;
      }
    }
    .van-checkbox__icon--checked .van-icon {
      background-color: @primary;
      border-color: @primary;
    }
  }
</style>
