

<!--HJS_poresp_interfacefun-->

## 孔隙渗流接口函数

孔隙渗流对象（poresp）中包含了渗流材料性质设置、渗流条件施加等多种接口函数，具体见表4.1。单独计算孔隙渗流问题时，导入网格可采用接口函数blkdyn.ImportGrid(<>)。

<center>表4.1 孔隙渗流接口函数列表</center>

| **序号** | **方法**                      | **说明**                                                  |
| -------- | ----------------------------- | --------------------------------------------------------- |
| 1        | SetPropByCoord                | 通过坐标对某一范围内的单元施加渗流参数。                  |
| 2        | SetPropByGroup                | 通过组对某一范围内的单元施加渗流参数。                    |
| 3        | SetPropByCoordAndGroup        | 通过坐标和组对某一范围内的单元施加渗流参数。              |
| 4        | SetLangmuirPropByCoord        | 通过坐标施加具有吸附-解吸附特性的气体参数（Langmuir参数） |
| 5        | SetLangmuirPropByGroup        | 通过组施加具有吸附-解吸附特性的气体参数（Langmuir参数）   |
| 6        | SetSinglePropByCoord          | 通过坐标对某一范围内的单元单独施加某一个流体参数。        |
| 7        | SetSinglePropByGroup          | 通过组对某一范围内的单元单独施加某一个流体参数。          |
| 8        | SetSinglePropByCoordAndGroup  | 通过坐标和组对某一范围内的单元单独施加某一个流体参数。    |
| 9        | ApplyConditionByCoord         | 通过坐标对某一范围内的单元施加压力或流量边界条件          |
| 10       | ApplyConditionByCoordAndGroup | 通过坐标和组对某一范围内的单元施加压力或流量边界条件      |
| 11       | ApplyConditionByPlane         | 通过平面对某一范围内的单元施加压力或流量边界条件          |
| 12       | ApplyConditionByCylinder      | 通过空心圆柱体对某一范围内的单元施加压力或流量边界条件    |
| 13       | ApplyConditionBySphere        | 通过空心球对某一范围内的单元施加压力或流量边界条件        |
| 14       | ApplyConditionBySel           | 根据Genvi平台选择的结果施加压力或流量边界条件             |
| 15       | ApplyBoundCondition           | 根据输入单位法矢量确定施加条件的自由边界面。              |
| 16       | ApplyDynaConditionByCoord     | 根据坐标施加动态压力及流量边界。                          |
| 17       | ApplyDynaConditionBySphere    | 根据球体施加动态压力及流量边界。                          |
| 18       | ApplyDynaConditionByCylinder  | 根据圆柱施加动态压力及流量边界。                          |
| 19       | ApplyDynaBoundCondition       | 根据输入单位法矢量确定施加动态边界条件的自由边界面。      |
| 20       | InitConditionByCoord          | 通过坐标对某一范围内的单元初始化压力及饱和度              |
| 21       | InitConditionByCoordAndGroup  | 通过坐标和组对某一范围内的单元初始化压力及饱和度          |
| 22       | InitConditionByPlane          | 通过平面对某范围内的单元初始化压力及饱和度                |
| 23       | InitConditionByCylinder       | 通过空心圆柱体对某范围内的单元初始化压力及饱和度          |
| 24       | InitConditionBySphere         | 通过空心球对某范围内的单元初始化压力及饱和度              |
| 25       | InitConditionBySel            | 根据Genvi平台选择的结果初始化压力及饱和度                 |
| 26       | GetNodeValue                  | 获得孔隙渗流节点信息                                      |
| 27       | SetNodeValue                  | 设置孔隙渗流节点信息                                      |
| 28       | Solver                        | 孔隙渗流核心求解器，每一迭代步使用。                      |
| 29       | CalNodeSatAndPresLiquid       | 根据节点液体体积改变计算节点压力                          |
| 30       | CalNodeSatAndPresLiquidBiot   | 考虑biot效应，根据节点液体体积改变计算节点压力            |
| 31       | CalNodePressGas               | 根据节点质量改变计算节点气体压力                          |
| 32       | CalElemFlowDarcy              | 基于达西定律，根据节点压力计算单元流速                    |
| 33       | CalContactFlowTransfer        | 计算接触面上的流量传递                                    |
| 34       | AddBoundPresToSolid           | 将流体边界的压力施加于固体表面                            |
| 35       | CalAbsorbanceAndErosion       | 计算单元吸水弱化及溶蚀过程                                |
| 36       | CalDynaBound                  | 计算渗流动态边界                                          |

注：孔隙渗流单元与固体单元共用网格；孔隙渗流的材料参数及场量，除了渗透系数外，其余参数均存储于节点上。

