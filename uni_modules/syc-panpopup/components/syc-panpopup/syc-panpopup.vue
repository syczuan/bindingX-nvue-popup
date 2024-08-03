<template>
  <u-popup
    :show="show"
    @close="$emit('close')"
    bgColor="transparent"
    :mode="mode"
    :safeAreaInsetBottom="false"
    :duration="duration"
    :overlayOpacity="opacity"
  >
    <view
      @touchstart="fullPanTouchStart"
      @touchend="handleTouchEnd"
      class="container"
      ref="container"
      :style="popupStyle"
    >
      <view class="test_view" @touchend="testView">
        <text class="text">点击按钮</text>
      </view>
      <slot></slot>
    </view>
  </u-popup>
</template>

<script>
const Binding = uni.requireNativePlugin("bindingx");
export default {
  props: {
    /**
     * 弹框显示状态
     * 设置true时确保组件已挂载 否则导致第一次滑动无效
     */
    show: {
      type: [Boolean],
      default: false,
    },
    /**
     * 弹框宽度
     * mode=top|bottom时固定100%
     * mode=left|right时默认60%
     * %-屏幕可用高度|宽度百分比
     * Number|String 像素高度
     */
    width: {
      type: [String, Number],
      default: "",
    },
    /**
     * 弹框高度
     * mode=top|bottom时默认50%
     * mode=left|right时固定100%
     * %-屏幕可用高度|宽度百分比
     * Number|String 像素高度
     */
    height: {
      type: [String, Number],
      default: "",
    },
    /**
     * 屏幕高度是否为全屏高度(全屏弹框时设为true)
     * true-screenHeight
     * false-windowHeight
     */
    isScreenHeight: {
      type: [Boolean],
      default: true,
    },
    // 弹出方向 top|bottom|left|right
    mode: {
      type: [String],
      default: "bottom",
    },
    // 打开弹框动画时长
    duration: {
      type: [String, Number],
      default: 300,
    },
    // 手势复位动画时长
    bindTimingDuration: {
      type: [String, Number],
      default: 300,
    },
    // 弹框背景颜色
    backgroundColor: {
      type: [String],
      default: "#ffffff",
    },
    // 遮罩透明度
    opacity: {
      type: [String, Number],
      default: 0.5,
    },
    /**
     * 全局弹框手势
     * 开启后会与内部滚动视图如scroll-view、list冲突
     */
    fullPan: {
      type: [Boolean],
      default: false,
    },
    /**
     * 滑动关闭阈值
     * %-弹框高(宽)度百分比
     * Number|String 像素高度
     * 实际高(宽)度低于弹框高(宽)度时为0
     */
    threshold: {
      type: [String, Number],
      default: "50%",
    },
    /**
     * 弹框下滑复位动画
     * 参阅https://easings.net/
     */
    easing: {
      type: [String],
      default: "easeOutExpo",
    },
    // 弹框弹出方向圆角
    borderRadius: {
      type: [String],
      default: "10px",
    },
  },
  data() {
    return {
      // 下滑距离
      deltaY: 0,
      deltaX: 0,
      // 是否正在动画
      isInAnimation: false,
      // 手势bindingX绑定
      panBind: null,
      touchEndTimer: null,
    };
  },
  methods: {
    testView() {
      console.log("sffdgfgdhghfghfh");
    },
    // 弹框整体滑动
    fullPanTouchStart() {
      this.fullPan && this.onTouchStart();
    },
    handleTouchEnd(e) {
      clearTimeout(this.touchEndTimer);
      this.touchEndTimer = setTimeout(() => {
        if (this.panBind.token) {
          Binding.unbind({ eventType: "pan", token: this.panBind.token });
        }
      }, 300);
    },
    // 获取dom
    getEl(el) {
      if (typeof el === "string" || typeof el === "number") return el;
      if (WXEnvironment) {
        return el.ref;
      } else {
        return el instanceof HTMLElement ? el : el.$el;
      }
    },

    bindTiming() {
      if (!this.$refs.container) {
        return;
      }
      const container = this.getEl(this.$refs.container);
      this.isInAnimation = true;
      const duration = this.bindTimingDuration;

      let value;
      let property;
      switch (this.mode) {
        case "top":
        case "bottom":
          value = this.deltaY;
          property = "transform.translateY";
          break;
        case "left":
        case "right":
          value = this.deltaX;
          property = "transform.translateX";
          break;
        default:
          break;
      }
      const expression = `${this.easing}(t, ${value}, ${-value}, ${duration})`;
      const animationBind = Binding.bind(
        {
          eventType: "timing",
          exitExpression: `t>${duration}`,
          props: [
            {
              element: container,
              property: property,
              expression: expression,
            },
          ],
        },
        (e) => {
          if (e.state !== "start") {
            Binding.unbind({ token: animationBind.token, eventType: "timing" });
            switch (this.mode) {
              case "top":
              case "bottom":
                this.deltaY = 0;
                break;
              case "left":
              case "right":
                this.deltaX = 0;
                break;
              default:
                break;
            }
            this.isInAnimation = false;
          }
        }
      );
    },
    onTouchStart(init) {
      // 动画正在执行时阻止重置
      if (this.isInAnimation === true) {
        if (this.panBind && this.panBind.token != 0) {
          Binding.unbind({ eventType: "pan", token: this.panBind.token });
          this.panBind.token = 0;
        }
        return;
      }

      if (!this.$refs.container) {
        return;
      }
      const container = this.getEl(this.$refs.container);
      let expression;
      let property;
      switch (this.mode) {
        case "top":
          expression = "y < 0 ? y : 0";
          property = "transform.translateY";
          break;
        case "bottom":
          expression = "y > 0 ? y : 0";
          property = "transform.translateY";
          break;
        case "left":
          expression = "x < 0 ? x : 0";
          property = "transform.translateX";
          break;
        case "right":
          expression = "x > 0 ? x : 0";
          property = "transform.translateX";
          break;
        default:
          break;
      }
      this.panBind = Binding.bind(
        {
          anchor: container,
          eventType: "pan",
          props: [
            {
              element: container,
              property: property,
              expression: expression,
            },
          ],
        },
        (e) => {
          if (e.state !== "start") {
            // Binding.unbind({ token: this.panBind.token, eventType: "pan" });
            switch (this.mode) {
              case "top":
                this.deltaY = e.deltaY;
                if (this.deltaY < -this.thresholdValue) {
                  this.$emit("close");
                } else {
                  this.deltaY < 0 && this.bindTiming();
                }
                break;
              case "bottom":
                this.deltaY = e.deltaY;
                if (this.deltaY > this.thresholdValue) {
                  this.$emit("close");
                } else {
                  this.deltaY > 0 && this.bindTiming();
                }
                break;
              case "left":
                this.deltaX = e.deltaX;
                if (this.deltaX < -this.thresholdValue) {
                  this.$emit("close");
                } else {
                  this.deltaX < 0 && this.bindTiming();
                }
                break;
              case "right":
                this.deltaX = e.deltaX;
                if (this.deltaX > this.thresholdValue) {
                  this.$emit("close");
                } else {
                  this.deltaX > 0 && this.bindTiming();
                }
                break;
              default:
                break;
            }
          }
        }
      );
      if (init) {
        Binding.unbind({ token: this.panBind.token, eventType: "pan" });
      }
    },
    /**
     * 获取实际像素
     * @param {Number|String} value 要转换的值
     * @param {Number} relativeValue 百分比时的相对值
     */
    getActualPixel(value, relativeValue) {
      const isNumber = typeof value === "number" && !isNaN(value);
      if (isNumber) {
        return value;
      }
      if (value.endsWith("px")) {
        return parseFloat(value);
      } else if (value.endsWith("%")) {
        const num = parseFloat(value);
        return (num / 100) * relativeValue;
      } else {
        return relativeValue;
      }
    },
  },
  watch: {
    show: {
      handler(val) {
        // 解决第一次触摸同时滑动不生效问题
        val && this.$nextTick(() => this.onTouchStart(true));
      },
    },
  },
  computed: {
    device() {
      return uni.getSystemInfoSync();
    },
    screenWidth() {
      return this.device.screenWidth;
    },
    screenHeight() {
      return this.device[this.isScreenHeight ? "screenHeight" : "windowHeight"];
    },
    // 计算弹框高度|宽度
    popupSize() {
      let width;
      let height;
      switch (this.mode) {
        case "top":
        case "bottom":
          width = this.getActualPixel("100%", this.screenWidth);
          height = this.getActualPixel(this.height || "50%", this.screenHeight);
          break;
        case "left":
        case "right":
          width = this.getActualPixel(this.width || "60%", this.screenWidth);
          height = this.getActualPixel("100%", this.screenHeight);
          break;
        default:
          return {};
      }
      return { width, height };
    },
    // 弹框样式
    popupStyle() {
      const radius = this.borderRadius;
      const { width, height } = this.popupSize;
      const styles = {
        width: width + "px",
        height: height + "px",
        backgroundColor: this.backgroundColor,
      };
      switch (this.mode) {
        case "top":
          styles.borderRadius = `0px 0px ${radius} ${radius}`;
          break;
        case "bottom":
          styles.borderRadius = `${radius} ${radius} 0px 0px`;
          break;
        case "left":
          styles.borderRadius = `0px ${radius} ${radius} 0px`;
          break;
        case "right":
          styles.borderRadius = `${radius} 0px 0px ${radius}`;
          break;
        default:
          break;
      }
      return styles;
    },
    // 下滑关闭阈值
    thresholdValue() {
      let value;
      switch (this.mode) {
        case "top":
        case "bottom":
          value = this.popupSize.height;
          break;
        case "left":
        case "right":
          value = this.popupSize.width;
          break;
        default:
          return {};
      }
      return this.getActualPixel(this.threshold, value);
    },
  },
};
</script>
<style lang="scss" scoped>
.test_view {
  width: 100rpx;
  height: 100rpx;
  margin-left: 100rpx;
  background-color: blueviolet;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: #ffffff;
    font-size: 14px;
  }
}
</style>
