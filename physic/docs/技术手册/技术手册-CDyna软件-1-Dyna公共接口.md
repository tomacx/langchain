<!--HJS_dyna_Public_Interface-->

## 公共接口

本章主要介绍块体模块、颗粒模块等模块的共用接口，他们分别包括全局量的设置及获取、求解过程设置、结果查看设置、通用信息输出设置、基于C++的二次开发的接口函数等。

<!--HJS_dyna_Set_Get_GlobalVal-->

##  全局量的设置及获取

全局量的设置及获取的接口函数如表2.1所示。

<center>表2.1全局量的设置及获取</center>

| 序号 | 函数名              | 说明                                         |
| ---- | ------------------- | -------------------------------------------- |
| 1    | Set                 | 设置全局变量                                 |
| 2    | GetValue            | 获取全局变量                                 |
| 3    | CreateTable         | 创建全局Table表格                            |
| 4    | CreateLocalCoordSys | 创建局部坐标系。                             |
| 5    | Clear               | 清除块体、颗粒等模块中的内存，重新开始计算。 |

<!--HJS_dyna_Set-->

### Set方法

#### 说明

设置全局参数数值。

#### 格式定义

dyna.Set(<*str*>);

#### 参数

*str*

设置参数的表达式字符串。字符串由参数名及参数值两部分组成，参数值只能为整型（I）或浮点数（F），不同的参数名可能具有不同的参数个数及参数类型；同一参数名后面存在多个参数时，各参数的类型也可能不一样。参数名与参数值之间、不同参数值之间用空格分开。

不同的参数名及对应的参数取值见附表1中附1.1-附1.8。

#### 备注

（1）每执行一次命令，对应的全局参数便进行一次重置。

（2）附表1中附1.1-附1.8中的*str*中凡是带"Config_"前缀的，必须在创建或导入网格前进行设置，以便核心模块开辟相应内存。

#### 范例

```javascript
//打开固体力学计算开关
dyna.Set("Mechanic_Cal");
//设置全局坐标系下三个方向的加速度分量
dyna.Set("Gravity 0.0 -9.8 0.0");
```

<!--HJS_dyna_GetValue-->

### GetValue方法

#### 说明

获得全局量，返回值可赋给JavScript变量。

#### 格式定义

dyna. GetValue (*strName* [*,iflag*]);

#### 参数

*strName*：字符串型，获取变量的名称。

*iflag*：整型，获取变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

可供获取的全局变量见附表1。

#### 范例

```javascript
//获取单元总数
var TotalNo = dyna.GetValue("Total_Block_Num");
///获取X方向的重力加速度
var xacc = dyna.GetValue("Gravity",1);
```

<!--HJS_dyna_getNumThreads-->

### getNumThreads方法

#### 说明

得到并行核数。

#### 格式定义

<*nThreads*> = dyna.getNumThreads();

#### 参数

*nThreads*

设置的并行核数。

#### 备注

（1）获得已设置的最大运行核数。

（2）如果设置的或软件授权允许的数量超过了计算机的CPU核数，则实际仍按CPU核数执行。

（3）也可通过numThreads变量获得，效果相同。

#### 范例

```javascript
//获得并行核数
n1 = dyna.getNumThreads(8);

//打印核数
print(n1);
```

<!--HJS_dyna_setNumThreads-->

### setNumThreads方法

#### 说明

设置并行核数。

#### 格式定义

dyna.setNumThreads(<*nThreads*>);

#### 参数

*nThreads*

设置并行核数。

#### 备注

（1）如果设置的核数超过了软件授权允许的数量，则设置无效。

（2）如果设置的或软件授权允许的数量超过了计算机的CPU核数，则实际仍按CPU核数执行。

（3）也可通过numThreads变量设置，效果相同。

#### 范例

```javascript
//设置8核并行
dyna.setNumThreads(8);
```

<!--HJS_dyna_numThreads-->

### numThreads变量

#### 说明

最大并行核数的全局变量。

#### 备注

（1）如果设置的核数超过了软件授权允许的数量，则设置无效。

（2）如果设置的或软件授权允许的数量超过了计算机的CPU核数，则实际仍按CPU核数执行。

（3）也可通过getNumThreads方法或setNumThreads方法设置，效果相同。

#### 范例

```javascript
//设置8核并行
dyna.numThreads = 8;

//打印核数
print(dyna.numThreads);
```

<!--HJS_dyna_CreateTable-->

### CreateTable方法

#### 说明

创建一个Table，内含Table数据。

#### 格式定义

dyna.CreateTable(*IdNo*, *sTname*, *TotalCoordNo*, *mafCoord*[][3]);

#### 参数

*IdNo*：整型，Table表格的序号，从1开始。

*sTname*：字符串型，Table的名字。

*TotalCoordNo*：整型，Table中坐标点个数。

*mafCoord*：Array浮点型，Table表格中的坐标，第一维个数为*TotalCoordNo*，第二维的个数为3。

#### 备注

圈闭多边形时，*mafCoord*中的坐标应按顺时针或逆时针排列。

#### 范例

```javascript
//创建一个包含3个节点坐标的Table表格，表格序号为1，表格名字为"feng1"
var coord=new Array([1.0,0.0,0.0],[0.0,1.0,0.0],[0.0,0.0,1.0])
dyna.CreateTable (1, "feng1", 3, coord);
```

<!--HJS_dyna_CreateLocalCoordSys-->

### CreateLocalCoordSys方法

#### 说明

创建局部坐标系，该局部坐标系为一个全局变量。

#### 格式定义

dyna. CreateLocalCoordSys (*IdNo*, *OriginCoord*[3], *NormDir*[3], *TanDir1*[3]);

#### 参数

*IdNo*：整型，局部坐标系的ID序号，从1开始。

*OriginCoord*：Array浮点型，包含3个分量，局部坐标系的原点坐标。

*NormDir*：Array浮点型，包含3个分量，局部坐标系的法向单位向量。

*TanDir1*：Array浮点型，包含3个分量，局部坐标系的第一个切向单位向量（第二个切向向量通过计算获得）。

#### 备注

#### 范例

```javascript
//创建原点
var origin=new Array(1.0,1.0,1.0);
//创建法向
var coord=new Array(0.0,0.0,1.0);
//创建第一个切向
var Nomal=new Array(0.0,1.0,0.0);
//创建局部坐标系，序号为1
dyna.CreateLocalCoordSys (1, origin, Nomal, coord);
```

<!--HJS_dyna_Clear-->

### Clear方法

#### 说明

清除块体、颗粒等模块中的数据，便于重新开始计算。

#### 格式定义

dyna.Clear();

#### 参数

#### 备注

在不新建工程的情况下再次求解，需要使用该接口函数清除内存中的数据。

#### 范例

```javascript
dyna. Clear();
```

<!--HJS_dyna_Solve_Set-->

## 求解过程设置

求解过程设置中提供了计算时步自动修正、核心求解、安全系数求解、保存文件、调入文件等函数，函数列表见表2.3。

<center>表2.3求解过程设置的相关函数</center>

| **序号** | **方法**          | **说明**                                                     |
| -------- | ----------------- | ------------------------------------------------------------ |
| 1        | TimeStepCorrect   | 根据单元（颗粒）性质自动计算可以让显示迭代顺利进行的最大时间步长。 |
| 2        | ScaleTimeStep     | 通过调整单元（颗粒）性质（密度、质量、模量、刚度等），实现采用某一特定时步计算的目的。 |
| 3        | Solve             | 核心求解（求解至稳定或求解若干步退出）                       |
| 4        | DynaCycle         | 动态求解，求解至设定时间退出。                               |
| 5        | SuperCal          | 超级求解                                                     |
| 6        | SolveFos          | 安全系数二分法求解                                           |
| 7        | SolveFosByCriDisp | 基于临界位移的安全系数求解                                   |
| 8        | Save              | 保存二进制数据文件*.sav，供重启动分析使用。                  |
| 9        | Restore           | 重启动分析或后处理分析时调入*.sav文件。                      |

<!--HJS_dyna_TimeStepCorrect-->

### TimeStepCorrect方法

#### 说明

根据单元（颗粒、杆件）等性质自动计算可以让显示迭代顺利进行的最大时间步长。

#### 格式定义

dyna.TimeStepCorrect(<[fCoeff]>);

#### 参数

fCoeff：浮点型，时步比例因子，需要大于0，即根据自动计算获得的时步乘以该比例因子，获得最终计算时步。若不写，表明比例因子为1。

#### 备注

执行该函数时分别计算块体时步、渗流时步、温度时步及杆件时步的临界值，并取其中的最小值作为迭代时步。

#### 范例

```javascript
//计算最大时间步长
dyna.TimeStepCorrect();
dyna.TimeStepCorrect(0.5);
```