如希望进行孔隙渗流的计算，则应该网格创建或导入前，通过dyna.Set(<>)设置"Config_PoreSeepage"包含孔隙渗流计算功能。在计算的任何阶段，通过设置" PoreSeepage_Cal"确定是否进行孔隙渗流计算，设置"If_Biot_Cal"确定是否进行比奥固结过程的计算，设置"Seepage_Mode"确定孔隙渗流的计算模式（液体渗流或气体渗流），设置"If_Langmuir_Cal"确定气体渗流时是否考虑气体吸附解吸效应，设置"If_Renew_Porosity"确定计算时是否更新孔隙率，设置"If_Flow_Bound_Sat"确定是否流量边界保持饱和度为1，设置"Flow_Bound_Height_Limit"确定流量边界时是否限制最大水位高度，设置"If_Contact_Transf_PP"确定接触面是否可以透传流体，设置"If_Cal_AbsorbErosion"确定是否考虑吸水溶蚀效应，设置"PoreSP_Bound_To_Solid"确定孔隙渗流边界条件（压力或流量）处的孔隙压力是否作为固体边界施加于固体表面。



<!--HJS_poresp_SetPropByCoord-->

### SetPropByCoord方法

#### 说明

当单元的某一节点坐标位于坐标控制范围之内，对该节点施加对应的渗流材料参数。

#### 格式定义

poresp.SetPropByCoord (*< fDensity, fBulk, fSatruation, fPorosity, fArrayK, fBiotCoeff, x0, x1, y0, y1, z0, z1>*);

#### 参数

*fDensity*：浮点型，流体密度(单位：kg/m<sup>3</sup>)。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fSatruation*：浮点型，饱和度。

*fPorosity*：浮点型，孔隙率。

*fArrayK*：Array浮点型，包含3个变量，全局坐标系下三个方向的渗透系数（单位：m<sup>2</sup>/Pa/s）。

*fBiotCoeff*：浮点型，比奥系数。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

软件中比奥系数$\alpha$的范围为$\frac{{3n}}{{2 + n}} \le \alpha  \le 1$  ，*n*为孔隙率。软件中比奥模量*M*将根据比奥系数、排水模量*K*、水模量*K<sub>f</sub>*，及比奥系数$\alpha$计算，为$M = \frac{{{K_f}}}{{n + (\alpha  - n)(1 - \alpha ){K_f}/K}}$ 。

#### 范例

```javascript
//设置渗透系数
var k = new Array(1e-10, 1e-10, 1e-10);
//设置孔隙渗流材料参数
poresp.SetPropByCoord(1000, 2.1e9, 1.0, 0.1, k, 0.6, -10, 10, -10, 10, -10, 10);
```

<!--HJS_poresp_SetPropByGroup-->

### SetPropByGroup方法

#### 说明

当单元组号与设定组号一致时，对该单元所有节点施加对应的渗流材料参数。

#### 格式定义

poresp.SetPropByGroup (*< fDensity, fBulk, fSatruation, fPorosity, fArrayK, fBiotCoeff, iGroup>*);

#### 参数

*fDensity*：浮点型，流体密度(单位：kg/m3)。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fSatruation*：浮点型，饱和度。

*fPorosity*：浮点型，孔隙率。

*fArrayK*：Array浮点型，包含3个变量，全局坐标系下三个方向的渗透系数（单位：m2/Pa/s）。

*fBiotCoeff*：浮点型，比奥系数。

*iGroup*：整型，选择要设置的组号。

#### 备注

软件中比奥系数$\alpha$的范围为$\frac{{3n}}{{2 + n}} \le \alpha  \le 1$  ，*n*为孔隙率。软件中比奥模量*M*将根据比奥系数、排水模量*K*、水模量*K<sub>f</sub>*，及比奥系数$\alpha$计算，为$M = \frac{{{K_f}}}{{n + (\alpha  - n)(1 - \alpha ){K_f}/K}}$ 。

#### 范例

```javascript
//对组号为7的单元节点进行渗流参数的施加。
var k = new Array(2e-10, 2e-10, 2e-10);
poresp.SetPropByGroup(1000, 2e9, 0.0, 0.04, k, 0.6, 7);
```

<!--HJS_poresp_SetPropByCoordAndGroup-->

### SetPropByCoordAndGroup方法

#### 说明

当单元组号与设定组号一致且单元体心位于坐标控制范围之内时，对单元所有节点施加对应的渗流材料参数。

#### 格式定义

poresp.SetPropByCoordAndGroup (*< fDensity, fBulk, fSatruation, fPorosity, fArrayK, fBiotCoeff, x0, x1, y0, y1, z0, z1, iGroupLow, iGroupUp>*);

#### 参数

*fDensity*：浮点型，流体密度(单位：kg/m<sup>3</sup>)。

*fBulk*：浮点型，流体体积模量（单位：Pa）。

*fSatruation*：浮点型，饱和度。

*fPorosity*：浮点型，孔隙率。

*fArrayK*：Array浮点型，包含3个变量，全局坐标系下三个方向的渗透系数（单位：m<sup>2</suP>/Pa/s）。

*fBiotCoeff*：浮点型，比奥系数。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的上下限。

#### 备注

