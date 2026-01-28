<!--HJS_fracsp_interfacefun-->

## 裂隙渗流接口函数

裂隙渗流对象（fracsp）为用户提供了网格创建、渗流材料性质施加、渗流边界条件施加、渗流初始条件施加等接口函数，具体见表4.2。

<center>表4.2 裂隙渗流接口函数列表</center>

| **序号** |              **方法**              |                           **说明**                           |
| -------- | :--------------------------------: | :----------------------------------------------------------: |
| 1        |              GetMesh               |      从Genvi平台获取网格并加载到裂隙渗流求解器求解器。       |
| 2        |             ImportGrid             | 从外部文件导入裂隙渗流网格，目前支持从ansys及gid中导入裂隙渗流网格。 |
| 3        |             ExportGrid             |       将裂隙网格进行导出为AnsysBlkDyn格式的文本文档。        |
| 4        |        CreateGridFromBlock         |                  从块体中创建裂隙渗流网格。                  |
| 5        |           ElemConnection           |       连接两个相互交错的裂隙单元，并建立管道传输流量。       |
| 6        |           SetPropByCoord           |        通过坐标对某范围内的裂隙单元施加裂隙渗流参数。        |
| 7        |           SetPropByGroup           |         通过组对某范围内的裂隙单元施加裂隙渗流参数。         |
| 8        |           SetPropByPlane           |      通过平面控制对某范围内的裂隙单元施加裂隙渗流参数。      |
| 9        |         SetPropByCylinder          |    通过空心圆柱体对某一范围内的裂隙单元施加裂隙渗流参数。    |
| 10       |         SetPropByInterFri          | 通过裂隙渗流单元所关联的固体接触面的内摩擦角对该裂隙单元施加裂隙渗流参数。 |
| 11       |         SetPropByInterCoh          | 通过裂隙渗流单元所关联的固体接触面的粘聚力对该裂隙单元施加裂隙渗流参数。 |
| 12       |        SetSinglePropByGroup        |                   通过组号单独设置裂隙参数                   |
| 13       |        SetSinglePropByCoord        |                   通过坐标单独设置裂隙参数                   |
| 14       |         SetSinglePropBySat         |                  根据裂隙饱和度设置裂隙参数                  |
| 15       |      SetSinglePropByInterFri       |          根据裂隙两侧固体单元的内摩擦角设置裂隙参数          |
| 16       |         SetDynViscByCoord          | 单独施加裂隙中流体的动力粘度。执行此函数后，按照立方定律自动计算出渗透系数，系统内原有的初始渗透系数将被改变。 |
| 17       |       RandomizeWidthByGroup        |              随机某一个组号对应裂隙单元的开度。              |
| 18       |            AdjustWidth             |   等比例调整各单元的裂隙开度，使钻孔区段的开度符合设定值。   |
| 19       |             SetJetProp             |              设定注入点流体（浆液）的改变参数。              |
| 20       |            BindJetProp             |       将注入点流体（浆液）参数的ID与对应渗流单元关联。       |
| 21       | SetBoreholePressureDropPropByCoord |                       设置孔口压降参数                       |
| 22       |       ApplyConditionByCoord        |  通过坐标对某一范围内的裂隙单元施加压力等裂隙渗流边界条件。  |
| 23       |       ApplyConditionByGroup        |     通过组对某一范围内的单元施加压力等裂隙渗流边界条件。     |
| 24       |       ApplyConditionByPlane        |  通过平面控制对某一范围内的单元施加压力等裂隙渗流边界条件。  |
| 25       |      ApplyConditionByCylinder      | 通过空心圆柱体对某一范围内的单元施加压力等裂隙渗流边界条件。 |
| 26       |     ApplyDynaConditionByCoord      |            根据坐标施加压力、流量的动态边界条件。            |
| 27       |      ApplyDynaConditionByLine      |          根据线段相交施加压力、流量的动态边界条件。          |
| 28       |     ApplyDynaConditionBySphere     |        根据空心圆球坐标施加压力、流量的动态边界条件。        |
| 29       |    ApplyDynaConditionByCylinder    |        根据空心圆柱坐标施加压力、流量的动态边界条件。        |
| 30       |     ApplyDynaConditionByGroup      |       根据组号下限及上限施加压力、流量的动态边界条件。       |
| 31       |        InitConditionByCoord        |    通过坐标对某范围内的单元初始化压力及饱和度等裂隙条件。    |
| 32       |        InitConditionByGroup        |     通过组对某范围内的单元初始化压力及饱和度等裂隙条件。     |
| 33       |        InitConditionByPlane        |    通过平面对某范围内的单元初始化压力及饱和度等裂隙条件。    |
| 34       |      InitConditionByCylinder       | 通过空心圆柱体对某范围内的单元初始化压力及饱和度等裂隙条件。 |
| 35       |           SetLvRongProp            |               设置吕荣参数，用于进行吕荣统计。               |
| 36       |         SetJetBoreHoleProp         |                      设置泵注孔基本参数                      |
| 37       |   BindJetBoreHolePropByCylinder    |                  将泵注孔参与与裂隙节点关联                  |
| 38       |            GetNodeValue            |                  获取裂隙渗流节点信息的值。                  |
| 39       |            GetElemValue            |                  获得裂隙渗流单元信息的值。                  |
| 40       |            SetNodeValue            |                  设置裂隙渗流节点信息的值。                  |
| 41       |            SetElemValue            |                  设置裂隙渗流单元信息的值。                  |
| 42       |             GetElemID              |             获得离某一坐标最近的裂隙单元的ID号。             |
| 43       |             GetNodeID              |             获得离某一坐标最近的裂隙节点的ID号。             |
| 44       |               Solver               | 裂隙渗流核心求解器，CalDynaBound函数到CalJetConvection函数的集成 |
| 45       |            CalDynaBound            |      核心迭代步中，动态施加压力、流量边界（每一步执行）      |
| 46       |          CalNodePressure           |       核心迭代步中，计算节点压力及饱和度（每一步执行）       |
| 47       |          CalElemDischarge          |        核心迭代步中，动态单元流速、流量（每一步执行）        |
| 48       |            CalIntSolid             |       核心迭代步中，计算与固体破裂的耦合（每一步执行）       |
| 49       |            CalIntPoreSp            |       核心迭代步中，计算与孔隙渗流的耦合（每一步执行）       |
| 50       |          CalPipeDischarge          | 核心迭代步中，计算几何相交但不共节点裂隙单元间的流量透传（每一步执行） |
| 51       |          CalJetConvection          |   核心迭代步中，计算注入点材料性质的空间输运（每一步执行）   |