<!--HJS_dyna_ScaleTimeStep-->

### ScaleTimeStep方法

#### 说明

通过调整单元（颗粒、杆件）性质自动将时步调整至设定值。

#### 格式定义

dyna.ScaleTimeStep(< *fTimeStep [, fSaftetyFactor [, nType] ]* >);

#### 参数

*fTimeStep*：浮点型，设定的时步，需要大于0.0，执行此命令后可用该时步进行计算。

*fSaftetyFactor*：浮点型，安全系数，为fTimeStep预留的保险系数，确保采用fTimeStep可以顺利迭代计算。如果不输入，默认值为1.0。

*nType*：整型，调整类型，只能为1或2。如果为1，表示通过调整密度实现特定时步；如果为2，表示通过调整模量实现特定时步。如果不输默认值为1。

#### 备注

在进行动态计算时，存在因为单元尺寸过小、过扁、或材料参数差异过大，导致计算时步过小的现象；这将严重影响计算耗时。采用本命令后，通过调整局部单元的材料参数，可将这些单元的时步调整至设定值，从而增大了计算时步，节省了计算时间。

此函数应在材料参数全部输入完毕后，计算之前执行。

#### 范例

```javascript
//将计算时步调整为5ms
dyna. ScaleTimeStep (5e-3);
dyna. ScaleTimeStep (5e-3,1.5);
dyna. ScaleTimeStep (5e-3,1.5, 2);
```

<!--HJS_dyna_Sovle-->

### Sovle方法

#### 说明

核心求解。

#### 格式定义

包含两种函数形式。

dyna.Sovle();

求解至稳定，即不平衡率达到"UnBalance_Ratio"设定的值或达到2亿步。

dyna.Solve(iIter);

求解iIter步后自动退出求解。

#### 参数

*iIter*：整型，本次求解的迭代步数。

#### 备注

#### 范例

```javascript
//核心计算
dyna.Sovle();
```

<!--HJS_dyna_DynaCycle-->

### DynaCycle方法

#### 说明

动态计算。

#### 格式定义

dyna.DynaCycle(*fTime*);

#### 参数

*fTime*：浮点型，计算到多少时间，全量值（单位：s）

#### 备注

无反射，自由场等条件均需在DynaCycle求解中起作用。

#### 范例

```javascript
//计算到100s
dyna.DynaCycle(100);
```

<!--HJS_dyna_SuperCal-->

### SuperCal方法

#### 说明

超级计算。

#### 格式定义

dyna.SuperCal(MinIter,MaxIter, UnBalRatio, HistNo, IfLargerThan, *SettedKeyValue*);

#### 参数

*MinIter*：整型，计算步数的下限（至少迭代这个步数，大于等于1）；

*MaxIter*：整型，计算步数的上限值（最多计算这么多步）；

*HistNo*：整型，表示监测点的序号（起始监测点号为1），监测点的添加可通过dyna.Monitor函数实现；

*UnBalRatio*：浮点型，不平衡率，系统不平衡率小于该值，则退出求解；

IfLargerThan：整型，只取为0、1两个值。0表示监测点的值小于设定值时退出求解，1表示监测点的值大于设定值时退出求解。

*SettedKeyValue*：浮点型，设定值的大小。

#### 备注

该函数执行时，首先需利用dyna.Monitor函数设定监测点及需要监测的内容，而后将监测序号*HistNo*填入该函数，在核心计算的每个时步，自动判断监测点的值是否满足设定的条件，从而确定是否退出求解。

#### 范例

```javascript
//超级计算
dyna.SuperCal(10,1000,1e-5,1, 1, 1e6);
```

<!--HJS_dyna_SolveFos-->

### SolveFos方法

#### 说明

安全系数的二分法求解，返回值为最终的安全系数值。

#### 格式定义

dyna.SolveFos(*typical_step,totalstage, displimit, coord[3],save_filename*);

#### 参数

*typical_step*：整型，表示初始阶段计算的时步数（推荐值为5000）；

*totalstage*：整型，总共计算的阶段数，每个stage中的计算时步数为初始时步*ypical_step*的一半；

*displimit*：浮点型，为位移上限值，超过该值，退出本次迭代（单位：m）；

*coord*：Array浮点型，包含3个分量，为观察节点的坐标值（单位：m）

*save_filename*：字符串型，sav文件的文件名，每次二分法的初始阶段调入该文件。

#### 备注

安全系数上限与下限之差除以上限与下限的平均值小于0.01，认为安全系数求解精度满足要求，系统停止安全系数求解。用户也可通过点击软件的退出求解按钮来提前结束安全系数的求解。

软件中首先找到离设定坐标最近的点，安全系数求解时获取该点位移总量，如果该位移超过displimit，则判定为不稳定。

调入save文件主要用于节省后续计算时间，即基于save文件中保存的场进行计算。

每一组强度参数下的求解，只有当系统不平衡率小于设定值（通过dyna.Set设置"UnBalance_Ratio"实现）时，才表示该组参数稳定，此时获得安全系数下限值。

有4种情况可以判定模型在该组参数下不稳定：

（1）  系统不平衡率超过了100；

（2）  系统中设定节点（离coord指定坐标最近的点）的位移超过了displimit设定的值；

（3）  后一个stage的平均不平衡率与前一个stage相比变化很小，fabs( stage(i+1) – stage(i) ) / stage(i) < 0.005；

（4）  计算了step + 0.5 × step × stage 的时步后，任何不能小于设定的不平衡率。

注意：计算安全系数，单元模型需要开启塑性模型，计算时宜用小变形，大变形容易因网格畸变导致发散。如果有节理，节理模型开启断裂模型。

#### 范例

```javascript
//设置观察点的位置
var coord=new Array(10.0,10.0,0.0)
var fos = dyna.SolveFos(5000, 8 ,1.0,coord,"static.sav");
print(fos);
```

<!--HJS_dyna_SolveFosByCriDisp-->

### SolveFosByCriDisp方法

#### 说明

仅通过关键点的位移是否超出设定值来进行安全系数的求解，返回值为最终的安全系数。

#### 格式定义

dyna.SolveFosByCriDisp(*TotalStepForLoop,displimit,coord[3],save_filename)*;

#### 参数

*TotalStepForLoop*：整型，设定的迭代时间步

*displimit*：浮点型，位移上限值（单位：m），超过该值，退出求解

*coord*：Array浮点型，包含3个分量，设定观察点的坐标（单位：m）

*save_filename*：字符串型，sav文件的文件名，每次二分法的初始阶段调入该文件。

#### 备注

安全系数上限与下限之差除以上限与下限的平均值小于0.01，认为安全系数求解精度满足要求，系统停止安全系数求解。用户也可通过点击软件的退出求解按钮来提前结束安全系数的求解。

在设定的迭代时步（TotalStepForLoop）内，如果设定点的总位移超过设定值（displimit），则不稳定性。

在设定的迭代时步（step）内，如果设定点的总位移超过设定值（displimit），不稳定性，找到安全系数上限值；如果迭代步完成后位移仍然在设定范围内，安全，找到下限值。

注意：计算安全系数，块体模型需要开启塑性模型，计算时最好用小变形，大变形容易因网格畸变导致发散。如果有节理，节理模型开启断裂模型。

#### 范例

```javascript
//定义观察点坐标
var coord=new Array(10.0,10.0,0.0)
var fos = dyna.SolveFosByCriDisp(6000,1e-3 , coord,"static.sav");
print(fos);
```

<!--HJS_dyna_Save-->

### Save方法

#### 说明

存储二进制save文件，供后续重启动计算及后处理使用。

#### 格式定义

dyna.Save(FileName);

#### 参数

FileName：字符串型，save文件的文件名（扩展名为.sav）。

#### 备注

在核心计算过程中，如果"SaveFile_Out"为1，则每隔"Output_Interval"设定的时步，自动在Result文件夹创建%d.sav的save文件（%d为当前时步）。

#### 范例

```javascript
//在当前文件夹下存储名为feng.sav的save文件
dyna.Save ("feng.sav");
```

<!--HJS_dyna_Restore-->

### Restore方法

#### 说明

调入*.sav二进制文件，并执行后续的计算或后处理分析工作。

#### 格式定义

dyna.Restore (FileName);

#### 参数

FileName：字符串型，save文件的文件名（扩展名为.sav）。

#### 备注

为了节省存储空间，save文件仅存储了用于后续计算的核心数据，对于网格信息及一些全局数据等并未进行存储。因此，在调入.sav文件之前，需调入对应的网格，执行相应的操作（如接触面切割、材料参数幅值、全局参数幅值、边界条件施加等）后，方可调入.sav文件。

一般而言，在命令流文件中的哪个位置存储的.sav文件，需要将dyna.Restore函数写在该位置，然后重新运行一下命令流，进行.sav文件的读入。

