<!--HJS_mpm_interfacefun-->

## MPM接口函数

MPM对象（mpm）为用户提供了物质点法的背景网格设定、背景网格显示及本构模型设定等功能，具体见表4.4。

<center>表4.4 mpm接口函数列表</center>

| **序号** | **方法**        | **说明**                             |
| -------- | --------------- | ------------------------------------ |
| 1        | SetBackGrid     | 设置MPM的背景网格                    |
| 2        | SetModelByGroup | 设置MPM的本构模型                    |
| 3        | DrawBackGrid    | 显示MPM背景网格的外边界              |
| 4        | SetFailCond     | 设置MPM计算过程中的材料失效条件      |
| 5        | SetKGVByGroup   | 单独设置体积模量、剪切模量及动力粘度 |
| 6        | Solver          | 核心求解，1个迭代步                  |

**注：**

（1） **启用MPM模块，必须通过dyna.Set(<>)接口函数，将"Particle_Cal_Type"设定为4。**

（2） **进行MPM计算时，必须要设定背景网格，否则将无法进行计算。**

（3） **MPM方法使用的粒子，即为pdyna生成或导入的颗粒。**

MPM对应的本构模型包括：线弹性模型、Drucker-Prager模型、Mohr-Coulomb模型、考虑应变软化效应的Mohr-Coulomb模型、考虑粘性效应的Mohr-Coulomb模型、流体模型、JohnsonCook模型、JWL爆源模型、空气绝热膨胀模型、朗道爆源模型、HJC模型、JH2模型、TCK模型、KUS模型、Young模型、自定义模型。具体如表4.5。

表4.5 颗粒的本构模型及描述

| **模型名称**                       | **对应字符串** | **对应编号** | **关联命令及释义**                                           |
| ---------------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| 线弹性模型                         | "linear"       | 1            | 通过pdyna.SetMat…系列函数设置材料参数。                      |
| Drucker-Prager模型                 | "DP"           | 2            | 通过pdyna.SetMat…系列函数设置材料参数。<br/>通过dyna.Set函数设置"DP_Model_Option"，可以设置DP模型的三种形式（内部适应、等面积、外部适应）。 |
| Mohr-Coulomb模型                   | "MC"           | 3            | 通过pdyna. SetMat…系列函数设置材料参数。                     |
| 考虑应变软化效应的Mohr-Coulomb模型 | "SoftenMC"     | 4            | 通过pdyna. SetMat…系列函数设置材料参数。 <br/>通过dyna.Set函数设置"Block_Soften_Value"，可以设置体积膨胀极限应变及等效剪切极限应变；达到体积膨胀应变极限，抗拉强度为0；达到等效剪切极限应变，粘聚力为0。 |
| 考虑粘性效应的Mohr-Coulomb模型     | "ViscMC"       | 5            | 通过pdyna.SetMat…系列函数设置材料参数。<br/>通过mpm.SetKGVByGroup接口函数设置独立的体积模量、剪切模量及动力粘度。 |
| 流体模型                           | "Fluid"        | 6            | 通过pdyna.SetMat…系列函数设置材料参数。<br/>通过mpm.SetKGVByGroup接口函数设置独立的体积模量、剪切模量及动力粘度（此时剪切模量不重要）。 |
| JohnsonCook模型                    | "JC"           | 7            | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna.SetJCMat、pdyna.BindJCMat、pdyna.SetMGMat、pdyna.BindMGMat设置全局的JohnsonCook及MieGrueisen参数，并与颗粒进行关联。 |
| JWL爆源模型                        | "JWL"          | 8            | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna. SetJWLSource设置全局的JWL爆源模型参数、通过函数pdyna. BindJWLSource将全局参数与颗粒关联。 |
| 空气绝热膨胀模型                   | "Air"          | 9            | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna. SetAirMat设置全局的空气模型参数、通过函数pdyna. BindAirMat将全局参数与颗粒关联。 |
| 朗道爆源模型                       | "Landau"       | 10           | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna. SetLandauSource设置全局的朗道爆源模型参数、通过函数pdyna. BindLandauSource将全局参数与颗粒关联。 |
| HJC模型                            | "HJC"          | 11           | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna. SetHJCMat设置全局的HJC模型参数、通过函数pdyna. BindHJCMat将全局参数与颗粒关联。 |
| JH2模型                            | "JH2"          | 12           | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna. SetJH2Mat设置全局的JH2模型参数、通过函数pdyna. BindJH2Mat将全局参数与颗粒关联。 |
| TCK模型                            | "TCK"          | 13           | 通过pdyna.SetMat…系列函数设置基础材料参数。<br/>通过pdyna. SetTCKUSMat设置全局的TCKUS模型参数、通过函数pdyna. BindTCKUSMat将全局参数与颗粒关联。 |
| KUS模型                            | "KUS"          | 14           | 通过pdyna.SetMat…系列函数设置基础材料参数。<br/>通过pdyna. SetTCKUSMat设置全局的TCKUS模型参数、通过函数pdyna. BindTCKUSMat将全局参数与颗粒关联。 |
| Young模型                          | "Young"        | 15           | 通过pdyna.SetMat…系列函数设置基础材料参数。等效拉伸应变由抗拉强度及弹性模量计算获得。<br>通过dyna.Set函数设置"Block_Soften_Value"，设置Young模型中损伤因子计算时的系数及指数，第一个为系数（一般为105~106量级），第二个为指数（一般为1-3）。 |
| 自定义模型                         | "Custom"       | 1024         | 通过dyna.LoadUDF调入动态链接库。<br/> 通过dyna.SetUDFValue函数设置用户自定义的全局参数，供自定义本构模型使用。 |