若进行裂隙渗流计算，需要在创建或导入网格前通过dyna.Set(<>)设置"Config_FracSeepage"包含裂隙渗流计算。在计算的任何阶段，通过设置"FracSeepage_Cal"开启或关闭裂隙渗流计算，设置"FS_Solid_Interaction"开启裂隙渗流与应力的耦合计算，设置"FS_PoreS_Interaction"开启裂隙渗流与孔隙渗流的耦合计算，设置"FS_MaxWid"及"FS_MinWid"调整最大及最小裂隙开度的限定范围，设置"Seepage_Mode"确定裂隙渗流的模式（水渗流或气体渗流），设置"Liquid_Seepage_Law"确定裂隙液体渗流的模式（牛顿流、宾汉流），设置"FS_Gas_Index"确定裂隙气体渗流时的气体作用指数，设置"FS_Cal_Incremental"确定裂隙渗流的增量或全量计算模式。

<!--HJS_fracsp_GetMesh-->

### GetMesh方法

#### 说明

从Genvi平台获取网格并加载到裂隙渗流求解器。

#### 格式定义

fracsp.GetMesh (<*mesh*>);

#### 参数

*mesh*：网格对象。

#### 备注

#### 范例

```javascript
//利用平台的imesh模块导入ansys网格
var msh1 = imesh.importAnsys("frac.dat");
//将平台的网格加载到fracsp核心求解器
fracsp.GetMesh(msh1);
```



<!--HJS_fracsp_ImportGrid-->

### ImportGrid方法

#### 说明

导入裂隙渗流网格文件。

#### 格式定义

fracsp.ImportGrid (<*FileType[, FilePath]*>);

#### 参数

*FileType*：整型或字符串型，导入网格文件的类型。整型：1从ansys导入，2从gid导入，3从Gmsh导入，4从Genvi导入。字符串型："ansys"，"gid"，"gmsh"或"genvi"，大小写均可。

*FilePath*：字符串型，文件所在位置及文件名；如果不写，则会跳出对话框，从界面选取。

#### 备注

#### 范例

```javascript
//从C盘根目录下导入gid格式的网格
fracsp.ImportGrid(1, "C:/1.gid");
```

<!--HJS_fracsp_ExportGrid-->

### ExportGrid方法

#### 说明

导出裂隙渗流网格文件。

####  格式定义

fracsp. ExportGrid (<*FileType[, FilePath]*>);

#### 参数

*FileType*：整型或字符串型，导出网格文件的类型。整型：1导出为AnsysBlkDyn格式。字符串型："AnsysBlkDyn"，大小写均可。

*FilePath*：字符串型，文件要保存的位置及文件名；如果不写，则会跳出对话框，从界面中选取路径并设置文件名。

#### 备注

#### 范例

```javascript
//在当前文件夹下导出名为AnsysBlkDyn.dat裂隙网格文件
fracsp.ExportGrid(1, "AnsysBlkDyn.dat");
```

<!--HJS_fracsp_CreateGridFromBlock-->

### CreateGridFromBlock方法

#### 说明

从块体单元中创建裂隙渗流网络。

#### 格式定义

fracsp.CreateGridFromBlock (<*iType*>);

#### 参数

*iType*：整型，裂隙渗流网络的创建方式，只能为1或2。1-将所有单元的边界面（包含自由面及公共面）设定为裂隙网络；2-仅将接触面（含接触弹簧，可以断开的面）设定为裂隙网络。

#### 备注

#### 范例

```javascript
fracsp.CreateGridFromBlock(1);
```

<!--HJS_fracsp_ElemConnection-->

### ElemConnection方法

#### 说明

当两个裂隙单元相互交叉（但不共节点）时，执行该命令将对这两个单元进行连接，并建立管道进行流量的传递。

#### 格式定义

fracsp.ElemConnection ();

#### 参数

#### 备注

当两个单元接触或交错时，执行该命令后，将以两个单元的体心为基点建立管道，并进行流量的传递。管道的长度为两个单元特征长度平均值的一半，管道的宽度为两个单元特征宽度的评价值，管道的厚度（裂隙开度）为两个单元裂隙开度的平均值。

#### 范例

```javascript
fracsp.ElemConnection();
```

<!--HJS_fracsp_SetPropByCoord-->

### SetPropByCoord方法

#### 说明

当裂隙渗流单元的体心位于坐标控制范围之内时，对单元施加对应的裂隙渗流参数。

#### 格式定义

fracsp.SetPropByCoord(<*fDensity, fBulk, fScK, fInitCrackWid, x0, x1, y0, y1, z0, z1*>);

#### 参数

*fDensity*：浮点型，流体密度（单位：kg/m<sup>3</sup>）。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fScK*：浮点型，流体渗透系数（单位：m<sup>2</sup>/Pa/s）。

*fInitCrackWid*：浮点型，裂隙初始开度（单位：m）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则fBulk不起作用，但必须要写。

#### 范例

```javascript
fracsp.SetPropByCoord(1000, 2.5e9, 1e-6 , 1e-3,-10, 10, -10, 10, -10, 10);
```

<!--HJS_fracsp_SetPropByGroup-->

### SetPropByGroup方法

#### 说明

当单元组号与设定组号一致时，对裂隙单元施加对应的裂隙渗流参数。

#### 格式定义

fracsp.SetPropByGroup (<*fDensity, fBulk, fScK, fInitCrackWid, iGroupLow, iGroupUp*>);

#### 参数

*fDensity*：浮点型，流体密度（单位：kg/m<sup>3</sup>）。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fScK*：浮点型，流体渗透系数（单位：m<sup>2</sup>/Pa/s）。

*fInitCrackWid*：浮点型，裂隙初始开度（单位：m）。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限及上限。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则fBulk不起作用，但必须要写。

#### 范例

```javascript
fracsp.SetPropByGroup(1000, 2.5e9, 1e-6 , 1e-3,1, 6);
```

<!--HJS_fracsp_SetPropByPlane-->

### SetPropByPlane方法