调入.sav文件时，可屏蔽相应的核心求解函数，仅执行一些条件施加函数。

#### 范例

```javascript
//从D盘根目录调入文件名为dyna.sav的save文件
dyna.Restore ("D:\dyna.sav");
```

<!--HJS_dyna_Result_Set-->

## 结果查看设置

结果查看中主要包括时程信息的监测（Monitor）、云图的绘制（Plot）、统计信息的打印（Print）等多个功能函数，具体见表2.4。

<center>表2.4结果查看设置的相关函数</center>

| **序号** | **方法**          | **说明**                                                     |
| -------- | ----------------- | ------------------------------------------------------------ |
| 1        | Monitor           | 监测典型测点的时程信息。                                     |
| 2        | MonitorBySel      | 根据Genvi平台上的选择结果进行监测。                          |
| 3        | DrawMonitorPos    | 绘制监测点的位置（在模型视图中用红色圆点表示）。             |
| 4        | RegionMonitor     | 对某一区域内的节点、弹簧、颗粒等信息进行监测。               |
| 5        | Plot              | 单元属性、材料信息及结果信息的云图展示。                     |
| 6        | Print             | 各类统计信息的打印。                                         |
| 7        | PutStep           | 将当前时步的结果信息推送至Genvi平台上进行展示。              |
| 8        | PutGroup          | 将Dyna核心求解模块中各类单元按照当前的组号推送至平台         |
| 9        | OutputMonitorData | 将当前时步的监测信息输出至Result文件夹下的监测文件中。       |
| 10       | OutputModelResult | 将当前时步的结果信息在Result文件夹下存储为其他软件可导入的格式。 |
| 11       | ResetGroupName    | 重新设置Genvi平台上显示的组号的名称。                        |
| 12       | GetGroupId        | 获取块体、颗粒、刚性面、裂隙单元等的组号ID数组。             |
| 13       | GetBoundingBox    | 获取块体、颗粒、刚性面、杆件、裂隙流单元、冲击波单元的最大、最小边界坐标。 |

<!--HJS_dyna_Monitor-->

### Monitor方法

#### 说明

监测某一测点或全局的时程信息。

#### 格式定义

包含两种函数类型。

dyna.Monitor(*strType*, *strName*, x, *y*, *z*);

监测某一点的信息。

dyna.Monitor(*strType*, *strName*);

监测全局信息。

#### 参数

*strType*：字符串型，监测类型，可以为以下10种类型之一，"block"、"block1"、"spring"、"spring1"、"fracsp"、"bar"、"particle"、"rdface"、"gvalue"、"skwave"。

*strName*：字符串型，监测内容。

*x**、**y**、**z*：浮点型，监测点的三个分量（可以为坐标，可以为ID号，不同的监测类型及监测内容其意义有所不同）。如果*strType*为"gvalue"时，可以不用输入x、y、z坐标。

#### 备注

当监测内容为"**block**"时

x、y、z表示节点的坐标。

可监测以下内容：

xacc、yacc、zacc、magacc，加速度

xvel、yvel、zvel、magvel，速度

xdis、ydis、zdis、magdis，位移

xforce、yforce、zforce、magforce，内力（包括变形力、接触力、裂隙水压力、动态施加的节点力及面力等）

ext_xforce、ext_yforce、ext_zforce、ext_magforce 外力（包括重力及静态节点力、面力等）

sxx、syy、szz、sxy、syz、szx，6个应力分量

principal_stress_max、principal_stress_mid、principal_stress_min，最大主应力、中间主应力、最小主应力

average_normal_stress、average_shear_stress，平均正应力及平均剪应力（Mises应力）

soxx、soyy、sozz、soxy、soyz、sozx，六个应变分量

principal_strain_max、principal_strain_mid、principal_strain_min，最大主应变、中间主应变、最小主应变

bulk_plastic_strain、shear_plastic_strain，塑性体应变、塑性正应变

fpp、fxvel、fyvel、fzvel、magfvel，流体压力、x方向流速、y方向流速、z方向流速、合流速

satruation、porosity、fdensity、discharge，流体饱和度、孔隙率、密度、节点不平衡流量

temperature、heat_xvel、heat_yvel、heat_zvel、heat_magvel，热传导计算中的温度、X方向热流速、Y方向热流速、Z方向热流速、热流速合量。

UDM_P1、UDM_P2、UDM_P3、UDM_P4、UDM_P5、UDM_P6，用户自定义的块体信息（插值后存储于节点）。

General_P1、General_P2、General_P3、General_P4、General_P5、General_P6，内置单元变量，不同的模型具有不同的意义（插值后存储与节点）。

当监测内容为**"block1"**时

可监测的内容与"block"的一致，只是x、y、z的意义不同，第一个数表示块体全局序号；第二个数表示要测的点在块体中的局部序号；第三个数无意义，但必须写。该监测主要是为了解决接触面两侧节点占据相同的位置，但分属不同的块体时的时程信息获取。

当监测内容为**"spring"**时

x、y、z表示半弹簧的坐标。

可监测以下内容：

sp_ndis、sp_s1dis、sp_s2dis，接触面法向位移、切向位移1、切向位移2。

sp_nstress、sp_s1stress、sp_s2stress，接触面法向应力，切向应力1，切向应力2。

sp_tensileD、sp_shearD，接触面拉伸损伤因子及剪切损伤因子。

sp_broken、sp_crack，接触面破坏标记（0-没有坏，1-破坏），接触面断裂标记（0-未断，1-断裂）。

sp_BrokenTypeNow、sp_BrokenTypeInit，接触面当前破裂类型及初始破裂类型，0-未破坏，1-拉破坏，2-剪破坏，3-拉剪联合破坏。

sp_UDM_P1、sp_UDM_P2、sp_UDM_P3、sp_UDM_P4、sp_UDM_P5、sp_UDM_P6，用户自定义接触面信息。

当监测内容为**"spring1"**时

"spring1"监测的内容与"spring"的相同，所不同的是后面的三个数分别表示半弹簧所在的目块体序号（从1开始），块体中的局部面号（从0开始编号）及面内的局部点号（从0开始编号）。

当监测内容为**"fracsp"**时

x、y、z表示裂隙节点的坐标。

可监测以下内容：

sc_xvel、sc_yvel、sc_zvel、sc_magvel，裂隙节点3个方向的流速及合流速

sc_pp、sc_satruation、sc_discharge、sc_width，裂隙压力、节点饱和度、节点不平衡流量、节点裂隙开度。

当监测内容为**"bar"**时

x、y、z表示杆件节点的坐标。

可监测以下内容：

a_xacc、a_yacc、a_zacc，全局坐标系下加速度

a_xvel、a_yvel、a_zvel，全局坐标系下速度

a_xdis、a_ydis、a_zdis，全局坐标系下位移

a_xforce、a_yforce、a_zforce，全局坐标系下内力

a_shear_force1、a_shear_force2、a_normal_force，局部坐标系下切向力及法向力

a_xrot、a_yrot、a_zrot，全局坐标系下转角（pile模式下起作用）

a_shear_moment1、a_shear_moment2、a_normal_moment，局部坐标系下弯矩（pile模式下起作用）

当监测内容为**"particle"**时

x、y、z表示颗粒体心坐标。

pa_xacc、pa_yacc、pa_zacc、pa_magacc，颗粒加速度

pa_xvel、pa_yval、pa_zvel、pa_magvel，颗粒速度

pa_xdis、pa_ydis、pa_zdis、pa_magdis，颗粒位移

pa_xforce、pa_yforce、pa_zforce、pa_magforce，颗粒力

pa_xrodis、pa_yrodis、pa_zrodis，颗粒转角

pa_xmoment、pa_ymoment、pa_zmoment，颗粒转矩

pa_sxx、pa_syy、pa_szz、pa_sxy、pa_syz、pa_szx，颗粒6个应力分量

pa_bulk_strain、pa_shear_strain，颗粒的体积应变及剪切应变

当监测内容为**"rdface"**时

包含以下3种输入方式。

（1）方式1，按照刚（柔）性面的组号监测一些统计量。此时，监测坐标x、y分别表示刚性面组号下限、刚性面组号上限，如果监测全局坐标系下的力及位移，监测坐标z无意义，但必须写；如果监测弯矩、局部坐标系下力、位移，监测坐标z为局部坐标系的ID号（可通过dyna. CreateLocalCoordSys函数进行设置）。

可监测以下内容：

rg_bxForce、rg_byForce、rg_bzForce、rg_bmagForce，刚性面与块体接触时，在X、Y、Z三个方向全局坐标系下的接触力及接触合力

rg_bxMoment、rg_byMoment、rg_bzMoment，刚性面与块体接触时，在X、Y、Z三个方向全局坐标系下的力矩

