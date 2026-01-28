<!--HJS_GDEM_MESH_overview-->

## 概述

MESH模块主要用于参数化几何建模、网格剖分、颗粒填充及网格导入导出等操作，具体的类名如下表所示。

<center>JavaScript接口函数的类名</center>

| 类名     | 含义           | 功能描述                                                     |
| :------- | :------------- | ------------------------------------------------------------ |
| igeo     | 通用几何类     | 产生点、线、面、体等几何元素；  <br />对几何元素进行拉伸、旋转、分组等操作； <br />在几何元素体内压入下一级的几何元素。 |
| imeshing | 参数化网格类   | 借助自主开发的网格剖分器进行网格剖分；  <br />借助Gmsh软件对几何元素进行网格剖分；  <br />参数化创建单元（单元类型包括二维颗粒、三维颗粒、杆件、三角形、四边形、四面体、金字塔、三棱柱、楔形体、六面体）。 |
| pargen   | 颗粒填充类     | 向几何边界内填充球形粒子，并通过空间位置调整，实现贴体排列；该模块可以支持固体区域的粒子填充及空腔区域流体粒子的填充。 |
| imesh    | 网格到处导出类 | 用于导入、导出典型软件的网格格式，并支持网格的合并操作。     |

<!--HJS_END-->

##  接口函数简介

本章主要介绍igeo、imeshing类中各接口函数的作用。

<!--HJS_igeo_overview-->


## igeo 类

通用几何类的接口函数如表所示。



<center>通用几何类接口</center>

| **序号** | **函数名**                | **说明**                                                     |
| -------- | ------------------------- | ------------------------------------------------------------ |
| 1        | genPoint                  | 建立节点（返回值为节点ID）。                                 |
| 2        | genLine                   | 建立线段（返回值为线段ID）。                                 |
| 3        | genCurvedLine             | 建立曲线段（返回值为曲线段ID）。                             |
| 4        | genArc                    | 建立弧线段（返回值为弧线段ID）。                             |
| 5        | genElliArc                | 创建椭圆弧（返回值为椭圆弧线段ID）。                         |
| 6        | lineInt                   | 对线段进行求交操作。                                         |
| 7        | genLineLoop               | 根据多个线段建立LineLoop（返回值为LineLoop的ID）。           |
| 8        | genCircle                 | 创建圆形边框（一种LineLoop，返回值为LineLoop的ID）。         |
| 9        | genEllipse                | 建立椭圆边框（一种LineLoop，返回值为LineLoop的ID）。         |
| 10       | genRect                   | 建立矩形边框（一种LineLoop，返回值为LineLoop的ID）。         |
| 11       | genPloygen                | 建立多边形边框（一种LineLoop，返回值为LineLoop的ID）。       |
| 12       | genSurface                | 根据多个LineLoop建立平面（返回值为Surface的ID）。            |
| 13       | genSurfAuto               | 根据封闭线段自动产生单连通的面域                             |
| 14       | genCircleS                | 建立圆面（一种Surface，返回值为Surface的ID）。               |
| 15       | genEllipseS               | 建立椭圆面（一种Surface，返回值为Surface的ID）。             |
| 16       | genRectS                  | 建立矩形面（一种Surface，返回值为Surface的ID）。             |
| 17       | genPloygenS               | 建立多边形面（一种Surface，返回值为Surface的ID）。           |
| 18       | genRandomCircleS          | 随机产生满足某种分布的一系列圆形面。                         |
| 19       | genRectTunnelS            | 产生矩形隧道模型（一种Surface，返回值为Surface的ID）。       |
| 20       | genEllipseTunnelS         | 产生椭圆形隧道模型（一种Surface，返回值为Surface的ID）。     |
| 21       | genArcVerticalWallTunnelS | 产生直墙圆拱形隧道模型（一种Surface，返回值为Surface的ID）。 |
| 22       | genSurfaceLoop            | 创建一个SurfaceLoop，返回SurfaceLoop的ID号。                 |
| 23       | genBrick                  | 建立长方体面（一种SurfaceLoop，返回值为SurfaceLoop的ID）。   |
| 24       | genBall                   | 建立球形面（一种SurfaceLoop，返回值为SurfaceLoop的ID）。     |
| 25       | genEllipSoid              | 建立椭球面（一种SurfaceLoop，返回值为SurfaceLoop的ID）。     |
| 26       | genCylinder               | 建立圆柱体面（一种SurfaceLoop，返回值为SurfaceLoop的ID）。   |
| 27       | genVolume                 | 创建一个Volume，返回体的ID号。                               |
| 28       | genBrickV                 | 建立长方体（一种Volume，返回值为SurfaceLoop的ID）。          |
| 29       | genBallV                  | 建立球体（一种Volume，返回值为SurfaceLoop的ID）。            |
| 30       | genEllipSoidV             | 建立拓球体（一种Volume，返回值为SurfaceLoop的ID）。          |
| 31       | genCylinderV              | 建立圆柱体（一种Volume，返回值为SurfaceLoop的ID）。          |
| 32       | extrude                   | 平移拉伸几何元素。                                           |
| 33       | rotate                    | 旋转拉伸几何元素。                                           |
| 34       | glue                      | 对面或体进行粘接操作。                                       |
| 35       | copy                      | 平行复制几何元素。                                           |
| 36       | move                      | 平行移动几何元素。                                           |
| 37       | rotateCopy                | 旋转复制几何元素。                                           |
| 38       | rotateMove                | 旋转移动几何元素。                                           |
| 39       | mirrorCopy                | 镜像复制几何元素。                                           |
| 40       | mirrorMove                | 镜像移动几何元素。                                           |
| 41       | setHardPointToFace        | 在面内压入硬点（画网格时通过该点）。                         |
| 42       | setHardLineToFace         | 在面内压入硬线（画网格时通过该线）。                         |
| 43       | setHardPointToVol         | 在体内压入硬点（画网格时通过该点）。                         |
| 44       | setHardLineToVol          | 在体内压入硬线（画网格时通过该线）。                         |
| 45       | setHardSurfToVol          | 在体内压入硬面（画网格时通过该面）。                         |
| 46       | setGroup                  | 对点、线、线环、面、面环、体等几何元素重新设置组号。         |
| 47       | setGroupAuto              | 对点、线、线环、面、面环、体等进行自动分组。                 |
| 48       | setSize                   | 根据ID号下限及上限设置点、线、线环、面、面环、体的网格尺寸。 |
| 49       | getID                     | 获得离某一坐标最近的点、线、线环、面、面环、体的ID号。       |
| 50       | getValue                  | 获取信息。                                                   |
| 51       | setValue                  | 设置信息。                                                   |
| 52       | import                    | 导入外部几何文件。                                           |
| 53       | draw                      | 绘制内存中的几何图形。                                       |
| 54       | pick                      | 选择ID范围内图元，并在模型视窗中用红色线段表示。             |
| 55       | drawClear                 | 清除绘制的几何图元。                                         |
| 56       | printInfo                 | 打印信息。                                                   |
| 57       | delete                    | 删除几何信息。                                               |
| 58       | deleteByBound             | 删除边界控制下的几何信息。                                   |
| 59       | Clear                     | 清除模型中已有的几何信息。                                   |

<!--HJS_igeo_genPoint-->

## genPoint方法

#### 说明

产生节点，返回节点ID。

#### 格式定义

igeo.genPoint(< *fx* , *fy* , *fz* <, *fsize* >>);

#### 参数

*fx* , *fy* , *fz* ：浮点型，节点的X、Y、Z坐标（单位：m）。
*fsize* ：浮点型，该节点区域附近的网格尺寸（单位：m）。

#### 备注

​	（ 1 ）如果"IfMerge"为 1 时，执行合并功能，当输入节点与已有节点的容差小于"Tol"时，不新增节点，返回已有节点的ID。
​	（ 2 ）如果 *fsize* 不写，则采用系统默认值，可通过igeo.setValue(<"Size">)对默认值进行设置。
​	（ 3 ）返回值为节点ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生节点
var pid1 = igeo.genPoint(0.0, 0.0, 0.0, 0.01);
var pid2 = igeo.genPoint(1.0, 1.0, 1.0);
```

<!--HJS_igeo_genLine-->

###  genLine方法

####  说明

产生直线段，返回直线段ID。

#### 格式定义

包含 2 种格式

igeo.genLine(< *iID* , *jID* >);
igeo.genLine(< *fx1* , *fy1* , *fz1* , *fx2* , *fy2* , *fz2* , *fsize1* , *fsize2* >);

#### 参数

*iID* , *jID* ：整型，第一个节点及第二个节点的ID号。
*fx 1* , *fy 1* , *fz 1* ：浮点型，第一个节点的X、Y、Z坐标（单位：m）。
fx 2 , fy 2 , fz 2 ：浮点型，第二个节点的X、Y、Z坐标（单位：m）。
fsize1 , fsize2 ：浮点型，第一个节点及第二个节点的网格尺寸（单位：m）。


#### 备注

​	（ 1 ）如果"IfMerge"为 1 时，执行合并功能，当输入直线段的节点ID与已有直线段的节点ID一致，或输入直线段与已有直线段的容差小于"Tol"时，不新增直线段，返回已有直线段的ID。
​	（ 2 ）返回值为直线段ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生节点
var lid1 = igeo.genLine(5, 6);
var lid2 = igeo. genLine(0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.05, 0.08);
```

<!--HJS_igeo_genCurvedLine-->

### genCurvedLine方法

#### 说明

产生曲线段，返回曲线段ID。

#### 格式定义

igeo.genCurvedLine(< *aiPointID* , *sType* >);

#### 参数

*aiPointID* ：Array整型，节点ID号数组（元素个数大于等于 2 ）。
*sType* ：字符串型，只能为"SPLINE"及"BSPLINE"（不区分大小写）。

#### 备注

​	（ 1 ）如果"IfMerge"为 1 时，执行合并功能，当输入曲线段与已有曲线段的容差小于"Tol"时，不新增曲线段，返回已有曲线段的ID。
​	（ 2 ）返回值为曲线段ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生节点
var aipoint = [1,2,3,4,5];
var lid1 = igeo.genCurvedLine(aipoint, "SPLINE");
```

<!--HJS_igeo_genArc-->

### genArc方法

#### 说明

产生圆弧，返回圆弧ID。

#### 格式定义

包含 2 种格式

igeo.genArc(< *iID* , *jID* , *kID* >);
igeo.genArc(< *afPoint1* , *afCenter* , *afPoint2* , *fsize* >);

#### 参数

*iID* , *jID* , *kID* ：整型，圆弧上第一个节点、圆心点、圆弧上第二个节点的ID值。
*afPoint1* ：Array浮点型，含 3 个分量，圆弧上第一个节点坐标（单位：m）。
*afCenter* ：Array浮点型，含 3 个分量，圆心点坐标（单位：m）。
*afPoint 2* ：Array浮点型，含 3 个分量，圆弧上第二个节点坐标（单位：m）。
*fsize* ：浮点型，圆弧的网格尺寸（单位：m）。

#### 备注

（ 1 ）如果"IfMerge"为 1 时，执行合并功能，当输入圆弧的节点ID与已有圆弧的节点ID一致，或输入圆弧与已有圆弧的容差小于"Tol"时，不新增圆弧，返回已有圆弧的ID。
（ 2 ）返回值为圆弧段ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生圆弧，ID号 1 为圆心点
var aid1 = igeo.genArc(4, 1, 6);
var apoint1 = [0.0, 0.0, 0.0];
var apoint2 = [1.0, 1.0, 0.0];
var acenter = [1.0, 0.0, 0.0];
var aid2 = igeo.genArc(apoint1, acenter , apoint2, 0.5);
```

<!--HJS_igeo_genElliArc-->

### genElliArc方法

#### 说明

产生椭圆弧，返回椭圆弧ID。

#### 格式定义

igeo.genElliArc(< *i 1 ID* , *i2ID* , *i3ID, i4ID* >);

#### 参数

*i1ID* , *i2ID* , *i3ID, i4ID* ：整型，椭圆弧上第一个节点、圆心点、长轴端点，圆
弧上第二个节点的ID值。

#### 备注

（ 1 ）如果"IfMerge"为 1 时，执行合并功能，当输入椭圆弧的节点ID与已有椭圆弧的节点ID一致，或输入椭圆弧与已有椭圆弧的容差小于"Tol"时，不新增圆弧，返回已有圆弧的ID。
（ 2 ）椭圆弧第一个节点、第二个节点与圆心点的夹角应小于 180 度，否则无法创建，若夹角等于或大于 180 度，可分段创建。
（ 3 ）返回值为圆弧段ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生椭圆弧，ID号 1 为圆心点
var id1 = igeo.genPoint(0, 0, 0, 0.1);
var id2 = igeo.genPoint(5, 0, 0, 0.1);
var id3 = igeo.genPoint(0, 3, 0, 0.1);
var line1 = igeo.genElliArc(id2, id1, id2, id3);
```

<!--HJS_igeo_genLineLoop-->

### genLineLoop方法

#### 说明

产生线段闭环，返回Line Loop的ID。

#### 格式定义

igeo. genLineLoop (< *aiLineID* >);

#### 参数

*aiLineID* ：Array整型，分量个数大于等于 2 ，为线段的ID号，线段ID号的输入顺序没有限定，但所有线段必须形成一个封闭的Loop。

#### 备注

（ 1 ）返回值为Line Loop的ID号（大于等于 1 的自然数），创建出错返回-1 。

#### 范例

```js
//产生由线段ID号为1,2,3,4组成的封闭环

var ailineID = new [1,2,3,4];
var aloopid1 = igeo.genLineLoop (ailineID);
```

<!--HJS_igeo_genCircle-->

### genCircle方法

#### 说明

产生圆边框（一种Line Loop）， 返回Line Loop的ID。

#### 格式定义

包含 3 种格式：
（ 1 ） 5 参数格式
	igeo.genCircle(< *fcx* , *fcy* , *fcz* , *frad* , *fsize* >);
（ 2 ） 7 参数格式
	igeo.genCircle(< *fcx* , *fcy* , *fcz* , *frad* , *fsize* , *fdipdir* , *fdipangle* >);
（ 3 ） 8 参数格式
	igeo.genCircle(< *fcx* , *fcy* , *fcz* , *frad* , *fsize* , *fnx* , *fny* , *fnz* >);

#### 参数

*fcx* , *fcy* , *fcz* ：浮点型，圆心坐标（单位：m）。
*frad* ：浮点型，半径（单位：m）。
*fsize* ：浮点型，网格尺寸（单位：m）。
*fdipdir* ， *fdipangle* ：浮点型，圆面的倾向及倾角（单位：度）。
*fnx* , *fny* , *fnz* ：浮点型，圆弧的法向量分量。

#### 备注

（ 1 ）返回值为Line Loop的ID号（大于等于 1 的自然数），创建出错返回-1 。
（ 2 ）倾向、倾角模式输入时，地面法向为Z轴正方形，倾向 0 °为Y轴正方方，倾向 90 °角为X轴正方向。
（ 3 ）法向量 *fnx* 、 *fny* 及 *fnz* 不必单位化，软件内部自动对其进行单位化。

#### 范例

```
//产生圆心(5,5,0)，半径0.5m，网格尺寸0.01m的圆边框
var aloopid1 = igeo.genCircle(5.0, 5.0, 0.0, 0.5, 0.01);

