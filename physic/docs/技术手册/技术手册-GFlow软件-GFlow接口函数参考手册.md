# GFlow接口函数参考手册

## 概述

地质颗粒流运动分析软件GFlow是一款求解颗粒碎屑流类地质灾害发展演化及运动成灾过程的多核CPU并行高效数值模拟软件。该软件基于深度基本的有限体积法，可充分考虑场地摩擦效应及沿途松散堆积体侵蚀刮铲效应对地质灾害成灾路径、成灾范围及堆积厚度的影响。该软件可对碎屑流、泥石流、高速远程滑坡、尾矿库溃坝等灾害的成灾过程进行精确分析，通过与CDyna软件的耦合，可实现地质灾害从变形破坏到运动成灾全过程的快速推演。

本手册主要供GFlow的用户开展相应的数值计算使用。该手册提供了从网格导入、计算条件施加、核心计算及计算结果输出等的多类JavaScript接口函数，可方便用户开展碎屑流、泥石流等地质流体运动堆积过程的分析。

# 公共接口

本章主要介绍地质流体模块的接口函数，函数列表见表1.1。

包括计算网格的导入、全局量的设置及获取、求解过程设置、时程信息的监测、计算结果输出设置等。

表1.1 地质流体接口函数列表

| 序号 | 函数名                    | 说明                                           |
| ---- | ------------------------- | ---------------------------------------------- |
| 1    | defGrid                   | 导定义地质流体计算网格                         |
| 2    | setMat                    | 设置地质流体材料参数                           |
| 3    | setValue                  | 设置全局变量                                   |
| 4    | getValue                  | 获取全局变量                                   |
| 5    | importGrid                | 导入地质流体计算网格                           |
| 6    | exportGrid                | 输出地质流体计算网格（滑床网格及滑体厚度网格） |
| 7    | setSlidingBodyBySphere    | 设置球形滑体                                   |
| 8    | setSlidingBodyByCylinder  | 设置圆柱形滑体                                 |
| 9    | setSlidingBodyByBrick     | 设置方块形滑体                                 |
| 10   | setSlidingBodyByEllipsoid | 设置椭球形滑体                                 |
| 11   | setSlidingBodyByPolygon   | 设置多边形滑体                                 |
| 12   | setTerrainBySphere        | 在原有地形基础上增加球体地形                   |
| 13   | setTerrainByCylinder      | 在原有地形基础上增加柱体地形                   |
| 14   | setTerrainByBrick         | 在原有地形基础上增加方块地形                   |
| 15   | setTerrainByEllipsoid     | 在原有地形基础上增加椭球地形                   |
| 16   | setTerrainByPolygon       | 在原有地形基础上增加多边形柱地形               |
| 17   | setGridFile               | 设置用gflow核心求解器求解的滑床及滑体文件      |
| 18   | domainMapping             | 设置区域映射                                   |
| 19   | solve                     | 求解若干步                                     |
| 20   | resultImport              | 计算结果导入                                   |
| 21   | hist                      | 监测某一测点的时程信息                         |
| 22   | drawHistPos               | 绘制监测点的空间位置                           |
| 23   | clear                     | 清除gflow相应内存数据                          |

 

### defGrid方法

#### 说明

定义Grid格式网格的X方向长度、Y方向长度、X方向格点数量、Y方向格点数量。

#### 格式定义

gflow.defGrid(*fXMin, fXMax,fYMin,fYMax, nNoX, nNoY*);

#### 参数

*fXMin, fXMax*：浮点型，区域X方向的最小坐标及最大坐标值，单位：m

*fYMin,fYMax*：浮点型，区域Y方向的最小坐标及最大坐标值，单位：m

*nNoX*：整型，X方向的网格数量

*nNoY*：整型，Y方向的网格数量

#### 备注

执行该命令后，内存中的网格数据将被重置，将生成X坐标为fXMin~ fXMax，Y坐标为fYMin~fYMax，Z坐标为0的格栅网格。

#### 范例

```js
//产生100m × 200m的正交网格区域，X方向格点数为200，Y方向格点数为400
gflow.defGrid(0.0, 100.0, 0.0, 200.0, 200, 400);
```



### setMat方法

#### 说明

设置计算用材料参数。

#### 格式定义