rg_bxLocalForce、rg_byLocalForce、rg_bzLocalForce，刚性面与块体接触，相对于某一局部坐标系，在局部坐标系下的切向力及法向力（rg_bzLocalForce为法向力）

rg_bxLocalMoment、rg_byLocalMoment 、rg_bzLocalMoment，刚性面与块体接触，相对于某一局部坐标系的力矩。

rg_pxForce、rg_pyForce、rg_pzForce、rg_pmagForce，刚性面与颗粒接触时，在X、Y、Z三个方向全局坐标系下的接触力及接触合力

rg_pxMoment、rg_pyMoment、rg_pzMoment，刚性面与颗粒接触时，在X、Y、Z三个方向全局坐标系下的力矩

rg_pxLocalForce、rg_pyLocalForce、rg_pzLocalForce，刚性面与颗粒接触，相对于某一局部坐标系，在局部坐标系下的切向力及法向力（rg_pzLocalForce为法向力）

rg_pxLocalMoment、rg_pyLocalMoment 、rg_pzLocalMoment，刚性面与颗粒接触，相对于某一局部坐标系的力矩。

rg_xDis、rg_yDis、rg_zDis、rg_magDis，刚性面在X、Y、Z三个方向全局坐标系下的平均位移，合位移。

rg_xLocalDis、rg_yLocalDis、rg_zLocalDis，刚性面在某一局部坐标系下的平均位移分量。

rg_xVel、rg_yVel、rg_zVel、rg_magVel，刚性面在X、Y、Z三个方向全局坐标系下的平均速度，合速度。

rg_xLocalVel、rg_yLocalVel、rg_zLocalVel，刚性面在某一局部坐标系下的平均速度分量。

注：对刚性面的信息进行监测，对满足组号控制的刚性面上的监测信息进行统计，其中力及力矩采用累加的方式，求取合力或合力矩；位移采用平均的方式，求取平均值。

（2）方式2，监测刚（柔）性面某个节点的信息，此时的监测坐标x、y、z起作用，软件自动搜索离输入坐标点最近的节点，作为监测点。

该方式可监测以下内容：

rg_NodeVelX、rg_NodeVelY、rg_NodeVelZ、rg_NodeVelMag，节点的速度分量及合量

rg_NodeDisX、rg_NodeDisY、rg_NodeDisZ、rg_NodeDisMag，节点的位移分量及合量

3）方式3，监测刚性面片组成的part（刚体），此时，监测坐标x表示part的id号（从1开始），监测坐标y及z无意义，但必须写。

该方式可监测以下内容：

rg_PartAccX、rg_PartAccY、rg_PartAccZ、rg_PartAccMag，part的加速度分量及合量

rg_PartVelX、rg_PartVelY、rg_PartVelZ、rg_PartVelMag，part的速度分量及合量

rg_PartDisX、rg_PartDisY、rg_PartDisZ、rg_PartDisMag，part的位移分量及合量

rg_PartRotaAccX、rg_PartRotaAccY、rg_PartRotaAccZ、rg_PartRotaAccMag，part的转动加速度分量及合量

rg_PartRotaVelX、rg_PartRotaVelY、rg_PartRotaVelZ、rg_PartRotaVelMag，part的转动速度分量及合量



当监测内容为**"skwave"**时

x、y、z表示节点的坐标。

可监测以下内容：

sw_pp，流体压力

sw_dens，流体密度

sw_xvel、sw_yvel、sw_zvel、sw_magvel，三个方向的流速及合流速

sw_e，能量密度

sw_temp，温度（单位：开尔文）

sw_gastype，气体类型（1为未燃烧气体，0为不可燃气体或已经燃烧的气体，-1为固体）

sw_gama，绝热指数

sw_solid，固体标记



当监测内容为**"gvalue"**时

不需要输入监测分量x、y、z。

可监测以下内容：

固体不平衡率（gv_solid_unbal）、流体不平衡率（gv_fluid_unbal）、杆件不平衡率（gv_anchor_unbal）、颗粒不平衡率（gv_ball_unbal）；

弹簧总破坏度（gv_spring_broken_ratio，出现过破坏就算）、弹簧总破裂度（gv_spring_crack_ratio，弹簧出现破裂，且粘聚力及抗拉强度降低为0）、弹簧强损伤区体积占比（gv_spring_strong_damage_ratio，弹簧损伤因子大于等于0.9，计入统计）、弹簧弱损伤区占比（gv_spring_weak_damage_ratio，弹簧损伤因子大于等于0.1，计入统计）、弹簧等效破裂率（gv_spring_equiv_crack_ratio，弹簧损伤因子与面积乘积的累计值/总面积）、弹簧当前破坏度（gv_sbr_now，现在处于坏的状态）；

块体总破坏度（gv_block_broken_ratio，出现过塑性，就算）、块体总体破裂度（gv_block_crack_ratio、损伤因子达到1，粘聚力及内摩擦角到0）、块体强损伤区体积占比（gv_block_strong_damage_ratio，单元损伤因子大于等于0.9，计入统计）、块体弱损伤区体积占比（gv_block_weak_damage_ratio，单元损伤因子大于等于0.1，计入统计）、块体等效破裂率（gv_block_equiv_crack_ratio，块体损伤因子与体积乘积的累计值/总体积）、块体当前破坏度（gv_bbr_now，现在处于坏的状态）、块体等效破裂体积（gv_block_equiv_frac_volume）；

块体系统的总应变能（gv_block_strain_energy），总动能（gv_block_kinetic_energy），总重力势能（gv_block_gravity_energy），接触面总变形能（gv_contact_strain_energy）。

所有单元中的流体质量（渗流质量+吸水质量）（gv_fluid_total_mass），达到饱和的单元体积总和（gv_fluid_saturation_volume）。

裂隙流中，模型中流体的总质量（gv_fracsp_total_mass）（kg），模型中含有裂隙水的等效半径（gv_fracsp_eff_rad）（m）。

#### 范例

```javascript
//监测与（1,1,1）点最近的节点的x方向的位移
dyna.Monitor("block","xdis",1.0,1.0,1.0);
//监测组号1到组号10的刚性面上与块体接触的全局坐标系下X方向的平均接触力
dyna.Monitor("rdface"," rg_bxForce ", 1, 10 ,1);
//监测系统的断裂度
dyna.Monitor("gvalue ","gv_spring_crack_ratio");
//监测与（1,2,3）点最近的节点的冲击波压力
dyna.Monitor("skwave"," sw_pp ", 1, 2 ,3);
```

<!--HJS_dyna_MonitorBySel-->

### MonitorBySel方法

#### 说明

根据Genvi选择的节点进行信息监测。

#### 格式定义

dyna.MonitorBySel(*strType*, *strName*);

#### 参数

*strType*：字符串型，监测类型，可以为以下5种类型之一，"block"、"spring"、 "fracsp"、"bar"、"rdface"、"particle"。

*strName*：字符串型，监测内容（具体见dyna.Monitor接口函数）。

#### 备注

对Genvi当前选择通道中的节点施加监测，目前每个选择只能包含20个全局独立节点。

#### 范例

```javascript
//对当前通道中选择的节点进行x方向位移的监测
dyna.Monitor("block","xdis");
```

<!--HJS_dyna_DrawMonitorPos-->

### DrawMonitorPos方法

#### 说明

绘制监测点的空间位置，在模型视图中用红色圆点表示。

#### 格式定义

dyna.DrawMonitorPos();

#### 参数

#### 备注

（1）  当监测信息设置完毕，在计算之前，可通过该接口进行监测点位置的检查。

（2）  监测点位置图形可通过平台提供的draw.clear()、draw.commit()函数进行清除。

#### 范例

```javascript
dyna.DrawMonitorPos();
```

<!--HJS_dyna_RegionMonitor-->

### RegionMonitor方法

#### 说明

监测某一区域内的节点、弹簧或颗粒的信息。

#### 格式定义

dyna.RegionMonitor(*strType, strName, nCoordType, nValueType, nRegionType, afRegionValue[]*);

#### 参数

*strType*：字符串型，监测类型，可以为以下6种类型之一，"block"、"spring"、"particle" 、"bar" 、"fracsp"、"skwave"。

*strName*：字符串型，监测内容。

*nCoordType*：整型，坐标类型，只能为1或2，1为初始坐标，2为当前坐标。

*nValueType*：整型，监测值的类型，只能为1、2或3，1为区域内所有元素加权平均值，2为区域内所有元素累加值，3为区域内各个元素的监测值。

*nRegionType*：整型，范围的类型，只能为1、2或3。1位box范围，2为sphere范围，3为group范围。

