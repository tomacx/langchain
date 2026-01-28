<!--HJS_pargen_overview-->

## pargen类

该类主要用于对几何边界进行颗粒填充，形成紧密排列且贴体的颗粒，用于供粒子类算法（如DEM、SPH、MPM）等算法使用。具体接口如下

<center>颗粒填充类接口</center>

| 序号 | 函数名         | 说明                                            |
| :--: | :------------- | :---------------------------------------------- |
|  1   | importBoundSTL | 导入STL格式的几何边界文件                       |
|  2   | addBound       | 加载genvi平台上已有的mesh对象，作为模型的边界。 |
|  3   | clearBound     | 清除模型边界数据。                              |
|  4   | gen            | 根据模型边界数据填充粒子。                      |
|  5   | setFill        | 设置空腔内液体填充条件。                        |
|  6   | getValue       | 获取相关变量信息。                              |
|  7   | setValue       | 设置相关变量信息。                              |



 <!--HJS_pargen_importBoundSTL-->

### importBoundSTL方法

#### 说明

导入1个或多个stl文件，作为粒子填充的几何边界。

#### 格式定义

pargen.importBoundSTL(<*strStlFile1[,strStlFile2, strStlFile3, .....]*>);



#### 参数

*strStlFile1，strStlFile2……* ：字符串型，STL网格文件名。

#### 备注

至少传入1个STL网格文件。

#### 范例

```js
//导入2个stl格式的模型边界文件，作为粒子填充的边界
 pargen.importBoundSTL("1.stl","2.stl");
```





 <!--HJS_pargen_addBound-->

### addBound方法

#### 说明

加载genvi平台上已有的mesh对象，作为模型的边界（三角形面片单元）；一个mesh对象如果包含内外两层边界，则两层边界的中间部分为固体部分，可以加载多个mesh对象。

#### 格式定义

pargen.addBound(<*omesh1 [,omesh2, omesh3, .....]*>);



#### 参数

*omesh1，omesh2……* ：genvi平台的mesh对象。

#### 备注

至少传入1个mesh对象。

#### 范例

```js
//导入gid格式的，文件名为"model.msh"的面片网格文件
var msh1 = imesh.importGid("model.msh");
//增加msh1对象到模型边界
pargen.addBound(msh1);
```



 <!--HJS_pargen_clearBound-->

### clearBound方法

#### 说明

清除几何边界数据。

#### 格式定义

pargen.clearBound();

#### 参数

无。

#### 备注

该命令执行后，所有边界面的三角面片网格将被清除，边界面网格置零。

#### 范例

```js
//清除边界面数据
pargen.clearBound();
```



 <!--HJS_pargen_gen-->

### gen方法

#### 说明

根据设定的粒子半径等指标，对几何边界区域填充粒子。

#### 格式定义

pargen.gen(<*fParRad [, fXL, fXU, fYL, fYU, fZL, fZU  [,iGapFillFlag] ]*>);

#### 参数

*fParRad* ：浮点型，粒子半径（单位：m）。

*fXL, fXU, fYL, fYU, fZL, fZU*：浮点型，产生粒子的边界坐标范围（单位：m），可以不写，默认为几何边界向外扩展5倍半径。

iGapFillFlag：整型，空腔部分是否填充上粒子，只能为0或1，表示不填充或填充；默认为0，不填充。

#### 备注

该命令为粒子填充的核心命令，执行该命令后，如果填充粒子半径过小，可能需要等待较长的时间，方可完成粒子的填充。

#### 范例

```js
//对几何边界区域填充粒子，颗粒半径为2m
var parmsh = pargen.gen(2.0);
```



 <!--HJS_pargen_setFill-->

### setFill方法

#### 说明

设置液体填充参数。

#### 格式定义

pargen.setFill(<*nMeshId, fNx, fNy, fNz, nType, fValue*>);

#### 参数

*nMeshId*：整型，输入几何体的ID号，按照输入的几何体顺序从1开始计数；0号表示外侧空腔填充流体粒子。

*fNx, fNy, fNz*：浮点型，填充的重力方向（法向量）的三个分量，如[0,-1,0]表示向Y轴负方向填充。

*nType*，整型，填充类别，只能为1或2；1表示按照体积填充，2表示按照高度填充。