gflow.setMat(*fFriction, fLamuda, fManning*);

#### 参数

*fFriction*：浮点型，场地摩擦角，单位：度

*fLamuda*：浮点型，场地孔隙压力比

*fManning*：浮点型，曼宁系数

#### 备注

#### 范例

```js
//设置摩擦角为15度，场地孔隙压力比，曼宁系数为0.01
gflow.setMat(15, 0.0, 0.01);
```



### setValue方法

#### 说明

设置全局参数数值。

#### 格式定义

gflow.setValue(*strName*, *fValue* [,*iflag*]);

#### 参数

*strName*：字符串型，设置变量的名称。

*fValue*：整型（I）或浮点数（F），设置变量的参数值。不同的参数名可能具有不同的参数类型。

*iflag*：整型，设置变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

每执行一次命令，对应的全局参数便进行一次重置。

可供设置的全局变量见附表1。

#### 范例

```js
//设置计算时间为20秒
gflow.setValue(“LastTime”, 20.0);

//设置云图输出间隔为100步
gflow.setValue(“OutputInterval”, 100);
```



### getValue方法 

#### 说明

获得全局量，返回值可赋给JavScript变量。

#### 格式定义

gflow.getValue(*strName* [*,iflag*]);

#### 参数

*strName*：字符串型，获取变量的名称。

*iflag*：整型，获取变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

可供获取的全局变量见附表1。

#### 范例

```js
//获取克朗数
var CourCoeff = gflow.getValue(“CourantCoeff”);
```



### importGrid方法 

#### 说明

导入Grid格式的滑床计算网格文件。

#### 格式定义

 gflow.importGrid(<*strBedFile, [,fXMin, fXMax,fYMin, fYMax, nNoX, nNoY]*>);

#### 参数

*strBedFile*：字符串型，滑床网格文件的名称。

*,fXMin, fXMax,fYMin, fYMax*：浮点型，研究区域X方向及Y方向的最小值及最大值。

*nNoX, nNoY*：整型，研究区域X方向及Y方向的格点数量。

#### 备注

1. 导入的网格格式为：行号3列浮点数，代表某个格点的X、Y、Z坐标。

2. *fXMin, fXMax,fYMin, fYMax, nNoX, nNoY*可以不写，读入文件时自动根据坐标计算这6个数。

   ![](images\gflow_bed_file_format.jpg)

#### 范例

```js
//导入计算网格
gflow.importGrid(“Cdem_bed.txt”);
gflow.importGrid(“Cdem_bed.txt”,0.0, 100.0, 0.0, 100.0, 200,200);
```



### exportGrid方法 

#### 说明

导出Grid格式的滑床计算网格文件及滑体计算网格文件。

#### 格式定义

gflow.exportGrid(<*[strBedFile, strHeightFile]*>);

#### 参数

*strBedFile, strHeightFile*：字符串型，滑床网格文件及滑体网格文件的名称。

#### 备注

1. strBedFile, strHeightFile*可以不写，不写的话导出的网格文件名默认为“Cdem_zbed.dat”、 “Cdem_height.dat”。
2. 滑床文件为中的Z坐标为高程，滑体文件中的Z坐标为滑体高度。
3. 滑床文件及滑体文件的格式与 gflow.importGrid()导入的格式一致。

#### 范例

```js
//导出计算网格
gflow.exportGrid();
gflow.exportGrid(“landslide_bed.dat”,“landslide_debris.dat”);
```



### setSlidingBodyBySphere方法 

#### 说明

根据球函数设置滑体。

#### 格式定义

