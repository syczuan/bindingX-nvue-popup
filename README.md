## 借助bindingX + popup组件实现手势控制关闭弹框



**仅支持nvue页面** <br>
nvue页面定义: 在pages.json中定义的页面文件的文件后缀为.nvue ,包含嵌入这个.nvue页面的.vue组件; .vue页面中的.nvue组件不属于



*示例项目中`subNvue`页面在`pages.json`中定义时`style`-`mask`属性在部分机型上设置`transparent`会出现纯白背景，请用`rgba(0,0,0,0)`代替*

```json
{
    "id": "xxx",
    "type": "popup",
    "path": "pages/xxx/xxx",
    "style": {
        "mask": "rgba(0,0,0,0)",
    }
}
```





**<font style="color:#e96900">以下组件属性及使用方式仅适合`uView2.0`中的`u-popup`，也可以使用官方扩展组件`uni-popup`或其他，使用非`u-popup`组件时部分参数和使用方式需要对应调整</font>**



#### 组件属性(部分)

|  属性  |      类型      | 默认值 |        <font align="center">备注</font>        |
| :----: | :------------: | :----: | :--------------- |
|  show  |    Boolean     | false  |                         弹框显示状态                         |
| mode | String | "bottom" | 弹框弹出方向 top\|bottom\|left\|right |
| width  | String\|Number |   -    | 弹框宽度 <br> mode=top\|bottom时默认100%<br> mode=left\|right时固定60%<br/> N%: 屏幕可用高度\|宽度百分比<br/> N\|Npx: 像素高度 |
| height | String\|Number |   -    | 弹框高度 <br> mode=top\|bottom时默认50%<br> mode=left\|right时固定100%<br/> N%: 屏幕可用高度\|宽度百分比<br/> N\|Npx: 像素高度 |
| isScreenHeight | Boolean | true | 屏幕高度是否为全屏高度(全屏弹框时设为true)<br>true: screenHeight<br>false: windowHeight |
| duration | String\|Number | 300 | 打开弹框动画时长 单位ms |
| bindTimingDuration | String\|Number | 300 | 手势复位动画时长 单位ms |
| backgroundColor | String | "\#ffffff" | 弹框背景颜色 |
| opacity | String\|Number | 0.5 | 遮罩透明度 |
| fullPan | Boolean | false | 全局弹框手势<br>开启后会与内部滚动视图如scroll-view、list冲突 |
| threshold | String\|Number | "50%" | 滑动关闭阈值<br>N%: 弹框高(宽)度百分比<br/>N\|Npx: 像素高度<br>实际高(宽)度低于弹框高(宽)度时为0 |
| easing | String | "easeOutExpo" | 弹框下滑复位动画<br>参阅 https://easings.net/ |
| borderRadius | String | "10px" | 弹框弹出方向圆角 |



#### 组件方法

*触摸元素绑定touchstart事件，调用触摸滑动*

**onTouchStart**
