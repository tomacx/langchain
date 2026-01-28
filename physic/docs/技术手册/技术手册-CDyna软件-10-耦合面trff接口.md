<!--HJS_trff_interfacefun-->

## 耦合面接口函数

耦合面对象（trff）主要用于实现两个不相关（网格不共节点）的实体单元之间进行力、位移等方面的耦合，具体的耦合方式为罚函数耦合。本方法主要适用于当一个实体嵌入另外一个实体内部，网格不共节点，但又想让两者发生力和位移的传递而设置的（如桩与地层的耦合、实体锚杆与围岩的耦合等）。当所设定的耦合面位移某一实体的内部，即可建立该耦合面与实体之间的插值关系，从而实现力和位移的传递。接口函数具体见表4.7。

<center>表4.7杆件接口函数列表</center>

<table>    <tr>        <th>序号</th>        <th>方法</th>        <th>说明</th>      </tr >    <tr >        <td>1</td>        <td>CrtFace</td>        <td>设置耦合面</td>    </tr>    <tr>        <td>2</td>        <td>SetModel</td>        <td>设置耦合面与目标单元间的耦合本构</td>    </tr>    <tr>        <td>3</td>        <td>SetMat</td>        <td rowspan="2">设置耦合参数</td>    </tr>    <tr>        <td>4</td>        <td>SetMatByCoord</td>    </tr>    <tr>        <td>5</td>        <td>GetValue</td>        <td>获取耦合面参数</td>    </tr>    <tr>        <td>6</td>        <td>SetValue</td>        <td>设置耦合面参数</td>    </tr>    <tr>        <td>7</td>        <td>Solver</td>        <td>耦合面单独求解器</td>    </tr></table>

**注：耦合面必须为单元的自由面，某单元的自由面包含N个节点，则该单元面共创建N个耦合面，即每个面点为一个耦合面单元**。

耦合面与目标单元间的耦合本构如表4.8所示。

<center>表4.8 接触面对应的本构模型</center>

| **模型名称**               | **对应字符串** | **对应编号** | **关联命令及释义**                                           |
| -------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| 空模型                     | "none"         | **0**        | 通过SetMat…系列函数设置材料参数。                            |
| 线弹性模型                 | "linear"       | 1            | 通过SetMat…系列函数设置材料参数。                            |
| Mohr-Coulomb脆性断裂模型   | "  brittleMC"  | 2            | 通过SetMat…系列函数设置材料参数。                            |
| Mohr-Coulomb理想弹塑性模型 | "idealMC"      | 3            | 通过SetMat…系列函数设置材料参数。                            |
| Mohr-Coulomb应变软化模型   | "SSMC"         | 4            | 通过blkdyn. SetIMat…系列函数设置材料参数。通过dyna.Set函数设置" Interface_Soften_Value"，可以设置拉伸极限应变及剪切极限应变；达到拉伸极限应变，抗拉强度为0；达到剪切极限应变，粘聚力为0。通过dyna.Set命令设置"Indep_CharL"作为计算特征应变的特征长度，默认为1.0。 |

<!--HJS_trff_CrtFace-->

### CrtFace方法

#### 说明

创建耦合面，包含3种调用形式。

#### 格式定义

模型中所有块体的自由面均设置为耦合面。

trff.CrtFace ();

模型中某一个组号块体的自由面设置为耦合面。

trff.CrtFace (<*iGrp*>);

模型中位于组号下限与上限之间的块体的自由面设置为耦合面。

trff.CrtFace (<*iGrp, jGrp*>);

#### 参数

*iGrp, jGrp*：整型，块体组号。

#### 备注

#### 范例

```java
//若单元的组号位于1-10之间，则将这些单元的自由面设置为耦合面
trff.CrtFace (1, 10);
```

<!--HJS_trff_SetModel-->

### SetModel方法

#### 说明

设置耦合面的本构模型，包含3种调用形式。

#### 格式定义

所有的耦合面设置为该本构模型。

trff.SetModel(<*strModel*>);

耦合面所在的母块体的组号为设定组号，设置为对应的本构。

trff.SetModel(<>*strModel, iGrp*);

耦合面所在的母块体的组号位于组号下限及上限之间，设置为对应的本构。

trff. SetModel(<*strModel, iGrp, jGrp*>);

#### 参数

*strModel*：字符串型，本构名称。只能为"none"、"linear"、"brittleMC"、"ldealMC"、"SSMC"之一。

*iGrp, jGrp*：整型，块体组号。

#### 备注

#### 范例

```java
//若耦合面的母块体的组号位于1-10之间，则将这些耦合面的本构设置为脆性断裂的MC模型
trff.SetModel("idealMC", 1, 10);
```

<!--HJS_trff_SetMat-->

### SetMat方法

#### 说明

设置耦合面的本构参数，包含3种调用形式。

#### 格式定义

所有的耦合面设置为对应的材料参数。

trff.SetMat(<*fKn, fKt, fFriction, fCohesion, fTension, fCompression*>);