*afRegionValue*：浮点型数组，控制范围的值，如果为box控制，则包含6个元素，分别为X坐标下限、X坐标上限、Y坐标下限、Y坐标上限、Z坐标下限、Z坐标上限（[xLow, xUp, yLow, yUp, zLow, zUp]）；如果为sphere控制，则包含4个元素，依次为半径，原点X、Y、Z的分量（[radius, originX, originY, originZ]）；如果为group，则包含2个元素，为grp1及grp2（[grp1, grp2]）。

#### 备注

（1）"block"、"spring"、"particle" 、"bar" 、"fracsp"、"skwave"的监测内容*strName*，与dyna.Monitor()的描述一致，此处不再赘述。

（2）  *nCoordType*为1时（初始坐标），区域内用于统计的点是保持一致的，计算过程中始终跟踪这些点的变化，无论这些点在计算过程中是否超出了区域（可以认为是某一物质点组的变化，拉格朗日量的变化）；如果为2（当前坐标），区域内用于统计的点是变化的，计算过程中会有不同的点进入区域，也会有点跑出区域（可以认为是监测某一视窗中的变量变化，欧拉量的变化）。

（3）  如果控制范围类型为3（group）时，如果监测类型为"block"、"particle" 、"bar" 、"fracsp"或"skwave"，则grp1及grp2分别表示组号下限及组号上限。如果检测类型为spring，则grp1及grp2分别表示弹簧两侧的组号；如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为grp1及grp2时被选中。如果grp1及grp2均为0，表示接触对两侧块体相同组号时被选中，如果grp1及grp2均为-1，表示接触对两侧块体不同组号时被选中。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分的接触被选中；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面接触被选中。

（4）*nValueType*为3时，监测文件每一行的输出信息分别是监测元素的ID、3个方向的坐标值以及监测信息。

#### 范例

```javascript
//监测X[-1e5, 1d5], Y[9.99, 11], Z[-1e5, 1d5] 区域内单元y方向位移的平均值
dyna.RegionMonitor("block","ydis", 1, 1, 1, [-1e5, 1e5, 9.99, 11, -1e5, 1e5]);
//监测半径2m，原点(2.5,2.6,2.7)所圈定的球形区域内单元x方向位移的平均值
dyna.RegionMonitor("block","xdis", 1, 1, 2, [2.0, 2.5, 2.6, 2.7]);
//监测组号为1的颗粒的X方向的正应力平均值
dyna.RegionMonitor("particle","pa_sxx", 1, 1, 3, [1, 1]);
//若弹簧两侧的单元组号分别为1及2，则监测这类弹簧正应力的平均值
dyna.RegionMonitor("spring","sp_nstress", 1, 1, 3, [1,2]);
//监测X[-1e5, 1d5], Y[9.99, 11], Z[-1e5, 1d5] 区域内冲击波压力的平均值
dyna.RegionMonitor("skwave","sw_pp", 1, 1, 1, [-1e5, 1e5, 9.99, 11, -1e5, 1e5]);
```

<!--HJS_dyna_Plot-->

### Plot方法

#### 说明

在Genvi开发平台的图形窗口中绘制云图，用于呈现单元属性、材料性质、场变量等。

#### 格式定义

dyna.Plot(*strType*, *strName*, <*iflag*>);

#### 参数

strType：字符串型，绘制类型，可以为以下19种类型之一，"Elem"、" Node"、 "PoreSeepage"、"HeatCond"、"ElemFace"、 "DynaBound"、"Interface"、"FSElem"、"FSNode"、"RdFaceElem"、"Bar"、"BarElem"、"BarNode"、"Link"、"TranFace"、"ShockWaveBound"、"Particle"、"SkWave"。

*strName*：字符串型，绘制内容。

与块体模块相关的绘制内容如下：

块体单元信息"Elem"的绘制内容见附表2。

块体节点信息"Node"的绘制内容见附表3。

接触界面信息"Interface"的绘制内容见附表4。

块体单元的面信息"ElemFace"的绘制内容见附表5。

块体孔隙渗流信息"PoreSeepage"的绘制内容见附表6。

裂隙渗流单元信息"FSElem"的绘制内容见附表7（右侧表）。

裂隙渗流节点信息"FSNode"的绘制内容见附表7（左侧表）。

块体热传导信息"HeatCond"的绘制内容见附表8。

杆件信息"Bar"的绘制内容见附表9。

杆件单元信息"BarElem"的绘制内容见附表10。

杆件节点信息"BarNode"的绘制内容见附表11。

连接杆信息"Link"的绘制内容见附表12。

刚性面信息"RdFaceElem"的绘制内容见附表13。

刚性面信息"TranFace"的绘制内容见附表14。

颗粒信息"Particle"的绘制内容见附表15。

块体单元动态载荷条件信息"DynaBound"的绘制内容包括"Velocity"、"Force"、"FaceForce"。

块体冲击波载荷条件信息"ShockWaveBound"的的绘制内容"IfSet"、"Mass"、"BeginTime"、"ExpIndex"、"SoundVel"。

*iflag*：整型，分量序号。大于1的自然数，如果需要显示的量为标量，则值为1，或不填写。

#### 备注

执行该函数后，软件将在结果云图列表中出现"UnivProp"选项，并在该选项的子栏中出现对应的绘图名称*strName*。如果多次调用本函数，*strName*将设定为当前绘制内容的名称，并在列表的尾端增加本次绘图的数据。

#### 范例

```javascript
//绘制单元的内聚力信息，以云图方式展现
dyna.Plot("Elem","Cohesion");
//绘制Y方向的节点位移云图信息（位移分量号从1到3,2号表示Y方向）。
dyna. Plot("Node","Displace", 2);
//绘制冲击波节点X方向的流速
dyna.Plot("SkWave","Velocity",1);
```

<!--HJS_dyna_Print-->

### Print方法

#### 说明

打印全局材料、全局边界条件等统计信息。

#### 格式定义

dyna.Print(*strName [, iTag [, jTag]]*);

#### 参数

*strName*：字符型，统计信息的名称，包括：

"JWLMat"（全局JWL爆源参数）

"LandauMat"（全局朗道爆源参数）

"JCMat"（全局JohnsonCook材料参数）

"MGMat"（全局MieGrueisen材料参数）

"UJMat"（全局遍布节理材料参数）

"TransIsoMat"（全局横观各向同性材料参数）

"CreepMat"（全局Burger蠕变材料参数）

"AirMat"（全局空气材料参数）

"HJCMat"（全局HJC材料参数）

"JH2Mat"（全局JH2材料参数）

"TCKUSMat"（全局TCKUS材料参数）

"MRMat"（全局Mooney Rivlin材料参数）

"SatRockMat"（全局水饱和岩体材料参数）

"HJCKUSMat"（全局HJC-KUS联合材料参数）

"DavidenkovMat"（全局Davidenkov材料参数）

"ByrneDavMat"（全局Byrne-Davidenkov材料参数）

"LeeTarverMat"（全局Lee-Tarver爆源模型材料参数）

"HydroSupportMat"（全局液压支架材料参数）

"TableInfo"（全局表格信息）

"LocalSystemInfo"（局部坐标系信息）

"SimpleHyFracPram"（全局简单水力压裂参数）

"UDFValue"（全局自定义参数）

"DynaVelBound"（全局动态速度边界）

"DynaForceBound"（全局动态力边界）

"DynaFaceForceBound"（全局动态面力边界）

"ElemRotaInfo"（全局单元转动边界信息）

"RFaceRotaInfo"（全局刚性面转动边界信息）

"RFaceRadVelInfo"（全局刚性面径向速度边界信息）

"MonitorInfo"（监测类型、内容、坐标等信息输出）

"FSJetPropInfo"（裂隙渗流注入点流体参数信息输出）

"SpringBoundInfo"（弹簧边界信息输出）

"BlkVol"（满足条件的块体单元体积输出）

"ParVol"（满足条件的颗粒体积输出）

*iTag*、*iTag*：整型，打印的标签号。

#### 备注

（1）  执行该函数后，将在Genvi的本文显示窗口中，自动显示需要打印的统计信息。

（2）  当*strName*为"BlkVol"或"ParVol"时，标签号*iTag*、*iTag*起作用，*iTag*表示组号下限，j*Tag*表示组号上限。当块体单元或颗粒的组号位于组号下限及上限之间时，统计相应体积。

（3）  当打印"BlkVol"或"ParVol"时，如果不写任何标签，则表示所有块体（块体不是空模型且块体不是自由场单元）或颗粒（颗粒不是空模型）的体积均纳入统计范围；当只写一个标签时，表示仅该组号的体积纳入统计范围；当写两个标签时，则表示组号下限及上限范围内的块体或颗粒纳入统计范围。

#### 范例

```javascript
//打印全局的JWL爆源信息
dyna.Print("JWLMat");
//统计所有块体的体积并进行打印
dyna.Print("BlkVol");
//统计组号为1的块体的体积并进行打印
dyna.Print("BlkVol" , 1);
//统计组号在1-10之间的颗粒的体积并进行打印
dyna.Print("ParVol" , 1,10);
```