软件中比奥系数$\alpha$的范围为$\frac{{3n}}{{2 + n}} \le \alpha  \le 1$  ，*n*为孔隙率。软件中比奥模量*M*将根据比奥系数、排水模量*K*、水模量*K<sub>f</sub>*，及比奥系数$\alpha$计算，为$M = \frac{{{K_f}}}{{n + (\alpha  - n)(1 - \alpha ){K_f}/K}}$ 。

#### 范例

```javascript
//对组号1-8且在单元体心在坐标范围内的单元节点施加渗流参数
var k = new Array(1e-10, 1e-10, 1e-10);
poresp.SetPropByCoordAndGroup(1000, 5e9, 0.6, 0.04, k, 0.6, -10, 10, -10, 10, -10, 10, 1, 8);
```

<!--HJS_poresp_SetLangmuirPropByCoord-->

### SetLangmuirPropByCoord方法

#### 说明

当某节点的坐标位于坐标控制范围之内，对该节点施加对应的具有吸附-解吸附特性的气体参数（Langmuir参数）。

#### 格式定义

poresp.SetLangmuirPropByCoord(<*fLGaa,fLGbb,fLGSolidDens, fLGKlinFactor, x0, x1, y0, y1, z0, z1*>);

#### 参数

*fLGaa*：浮点型；多孔介质的最大吸附瓦斯量(单位：m<sup>3</sup>/kg)。

*fLGbb*：浮点型，吸附常数（单位：Pa<sup>-1</sup>）。

*fLGSolidDens*：浮点型，多孔介质的密度（单位：kg/m<sup>3</sup>）。