//产生圆心(0,0,0)，半径1m，网格尺寸0.01m，倾向 30 度，倾角 40 度的圆边框
var aloopid2 = igeo.genCircle(0.0, 0 .0, 0.0, 1.0, 0.01, 30.0, 40.0);

//产生圆心(0,0,0)，半径1m，网格尺寸0.01m，法向量为（1,1,1）的圆边框
var aloopid3 = igeo.genCircle(0.0, 0 .0, 0.0, 1.0, 0.01, 1.0, 1.0, 1.0);
```

<!--HJS_igeo_lineInt-->

### lineInt方法

#### 说明

对几何模型中的所有线段进行求交操作。

#### 格式定义

igeo.lineInt(< *[fTol]* >);

#### 参数

*fTol* ：浮点型，求交后线段合并容差（单位：m）。如果不写，默认采用系统自带容差进行合并。

#### 备注

（ 1 ）仅当模型中的线段没有上一级拓扑时会执行求交操作。
（ 2 ）目前仅支持直线段的相交求解。
（ 3 ）调用正确返回 0 ，出错返回- 1 。

#### 范例

```js
igeo.lineInt(0.01);
igeo.lineInt();
```

<!--HJS_igeo_genEllipse-->

### genEllipse方法

#### 说明

产生椭圆闭环，返回Line Loop的ID。

#### 格式定义

igeo. genEllipse (< *icID, fXaixs, fYaxis, fAngleX, fAngleY, fAngleZ, fsize* >);

#### 参数

*icID* ：整型，椭圆闭环的圆心点ID。
*fXaixs, fYaxis* ：浮点型，椭圆闭环X、Y方向半轴的长度。
*fAngleX, fAngleY, fAngleZ* ：浮点型，椭圆闭环绕X，Y，Z轴的旋转角度（单位：度）。
*fsize* ：浮点型，网格尺寸（单位：m）。

#### 备注

（ 1 ）返回值为Line Loop的ID号（大于等于 1 的自然数），创建出错返回-1 。
（ 2 ）依据右手螺旋准则，大拇指为旋转轴方向，四指方向为旋转角度正方向。

#### 范例

```js
//产生椭圆闭环
var id1 = igeo.genPoint(0, 0, 0, 0.1);
var lineloop 1 = igeo.genEllipse(id1, 5, 3, 20, 50, 30, 0.2);
```

<!--HJS_igeo_genRect-->

### genRect方法

#### 说明

产生矩形边框（一种Line Loop）， 返回Line Loop的ID。

#### 格式定义

igeo.genRect(< *fx1, fy1, fz1, fx2, fy2, fz2, fsize* >);

#### 参数

*fx1, fy1, fz1* ：浮点型，矩形边框左下角的坐标（单位：m）。
*fx 2 , fy 2 , fz 2* ：浮点型，矩形边框右上角的坐标（单位：m）。
*fsize* ：浮点型，网格尺寸（单位：m）。

#### 备注

（ 1 ）返回值为Line Loop的ID号（大于等于 1 的自然数），创建出错返回-1 。

#### 范例

```js
//产生边长为 1 m的正方形。
var aloopid1 = igeo.genRect(0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.01);
```

<!--HJS_igeo_genPloygen-->

### genPloygen方法

#### 说明

产生多边形边框（一种Line Loop）， 返回Line Loop的ID。

#### 格式定义

igeo.genPloygen(< *afCoord* >);

#### 参数

*afCoord* ：Array浮点型，二维数组，第一维为节点个数，第二维为节点坐标及网格尺寸（含 4 个分量，前三个数为X、Y、Z坐标，最后一个数为网格尺寸）。

#### 备注

（ 1 ）返回值为Line Loop的ID号（大于等于 1 的自然数），创建出错返回-1 。

#### 范例

```js
//产生多边形边框。
var afcoord = new Array ();
afcoord[0] = [0.0, 0.0, 0.0, 0.01];
afcoord[1] = [1.0, 0.0, 0.0, 0.05];
afcoord[2] = [2.0, 2.0, 0.0, 0.1];
afcoord[3] = [2.0, 4.0, 0.0, 0.2];
afcoord[4] = [1.0, 3.0, 0.0, 0.4];
afcoord[5] = [0.0, 2.0, 0.0, 0.7];
var id = igeo.genPloygen(afcoord);
```

<!--HJS_igeo_genSurface-->

### genSurface方法

#### 说明

产生面，返回面的ID。

#### 格式定义

igeo. genSurface ( *<aiLineLoopID, iGroup* [ *,sType* ] *>* );

#### 参数

*aiLineLoopID* ：Array整型，分量个数大于等于 1 ，产生面域的闭环ID号，第一个ID为面的外边界，以后的ID为面内部的空腔。

*iGroup* ：整型，面的组号，也即后续划分网格后的网格组号，大于等于 1 。

*sType* ：字符串型，面的类型，只能为"plane"（平面）及"ruled"（规则曲面）（不区分大小写）；如果不写该参数，默认为"plane"（平面）。

#### 备注

（ 1 ）返回值为面的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var aiLineLoopID 1 = [1, 2, 3];
var aiLineLoopID 2 = [4];
//产生组号为 1 ，包含 2 个空腔的面域。
var id1 = igeo.genSurface (aiLineLoopID1, 1);
//产生组号为 2 的规则曲面
var id 2 = igeo. genSurface (aiLineLoopID2, 2, "ruled");
```

<!--HJS_igeo_genSurfAuto-->

### genSurfAuto方法

#### 说明

根据封闭的线段自动产生单连通的面。

#### 格式定义

igeo.genSurfAuto( *<[iTopSeg] >* );

#### 参数

*iTopSeg* ：整型，所产生的面包含的线段数上限（可以不写，默认为 10 ）。该值越大，搜索时间越长。

#### 备注

（ 1 ）所述线段包括直线段、弧线段及自由曲线段。

##### 范例

```js
igeo. genSurfAuto ( 15 );
igeo. genSurfAuto ();
```

<!--HJS_igeo_genCircleS-->

### genCircleS方法

#### 说明

产生圆面（一种Plane Surface）， 返回Surface的ID。

#### 格式定义

包含 3 种格式：
（ 1 ） 6 参数格式
igeo.genCircleS(< *fcx* , *fcy* , *fcz* , *frad* , *fsize, iGroup* >);
（ 2 ） 8 参数格式
igeo.genCircleS(< *fcx* , *fcy* , *fcz* , *frad* , *fsize* , *iGroup* , *fdipdir* , *fdipangle* >);
（ 3 ） 9 参数格式
igeo.genCircleS(< *fcx* , *fcy* , *fcz* , *frad* , *fsize* , *iGroup* , *fnx* , *fny* , *fnz* >);

#### 参数

```js
fcx , fcy , fcz ：浮点型，圆心坐标（单位：m）。
frad ：浮点型，半径（单位：m）。
fsize ：浮点型，网格尺寸（单位：m）。
iGroup ：整型，面组号，大于等于 1 的自然数。
fdipdir ， fdipangle ：浮点型，圆面的倾向及倾角（单位：度）。
fnx , fny , fnz ：浮点型，圆弧的法向量分量。
```

#### 备注

（ 1 ）返回值为Surface的ID号（大于等于 1 的自然数），创建出错返回- 1 。
（ 2 ）倾向、倾角模式输入时，地面法向为Z轴正方形，倾向 0 °为Y轴正方方，倾向 90 °角为X轴正方向。
（ 3 ）法向量 *fnx* 、 *fny* 及 *fnz* 不必单位化，软件内部自动对其进行单位化。

#### 范例

```js
//产生圆心(5,5,0)，半径0.5m，网格尺寸0.01m的圆面
var aloopid1 = igeo.genCircleS(5.0, 5.0, 0.0, 0.5, 0.01, 1);

//产生圆心(0,0,0)，半径1m，网格尺寸0.01m，倾向 30 度，倾角 40 度的圆面
var aloopid2 = igeo.genCircleS (0.0, 0 .0, 0.0, 1.0, 0.01, 2, 30.0, 40.0);

//产生圆心(0,0,0)，半径1m，网格尺寸0.01m，法向量为（1,1,1）的圆面
var aloopid3 = igeo.genCircleS (0.0, 0 .0, 0.0, 1.0, 0.01, 2, 1.0, 1.0, 1.0);
```

<!--HJS_igeo_genEllipseS-->

### genEllipseS方法

#### 说明

产生椭圆面（一种Plane Surface）， 返回Surface的ID。

#### 格式定义

igeo. genEllipseS (< *icID, fXaixs, fYaxis, fAngleX, fAngleY, fAngleZ, fsize,iGroup* >);

#### 参数

```js
icID ：整型，椭圆面的圆心点ID。
fXaixs, fYaxis ：浮点型，椭圆面X、Y方向半轴的长度。
fAngleX, fAngleY, fAngleZ ：浮点型，椭圆闭环绕X，Y，Z轴的旋转角度（单位：度）。
fsize ：浮点型，网格尺寸（单位：m）。
iGroup ：整型，面组号，大于等于 1 的自然数。
```

#### 备注

（ 1 ）返回值为Surface的ID号（大于等于 1 的自然数），创建出错返回- 1 。
（ 2 ）依据右手螺旋准则，大拇指为旋转轴方向，四指方向为旋转角度正方向。

#### 范例

```js
//产生椭圆面
var id1 = igeo.genPoint(0, 0, 0, 0.1);
var Ellipse 1 = igeo.genEllipseS(id1, 5, 3, 20, 50, 30, 0.2, 2);
```

<!--HJS_igeo_genRectS-->

### genRectS方法

#### 说明

产生矩形面（一种Plane Surface）， 返回Surface的ID。

#### 格式定义

igeo.genRectS(< *fx1, fy1, fz1, fx2, fy2, fz2, fsize, iGroup* >);

#### 参数

*fx1, fy1, fz1* ：浮点型，矩形边框左下角的坐标（单位：m）。

*fx2 , fy2 , fz2* ：浮点型，矩形边框右上角的坐标（单位：m）。

*fsize* ：浮点型，网格尺寸（单位：m）。

*iGroup* ：整型，面组号，大于等于 1 的自然数。

#### 备注

（ 1 ）返回值为Surface的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生边长为 1 m的正方形面，组号为 2 。
var aloopid1 = igeo.genRectS(0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.01, 2);
```

<!--HJS_igeo_genPloygens-->

### genPloygenS方法

#### 说明

产生多边形面（一种Plane Surface）， 返回Surface的ID。

#### 格式定义

igeo.genPloygenS(< *afCoord , iGroup* >);

#### 参数

*afCoord* ：Array浮点型，二维数组，第一维为节点个数，第二维为节点坐标及网格尺寸（含 4 个分量，前三个数为X、Y、Z坐标，最后一个数为网格尺寸）。
*iGroup* ：整型，面组号，大于等于 1 的自然数。

#### 备注

（ 1 ）返回值为Surface的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生多边形平面，组号为 3 。
var afcoord = new Array ();
afcoord[0] = [0.0, 0.0, 0.0, 0.01];
afcoord[1] = [1.0, 0.0, 0.0, 0.05];
afcoord[2] = [2.0, 2.0, 0.0, 0.1];
afcoord[3] = [2.0, 4.0, 0.0, 0.2];
afcoord[4] = [1.0, 3.0, 0.0, 0.4];
afcoord[5] = [0.0, 2.0, 0.0, 0.7];
var id = igeo.genPloygenS(afcoord, 3);
```

<!--HJS_igeo_genRandomCircleS-->

### genRandomCircleS方法

#### 说明

在指定矩形空间内随机产生满足某种分布的一系列圆面。

#### 格式定义

igeo.genRandomCircleS *(iTotalNo, afx2, afy2, afz2, sRadType, afRad2, sDipDType,
afDipD2, sDipAType, afDipA2, fsize, iGroup);*

#### 参数

*iTotalNo* ：整型，圆形面的总数，大于等于 1 的自然数。

*afx2* ：Array浮点型，包含 2 个分量，X方向的下限及上限（单位：m）。

*afy 2* ：Array浮点型，包含 2 个分量，Y方向的下限及上限（单位：m）。

*afz 2* ：Array浮点型，包含 2 个分量，Z方向的下限及上限（单位：m）。

*sRadType* ：字符串型，圆半径的随机类型，只能为"uniform"、"normal"、"weibull"之一。

afRad2 ：Array浮点型，包含两个分量，圆半径的随机参数。

*sDipDType* ：字符串型，倾向的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*afDipD2* ：Array浮点型，包含两个分量，倾向的随机参数。

*sDipAType* ：字符串型，倾角的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*afDipA2* ：Array浮点型，包含两个分量，倾角的随机参数。

*fsize* ：浮点型，网格尺寸（单位：m）。

*iGroup* ：整型，面组号，大于等于 1 的自然数。

#### 备注

（ 1 ）倾向及倾角的单位都是角度，倾向在 0 - 360 度之间，倾角在 0 - 90 度之间。

（ 2 ）如果分布模式为"uniform"， *fPra1* 及 *fPra2* 分别表示随机参数的下限及上限。

（ 3 ）如果分布模式为"normal"（随机公式 $ y= \mu + \sigma x $ $ x=\sum_{n=1}^{12}r_n -6 $，$ \mu $期望，$\sigma$标准差，$r_n$为0-1之间均匀分布随机数），*fPra1*及*fPra2*分别表示随机值的期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