**注：**

（1）**上表中7-14号模型均需要设置全局的材料参数，然后将全局材料参数序号与mpm颗粒的组号进行关联。**

（2）**pdyna与blockdyna公用相同的全局材料列表，即通过pdyna设置全局材料后，blockdyna可以直接使用，不需要blockdyna再设置一遍，反之亦然。**



<!--HJS_mpm_SetBackGrid-->

### SetBackGrid方法

#### 说明

设置MPM方法的背景网格。

#### 格式定义

mpm.SetBackGrid (< *iType, fLength, afMinCoord[3], aiNoDiv[3]* >);

#### 参数

*iType*：整型，背景网格的类型，只能2或3，表示二维及三维。如果颗粒为二维颗粒，则类型号为2，如果为三维颗粒，则类型号为3。

*fLength*：浮点型，背景网格的尺寸，大于0（单位：m）。

*afMinCoord[3]*：Array浮点型，包含3个分量，表示背景网格最小点坐标（单位：m）。如果为二维情况，则第三个分量为0。

*aiNoDiv[3]*：Array整型，包含3个分量，表示X、Y、Z三个方向的背景网格个数（大于等于0）。如果为二维情况，则第三个分量为0。

#### 备注

背景网格创建后，将自动在图形显示区显示出背景网格的外边界，如果想去掉该边界，则通过draw.clear()及draw.commit()实现。如果想再次绘制该边界，可通过mpm.DrawBackGrid()实现。

#### 范例

```javascript
//设置二维背景网格，网格尺寸为1cm，最小点坐标(-0.3,-0.3,0)，三个方向分割数为(60,60,0)
mpm.SetBackGrid(2,0.01, [-0.3,-0.3,0], [60, 60, 0]);
```

<!--HJS_mpm_SetModelByGroup-->

### SetModelByGroup方法

#### 说明

当颗粒组号位于组号下限与上限之间，设置mpm的本构模型。

#### 格式定义

mpm.SetModelByGroup(<*sModelName*, *groupLow*, *groupUp*>);

#### 参数