*fLGKlinFactor*：浮点型，瓦斯滑脱效应克林博格系数（单位：Pa）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
poresp.SetLangmuirPropByCoord(37.255e-3, 0.432e-6, 1500, 5e5, -10, 10, -10, 10, -10, 10);
```

<!--HJS_poresp_SetLangmuirPropByGroup-->

### SetLangmuirPropByGroup方法

#### 说明

当单元组号与设定组号一致时，对该单元所有节点施加对应的具有吸附-解吸附特性的气体参数（Langmuir参数）。

####  格式定义

poresp.SetLangmuirPropByGroup(<*fLGaa,fLGbb,fLGSolidDens, fLGKlinFactor, iGroupLow ,iGroupUp*>);

#### 参数

*fLGaa*：浮点型；多孔介质的最大吸附瓦斯量(单位：m<sup>3</sup>/kg)。

*fLGbb*：浮点型，吸附常数（单位：Pa<sup>-1</sup>）。

*fLGSolidDens*：浮点型，多孔介质的密度（单位：kg/m<sup>3</sup>）。

*fLGKlinFactor*：浮点型，瓦斯滑脱效应克林博格系数（单位：Pa）。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限及上限。

#### 备注

#### 范例

```javascript
poresp.SetLangmuirPropByGroup(37.255e-3, 0.432e-6, 1500, 5e5, 1, 8);
```

<!--HJS_poresp_SetSinglePropByCoord-->

### SetSinglePropByCoord方法

#### 说明

当单元某一节点坐标位于坐标范围内，对该节点单独施加某一渗流材料参数。

#### 格式定义

poresp.SetSinglePropByCoord (<*strArrayVName, fValue, x0, x1, y0, y1, z0, z1*>);

#### 参数

*strArrayVName*：字符串型，渗流参数名称，具体可包括：FDensity，FBulk，Sat，Porosity，Strength，KCoeff1，KCoeff2，KCoeff3，BiotCoeff，LGaa，LGbb，LGSolidDens，LGKlinFactor，其中，FDensity为流体密度，FBulk为体积模量，Sat为饱和度，Porosity为孔隙率，Strength 为剪切强度。KCoeff1，KCoeff2，KCoeff3 为三个方向的渗透系数。LGaa，LGbb，LGSolidDens，LGKlinFactor分别为气体为瓦斯等吸附气体时的Langmuir参数。

*fValue*：浮点型，材料参数的设定值。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

软件中比奥系数$\alpha$的范围为$\frac{{3n}}{{2 + n}} \le \alpha  \le 1$  ，*n*为孔隙率。软件中比奥模量*M*将根据比奥系数、排水模量*K*、水模量*K<sub>f</sub>*，及比奥系数$\alpha$计算，为$M = \frac{{{K_f}}}{{n + (\alpha  - n)(1 - \alpha ){K_f}/K}}$ 。

#### 范例

```javascript
//将坐标范围内的节点的流体密度设定为1500kg/m3
poresp.SetSinglePropByCoord("FDensity", 1500, -10, 10, -10, 10, -10, 10);
```

<!--HJS_poresp_SetSinglePropByGroup-->

### SetSinglePropByGroup方法

#### 说明

当单元组号与设定组号一致时，对单元内所有节点单独施加某一渗流材料参数。

#### 格式定义

poresp.SetSinglePropByGroup (<*strArrayVName, fValue, iGroup*>);

#### 参数

*strArrayVName*：字符串型，渗流参数名称，具体可包括：FDensity，FBulk，Sat，Porosity，Strength，KCoeff1，KCoeff2，KCoeff3，BiotCoeff，LGaa，LGbb，LGSolidDens，LGKlinFactor，其中，FDensity为流体密度，FBulk为体积模量，Sat为饱和度，Porosity为孔隙率，Strength 为剪切强度。KCoeff1，KCoeff2，KCoeff3 为三个方向的渗透系数。LGaa，LGbb，LGSolidDens，LGKlinFactor分别为气体为瓦斯等吸附气体时的Langmuir参数。

*fValue*：浮点型，材料参数的设定值。

*iGroup*：整型，选择要设置的组号。

#### 备注

软件中比奥系数$\alpha$的范围为$\frac{{3n}}{{2 + n}} \le \alpha  \le 1$  ，*n*为孔隙率。软件中比奥模量*M*将根据比奥系数、排水模量*K*、水模量*K<sub>f</sub>*，及比奥系数$\alpha$计算，为$M = \frac{{{K_f}}}{{n + (\alpha  - n)(1 - \alpha ){K_f}/K}}$ 。

#### 范例

```javascript
//将组3的单元对应的节点的体积模量设定为1GPa
poresp.SetSinglePropByGroup("FBulk",1e9, 3);
```

<!--HJS_poresp_SetSinglePropByCoordAndGroup-->

### SetSinglePropByCoordAndGroup方法

#### 说明

当单元组号与设定组号一致且单元体心位于坐标控制范围之内时，对单元单独施加某一个渗流材料参数。

#### 格式定义

poresp.SetSinglePropByCoordAndGroup (<*strArrayVName, fValue, x0, x1, y0, y1, z0, z1, iGroupLow, iGroupUp*>);

#### 参数

*strArrayVName*：字符串型，渗流参数名称，具体可包括：FDensity，FBulk，Sat，Porosity，Strength，KCoeff1，KCoeff2，KCoeff3，BiotCoeff，LGaa，LGbb，LGSolidDens，LGKlinFactor，其中，FDensity为流体密度，FBulk为体积模量，Sat为饱和度，Porosity为孔隙率，Strength 为剪切强度。KCoeff1，KCoeff2，KCoeff3 为三个方向的渗透系数。LGaa，LGbb，LGSolidDens，LGKlinFactor分别为气体为瓦斯等吸附气体时的Langmuir参数。

*fValue*：浮点型，材料参数的设定值。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的上下限。

#### 备注

软件中比奥系数$\alpha$的范围为$\frac{{3n}}{{2 + n}} \le \alpha  \le 1$  ，*n*为孔隙率。软件中比奥模量*M*将根据比奥系数、排水模量*K*、水模量*K<sub>f</sub>*，及比奥系数$\alpha$计算，为$M = \frac{{{K_f}}}{{n + (\alpha  - n)(1 - \alpha ){K_f}/K}}$ 。

#### 范例

```javascript
//设定组号1-8且体心位于控制范围内的单元节点的饱和度为1.0
poresp.SetSinglePropByCoordAndGroup("Sat",1.0, -10, 10, -10, 10, -10, 10, 1, 8);
```

<!--HJS_poresp_ApplyConditionByCoord-->

### ApplyConditionByCoord方法

#### 说明

当单元节点坐标或面心坐标位于坐标控制范围之内，对节点施加对应的压力或流量边界条件。

#### 格式定义

poresp.ApplyConditionByCoord(*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1, bBoundary*)

#### 参数

*strVar*：字符串型，载荷施加类型，可包括以下三个类型：pp，flux，source。其中pp为流体压力（单位：Pa）、flux为单位面积流量边界（单位：m/s），source为点源流量边界（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，施加的基础值；

*fArrayGrad*：Array浮点型，施加载荷的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y*1：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
//设置变化梯度
var grad = new Array(0, 1e4, 0);
poresp.ApplyConditionByCoord("pp", 1e6, grad,-10, 10, -10, 10, -10, 10, false);
```

<!--HJS_poresp_ApplyConditionByCoordAndGroup-->

### ApplyConditionByCoordAndGroup方法

#### 说明

当单元组号与设定组号一致且单元节点或面心坐标位于坐标控制范围之内时，对单元的节点施加对应的压力或流量边界条件。

#### 格式定义

poresp.ApplyConditionByCoordAndGroup(*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1, iGroupLow, iGroupUp, bBoundary*)

#### 参数

*strVar*：字符串型，载荷施加类型，可包括以下三个类型：pp，flux，source。其中pp为流体压力（单位：Pa）、flux为单位面积流量边界（单位：m/s），source为点源流量边界（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，施加的基础值；