（4）如果分布模式为"weibull"，*fPra1*及*fPra2*分别表示威布尔分布的$k$及$\lambda$值，weibull分布概率密度函数为$f(x) = \left\{ \begin{array}{l}
\frac{k}{\lambda }{(\frac{x}{\lambda })^{k - 1}}{e^{ - {{(x/\lambda )}^k}}}\begin{array}{*{20}{c}}
{}&{x \ge 0}
\end{array}\\
0\begin{array}{*{20}{c}}
{}&{}&{}&{}&{}&{x < 0}
\end{array}
\end{array} \right.，$概率为 $F(x) = 1 - {e^{ - {{(x/\lambda )}^k}}}，$$x$为随机变量，$\lambda$>0为比例因子，$k$>0为形状参数（$k$=1为指数分布，$k$=2为瑞利分布），（数值实现时，随机数公式$x = \lambda {( - \ln (u))^{1/k}}\\$  ，其中u为0-1的均匀分布值）。

#### 范例

```js
//在面 3 中设置硬点 2
var x = [0,100];
var y = [0, 100];
var z = [0, 100];
var frad = [5.0, 10.0];
var fdipd = [0, 360];

var fdipa = [0,90];
igeo.genRandomCircleS(200,x, y,z, "uniform", frad, "uniform", fdipd, "uniform", fdipa, 2, 1);
```



<!--HJS_igeo_genRectTunnelS-->

### genRectTunnelS方法

#### 说明

产生矩形隧道模型。

#### 格式定义

 igeo.genRectTunnelS(<*fModelH, fModelL, fTunnelH, fTunnelL, fBottomDist, fSizeModel, fSizeTunnel, ShellFlag, fShellW [,afOrigin[3] ]*>);

![](images\imeshing-genRectTunnelS.jpg)

#### 参数

*fModelH* ：浮点型，模型的高度（单位：m）。

*fModelL* ：浮点型，模型的宽度（单位：m）。

*fTunnelH* ：浮点型，隧道的高度（单位：m）。

*fTunnelL* ：浮点型，隧道的宽度（单位：m）。

*fBottomDist* ：浮点型，隧道底部到模型底部的距离（单位：m）。

*fSizeModel* ：浮点型，模型四周的网格尺寸（单位：m）。

*fSizeTunnel* ：浮点型，隧道的网格尺寸（单位：m）。

*ShellFlag* ：整型，是否包含衬砌，只能为0及1，0-不包含，1-包含。

*fShellW* ：浮点型，衬砌厚度（单位：m）。

*afOrigin* ：Array浮点型，模型做下角的坐标，包含3个分量（单位：m），默认为[0, 0, 0]。

#### 备注

（ 1 ）创建该隧道几何模型后，隧道外部围岩组号为1，隧道内部围岩组号为2，衬砌组号为3（如果有）。

（ 2 ）如果ShellFlag为0，表示不包含衬砌，fShellW也必须写，只是该值无意义。

#### 范例

```js
//创建矩形隧道模型
 igeo.genRectTunnelS(30, 40, 3, 4,10, 1.0, 0.2,1, 0.3);
 igeo.genRectTunnelS(30, 40, 3, 4,10, 1.0, 0.2,1, 0.3, [3,3,0]);
```



<!--HJS_igeo_genEllipseTunnelS-->

### genEllipseTunnelS方法

#### 说明

产生椭圆形隧道模型。

#### 格式定义

igeo.genEllipseTunnelS(<*fModelH, fModelL, fEllipDH, fEllpDV, fBottomDist, fSizeModel, fSizeTunnel, ShellFlag, fShellW [,afOrigin[3] ]*>);

![](images\imeshing-genEllipseTunnelS.jpg)

#### 参数

*fModelH* ：浮点型，模型的高度（单位：m）。

*fModelL* ：浮点型，模型的宽度（单位：m）。

*fEllipDH* ：浮点型，椭圆竖向半轴长（单位：m）。

*fEllpDV* ：浮点型，椭圆水平半轴长（单位：m）。

*fBottomDist* ：浮点型，隧道底部到模型底部的距离（单位：m）。

*fSizeModel* ：浮点型，模型四周的网格尺寸（单位：m）。

*fSizeTunnel* ：浮点型，隧道的网格尺寸（单位：m）。

*ShellFlag* ：整型，是否包含衬砌，只能为0及1，0-不包含，1-包含。

*fShellW* ：浮点型，衬砌厚度（单位：m）。

*afOrigin* ：Array浮点型，模型做下角的坐标，包含3个分量（单位：m），默认为[0, 0, 0]。

#### 备注

（ 1 ）创建该隧道几何模型后，隧道外部围岩组号为1，隧道内部围岩组号为2，衬砌组号为3（如果有）。

（ 2 ）如果ShellFlag为0，表示不包含衬砌，fShellW也必须写，只是该值无意义。

#### 范例

```js
///创建椭圆形隧道模型
 igeo.genEllipseTunnelS(30, 40, 3, 4,10, 1.0, 0.2,1, 0.3);
 igeo.genEllipseTunnelS(30, 40, 3, 4,10, 1.0, 0.2,1, 0.3, [3,3,0]);
```



<!--HJS_igeo_genArcVerticalWallTunnelS-->

### genArcVerticalWallTunnelS方法

#### 说明

产生直墙圆拱形隧道模型。

#### 格式定义

igeo.genArcVerticalWallTunnelS(<*fModelH, fModelL, fTunnelH, fTunnelL, fArcH, fBottomDist, fSizeModel, fSizeTunnel, ShellFlag, fShellW [,afOrigin[3] ]*>);

![](images\imeshing-genArcVerticalWallTunnelS.jpg)

#### 参数

*fModelH* ：浮点型，模型的高度（单位：m）。

*fModelL* ：浮点型，模型的宽度（单位：m）。

*fTunnelH* ：浮点型，隧道的高度（单位：m）。

*fTunnelL* ：浮点型，隧道的宽度（单位：m）。

*fArcH* ：浮点型，圆拱的高度（单位：m）。

*fBottomDist* ：浮点型，隧道底部到模型底部的距离（单位：m）。

*fSizeModel* ：浮点型，模型四周的网格尺寸（单位：m）。

*fSizeTunnel* ：浮点型，隧道的网格尺寸（单位：m）。

*ShellFlag* ：整型，是否包含衬砌，只能为0及1，0-不包含，1-包含。

*fShellW* ：浮点型，衬砌厚度（单位：m）。

*afOrigin* ：Array浮点型，模型做下角的坐标，包含3个分量（单位：m），默认为[0, 0, 0]。

#### 备注

（ 1 ）创建该隧道几何模型后，隧道外部围岩组号为1，隧道内部围岩组号为2，衬砌组号为3（如果有）。

（ 2 ）如果ShellFlag为0，表示不包含衬砌，fShellW也必须写，只是该值无意义。

#### 范例

```js
//创建矩形隧道模型
 igeo.genArcVerticalWallTunnelS(30, 40, 3, 4, 1.5, 10, 1.0, 0.2,1, 0.3);
 igeo.genArcVerticalWallTunnelS(30, 40, 3, 4, 1.5,10, 1.0, 0.2,1, 0.3, [3,3,0]);
```



<!--HJS_igeo_genSurfaceLoop-->

### genSurfaceLoop方法

#### 说明

产生面的闭环，返回Surface Loop的ID。

#### 格式定义

包含 2 种格式
根据面的ID号数组产生封闭面环
igeo. genSurfaceLoop (< *aiSurfaceID* >);
根据坐标框选产生封闭面环。
igeo. genSurfaceLoop (< *fx1, fx2, fy1, fy2, fz1, fz2* >);

#### 参数

*aiSurfaceID* ：Array整型，分量个数大于等于 2 ，为面的ID号，面ID号的输入顺序没有限定，但所有面必须形成一个封闭的Loop。
*fx1, fx2* ：浮点型，X方向的坐标下限及上限（单位：m）。
*fy1,f y2* ：浮点型，Y方向的坐标下限及上限（单位：m）。
*fz1, fz2* ：浮点型，Z方向的坐标下限及上限（单位：m）。

#### 备注

（ 1 ）返回值为Surface Loop的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
//产生由面ID号为1,2,3,4组成的封闭面环
var aSurface1 = new [1,2,3,4];
var SurfaceLoop1 = igeo.genSurfaceLoop (aSurface1);

var SurfaceLoop2 = igeo.genSurfaceLoop (0,100,0,100,0,100);
```

<!--HJS_igeo_genBrick-->

### genBrick方法

#### 说明

产生砖块外表面的Loop，返回面Loop的ID。

#### 格式定义

igeo.genBrick ( *<fx1, fy1, fz1, fx2, fy2, fz2, fsize, iGroup>* );

#### 参数

```js
fx1, fy1, fz1 ：浮点型，砖块坐下角的坐标（单位：m）。
fx 2 , fy 2 , fz 2 ：浮点型，砖块右上角的坐标（单位：m）。
fsize ：浮点型，网格尺寸（单位：m）。
iGroup ：整型，面Loop中各面的组号。
```

#### 备注

（ 1 ）返回值为面Loop的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var id 1 = igeo.genBrick(0, 0, 0, 1, 1, 1, 0.2, 1);
```

<!--HJS_igeo_genBall-->

### genBall方法

#### 说明

产生球面的Loop，返回面Loop的ID。

#### 格式定义

igeo.genBall (< *fcx, fcy, fcz, frad, fsize, iGroup>* );

#### 参数

```js
fcx, fcy, fcz ：浮点型，球体中心的坐标（单位：m）。
frad ：浮点型，球体的半径（单位：m）。
fsize ：浮点型，网格尺寸（单位：m）。
iGroup ：整型，面Loop中各面的组号。
```

#### 备注

（ 1 ）返回值为面Loop的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var id 1 = igeo.genBall(0, 0, 0,0.5, 0.05, 1);
```

<!--HJS_igeo_genEllipSoid-->

### genEllipSoid方法

#### 说明

产生椭球面（一种SurfaceLoop）， 返回SurfaceLoop的ID。

#### 格式定义

igeo.genEllipSoid(< *fCoordX, fCoordY, fCoordZ, fXaxis, fYaxis, fZaxis, fsize,iGroup, fAngleX, fAngleY, fAngleZ* >);

#### 参数

*fCoordX , fCoordY, fCoordZ* ：浮点型，椭球面的球心坐标，依次为X，Y，Z的坐标值。
*fXaxis, fYaxis, fZaxis* ：浮点型，椭球面X，Y，Z方向的半轴长，（单位：m）。
*fsize* ：浮点型，网格尺寸（单位：m）。
*iGroup* ：整型，面组号，大于等于 1 的自然数。
*fAngleX, fAngleY, fAngleZ* ：浮点型，椭球面绕X，Y，Z轴的旋转角度（单位：度）。

#### 备注

（ 1 ）返回值为SurfaceLoop的ID号（大于等于 1 的自然数），创建出错返回- 1 。
（ 2 ）依据右手螺旋准则，大拇指为旋转轴方向，四指方向为旋转角度正方向。

#### 范例

```js
//产生椭球外表面，组号为 1 。
var SurfaceLoop1 = igeo.genEllipSoid(10, 7 , 2 , 6, 5, 4, 0.5, 1, 20, 40, -10);
```

<!--HJS_igeo_genCylinder-->

### genCylinder方法

#### 说明

产生圆柱面的Loop，返回面Loop的ID。

#### 格式定义

igeo.genCylinder(< *fx1, fy1, fz1, fx2, fy2, fz2, frad1, frad2, fsize1, fsize2, iGroup>* );

#### 参数

*fx1, fy1, fz1* ：浮点型，圆柱中心轴一侧端点坐标（单位：m）。
*fx 2 , fy 2 , fz 2* ：浮点型，圆柱中心轴另一侧端点坐标（单位：m）。
*frad1* ：浮点型，内半径尺寸（单位：m），该值如果小于等于 0 ，表示产生实心圆柱。

*frad 2* ：浮点型，外半径尺寸（单位：m），该值必须大于 *frad1* 。
*fsize 1 , fsize2* ：浮点型，内圆柱面及外圆柱面尺寸（单位：m）。
*iGroup* ：整型，面Loop中各面的组号。

#### 备注

（ 1 ）返回值为面Loop的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var id 1 = igeo.genCylinder(0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.2, 0.5, 0.05, 0.05, 1);
```

<!--HJS_igeo_genVolume-->

### genVolume方法

#### 说明

产生体，返回体的ID。

#### 格式定义

igeo.genVolume ( *<aiSurfaceLoopID, iGroup>* );

#### 参数

*aiSurfaceLoopID* ：Array整型，分量个数大于等于 1 ，产生体积所需要的闭环面ID号，第一个ID为体的外边界，以后的ID为体内部的空腔。
*iGroup* ：整型，面的组号，也即后续划分网格后的网格组号，大于等于 1 。

#### 备注

（ 1 ）返回值为体的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var aSurfaceLoop1 = [1, 2, 3];
//产生组号为 1 ，包含 2 个空腔的体积。
var Volume1 = igeo.genVolume(aSurfaceLoop1, 1);
```

<!--HJS_igeo_genBrickV-->

### genBrickV方法

#### 说明

产生砖块体，返回体的ID。

#### 格式定义

igeo.genBrickV( <fx1, fy1, fz1, fx2, fy2, fz2, fsize, iGroup> );

#### 参数

```js
fx1, fy1, fz1 ：浮点型，砖块坐下角的坐标（单位：m）。
fx 2 , fy 2 , fz 2 ：浮点型，砖块右上角的坐标（单位：m）。
fsize ：浮点型，网格尺寸（单位：m）。
iGroup ：整型，体的组号，大于等于 1 的自然数。
```

#### 备注

（ 1 ）返回值为体的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var id 1 = igeo.genBrickV(0, 0, 0, 1, 1, 1, 0.2, 1);
```

<!--HJS_igeo_genBallV-->

### genBallV方法

#### 说明

产生球体，返回体Loop的ID。

#### 格式定义

igeo.genBallV (< *fcx, fcy, fcz, frad, fsize, iGroup>* );

#### 参数

*fcx, fcy, fcz* ：浮点型，球体中心的坐标（单位：m）。
*frad* ：浮点型，球体的半径（单位：m）。
*fsize* ：浮点型，网格尺寸（单位：m）。
*iGroup* ：整型，体的组号，大于等于 1 的自然数。

#### 备注

（ 1 ）返回值为体的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var id 1 = igeo.genBallV(0, 0, 0,0.5, 0.05, 1);
```

<!--HJS_igeo_genEllipSoidV-->

### genEllipSoidV方法

#### 说明

产生椭球体，返回体的ID。

#### 格式定义

igeo.genEllipSoidV(< fCoordX, fCoordY, fCoordZ, fXaxis, fYaxis, fZaxis, fsize,*iGroup, fAngleX, fAngleY, fAngleZ >* );

#### 参数

*fCoordX , fCoordY, fCoordZ* ：浮点型，椭球面的球心坐标，依次为X，Y，Z的坐标值。
*fXaxis, fYaxis, fZaxis* ：浮点型，椭球面X，Y，Z方向的半轴长，（单位：m）。
*fsize* ：浮点型，网格尺寸（单位：m）。
*iGroup* ：整型，面组号，大于等于 1 的自然数。
*fAngleX, fAngleY, fAngleZ* ：浮点型，椭圆体绕X，Y，Z轴的旋转角度（单位：度）。

#### 备注

（ 1 ）返回值为体的ID号（大于等于 1 的自然数），创建出错返回- 1 。
（ 2 ）依据右手螺旋准则，大拇指为旋转轴方向，四指方向为旋转角度正方向。

#### 范例

```js
var EllipSoid 1 = igeo.genEllipSoidV(20, 30, 5, 10, 8, 5, 1, 3, 20, 40, -10);
```

<!--HJS_igeo_genCylinderV-->

### genCylinderV方法

#### 说明

产生圆柱体，返回体的ID。

#### 格式定义

igeo.genCylinderV(< *fx1, fy1, fz1, fx2, fy2, fz2, frad1, frad2, fsize1, fsize2,iGroup>* );

#### 参数

*fx1, fy1, fz1* ：浮点型，圆柱中心轴一侧端点坐标（单位：m）。
*fx 2 , fy 2 , fz 2* ：浮点型，圆柱中心轴另一侧端点坐标（单位：m）。
*frad1* ：浮点型，内半径尺寸（单位：m），该值如果小于等于 0 ，表示产生实心圆柱。
*frad 2* ：浮点型，外半径尺寸（单位：m），该值必须大于 *frad1* 。
*fsize 1 , fsize2* ：浮点型，内圆柱面及外圆柱面尺寸（单位：m）。
*iGroup* ：整型，体的组号，大于等于 1 的自然数。

#### 备注

返回值为体的ID号（大于等于 1 的自然数），创建出错返回- 1 。

#### 范例

```js
var id 1 = igeo.genCylinderV(0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.2, 0.5, 0.05, 0.05, 1);
```

<!--HJS_igeo_extrude-->

### extrude方法

#### 说明

平移拉伸几何元素。

#### 格式定义

igeo.extrude (< *sType, aiID, DeltX, DeltY, DeltZ, nsize, fsize [,iGroup]* >);
2.1.29.3 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*DeltX, DeltY, DeltZ* ：浮点型，平移拉伸一次x, y, z方向的偏移量（单位：m）。
*nsize* ：整型，大于等于 1 ，平移拉伸的次数。
*fsize* ：浮点型，平移拉伸形成的几何元素的网格尺寸（单位：m）。
*iGroup* ：整型，平移拉伸形成的几何元素组号，大于等于 1 的自然数。

#### 备注

（ 1 ）sType为"point"时iGroup不能赋值，为"line"、"lineloop"时iGroup必须赋值，为"surface"时iGroup赋值与否均可，不赋值时与surface的组号一致。
（ 2 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 3 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//拉伸面 1 和面 2 生成实体
var aSurface1 = [Surface1, Surface2];
var Ope1 = igeo.extrude("Surface", aSurface1, 0.2, 0.3, 0.4, 3, 0.3, 2);
```

<!--HJS_igeo_rotate-->

### rotate方法

#### 说明

旋转拉伸几何元素。

#### 格式定义

igeo.rotate (< *sType, aiID, Point1X, Point1Y, Point1Z, Point2X, Point2Y, Point2Z,fAngle, nsize, fsize[ ,iGroup]* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*Point1X, Point1Y, Point1Z* ：浮点型，旋转轴一端的坐标值。
*Point2X, Point2Y, Point2Z* ：浮点型，旋转轴另一端的坐标值。
*fAngle* ：浮点型，绕旋转轴旋转拉伸一次的角度（单位：度）；
*nsize* ：整型，大于等于 1 ，旋转拉伸的次数。
*fsize* ：浮点型，旋转拉伸形成的几何元素的网格尺寸（单位：m）。
*iGroup* ：整型，旋转拉伸形成的几何元素的组号。

#### 备注

（ 1 ）sType为"point"时iGroup不能赋值，为"line"、"lineloop"时iGroup必须赋值，为"surface"时iGroup赋值与否均可，不赋值时与surface的组号一致。
（ 2 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 3 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//旋转拉伸面 1 和面 2 生成实体
var aSurface1 = [Surface1, Surface2];
var Ope1 = igeo.rotate("Surface", aSurface1, -20, 0, 0, -25, -5, 0, 60, 5, 0.5);
```

<!--HJS_igeo_glue-->

### glue方法

#### 说明

对几何元素进行“粘接”操作，保证接触处网格一致。

#### 格式定义

igeo.glue (< *sType [,iEntity1, iEntity2]* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"surface"、"volume"（大小写均可）。
*iEntity1, iEntity2* ：整型，所选元素ID的ID号（大于等于 1 ）。

#### 备注

（ 1 ）sType为"surface"时 *iEntity1* 和 *iEntity2* 可以指定或不指定，若不指定则对整个模型所有可粘接的面进行操作。
（ 2 ）sType为"volume"时 *iEntity1* 和 *iEntity2* 必须指定。
（ 3 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//对Volume1和Volume2执行glue操作
var Ope1 = igeo.glue("Volume", Volume 1 , Volume 2 );
```

<!--HJS_igeo_copy-->

### copy方法

#### 说明

对几何元素进行平移复制操作。

#### 格式定义

igeo.copy (< *sType, aiID, DeltX, DeltY, DeltZ, nsize* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*DeltX, DeltY, DeltZ* ：浮点型，平移复制一次x, y, z方向的偏移量（单位：m）。
*nsize* ：整型，大于等于 1 ，平移复制的次数。

#### 备注

（ 1 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 2 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//对面集执行copy操作
var aSurface1 = [Surface1, Surface2, Surface3];
var Ope1 = igeo.copy("Surface", aSurface1, 1, 4, 2, 5);
```

<!--HJS_igeo_move-->

### move方法

#### 说明

对几何元素进行平移操作。

#### 格式定义

igeo.move (< *sType, aiID, DeltX, DeltY, DeltZ* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、
"surfaceloop"、"volume"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*DeltX, DeltY, DeltZ* ：浮点型，平移的x, y, z方向偏移量（单位：m）。

#### 备注

（ 1 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 2 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//对面集执行Move操作
var aSurface1 = [Surface1, Surface2, Surface3];
var Ope1 = igeo.move("Surface", aSurface1, 1, 4, 2, 5);
```

<!--HJS_igeo_rotaCopy-->

### rotaCopy方法

#### 说明

对几何元素进行旋转复制操作。

#### 格式定义

igeo.rotaCopy (< *sType, aiID, Point1X, Point1Y, Point1Z, Point2X, Point2Y,Point2Z, fAngle, nsize* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*Point1X, Point1Y, Point1Z* ：浮点型，旋转轴一端的坐标值。
*Point2X, Point2Y, Point2Z* ：浮点型，旋转轴另一端的坐标值。
*fAngle* ：浮点型，绕旋转轴旋转复制一次的角度（单位：度）；
*nsize* ：整型，大于等于 1 ，旋转复制的次数。

#### 备注

（ 1 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 2 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//对体集执行rotatecopy操作
var aVolume1 = [Volume1, Volume2, Volume3];
var Ope1 = igeo.rotaCopy("Volume", aVolume1, -20, -10, 0, -30, 0, 5, 60, 5);
```

<!--HJS_igeo_rotaMove-->

### rotaMove方法

#### 说明

对几何元素进行旋转移动操作。

#### 格式定义

igeo.rotaMove (< *sType, aiID, Point1X, Point1Y, Point1Z, Point2X, Point2Y,Point2Z, fAngle* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*Point1X, Point1Y, Point1Z* ：浮点型，旋转轴一端的坐标值。
*Point2X, Point2Y, Point2Z* ：浮点型，旋转轴另一端的坐标值。
*fAngle* ：浮点型，绕旋转轴旋转移动的角度（单位：度）；

#### 备注

（ 1 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 2 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//对体集执行rotaMove操作
var aVolume1 = [Volume1, Volume2, Volume3];
var Ope1 = igeo.rotaMove("Volume", aVolume1, -20, -10, 0, -30, 0, 5, 60, 5);
```

<!--HJS_igeo_mirrorCopy-->

### mirrorCopy方法

#### 说明

对几何元素进行镜像复制操作。

#### 格式定义

igeo.mirrorCopy (< *sType, aiID, Point1X, Point1Y, Point1Z, Point2X, Point2Y,Point2Z, Point3X, Point3Y, Point3Z* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*Point1X, Point1Y, Point1Z* ：浮点型，镜像面一点的坐标值。
*Point2X, Point2Y, Point2Z* ：浮点型，镜像面一点的坐标值。
*Point2X, Point2Y, Point2Z* ：浮点型，镜像面一点的坐标值。

#### 备注

（ 1 ）镜像面内的三点应当不共线。
（ 2 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 3 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//对面集执行Mirrorcopy操作
var aSurface1 = [Surface1, Surface2, Surface3];

var Ope1 = igeo.mirrorCopy("Surface", aSurface1, -20, 0, 0, 0, 0, 20, -20, 10, 0);
```

<!--HJS_igeo_mirrorMove-->

### mirrorMove方法

#### 说明

对几何元素进行镜像移动操作。

#### 格式定义

igeo.mirrorMove (< *sType, aiID, Point1X, Point1Y, Point1Z, Point2X, Point2Y,
Point2Z, Point3X, Point3Y, Point3Z* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*Point1X, Point1Y, Point1Z* ：浮点型，镜像面一点的坐标值。
*Point2X, Point2Y, Point2Z* ：浮点型，镜像面一点的坐标值。
*Point2X, Point2Y, Point2Z* ：浮点型，镜像面一点的坐标值。

#### 备注

（ 1 ）镜像面内的三点应当不共线。
（ 2 ）构造aiID的Array整型时，若仅有一个元素，选择“[]”形式，若有 2个及以上数量的元素ID，“[]”和“new Array”形式均可。
（ 3 ）调用成功返回 1 ，错误返回- 1 。

#### 范例

```js
//对面集执行MirrorMove操作
var aSurface1 = [Surface1, Surface2, Surface3];
var Ope1 = igeo.mirrorMove("Surface", aSurface1, -20, 0, 0, 0, 0, 20, -20, 10, 0);
```

<!--HJS_igeo_setHardPointToFace-->

### setHardPointToFace方法

#### 说明

在平面内设置硬点，剖分网格时强制将该点作为节点。

#### 格式定义

igeo.setHardPointToFace(< *PointID, FaceID* >);

#### 参数

*PointID* ：整型，硬点的ID号，大于等于 1 的自然数。
*FaceID* ：整型，面的ID号，大于等于 1 的自然数。

#### 备注

（ 1 ）硬点的创建可通过igeo.genPoint(<>)实现。
（ 2 ）调用成功返回 0 ，错误返回- 1 。

#### 范例

```js
//在面 3 中设置硬点 2
var id = igeo. setHardPointToFace(2, 3);
```

<!--HJS_igeo_setHardLineToFace-->

### setHardLineToFace方法

#### 说明

在平面内设置硬线，剖分网格时将该硬线作为网格剖分的边界。

#### 格式定义

igeo.setHardLineToFace(< *LineID, FaceID* >);

#### 参数

*LineID* ：整型，硬线的ID号，大于等于 1 的自然数。
*FaceID* ：整型，面的ID号，大于等于 1 的自然数。

#### 备注

（ 1 ）硬线的创建可通过igeo.genLine(<>)或igeo.genCurvedLine(<>)实现。
（ 2 ）调用成功返回 0 ，错误返回- 1 。

#### 范例

```js
//在面 3 中设置硬线 2
var id = igeo. setHardLineToFace (2, 3);
```

<!--HJS_igeo_setHardPointToVol-->

### setHardPointToVol方法

#### 说明

在体内设置硬点，剖分网格时强制将该点作为节点。

#### 格式定义

igeo.setHardPointToVol(< *PointID, VolID* >);

#### 参数

*PointID* ：整型，硬点的ID号，大于等于 1 的自然数。
*VolID* ：整型，体的ID号，大于等于 1 的自然数。

#### 备注

（ 1 ）硬点的创建可通过igeo.genPoint(<>)实现。
（ 2 ）调用成功返回 0 ，错误返回- 1 。

#### 范例

```js
//在体 3 中设置硬点 2
var id = igeo. setHardPointToVol(2, 3);
```

<!--HJS_igeo_setHardLineToVol-->

### setHardLineToVol方法

#### 说明

在体内内设置硬线，剖分网格时将该硬线作为网格剖分的边界。

#### 格式定义

igeo.setHardLineToVol(< *LineID, VolID* >);

#### 参数

*LineID* ：整型，硬线的ID号，大于等于 1 的自然数。
*VolID* ：整型，体的ID号，大于等于 1 的自然数。

#### 备注

（ 1 ）硬线的创建可通过igeo.genLine(<>)或igeo.genCurvedLine(<>)实现。
（ 2 ）调用成功返回 0 ，错误返回- 1 。

#### 范例

```js
//在体 3 中设置硬线 2
var id = igeo. setHardLineToVol(2, 3);
```

<!--HJS_igeo_setHardSurfToVol-->

### setHardSurfToVol方法

#### 说明

在体内内设置硬面，剖分网格时将该硬面作为网格剖分的边界。

#### 格式定义

igeo.setHardSurfToVol(< *SurfID, VolID* >);

#### 参数

*SurfID* ：整型，硬面的ID号，大于等于 1 的自然数。
*VolID* ：整型，体的ID号，大于等于 1 的自然数。

#### 备注

（ 1 ）调用成功返回 0 ，错误返回- 1 。

#### 范例

```js
//在体 3 中设置硬面 2
var id = igeo. setHardSurfToVol(2, 3);
```

<!--HJS_igeo_setGroup-->

### setGroup方法

#### 说明

对点、线、线环、面、面环、体等几何元素进行重新分组。

#### 格式定义

igeo.setGroup(< *sName* , *iGroup, iIDLow, iIDUp* >);

#### 参数

*sName* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（全部为小写）。
*iGroup* ：整型，重新分组的组号，大于等于 1 的自然数。
*iIDLow* 、 *iIDUp* ：整型，几何元素ID号的下限及上限。

#### 备注

（ 1 ）调用成功返回 0 ，错误返回- 1 。

#### 范例

```js
//对id号为 1 - 3 的体重新命名为组 5
var iv = igeo. setGroup ("volume", 5 , 1, 3);
```

<!--HJS_igeo_setGroupAuto-->

### setGroupAuto方法

#### 说明

对点、线、线环、面、面环、体等几何元素按序号进行自动分组。

#### 格式定义

igeo.setGroupAuto(< *sName [,iGrpBeg]* >);

#### 参数

*sName* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（全部为小写）。
*iGrpBeg* ：整型，自动分组的起始组号，大于等于 1 的自然数。

#### 备注

（ 1 ） 调用成功返回 0 ，错误返回- 1 。
（ 2 ） 选定几何元素会从起始组号 *iGrpBeg* 开始，逐渐累加形成新组号。

#### 范例

```js
//对体进行自动分组，起始组号为 3
igeo.setGroupAuto ("volume", 3);
```

<!--HJS_igeo_setSize-->

### setSize方法

#### 说明

根据ID号下限及上限设置点、线、线环、面、面环、体的网格尺寸。

#### 格式定义

igeo.setSize(< *sName* , *fSize, iIDLow, iIDUp* >);

#### 参数

*sName* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（全部为小写）。
*fsize* ：浮点型，所选择实体的网格尺寸（单位：m）。
*iIDLow, iIDUp* ：整型，点ID的下限及上限。

#### 备注

（ 1 ）调用成功返回 0 ，错误返回- 1 。

#### 范例

```js
//设定ID值为 2 - 10 范围的点的网格尺寸为0.05m
igeo. setSize ("point", 0.05, 2, 10);
```

<!--HJS_igeo_GetID-->

### getID方法

#### 说明

获取离某一坐标最近的点、线、线环、面、面环、体的ID值（从 1 开始标号）。

#### 格式定义

igeo.getID(< *sName* , *fx, fy, fz* >);

#### 参数

*sName* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（全部为小写）。
*fx, fy, fz* ：浮点型，某一点坐标（单位：m）。

#### 备注

（ 1 ） 调用成功返回大于 0 的整数，错误返回- 1 （表示模型中没有该元素存在）。
（ 2 ） 元素为"line"、"lineloop"、"surface"、"surfaceloop"、"volume"时，元素的坐标用构成元素的点集的平均值表示。

#### 范例

```js
//获取离(5,5,5)最近的点的ID值
var id = igeo.getID ("point", 5.0, 5.0, 5.0);
```

<!--HJS_igeo_getValue-->

### getValue方法

#### 说明

获取igeo类中的变量值。

#### 格式定义

igeo.getValue (< *sName* [, *iflag* ] >);

#### 参数

*sName* ：字符串型，变量名称。
*iflag* ：整型，变量分量ID号，大于等于 1 的自然数；可以不写，默认为 1 。

#### 备注

（ 1 ） *sName* 包括合并指标（"IfMerge"）、全局容差（"Size"）、是否自动显示几何（"IfIgeoShowAuto"）。

（ 2 ）调用成功，返回需要获取的参数值；调用失败，返回- 1 。

#### 范例

```js
//获取全局容差
var ftol = igeo. getValue ("Tol");
```

<!--HJS_igeo_setValue-->

### setValue方法

#### 说明

设置igeo类中的变量值。

#### 格式定义

igeo.setValue (< *sName , fValue* <, *iflag* > >);

#### 参数

*sName* ：字符串型，变量名称。
*fValue* ：浮点型，设定的值。
*iflag* ：整型，变量分量ID号，大于等于 1 的自然数；可以不写，默认为 1 。

#### 备注

（ 1 ） *sName* 包括合并指标（"IfMerge"）、全局容差（"Size"）、是否自动显示几何（"IfIgeoShowAuto"）。
（ 2 ）调用成功，返回 0 ；调用失败，返回- 1 。

#### 范例

```js
igeo. setValue ("IfMerge");
```

<!--HJS_igeo_import-->

### import方法

#### 说明

从外部文件导入几何模型。

#### 格式定义

igeo.import (< *FileType* [, *FilePath* ]>);

#### 参数

*FileType* ：文件类型，可以为ID号，也可以为字符串。
	（ 1 ）ID号输入为： 1 - 导入DXF格式几何模型， 2 - STL格式的网格导入， 3 -Block3D。

​	（ 2 ）字符串输入为：”dxf”、”stl”、”blk3d”，大小写均可。

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）从DXF导入时，可导入直线段、多段线、圆弧、椭圆弧等信息。
（ 2 ）从STL导入时，文本及二进制均可。由于从STL导入的是离散的三角面片，因此软件需要划分大量时间进行面片的拼合操作，故耗时较长。
（ 3 ）从Block3D导入时，导入的是BlockCut模块产生的三维块体。

#### 范例

```js
igeo. import (“stl”);
igeo. import (“dxf”,”feng.dxf”);
igeo. import (“blk3d”,”block.blk3d_igeo”);
```

<!--HJS_igeo_draw-->

### draw方法

#### 说明

绘制几何信息。

#### 格式定义

igeo.draw ();

#### 参数

#### 备注

各颜色表示的含义：线段-蓝色，面-粉红色，体-青色。

#### 范例

```js
igeo. draw();
```

<!--HJS_igeo_pick-->

### pick方法

#### 说明

选择指定ID号范围的实体，并在模型视窗中用红色线段表示。

#### 格式定义

igeo.pick (< sName, iIDLow, iIDUp >);

#### 参数

*sName* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、
"surfaceloop"、"volume"（全部为小写）。
*iIDLow, iIDUp* ：整型，所选元素ID的下限及上限。

#### 备注

可借助igeo.drawclear清除。

#### 范例

```js
igeo. pick("line", 5, 5);
```

<!--HJS_igeo_drawClear-->

### drawClear方法

#### 说明

清除所绘制的几何图形。

#### 格式定义

igeo.drawClear ();

#### 参数

#### 备注

清除几何图形。

#### 范例

```js
igeo. drawClear();
```

<!--HJS_igeo_printInfo-->

### printInfo方法

#### 说明

打印几何信息。

#### 格式定义

igeo.printInfo ([ *iLevel* ]);

#### 参数

*iLevel* ：整型，打印信息的等级，只能为 1 或 2 。 1 - 简单信息打印， 2 - 详细信息打印。默认为 1 。

#### 备注

调用该函数，将打印点、线、线框、面、面环、体的信息。

#### 范例

```js
igeo. printInfo ();
igeo. printInfo ( 2 );
```

<!--HJS_igeo_delete-->

### delete方法

#### 说明

删除几何信息。

#### 格式定义

igeo.delete (< *sType, aiID [,iSubFlag]* >);

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、
"surfaceloop"、"volume"（大小写均可）。
*aiID* ：Array整型，所选元素ID的ID号（大于等于 1 ）。
*iSubFlag* ：整型，删除下级元素选项，只能为 0 或 1 。 0 - 不删除下级元素， 1 -删除下级元素。默认为 0 。

#### 备注

（ 1 ）执行还函数后，所有几何元素的序号及ID号将会重新排列。
（ 2 ）调用成功返回 0 ，调用错误返回- 1 。

#### 范例

```js
var aa = [1,2,3];
igeo.delete ("line", aa);
igeo.delete ("volume", aa,1);
```

<!--HJS_igeo_deleteByBound-->

### deleteByBound方法

#### 说明

删除几何边界控制下几何信息。

#### 格式定义

igeo.deleteByBound ( <sType, afBoundCoord[N][3] [,fZoomR [iPosFlag]]> );

#### 参数

*sType* ：字符串型，几何元素的类型，只能为"point"、"line"、"lineloop"、"surface"、"surfaceloop"、"volume"（大小写均可）。
*afBoundCoord* ：Array浮点型，边界坐标。包含N×3个元素。
*fZoomR* ：边界坐标的缩放因子，大于 0 （默认为1.0）。缩放因子用途，当边界位置不变，调整缩放因子可以更加精细地控制需要删除的对象。
*iPosFlag* ：整型，边界内外选项，只能为 0 或 1 。 0 - 删除边界内部元素， 1 - 删除边界外部元素。默认为 1 。

#### 备注

（ 1 ）执行还函数后，所有几何元素的序号及ID号将会重新排列。
（ 2 ）调用成功返回 0 ，调用错误返回- 1 。
（ 3 ）目前仅实现了线段删除的功能。

#### 范例

```js
var acoord = new Array();
acoord[0] = [0,0,0];
acoord[1] = [10,0,0];
acoord[2] = [10,8,0];
acoord[3] = [6,8,0];
acoord[4] = [4,3,0];
acoord[5] = [0,3,0];
igeo.deleteByBound("line",acoord, 1.1);
```

<!--HJS_igeo_clear-->

### clear方法

#### 说明

清除几何信息数据。

#### 格式定义

igeo.clear ();

#### 参数

#### 备注

调用该函数，将清除内存中存储的所有几何信息。

#### 范例

```js
igeo.clear ();
```

<!--HJS_imeshing_overview-->

## imeshing 类

参数化网格类的接口函数如下表所示

<center>参数化网格类接口</center>

| 序号 | 函数名               | 说明                                                         |
| :--: | :------------------- | :----------------------------------------------------------- |
|  1   | genMesh              | 对igeo产生的参数化几何模型进行网格剖分，剖分时将借助Gmsh软件实现，并自动将产生的网格导入至imeshing模块。 |
|  2   | genMeshByGmsh        | 对igeo产生的参数化几何模型进行网格剖分，剖分时将借助Gmsh软件实现，并自动将产生的网格导入至imeshing模块。 |
|  3   | genParRandomByCoord  | 根据坐标创建随机分布的颗粒。                                 |
|  4   | genParRegularByCoord | 根据坐标创建规则分布的颗粒。                                 |
|  5   | genParSingle         | 单独创建一个颗粒。                                           |
|  6   | genParLine           | 在一条直线上创建颗粒。                                       |
|  7   | genParCircle         | 在一条圆线上创建颗粒。                                       |
|  8   | genBar               | 参数化创建杆件。                                             |
|  9   | genBrick2D           | 参数化创建二维砖块。                                         |
|  10  | genTri               | 参数化创建三角形。                                           |
|  11  | genQuad              | 参数化创建四边形。                                           |
|  12  | genCircle            | 参数化创建圆形。                                             |
|  13  | genBrick3D           | 参数化创建三维砖块。                                         |
|  14  | genHex               | 参数化创建六面体。                                           |
|  15  | genCylinder          | 参数化创建圆柱体                                             |
|  16  | genSurfMesh          | 通过读入散点文件，插值生成用规则四边形或三角形表征的曲面（面单元） |
|  17  | extrude              | 对选择集中的线单元、面单元进行拉伸。                         |
|  18  | rotaExtrude          | 对选择集中的线单元、面单元进行旋转拉伸操作                   |
|  19  | advExtrude           | 对选择集中的线单元、面单元进行指定路径的拉伸。               |
|  20  | projExtrude          | 对选择集中的线单元、面单元进行投影拉伸。                     |
|  21  | extract              | 析出选择集中单元的边界。                                     |
|  22  | move                 | 对选择集中的单元进行平移。                                   |
|  23  | rotaMove             | 对选择集中的单元进行旋转移动。                               |
|  24  | copy                 | 对选择集中的单元进行复制。                                   |
|  25  | rotaCopy             | 对选择集中的单元进行旋转复制。                               |
|  26  | mirror               | 对选择集中的单元进行镜像。                                   |
|  27  | zoom                 | 对选择集中的单元沿着某一点进行缩放。                         |
|  28  | zoomAndTorsion       | 对选择集中的单元沿着某一根轴进行缩放及扭转。                 |
|  29  | split                | 将选择集中的四边形单元分解成三角形单元，将三棱柱、金字塔、六面体单元分解为四面体单元。 |
|  30  | refine               | 对选定的区域进行网格细化，目前仅实现了二维单元的细化。       |
|  31  | merge                | 将满足容差的单元节点进行合并。                               |
|  32  | delete               | 删除指定的单元，并删除孤立节点。                             |
|  33  | setGroup             | 重新设置单元的组号。                                         |
|  34  | SetGroupByImage      | 根据bmp图片的颜色进行重新分组。                              |
|  35  | SetGroupByImage2     | 根据bmp图片的颜色进行重新分组。                              |
|  36  | setGroupByStratum    | 根据地层信息文件对网格进行重新分组。                         |
|  37  | setTag               | 设置单元的标签号。                                           |
|  38  | getMesh              | 从Genvi平台下载网格到imeshing模块。                          |
|  39  | getValue             | 获取信息。                                                   |
|  40  | setValue             | 设置信息。                                                   |
|  41  | clear                | 清除imeshing中的网格信息。                                   |
|  42  | commitMesh           | 手动向平台推送几何网格。                                     |



<!--HJS_imeshing_genMesh-->

### genMesh方法

#### 说明

借助Gmsh软件进行网格剖分。

#### 格式定义

imeshing.genMesh (< *fSize* >);

#### 参数

*fSize* ：浮点型，全局网格尺寸，大于0.0（单位：m）。

#### 备注

（ 1 ）若点、线等几何体未指定网格尺寸，采用此全局网格尺寸进行剖分。
（ 2 ）划分网格时，如果本级几何没有赋存于上一级几何上，方可对本级几何剖分网格。

#### 范例

```js
//产生二维网格
imeshing. genMesh (0.05);
```

<!--HJS_imeshing_genMeshByGmsh-->

### genMeshByGmsh方法

#### 说明

借助Gmsh软件进行网格剖分。

#### 格式定义

imeshing.genMeshByGmsh (< *iDim <,sFileName>* >);

#### 参数

*iDim* ：整型，网格剖分类型，只能为 1 （仅一维剖分）、 2 （仅二维剖分）、 3（仅三维剖分）、 12 （一、二维剖分）、 13 （一、三维剖分）、 23 （二、三维剖分）、123 （一、二、三维剖分）。
*sFileName* ：字符串型，所生成的几何文件及调用gmsh.exe所产生的网格文件的文件名（不含扩展名）， 如果不写，则默认为”CDEM”。

#### 备注

（ 1 ）调用Gmsh进行网格剖分时，首先将在当前工作目录下产生可被Gmsh软件读取的 *sFileName*.igeo几何文件，而后在后台调用gmsh.exe，在当前目录下产生 *sFileName* .msh网格文件。
（ 2 ）划分网格时，如果本级几何没有赋存于上一级几何上，方可对本级几何剖分网格。

#### 范例

```js
//产生二维网格
imeshing. genMeshByGmsh ( 2 );
//产生三维网格
imeshing. genMeshByGmsh ( 3 ，"myMesh");
```

<!--HJS_imeshing_genParRandomByCoord-->

### genParRandomByCoord方法

#### 说明

在指定坐标范围内创建随机分布的颗粒。

#### 格式定义

imeshing. genParRandomByCoord (<iTotalNo, iType, sGroup, sRandomType,fpara1, fpara2, fx1, fx2, fy1, fy2, fz1, fz2 >);

#### 参数

iTotalNo：整型，创建随机颗粒的个数，大于等于 1 。
iType：整型，创建随机颗粒的类型，只能为 2 （二维）或 3 （三维）。
sGroup：字符串型，创建随机颗粒的组名称。
sRandomType：字符串型，随机类型。只能为"uniform"、"normal"、"weibull"之一。
fpara1, fpara2：浮点型，半径的随机变量值。

fx1, fx2：X方向的下限及上限坐标（单位：m）。
fy1, fy2：Y方向的下限及上限坐标（单位：m）。
fz1, fz2：Z方向的下限及上限坐标（单位：m）。

#### 备注

（1）如果分布模式为"uniform"，*fPra1*及*fPra2*分别表示随机参数的下限及上限。

（2）如果分布模式为"normal"（随机公式$y=\mu+\sigma  x，x=\sum_{n=1}^{12}r_n-6$， $\mu$期望，$\sigma$标准差，$ r_n$为0-1之间均匀分布随机数），*fPra1*及*fPra2*分别表示随机值的期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

（3）如果分布模式为"weibull"，*fPra1*及*fPra2*分别表示威布尔分布的$k$及$\lambda$值，weibull分布概率密度函数为$f(x) = \left\{ \begin{array}{l}
\frac{k}{\lambda }{(\frac{x}{\lambda })^{k - 1}}{e^{ - {{(x/\lambda )}^k}}}\begin{array}{*{20}{c}}
{}&{x \ge 0}
\end{array}\\
0\begin{array}{*{20}{c}}
{}&{}&{}&{}&{}&{x < 0}
\end{array}
\end{array} \right.，$概率为 $F(x) = 1 - {e^{ - {{(x/\lambda )}^k}}}，$$x$为随机变量，$\lambda$>0为比例因子，$k$>0为形状参数（$k$=1为指数分布，$k$=2为瑞利分布），（数值实现时，随机数公式$x = \lambda {( - \ln (u))^{1/k}}\\$  ，其中u为0-1的均匀分布值）。

#### 范例

//创建组名称为”rock”，均匀分布，半径下限0.05，上限0.08的 1 万个颗粒。
imeshing. genParRandomByCoord ( 10000 , 3, “rock”, "uniform", 0. 0 5, 0. 0 8, 0, 10, 0, 10, 0, 10);

<!--HJS_imeshing_genParRegularByCoord-->

### genParRegularByCoord方法

#### 说明

在指定坐标范围内创建规则分布的颗粒。

#### 格式定义

imeshing. genParRegularByCoord (<iType, sGroup, frad, fx1, fx2, fy1, fy2, fz1,fz2 >);

#### 参数

```js
iType：整型，创建颗粒的类型，只能为 2 （二维）或 3 （三维）。
sGroup：字符串型，创建颗粒的组名称。
frad：浮点型，半径值（单位：m）。
fx1, fx2：X方向的下限及上限坐标（单位：m）。
fy1, fy2：Y方向的下限及上限坐标（单位：m）。
fz1, fz2：Z方向的下限及上限坐标（单位：m）。
```

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//创建组名称为”rock”，半径为0.5的颗粒。
imeshing. genParRegularByCoord (3, “rock”, 0.5, 0, 10, 0, 10, 0, 10);
```

<!--HJS_imeshing_genParSingle-->

### genParSingle方法

#### 说明

创建单独一个颗粒。

#### 格式定义

imeshing. genParSingle (<iType, sGroup, frad, fx, fy, fz >);

#### 参数

iType：整型，创建颗粒的类型，只能为 2 （二维）或 3 （三维）。
sGroup：字符串型，创建颗粒的组名称。
frad：浮点型，半径值（单位：m）。
fx, fy, fz：颗粒体心坐标（单位：m）。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//创建组名称为”rock”，半径为0.5m，体心坐标为（0,0,0）的一个三维颗粒。
imeshing. genParSingle (3, “rock”, 0.5, 0 , 0, 0);
```

<!--HJS_imeshing_genParLine-->

### genParLine方法

#### 说明

在一条线上创建颗粒。

#### 格式定义

imeshing. genParLine(<iType, sGroup, iTotalNo, frad, fx1, fy1, fz1 , fx2, fy2, fz2 >);

#### 参数

```
iType：整型，创建颗粒的类型，只能为 2 （二维）或 3 （三维）。
sGroup：字符串型，创建颗粒的组名称。
iTotalNo：整型，颗粒个数，大于等于 1 。
frad：浮点型，半径值（单位：m）。
fx1, fy1, fz1：线段一个端点的坐标（单位：m）。
fx2, fy2, fz2：线段另一个端点的坐标（单位：m）。
```

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//在线段上创建组名称为”rock”，半径为0.5m的 10 个颗粒。
imeshing. genParLine (3, “rock”, 10, 0.5, 0, 0, 0, 10, 10, 0);
```

<!--HJS_imeshing_genParCircle-->

### genParCircle方法

#### 说明

在一个圆圈上创建颗粒。

#### 格式定义

imeshing. genParCircle(<iType, sGroup, TotalNo, BallRad, CircleRad, CenterX,CenterY, CenterZ, NormalX, NormalY, NormalZ >);

#### 参数

iType：整型，创建颗粒的类型，只能为 2 （二维）或 3 （三维）。
sGroup：字符串型，创建颗粒的组名称。
TotalNo：整型，颗粒个数，大于等于 1 。
BallRad：浮点型：颗粒半径（单位：m）。
CircleRad：浮点型，圆圈的半径（单位：m）。
CenterX, CenterY, CenterZ：圆圈的中心坐标（单位：m）。
NormalX, NormalY, NormalZ：圆圈的单位法向向量分量。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//圆圈中心坐标(0,0,0)，法向(0,0,1)，圆圈半径 3 m，颗粒半径0.2m，颗粒数量 50 个。
imeshing. genParCircle (3, “rock”, 50, 0. 2 , 3 , 0, 0, 0, 0, 0, 1 );
```

<!--HJS_imeshing_genBar-->

### genBar方法

#### 说明

参数化产生杆件单元。

#### 格式定义

imeshing. genBar (< *sGroup, fx1, fy1, fz1, fx2, fy2, fz2, iNo* >);

#### 参数

sGroup：字符串型，组的名称。
*fx1, fy1, fz1* ：浮点型，杆件第一点的坐标（单位：m）。
*fx2, fy2, fz2* ：浮点型，杆件第二点的坐标（单位：m）。
iNo：整型，杆件的分割单元数（大于等于 1 ）。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
imeshing. genBar ( “pile”, 0,0,0,0,10,0,10);
```

<!--HJS_imeshing_genBrick2D-->

### genBrick2D方法

#### 说明

参数化产生二维砖块网格。

#### 格式定义

imeshing. genBrick2D (<sGroup, fLX, fLY, iNX, iNY [, fOriginX, fOriginY ] >);

#### 参数

sGroup：字符串型，组的名称。
fLX, fLY：浮点型，砖块X方向及Y方向的长度（单位：m）。
iNX, iNY：整型，砖块X方向及Y方向的网格数（大于等于 1 ）。
fOriginX, fOriginY：浮点型，砖块最小点的坐标（单位：m）。（可以不写，默认为 0 点坐标）

#### 备注

调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

imeshing. genBrick2D ( “rock”, 1.5, 2.5, 10, 50, 10, 10);

<!--HJS_imeshing_genTri-->

### genTri方法

#### 说明

参数化产生三角形网格。

#### 格式定义

imeshing. genTri (<sGroup, afCoord[3] [3], iNX, iNY [, fRatioX, fRatioY] >);

#### 参数

sGroup：字符串型，组的名称。
afCoord：Array浮点型，三个顶点的坐标，顺时针或逆时针方向（单位：m）。
iNX, iNY：整型， X方向、Y方向的网格数（大于等于 1 ）。
fRatioX, fRatioY：浮点型，X方向、Y方向的网格尺寸增大比例。（可以不写，默认为 1 倍变化比例，即网格均匀分布）

#### 备注

（ 1 ） 调用成功，范围 0 ；调用失败，返回- 1 。
（ 2 ） 第一点、第二点为X方向，第三点为Y方向，与第三点相连的单元为三角形，其余单元为四边形。

#### 范例

```js
var afcoord = new Array(3);
afcoord[0] = [0,0,0];
afcoord[1] = [5,0,0];
afcoord[2] = [5,5,0];
imeshing. genTri ( “trd”, afcoord, 10, 10, 1.1, 1.2);
```

<!--HJS_imeshing_genQuad-->

### genQuad方法

#### 说明

参数化产生四边形网格。

#### 格式定义

imeshing. genQuad (<sGroup, afCoord [4] [3], iNX, iNY [, fRatioX, fRatioY] >);

#### 参数

sGroup：字符串型，组的名称。
afCoord：Array浮点型，四个顶点的坐标，顺时针或逆时针方向（单位：m）。
iNX, iNY：整型， X方向、Y方向的网格数（大于等于 1 ）。
fRatioX, fRatioY：浮点型，X方向、Y方向的网格尺寸增大比例。（可以不写，默认为 1 倍变化比例，即网格均匀分布）

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
var afcoord = new Array(4);
afcoord[0] = [0,0,0];
afcoord[1] = [5,0,0];
afcoord[2] = [5,3,0];
afcoord[3] = [1,4,0];
imeshing. genQuad ( “rock”, afcoord, 10, 10, 1.1, 1.2);
```

<!--HJS_imeshing_genCircle-->

### genCircle方法

#### 说明

参数化产生圆形网格。

#### 格式定义

imeshing. genCircle (<sGroup, fRadIn, fRadOut, iNoRad, iNoCir [,fX, fY, fZ [, fnx,fny, fnz [,Deg1, Deg2] ] >);

#### 参数

sGroup：字符串型，组的名称。
fRadIn：浮点型，圆内半径，如果小于等于 0 ，表示实心圆；如果大于 0 ，表示空心圆环（单位：m）。
fRadOut：浮点型，圆外半径，需要大于内半径（单位：m）。
iNoRad, iNoCir：整型，径向及环向网格数（大于等于 1 ）。
fX, fY, fZ：浮点型，圆心坐标（单位：m）。（可以不写，默认为 0 点坐标）。
fnx, fny, fnz：浮点型，圆的单位法向量分量。

Deg1, Deg2：浮点型，圆起始角度及终止角度（创建非完整圆）。（可以不写，默认Deg1为 0 度，Deg2为 360 度）。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第一种调用形式
imeshing. genCircle ( “rock 1 ”, 2.0,5.0, 20, 50);
//第二种调用形式
imeshing. genCircle ( “rock 2 ”, 2.0,5.0, 20, 3 0, 10, 0, 0);
//第三种调用形式
imeshing. genCircle ( “rock 3 ”, 2.0,5.0, 20, 3 0, 2 0, 0, 0, 1.0, 1.0, 1.0);
//第四种调用形式
imeshing. genCircle ( “rock 4 ”, 2.0,5.0, 20, 3 0, 3 0, 0, 0, 0.0, 0.0, 1.0, 30.0, 150.0);
```

 <!--HJS_imeshing_genBrick3D-->

### genBrick3D方法

#### 说明

参数化产生二维砖块网格。

#### 格式定义

imeshing. genBrick 3 D (<sGroup, fLX, fLY, fLZ, iNX, iNY, iNZ [, fOriginX,fOriginY, fOriginZ] >);

#### 参数

sGroup：字符串型，组的名称。
fLX, fLY, fLZ：浮点型，砖块X方向、Y方向及Z方向的长度（单位：m）。
iNX, iNY, iNZ：整型，砖块X方向、Y方向及Z方向的网格数（大于等于1 ）。
fOriginX, fOriginY, fOriginZ：浮点型，砖块最小点的坐标（单位：m）。（可以不写，默认为 0 点坐标）

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
imeshing. genBrick 3D ( “rock”, 5.0, 5.0, 5.0, 10, 10, 10);
```

<!--HJS_imeshing_genHex-->

### genHex方法

#### 说明

参数化产生六面体网格。

#### 格式定义

imeshing. genHex(<sGroup, afCoord[8][3], iNX, iNY, iNZ [, fRatioX, fRatioY,fRatioZ] >);

#### 参数

sGroup：字符串型，组的名称。
afCoord：Array浮点型， 8 个顶点的坐标，先写第一个面的四个点坐标（顺时针或逆时针方向），再写对侧面的四个点坐标（和第一个面的顺序及起点位置一致）（单位：m）。
iNX, iNY, iNZ：整型， X方向、Y方向、Y方向的网格数（大于等于 1 ）。
fRatioX, fRatioY, fRatioZ：浮点型，X方向、Y方向、Y方向的网格尺寸增大比例。（可以不写，默认为 1 倍变化比例，即网格均匀分布）

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
var afcoord = new Array(8);
afcoord[0] = [0,0,0];
afcoord[1] = [5,0,0];
afcoord[2] = [5,3,0];
afcoord[3] = [1,4,0];
afcoord[4] = [0,0,2];
afcoord[5] = [5,0,3];
afcoord[6] = [5,3,4];
afcoord[7] = [1,4,5];
imeshing. genHex ( “rock”, afcoord, 50, 50, 50, 1.05, 1.05, 1.05);
```

<!--HJS_imeshing_genCylinder-->

### genCylinder方法

#### 说明

参数化产生圆柱体网格。

#### 格式定义

imeshing. genCylinder (<sGroup, fRadIn, fRadOut, fx1, fy1, fz1, fx2, fy2, fz2,iNoRad, iNoCir, iNoH [,Deg1, Deg2] >);

#### 参数

sGroup：字符串型，组的名称。
fRadIn：浮点型，圆内半径，如果小于等于 0 ，表示实心圆；如果大于 0 ，表示空心圆环（单位：m）。
fRadOut：浮点型，圆外半径，需要大于内半径（单位：m）。
fx1, fy1, fz1：柱体轴向上第一个端点坐标（单位：m）。
fx 2 , fy 2 , fz 2 ：柱体轴向上第二个端点坐标（单位：m）。
iNoRad, iNoCi, iNoH r：整型，径向、环向及高度方向网格数（大于等于 1 ）。
Deg1, Deg2：浮点型，圆起始角度及终止角度（创建非完整圆）。（可以不写，默认Deg1为 0 度，Deg2为 360 度）。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第一种调用形式
imeshing. genCylinder ( “rock 1 ”, 2.0, 5.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 10, 50, 10);
//第二种调用形式
imeshing. genCylinder (“rock 1 ”, 2.0, 5.0, 0.0, 0.0, 0.0, 5.0, 0.0, 0.0, 10, 50, 10, 0, 180);
```



 <!--HJS_imeshing_genSurfMesh-->

### genSurfMesh方法

#### 说明

根据点云文本文件创建表面网格。

#### 格式定义

imeshing.genSurfMesh (<*sGroup, sFileName, iNX, iNY [, sType [,sMethod [, strExpGridFile]]]* >);

#### 参数

*sGroup*：字符串型，组的名称。

*sFileName*：字符串型，点云数据文件名称（含路径及扩展名），如果为空字符串（“”），则会自动跳出对话框进行文件拾取。

*iNX, iNY*：整型，X方向及Y方向网格数。

*sType*：字符串型，只能为“quad”（四边形）及“tri”（三角形），可以不写，默认为“quad”。

*sMethod*：字符串型，只能为“invdist1”（全域反距离法，距离指数为2）、“invdist2”（局域反距离法，距离指数为1）及“kriging”（普通克里金法），可以不写，默认为“invdist1”。

*strExpGridFile*：字符串型，GdemGrid格式的网格文件名；在表面网格生成后自动产生；如果不写该文件名，则不输出GdemGrid格式的网格文件。

#### 备注

（3） 调用成功，范围0；调用失败，返回-1。

（4） 点云数据格式为：每行3列，分别表示X、Y、Z的值。

#### 范例

```js
//第一种调用形式
imeshing.genSurfMesh ("rock1", "D:/point.txt", 100,100);

//第二种调用形式

imeshing.genSurfMesh ("rock1", "D:/point.txt", 100,100, "tri");

//第三种调用形式
imeshing.genSurfMesh ( "rock1", "D:/point.txt", 100,100, "quad", "invdist1");

//第四种调用形式
imeshing.genSurfMesh("rock1", "D:/point.txt", 100,100, "quad", "invdist1", "surf.dat");
```



<!--HJS_imeshing_extrude-->

### extrude方法

#### 说明

将线网格拉伸成面、面网格拉伸成体网格。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.extrude (< deltX, deltY, deltZ, TotalSeg [, EraseFlag] >);将当前的所有网格均进行拉伸。
（ 2 ）imeshing.extrude( < deltX, deltY, deltZ, TotalSeg, EraseFlag, str_GrpName > );将当前某一组的网格进行拉伸。
（ 3 ）imeshing.extrude( < deltX, deltY, deltZ, TotalSeg, EraseFlag, oSelObj > );将当前选择集下的网格进行拉伸。


#### 参数

*deltX, deltY, deltZ* ：浮点型，X、Y、Z方向的拉伸长度（单位：m）。
*TotalSeg* ：整型，拉伸方向的数量。
*EraseFlag* ：整型，只能为 0 或 1 ， 0 表示拉伸后不删除原网格， 1 表示拉伸后删除原网格（如果不写，则表示删除原网格）。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.extrude(0, 0, 1, 3, 1);
//第 2 种格式
imeshing.extrude(0, 0, 1, 3, 1, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing. extrude(0, 0, 1, 3, 1, Sel1);
```

<!--HJS_imeshing_rotaExtrude-->

### rotaExtrude方法

#### 说明

将线网格旋转拉伸成面网格、面网格旋转拉伸成体网格。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.rotaExtrude (< *fx1, fy1, fz1, fx2, fy2, fz2, fAngle, TotalSeg [,EraseFlag]* >);将当前的所有网格均进行旋转拉伸。
（ 2 ）imeshing.rotaExtrude( < *fx1, fy1, fz1, fx2, fy2, fz2, fAngle, TotalSeg,EraseFlag, str_GrpName* > );将当前某一组的网格进行旋转拉伸。
（ 3 ）imeshing.rotaExtrude( < *fx1, fy1, fz1, fx2, fy2, fz2, fAngle, TotalSeg,EraseFlag, oSelObj* > );将当前选择集下的网格进行旋转拉伸。

#### 参数

*fx1, fy1, fz1* ：浮点型，旋转轴上第一点的坐标。
*fx2, fy2, fz2* ：浮点型，旋转轴上第二点的坐标。
*fAngle* ：浮点型，旋转角度，- 360 到360°之间，不能为 0 °。
*TotalSeg* ：整型，旋转拉伸方向的数量。
*EraseFlag* ：整型，只能为 0 或 1 ， 0 表示拉伸后不删除原网格， 1 表示拉伸后删除原网格（如果不写，则表示删除原网格）。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing. rotaExtrude (-1,0,0,-1,1,0,270,50,0);
//第 2 种格式
imeshing. rotaExtrude (-1,0,0,-1,1,0,270,50,0, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing. rotaExtrude (-1,0,0,-1,1,0,270,50,0, Sel1);
```

<!--HJS_imeshing_advExtrude-->

### advExtrude方法

#### 说明

将线单元或面单元进行指定路径的拉伸。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.advExtrude ( *<afCoord[N][3], fsize [, EraseFlag [, CSFlag]]* >);将当前的所有网格均进行指定路径的拉伸。
（ 2 ）imeshing.advExtrude( < *afCoord[N][3], fsize, EraseFlag, CSFlag,str_GrpName>* );将当前某一组的网格进行指定路径的拉伸。

（ 3 ）imeshing.advExtrude( < *afCoord[N][3], fsize, EraseFlag, CSFlag,oSelObj>* );将当前选择集下的网格进行指定路径的拉伸。

#### 参数

*afCoord[N][3]* ：Array浮点型，拉伸路径（多段线），由一系列三维点组成，至少包含 2 个点，组成 1 条直线。
*fsize* ：浮点型，拉伸网格的尺寸。
*EraseFlag* ：整型，只能为 0 或 1 ， 0 表示拉伸后不删除原网格， 1 表示拉伸后删除原网格（如果不写，则表示删除原网格）。
*CSFlag* ：整型，只能为 0 或1,0表示所拉伸的界面不是垂直界面， 1 表示所拉伸的界面是垂直截面（不写，默认为 0 ）。如果为垂直界面，则当拉伸原面的法向与第一条线段的方向不一致时，将会对拉伸截面进行旋转后进行拉伸。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//创建拉伸路径
var afCoord = new Array();
afCoord[0] = [0.5,0.5,0];
afCoord[1] = [0.5,0.5,5];
afCoord[2] = [5.5,0.5,5];
afCoord[3] = [5.5,0.5,0];
afCoord[4] = [10.5,0.5,0];
afCoord[5] = [10.5,0.5,5];

//第 1 种格式
imeshing. advExtrude (afCoord,0.2, 1, 0);
//第 2 种格式
imeshing. advExtrude (afCoord,0.2, 1, 0, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing. advExtrude (afCoord,0.2, 1, 0, Sel1);
```

<!--HJS_imeshing_projExtrude-->

### projExtrude方法

#### 说明

将线单元或面单元向某一平面进行投影拉伸。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.projExtrude( *<fx, fy, fz, fnx, fny, fnz, TotalSeg [, EraseFlag]>* );将当前的所有网格均进行投影拉伸。
（ 2 ）imeshing.projExtrude(< *fx, fy, fz, fnx, fny, fnz, TotalSeg, EraseFlag,str_GrpName>* );将当前某一组的网格进行投影拉伸。
（ 3 ）imeshing.projExtrude(< *fx, fy, fz, fnx, fny, fnz, TotalSeg, EraseFlag,oSelObj>* );将当前选择集下的网格进行投影拉伸。

#### 参数

*fx, fy, fz* ：浮点型，投影平面上的一点坐标（单位：m）。
*fnx, fny, fnz* ：浮点型，投影平面的单位法向量。
*TotalSeg* ：整型，拉伸方向的数量。
*EraseFlag* ：整型，只能为 0 或 1 ， 0 表示拉伸后不删除原网格， 1 表示拉伸后删除原网格（如果不写，则表示删除原网格）。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.projExtrude(0,0,0,0,0,1,10, 1 );
//第 2 种格式
imeshing.projExtrude(0,0,0,0,0,1,10, 1 , “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.projExtrude(0,0,0,0,0,1,10, 1 , Sel1);
```

<!--HJS_imeshing_extract-->

### extract方法

#### 说明

将当前选择集下的体网格的边界进行析出成面网格。

#### 格式定义

imeshing. extract (< *oSelObj* , *[EraseFlag, [sGroup]]* >);

#### 参数

*oSelObj* ：Genvi的选择集，为SelElemFaces类型。
*EraseFlag* ：整型，只能为 0 或 1 ， 0 表示析出后不删除原有单元， 1 表示析出后删除原有单元（如果不写，则表示删除网格）。
*sGroup* ：字符串型，组号名称，该接口允许从体中析出的面单元用不同的组号。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//进行界面选择，选择体单元的某些要析出的面
var Sel1 = new SelElemFaces(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
//对当前选择集进行面单元析出操作
imeshing.extract(Sel1);
imeshing.extract(Sel1, 0 , “ffcc”);
```

<!--HJS_imeshing_move-->

### move方法

#### 说明

将网格进行平移操作。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.move( < deltX, deltY, deltZ > );将当前的所有网格均进行平移。
（ 2 ）imeshing.move( < deltX, deltY, deltZ, str_GrpName > );将当前某一组的网格进行平移。
（ 3 ）imeshing.move( < deltX, deltY, deltZ, oSelObj > );将当前选择集下的网格进行平移。

#### 参数

```
deltX, deltY, deltZ ：浮点型，三个方向的平移距离（单位：m）。
str_GrpName ：字符型，字符内容为组号。
oSelObj ：Genvi的选择集，为SelElems或SelElemFaces类型。
```

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.move(1.0, 0.0, 0.0);
//第 2 种格式
imeshing.move(1.0, 0.0, 0.0, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.move(1.0, 0.0, 0.0, Sel1);
```

<!--HJS_imeshing_rotaMove-->

### rotaMove方法

#### 说明

将网格进行旋转移动操作。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing. rotaMove ( *<fx1, fy1, fz1, fx2, fy2, fz2, DeltaAngle>* );
将当前的所有网格均进行旋转移动操作。
（ 2 ）imeshing.rotaMove( *<fx1, fy1, fz1, fx2, fy2, fz2, DeltaAngle, str_GrpName* > );
将当前某一组的网格进行旋转移动操作。
（ 3 ）imeshing. rotaMove ( *<fx1, fy1, fz1, fx2, fy2, fz2, DeltaAngle, oSelObj* > );
将当前选择集下的网格进行旋转移动操作。

#### 参数

*fx1, fy1, fz1* ：浮点型，旋转轴第一点的坐标（单位：m）。
*fx 2 fy 2 , fz 2* ：浮点型，旋转轴第二点的坐标（单位：m）。
*DeltaAngle* ：浮点型，旋转角度（单位：度）。
str_GrpName ：字符型，字符内容为组号。
oSelObj ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.rotaMove( 0 ,0,-1,0,0,1,30);
//第 2 种格式
imeshing.rotaMove( 0 ,0,-1,0,0,1,30, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.rotaMove( 0 ,0,-1,0,0,1,30, Sel1);
```

<!--HJS_imeshing_copy-->

### copy方法

#### 说明

将网格进行平移复制操作。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing. copy (< *deltX, deltY, deltZ, CpyNo* >);将当前的所有网格均进行平移复制操作。
（ 2 ）imeshing. copy (< *deltX, deltY, deltZ, CpyNo, str_GrpName* > );将当前某一组的网格进行平移复制操作。
（ 3 ）imeshing. copy (< *deltX, deltY, deltZ, CpyNo, oSelObj* > );将当前选择集下的网格进行平移复制操作。

#### 参数

*deltX, deltY, deltZ* ：浮点型，三个方向的平移距离（单位：m）。
*CpyNo* ：整型，复制个数，大于等于 1 。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.copy(1.0, 0.0, 0.0, 5);
//第 2 种格式
imeshing.copy(1.0, 0.0, 0.0, 5, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.copy(1.0, 0.0, 0.0, 5, Sel1);
```

<!--HJS_imeshing_rotaCopy-->

### rotaCopy方法

#### 说明

将网格进行旋转复制操作。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing. rotaCopy ( *<fx1, fy1, fz1, fx2, fy2, fz2, DeltaAngle,CpyNo>* );将当前的所有网格均进行旋转复制操作。
（ 2 ）imeshing. rotaCopy ( *<fx1, fy1, fz1, fx2, fy2, fz2, DeltaAngle,CpyNo,str_GrpName* > );将当前某一组的网格进行旋转复制操作。
（ 3 ）imeshing. rotaCopy ( *<fx1, fy1, fz1, fx2, fy2, fz2, DeltaAngle,CpyNo,oSelObj* > );将当前选择集下的网格进行旋转复制操作。

#### 参数

*fx1, fy1, fz1* ：浮点型，旋转轴第一点的坐标（单位：m）。
*fx 2 fy 2 , fz 2* ：浮点型，旋转轴第二点的坐标（单位：m）。
*DeltaAngle* ：浮点型，旋转角度（单位：度）。
*CpyNo* ：整型，复制个数，大于等于 1 。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.rotaCopy( 0 ,0,-1,0,0,1,30,5);
//第 2 种格式
imeshing.rotaCopy( 0 ,0,-1,0,0,1,30,5, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.rotaCopy( 0 ,0,-1,0,0,1,30,5, Sel1);
```

<!--HJS_imeshing_mirror-->

### mirror方法

#### 说明

将网格进行镜像复制。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.mirror( < fx1, fy1, fz1, fx2, fy2, fz2, fx3, fy3, fz3 > );将当前的所有网格均进行镜像复制。
（ 2 ）imeshing.mirror( < fx1, fy1, fz1, fx2, fy2, fz2, fx3, fy3, fz3, str_GrpName > );将当前某一组的网格进行镜像复制。
（ 3 ）imeshing.mirror( < fx1, fy1, fz1, fx2, fy2, fz2, fx3, fy3, fz3, oSelObj > );将当前选择集下的网格进行镜像复制。

#### 参数

*fx1, fy1, fz1* ：浮点型，平面第一点的坐标（单位：m）。
*fx 2 fy 2 , fz 2* ：浮点型，平面第二点的坐标（单位：m）。
*fx 3 fy 3 , fz 3* ：浮点型，平面第三点的坐标（单位：m）。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.mirror( 0 ,0,0,1,0,0,1,0,1);
//第 2 种格式

imeshing.mirror( 0 ,0,0,1,0,0,1,0,1, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.mirror( 0 ,0,0,1,0,0,1,0,1, Sel1);
```

<!--HJS_imeshing_zoom-->

### zoom方法

#### 说明

将网格进行沿着某一点进行缩放操作。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.zoom( *<fx, fy, fz, fRatio>* );将当前的所有网格均沿着某一点进行缩放操作。
（ 2 ）imeshing.zoom( *<fx, fy, fz, fRatio, str_GrpName* > );将当前某一组的网格沿着某一点进行缩放操作。
（ 3 ）imeshing.zoom( *<fx, fy, fz, fRatio, oSelObj* > );将当前选择集下的网格沿着某一点进行缩放操作。

#### 参数

*fx, fy, fz* ：浮点型，缩放基点坐标（单位：m）。
*fRatio* ：浮点型，缩放比例，大于 0 （大于 1 表示放大， 0 到 1 之间表示缩小）。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.zoom(0,0,1,0.6);
//第 2 种格式
imeshing.zoom(0,0,1,0.6, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);

imeshing.zoom(0,0,1,0.6, Sel1);
```

<!--HJS_imeshing_zoomAndTorsion-->

### zoomAndTorsion方法

#### 说明

将网格进行沿着某一轴进行缩放及扭转操作。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.zoomAndTorsion(< *fx1, fy1, fz1, fx2, fy2, fz2, fZoom1, fZoom2 [,fDeg1, fDeg2]* >);将当前的所有网格均沿着某一轴进行缩放及扭转操作。
（ 2 ）imeshing.zoomAndTorsion(< *fx1, fy1, fz1, fx2, fy2, fz2, fZoom1, fZoom, fDeg1,fDeg2, str_GrpName* > );将当前某一组的网格沿着某一轴进行缩放及扭转操作。
（ 3 ）imeshing.zoomAndTorsion(< *fx1, fy1, fz1, fx2, fy2, fz2, fZoom1, fZoom2,fDeg1, fDeg2, oSelObj* > );将当前选择集下的网格沿着某一轴进行缩放及扭转操作。

#### 参数

*fx1, fy1, fz1* ：浮点型，旋转轴线段第一点的坐标（单位：m）。
*fx 2 fy 2 , fz 2* ：浮点型，旋转轴线段第二点的坐标（单位：m）。
*fZoom1, fZoom2* ：浮点型，旋转轴第一点及第二点的缩放比例，大于0.0（大于 1 表示方， 0 到 1 之间表示缩）。
*fDeg1, fDeg2* ：浮点型，旋转轴第一点及第二点的扭转角度（单位：°）。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）若节点在旋转轴线段之外，不执行缩放或扭转操作；若节点在旋转轴线段之内，按照线性插值进行缩放及扭转操作。
（ 2 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式

imeshing.zoomAndTorsion( 0 , 0, 0, 0, 1, 0, 0.5, 1.5, 0.0, 720.0);
//第 2 种格式
imeshing.zoomAndTorsion( 0 , 0, 0, 0, 1, 0, 0.5, 1.5, 0.0, 720.0, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.zoomAndTorsion( 0 , 0, 0, 0, 1, 0, 0.5, 1.5, 0.0, 720.0, Sel1);
```

<!--HJS_imeshing_split-->

### split方法

#### 说明

将四边形单元分解成三角形单元，将三棱柱、金字塔、六面体单元分解为四面体单元。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.split(< *[iType]* >);将当前的所有网格均进行分解。
（ 2 ）imeshing.split(< *iType, str_GrpName* > );将当前某一组的网格进行分解。
（ 3 ）imeshing.split(< *iType, oSelObj* > );将当前选择集下的网格进行分解。

#### 参数

*iType* ：整型，单元分解类型，只能为 1 、 2 及 3 。 1 表示按模式 1 进行分解，2 表示按模式 2 进行分解， 3 表示模式 1 及模式 2 中随机选一种进行分解。（默认为模式 1 ）。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.split( 1 );
//第 2 种格式
imeshing.split( 1 , “1”);

//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.split( 1 , Sel1);
```



 <!--HJS_imeshing_refine-->

### refine方法

#### 说明

对选择集中的二维单元或三维单元进行细化。

#### 格式定义

共包含三种格式定义：

（1）imeshing.refine();

将当前的所有网格均进行细化。

（2）imeshing.refine(<*str_GrpName*>);

将当前某一组的网格进行细化。

（3）imeshing.refine(<*oSelObj*>);

将当前选择集下的网格进行细化。

#### 参数

*str_GrpName*：字符串型，组号名称，可在Genvi平台左侧树形栏MeshFactory中查看。

*oSelObj*：对象类型，借助Genvi平台的选择功能实现。

#### 备注

（1） 调用成功，范围0；调用失败，返回-1。如果调用成功，则将把选中的二维单元拆分成一系列三角形；将对选中的三维单元拆分成一系列四面体。

（2） 二维单元支持三角形及四边形，三维单元支持四面体、三棱柱、金字塔及六面体。

（3） 目前，仅实现了二维单元的细化。

#### 范例

```js
//第一种格式
imeshing.refine();

//第二种格式，对组名称为“soil”的单元进行细化
imeshing.refine("soil");

//第三种格式，对所选择的单元进行细化
//选择要分解的网格，以下括号中选择的mesh对象必须为imeshing

var Sel1 = new SelElems(imeshing);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);

//对当前选择集中的网格进行分解操作
imeshing.refine (Sel1);
imeshing.refine (Sel1,"2d");
```



<!--HJS_imeshing_merge-->

### merge方法

#### 说明

将满足容差的单元节点进行合并。

#### 格式定义

imeshing.merge(<>);

#### 参数

无。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。
（ 2 ）可通过imeshing.setValue("Tol")进行容差控制。

#### 范例

```js
//对满足容差的节点进行合并
imeshing.merge();
```

<!--HJS_imeshing_delete-->

### delete方法

#### 说明

将设定类型的单元进行删除。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing.delete (< [iType] >);将当前的所有网格均进行删除。
（ 2 ）imeshing.delete (< iType, str_GrpName > );将当前某一组的网格进行删除。
（ 3 ）imeshing.delete (< iType, oSelObj > );将当前选择集下的网格进行删除。


#### 参数

*sType* ：字符串行，单元类型，只能为"all"、"par"、"bar"、"tri"、"quad"、"tet"、
"pyra"、"wedge"、"hex"中的一种，默认为"all"，即所有类型单元。
*str_GrpName* ：字符型，字符内容为组号。
*oSelObj* ：Genvi的选择集，为SelElems或SelElemFaces类型。

#### 备注

（ 1 ）调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.delete (“all”);
//第 2 种格式
imeshing.delete (“all”, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.delete (“all”, Sel1);
```

<!--HJS_imeshing_setGroup-->

### setGroup方法

#### 说明

将网格进行重新分组。

#### 格式定义

共包含三种格式定义：

（ 1 ）imeshing. setGroup (< *sName* >);将当前的所有网格均进行设置为某一组。
（ 2 ）imeshing. setGroup (< *sName, str_GrpName* > );将当前某一组的网格设置为某一组。
（ 3 ）imeshing. setGroup (< *sName, oSelObj* > );将当前选择集下的网格设置为某一组。

#### 参数

*sName* ：字符串型，组号名称。

#### 备注

（ 1 ） 调用成功，范围 0 ；调用失败，返回- 1 。

#### 范例

```js
//第 1 种格式
imeshing.setGroup(“soil”);
//第 2 种格式
imeshing.setGroup(“soil”, “1”);
//第 3 种格式
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);
imeshing.setGroup(“soil”, Sel1);
```



<!--HJS_imeshing_setGroupByImage-->

### SetGroupByImage方法

#### 说明

根据bmp图片的像素颜色对所选择的网格重新分组。

#### 格式定义

mesh.SetGroupByImage(<*[ iDivNo [, sName]]*>);

####  参数

*iDivNo*：整型，颜色值分段数目，可以不写，默认为100。

*sName*：字符串型，bmp图像的文件路径及文件名称。可以不写，不写则自动跳出文件选择对话框，进行鼠标选择。

#### 备注

（1）  调用成功，范围0；调用失败，返回-1。

（2）  调用本函数，首先将图片中的颜色进行灰度转换，然后获取灰度值的最大及最小值，而后将最大及最小值之间分割为*iDivNo*份，若单元所有节点的灰度平均值位于某一分段内，将该单元设置为对应组号。

（3）  所调入图片的格式必须为bmp格式，仅支持8位、24位及32位bmp图片。

（4）  调用该函数后，将在当前工作路径下产生” BitMapColor.txt”文本文件，该本文文件记录了每个像素点的RGB值及灰度值。

（5）  选择单元后，软件自动计算单元X坐标及Y坐标的上下限，然后和图片的X方向及Y方向的像素进行匹配。

#### 范例

```javascript
//进行界面选择，选择需要重新分组的单元
sel.pick();
//对当前选择集进行重新分组，读入image.bmp的图片，对最大灰度及最小灰度值间分割50份。
mesh.SetGroupByImage(50, “image.bmp”); 
```

<!--HJS_imeshing_setGroupByImage2-->

### SetGroupByImage2方法

#### 说明

根据bmp图片的像素颜色对所选择的网格重新分组。

#### 格式定义

mesh.SetGroupByImage2(<*afRGBT[][4] [, sName]*>);

#### 参数

*afRGBT*：Array浮点型，需要重新分组的RGB值及容差值，每个分量包含4个元素，分别为R、G、B三色值（0-255之间），第三个元素为色值容差。

*sName*：字符串型，bmp图像的文件路径及文件名称。可以不写，不写则自动跳出文件选择对话框，进行鼠标选择。

#### 备注

（1）  调用成功，范围0；调用失败，返回-1。

（2）  调用本函数，将根据用户输入的颜色及容差值，对图片所有像素进行循环，当单元各节点的平均RGB颜色值在容差范围之内，则设定该单元为设定组号。

（3）  所调入图片的格式必须为bmp格式，仅支持8位、24位及32位bmp图片。

（4）  调用该函数后，将在当前工作路径下产生” BitMapColor.txt”文本文件，该本文文件记录了每个像素点的RGB值及灰度值。

（5）  选择单元后，软件自动计算单元X坐标及Y坐标的上下限，然后和图片的X方向及Y方向的像素进行匹配。

#### 范例

```javascript
//进行界面选择，选择需要重新分组的单元
sel.pick();
//对当前选择集进行重新分组，读入image.bmp的图片，对黑色（0,0,0）区域进行重新分组，容差为50。
mesh.SetGroupByImage2([0, 0, 0, 50], "image.bmp"); 
```



 <!--HJS_imeshing_setGroupByStratum-->

### setGroupByStratum方法

#### 说明

根据地层信息文件对网格进行重新分组。

#### 格式定义

imeshing.setGroupByStratum (< *[strFileName [, strGroup(oSelObj)]]*>);

共包含三种格式定义：

（1）imeshing. setGroupByStratum ();

imeshing. setGroupByStratum (<*strFileName >*);

将所有网格进行地层设置。

（2）imeshing. setGroupByStratum (<*strFileName*, *strGroup* >);

将当前某一组的网格进行地层设置。

（3）imeshing. setGroupByStratum (<*strFileName,* *oSelObj* >);

将当前选择集下的网格进行地层设置。

 

#### 参数

*str_FileName*：字符串型，地层信息的文件路径及文件名称。可以不写，不写则自动跳出文件选择对话框，进行鼠标选择。

*strileName*：字符串型，组号名称，可在Genvi平台左侧树形栏MeshFactory中查看。

*oSelObj*：对象类型，借助Genvi平台的选择功能实现。

#### 备注

（1） 调用成功，范围0；调用失败，返回-1。

（2） 地层信息文件是一个文本文件，内容包含了地层数量（大于等于1的自然数），自上而下每个地层的网格文件名（每个文件为GdemGrid格式文件）。

（3） 算法实施时，根据所选定的单元的体心，判定该单元位于哪个地层内，并将该单元的组号修改为Layer_i（i为地层id号）。

（4） 需要注意的是，地层信息文件（即下图中的arrange.txt）中，地层网格文件名的排列顺序为按照高程自上而下，即靠近地表的地层放在前面。

![img](\images\imeshing-SetGroupByStratum_1.jpg) 

地层信息文件

<img src="\images\imeshing-SetGroupByStratum_2.jpg" alt="img" style="zoom: 80%;"/> 

GdemGrid网格文件

#### 范例

```js
//第一种格式
imeshing. setGroupByStratum ();
imeshing. setGroupByStratum ("arrange.txt");

//第二种格式
imeshing. setGroupByStratum ("arrange.txt", “Grp_1”);

//第三种格式
//选择要分组的网格，以下括号中选择的mesh对象必须为imeshing
var Sel1 = new SelElems(imeshing);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);

//调入"arrange.txt"的地层文件信息进行单元重新分组
imeshing.setGroupByStratum ("arrange.txt", Sel1);
```

 

<!--HJS_imeshing_setTag-->

### setTag方法

#### 说明

设置单元的标签。

#### 格式定义

imeshing. setTag (< *sName* >);

#### 参数

*sName* ：字符串型，标签名称。

#### 备注

（ 1 ） 调用成功，范围 0 ；调用失败，返回- 1 。
（ 2 ） 标签名称主要用于区分单元类型，如固体单元，流体单元等。
（ 3 ） 该接口函数必须在单元创建之前执行，新创建的单元将具有在这之前设置的标签。

#### 范例

```js
//设置标签
imeshing.setTag(“solid”);
imeshing.genBrick2D(“g 1 ”,1,1,5,5);
imeshing. setTag(“fluid”);
imeshing.genBrick2D(“g2”,1,1,5,5,2,0);
```



<!--HJS_imeshing_getMesh-->

### getMesh方法

#### 说明

将Genvi平台上其他模块的几何网格或物理网格下载到imeshing模块进行处理。

#### 格式定义

imeshing.getMesh(<*oMesh*>);

#### 参数

*oMesh*：JavaScript对象，平台上其他模块的几何或物理网格。

#### 备注

（1） 调用成功，范围0；调用失败，返回-1。

（2） oMesh不能是imeshing模块自身的网格对象。

#### 范例

```js
//第一种调用形式
imeshing.getMesh(oMesh);
```



<!--HJS_imeshing_getValue-->

### getValue方法

#### 说明

获取mesh类中的变量值。

#### 格式定义

imeshing.getValue (< *sName* <, *iflag* > >);

#### 参数

sName ：字符串型，变量名称。
iflag ：整型，变量分量ID号，大于等于 1 的自然数；可以不写，默认为 1 。

#### 备注

（ 1 ） *sName* 包括合并指标（"IfMerge"）、 全局容差（"Size"）及全局网格尺寸（"Tol"），二维网格剖分类型（"MeshType2D"）、三维网格剖分类型（"MeshType3D"）、是否自动向Genvi平台推送imeshing模块创建的网格（"IfCommitMeshAuto"）、质点的显示尺寸（"MassPointSize"）。
（ 2 ）"MeshType2D"包含允许的整数代号为： 1 、 2 、 5 、 6 、 7 、 8 ，分别表示
1=MeshAdapt，2=Automatic，5=Delaunay，6=Frontal，7=bamg，8=delquad。默认
值为 2 。
（ 3 ）"MeshType3D"包含允许的整数代号为： 1 、 4 、 5 、 6 、 7 ，分别表示
1=Delaunay，4=Frontal，5=Frontal Delaunay，6=Frontal Hex，7=MMG3D（默认
为 1 ）。
（ 4 ）调用成功，返回需要获取的参数值；调用失败，返回- 1 。

#### 范例

```js
//获取全局容差
var ftol = imeshing. getValue ("Tol");
```

<!--HJS_imeshing_setValue-->

### setValue方法

#### 说明

设置mesh类中的变量值。

#### 格式定义

imeshing.setValue (< *sName , fValue* <, *iflag* > >);

#### 参数

*sName* ：字符串型，变量名称。
*fValue* ：浮点型，设定的值。
*iflag* ：整型，变量分量ID号，大于等于 1 的自然数；可以不写，默认为 1 。

#### 备注

（ 1 ） *sName* 包括合并指标（"IfMerge"）、 全局容差（"Size"）及全局网格尺寸（"Tol"），二维网格剖分类型（"MeshType2D"）、三维网格剖分类型（"MeshType3D"）、是否自动向Genvi平台推送imeshing模块创建的网格（"IfCommitMeshAuto"）、质点的显示尺寸（"MassPointSize"）。
（ 2 ）"MeshType2D"包含允许的整数代号为： 1 、 2 、 5 、 6 、 7 、 8 ，分别表示: 1=MeshAdapt，2=Automatic，5=Delaunay，6=Frontal，7=bamg，8=delquad。默认值为 2 。
（ 3 ）"MeshType3D"包含允许的整数代号为： 1 、 4 、 5 、 6 、 7 ，分别表示:1=Delaunay，4=Frontal，5=Frontal Delaunay，6=Frontal Hex，7=MMG3D（默认为 1 ）。
（ 4 ）调用成功，返回 0 ；调用失败，返回- 1 。

#### 范例

```js
imeshing. setValue ("IfMerge", 1);
```

<!--HJS_imeshing_clear-->

### clear方法

#### 说明

清除mesh中的网格及节点数据。

#### 格式定义

imeshing.clear ();

#### 参数

#### 备注

调用该函数，将清除内存中存储的所有网格信息。

#### 范例

```js
imeshing.clear (<>);
```



 <!--HJS_imeshing_commitMesh-->

### commitMesh方法

#### 说明

向Genvi平台手动推送一次imeshing模块内部的网格。

#### 格式定义

imeshing.commitMesh();

#### 参数

 无。

#### 备注

当采用imeshing模块的内置函数，通过循环方式反复产生网格时，由于向平台推送网格的开关默认是打开的，则每新建一次网格，就会向平台推送一次网格；如果反复推送，会导致效率变低，同时也会导致平台显示网格时出现问题。此时，可关系自动推送开关，改用此脚本按需进行手动推送。

#### 范例

```js
//关闭自动推送开关
imeshing.setValue("IfCommitMeshAuto",0)
//手动推送一次网格
imeshing.commitMesh();
```