*sModelName*：字符串型，mpm的本构模型，必须为"linear"、"DP"、"MC"、"SoftenMC"、"ViscMC"、"Fluid"、"JC"、"JWL"、"Air"、"Landau"、"HJC"、"JH2"、"TCK"、"KUS"、"Young"、"Custom"其中之一。

*groupLow*，*groupUp*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
//组号在1-11之间的颗粒对应的本构模型设定为线弹性模型
mpm.SetModelByGroup("linear", 1,11);
```

<!--HJS_mpm_DrawBackGrid-->

### DrawBackGrid方法

#### 说明

在绘图区绘制背景网格。

#### 格式定义

mpm.DrawBackGrid (<*iRed, iGreen, iBlue*>);

#### 参数

*iRed, iGreen, iBlue*：整型，RGB三色值，只能为0-255之间。

#### 备注

如果想去掉显示的背景网格，可通过draw.clear()及draw.commit()实现。

#### 范例

```javascript
mpm. DrawBackGrid (255, 0, 0);
```

<!--HJS_mpm_SetFailCond-->

### SetFailCond方法

#### 说明

设置MPM计算过程中材料的失效条件。

#### 格式定义

mpm.SetFailCond (*sType [, aPara[] [,iGrp [,jGrp]] ]*;

包含以下四种形式：

mpm.SetFailCond(*sType*);

mpm.SetFailCond(*sType, aPara*);

mpm.SetFailCond(*sType, aPara,iGrp*);

mpm.SetFailCond(*sType, aPara,iGrp,jGrp*);

#### 参数

*sType*：字符串型，失效条件类型，只能为"none"、 "PlaStrain" 、"TotStrain"，默认为"none"。

*aPara[]*：Array浮点型，分量个数及含义按照失效条件而定。

*iGrp**、**jGrp*：整型，组号下限及上限（若不写组号，表示适用于全部粒子）。

#### 备注

（1） 如果失效条件为"none"，则表示不考虑失效条件，*aPara*不需要写。

（2） 如果失效条件为"PlaStrain"，表示依据等效塑性剪应变及最大塑性拉应变进行失效判断。如果粒子的塑性应变超过设定值，则判定该粒子失效。此时*aPara*包含2个参数，第一个参数为临界塑性剪应变，第二个值为临界最大塑性拉应变。

（3） 如果失效条件为"TotStrain "，表示依据总剪应变及最大总拉应变进行失效判断。如果粒子的总应变超过设定值，则判定该粒子失效。此时*aPara*包含2个参数，第一个参数为临界总剪应变，第二个值为临界最大总拉应变。

（4） 一旦背景网格被判定失效，则当前状态下关联至该背景网格的粒子的强度参数将设置为0，同时标记该粒子为破坏粒子。

#### 范例

```javascript
mpm. SetFailCond ("none");
mpm. SetFailCond ("PlaStrain", [3e-2, 1e-2]);
mpm. SetFailCond ("PlaStrain", [3e-2, 1e-2], 1);
mpm. SetFailCond ("PlaStrain", [3e-2, 1e-2], 1,5);
```



<!--HJS_mpm_SetKGVByGroup-->

### SetKGVByGroup方法

#### 说明

当颗粒组号位于组号下限与上限之间，单独设置mpm的体积模量、剪切模量及动力粘度。

#### 格式定义

mpm.SetKGVByGroup(<*K, G, V,* *groupLow*, *groupUp*>);

#### 参数

*K， G， V*：浮点型，分别表示体积模量（单位：Pa）、剪切模量（单位：Pa）及动力粘度（单位：Pa.s）。

*groupLow*，*groupUp*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
//组号在1-11之间的颗粒设定体积模量、剪切模量及动力粘度
mpm.SetKGVByGroup(2.1e9, 0.0, 1e-3, 1,11);
```

<!--HJS_mpm_Solver-->

### Solver方法

#### 说明

MPM核心求解器，一个迭代步的求解。

#### 格式定义

mpm.Solver();

#### 参数

#### 备注

#### 范例

```javascript
//进行一步的mpm求解
mpm.Solver();
```

