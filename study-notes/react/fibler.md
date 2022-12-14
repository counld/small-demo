##  为什么需要react fiber 他是一种数据结构
在数据更新时，react生成了一棵更大的虚拟dom树，给第二步的diff带来了很大压力——我们想找到真正变化的部分，这需要花费更长的时间。js占据主线程去做比较，渲染线程便无法做其他工作，用户的交互得不到响应，所以便出现了react fiber。

react fiber没法让比较的时间缩短，但它使得diff的过程被分成一小段一小段的，因为它有了“保存工作进度”的能力。js会比较一部分虚拟dom，然后让渡主线程，给浏览器去做其他工作，然后继续比较，依次往复，等到最后比较完成，一次性更新到视图上

## 在老的架构中diff 的缺陷
在老的架构中，节点以树的形式被组织起来：每个节点上有多个指针指向子节点。要找到两棵树的变化部分，最容易想到的办法就是深度优先遍历，规则如下：

从根节点开始，依次遍历该节点的所有子节点；

当一个节点的所有子节点遍历完成，才认为该节点遍历完成；

如果你系统学习过数据结构，应该很快就能反应过来，这不过是深度优先遍历的后续遍历。根据这个规则，在图中标出了节点完成遍历的顺序

### react fiber使得diff阶段有了被保存工作进度的能力
---- react fiber的渲染可以被中断的原因。树和fiber虽然看起来很像，但本质上来说，一个是树，一个是链表。
------- 每个节点有三个指针：分别指向第一个子节点、下一个兄弟节点、父节点。这种数据结构就是fiber

## fiber没被使用
我们要找到前后状态变化的部分，必须把所有节点遍历

这种遍历有一个特点，必须一次性完成。假设遍历发生了中断，虽然可以保留当下进行中节点的索引，下次继续时，我们的确可以继续遍历该节点下面的所有子节点，但是没有办法找到其父节点——因为每个节点只有其子节点的指向。断点没有办法恢复，只能从头再来一遍

## fiber出现后
在新的架构中，每个节点有三个指针：分别指向第一个子节点、下一个兄弟节点、父节点。这种数据结构就是fiber，它的遍历规则如下：

从根节点开始，依次遍历该节点的子节点、兄弟节点，如果两者都遍历了，则回到它的父节点；

当一个节点的所有子节点遍历完成，才认为该节点遍历完成

## fiber 怎么是链表结构呢
fiber是纤程
之所以被叫做fiber，因为fiber的翻译是纤程，它被认为是协程的一种实现形式。协程是比线程更小的调度单位：它的开启、暂停可以被程序员所控制。具体来说，react fiber是通过requestIdleCallback这个api去控制的组件渲染的“进度条”

但由于兼容性不好，加上该回调函数被调用的频率太低，react实际使用的是一个polyfill(自己实现的api)，而不是requestIdleCallback


### 总结一下了
 React Fiber是React 16提出的一种更新机制，使用链表取代了树，将虚拟dom连接，使得组件更新的流程可以被中断恢复；它把组件渲染的工作分片，到时会主动让出渲染主线程

###  为什么新的架构使用fiber后效果更好
这两点都是fiber带给我们的吗——用户响应变快是可以理解的，但使用react fiber能带来渲染的加速吗
动画变流畅的根本原因，一定是一秒内可以获得更多动画帧。但是当我们使用react fiber时，并没有减少更新所需要的总时间

动画实现：组件动画效果并不是直接修改width获得的，而是使用的transform:scale属性搭配3D变换。如果你听说过硬件加速，大概知道为什么了：这样设置页面的重新渲染不依赖上图中的渲染主线程，而是在GPU中直接完成。也就是说，这个渲染主线程线程只用保证有一些时间片去响应用户交互就可以了
-<SierpinskiTriangle x={0} y={0} s={1000}>
+<SierpinskiTriangle x={0} y={0} s={1000*t}>
    {this.state.seconds}
</SierpinskiTriangle>

把图形的变化改为宽度width修改，会发现即使用react fiber，动画也会变得相当卡顿，所以这里的流畅主要是CSS动画的功劳。（内存不大的电脑谨慎尝试，浏览器会卡死）

####   react不如vue？
我们现在已经知道了react fiber是在弥补更新时“无脑”刷新，不够精确带来的缺陷。这是不是能说明react性能更差呢？

并不是。孰优孰劣是一个很有争议的话题，在此不做评价。因为vue实现精准更新也是有代价的，一方面是需要给每一个组件配置一个“监视器”，管理着视图的依赖收集和数据更新时的发布通知，这对性能同样是有消耗的；另一方面vue能实现依赖收集得益于它的模版语法，实现静态编译，这是使用更灵活的JSX语法的react做不到的

`````
https://blog.csdn.net/frontend_frank/article/details/123700502
`````