*fValue*，浮点型，大于0，表示填充值。nType为1时，表示填充体积（单位：m3）；nType为2时表示填充高度（单位：m）。

#### 备注

执行pargen.gen()命令前可被多次执行该命令，设置多个填充条件。

#### 范例

```js
//对1号mesh进行液体填充，填充体积为20立方米。
pargen.setFill(1, 0, -1, 0, 1, 20.0);
```



 <!--HJS_pargen_getValue-->

### getValue方法

#### 说明

获取粒子填充的相关参数信息。

#### 格式定义

pargen.getValue(<*strName, [,iflag]*>);

#### 参数

*strName*：字符串型，参数名称（可获取的参数名称见附表1）。

iflag：整型，分量id，从1开始，可以不写，默认为1。

#### 备注

该函数存在返回值，返回值为浮点型。

#### 范例

```js
//获取并行线程数
var nParaNum = pargen.getValue("ParaNum");
```



 <!--HJS_pargen_setValue-->

### setValue方法

#### 说明

设置粒子填充的相关参数信息。

#### 格式定义

pargen.setValue(<*strName, fValue [,iflag]*>);

#### 参数

*strName*：字符串型，参数名称（可设置的参数名称见附表1）。

*fValue*: 浮点型，需要设置的参数的值。

iflag：整型，分量id，从1开始，可以不写，默认为1。

#### 备注

该函数可对一些全局量进行设置，用于控制粒子的填充。

#### 范例

```js
//设置贴体优化开关为打开状态
pargen.stValue("OptiPosOption", 1);
```



<!--HJS_pargen_table-->

## 附表1 粒子填充控制参数列表

| 序号 | 关键词名称           | 含义                                                         |
| ---- | -------------------- | ------------------------------------------------------------ |
| 1    | "ParaNum"            | l 并行线程数，整数，必须大于0，默认值为系统最大核心数。      |
| 2    | "OptiPosOption"      | l 贴体优化开关，整数，只能为0或1，0表示不打开优化开关，1表示打开优化开关，默认为0。 |
| 3    | "MemorySafetyFactor" | l 内存占用度，浮点型，大于0小于1，默认0.7（即占用70%内存）。 |
| 4    | "InsideOption"       | l 边界粒子删除开关，整数，只能为0或1，0表示不打开，1表示打开；为了保证贴体操作后粒子不嵌入，可以打开该开关，打开后自动删除正交粒子中与边界最近的那一层粒子，然后进行贴体优化；默认为0 |
| 5    | "AdjustScaleFactor"  | l 粒子贴体优化调整因子，浮点型数组，包含3个分量，分别表示X、Y、Z三个方向的调整优化因子，在0-1之间，默认为1。 |
| 6    | "CorrectMode"        | l 颗粒贴体过程中的颗粒修正模式，整数，只能为1、2及3。1表示允许满足条件的所有颗粒在所有方向调整；2表示每个颗粒仅允许调整一次；3表示实体两端的颗粒仅允许调整1次。默认为1。 |
| 7    | "BoundParMode"       | l 边界颗粒模式，整数，只能为1或2。1表示根据颗粒体心判定颗粒与实体面之间的拓扑关系；2表示根据颗粒的外切立方体判定颗粒与实体面之间的拓扑关系；默认为1。 |
| 8    | "Tol"                | l 颗粒位于实体面内的判定容差，浮点型，大于0.0，默认值为1e-12。 |
| 9    | "DirSucceedSum"      | l 颗粒判定成功次数，整型，只能为1、2或3（默认为3）。大于等于该设定次数，则判定颗粒为实体颗粒（有效颗粒）。 |
| 10   | "IsUseExternalBound" | l 启用外部设置的边界开关，整型，只能为0或1。0，表示不启用，1表示启用；默认不启用（如果不启用，则三个方向边界各扩充5倍半径）。 |
| 11   | "BoundCoord"         | l 边界坐标范围，浮点型数组，含6个分量；iflag分量号，从1到6，分别为X方向下限值、X方向上限值、Y方向下限值、Y方向上限值、Z方向下限值、Z方向上限值。 |
| 12   | "OverlapTol"         | 两个独立体的面重合容差。                                     |
| 13   | "SameCoordTol"       | 两个坐标点属于一个点的容差。                                 |