*fArrayGrad*：Array浮点型，施加载荷的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y*1：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限及上限。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
//压力变化梯度
var grad = new Array(0, 1e4, 0);
poresp.ApplyConditionByCoordAndGroup("pp", 1e6, grad, -10, 10, -10, 10, -10, 10, 1,8, false);
```

<!--HJS_poresp_ApplyConditionByPlane-->

### ApplyConditionByPlane方法

#### 说明

当单元节点坐标或面心到设定面的距离小于容差限定值（1mm）时，对节点施加对应的压力或流量边界条件。

#### 格式定义

poresp.ApplyConditionByPlane(*strVar, fValue, fArrayGrad[3], fArrayN[3], fArrayOrigin[3], bBoundary*)

#### 参数

*strVar*：字符串型，载荷施加类型，可包括以下三个类型：pp，flux，source。其中pp为流体压力（单位：Pa）、flux为单位面积流量边界（单位：m/s），source为点源流量边界（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，施加的基础值；

*fArrayGrad*：Array浮点型，施加载荷的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*fArrayN*：Array浮点类型，包含3个分量，面的单位法向量；

*fArrayOrigin*：Array浮点型，包含3个分量，面内一点；

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 1e4, 0);//变化梯度
var ns = new Array(0, 0, 0);//法向分量
var orgins = new Array(0, 0, 0); //平面内一点坐标
poresp.ApplyConditionByPlane("pp", 1e6, grad, ns, origins, false);
```

<!--HJS_poresp_ApplyConditionByCylinder-->

### ApplyConditionByCylinder方法

#### 说明

当单元节点坐标或面心位于某一空心圆柱内时，对单元的节点施加对应的压力或流量边界条件。

#### 格式定义

poresp.ApplyConditionByCylinder(*strVar, fValue, fArrayGrad[3], x0, y0, z0,x1, y1, z1, fRad1, fRad2, bBoundary*)

#### 参数

*strVar*：字符串型，载荷施加类型，可包括以下三个类型：pp，flux，source。其中pp为流体压力（单位：Pa）、flux为单位面积流量边界（单位：m/s），source为点源流量边界（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，施加的基础值；

*fArrayGrad*：Array浮点型，施加载荷的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 0, 0); //变化梯度
poresp.ApplyConditionByCylinder("pp",1e6, grad,0,0,-1,0,0,1, 0.1, 0.5, false);
```

<!--HJS_poresp_ApplyConditionBySphere-->

### ApplyConditionBySphere方法

#### 说明

当单元节点坐标或面心位于某一空心球内时，对单元的节点施加对应的压力或流量边界条件。

#### 格式定义

poresp.ApplyConditionBySphere(*strVar, fValue, fArrayGrad[3], fcx, fcy, fcz, frad1, frad2, bBoundary*)

#### 参数

*strVar*：字符串型，载荷施加类型，可包括以下三个类型：pp，flux，source。其中pp为流体压力（单位：Pa）、flux为单位面积流量边界（单位：m/s），source为点源流量边界（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，施加的基础值；

*fArrayGrad*：Array浮点型，施加载荷的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*fcx*、*fcy*、*fcz*：浮点型，球中心坐标（单位：m）。

*frad1*：浮点型，球的内半径（单位：m）。

*frad2*：浮点型，球的外半径（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 0, 0); //变化梯度
poresp.ApplyConditionBySphere("pp",1e6, grad,0.0, 0.0, 0.0, 0.1, 0.5, false);
```

<!--HJS_poresp_ApplyConditionBySel-->

### ApplyConditionBySel方法

#### 说明

根据Genvi平台上选择的结果（当前通道号对应的sel），对孔隙渗流单元施加边界条件。

#### 格式定义

poresp.ApplyConditionBySel(*oSel, strVar, fValue, fGradX, fGradY, fGradZ*)

#### 参数

*oSel*：选择类，通过Genvi平台选择的单元集或节点集。

*strVar*：字符串型，载荷施加类型，可包括以下2个类型：pp，flow。pp为流体压力（单位：Pa）。flow根据Genvi所选择的内容具有不同的意义，如果选择的是单元或节点，flow表征点源流量（source，单位：m3/s）；若选择的是单元的面，flow表征面流量（flux，单位：m/s）。对于flow，正值表示源，负值表示汇。

*fValue*：浮点型，施加的基础值；

*fGradX**，**fGradY**，**fGradZ*：浮点型，所施加的边界条件沿着三个坐标的变化梯度。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
// 通过Genvi平台选择节点
oSel = new SelNodes(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);

//对当前通道号包含的选择集施加1MPa的压力
poresp.ApplyConditionBySel(oSel, "pp",1e6, 0.0, 0.0, 0.0);
```

<!--HJS_poresp_ApplyBoundCondition-->

### ApplyBoundCondition方法

#### 说明

根据输入的法向设置自由边界面上的孔隙渗流条件。

#### 格式定义

poresp.ApplyBoundCondition (*strVar, fValue,afGrad[3], afNormal[3], fTol*)

#### 参数

*strVar*：字符串型，载荷施加类型，可包括以下三个类型：pp，flux，source。其中pp为流体压力（单位：Pa）、flux为单位面积流量边界（单位：m/s），source为点源流量边界（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*fValue*：浮点型，施加的基础值；

*afGrad*：Array浮点型，施加载荷的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*afNormal*：Array浮点型，自由面单位法向量，包含3个分量。

*fTol*：浮点型，法向量容差。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 0, 0); //变化梯度
var norm = new Array(1.0, 0.0, 0.0); //单位法向
poresp. ApplyBoundCondition ("pp",1e6, grad, norm, 1e-3);
```