#### 说明

当单元体心坐标到设定面的距离小于容差限定值时，对单元施加对应的裂隙渗流参数。

#### 格式定义

fracsp.SetPropByPlane(<*fDensity, fBulk, fScK, fInitCrackWid, fArrayN[3], fArrayOrigin[3], fTol*>);

#### 参数

*fDensity*：浮点型，流体密度（单位：kg/m<sup>3</sup>）。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fScK*：浮点型，流体渗透系数（单位：m<sup>2</sup>/Pa/s）。

*fInitCrackWid*：浮点型，裂隙初始开度（单位：m）。

*fArrayN*：Array浮点型，包含3个分量，平面单位法向的三个分量；

*fArrayOrigin*：Array浮点型，包含3个分量，平面上的一点（单位：m）。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则fBulk不起作用，但必须要写。

#### 范例

```javascript
var ns = new Array(0, 1, 0);//法向分量
var origins = new Array(0, 0, 0);// 平面内一点坐标
fracsp.SetPropByPlane(1000, 2.5e9, 1e-6 , 1e-3,ns, origins, 0.001);
```

<!--HJS_fracsp_SetPropByCylinder-->

### SetPropByCylinder方法

#### 说明

当单元体心位于某一空心圆柱内时，对单元施加裂隙流体参数。

#### 格式定义

fracsp.SetPropByCylinder (<*fDensity, fBulk, fScK, fInitCrackWid, x0, y0, z0, x1, y1, z1, fRad1, fRad2*>);

#### 参数

*fDensity*：浮点型，流体密度（单位：kg/m<sup>3</sup>）。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fScK*：浮点型，流体渗透系数（单位：m<sup>2</sup>/Pa/s）。

*fInitCrackWid*：浮点型，裂隙初始开度（单位：m）。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则fBulk不起作用，但必须要写。

#### 范例

```javascript
fracsp.SetSinglePropByCylinder(1000, 2.5e9, 1e-6 , 1e-3, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 11, 12);
```

<!--HJS_fracsp_SetPropByInterFri-->

### SetPropByInterFri方法

#### 说明

对接触面内摩擦角在某一范围内的相对应裂隙单元施加裂隙渗流参数。

#### 格式定义

fracsp.SetPropByInterFri (<*fDensity, fBulk, fScK, fInitCrackWid, fFrictionL, fFrictionU*>);

#### 参数

*fDensity*：浮点型，流体密度（单位：kg/m<sup>3</sup>）。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fScK*：浮点型，流体渗透系数（单位：m<sup>2</sup>/Pa/s）。

*fInitCrackWid*：浮点型，裂隙初始开度（单位：m）。

*fFrictionL*：浮点型，接触内摩擦角的下限值（角度）。

*fFrictionU*：浮点型，接触内摩擦角的上限值（角度）。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则fBulk不起作用，但必须要写。

#### 范例

```javascript
fracsp.SetPropByInterFri(1000 ,1e6 ,1e-6, 1e-3,30, 45);
```

<!--HJS_fracsp_SetPropByInterCoh-->

### SetPropByInterCoh方法

#### 说明

对接触面内聚力在某一范围内的相应的裂隙单元施加某裂隙渗流参数。

#### 格式定义

fracsp.SetPropByInterCoh(<*fDensity, fBulk, fScK, fInitCrackWid, fCohesionL, fCohesionU*>);

#### 参数

*fDensity*：浮点型，流体密度（单位：kg/m<sup>3</sup>）。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fScK*：浮点型，流体渗透系数（单位：m<sup>2</sup>/Pa/s）。

*fInitCrackWid*：浮点型，裂隙初始开度（单位：m）。

*fCohesionL*：浮点型，接触内聚力的下限值（单位：Pa）。

*fCohesionU*：浮点型，接触内聚力的上限值（单位：Pa）。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则fBulk不起作用，但必须要写。

#### 范例

```javascript
fracsp.SetPropByInterCoh(1000 ,1e6 ,1e-6 , 1e-3, 5e6, 6e6);
```

<!--HJS_fracsp_SetSinglePropByGroup-->

### SetSinglePropByGroup方法

#### 说明

当裂隙渗流的单元组号位于组号下限及上限之间时，单独设定裂隙渗流参数。

#### 格式定义

fracsp. SetSinglePropByGroup (<*strVName, fValue, iGroupL, iGroupU*>);

#### 参数

*strVName*：字符串型；裂隙渗流参数的类型（只能为流体密度"FDensity"、体积模量"FBulk"、渗透系数"KCoeff"、裂隙开度"CWidth"、动力粘度"DynaVisc"、剪切强度"Strength"）。

*fValue*：浮点型，对应参数的取值。

*iGroupL, iGroupU*：整型，组号的下限及上限。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则"FBulk"不起作用。

#### 范例

```javascript
fracsp. SetSinglePropByGroup ("CWidth", 1e-6, 1, 11);
```

<!--HJS_fracsp_SetSinglePropByCoord-->

### SetSinglePropByCoord方法

#### 说明

当裂隙渗流的体心位于坐标下限及上限之间，单独设定裂隙渗流参数。

#### 格式定义

fracsp. SetSinglePropByCoord (<*strVName, fValue, x0, x1, y0, y1, z0, z1*>);

#### 参数

*strVName*：字符串型；裂隙渗流参数的类型（只能为流体密度"FDensity"、体积模量"FBulk"、渗透系数"KCoeff"、裂隙开度"CWidth"、动力粘度"DynaVisc"、剪切强度"Strength"）。

*fValue*：浮点型，对应参数的取值。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则"FBulk"不起作用。

#### 范例

```javascript
fracsp. SetSinglePropByCoord ("Fdensity", 1000, -100, 100, -100, 100, -100, 100);
```

<!--HJS_fracsp_SetSinglePropBySat-->

### SetSinglePropBySat方法

#### 说明

当裂隙渗流的饱和度位于下限及上限之间，单独设定裂隙渗流参数。

#### 格式定义

fracsp. SetSinglePropBySat (<*strVName, fValue, fLowSat, fUpSat*>);

#### 参数

*strVName*：字符串型；裂隙渗流参数的类型（只能为流体密度"FDensity"、体积模量"FBulk"、渗透系数"KCoeff"、裂隙开度"CWidth"、动力粘度"DynaVisc"、剪切强度"Strength"）。