耦合面所在的母块体的组号为设定组号，设置为对应的材料参数。

trff.SetMat(<*fKn, fKt, fFriction, fCohesion, fTension, fCompression, iGrp*>);

耦合面所在的母块体的组号位于组号下限及上限之间，设置为对应的材料参数。

trff.SetMat(<*fKn, fKt, fFriction, fCohesion, fTension, fCompression, iGrp, jGrp*>);

#### 参数

*fKn*：浮点型，单位面积法向刚度（单位：Pa/m）。

*fKt*：浮点型，单位面积切向刚度（单位：Pa/m）。

*fFriction*：浮点型，内摩擦角（单位：度）。

*fCohesion*：浮点型，粘聚力（单位：Pa）。

*fTension*：浮点型，抗拉强度（单位：Pa）。

*fCompression*：浮点型，抗压强度（单位：Pa）。

*iGrp, jGrp*：整型，块体组号。

#### 备注

（1）设耦合面仅允许发生拉伸破坏及摩擦破坏，则耦合面的抗压强度需要设置一个大值，不让其破坏。某些情况下耦合面的抗压能力有一个限值（如桩的端面承受的压力），此时需要设定一个真实的抗压强度值*fCompression*。

（2）本材料参数的施加命令必须在耦合面创建命令之后执行，若耦合面不存在目标耦合块体，则抗拉强度及粘聚力自动设置为0。

#### 范例

```java
//若耦合面的母块体的组号位于1-10之间，则将这些耦合面设置为对应的材料参数
trff.SetMat(1e10, 1e10, 35, 3e4, 1e4, 1, 10);
```

<!--HJS_trff_SetMatByCoord-->

### SetMatByCoord方法

#### 说明

根据耦合面的面心坐标设置耦合面的本构参数。

#### 格式定义

trff.SetMat(<*fKn, fKt, fFriction, fCohesion, fTension, fCompression, fx0, fx1, fy0, fy1, fz0, fz1>*);

#### 参数

*fKn*：浮点型，单位面积法向刚度（单位：Pa/m）。

*fKt*：浮点型，单位面积切向刚度（单位：Pa/m）。

*fFriction*：浮点型，内摩擦角（单位：度）。

*fCohesion*：浮点型，粘聚力（单位：Pa）。

*fTension*：浮点型，抗拉强度（单位：Pa）。

*fCompression*：浮点型，抗压强度（单位：Pa）。

*fx0, fx1*：浮点型，面心X坐标的下限及上限（单位：m）。

*fy0, fy1*：浮点型，面心Y坐标的下限及上限（单位：m）。

*fz0, fz1*：浮点型，面心Z坐标的下限及上限（单位：m）。

#### 备注

（1）设耦合面仅允许发生拉伸破坏及摩擦破坏，则耦合面的抗压强度需要设置一个大值，不让其破坏。某些情况下耦合面的抗压能力有一个限值（如桩的端面承受的压力），此时需要设定一个真实的抗压强度值*fCompression*。

（2）本材料参数的施加命令必须在耦合面创建命令之后执行，若耦合面不存在目标耦合块体，则抗拉强度及粘聚力自动设置为0。

#### 范例

```java
//若耦合面面心X方向坐标为0时，则将这些耦合面设置为对应的材料参数
trff.SetMat(1e10, 1e10, 35, 3e4, 1e4, -0.001, 0.001, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_trff_GetValue-->

### GetValue方法

#### 说明

获取某一ID序号对应的耦合面信息。

#### 格式定义

trff. GetValue (*IDNo*, *msValueName*[, *iflag*]);

#### 参数

*IDNo*：整型，耦合面的ID号，从1开始。

*msValueName*：字符串型，可供获取的节点信息**，具体见附表14。**

*iflag*：整型，获取变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```java
//获取第100号耦合面单元的本构模型ID号
var xdis = trff.GetValue(100, "Model");
//获取第10号耦合面单元的全局Y方向的耦合力
var xdis = trff.GetValue(10, "GlobCopForce", 2);
```

<!--HJS_trff_SetValue-->

### SetValue方法

#### 说明

设置某一ID序号对应的耦合面单元信息。

#### 格式定义

trff. SetValue (*IDNo*, *msValueName, fValue* [,*iflag*]);

#### 参数

*IDNo*：整型，耦合面单元的ID号，从1开始。

*msValueName*：字符串型，可供设置的单元信息**，具体见附表14**。

*fValue*：需要设置的值。

*iflag*：整型，设置变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```java
///设置第100号耦合面单元的局部坐标系下Y方向的耦合位移为0.0
trff.SetValue(100, "LocalDeltDisp", 0.0, 2);
```

<!--HJS_trff_Solver-->

### Solver方法

#### 说明

耦合面核心求解器（每一迭代步使用）。

#### 格式定义

trff.Solver()

#### 参数

无。

#### 备注

#### 范例

```java
trff.Solver();
```