<!--HJS_poresp_ApplyDynaConditionByCoord-->

### ApplyDynaConditionByCoord方法

#### 说明

当单元节点坐标或面心位于坐标控制范围内时，施加动态压力或流量边界。

#### 格式定义

poresp. ApplyDynaConditionByCoord (*strVar, afvalues[N] [2], fArrayGrad[3], x0, x1, y0, y1, z0, z1, bBoundary*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

x0、x1：浮点型，选择范围的x坐标下限及上限（单位：m）。

y0、y1：浮点型，选择范围的y坐标下限及上限（单位：m）。

z0、z1：浮点型，选择范围的z坐标下限及上限（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

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
poresp.ApplyDynaConditionByCoord("pp",aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1,1, false);
```

<!--HJS_poresp_ApplyDynaConditionBySphere-->

### ApplyDynaConditionBySphere方法

#### 说明

当单元节点坐标或面心位于某一空心球内时，施加动态压力或流量边界。

#### 格式定义

poresp. ApplyDynaConditionBySphere(*strVar, afvalues[N] [2], fArrayGrad[3], fCx, fCy, fCz, fRad1, fRad2, bBoundary*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fCx, fCy, fCz*：浮点型，球心坐标（单位：m）。

*fRad1, fRad2*：浮点型，内外球半径（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

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
poresp.ApplyDynaConditionBySphere("pp",aValue, fArrayGrad, 0, 0, 0, 0.99, 1.01, false);
```

<!--HJS_poresp_ApplyDynaConditionByCylinder-->

### ApplyDynaConditionByCylinder方法

#### 说明

当单元节点坐标或面心位于某一空心圆柱内时，施加动态压力或流量边界。

#### 格式定义

poresp. ApplyDynaConditionByCylinder(*strVar, afvalues[N] [2], fArrayGrad[3], fX0, fY0, fZ0, fX1, fY1, fZ1, fRad1, fRad2, bBoundary*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fX0, fY0, fZ0*：浮点型，圆柱轴线第一个端点坐标（单位：m）。

*fX1, fY1, fZ1*：浮点型，圆柱轴线第二个端点坐标（单位：m）。

*fRad1, fRad2*：浮点型，内外圆柱半径（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

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
poresp.ApplyDynaConditionByCylinder("pp",aValue, fArrayGrad, 0, 0, 0, 1, 0, 0, 0.99, 1.01, false);
```

<!--HJS_poresp_ApplyDynaBoundCondition-->

### ApplyDynaBoundCondition方法

#### 说明

当单元某面的外法向与设定法向的点积值大于等于设定值，对区域内的自由面施加动态压力或流量边界。

#### 格式定义

poresp. ApplyDynaBoundCondition(*strVar, afvalues[N] [2], fArrayGrad[3], fDirX, fDirY, fDirZ, fTol*)

#### 参数

*strVar*：字符串型，施加类型。可以为以下三个字符串之一，"pp"、"flux"、"source"，分别表示节点流体压力（单位：Pa）、单位面积流量（单位：m/s）及点源流量（单位：m3/s）；对于flux及source，正值表示源，负值表示汇。

*afvalues[N] [2]*：Array浮点型，包含n行（n≥2），2列，第一列为时间，第二列为值。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fArrayGrad*：Array浮点型，包含3个分量，三个方向的梯度。

*fDirX, fDirY, fDirZ*：浮点型，设定的单位法向量分量（单位：m）。

*fTol*：浮点型，设定容差（无单位）。

#### 备注

（1）进行动态压力施加时，将对压力值进行动态固定；当计算时间大于载荷时间后，将维持最后一个时刻的加载值。

（2）进行动态流量施加时，将动态施加的流量累加至节点当前总流量；当计算时间大于载荷时间后，所施加的流量值将变为0。

（3）某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

（4）当选定的面为自由面时，才进行对应条件的施加；主要用于对复杂山体的表面添加压力或流量条件。

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
poresp.ApplyDynaBoundCondition ("pp",aValue, fArrayGrad, 0, 0, 1.0, 0.5);
```

<!--HJS_poresp_InitConditionByCoord-->

### InitConditionByCoord方法

#### 说明

当单元体心位于坐标控制范围之内时，对单元施加初始化压力及饱和度。

#### 格式定义

poresp.InitConditionByCoord(*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1, bBoundary*)

#### 参数

*strVar*：字符串型，初始化条件的类型，共包含2个类型：sat及pp。sat为饱和度，pp为初始孔隙压力；

*fValue*：浮点型，初始化条件的基础值；

*fArrayGrad*：Array浮点型，初始化条件的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 0, 0); //变化梯度
poresp.InitConditionByCoord("sat", 1.0, grad, -10, 10, -10, 10, -10, 10, false);
```

<!--HJS_poresp_InitConditionByCoordAndGroup-->

### InitConditionByCoordAndGroup方法

#### 说明

当单元组号与设定组号一致且单元节点坐标或单元某面面心位于坐标控制范围之内时，对单元对应的节点施加对应的初始化压力及饱和度。

#### 格式定义

poresp.InitConditionByCoordAndGroup(*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1, iGroupLow, iGroupUp, bBoundary*)

#### 参数

*strVar*：字符串型，初始化条件的类型，共包含2个类型：sat及pp。sat为饱和度，pp为初始孔隙压力；

*fValue*：浮点型，初始化条件的基础值；

*fArrayGrad*：Array浮点型，初始化条件的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限及上限。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 1e4, 0); //变化梯度
poresp.ApplyConditionByCoordAndGroup("pp", 1e6, grad, -10, 10, -10, 10, -10, 10, 1, 5, false);
```

<!--HJS_poresp_InitConditionByPlane-->

### InitConditionByPlane方法

#### 说明

当单元节点坐标或面心坐标到设定面的距离小于容差限定值（1mm）时，对单元相应的节点施加对应的初始化压力及饱和度。

#### 格式定义

poresp.InitConditionByPlane(*strVar, fValue, fArrayGrad[3], fArrayNormal[3], fArrayOrigin[3], bBoundary*)

#### 参数

*strVar*：字符串型，初始化条件的类型，共包含2个类型：sat及pp。sat为饱和度，pp为初始孔隙压力；

*fValue*：浮点型，初始化条件的基础值；

*fArrayGrad*：Array浮点型，初始化条件的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*fArrayNormal*：Array浮点类型，包含3个分量，面的单位法向量；

*fArrayOrigin*：Array浮点型，包含3个分量，面内一点；

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 1e4, 0); //变化梯度
var ns = new Array(0, 1, 0); //法向分量
var origins = new Array(0, 0, 0); //平面内一点坐标
poresp.InitConditionByPlane("pp",1e6, grad, ns, origins, false);
```

<!--HJS_poresp_InitConditionByCylinder-->

### InitConditionByCylinder方法

#### 说明

当单元节点坐标或面心坐标位于某一空心圆柱内时，对单元对应的节点施加对应的初始化压力及饱和度。

#### 格式定义

poresp.InitConditionByCylinder(*strVar, fValue, fArrayGrad[3], x0, y0, z0, x1, y1, z1,fRad1, fRad2, bBoundary*)

#### 参数

*strVar*：字符串型，初始化条件的类型，共包含2个类型：sat及pp。sat为饱和度，pp为初始孔隙压力；

*fValue*：浮点型，初始化条件的基础值；

*fArrayGrad*：Array浮点型，初始化条件的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 0, 0);
poresp.InitConditionByCylinder("pp", 1e6, grad, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.1, 0.5, false);
```