*fValue*：浮点型，对应参数的取值。

*fLowSat*、*fUpSat*：浮点型，裂隙单元饱和度下限及上限。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则"FBulk"不起作用。

#### 范例

```javascript
fracsp. SetSinglePropBySat ("Fdensity", 0.99, 1.01);
```

<!--HJS_fracsp_SetSinglePropByInterFri-->

### SetSinglePropByInterFri方法

#### 说明

当裂隙渗流单元关联的固体接触面的内摩擦角位于下限及上限之间，单独设定裂隙渗流参数。

#### 格式定义

fracsp. SetSinglePropByInterFri(<*strVName, fValue, fLowFriction, fUpFriction*>);

#### 参数

*strVName*：字符串型；裂隙渗流参数的类型（只能为流体密度"FDensity"、体积模量"FBulk"、渗透系数"KCoeff"、裂隙开度"CWidth"、动力粘度"DynaVisc"、剪切强度"Strength"）。

*fValue*：浮点型，对应参数的取值。

*fLowFriction*、*fUpFriction*：浮点型，接触内摩擦角下限及上限。

#### 备注

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则"FBulk"不起作用。

#### 范例

```javascript
fracsp. SetSinglePropByInterFri ("Fdensity", 15.0, 20.0);
```

<!--HJS_fracsp_SetDynViscByCoord-->

### SetDynViscByCoord方法

#### 说明

当单元体心位于坐标控制范围之内时，对裂隙单元单独施加流体动力粘度。

#### 格式定义

fracsp. SetDynViscByCoord (<*fVisc, x0, x1, y0, y1, z0, z1*>);

#### 参数

*fVisc*：浮点型，流体动力粘度（单位：Pa.s）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

执行此施加后，按照立方定律自动计算出渗透系数，各裂隙单元原有的初始渗透系数将被改变。

#### 范例

```javascript
fracsp.SetDynViscByCoord(1e-3, -10, 10, -10, 10, -10, 10);
```

<!--HJS_fracsp_RandomizeWidthByGroup-->

### RandomizeWidthByGroup方法

#### 说明

对特定组号的裂隙面进行开度的随机。

#### 格式定义

fracsp.RandomizeWidthByGroup(<*strDistribution*, *fParam1*, *fParam2*, *iGroup* [, IndiFlag [, ShapeFlag] ] >);

#### 参数

*strDistribution*：字符串型，随机分布类型名，共包含3类，为

——"uniform"，均匀分布

——"normal"，正态分布

——"weibull"，韦伯分布

*fParam1*，*fParam2*：浮点型，随机分布的参数，为

——如果分布模式为"uniform"，*fParam1*及*fParam2*为随机值的下限及上限；

——如果分布模式为"normal"，*fParam1*及*fParam2*为期望与标准差；

——如果分布模式为"weibull"，*fParam1*及*fParam2*分别表示韦伯分布的*k*值及*λ*值。

*iGroup*：整型，执行随机的单元组号。

IndiFlag：整型，裂隙开度随机施加方式，只能为1或2。1-每个单元进行一次随机施加；2-按照裂隙面为单元进行随机。若不写，则为1。

ShapeFlag：整型，裂隙面形状。只能为1或2。1-圆柱裂隙，2-圆锥裂隙。如果为圆锥裂隙，则随机生成的裂隙开度为圆锥中心开度。该命令只能在IndiFlag为2时起作用。ShapeFlag若不写，则为1。

#### 备注

#### 范例

```javascript
//对组号为1的所有单元的开度进行均匀分布的随机
fracsp.RandomizeWidthByGroup ("uniform", 1e-4, 1e-3, 1);
//对组号为2的所有单元按照独立裂隙随机其开度，并制定裂隙模式为圆锥模式
fracsp.RandomizeWidthByGroup ("uniform", 1e-4, 1e-3, 2, 1, 2);
```

<!--HJS_fracsp_AdjustWidth-->

### AdjustWidth方法

#### 说明

对两个坐标限定的钻孔区段穿过的裂隙开度进行统计，并以该开度为依据，自动调整全局各处的开度，使其在钻孔位置的开度与输入的单位长度上的开度一致。

#### 格式定义

fracsp.AdjustWidth (<*fAverWidth, fx1, fy1, fz1, fx2, fy2, fz2*>);

#### 参数

*fAverWidth*：浮点型，输入的单位长度的水力开度（即开度占比）（单位：m/m）。

*fx1, fy1, fz1*：浮点型，钻孔区段第一点的坐标（单位：m）。

*fx2, fy2, fz2*：浮点型，钻孔区段第二点的坐标（单位：m）。

#### 备注

执行此施加后，各渗流单元的初始开度、当前开度将会依据钻孔区段输入的开度占比进行等比例放大或缩小，使其在钻孔区段上获得的开度占比与输入值一致。

#### 范例

```javascript
fracsp.AdjustWidth(2e-4, 20,20,17.5, 20, 20, 22.5);
```

<!--HJS_fracsp_SetJetProp-->

### SetJetProp方法

#### 说明

设定注入流体（浆液）的参数，即不同时间段选择不同类型的流体（浆液）。

#### 格式定义

fracsp. SetJetProp (<*fTime*, *aVisc [, aStre [, aDens ]]>*);

#### 参数

*fTime*：浮点型，注浆起始时间

*aVisc*：Array浮点型，二维数组，包含N×2个分量（N大于等于2），每一行的第一个分量为时间（单位：s），第二个分量为流体动力粘度（单位：Pa.s）。

*aStre*：Array浮点型，二维数组，包含N×2个分量（N大于等于2），每一行的第一个分量为时间（单位：s），第二个分量为剪切强度（单位：Pa）。此数组可以不写。

*aDens*：Array浮点型，二维数组，包含N×2个分量（N大于等于2），每一行的第一个分量为时间（单位：s），第二个分量为流体密度（单位：kg/m3）。此数组可以不写。

#### 备注

（1）上述注入流体的参数为全局参数，需要调用fracsp.BindJetProp(<>) 接口脚本将上述注入点流体参数与相应的渗流单元关联。

（2）返回值为全局参数对应的ID号，从1开始。

#### 范例