<!--HJS_dyna_PutStep-->

### PutStep方法

#### 说明

将块体模块或颗粒模块环境中当前时步的计算结果推送至Genvi平台上进行展示。

#### 格式定义

包含两种格式：

dyna.PutStep();

dyna.PutStep(<iStage, iStep, fTime>);

#### 参数

*iStage*：整型，计算阶段号。

*iStep*：整型，计算时步号。

*fTime*：浮点型，当前时步。

#### 备注

（1）如果不输入任何参数，则iStage为0，iStep及fTime为块体模块环境中的全局时步及全局时间。

（2）通过dyna.Solve(<>)、dyna.DynaCycle(<>)及dyna.SuperCal(<>)等内置函数进行求解时，每隔设定的时步（通过idyan.Set(<>)设置"Output_Interval"实现）、或每个求解过程结束，将自动推送结果值Genvi中进行展示。如果用户自定义了求解器及求解过程，需要适时调用本接口进行结果的推送。

#### 范例

```javascript
dyna.PutStep();
dyna.PutStep (0, 1000, 1e-3);
```

<!--HJS_dyna_PutGroup-->

### PutGroup方法

#### 说明

将Dyna Suite环境中当前时步的单元组号推送至Genvi平台上进行展示。

#### 格式定义

包含两种格式：

dyna.PutGroup(<[*strType*]>);

#### 参数

*strType*：字符串型，要推送的单元类型。只能为一下字符串之一，"all\",  \"block\",  \"particle\",  \"rdface\",  \"bar\",  \"fracsp\", \"skwave\" ,\"link"。默认为"all\"。

#### 备注

（1）如果不输入任何参数，则认为所有单元均推送一遍，"all\"。

#### 范例

```javascript
dyna.PutGroup();
dyna.PutGroup("block");
```

<!--HJS_dyna_OutputMonitorData-->

### OutputMonitorData方法

#### 说明

用户开发自己的求解器时，调用该函数可将块体模块或颗粒模块Result文件夹下的"监测信息.dat"文件夹中。

#### 格式定义

dyna.OutputMonitorData();

#### 参数

#### 备注

在每个迭代步调用该函数，每隔设定的监测时步（通过dyna.Set("Monitor_Iter")设定）输出监测信息。

#### 范例

```javascript
dyna.OutputMonitorData ();
```

<!--HJS_dyna_OutputModelResult-->

### OutputModelResult方法

#### 说明

将当前时步内存中的模型结果数据在Result文件夹下存储为其他软件可以读入的文件，同时输出块体、颗粒等模块对应的Save文件。通过dyna.Set(<>)函数设置是否输出相应的文件格式，可输出的格式包括MSR、GiD、Patran、Flac3D、GiD、Ba，以及被块体或颗粒模块调用的Save文件，具体参见表1.2。

#### 格式定义

dyna.OutputModelResult();

#### 参数

#### 备注

该接口函数可用在用户自定义的核心求解流程中，每隔设定时步输出文件；也可以在后处理中，通过dyna.Restore(<>)恢复某一时步结果文件，然后调用该接口导出对应格式文件。

#### 范例

```javascript
dyna.Set("Tecplot_Out 1");
dyna.OutputModelResult();
```

<!--HJS_dyna_ResetGroupName-->

### ResetGroupName方法

#### 说明

重新设置Genvi平台上左侧列表栏中显示的组号的名称。

#### 格式定义

dyna. ResetGroupName (<*sOldName, sNewName*>);

#### 参数

*sOldName*：字符串型，旧组号的名称。

*sNewName*：字符串型，新组号的名称。

#### 备注

设置完毕后，Genvi平台左侧组号将自动更新。

#### 范例

```javascript
dyna.ResetGroupName ("group1", "砂岩");
```

<!--HJS_dyna_GetGroupId-->

### GetGroupId方法

#### 说明

获取某类单元的组号列表。

#### 格式定义

dyna.GetGroupId(<sElemType>);

#### 参数

sElemType：字符串型，单元类型，只能为"block"，"particle"，"bar"，"rdface"，"fracsp"。

#### 备注

返回值为组号列表。

#### 范例

```javascript
var aGrpId = dyna.GetGroupId ("block");
print(aGrpId);
```



<!--HJS_dyna_GetBoundingBox-->

### GetBoundingBox方法

#### 说明

获取某一类或某几类单元的最小、最大坐标（Bounding Box）。

#### 格式定义

dyna.GetBoundingBox([*strType* [, *GroupLow* [, *GroupUp* ] ] ]);

共4种用法。

(1) 所有单元类型所有组均列入统计，计算bounding box。

dyna.GetBoundingBox();

(2) 针对某一单元类型的所有组进行统计，计算bounding box。

dyna.GetBoundingBox(<*strType* >);

(3) 针对某一单元类型的某一组进行统计，计算bounding box。

dyna.GetBoundingBox(<*strType*, *Group* >);

(4) 针对某一单元类型的组号下限与上限之间的单元进行统计，计算bounding box。

dyna.GetBoundingBox(<*strType*, *GroupLow* , *GroupUp*>);



#### 参数

*strType*：字符串型，单元类型，只能为‘’all"，block"，"particle"，"bar"，"rdface"，"fracsp"，"skwave"中的一种；可以不写，默认"all"（即全部类型）。

*GroupLow* ：整型，组号下限。

*GroupUp* ：整型，组号上限。

#### 备注

（1）返回值为边界坐标列表，共6个元素，分别为X坐标下限、X坐标上限、Y坐标下限、Y坐标上限、Z坐标下限、Z坐标上限。

#### 范例

```javascript
var afBoundBox = dyna.GetBoundingBox ("block");
var XCoordMin = afBoundBox[0];
var XCoordMax = afBoundBox[1];
var YCoordMin = afBoundBox[2];
var YCoordMax = afBoundBox[3];
var ZCoordMin = afBoundBox[4];
var ZCoordMax = afBoundBox[5];
```



<!--HJS_dyna_GenDataExport_Set-->

## 通用信息输出设置

信息输出设置中提供了随机参数输出、单元网格输出、单元信息输出、接触面信息输出、块体基本曲线输出、监测信息后处理输出等多个函数，函数列表见表2.5。

<center>表2.5信息输出设置的相关函数</center>

| **序号** | **方法**                | **说明**                                       |
| -------- | ----------------------- | ---------------------------------------------- |
| 1        | GenRandomValue          | 产生一个满足随机分布的实数。                   |
| 2        | GenRandomLines          | 产生随机分布的线段。                           |
| 3        | GenRandomJoints2D       | 产生满足某一特征的二维随机节理。               |
| 4        | ExportSystemEnergy      | 系统能量输出。                                 |
| 5        | ExportMoitorFilePost    | 后处理监测内容输出。                           |
| 6        | ExportSortedDataByGroup | 单元信息、接触面信息、颗粒信息的数据拣选输出。 |
| 7        | ExportSortedDataByCoord | 单元信息、接触面信息、颗粒信息的数据拣选输出。 |

<!--HJS_dyna_GenRandomValue-->

### GenRandomValue方法

#### 说明

产生一个满足某种分布的随机参数。

#### 格式定义

dyna.GenRandomValue(<*sType*, *fPra1*, *fPra2*>);

#### 参数

*sType*：字符串型，随机类型，只能为"uniform"、"normal"、"weibull"之一。

*fPra1*：浮点型，随机参数。

*fPra2*：浮点型，随机参数。

#### 备注

（1）如果分布模式为"uniform"，*fPra1*及*fPra2*分别表示随机参数的下限及上限。

（2）如果分布模式为"normal"（随机公式$y=\mu+\sigma x$, $x=\sum_{n=1}^{12}r_n -6$，$ \mu $期望，$\sigma$标准差，$r_n$为0-1之间均匀分布随机数），*fPra1*及*fPra2*分别表示随机值的期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