<!--HJS_poresp_InitConditionBySphere-->

### InitConditionBySphere方法

#### 说明

当单元节点坐标或面心坐标位于某一空心球内时，对单元对应的节点施加对应的初始化压力及饱和度。

#### 格式定义

poresp.InitConditionBySphere(*strVar, fValue, fArrayGrad[3], fcx, fcy, fcz, frad1, frad2, bBoundary*)

#### 参数

*strVar*：字符串型，初始化条件的类型，共包含2个类型：sat及pp。sat为饱和度，pp为初始孔隙压力；

*fValue*：浮点型，初始化条件的基础值；

*fArrayGrad*：Array浮点型，初始化条件的变化梯度，包含3个分量，分别表示沿着三个坐标的变化梯度；

*fcx*、*fcy*、*fcz*：浮点型，球中心坐标（单位：m）。

*frad1*：浮点型，球的内半径（单位：m）。

*frad2*：浮点型，球的外半径（单位：m）。

*bBoundary*：布尔型，是否只选取边界面，如果为true，则只选取边界面（对应的坐标为面心坐标）；如果为false，则边界面及单元内部面全部选取（对应的坐标为节点坐标）。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
var grad = new Array(0, 0, 0);
poresp.InitConditionBySphere("pp", 1e6, grad, 0,0,0, 0.1, 0.5, false);
```

<!--HJS_poresp_InitConditionBySel-->

### InitConditionBySel方法

#### 说明

根据Genvi平台上选择的结果（当前通道号对应的sel），对孔隙渗流单元施加初始条件。

#### 格式定义

poresp.InitConditionBySel(*oSel, strVar, fValue, fGradX, fGradY, fGradZ*)

#### 参数

*oSel*：选择类，通过Genvi平台选择的单元集或节点集。

*strVar*：字符串型，初始化类型，共包含2个类型：sat及pp。sat为饱和度，pp为初始孔隙压力。

*fValue*：浮点型，施加的基础值；

*fGradX**，**fGradY**，**fGradZ*：浮点型，所施加的初值条件沿着三个坐标的变化梯度。

#### 备注

某一节点最终的载荷值可表示为$F = {f_0} + {g_x}x + {g_y}y + {g_z}z$，*F*为最终的载荷值，*f<sub>0</sub>*为基础值（*fValue*），*g<sub>x</sub>*、g*<sub>y</sub>*、*g<sub>z</sub>*为三个方向的梯度（*fArrayGrad*），*x*、*y*、*z*为空间坐标。

#### 范例

```javascript
// 通过Genvi平台选择节点
oSel = new SelNodes(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);