```javascript
//注入点流体动力粘度的变化
var aVisc = new Array(4);
aVisc[0] = [0, 1e-4];
aVisc[1] = [5e5, 1e-2];
aVisc[2] = [5e6, 1e-1];
aVisc[3] = [1e8, 1];
//注入点流体剪切强度的变化
var aStre = new Array(4);
aStre[0] = [0, 1e2];
aStre[1] = [5e5, 1e4];
aStre[2] = [5e6, 1e5];
aStre[3] = [1e8, 1e6];
//注入点流体密度的变化
var aDens= new Array(4);
aDens[0] = [0, 1100];
aDens[1] = [5e5, 1200];
aDens[2] = [5e6, 1400];
aDens[3] = [1e8, 1600];
var id1 = fracsp.SetJetProp (0.0, aVisc);
var id2 = fracsp. SetJetProp (0.0, aVisc, aStre);
var id3 = fracsp. SetJetProp (5.0, aVisc, aStre, aDens);
```

<!--HJS_fracsp_BindJetProp-->

### BindJetProp方法

#### 说明

将注入点流体的参数变化特性全局量与对应的流体单元进行绑定。

#### 格式定义

fracsp. BindJetProp (<*JetPropID*, *x0, x1, y0, y1, z0, z1>*);

#### 参数

*JetPropID*：整型，注入点参数对应的ID号（大于等于1）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

当渗流单元的任意节点在坐标控制范围之内，则进行注入点性质绑定。

#### 范例

```javascript
//将第2组注入浆液参数与对应渗流单元关联
fracsp.BindJetProp (2, -100, 100, -0.1, 0.1, -100, 100);
```

<!--HJS_fracsp_SetBoreholePressureDropPropByCoord-->

### SetBoreholePressureDropPropByCoord方法

#### 说明

设置孔口压降的相关参数。

#### 格式定义

fracsp. SetBoreholePressureDropPropByCoord (<*np, D , C, faiT, beta, x0, x1, y0, y1, z0, z1>*);

#### 参数

*np*：整型，当前簇的射孔数。

*D*：浮点型，射孔直径（单位：m）。

*C*：浮点型，无量纲流量系数，一般为0.5（未磨蚀）到0.9（磨蚀）。

*faiT*：浮点型，压降系数，一般取值0.001。

*beta*：浮点型，压降指数，一般取值2。

*x0、x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0、y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0、z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

裂缝入口处，流体从套管的射孔孔眼进入裂缝，存在压力降落，Crump和Conway得到了下面的经验公式
$$
\Delta p_{ij}^{perf}=0.807249 \frac{\rho Q_{ij}^{2}}{n_{p}^{2}D_{p}^{4}C^{2}}
$$
在井眼附近裂缝几何形状一般非常复杂，带来了额外的压力降落。当水力裂缝远大于井眼尺寸时，这个压力降落可以近似为局部压力降落。
$$
\Delta p_{ij}^{tort}= \varphi _{t}Q_{ij}^{\beta}
$$


#### 范例

```javascript
fracsp.SetBoreholePressureDropPropByCoord(15, 0.01, 0.7, 0, 2, 10 - 1e-5, 10 + 1e-5,10 - 1e-5, 10 + 1e-5 , 10 - 1e-5, 10 + 1e-5);
```

<!--HJS_fracsp_ApplyConditionByCoord-->

### ApplyConditionByCoord方法

#### 说明

当裂隙渗流节点位于坐标控制范围之内时，对相应节点施加压力、流量等裂隙渗流边界条件。

#### 格式定义

fracsp. ApplyConditionByCoord (<*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1*>);

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m<sup>3</sup>/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，设定的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

x0、x1：浮点型，选择范围的x坐标下限及上限（单位：m）。

y0、y1：浮点型，选择范围的y坐标下限及上限（单位：m）。

z0、z1：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
//变化梯度
var grad = new Array(0, 1, 0); 
fracsp.ApplyConditionByCoord("pp", 1e6, grad, -10, 10, -10, 10, -10, 10);
```

<!--HJS_fracsp_ApplyConditionByGroup-->

### ApplyConditionByGroup方法

#### 说明

当单元组号与设定组号一致时，对单元上所有的节点施加压力、流量等裂隙渗流边界条件。

#### 格式定义

fracsp.ApplyConditionByGroup(<*strVar,fValue,fArrayGrad[3],iGroupLow,iGroupUp*>);

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m<sup>3</sup>/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，设定的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限及上限。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var grad = new Array(0, 1, 0); //变化梯度
fracsp.ApplyConditionByGroup("pp",1e6, grad, 1, 8);
```

<!--HJS_fracsp_ApplyConditionByPlane-->

### ApplyConditionByPlane方法

#### 说明

当裂隙节点的坐标到设定面的距离小于容差限定值时，对该节点施加压力、流量等裂隙渗流边界条件。

#### 格式定义

fracsp. ApplyConditionByPlane (<*strVar, fValue, fArrayGrad[3], fArrayN[3], fArrayOrigin[3], fTol*>);

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m<sup>3</sup>/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，设定的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fArrayN*：Array浮点型，包含3个分量，平面单位法向的3个分量；

*fArrayOrigin*：Array浮点型，包含3个分量，平面上一点的坐标；

*fTol*：浮点型，容差。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var grad = new Array(0, 1, 0);//变化梯度
var ns = new Array(0, 1, 0);//法向分量
var origins = new Array(0, 0, 0);//平面内一点坐标
fracsp.ApplyConditionByPlane("pp", 1e6, grad, ns, origins, 0.01);
```

<!--HJS_fracsp_ApplyConditionByCylinder-->

### ApplyConditionByCylinder方法

#### 说明

当裂隙节点位于某一空心圆柱内时，对该节点施加压力、流量等裂隙渗流边界条件。

#### 格式定义

fracsp.ApplyConditionByCylinder(*strVar, fValue, fArrayGrad[3], x0, y0, z0, x1, y1, z1, fRad1, fRad2*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m<sup>3</sup>/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，设定的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var grad = new Array(0, 1, 0); //变化梯度
fracsp.ApplyConditionByCoord("pp", 1e6, grad, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.4, 0.5);
```

<!--HJS_fracsp_ApplyDynaConditionByCoord-->

### ApplyDynaConditionByCoord方法

#### 说明

当裂隙节点位于坐标范围内时，施加动态边界条件。

#### 格式定义