gflow.setSlidingBodyBySphere(<*fCenterX, fCenterY, fRad  [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，球体体心X及Y方向坐标（单位：m）。

*fRad*：浮点型，球体半径（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑体为半球，将在原地形基础上增加该半球。

#### 范例

```js
//设置球心为（100,100），半径为10m的滑体
gflow.setSlidingBodyBySphere(100.0, 100.0, 10.0);
gflow.setSlidingBodyBySphere(100.0, 100.0, 10.0,1);
```



### setSlidingBodyByCylinder 方法 

#### 说明

根据圆柱体函数设置滑体。

#### 格式定义

gflow.setSlidingBodyByCylinder(<*fCenterX, fCenterY, fRad1, fRad2, fH  [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，圆柱体体心X及Y方向坐标（单位：m）。

*fRad1, fRad2*：浮点型，圆柱体底部半径及顶部半径（单位：m）。

*fH*：浮点型，圆柱体的高度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑体为圆柱体（如果顶部半径比底部半径小，为圆台），将在原地形基础上增加该圆柱体。

#### 范例

```js
//设置圆柱体中心为（100,100）,底部半径为20m,顶部半径为10m，高为10m，
gflow.setSlidingBodyByCylinder(100.0, 100.0, 20.0, 10.0, 10.0);
gflow.setSlidingBodyByCylinder(100.0, 100.0, 20.0, 10.0, 10.0, 1);
```



### setSlidingBodyByBrick方法 

#### 说明

根据方块函数设置滑体。

#### 格式定义

gflow.setSlidingBodyByBrick(<*fCenterX, fCenterY, fXL, fYL, fH  [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，方块的体心X及Y方向坐标（单位：m）。

*fXL, fYL, fH*：浮点型，方块X方向、Y方向及Z方向的长度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑体为方块体，将在原地形基础上增加该方块体。

#### 范例

```js
//设置方块体中心为（100,100），X方向长度为10m、Y方向长度为15m、Z方向长度为20m的滑体
gflow.setSlidingBodyByBrick(100.0, 100.0, 10.0, 15.0, 20.0);
gflow.setSlidingBodyByBrick(100.0, 100.0, 10.0, 15.0, 20.0, 1);
```



### setSlidingBodyByEllipsoid方法 

#### 说明

根据椭球函数设置滑体。

#### 格式定义

gflow.setSlidingBodyByEllipsoid(<*fCenterX, fCenterY, fRadX, fRadY, fRadZ, fSita, [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，方块的体心X及Y方向坐标（单位：m）。

*fRadX, fRadY, fRadZ*：浮点型，X、Y、Z这3个方向的半径（单位：m）。

*fSita*：浮点型，椭球绕着Z轴的旋转角（单位：°）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑体为半椭球体，将在原地形基础上增加该半椭球体。

#### 范例

```js
//设置椭球体中心为（100,100），X、Y、Z方向半径为10m、15m、20m，绕Z轴旋转角度为45度的滑体
gflow.setSlidingBodyByEllipsoid(100.0, 100.0, 10.0, 15.0, 20.0, 45.0);
gflow.setSlidingBodyByEllipsoid(100.0, 100.0, 10.0, 15.0, 20.0, 45.0, 1);
```



### setSlidingBodyByPolygon方法 

#### 说明

根据多边形柱函数设置滑体。

#### 格式定义

gflow.setSlidingBodyByPolygon(<*afCoord, fH, [,nExcaFlag]*>);

#### 参数

*afCoord*：浮点型数组，包含N列（N≥3），每列2个元素（表示多边形某个点的X、Y坐标）。

*fH*：浮点型，多边形柱的高度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

1. 设置的滑体为多边形柱体，将在原地形基础上增加该多边形体。
2. 多边形的坐标应按照顺时针或者逆时针的方向排列。

#### 范例

```js
//设置3个点组成的多边形，多边形柱高度为5m
gflow.setSlidingBodyByPolygon([50,50, 60,50, 55,40], 5.0);

//设置7个点组成的多边形，多边形柱高度为10m
var aCoord = new Array(7);
aCoord[0]=	[	19.9503	,	37.7018	];
aCoord[1]=	[	18.7395	,	48.6763	];
aCoord[2]=	[	24.5513	,	58.0369	];
aCoord[3]=	[	36.6592	,	68.2045	];
aCoord[4]=	[	56.1126	,	69.4956	];
aCoord[5]=	[	68.2205	,	63.5242	];
aCoord[6]=	[	78.9562	,	47.8693	];
gflow.setSlidingBodyByPolygon(aCoord,10.0);
```



### setTerrainBySphere方法 

#### 说明

根据球函数设置滑床地形。

#### 格式定义

gflow.setTerrainBySphere(<*fCenterX, fCenterY, fRad, fBaseH  [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，球体体心X及Y方向坐标（单位：m）。

*fRad*：浮点型，球体半径（单位：m）。

*fBaseH*：浮点型，基础高度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑床地形为半球，将在统一的基础高度上增加（nExcaFlag=0）或减去（nExcaFlag=1）该半球。

#### 范例

```js
//设置球心为（100,100），半径为10m,基础地形高度为0m的滑床地形
gflow.setTerrainBySphere(100.0, 100.0, 10.0, 0.0);
gflow.setTerrainBySphere(100.0, 100.0, 10.0, 0.0, 1);
```



### setTerrainByCylinder方法 

#### 说明

根据圆柱体函数设置滑床地形。

#### 格式定义

gflow.setTerrainByCylinder(<*fCenterX, fCenterY, fRad1, fRad2, fH, fBaseH [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，圆柱体体心X及Y方向坐标（单位：m）。

*fRad1, fRad2*：浮点型，圆柱体底部半径及顶部半径（单位：m）。

*fH*：浮点型，圆柱体的高度（单位：m）。

*fBaseH*：浮点型，基础高度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑床地形为圆柱体（如果*fRad1*比*fRad2*大，为圆台），将在统一的基础高度上增加（nExcaFlag=0）或减去（nExcaFlag=1）该圆柱体。

#### 范例

```js
//设置圆柱体中心为（100,100），底部半径为20m,顶部半径为10m，高为10m，基础高度为5m的滑体
gflow.setTerrainByCylinder(100.0, 100.0, 20.0, 10.0, 10.0, 5.0);
gflow.setTerrainByCylinder(100.0, 100.0, 20.0, 10.0, 10.0, 5.0, 1);
```



### setTerrainByBrick方法 

#### 说明

根据方块函数设置滑床地形。

#### 格式定义

gflow.setTerrainByBrick(<*fCenterX, fCenterY, fXL, fYL, fH, fBaseH  [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，方块的体心X及Y方向坐标（单位：m）。

*fXL, fYL, fH*：浮点型，方块X方向、Y方向及Z方向的长度（单位：m）。

*fBaseH*：浮点型，基础高度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑床地形为方块体，将在统一的基础高度上增加（nExcaFlag=0）或减去（nExcaFlag=1）该方块体。

#### 范例

```js
//设置方块体中心为（100,100），X方向长度为10m、Y方向长度为15m、Z方向长度为20m、基础高度为3.0m的滑床地形
gflow.setTerrainByBrick(100.0, 100.0, 10.0, 15.0, 20.0, 3.0);
gflow.setTerrainByBrick(100.0, 100.0, 10.0, 15.0, 20.0, 3.0, 1);
```



### setTerrainByEllipsoid方法 

#### 说明

根据椭球函数设置滑床地形。

#### 格式定义

gflow.setTerrainByEllipsoid(<*fCenterX, fCenterY, fRadX, fRadY, fRadZ, fSita, fBaseH  [,nExcaFlag]*>);

#### 参数

*fCenterX, fCenterY*：浮点型，方块的体心X及Y方向坐标（单位：m）。

*fRadX, fRadY, fRadZ*：浮点型，X、Y、Z这3个方向的半径（单位：m）。

*fSita*：浮点型，椭球绕着Z轴的旋转角（单位：°）。

*fBaseH*：浮点型，基础高度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

设置的滑床地形为半椭球体，将在统一的基础高度上增加（nExcaFlag=0）或减去（nExcaFlag=1）该半椭球体。

#### 范例

```js
//设置椭球体中心为（100,100），X、Y、Z方向半径为10m、15m、20m，绕Z轴旋转角度为45度，基础高度为3.0m的滑床地形
gflow.setTerrainByEllipsoid(100.0, 100.0, 10.0, 15.0, 20.0, 45.0, 3.0);
gflow.setTerrainByEllipsoid(100.0, 100.0, 10.0, 15.0, 20.0, 45.0, 3.0, 1);
```



### setTerrainByPolygon方法 

#### 说明

根据多边形柱函数设置滑床地形。

#### 格式定义

gflow.setTerrainByPolygon(<*afCoord, fH, fBaseH [,nExcaFlag]*>);

#### 参数

*afCoord*：浮点型数组，包含N列（N≥3），每列2个元素（表示多边形某个点的X、Y坐标）。

*fH*：浮点型，多边形柱的高度（单位：m）。

*fBaseH*：浮点型，基础高度（单位：m）。

*nExcaFlag*：开挖标记量，0-堆填，1-开挖，不写默认为0。

#### 备注

1. 设置的滑床地形为多边形柱，将在统一的基础高度上增加（nExcaFlag=0）或减去（nExcaFlag=1）该多边形柱。
2. 多边形的坐标应按照顺时针或者逆时针的方向排列。

#### 范例

```js
//设置3个点组成的多边形，多边形柱高度为5m，基础地形高度为10m
gflow.setTerrainByPolygon([50,50, 60,50, 55,40], 5.0, 10.0);

//设置7个点组成的多边形，多边形柱高度为10m，基础地形高度为10m
var aCoord = new Array(7);
aCoord[0]=	[	19.9503	,	37.7018	];
aCoord[1]=	[	18.7395	,	48.6763	];
aCoord[2]=	[	24.5513	,	58.0369	];
aCoord[3]=	[	36.6592	,	68.2045	];
aCoord[4]=	[	56.1126	,	69.4956	];
aCoord[5]=	[	68.2205	,	63.5242	];
aCoord[6]=	[	78.9562	,	47.8693	];
gflow.setTerrainByPolygon(aCoord,10.0, 10.0);
```



### setGridFile方法 

#### 说明

设置用于计算的Grid格式滑床网格文件及滑体网格文件。

#### 格式定义

gflow.setGridFile(<*strBedFile, strHeightFile*>);

#### 参数

*strBedFile, strHeightFile*：字符串型，滑床网格文件及滑体网格文件的名称。

#### 备注

1. 该函数的主要作用是将已经存在的滑床文件及滑体文件的名称存储至gflow核心求解模块中，便于后续执行求解命令时输出对应的文件名称。
2. 如果是采用gflow中的gflow.exportGrid()接口导出了对应的滑床及滑体网格，则不需要调用该命令进行文件名称设置，核心求解中自动根据gflow.exportGrid()进行了设置。

#### 范例

```js
//设置核心求解用的网格文件
gflow.setGridFile("cdem_bed.dat","cdem_h.dat");
```



### domainMapping方法 

#### 说明

根据大区域的滑床地形网格文件及小区域的滑体厚度网格文件，映射生成大区域的滑床地形及滑体厚度网格文件，用于进行大范围的计算。

#### 格式定义

gflow.domainMapping(<strLargeDomainFile, nNoX1, nNoY1, strHeightFile, nNoX2, nNoY2 [,strOutputFile [,nFlag [,ftol]]  ]>);

#### 参数

*strLargeDomainFile*：字符串型，大区域网格的滑床文件名。

*nNoX1, nNoY1*：整型，大区域网格X方向及Y方向格点数。

*strHeightFile*：字符串型，小区域网格的滑体厚度文件名。

*nNoX2, nNoY2*：整型，小区域网格X方向及Y方向格点数。

*strOutputFile*：字符串型，输出网格文件名，不需要添加扩展名，执行时自动在文件名尚追加上“_zbed.dat”及“_height.dat”，并输出2个对应的文件。该变量可以不写，不写默认的两个输出文件名为："AfterMapping_zbed.dat"、"AfterMapping_height.dat"

*nFlag*：整型，开挖堆填标记，只能为-1及1。-1表示开挖，1表示堆填。 可以不写，默认为-1。

*ftol*：浮点型，某一格点上的最小滑体厚度，可以不写，默认为1e-3m。

#### 备注

1. 从CDEM中计算获得滑床文件及滑体文件的区域可能较小（失稳模式计算仅考虑局部区域即可，不需要考虑成灾范围部分）。因此，需要借助该命令实现小区域滑体信息向大区域滑体信息的映射。

#### 范例

```js
//实现滑体映射
gflow.domainMapping("large_bed.dat",300, 300, "cdem_h.dat", 100, 100);
gflow.domainMapping("large_bed.dat",300, 300, "cdem_h.dat", 100, 100, "newLandslide");
gflow.domainMapping("large_bed.dat",300, 300, "cdem_h.dat", 100, 100, "newLandslide", -1);
gflow.domainMapping("large_bed.dat",300, 300, "cdem_h.dat", 100, 100, "newLandslide", -1, 1e-3);
```



### sovle方法

#### 说明

核心求解。

#### 格式定义

gflow.solve(<*[fLastTime]*>);

#### 参数

*fLastTime*

> 浮点型，计算到多长时间，全量值（单位：s）。

#### 备注

*fLastTime*可以不写，若不写，则采用求解模块中内置的计算时间进行求解（内置时间可通过gflow.SetValue("LastTime")进行设置）。

#### 范例

```js
//计算到120s
gflow.sovle(120.0);
```



### resultImport方法

#### 说明

进行计算结果文件的导入。

#### 格式定义

gflow.resultImport(<*[strFileName]*>);

#### 参数

*strFileName*: 字符串型，Tecplot结果文件（文件扩展名为.plt）的文件路径及名称。

#### 备注

*strFileName*可以不写，若不写，则从工作路径下FlowPost文件夹中自动载入所有的结果文件(*.plt)。

#### 范例

```js
//从FlowPost文件夹中载入所有Tecplot格式结果文件
gflow.resultImport();
//载入文件名为"aa.plt"的Tecplot格式结果文件
gflow.resultImport("aa.plt");
```



### hist方法

#### 说明

监测某一测点的时程信息。

#### 格式定义

gflow.hist(<*strName, fXCoord, fYCoord*>);

#### 参数

*strName*：字符串型，监测内容。

*fXCoord, fYCoord*：浮点型，监测点的X、Y坐标（单位：m）。

#### 备注

监测内容可为：

”TotalH”：总高度（Zbed+Thickness）；

”Zbed”：滑床高度；

”Thickness”：堆积体厚度；

”XVel”：X方向流动速度；

”YVel”：Y方向流动速度；

”MagVel”：总速度。

#### 范例

```js
//监测与（50.0, 50.0）点最近的节点的堆积体厚度
gflow.hist("Thickness",50.0， 50.0);
```



### drawHistPos方法

#### 说明

绘制监测点的空间位置，在模型视图中用红色圆点表示。

#### 格式定义

gflow.drawHistPos()

#### 参数

#### 备注

1. 当监测信息设置完毕，在计算之前，可通过该接口进行监测点位置的检查。

2. 监测点位置图形可通过平台提供的draw.clear()、draw.commit()函数进行清除。

#### 范例

```js
//绘制监测点的空间位置
gflow.drawHistPos();
```



### clear方法

#### 说明

初始化gflow计算内核中的数据。

#### 格式定义

gflow.clear()

#### 参数

#### 备注

仅能清除gflow内核中的数据，平台上的网格数据及结果数据无法用该命令清除。

#### 范例

```js
//绘制监测点的空间位置
gflow.clear();
```



# 附表1 可供设置及获取的全局变量

## 附1.1 计算参数类

| **序号** | **变量名**     | **作用说明**                             | **默认值** |
| -------- | -------------- | ---------------------------------------- | ---------- |
| 1        | LastTime       | 计算持续的物理时间                       | 100.0      |
| 2        | CourantCoeff   | 计算时的库朗数                           | 0.2        |
| 3        | OutputInterval | 计算时场量云图数据输出间隔               | 100        |
| 4        | HistInterval   | 监测数据输出间隔                         | 10         |
| 5        | ParaNum        | 并行数量                                 | 16         |
| 6        | AutoPutMesh    | 是否自动向平台推送网格（0-手动，1-自动） | 1          |
| 7        | Friction       | 摩擦角（°）                              | 15         |
| 8        | Lamuda         | 孔隙压力比                               | 0.1        |
| 9        | Manning        | 曼宁系数                                 | 0.01       |



## 附1.2 单元及计算信息获取类

| **序号** | **变量名** | **作用说明**             |
| -------- | ---------- | ------------------------ |
| 1        | INx        | x方向节点个数            |
| 2        | INy        | y方向节点个数            |
| 3        | IDx        | x方向格子长度（单位：m） |
| 4        | IDy        | y方向格子长度（单位：m） |
| 5        | ILx        | x方向区域长度（单位：m） |
| 6        | ILy        | y方向区域长度（单位：m） |
| 7        | TotalNum   | 总节点数                 |

注：附1.2中的变量仅能够获取，不能设置。

 