//对当前通道号包含的选择集施加1MPa的初值压力
poresp.InitConditionBySel(oSel, "pp", 1e6, 0.0, 0.0, 0.0);
```

<!--HJS_poresp_GetNodeValue-->

### GetNodeValue方法

#### 说明

获取孔隙渗流节点信息的值。

####  格式定义

poresp.GetNodeValue(<*iNode, strValueName*>)

#### 参数

*iNode*：整型，全局节点序号，大于1；

*strValueName*：字符串型，可供获取的节点变量**，具体见附表**6。

#### 备注

#### 范例

```javascript
//将第10号节点的孔隙压力赋给变量value
var value = poresp.GetNodeValue(1, "PoreP");
```

<!--HJS_poresp_SetNodeValue-->

### SetNodeValue方法

#### 说明

设置孔隙渗流节点信息。

#### 格式定义

poresp.SetNodeValue(*iNode, strValueName, fValue*)

#### 参数

*iNode*：整型，节点序号，大于1；

*strValueNam*：字符串型，可供设置的节点变量**，具体见附表**6。

*fValue*：浮点型，设置的值；

#### 备注

#### 范例

```javascript
//将第10号节点的孔隙压力位1MPa
poresp.SetNodeValue(10, "PoreP", 1e6);
```

<!--HJS_poresp_Solver-->

### Solver方法

#### 说明

孔隙渗流核心求解器（每一迭代步使用）。该脚本是4.1.26-4.1.33脚本的集成。

#### 格式定义

poresp.Solver()

#### 参数

无。

#### 备注

返回值为不平衡率，压力变化量/当前平均压力。

#### 范例

```javascript
var unbal = poresp.Solver();
```

<!--HJS_poresp_CalNodeSatAndPresLiquid-->

### CalNodeSatAndPresLiquid方法

#### 说明

根据节点液体体积增量计算饱和度及压力，不考虑biot固结效应。

#### 格式定义

poresp.CalNodeSatAndPresLiquid ();

#### 参数

无。

#### 备注

返回值为不平衡率，压力变化量/当前平均压力。

#### 范例

```javascript
var unbal = poresp.CalNodeSatAndPresLiquid ();
```

<!--HJS_poresp_CalNodeSatAndPresLiquidBiot-->

### CalNodeSatAndPresLiquidBiot方法

#### 说明

根据节点液体体积增量计算饱和度及压力，考虑biot固结效应。

#### 格式定义

poresp.CalNodeSatAndPresLiquidBiot ()

#### 参数

无。

#### 备注

返回值为不平衡率，压力变化量/当前平均压力。

#### 范例

```javascript
var unbal = poresp.CalNodeSatAndPresLiquidBiot ();
```

<!--HJS_poresp_CalNodePressGas-->

### CalNodePressGas方法

#### 说明

根据节点气体质量增量计算气体压力。

#### 格式定义

poresp.CalNodePressGas ()

#### 参数

无。

#### 备注

返回值为不平衡率，压力变化量/当前平均压力。

#### 范例

```javascript
var unbal = poresp.CalNodePressGas ();
```

<!--HJS_poresp_CalElemFlowDarcy-->

### CalElemFlowDarcy方法

#### 说明

基于达西定律，根据节点压力计算单元流速。

#### 格式定义

poresp.CalElemFlowDarcy ();

#### 参数

无。

#### 备注

#### 范例

```javascript
poresp.CalElemFlowDarcy ();
```

<!--HJS_poresp_CalContactFlowTransfer-->

### CalContactFlowTransfer方法

#### 说明

计算接触面上的流量传递。

#### 格式定义

poresp. CalContactFlowTransfer ()

#### 参数

无。

#### 备注

#### 范例

```javascript
poresp. CalContactFlowTransfer ();
```

<!--HJS_poresp_AddBoundPresToSolid-->

### AddBoundPresToSolid方法

#### 说明

将渗流边界的压力施加给固体边界。

#### 格式定义

poresp. AddBoundPresToSolid ()

#### 参数

无。

#### 备注

#### 范例

```javascript
poresp. AddBoundPresToSolid ();
```

<!--HJS_poresp_CalAbsorbanceAndErosion-->

### CalAbsorbanceAndErosion方法

#### 说明

计算单元吸水弱化及侵蚀效应。

#### 格式定义

poresp. CalAbsorbanceAndErosion ()

#### 参数

无。

#### 备注

#### 范例

```javascript
poresp. CalAbsorbanceAndErosion ();
```

<!--HJS_poresp_CalDynaBound-->

### CalDynaBound方法

#### 说明

计算单元或节点动态边界条件。

#### 格式定义

poresp. CalDynaBound ()

#### 参数

无。

#### 备注

#### 范例

```javascript
poresp. CalDynaBound ();
```