fracsp. ApplyDynaConditionByCoord (*strVar, afvalues[N] [2], fArrayGrad[3], x0, x1, y0, y1, z0, z1*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

x0、x1：浮点型，选择范围的x坐标下限及上限（单位：m）。

y0、y1：浮点型，选择范围的y坐标下限及上限（单位：m）。

z0、z1：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

（4）如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

fracsp.ApplyDynaConditionByCoord("pp",aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1,1);
```

<!--HJS_fracsp_ApplyDynaConditionByLine-->

### ApplyDynaConditionByLine方法

#### 说明

当裂隙单元与输入的线段相交时，施加动态边界条件。

#### 格式定义

fracsp. ApplyDynaConditionByLine (*strVar,afvalues[N] [2], fArrayGrad[3], x0, y0, z0, x1, y1, z1*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

x0、y0、z0：浮点型，线段起始点坐标（单位：m）。

x1、y1、z1：浮点型，线段终止点坐标（单位：m）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

（4）如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

fracsp.ApplyDynaConditionByLine("pp",aValue, fArrayGrad, 0,0,0, 0,5,0);
```

<!--HJS_fracsp_ApplyDynaConditionBySphere-->

### ApplyDynaConditionBySphere方法

#### 说明

当裂隙节点位于空心圆球之内，施加动态边界条件。

#### 格式定义

fracsp. ApplyDynaConditionBySphere(*strVar,afvalues[N] [2], fArrayGrad[3],*  *fCx, fCy, fCz, fRad1, fRad2*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fCx, fCy, fCz*：浮点型，空心圆球体心坐标（单位：m）。

*fRad1, fRad2*：浮点型，空心圆球内外半径（单位：m）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

（4）如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

fracsp.ApplyDynaConditionBySphere("pp",aValue, fArrayGrad, 0,0,0, 0.999, 1.001);
```

<!--HJS_fracsp_ApplyDynaConditionByCylinder-->

### ApplyDynaConditionByCylinder方法

#### 说明

当裂隙节点位于空心圆柱之内，施加动态边界条件。

#### 格式定义

fracsp. ApplyDynaConditionByCylinder(*strVar,afvalues[N] [2], fArrayGrad[3],fX0, fY0, fZ0, fX1, fY1, fZ1, fRad1, fRad2*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fX0, fY0, fZ0*：浮点型，圆柱轴线第一个端点的坐标（单位：m）。

*fX1, fY1, fZ1*：浮点型，圆柱轴线第二个端点的坐标（单位：m）。

*fRad1, fRad2*：浮点型，空心圆柱内外半径（单位：m）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

（4）如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

fracsp.ApplyDynaConditionByCylinder("pp",aValue, fArrayGrad, 0, 0, 0, 1, 0, 0, 0.999, 1.001);
```

<!--HJS_fracsp_ApplyDynaConditionByGroup-->

### ApplyDynaConditionByGroup方法

#### 说明

当裂隙单元的组号位于组号下限及上限之间，施加动态边界条件。

#### 格式定义

fracsp. ApplyDynaConditionByGroup(*strVar, afvalues[N] [2], fArrayGrad[3],GroupL, GroupU*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*GroupL, GroupU*：整型，组号的下限值及上限值。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z，$F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z为空间坐标。

（4）如果裂隙渗流的渗流模式为气体渗流（"Seepage_Mode"），则施加的流量为质量流量，即单位面积流量（单位：kg/m<sup>2</sup>/s）及点源流量（单位：kg/s）

#### 范例

```javascript
var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

fracsp.ApplyDynaConditionByGroup("pp",aValue, fArrayGrad, 1, 2);
```

<!--HJS_fracsp_InitConditionByCoord-->

### InitConditionByCoord方法

#### 说明

当裂隙节点坐标位于坐标控制范围之内时，对该节点进行压力或饱和度的初始化操作。

#### 格式定义

fracsp.InitConditionByCoord(<*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1*>)

#### 参数

*strVar*：字符串型，初始化类型，包含"pp"、"sat"两种类型，分别表示压力（单位：Pa）及饱和度（0.0~1.0）。

*fValue*：浮点型，初始化的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*x0**、**x1：*浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
//对坐标范围内的裂隙压力进行初始化
var grad = new Array(0, 1, 0); //变化梯度
fracsp.InitConditionByCoord("pp", 1e6, grad, -10, 10, -10, 10, -10, 10);
```

<!--HJS_fracsp_InitConditionByGroup-->

### InitConditionByGroup方法

#### 说明

当单元组号与设定组号一致，对该单元的所有节点进行压力或饱和度的初始化操作。

#### 格式定义

fracsp.InitConditionByGroup(*strVar,fValue,fArrayGrad[3],iGroupLow,iGroupUp*)

#### 参数

*strVar*：字符串型，初始化类型，包含"pp"、"sat"两种类型，分别表示压力（单位：Pa）及饱和度（0.0~1.0）。

*fValue*：浮点型，初始化的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限及上限。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0); //变化梯度
fracsp.ApplyConditionByGroup("pp", 1e6, grad,1, 4);
```

<!--HJS_fracsp_InitConditionByPlane-->

### InitConditionByPlane方法

#### 说明

当裂隙节点的坐标到设定面的距离小于容差限定值时，对该节点进行压力或饱和度的初始化操作。

#### 格式定义

fracsp.InitConditionByPlane(*strVar,fValue, fArrayGrad[3], fArrayN[3],fArrayOrigin[3], fTol*)

#### 参数

*strVar*：字符串型，初始化类型，包含"pp"、"sat"两种类型，分别表示压力（单位：Pa）及饱和度（0.0~1.0）。

*fValue*：浮点型，初始化的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fArrayN*：Array浮点型，包含3个分量，平面单位法向的3个分量；

*fArrayOrigin*：Array浮点型，包含3个分量，平面上一点的坐标；

*fTol*：浮点型，容差。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0);//变化梯度
var ns = new Array(0, 1, 0);//法向分量
var origins = new Array(0, 1, 0);//平面内一点坐标

fracsp.InitConditionByPlane("pp", 1e6, grad, ns, origins, 1e-3);
```

<!--HJS_fracsp_InitConditionByCylinder-->

### InitConditionByCylinder方法

#### 说明

当裂隙节点位于某一空心圆柱内，对该节点进行压力或饱和度的初始化操作。

#### 格式定义

fracsp.InitConditionByCylinder(*strVar, fValue, fArrayGrad[3], x0, y0, z0, x1, y1, z1, fRad1, fRad2*)

#### 参数

*strVar*：字符串型，初始化类型，包含"pp"、"sat"两种类型，分别表示压力（单位：Pa）及饱和度（0.0~1.0）。

*fValue*：浮点型，初始化的值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0); //变化梯度
fracsp.InitConditionByCoord(‘pp’,1e6, grad, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.4, 0.5);
```

<!--HJS_fracsp_SetLvRongProp-->

### SetLvRongProp方法

#### 说明

设置吕荣值计算参数，一旦设置，将开启吕荣值的实时计算。

#### 格式定义

fracsp.SetLvRongProp(<*frad, fz1, fz2, fWidthRatio, groupL, groupU*>)

#### 参数

*frad*：浮点型，注浆孔半径（单位：m）。

*fz1, fz2*：浮点型，统计区段高程（Z值）的下限及上限（单位：m）。

*fWidthRatio*：浮点型，工程开度与水力开度的比，要求大于等于1.0。

*groupL, groupU*：整型，用于进行吕荣值计算的标记单元的组号下限及上限。

#### 备注

（1）  Z方向为高程方向，进行吕荣值显示的单元必须用单独的组号进行标记，且不与其他组的单元由任何拓扑及几何上的连接；

（2）  可通过dyna.Plot("FSNode","UserDefNodeValue", 1)显示吕荣值，通过dyna.Plot("FSNode","UserDefNodeValue", 2)显示水力导度（m/day），通过dyna.Plot("FSNode","UserDefNodeValue", 3)显示总水力开度（m），通过dyna.Plot("FSNode","UserDefNodeValue", 4)显示区段内裂隙条数，通过dyna.Plot("FSNode","UserDefNodeValue", 5)显示区段内裂隙密度（单位：条/米）。

#### 范例

```javascript
//注浆孔半径0.1m，统计高程为2.5m-7.5m，开度比为5，用于显示吕荣值的组号为10
fracsp.SetLvRongProp(0.1, 2.5, 7.5, 5.0, 10, 10);
```

<!--HJS_fracsp_SetJetBoreHoleProp-->

### SetJetBoreHoleProp方法

#### 说明

设置泵注孔的基本参数，用于泵注过程的真实控制。

#### 格式定义

fracsp. SetJetBoreHoleProp (<*JetPropID, nComputeOption, nType, fLength, fDiameter, fPara1, fPara2, fQ*>)

#### 参数

*JetPropID*：整型，泵注孔ID号，大于等于1。

*nComputeOption*：整型，该泵注孔是否计算控制开关；只能为0或1,0表示关闭，1表示打开。

*nType*：整型，泵注液类型，只能为1或2,1为液体，2为气体。

*fLength*：浮点型，钻孔总长度（单位：m）。

*fDiameter*：浮点型，钻孔直径（单位：m）。

*fPara1*：浮点型，泵注流体参数1；如果nType为1（液体），该参数表示液体体积模量（单位：Pa）；如果nType为2（气体），该参数表示气体的初始密度（单位：kg/m<sup>3</sup>）。

*fPara2*：浮点型，泵注流体参数2；如果nType为1（液体），该参数表示液体中的初始压力（单位：Pa）；如果nType为2（气体），该参数表示初始气体压力（单位：Pa）。

*fQ*：浮点型，泵注流体流量；如果nType为1（液体），表示体积流量（单位：m<sup>3</sup>/s）；如果nType为2（气体），表示质量流量（单位：kg/s）。

#### 备注

泵注孔设置并与裂隙节点关联后，计算过程中，将根据泵注入钻孔的流量、钻孔中的初始流体体积以及通过裂隙节点流出的流量，计算钻孔中的压力，并将该压力施加于选定的裂隙节点。

#### 范例

```javascript
//泵注孔id为1，执行泵注计算，泵注流体类型为液体，钻孔长度50m，直径0.1m，液体体积模量2.1GPa，初始压力1MPa，泵注流量0.01m3/s。
fracsp.SetJetBoreHoleProp(1, 1, 1, 50, 0.1, 2.1e9, 1e6, 0.01 );
```

<!--HJS_fracsp_BindJetBoreHolePropByCylinder-->

### BindJetBoreHolePropByCylinder方法

#### 说明

将泵注孔ID与圆柱体圈定范围内的裂隙节点关联。

#### 格式定义

fracsp. BindJetBoreHolePropByCylinder (<*JetPropID, fx1, fy1, fz1, fx2, fy2, fz2, frad1, frad2*>)

#### 参数

*JetPropID*：整型，泵注孔ID号，大于等于1。

*fx1*，*fy1*，*fz1*：浮点型，圆柱体第一个端点的坐标分量（单位：m）。

*fx2*，*fy2*，*fz2*：浮点型，圆柱体第二个端点的坐标分量（单位：m）。

*frad1, frad2*：浮点型，内外半径（单位：m）。

#### 备注

被圈定的裂隙节点将与泵注孔关联，计算过程中，将会自动根据泵注孔中计算出的压力调整这些裂隙节点上的压力。

#### 范例

```javascript
//泵注孔的Id为2，圆柱体第一个端点坐标(0,0,0)，第二个端点坐标(1,0,0)，内半径0.099m，外半径0.101m。
fracsp.BindJetBoreHolePropByCylinder(2, 0,0,0, 1,0,0, 0.099, 0.101);
```

<!--HJS_fracsp_GetNodeValue-->

### GetNodeValue方法

#### 说明

获取裂隙渗流节点信息的值。

#### 格式定义

fracsp.GetNodeValue(<*iNode, strValueName*[*, iflag*]>)

#### 参数

*iNode*：整型，裂隙节点的ID号，从1开始；

*strValueName*：字符串型，可获得的裂隙节点变量名**，具体见附表**7（左侧）；

*iflag*：节点变量名对应的分量ID，从1开始；若节点变量为标量、或想获取分量ID为1时的值，*iflag*可以不写。

#### 备注

#### 范例

```javascript
var value= fracsp.GetNodeValue(1, "FracP");
var value= fracsp. GetNodeValue(1, "FVelocity", 3);
```

<!--HJS_fracsp_GetElemValue-->

### GetElemValue方法

#### 说明

获得裂隙渗流单元的值。

#### 格式定义

fracsp.GetElemValue(<*iElem, strValueName*[*, iflag*]*>*)

#### 参数

*iElem*：整型，裂隙单元ID号，从1开始；

*strValueName*：字符串型，可获取的裂隙单元变量名，**具体见附表7**（右侧）。

*iflag*：单元变量名对应的分量ID，从1开始；若单元变量为标量、或想获取分量ID为1时的值，*iflag*可以不写。

#### 备注

#### 范例

```javascript
var value= fracsp.GetElemValue(1, "FDensity");
```

<!--HJS_fracsp_SetNodeValue-->

### SetNodeValue方法

#### 说明

设置裂隙渗流节点信息。

#### 格式定义

fracsp.SetNodeValue(<*iNode, strValueName, fValue*[*, iflag*]*>*)

#### 参数

*iNode*：整型，裂隙节点的ID号，从1开始；

*strValueName*：字符串型，可设置的裂隙节点变量名，**具体见附表7**（左侧）；

*iflag*：节点变量名对应的分量ID，从1开始；若节点变量为标量、或想设置分量ID为1时的值，*iflag*可以不写。

#### 备注

#### 范例

```javascript
fracsp.SetNodeValue(1, "FracP",1e6);
```

<!--HJS_fracsp_SetElemValue-->

### SetElemValue方法

#### 说明

设置裂隙渗流单元信息。

#### 格式定义

fracsp.SetElemValue (<*iElem, strValueName, fValue*[*, iflag*]*>*)

#### 参数

*iElem*：整型，裂隙单元ID号，从1开始；

*strValueName*：字符串型，可设置的裂隙单元变量名，**具体见附表7**（右侧）。

*iflag*：单元变量名对应的分量ID，从1开始；若单元变量为标量、或想设置分量ID为1时的值，*iflag*可以不写。

#### 备注

#### 范例

```javascript
fracsp.SetElemValue(1, "FBulk",1e9);
```

<!--HJS_fracsp_GetElemID-->

### GetElemID方法

#### 说明

获得离某一坐标最近的裂隙单元的ID号（通过裂隙单元体心判断，ID号大于等于1）。

#### 格式定义

fracsp.GetElemID (<*fx, fy, fz>*)

#### 参数

*fx, fy, fz*：浮点型，某一点的坐标（单位：m）；

#### 备注

返回值-1，表示系统中未包含单元。

#### 范例

```javascript
Var ElemID = fracsp.GetElemID(0.0, 1.0, 10.0);
```

<!--HJS_fracsp_GetNodeID-->

### GetNodeID方法

#### 说明

获得离某一坐标最近的裂隙节点的ID号（ID号大于等于1）。

####  格式定义

fracsp.GetNodeID (<*fx, fy, fz>*)

#### 参数

*fx, fy, fz*：浮点型，某一点的坐标（单位：m）；

#### 备注

返回值-1，表示系统中未包含节点。

#### 范例

```javascript
Var NodeID = fracsp.GetNodeID(0.0, 1.0, 10.0);
```

<!--HJS_fracsp_Solver-->

### Solver方法

#### 说明

裂隙渗流求解器（每一迭代步求解一次）。

#### 格式定义

fracsp.Solver ()

#### 参数

无。

#### 备注

该方法是fracsp. CalDynaBound ()、fracsp. CalNodePressure ()、fracsp. CalElemDischarge ()、fracsp. CalIntSolid ()、fracsp. CalIntPoreSp ()、fracsp. CalPipeDischarge ()、fracsp. CalJetConvection ()这7个子方法的集成。

#### 范例

```javascript
fracsp.Solver();
```

<!--HJS_fracsp_CalDynaBound-->

### CalDynaBound方法

#### 说明

计算裂隙渗流中动态的压力及流量边界（fracsp.Solver()中的一个子函数）。

#### 格式定义

fracsp. CalDynaBound ()

#### 参数

无。

#### 备注

无。

#### 范例

```javascript
fracsp.CalDaynaBound();
```

<!--HJS_fracsp_CalNodePressure-->

### CalNodePressure方法

#### 说明

计算裂隙渗流中节点的压力及饱和度（fracsp.Solver()中的一个子函数）。

#### 格式定义

fracsp. CalNodePressure ()

#### 参数

无。

#### 备注

无。

#### 范例

```javascript
fracsp.CalNodePressure ();
```

<!--HJS_fracsp_CalElemDischarge-->

### CalElemDischarge方法

#### 说明

计算裂隙渗流中单元的流量（fracsp.Solver()中的一个子函数）。

#### 格式定义

fracsp. CalElemDischarge ()

#### 参数

无。

#### 备注

无。

#### 范例

```javascript
fracsp. CalElemDischarge ();
```

<!--HJS_fracsp_CalIntSolid-->

### CalIntSolid方法

#### 说明

计算裂隙渗流单元与固体单元的耦合（fracsp.Solver()中的一个子函数）。

#### 格式定义

fracsp. CalIntSolid ()

#### 参数

无。

#### 备注

无。

#### 范例

```javascript
fracsp.CalIntSolid ();
```

<!--HJS_fracsp_CalIntPoreSp-->

### CalIntPoreSp方法

#### 说明

计算裂隙渗流单元与孔隙渗流单元的耦合（fracsp.Solver()中的一个子函数）。

#### 格式定义

fracsp. CalIntPoreSp ()

#### 参数

无。

#### 备注

无。

#### 范例

```javascript
fracsp.CalIntPoreSp ();
```

<!--HJS_fracsp_CalPipeDischarge-->

### CalPipeDischarge方法

#### 说明

计算两个几何上有交叉但不共节点网格间的流量透传（fracsp.Solver()中的一个子函数）。

#### 格式定义

fracsp. CalPipeDischarge ()

#### 参数

无。

#### 备注

无。

#### 范例

```javascript
fracsp.CalPipeDischarge ();
```

<!--HJS_fracsp_CalJetConvection-->

### CalJetConvection方法

#### 说明

计算流量注入点上不同材料性质流体的输运过程（fracsp.Solver()中的一个子函数）。

#### 格式定义

fracsp. CalJetConvection ()

#### 参数

无。

#### 备注

无。

#### 范例

```javascript
fracsp.CalJetConvection ();
```