（3）如果分布模式为"weibull"，*fPra1*及*fPra2*分别表示威布尔分布的$k$及$\lambda$值，weibull分布概率密度函数为$f(x) = \left\{ \begin{array}{l}
\frac{k}{\lambda }{(\frac{x}{\lambda })^{k - 1}}{e^{ - {{(x/\lambda )}^k}}}\begin{array}{*{20}{c}}
{}&{x \ge 0}
\end{array}\\
0\begin{array}{*{20}{c}}
{}&{}&{}&{}&{}&{x < 0}
\end{array}
\end{array} \right.，$概率为 $F(x) = 1 - {e^{ - {{(x/\lambda )}^k}}}，$$x$为随机变量，$\lambda$>0为比例因子，$k$>0为形状参数（$k$=1为指数分布，$k$=2为瑞利分布），（数值实现时，随机数公式$x = \lambda {( - \ln (u))^{1/k}}\\$  ，其中u为0-1的均匀分布值）。

#### 范例

```javascript
//产生一个满足均匀分布的，下限值为1e4、上限值为1e5的随机值。
dyna. GenRandomValue ("uniform", 1e4, 1e5);
```

<!--HJS_dyna_GenRandomLines-->

### GenRandomLines方法

#### 说明

在设定的空间中随机生成满足某种设定分布的线段。

#### 格式定义

dyna.GenRandomLines(<*TotalNo, x[2], y[2], z[2], RandomTypeL, LPram1, LPram2, RandomTypeA, APram1, APram2*>);

#### 参数

*TotalNo*：随机生成的线段的总数。

*x[2], y[2], z[2]*：Array浮点型，每个Array包含2个分量，分别表示X、Y、Z坐标的下限及上限。

*RandomTypeL*：字符串型，线段长度的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*LPram1*：浮点型，线段长度的随机参数。

*LPram2*：浮点型，线段长度的随机参数。

*RandomTypeA*：字符串型，线段角度的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*APram1*：浮点型，线段角度的随机参数。

*APram2*：浮点型，线段角度的随机参数。

#### 备注

（1）如果分布模式为"uniform"，*fPra1*及*fPra2*分别表示随机参数的下限及上限。

（2）如果分布模式为"normal"（随机公式$y=\mu+\sigma x$ $x=\sum_{n=1}^{12}r_n -6$，$ \mu $期望，$\sigma$标准差，$r_n$为0-1之间均匀分布随机数），*fPra1*及*fPra2*分别表示随机值的期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

（3）如果分布模式为"weibull"，*fPra1*及*fPra2*分别表示威布尔分布的$k$及$\lambda$值，weibull分布概率密度函数为$f(x) = \left\{ \begin{array}{l}
\frac{k}{\lambda }{(\frac{x}{\lambda })^{k - 1}}{e^{ - {{(x/\lambda )}^k}}}\begin{array}{*{20}{c}}
{}&{x \ge 0}
\end{array}\\
0\begin{array}{*{20}{c}}
{}&{}&{}&{}&{}&{x < 0}
\end{array}
\end{array} \right.，$概率为 $F(x) = 1 - {e^{ - {{(x/\lambda )}^k}}}，$$x$为随机变量，$\lambda$>0为比例因子，$k$>0为形状参数（$k$=1为指数分布，$k$=2为瑞利分布），（数值实现时，随机数公式$x = \lambda {( - \ln (u))^{1/k}}\\$  ，其中u为0-1的均匀分布值）。

#### 范例

```javascript
var x = [0,1];
var y = [0,1];
var z = [0,0];
dyna.GenRandomLines(500, x, y, z, "uniform", 0.1,0.1, "uniform", 0, 360);
```

<!--HJS_dyna_GenRandomJoints2D-->

### GenRandomJoints2D方法

#### 说明

在设定的二维空间中随机生成满足某种设定分布的节理线段。

#### 格式定义

dyna.GenRandomJoints2D(<*x[2], y[2], RandomTypeTrace, TraceV[2], RandomTypeGap, GapV[2], RandomTypeAngle, AngleV[2], RandomTypeSpace, SpaceV[2], OriginCoord[2]*>);

#### 参数

*x[2], y[2]*：Array浮点型，每个Array包含2个分量，分别表示X、Y坐标的下限及上限。

*RandomTypeTrace*：字符串型，迹长的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*TraceV[2]*：Array浮点型，包含两个分量，迹长的随机参数。

*RandomTypeGap*：字符串型，空隙的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*GapV[2]*：Array浮点型，包含两个分量，空隙的随机参数。

*RandomTypeAngle*：字符串型，角度的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*AngleV[2]*：Array浮点型，包含两个分量，角度的随机参数。

*RandomTypeSpace*：字符串型，间距的随机类型，只能为"uniform"、"normal"、"weibull"之一。

*SpaceV[2]*：Array浮点型，包含两个分量，间距的随机参数。

*OriginCoord[2]* ：Array浮点型，包含两个分量，节理起算点坐标。

#### 备注

（1）如果分布模式为"uniform"，*fPra1*及*fPra2*分别表示随机参数的下限及上限。

（2）如果分布模式为"normal"（随机公式$y=\mu+\sigma x$ $x=\sum_{n=1}^{12}r_n -6$，$ \mu $期望，$\sigma$标准差，$r_n$为0-1之间均匀分布随机数），*fPra1*及*fPra2*分别表示随机值的期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

（3）如果分布模式为"weibull"，*fPra1*及*fPra2*分别表示威布尔分布的$k$及$\lambda$值，weibull分布概率密度函数为$f(x) = \left\{ \begin{array}{l}
\frac{k}{\lambda }{(\frac{x}{\lambda })^{k - 1}}{e^{ - {{(x/\lambda )}^k}}}\begin{array}{*{20}{c}}
{}&{x \ge 0}
\end{array}\\
0\begin{array}{*{20}{c}}
{}&{}&{}&{}&{}&{x < 0}
\end{array}
\end{array} \right.，$概率为 $F(x) = 1 - {e^{ - {{(x/\lambda )}^k}}}，$$x$为随机变量，$\lambda$>0为比例因子，$k$>0为形状参数（$k$=1为指数分布，$k$=2为瑞利分布），（数值实现时，随机数公式$x = \lambda {( - \ln (u))^{1/k}}\\$  ，其中u为0-1的均匀分布值）。

（4）该接口函数执行完毕后，将在工程文件工作路径下产生名为"RandomJoints2D.dat"的文本文件及AnsysDyna格式的文本文件"Joints2D DynaType.dat"。

（5）生成2D节理时，从OriginCoord点开始，沿着X轴负方向，从右向左绘制。

#### 范例

```javascript
//定义节理施加区域
var x = [0, 100];
var y= [0,100];
//定义随机参数
var TraceV = [10,10];
var GapV=[5,5];
var AngleV=[45,45];
var SpaceV=[10,10];
//定义节理施加起算点
var OriginCoord = [100, 0];
//施加节理
dyna.GenRandomJoints2D(x, y, "uniform", TraceV, "uniform", GapV, "uniform", AngleV, "uniform", SpaceV, OriginCoord);
```

<!--HJS_dyna_ExportSystemEnergy-->

### ExportSystemEnergy方法

#### 说明

将系统（单元、接触面、颗粒等）的重力势能、应变能、动能等输出至对应文件。

#### 格式定义

dyna.ExportSystemEnergy (<*initial_step,interval,number>*);

#### 参数

*initial_step*：整型，初始时步（第一个Save文件的文件名，不含扩展名）

*interval*：整型，间隔时步

*number*：整型，读入文件数量

#### 备注

执行该函数后，首先按照设置调入Result文件夹下自动创建的Save文件，对相应的能量进行统计，最后在当前文件夹下产生"系统能量.dat"的文本文件。

#### 范例

```javascript
//调入100.sav，并间隔200步调入后续save文件（如300.sav、500.sav），共调入10次，统计分析后输出"系统能量.dat"
dyna.ExportSystemEnergy (100,200,10);
```

<!--HJS_dyna_ExportMoitorFilePost-->

### ExportMoitorFilePost方法

#### 说明

对计算过程中未来得及进行时程监测的内容，通过批处理调入Result文件夹下的save文件，进行计算后监测信息的提取。

#### 格式定义

dyna. ExportMoitorFilePost (<*initial_step,interval,number*>);

#### 参数

*initial_step*：整型，初始时步（第一个Save文件的文件名，不含扩展名）

*interval*：整型，间隔时步

*number*：整型，读入文件数量

#### 备注

执行函数前，首先需要通过dyna.Monitor设置需要监测的内容，然后执行本函数。

执行本函数后，首先按照设置调入Result文件夹下自动创建的Save文件，然后根据监测内容的设置提取相应的信息，并在当前文件夹下输出文件名为" PostMonitor.dat"的文本文件。

#### 范例

```javascript
//监测单元Y向应力，每个5000步进行信息提取，共提取10步。
dyna.Monitor("block", "syy", 0.5, 0.5, 0.5);
dyna. ExportMoitorFilePost (5000,5000,10);
```

<!--HJS_dyna_ExportSortedDataByGroup-->

### ExportSortedDataByGroup方法

#### 说明

通过批处理调入Result文件夹下的save文件，并对save文件中的相应数据进行拣选输出。

#### 格式定义

dyna. ExportSortedDataByGroup(<*ExportType*, *IfAverage*, *initial_step*, *interval*, *number*, *GroupLow*, *GroupUP*>);

#### 参数

*ExportType*：字符串型，输出类型，包括"element"、"spring"、"particle"等3类。

*IfAverage*：布尔型，是否对当前时步的信息进行平均化输出。

*initial_step*：整型，初始时步（第一个Save文件的文件名，不含扩展名）

*interval*：整型，间隔时步

*number*：整型，读入文件数量

*GroupLow*、*GroupUP*，整型，组号的下限及上限。

#### 备注

执行本函数后，首先按照设置调入Result文件夹下自动创建的Save文件，然后对位于组号下限及上限的信息进行处理，并在当前文件夹下输出文件名为" SortResult.txt"的文本文件。该文本文件中的信息包括：坐标信息、位移信息、应力信息、损伤信息等；如果*IfAverage*为true，则对所有单元（弹簧、颗粒）进行信息平均后输出，每个时步一个值；如果*IfAverage*为false，则每个单元单独输出。

该函数可用于室内岩石力学实验时，统计模型的平均应力应变曲线时用。

#### 范例

```javascript
//对组号1-10的单元信息进行拣选输出。
dyna. ExportSortedDataByGroup("element", true, 5000,5000,10, 1, 10);
```

<!--HJS_dyna_ExportSortedDataByCoord-->

### ExportSortedDataByCoord方法

#### 说明

通过批处理调入Result文件夹下的save文件，并对save文件中的相应数据进行拣选输出。

#### 格式定义

dyna. ExportSortedDataByCoord(<*ExportType*, *IfAverage*, *initial_step*, *interval*, *number*, *x[2], y[2], z[2]*>);

#### 参数

*ExportType*：字符串型，输出类型，包括"element"、"spring"、"particle"等3类。

*IfAverage*：布尔型，是否对当前时步的信息进行平均化输出。

*initial_step*：整型，初始时步（第一个Save文件的文件名，不含扩展名）

*interval*：整型，间隔时步

*number*：整型，读入文件数量

*x[2],y[2],z[2]*：Array浮点型，包含两个分量，坐标下限及上限。

#### 备注

执行本函数后，首先按照设置调入Result文件夹下自动创建的Save文件，然后对坐标范围内的信息进行处理，并在当前文件夹下输出文件名为" SortResult.txt"的文本文件。该文本文件中的信息包括：坐标信息、位移信息、应力信息、损伤信息等；如果*IfAverage*为true，则对所有单元（弹簧、颗粒）进行信息平均后输出，每个时步一个值；如果*IfAverage*为false，则每个单元单独输出。

该函数可用于室内岩石力学实验时，统计模型的平均应力应变曲线时用。

#### 范例

```javascript
//对组号1-10的单元信息进行拣选输出。
x=new Array(-10,10);
y=new Array(-10,10);
z=new Array(-10,10);
dyna. ExportSortedDataByCoord("spring", true, 5000, 5000, 10, x, y, z);
```

<!--HJS_dyna_SecDevelop_Function-->

## 二次开发的接口函数

二次开发所用到的接口函数如表2.6所示。

<center>表2.6二次开发所用到的接口函数</center>

| 序号 | 函数名       | 说明                                                         |      |
| ---- | ------------ | ------------------------------------------------------------ | ---- |
| 1    | LoadUDF      | 加载动态链接库。                                             |      |
| 2    | SetUDFValue  | 设置二次开发中需要中JavaScript接口中传入的参数。             |      |
| 3    | RunUDFCmd    | 运行动态链接库中的命令流。                                   |      |
| 4    | RunUDFCmdAdv | 运动动态链接库中的命令流，高级方式，包含参数输入、返回。     |      |
| 5    | FreeUDF      | 释放动态链接库。                                             |      |
| 6    | BeforeCal    | 核心计算前，进行必要的信息初始化。                           |      |
| 7    | AfterCal     | 计算结束后的一些信息处理。                                   |      |
| 8    | Solver       | 单次迭代步求解，包含了块体、颗粒、杆件等所有模块，并包含时间步累加。 |      |

<!--HJS_dyna_LoadUDF-->

### LoadUDF方法

#### 说明

加载用户自定义的动态链接库文件（文件名为*.dll）。

#### 格式定义

dyna. LoadUDF(*dllName*);

#### 参数

*dllName*：字符串型，动态链接库的路径及文件名。

#### 备注

#### 范例

```javascript
dyna.LoadUDF（"CustomModel.dll");
```

<!--HJS_dyna_SetUDFValue-->

### SetUDFValue方法

#### 说明

设置用户自定义本构的材料参数。

#### 格式定义

dyna. SetUDFValue(*afValue*);

#### 参数

*afValue*：Array浮点型，用户自定义本构的材料参数，可以包含多个参数。

#### 备注

该浮点型数组为软件中的全局变量。用户通过该接口函数设置相应自定义材料参数，然后可在CustomModel二次开发程序样本的自定义单元本构或界面本构中获取该参数数组，从而实现了用户自定义本构参数的输入。

#### 范例

```javascript
ja//设置用户自定义本构模型中所需要的参数
var afValue = new Array(3e10,0.25,3e6,1e6,30,5)
dyna. SetUDFValue（afValue);
```

<!--HJS_dyna_RunUDFCmd-->

### RunUDFCmd方法

#### 说明

运行用户自定义的命令流。

#### 格式定义

dyna. RunUDFCmd(*sCmd*);

#### 参数

*sCmd*：字符串型，用户自定义的命令流。

#### 备注

运行该接口函数后，软件将会自动调用CustomModel二次开发程序样本中的UserDefFunction_Execute函数。用户可在该函数中对输入的字符串进行判断，针对不同的字符串进行不同的操作，从而实现了用户自定义命令流的制作。

#### 范例

```javascript
//运行用户自定义命令流，调用CustomModel二次开发程序样本中的求两点距离的函数。
dyna. RunUDFCmd("CalDist 0.0 0.0 0.0 10.0 10.0 0.0");
```

<!--HJS_dyna_RunUDFCmdAdv-->

### RunUDFCmdAdv方法

#### 说明

运行用户自定义的命令流，可传入参数。

#### 格式定义

dyna. RunUDFCmdAdv(*sCmd [,aPara]*);

#### 参数

*sCmd*：字符串型，用户自定义的命令流。

*aPara*：Array浮点数组型，元素个数不限。

#### 备注

（1）运行该接口函数后，软件将会自动调用CustomModel二次开发程序样本中的UserDefAdvFunction_Execute函数。用户可在该函数中对输入的字符串进行判断，针对不同的字符串进行不同的操作，从而实现了用户自定义命令流的制作。

（2）返回值为浮点型，用户可根据返回的浮点值进行后续的操作。

#### 范例

```javascript
//运行用户自定义命令流，调用CustomModel二次开发程序样本中的求两点距离的函数。
var fdist = dyna. RunUDFCmdAdv("CalDist", [0, 0, 0, 10, 10, 0]);
```

<!--HJS_dyna_FreeUDF-->

### FreeUDF方法

#### 说明

卸载已经加载的动态链接库。

#### 格式定义

dyna. FreeUDF();

dyna. FreeUDF(*dllName*);

#### 参数

*dllName*：字符串型，需要卸载的动态链接库名称，目前只能为"CustomModel"或"CustomModel.dll"。

如果不写动态链接库名称，默认卸载CustomModel动态链接库。

#### 备注

#### 范例

```javascript
//卸载CustomModel.dll动态链接库
dyna. FreeUDF("CustomModel");
dyna. FreeUDF();
```

<!--HJS_dyna_BeforeCal-->

### BeforeCal方法

#### 说明

计算前信息的初始化。

#### 格式定义

dyna. BeforeCal();

####  参数

（1）用户自己开发核心求解器时，需要在核心迭代之前调用该函数，执行必要的初始化操作。

（2）返回0，初始化成功；返回-1，初始化失败。

#### 备注

#### 范例

```javascript
var iflag = dyna. BeforeCal ();
```

<!--HJS_dyna_AfterCal-->

### AfterCal方法

#### 说明

计算结束后的一些信息处理。

#### 格式定义

dyna. AfterCal();

####  参数

（1）用户自己开发核心求解器时，需要在迭代之后调用该求解器；主要用于关闭本阶段求解的监测信息文本文件及设置并行数量。

（2）返回0，执行成功；返回-1，执行失败。

#### 备注

#### 范例

```javascript
var iflag = dyna. AfterCal();
```

<!--HJS_dyna_Solver-->

### Solver方法

#### 说明

单一迭代步求解，包括块体、颗粒、杆件、刚性面等多个模块，并包含时步及时间的累加，但不包含云图输出、监测信息输出。

#### 格式定义

dyna. Solver();

#### 参数

#### 备注

（1）单步调用，执行一个迭代步的求解。

（2）返回值为浮点型，为系统最大不平衡率。

#### 范例

```javascript
var fUnBal = dyna.Solver();
```

