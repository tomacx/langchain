

# 概述

本手册主要包括几何函数（[gFun类对象](#数学函数对象（gFun）)）、矩阵运算（[Matrix类](#矩阵类（Matrix）)）及神经网络（[ai类对象](#神经网络对象（ai）)）三两部分，供终端用户求解使用。 

# 数学函数对象（gFun）

##### 说明

提供了向量、几何、力学相关的数学函数。



## sqr方法

###### 说明

计算数值的平方。

###### 格式定义

var <*fValue*\> = gFun.sqr(*fValue*);

###### 参数

*fValue*

> 浮点型，待求平方值的数值。

###### 备注

###### 范例

```js
//计算数值1.2的平方值
var fValue = gFun.sqr(1.2);
```



## genRandomValue方法

###### 说明

产生一个满足某种分布的随机参数。

###### 格式定义

var <*fValue*> = gFun.genRandomValue(*sType, fPra1, fPra2*);

###### 参数

*sType*

> 整数型，为随机类型的ID号，只能为1、2、3，其中1-uniform，2-normal，3-weibull。

*fPra1*

> 浮点型，随机参数。

*fPra2*

> 浮点型，随机参数。

###### 备注

>如果分布模式为1，即uniform分布，*fPra1*及*fPra2*分别表示随机参数的下限及上限。

>如果分布模式为2，即normal分布，随机公式$y=\mu+\sigma x$，$x=\sum\limits_{n=1}^{12}{{{r}_{n}}}-6$，$\mu$期望，$\sigma$标准差，${r}_{n}$为0-1之间均匀分布随机数，*fPra1*及*fPra2*分别表示随机值的期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

>如果分布模式为3，即weibull分布，*fPra1*及*fPra2*分别表示威布尔分布的$k$及$\lambda$值，weibull分布概率密度函数为$f(x)=\left\{ \begin{align}
>& \frac{k}{\lambda }{{(\frac{x}{\lambda })}^{k-1}}{{e}^{-{{(x/\lambda )}^{k}}}}\begin{matrix}
>&  x\ge 0  \\
>\end{matrix} \\ 
> & 0\begin{matrix}
>&  & &  & &  & & & x <0  \\
>\end{matrix} \\ 
>\end{align} \right.$，概率为$F(x)=1-{{e}^{-{{(x/\lambda )}^{k}}}}$，$x$为随机变量，$\lambda>0$为比例因子，$k>0$为形状参数（$k=1$为指数分布，$k=2$为瑞利分布），数值实现时，随机数公式$x=\lambda {{(-\ln (u))}^{1/k}}$，其中$\mu$为0-1的均匀分布值）。

###### 范例

```js
//产生随机参数
var a = gFun.genRandomValue(1, 1e3, 1e5);
```



## vectorModulus方法

###### 说明

计算向量的模。

###### 格式定义

var <*fValue*\> = gFun.vectorModulus(*fArrayValue*);

###### 参数

*fArrayValue*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

###### 备注

###### 范例

```js
//向量vecA
var vecA = new Array();
vecA = [2,3,2];

//计算向量vecA的模
var fValue = gFun.vectorModulus(vecA);
```



## vectorPlus方法

###### 说明

计算两个向量的和。

###### 格式定义

var <*fArrayValueC*\> = gFun.vectorPlus(*fArrayValueA, fArrayValueB*);

###### 参数

*fArrayValueA*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueB*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueC*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

###### 备注

###### 范例

```js
//向量vecA
var vecA = new Array();
vecA = [2,3,4];

//向量vecB
var vecB = new Array();
vecB = [1,2,3];

//计算向量vecA和向量vecB的和vecC
var vecC = gFun.vectorPlus(vecA, vecB);
```



## vectorSub方法

###### 说明

计算两个向量的差。

###### 格式定义

var <*fArrayValueC*\> = gFun.vectorSub(*fArrayValueA, fArrayValueB*);

###### 参数

*fArrayValueA*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueB*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueC*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

###### 备注

fArrayValueC = fArrayValueA - fArrayValueB

###### 范例

```js
//向量vecA
var vecA = new Array();
vecA = [2,3,4];

//向量vecB
var vecB = new Array();
vecB = [1,2,3];

//计算向量vecA和向量vecB的差vecC
var vecC = gFun.vectorSub(vecA, vecB);
```



## vectorDocProduct方法

###### 说明

计算两个向量的点积。

###### 格式定义

var <*fValue*\> = gFun.vectorDocProduct(*fArrayValueA, fArrayValueB);

###### 参数

*fArrayValueA*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueB*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

###### 备注

###### 范例

```js
//向量vecA
var vecA = new Array();
vecA = [2,3,4];

//向量vecB
var vecB = new Array();
vecB = [1,2,3];

//计算向量vecA和向量vecB的点积
var fValue = gFun.vectorDocProduct(vecA, vecB);
```



## vectorProvec方法

###### 说明

计算两个向量的叉积。

###### 格式定义

var <*fArrayValueC*\> = gFun.vectorProvec(*fArrayValueA, fArrayValueB*);

###### 参数

*fArrayValueA*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueB*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueC*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

###### 备注

###### 范例

```js
//向量vecA
var vecA = new Array();
vecA = [2,3,4];

//向量vecB
var vecB = new Array();
vecB = [1,2,3];

//计算向量vecA和向量vecB的叉积vecC
var vecC = gFun.vectorProvec(vecA, vecB);
```



## vectorNorm方法

###### 说明

计算单位化后的向量。

###### 格式定义

var <*fArrayValueA0*\> = gFun.vectorNorm(*fArrayValueA*);

###### 参数

*fArrayValueA*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueA0*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

###### 备注

###### 范例

```js
//向量vecA
var vecA = new Array();
vecA = [2,0,2];

//计算向量vecA的单位向量vecA0
var vecA0 = gFun.vectorNorm(vecA);
```



## vectorRotat方法

###### 说明

计算坐标点旋转一定角度后得到的新坐标。

###### 格式定义

var <*fArrayValueC*\> = gFun.vectorRotat(*fArrayValueA, fArrayValueB, fValue*);

###### 参数

*fArrayValueA*

> 浮点型，含3个分量，分别为旋转原点处x、y、z方向的坐标。

*fArrayValueB*

> 浮点型，含3个分量，分别为旋转点处x、y、z方向的坐标。

*fArray*

> 浮点型，为坐标的旋转角度。

*fArrayValueC*

> 浮点型，含3个分量，分别为旋转后的新坐标点在x、y、z方向的分量。

###### 备注

转动方向以逆时针为正。

###### 范例

```js
//旋转原点坐标
var A = new Array();
A = [1,1,1];

//旋转点坐标
var B = new Array();
B = [3,2,1];

//旋转角度
var fAngle = 30;

//计算坐标旋转一定角度后得到的新坐标
var C = gFun.vectorRotat(A, B, fAngle);
```



## vectorSine方法

###### 说明

计算两个向量夹角的正弦值。

###### 格式定义

var <*fValue*\> = gFun.vectorSine(*fArrayValueA, fArrayValueB);

###### 参数

*fArrayValueA*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

*fArrayValueB*

> 浮点型，含3个分量，分别为向量x、y、z方向的分量。

###### 备注

###### 范例

```js
//向量vecA
var vecA = new Array();
vecA = [2,3,4];

//向量vecB
var vecB = new Array();
vecB = [1,2,3];

//计算向量vecA和向量vecB夹角的正弦值
var fValue = gFun.vectorSine(vecA, vecB);
```



## isPointInLineS方法

###### 说明

判断点是否在线段上 。

###### 格式定义

var <*iFlag*\> = gFun.isPointInLineS(*fArrayValueP, fArrayValueL1, fArrayValueL2*);

###### 参数

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueL1*

> 浮点型，含3个分量，分别为线段一个端点x、y、z方向的坐标。

*fArrayValueL2*

> 浮点型，含3个分量，分别为线段另一端点x、y、z方向的坐标。

###### 备注

若点在线段上，返回为true， 否则返回为false。

###### 范例

```js
//点P坐标,线段两端L1、L2坐标
var P = new Array();
P = [1,1,2];

var L1 = new Array();
L1 = [0,0,0];

var L2 = new Array();
L2 = [10,10,5];

//判断点P是否在线段L上
var iFlag = gFun.isPointInLineS(P, L1, L2);
```



## isPointAbovePlane方法

###### 说明

判断点是否在平面上方 。

###### 格式定义

var <*iFlag*\> = gFun.isPointAbovePlane(*fArrayValueP, fArrayValueF, fArrayValueN*);

###### 参数

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueF*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

*fArrayValueN*

> 浮点型，含3个分量，分别为平面法向向量在点x、y、z方向的分量。

###### 备注

若点在平面上方，返回为true， 否则返回为false。

###### 范例

```js
//点P坐标,平面上一点F坐标，平面的法向向量n
var P = new Array();
P = [1,1,2];

var F = new Array();
F = [0,0,0];

var n = new Array();
n = [1,1,0];

//判断点P是否在平面上方
var iFlag = gFun.isPointAbovePlane(P, F, n);
```



## isPointInCubic方法

###### 说明

判断点是否在六面体内部 。

###### 格式定义

var <*iFlag*\> = gFun.isPointInCubic(*fArrayValueP, fArrayValueA1, fArrayValueA2*);

###### 参数

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueA1*

> 浮点型，含3个分量，分别为六面体一顶点在x、y、z方向的坐标。

*fArrayValueA2*

> 浮点型，含3个分量，分别为六面体A1顶点对角处的顶点在x、y、z方向的坐标。

###### 备注

若点在六面体内部，返回为true， 否则返回为false。

###### 范例

```js
//点P坐标,六面体两个顶点A1、A2坐标
var P = new Array();
P = [1,1,2];

var A1 = new Array();
A1 = [0,0,0];

var A2 = new Array();
A2 = [10,10,5];

//判断点P是否六面体内部
var iFlag = gFun.isPointInCubic(P, A1, A2);
```



## isPointInCylinder方法

###### 说明

判断点是否在两个圆柱之间 。

###### 格式定义

var <*iFlag*\> = gFun.isPointInCylinder(*fArrayValueP, fArrayValueP1, fArrayValueP2, fValueR1, fValueR2,*);

###### 参数

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueP1*

> 浮点型，含3个分量，分别为圆柱底部中心点在x、y、z方向的坐标。

*fArrayValueP2*

> 浮点型，含3个分量，分别为圆柱顶部中心点在x、y、z方向的坐标。

*fValueR1*

> 浮点型，为内圆柱半径。

*fValueR2*

> 浮点型，为外圆柱半径。

###### 备注

若点在两个圆柱之间，返回为true， 否则返回为false。

###### 范例

```js
//点P坐标
var P = new Array();
P = [12,12,6];

//圆柱底部中心点P1、顶部中心点P2、内半径R1、外半径R2
var P1 = new Array();
P1 = [0,0,10];

var P2 = new Array();
P2 = [0,0,30];

var R1 = 12;
var R2 = 21;

//判断点P是否在两个圆柱之间
var iFlag = gFun.isPointInCylinder(P, P1, P2, R1, R2);
```



## isLineParaLine方法

###### 说明

判断线与线是否平行 。

###### 格式定义

var <*iFlag*\> = gFun.isLineParaLine(*fArrayValueLA1, fArrayValueLA2, fArrayValueLB1, fArrayValueLB2*);

###### 参数

*fArrayValueLA1*

> 浮点型，含3个分量，分别为线LA上一点x、y、z方向的坐标。

*fArrayValueLA2*

> 浮点型，含3个分量，分别为线LA上另一点x、y、z方向的坐标。

*fArrayValueLB1*

> 浮点型，含3个分量，分别为线LB上一个点x、y、z方向的坐标。

*fArrayValueLB2*

> 浮点型，含3个分量，分别为线LB上另一点x、y、z方向的坐标。

###### 备注

若线与线平行，返回为true， 否则返回为false。

###### 范例

```js
//线LA两个点LA1、LA2的坐标，线LB两个点LB1、LB2的坐标
var LA1 = new Array();
LA1 = [0,0,0];

var LA2 = new Array();
LA2 = [12,12,7];

var LB1 = new Array();
LB1 = [1,1,0];

var LB2 = new Array();
LB2 = [21,21,7];

//判断线LA与线LB是否平行
var iFlag = gFun.isLineParaLine(LA1, LA2, LB1, LB2);
```



## isLineParaPlane方法

###### 说明

判断线与平面是否平行。

###### 格式定义

var <*iFlag*\> = gFun.isLineParaPlane(*fArrayValueL1, fArrayValueL2, fArrayValueF1, fArrayValueF2, fArrayValueF3*);

###### 参数

*fArrayValueL1*

> 浮点型，含3个分量，分别为线L上一点x、y、z方向的坐标。

*fArrayValueL2*

> 浮点型，含3个分量，分别为线L上另一点x、y、z方向的坐标。

*fArrayValueF1*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

*fArrayValueF2*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

*fArrayValueF3*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

###### 备注

若线与平面平行，返回为true， 否则返回为false。

###### 范例

```js
//线L两个点L1、L2的坐标
var L1 = new Array();
L1 = [0,0,0];

var L2 = new Array();
L2 = [0,0,10];

//平面F上三个点F1、F2、F3的坐标
var F1 = new Array();
F1 = [0,0,-2];

var F2 = new Array();
F1 = [1,1,2];

var F3 = new Array();
F1 = [0,0,2];

//判断线L与平面A是否平行
var Point = gFun.pointLine2Plane(L1, L2, F1, F2, F3);
```



## isLineSInterLineS方法

###### 说明

判断线段与线段是否相交。

###### 格式定义

var <*iFlag*\> = gFun.isLineSInterLineS(*fArrayValueLA1, fArrayValueLA2, fArrayValueLB1, fArrayValueLB2*);

###### 参数

*fArrayValueLA1*

> 浮点型，含3个分量，分别为线段LA上一个端点x、y、z方向的坐标。

*fArrayValueLA2*

> 浮点型，含3个分量，分别为线段LA上另一端点x、y、z方向的坐标。

*fArrayValueLB1*

> 浮点型，含3个分量，分别为线段LB上一个端点x、y、z方向的坐标。

*fArrayValueLB2*

> 浮点型，含3个分量，分别为线段LB上另一端点x、y、z方向的坐标。

###### 备注

若线段与线段相交，返回为true， 否则返回为false。

###### 范例

```js
//线段LA两个端点LA1、LA2的坐标，线段LB两个端点LB1、LB2的坐标
var LA1 = new Array();
LA1 = [0,0,0];

var LA2 = new Array();
LA2 = [10,10,5];

var LB1 = new Array();
LB1 = [0,0,0];

var LB2 = new Array();
LB2 = [20,20,5];
//判断线段LA与线段LB是否相交
var iFlag = gFun.isLineSInterLineS(LA1, LA2, LB1, LB2);
```



## disPoint2Point方法

###### 说明

计算点到点的距离。

###### 格式定义

var <*fValue*\> = gFun.disPoint2Point(*fArrayValueP1, fArrayValueP2*);

###### 参数

*fArrayValueP1*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueP2*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//点P1坐标,点P2坐标
var P1 = new Array();
P1 = [0,0,0];

var P2 = new Array();
P2 = [5,0,3];

//计算点P1到点P2的距离
var fValue = gFun.disPoint2Point(P1, P2);
```



## disPoint2Line方法

###### 说明

计算点到直线的距离。

###### 格式定义

var <*fValue*\> = gFun.disPoint2Line(*fArrayValueL1, fArrayValueL2, fArrayValueP*);

###### 参数

*fArrayValueL1*

> 浮点型，含3个分量，分别为直线上一点x、y、z方向的坐标。

*fArrayValueL2*

> 浮点型，含3个分量，分别为直线上另一点x、y、z方向的坐标。

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//直线L上两点L1、L2坐标，点P坐标
var L1 = new Array();
L1 = [0,0,0];

var L2 = new Array();
L2 = [10,10,0];

var P = new Array();
P = [1,1,1];
//计算点P到直线L的距离
var fValue = gFun.disPoint2Line(L1, L2, P);
```



## disPoint2Plane方法

###### 说明

计算点到平面的距离。

###### 格式定义

var <*fValue*\> = gFun.disPoint2Plane(*fArrayValueP, fArrayValueF, fArrayValueN*);

###### 参数

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueF*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

*fArrayValueN*

> 浮点型，含3个分量，分别为平面法向向量在点x、y、z方向的分量。

###### 备注

###### 范例

```js
//点P坐标,平面A上一点F坐标，平面的法向向量n
var P = new Array();
P = [0,0,2];

var F = new Array();
F = [0,0,0];

var n = new Array();
n = [0,0,1];

//计算点P到平面A的距离
var fValue = gFun.disPoint2Plane(P, F, n);
```



## disLineS2LineS方法

###### 说明

计算线段到线段的距离。

###### 格式定义

var <*fValue*\> = gFun.disLineS2LineS(*fArrayValueLA1, fArrayValueLA2, fArrayValueLB1, fArrayValueLB2*);

###### 参数

*fArrayValueLA1*

> 浮点型，含3个分量，分别为线段LA上一个端点x、y、z方向的坐标。

*fArrayValueLA2*

> 浮点型，含3个分量，分别为线段LA上另一端点x、y、z方向的坐标。

*fArrayValueLB1*

> 浮点型，含3个分量，分别为线段LB上一个端点x、y、z方向的坐标。

*fArrayValueLB2*

> 浮点型，含3个分量，分别为线段LB上另一端点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//线段LA两个端点LA1、LA2的坐标，线段LB两个端点LB1、LB2的坐标
var LA1 = new Array();
LA1 = [0,0,0];

var LA2 = new Array();
LA2 = [10,10,5];

var LB1 = new Array();
LB1 = [1,1,0];

var LB2 = new Array();
LB2 = [20,20,5];
//计算线段LA到线段LB的距离
var fValue = gFun.disLineS2LineS(LA1, LA2, LB1, LB2);
```



## pointPoint2Line方法

###### 说明

计算点到直线的垂足。

###### 格式定义

var <*fValue*\> = gFun.pointPoint2Line(*fArrayValueL1, fArrayValueL2, fArrayValueP*);

###### 参数

*fArrayValueL1*

> 浮点型，含3个分量，分别为直线上一点x、y、z方向的坐标。

*fArrayValueL2*

> 浮点型，含3个分量，分别为直线上另一点x、y、z方向的坐标。

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//直线L上两点L1、L2坐标，点P坐标
var L1 = new Array();
L1 = [0,0,0];

var L2 = new Array();
L2 = [10,10,0];

var P = new Array();
P = [1,1,1];

//计算点P到直线L的垂足
var Point = gFun.pointPoint2Line(L1, L2, P);
```



## pointPoint2Plane方法

###### 说明

计算点到平面的垂足。

###### 格式定义

var <*fValue*\> = gFun.pointPoint2Plane(*fArrayValueF, fArrayValueN, fArrayValueP*);

###### 参数

*fArrayValueF*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

*fArrayValueN*

> 浮点型，含3个分量，分别为平面法向向量在点x、y、z方向的分量。

*fArrayValueP*

> 浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//平面A上一点F坐标，平面的法向向量n,点P坐标
var F = new Array();
F = [0,0,0];

var n = new Array();
n = [0,0,1];

var P = new Array();
P = [0,0,2];

//计算点P到平面A的垂足
var Point = gFun.pointPoint2Plane(F, n, P);
```



## pointLine2Line方法

###### 说明

计算线与线的交点。

###### 格式定义

var <*fValue*\> = gFun.pointLine2Line(*fArrayValueLA1, fArrayValueLA2, fArrayValueLB1, fArrayValueLB2*);

###### 参数

*fArrayValueLA1*

> 浮点型，含3个分量，分别为线LA上一点x、y、z方向的坐标。

*fArrayValueLA2*

> 浮点型，含3个分量，分别为线LA上另一点x、y、z方向的坐标。

*fArrayValueLB1*

> 浮点型，含3个分量，分别为线LB上一个点x、y、z方向的坐标。

*fArrayValueLB2*

> 浮点型，含3个分量，分别为线LB上另一点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//线LA两个点LA1、LA2的坐标，线LB两个点LB1、LB2的坐标
var LA1 = new Array();
LA1 = [0,0,0];

var LA2 = new Array();
LA2 = [10,10,5];

var LB1 = new Array();
LB1 = [1,1,0];

var LB2 = new Array();
LB2 = [20,20,5];

//计算线LA与线LB的交点
var Point = gFun.pointLine2Line(LA1, LA2, LB1, LB2);
```



## pointLine2Plane方法

###### 说明

计算线与平面的交点。

###### 格式定义

var <*fValue*\> = gFun.pointLine2Plane(*fArrayValueL1, fArrayValueL2, fArrayValueF1, fArrayValueF2, fArrayValueF3*);

###### 参数

*fArrayValueL1*

> 浮点型，含3个分量，分别为线L上一点x、y、z方向的坐标。

*fArrayValueL2*

> 浮点型，含3个分量，分别为线L上另一点x、y、z方向的坐标。

*fArrayValueF1*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

*fArrayValueF2*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

*fArrayValueF3*

> 浮点型，含3个分量，分别为平面上一点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//线L两个点L1、L2的坐标
var L1 = new Array();
L1 = [0,0,0];

var L2 = new Array();
L2 = [0,0,10];

//平面F上三个点F1、F2、F3的坐标
var F1 = new Array();
F1 = [0,0,-2];

var F2 = new Array();
F2 = [1,1,-2];

var F3 = new Array();
F3 = [0,1,-2];

//计算线L与平面A的交点
var Point = gFun.pointLine2Plane(L1, L2, F1, F2, F3);
```



## angleTri方法

###### 说明

计算三角形角度。

###### 格式定义

var <*fArrayValue*\> = gFun.angleTri(*fArrayValueA, fArrayValueB, fArrayValueC*);

###### 参数

*fArrayValue*

> 浮点型，含2个分量，分别为三角形的两个角度。

*fArrayValueA*

*fArrayValueB*

*fArrayValueC*

> 三角形三个点的坐标。浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//三角形三个点的坐标值
var A = new Array();
A = [0,0,2];

var B = new Array();
B = [0,2,0];

var C = new Array();
C = [2,0,0];

//计算三角形角度
var fArrayValue = gFun.angleTri(A, B, C);
```



## volTri方法

###### 说明

计算三角形的面积。

###### 格式定义

var <*fValue*\> = gFun.volTri(*fArrayValueA, fArrayValueB, fArrayValueC*);

###### 参数

*fArrayValueA*

*fArrayValueB*

*fArrayValueC*

> 三角形三个点的坐标。浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//三角形三个点的坐标值
var A = new Array();
A = [0,0,2];

var B = new Array();
B = [0,2,0];

var C = new Array();
C = [2,0,0];

//计算三角形的面积
var fValue = gFun.volTri(A, B, C);
```



## volTetr方法

###### 说明

计算四面体的体积。

###### 格式定义

var <*fValue*\> = gFun.volTetr(*fArrayValueA, fArrayValueB, fArrayValueC*);

###### 参数

*fArrayValueA*

*fArrayValueB*

*fArrayValueC*

> 四面体底面的坐标值。浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//四面体底面三个点的坐标值
var A = new Array();
A = [0,0,2];

var B = new Array();
B = [0,2,0];

var C = new Array();
C = [2,0,0];

//计算四面体的体积
var fValue = gFun.volTetr(A, B, C);
```



## weightTri方法

###### 说明

计算三角形中某点的插值系数。

###### 格式定义

var <*fValueArray*\> = gFun.weightTri(*fArrayValueA, fArrayValueB, fArrayValueC, fArrayValueP*);

###### 参数

*fArrayValue*

> 浮点型，含3个分量，分别为三角形中的3个插值系数。

*fArrayValueA*

*fArrayValueB*

*fArrayValueC*

> 三角形三个点的坐标。浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueP*

> 待求插值系数的点。浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//三角形三个点的坐标值
var A = new Array();
A = [0,0,0];

var B = new Array();
B = [0,2,0];

var C = new Array();
C = [2,0,0];

//插值点P的坐标值
var P = new Array();
P = [1,1,0];

//计算三角形中P点的插值系数
var fArrayValue = gFun.weightTri(A, B, C, P);
```



## weightQuad方法

###### 说明

计算四边形中某点的插值系数。

###### 格式定义

var <*fValueArray*\> = gFun.weightQuad(*fArrayValueA, fArrayValueB, fArrayValueC, fArrayValueD, fArrayValueP*);

###### 参数

*fArrayValue*

> 浮点型，含4个分量，分别为四边形中的4个插值系数。

*fArrayValueA*

*fArrayValueB*

*fArrayValueC*

*fArrayValueD*

> 四边形四个点的坐标。浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueP*

> 待求插值系数的点。浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//四边形四个点的坐标值
var A = new Array();
A = [0,0,0];

var B = new Array();
B = [0,2,0];

var C = new Array();
C = [2,2,0];

var D = new Array();
D = [2,0,0];

//插值点P的坐标值
var P = new Array();
P = [1,1,0];

//计算四边形中P点的插值系数
var fArrayValue = gFun.weightQuad(A, B, C, D, P);
```



## weightWedge方法

###### 说明

计算规则五面体的插值系数。

###### 格式定义

var <*fValueArray*\> = gFun.weightWedge(*fArrayValueA, fArrayValueB, fArrayValueC, fArrayValueD, fArrayValueE, fArrayValueF, fArrayValueP*);

###### 参数

*fArrayValue*

> 浮点型，含6个分量，分别为五面体中的6个插值系数。

*fArrayValueA*

*fArrayValueB*

*fArrayValueC*

*fArrayValueD*

*fArrayValueE*

*fArrayValueD*

> 五面体六个点的坐标。浮点型，含3个分量，分别为点x、y、z方向的坐标。

*fArrayValueP* 

> 待求插值系数的点。浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//五面体六个点的坐标值
var A = new Array();
A = [1,1,2];

var B = new Array();
B = [0,0,0];

var C = new Array();
C = [2,0,0];

var D = new Array();
D = [2,1,0];

var E = new Array();
E = [1,2,0];

var F = new Array();
F = [0,1,0];

//插值点P的坐标值
var P = new Array();
P = [1,1,0];

//计算五面体中P点的插值系数
var fArrayValue = gFun.weightWedge(A, B, C, D, E, F, P);
```



## localCoordSystem方法

###### 说明

计算平面的局部坐标系。

###### 格式定义

var <*fArrayValueLocalSys*> = gFun.localCoordSystem(*fArrayValueP1, fArrayValueP2, fArrayValueP3*);

###### 参数

*fArrayValueLocalSys*

> 浮点型，3×3的二维数组，为局部坐标系的三个方向分量。

*fArrayValueP1* 

*fArrayValueP2*

*fArrayValueP3*

> 平面上三个点的坐标。浮点型，含3个分量，分别为点x、y、z方向的坐标。

###### 备注

###### 范例

```js
//平面上三个点的坐标值
var A = new Array();
A = [0,0,0];

var B = new Array();
B = [0,2,0];

var C = new Array();
C = [2,2,2];

//计算平面的局部坐标系
var localSys = gFun.localCoordSystem(A, B, C);
```



## pointGlo2Loc方法

###### 说明

计算坐标由全局坐标系转到局部坐标系后的值。

###### 格式定义

var <*fArrayValuePT*> = gFun.pointGlo2Loc(*fArrayValueLocalSys, fArrayValueP*);

###### 参数

*fArrayValuePT*

> 浮点型，含3个分量，为局部坐标系下的点的坐标。

*fArrayValueLocalSys*

> 浮点型，3×3的二维数组，为局部坐标系的三个方向分量。

*fArrayValueP*

> 浮点型，含3个分量，为全局坐标系下的点的坐标。

###### 备注

###### 范例

```js
//局部坐标系
var localSys =[[1,0,0],[0,0,1],[0,1,0]]

//全局坐标系下的点p
var p = [1,1,1]

//计算全局坐标p转到局部坐标系后的坐标值pt。
var pt = gFun.pointGlo2Loc(localSys, p);
```



## pointLoc2Glo方法

###### 说明

计算坐标由局部坐标系转到全局坐标系后的值。

###### 格式定义

var <*fArrayValuePT*> = gFun.pointLoc2Glo(*fArrayValueLocalSys, fArrayValueP*);

###### 参数

*fArrayValuePT*

> 浮点型，含3个分量，为全局坐标系下的点的坐标。

*fArrayValueLocalSys*

> 浮点型，3×3的二维数组，为局部坐标系的三个方向分量。

*fArrayValueP*

> 浮点型，含3个分量，为局部坐标系下的点的坐标。

###### 备注

###### 范例

```js
//局部坐标系
var localSys =[[1,0,0],[0,0,1],[0,1,0]]

//局部坐标系下的点p
var p = [1,1,1]

//计算局部坐标p转到全局坐标系后的坐标值pt。
var pt = gFun.pointLoc2Glo(localSys, p);
```



## tensorGlo2Loc方法

###### 说明

计算张量由全局坐标系转到局部坐标系后的值。

###### 格式定义

var <*fArrayValueT*> = gFun.tensorGlo2Loc(*fArrayValueLocalSys, fArrayValue*);

###### 参数

*fArrayValueT*

> 浮点型，含6个分量，为局部坐标系下的张量。

*fArrayValueLocalSys*

> 浮点型，3×3的二维数组，为局部坐标系的三个方向分量。

*fArrayValue*

> 浮点型，含6个分量，为全局坐标系下的张量。

###### 备注

###### 范例

```js
//局部坐标系
var localSys =[[1,0,0],[0,0,1],[0,1,0]]

//全局坐标系下的张量
var T = [1,1,1]

//计算张量由全局坐标系转到局部坐标系后的值
var T2 = gFun.tensorGlo2Loc(localSys, T);
```



## tensorLoc2Glo方法

###### 说明

计算张量由局部坐标系转到全局坐标系后的值。

###### 格式定义

var <*fArrayValueT*> = gFun.tensorLoc2Glo(*fArrayValueLocalSys, fArrayValue*);

###### 参数

*fArrayValueT*

> 浮点型，含6个分量，为全局坐标系下的张量。

*fArrayValueLocalSys*

> 浮点型，3×3的二维数组，为局部坐标系的三个方向分量。

*fArrayValue*

> 浮点型，含6个分量，为局部坐标系下的张量。

###### 备注

###### 范例

```js
//局部坐标系
var localSys =[[1,0,0],[0,0,1],[0,1,0]]

//局部坐标系下的张量
var T = [1,1,1]

//计算张量由局部坐标系转到全局坐标系后的值
var T2 = gFun.tensorLoc2Glo(localSys, T);
```



## prinStress方法

###### 说明

计算计算主应力与主方向。

###### 格式定义

var <*aObject*> = gFun.prinStress(*fArrayValue*);

###### 参数

*fArrayValue*

> 浮点型，含6个分量，为应力值。

*aObject*

> 类类型，包含计算的三个主应力与主方向。

###### 备注

通过 aObject.Stress 得到计算的三个主应力，依次为最大主应力、中间主应力与最小主应力。

通过 aObject.CoordSys 得到计算的三个主方向。

###### 范例

```js
//局部坐标系
var stress = [1e4, 1e4, 2e4, 5e3, 1e4, 1e4]

//计算张量由局部坐标系转到全局坐标系后的值
var S = gFun.prinStress(stress);

//得到主应力
var a = S.Stress;
//得到主方向
var b = S.CoordSys;
```



## calArbi3DModelInfo方法

###### 说明

计算任意多面体的体信息（包括体积、体心坐标、质量、转动张量等）。

###### 格式定义

var <*aObject*> =gFun.calArbi3DModelInfo(<*pBoundMesh, fDensity [, nTotal [, nPrtFlag [, nExpParFlag]] ]*>);;

###### 参数

*pBoundMesh*

> Mesh对象，该Mesh对应由三角形或四边形组成，表征了某一多面体的边界。

*fDensity*

> 浮点型，多面体的密度（单位：kg/m^3）。

*nTotal*

> 整型，模型Bounding box的三个方向长度中最短那个长度被分割Cell的数量（可以不写，默认为100），取值范围为大于0的整数。

*nPrtFlag*

> 整型，是否自动打印计算结果（可以不写，默认为打印），只能为0或1,0表示不打印，1表示打印。

*nExpParFlag*

> 整型，是否导出PDyna格式的颗粒网格（用于查看Cell划分的正确性，以及供PDyna进行计算），只能为0或1,0表示不输出，1表示输出。

###### 备注

该脚本适用于计算任意类型的三维多面体，包括联通的及不连通的，凸的或凹的；算法原理是用背景Cell将进行覆盖，判定每个Cell的体心是否位于模型内部，对位于模型内部的Cell进行累加，从而获得三维模型的信息。

通过 aObject.dens得到密度，通过 aObject.vol得到体积，通过 aObject.mass得到质量。

通过aObject.centroid得到体心坐标（包含3个分量的数组）。

通过aObject.inertia得到惯性张量（3×3的矩阵）。

###### 范例

```js
//根据cMesh[2]中的物理网格，计算体积信息
var oGeoInfo = gFun.calArbi3DModelInfo(cMesh[2], 1000.0, 100, 1, 1);
//获得密度
var fdens = oGeoInfo.dens;
//获得体积
var fvol  = oGeoInfo.vol;
//获得质量
var fmass = oGeoInfo.mass;
//获得坐标，包含3个分量的数组，
var fCentroid = oGeoInfo.centroid;
print(fCentroid);
//获得转动张量，3×3的矩阵
var fInertia = oGeoInfo.inertia;
print(fInertia);
```



#  矩阵类（Matrix）

##### 说明

提供了矩阵的相关运算功能。

##### 构建方法

###### 格式定义

var *\<obj\>* = new Matrix(<*nRow, nCol[, fArray]*>);

###### 参数

*nRow*

> 整型，矩阵的行数。

*nCol*

> 整型，矩阵的列数。

*fArray*

> 数组类型，矩阵的元素，可缺省，缺省是矩阵元素只为0。

###### 备注

采用 "new" 操作符构建一个矩阵对象。

###### 范例

```js
//实例化一个矩阵，并获取矩阵的行数
var a = new Matrix(3,3, [1,2,3,4,5,6,7,8,9]);
var nRows = a.numRows();
```

## print方法

###### 说明

将矩阵元素输出值屏幕。

###### 格式定义

\<obj\>.print();

###### 参数

> 无。

###### 备注

###### 范例

```js
//实例化一个矩阵，并在屏幕上显示
var a = new Matrix(3,3, [1,2,3,4,5,6,7,8,9]);
a.print();
```

## numRows方法

###### 说明

获得矩阵的行数。

###### 格式定义

var *\<nRows\> = \<obj\>.*numRows();

###### 参数

> 无。

###### 备注

###### 范例

```js
//实例化一个矩阵，并获取矩阵的行数
var a = new Matrix(3,3, [1,2,3,4,5,6,7,8,9]);
var nRows = a.numRows();
```

## numCols方法

###### 说明

获得矩阵的列数。

###### 格式定义

var *\<nCols\> = \<obj\>.*numCols();

###### 参数

> 无。

###### 备注

###### 范例

```js
//实例化一个矩阵，并获取矩阵的行数
var a = new Matrix(3,3, [1,2,3,4,5,6,7,8,9]);
var nRows = a.numCols();
```

## getElements方法

###### 说明

获得矩阵的元素。

###### 格式定义

var *\<obj\> = \<obj\>.*getElements(<*iRow, iCol*>);

###### 参数

*iRow*

> 整型，矩阵的行下标，从0开始。

*iCow*

> 整型，矩阵的列下标，从0开始。

###### 备注

用户也可通过数组下标的方式访问矩阵元素，如a[i] [j].

###### 范例

```js
//获取矩阵的第4行第3列的元素
var fValue = a.getElements(3,2);
//通过数组下标方式获取特定矩阵元素
var fValue = a[3][2];
//通过数组下标方式获取某一行矩阵元素
var afValue = a[3];
```

## setElements方法

###### 说明

设置矩阵的元素。

###### 格式定义

var *\<obj\> = \<obj\>.*getElements(<*iRow, iCol, fValue*>);

###### 参数

*iRow*

> 整型，矩阵的行下标，从0开始。

*iCow*

> 整型，矩阵的列下标，从0开始。

*fValue*

> 浮点型，矩阵元素值。

###### 备注

用户也可通过数组下标的方式设置矩阵元素，如a[i] [j] = 1.0.

###### 范例

```js
//更改矩阵中第2行第3列的元素值为1.5
a.setElements(1,2,1.5);
//通过数组下标方式设置矩阵元素
a[1][2]=1.5;
//通过下标方式设置某行矩阵元素
a[1] = [1,2,3];
```

## transpose方法

###### 说明

矩阵转置。

###### 格式定义

var *\<obj\> = \<obj\>.*transpose();

###### 参数

无。

###### 备注

###### 范例

```js
//矩阵a转置，并赋值为矩阵b
a = new Matrix(2,3,[1,2,3,4,5,6]);
b = a.transpose();
b.print();
```

## equal方法

###### 说明

比较两个矩阵是否相等。

###### 格式定义

var *\<bool\> = \<obj\>.*equal(<*obj*>);

###### 参数

*obj*

> 矩阵对象。

###### 备注

若两个矩阵相等，返回为true， 否则返回为false。

###### 范例

```js
//判断a b矩阵是否相等，并打印至屏幕
print(a.equal(b));
```

## add方法

###### 说明

矩阵相加。

###### 格式定义

var *\<obj\> = \<obj\>.*add(<*obj*>);

###### 参数

*obj*

> 矩阵对象。

###### 备注

两矩阵的维数必须相同。

###### 范例

```js
//矩阵a b相加，并赋值给c
var c = a.add(b);
```

## sub方法

###### 说明

矩阵相减。

###### 格式定义

var *\<obj\> = \<obj\>.*sub(<*obj*>);

###### 参数

*obj*

> 矩阵对象。

###### 备注

两矩阵的维数必须相同。

###### 范例

```js
//矩阵a b相减，并赋值给c
var c = a.sub(b);
```

## valMul方法

###### 说明

矩阵数乘。

###### 格式定义

var *\<obj\> = \<obj\>.*valMul(<*fValue*>);

###### 参数

*fValue*

> 浮点型，与矩阵相乘的数值。

###### 备注

###### 范例

```js
//数字3与矩阵a中的每个元素相乘，并赋值给b
var b = a.valMul(3.0);
```

## crossMul方法

###### 说明

矩阵叉乘。

###### 格式定义

var *\<obj\> = \<obj\>.*crossMul(<*obj*>);

###### 参数

*obj*

> 矩阵类对象。

###### 备注

第一个矩阵的列数必须与第二个矩阵的行数相同。

###### 范例

```js
//矩阵a b相乘，并赋值给c
var c = a.crossMul(b);
```

## dotMul方法

###### 说明

矩阵点积。

###### 格式定义

var *\<fValue\> = \<obj\>.*dotMul(<*obj*>);

###### 参数

*obj*

> 矩阵类对象。

###### 备注

返回值为浮点型，且两矩阵的维数必须相同。

###### 范例

```js
//矩阵a b点积，并赋值给c
var c = a.dotMul(b);
```

## invert方法

###### 说明

矩阵求逆。

###### 格式定义

var *\<obj\> = \<obj\>.*invert();

###### 参数

*obj*

> 矩阵类对象。

###### 备注

###### 参数

无。

###### 备注

###### 范例

```js
//矩阵a求逆，并赋值给c
var c = a.invert();
```

## det方法

###### 说明

求行列式值。

###### 格式定义

var *\<fValue\> = \<obj\>.*det();

###### 参数

无。

###### 备注

###### 范例

```js
//矩阵a的行列式值
var fValue = a.det();
```

# 神经网络对象（ai）

提供了BP神经网络的基本运算。

## 属性

### lossThreshold属性

###### 说明

设置误差阈值。

###### 格式定义

ai.lossThreshold = <*fValue*>;

###### 参数

*fValue*

> 浮点型，对应参数的取值。

###### 备注

###### 范例

```js
ai.lossThreshold = 0.5;
```

### learningRate属性

###### 说明

设置学习步长。

###### 格式定义

ai.learningRate= <*fValue*>;

###### 参数

*fValue*

> 浮点型，对应参数的取值。

###### 备注

###### 范例

```js
ai.learningRate = 0.3;
```

### actFun属性

###### 说明

设置激活函数。

###### 格式定义

ai.actFun= <*iValue*>;

ai.actFun= <*strValue*>;

###### 参数

*iValue*

> 整型，对应参数的取值。

*strValue*

> 字符串型，对应参数的取值。

###### 备注

sigmoid函数对应取值为1，目前仅支持该函数，其他函数待补充。

###### 范例

```js
ai.actFun = "sigmoid";
```

### outputInterval属性

###### 说明

设置输出间隔。

###### 格式定义

ai.outputInterval= <*nValue*>;

###### 参数

*nValue*

> 整型，对应参数的取值。

###### 备注

###### 范例

```js
ai.outputInterval = 200;
```

## 方法

### set方法

###### 说明

设置神经网络计算所需要的基本参数。

###### 格式定义

ai.set(<*strName, fValue*>);

###### 参数

*strName*

> 字符串型，表示设置的参数名称。

*aiValue*

> 浮点型，对应参数的取值。

###### 备注

不同的参数名及对应的参数取值见[附表1](#附表1 可供设置的神经网络变量)。

可通过成员属性进行相同的设置。

###### 范例

```js
//构建一个3层神经网络，每层神经元数分别为15,30，5
ai.set(lossThreshold,0.5);
```



### netLayer方法

###### 说明

构建神经网络的基本模型，包括层数及每层神经元数。

###### 格式定义

ai.netLayer(<*aiValue*>);

###### 参数

*aiValue*

> 数组整型，数组大小表示神经网络的层数（输入层、隐藏层、输出层），数组中的元素值表示每层的神经元数。

###### 备注

###### 范例

```js
//构建一个3层神经网络，每层神经元数分别为15,30，5
ai.netLayer([15,30,5]);
```



### initWeights方法

###### 说明

初始化神经网络的权系数值。

###### 格式定义

ai.initWeights(<*iType, fPara1, fPara2*>);

###### 参数

*iType*

> 整型，表示初始化的方式，1-均匀分布，2-正态分布，3-韦伯分布。

*fPara1, fPara2*

> 浮点型，表示随机参数。

###### 备注

如果分布模式为1-均匀分布，fPra1 及fPra2 分别表示随机参数的下限及上限。

如果分布模式为2-正态分布，fPra1 及fPra2 分别表示随机值的期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

如果分布模式为2-韦伯分布，fPra1 及fPra2 分别表示威布尔分布的k 及λ值。

###### 范例

```js
//以正态分布形式随机初始化神经网络的权系数值。
ai.initWeights(2,0.0,0.1);
```

### initBias方法

###### 说明

初始化神经网络的偏值。

###### 格式定义

ai.initBias(<*fValue*>);

###### 参数

*fValue*

> 浮点型，表示偏值。

###### 备注

###### 范例

```js
ai.initBias(0.5);
```

### importSamples方法

###### 说明

导入训练集。

###### 格式定义

ai.importSamples(<>);

ai.importSamples(<*[strFileName]*>);

###### 参数

*strFileName*

> 字符串型，文件名称，目前支持后缀为.txt 和.dat。

###### 备注

输入样本的文件格式如下图所示，第一行的5和3表示为一共有5个训练样本，每个训练样本有三个参数。其他各行分别为每个样本的参数值。

![Samples](Pic\Samples.png)

###### 范例

```js
ai.importSamples("samples.txt");
```

### importTargets方法

###### 说明

导入训练集。

###### 格式定义

ai.importTargets(<>);

ai.importTargets(<*[strFileName]*>);

###### 参数

*strFileName*

> 字符串型，文件名称，目前支持后缀为.txt 和.dat。

###### 备注

输入样本的文件格式如下图所示，第一行的5和3表示为一共有5个训练标签，每个训练标签有三个参数。其他各行分别为每个标签的参数值。

注：标签文件的各行内容要与样本文件的内容对应。

![Samples](Pic\Samples.png)

###### 范例

```js
ai.importTargets("targets.txt");
```

### train方法

###### 说明

开始训练神经网络。

###### 格式定义

ai.train(<*[nBatchSize]*>);

###### 参数

*nBatchSize*

> 整型，一次训练所选取的样本数，可不写，默认为1。

###### 备注

*nBatchSize*的大小影响模型的优化程度和速度，在没有使用*nBatchSize*之前，这意味着网络在训练时，是一次把所有的数据（整个数据库）输入网络中，然后计算它们的梯度进行反向传播，由于在计算梯度时使用了整个数据库，所以计算得到的梯度方向更为准确。但在这种情况下，计算得到不同梯度值差别巨大，难以使用一个全局的学习率。而且一旦是大型的数据库，一次性把所有数据输进网络，肯定会引起内存的爆炸。所以就提出*nBatchSize*的概念。

###### 范例

```js
ai.train(10);
```

# 附表1 可供设置的神经网络变量

附表1的表格中的所有变量均可通过[ai.set](# set方法)进行设置。

## 附1.1 计算过程类

| 变量名         | 参数类型 | 取值限定    | 作用说明                                             | 默认值 |
| -------------- | :------: | ----------- | ---------------------------------------------------- | ------ |
| lossThreshold  |  float   | ＞0.0       | 误差阈值，当迭代误差小于设定值时，神经网络停止训练。 | 0.5    |
| learningRate   |  float   | ＞0.0       | 学习率，采用最速梯度下降进行优化时的下降步长。       | 0.3    |
| actFun         | str/int  | “sigmoid”/1 | 激活函数，目前仅支持sigmoid函数。                    | 1      |
| outputInterval |   int    | ＞0.0       | 输出间隔                                             | 100    |

