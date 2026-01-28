<!--HJS_pfly_interfacefun-->

## pfly接口函数

颗粒飞行对象（pfly）为用户提供了飞行参数设置、颗粒形状设置、靶板设置及结果统计设置等多类接口函数，具体见表4.3。

<center>表4.3 颗粒飞行类接口函数列表</center>

| **序号** | **方法**                   | **说明**                                         |
| -------- | -------------------------- | ------------------------------------------------ |
| 1        | SetFlyPara                 | 设置颗粒飞行参数                                 |
| 2        | SetShapePara               | 设置颗粒性质参数                                 |
| 3        | GenFragments               | 按照mott分布产生碎片群                           |
| 4        | CalChargeRatio             | 计算装药比                                       |
| 5        | CalShellMass               | 计算壳体质量                                     |
| 6        | CrtPeneTarget              | 设置可穿透环形靶板（靶板角度范围固定为180°）     |
| 7        | CrtPeneCircleTarget        | 设置可穿透环形靶板（靶板角度范围可设置）         |
| 8        | CrtPeneHeightTarget        | 设置可穿透高度靶板（靶板角度范围可设置）         |
| 9        | CrtGlueTarget              | 设置粘接靶板                                     |
| 10       | ExportPeneTargetInfo       | 导出可粘环形接靶板信息（靶板角度范围固定为180°） |
| 11       | ExportPeneCircleTargetInfo | 导出可粘接环形靶板信息（靶板角度范围可设置）     |
| 12       | ExportPeneHeightTargetInfo | 导出可粘接高度靶板信息（靶板角度范围可设置）     |
| 13       | ExportGroundTargetInfo     | 导出地面靶板信息                                 |
| 14       | ExportGroundStatiInfo      | 导出地面靶板统计信息                             |
| 15       | ExportRigidFaceTargetInfo  | 按同心圆环的方式输出地面上颗粒的统计信息。       |

**注：**

**（1）颗粒飞行模型必须在颗粒计算类别为3时起作用。可通过dyna.Set(<>)进行设置，具体为dyna.Set("Particle_Cal_Type 3");**

**（2）本软件中，颗粒飞行时的高度方向为Y轴方向，重力加速度方向指向Y轴负半轴，当颗粒位置低于地面位置时，颗粒被固定在地面上。**

<!--HJS_pfly_SetFlyPara-->

### SetFlyPara方法

#### 说明

设置全局的颗粒飞行参数。

####  格式定义

pfly.SetFlyPara( );

#### 参数

*fDensity*：浮点型，颗粒飞行时所处介质密度（单位：kg/m<sup>3</sup>）。

*fHeight*：浮点型，地面高程（单位：m）。

*iDragCoeffType*：整型，阻力类型，只能为1、2、3、4。1为常阻力，2为与马赫数相关的阻力，3为与雷诺数相关的阻力，4为用户自定义的与合速度相关的阻力。

*fGenPara*：浮点型或字符串型。*iDragCoeffType*=1~3，为浮点型，表示阻力参数，如果*iDragCoeffType*=1，该值表示常阻力系数；如果*iDragCoeffType*=2，该值表示声速（单位：m/s）；如果*iDragCoeffType*=3，该值表示动力粘度（单位：Pa.s）。

*iDragCoeffType*=4，为字符串型，表示阻力系数文件名（含路径）。该文件的第一行为阻力系数表的行数。之后每一行包含2个数，第一个数为合速度值，第二个数为该合速度对应的阻力系数值，合速度值需从小到大编写；若计算中的实际合速度小于或大于数据表中的值，则令其等于边界值。文本文件的数据格式为

​    ![](images/GDEM_颗粒飞行类_1.png)               

#### 备注

空气阻力计算公式为：F<sub>d</sub>= 0.5 * C * ρ<sub>g</sub> * v<sup>2</sup> * A。其中， F<sub>d</sub>为空气阻力（N）、ρ<sub>g</sub>为空气密度（kg/m<sup>3</sup>）、C为空气阻力系数（无量纲）、A为颗粒等效面积(m<sup>2</sup>)，v为运动速度（m/s)。

#### 范例

```javascript
pfly.SetFlyPara( 1.069, 0.0, 2, 340.0);
```

<!--HJS_pfly_SetShapePara-->

### SetShapePara方法

#### 说明

对指定组号下限及上限范围内的颗粒设定形状参数。

#### 格式定义

pfly.SetShapePara ( <*iShape, fEquiR, fMass, fEquiArea, iGrpL, iGrpU*> );

#### 参数

*iShape*：整型，颗粒形状类型号，只能为1-4，1为球体、2为立方体、3为圆柱体、4为棱形体。

*fEquiR*：浮点型，颗粒等效半径（单位：m）。

*fMass*：浮点型，颗粒等效质量（单位：kg）。

*fEquiArea*：浮点型，颗粒等效迎风面积（单位：m2）。

*iGrpL, iGrpU*：整型，颗粒对应的组号下限及上限。

#### 备注

（1）当颗粒为非球形颗粒时，需要执行该命令。

（2）当该命令不被执行时，默认颗粒形状为球形，并根据pdyna给出的半径、质量、截面积进行计算。

#### 范例

```javascript
//颗粒形状类型为立方体，等效半径为3.05mm
pfly.SetShapePara ( 2, 3.05e-3, 0.004380733, 37.21e-6, 1,11);
```

<!--HJS_pfly_GenFragments-->

### GenFragments方法

#### 说明

对组号及轴线双重控制下的块体单元进行统计，产生满足mott分布的自然碎片群。

#### 格式定义

pfly. GenFragments ( <*fDensity, iAverNo, fMu, fBegMass, fMassStep, iGrpLow, iGrpUp [, afEnd1[3], afEnd2[3]]* > );

#### 参数

*fDensity*：浮点，块体单元密度（单位：kg/m<sup>3</sup>）。

*iAverNo*：整型，Mott分布中的破片数量。

*fMu*：浮点型，Mott分布u值（碎片群通过率为63%的破片质量），（单位：kg）。

*fBegMass*：浮点型，起始质量（单位：kg）。

*fMassStep*：浮点型，质量步长（单位：kg）。

*iGrpL, iGrpU*：整型，块体单元对应的组号下限及上限。

*afEnd1*[3]，*afEnd2*[3]：Array浮点型，含3个分类，轴线的两个端点（单位：m）。

#### 备注

轴线的两个端点可以不写，不写默认为只要满足设定组号关系的单元均列入统计；如果设定了轴线端点，则当单元组号满足要求且单元体心位于轴线段两个端点所夹的平面（平面法向为轴线方向）范围内时，单元列入统计。

#### 范例

```javascript
pfly. GenFragments (7800, 2000, 5e-3, 0.5e-3, 0.5e-3, 1,1);
pfly. GenFragments (7800,2790, 3.821e-3, 1e-3, 1e-3, 3,3, [0.476,0,0], [0.596,0,0]);
```

<!--HJS_pfly_FragShapeCorrect-->

### FragShapeCorrect方法

#### 说明

根据输入的尺寸比例，对自然碎片的迎风面积及阻力系数取值进行修正。

#### 格式定义

pfly.FragShapeCorrect( <*fL1Ratio, fL2Ratio, fL3Ratio [, iShape]>* );

#### 参数

*fL1Ratio, fL2Ratio, fL3Ratio*：浮点型，自然碎片三个方向的长度系数。建议三个方向的尺寸分别为5.0，3.0，1.0。

*iShape*：整型，颗粒形状类型号，只能为1-4，1为球体、2为立方体、3为圆柱体、4为棱形体。可以不写，默认为4。

#### 备注

在进行自然碎片飞行计算前，需要调用该接口函数，重新设置自然碎片的形状，计算迎风面积，设定破片形状类型（用于选择不同的阻力系数）。

#### 范例

```javascript
pfly. FragShapeCorrect (5.0, 3.0, 1.0);
pfly. FragShapeCorrect (5.0, 3.0, 1.0, 4);
```

<!--HJS_pfly_CalChargeRatio-->

### CalChargeRatio方法

#### 说明

对组号及轴线坐标双重控制下的块体单元进行统计，给出该区段的装药比。

#### 格式定义

pfly.CalChargeRatio( <*fDensRatio, iChargeGrp [, afEnd1[3], afEnd2[3]]* > );

#### 参数

*fDensRatio*：浮点型，密度比（药/壳），大于0.0。

*iChargeGrp*：整型，药对应的组号（大于等于1的自然数）。

*afEnd1*[3]，*afEnd2*[3]：Array浮点型，含3个分类，轴线的两个端点（单位：m）。

#### 备注

（1）返回值为装药比。

（2）轴线的两个端点可以不写，不写默认为只要满足设定组号关系的单元均列入统计；如果设定了轴线端点，则当单元组号满足要求且单元体心位于轴线段两个端点所夹的平面（平面法向为轴线方向）范围内时，单元列入统计。

（3）默认炸药仅为一个组，其他组号的单元为壳体。

#### 范例

```javascript
var fratio = pfly.CalChargeRatio (0.3, 1);
var fratio = pfly.CalChargeRatio (0.3, 1, [0.476,0,0], [0.596,0,0]);
```

<!--HJS_pfly_CalShellMass-->

### CalShellMass方法

#### 说明

对组号及轴线坐标双重控制下的块体单元进行统计，给出该区段的壳体质量。

#### 格式定义

pfly.CalShellMass( <*fShellDens, iShellGrpL, iShellGrpU [, afEnd1[3], afEnd2[3]]* > );

#### 参数

*fShellDens*：浮点型，壳体的密度（单位：kg/m<sup>3</sup>）。

*iShellGrpL, iShellGrpU*：整型，壳体部分单元对应的组号下限及上限。

*afEnd1*[3]，*afEnd2*[3]：Array浮点型，含3个分类，轴线的两个端点（单位：m）。

#### 备注

（1）返回值为壳体质量（单位：kg）。

（2）轴线的两个端点可以不写，不写默认为只要满足设定组号关系的单元均列入统计；如果设定了轴线端点，则当单元组号满足要求且单元体心位于轴线段两个端点所夹的平面（平面法向为轴线方向）范围内时，单元列入统计。

#### 范例

```javascript
var fShellMass = pfly. CalShellMass (7800.0, 3, 3);
var fShellMass = pfly. CalShellMass (7800.0, 3, 3, [0.476,0,0], [0.596,0,0]);
```

<!--HJS_pfly_CrtPeneTarget-->

### CrtPeneTarget方法

#### 说明

设置垂直于地面的可穿透环形靶板（靶板轴线为Y轴方向）。

#### 格式定义

pfly.CrtPeneTarget ( *fx, fy, fz, frad, fHLow, fHUp* );

#### 参数

*fx, fy, fz*：浮点型，靶板中心坐标（单位：m）。

*frad*：浮点型，靶板半径（单位：m）。

*fHLow, fHUp*：浮点型，靶板高程的下限及上限值（单位：m）。

#### 备注

（1）可穿透环形靶板适用于单发卧式或多发立式战斗部，该类型聚焦带垂直于地面。

（2）在一次计算中，可以设置多个可穿透靶板。

（3）当颗粒穿过靶板后信息将被该靶板记录下来（颗粒飞行轨迹不受影响），并可通过pfly. ExportPeneTargetInfo(<>)函数将统计信息及各靶板上的信息进行输出。

#### 范例

```javascript
//靶板中心坐标(0,0,0)，靶板半径200m，靶板下边界0m，靶板上边界2m
pfly. CrtPeneTarget (0.0, 0.0, 0.0, 200.0, 0.0, 2.0);
```

<!--HJS_pfly_CrtPeneCircleTarget-->

### CrtPeneCircleTarget方法

#### 说明

设置垂直于地面的可穿透环形靶板（靶板轴线为Y轴方向）。

#### 格式定义

pfly.CrtPeneCircleTarget ( *fx, fy, fz, frad, fAngle, fHLow, fHUp* );

#### 参数

*fx, fy, fz*：浮点型，靶板中心坐标（单位：m）。

*frad*：浮点型，靶板半径（单位：m）。

*fAngle*：浮点型，靶板角度范围（通过角度范围控制靶板长度）（单位：m）。

*fHLow, fHUp*：浮点型，靶板高程的下限及上限值（单位：m）。

#### 备注

（1）可穿透环形靶板适用于单发卧式或多发立式战斗部，该类型聚焦带垂直于地面。

（2）在一次计算中，可以设置多个可穿透靶板。

（3）当颗粒穿过靶板后信息将被该靶板记录下来（颗粒飞行轨迹不受影响），并可通过pfly. ExportPeneCircleTargetInfo(<>)函数将统计信息及各靶板上的信息进行输出。

#### 范例

```javascript
//靶板中心坐标(0,0,0)，靶板半径200m，靶板角度范围60°，靶板下边界0m，靶板上边界2m
pfly. CrtPeneCircleTarget (0.0, 0.0, 0.0, 200.0, 60, 0.0, 2.0);
```

<!--HJS_pfly_CrtPeneHeightTarget-->

### CrtPeneHeightTarget方法

#### 说明

设置垂直于地面的可穿透高度靶板（靶板轴线为Y轴方向）。

#### 格式定义

pfly.CrtPeneHeightTarget( *fx, fy, fz, frad, fAngle, fHLow, fHUp* );

#### 参数

*fx, fy, fz*：浮点型，靶板中心坐标（单位：m）。

*frad*：浮点型，靶板半径（单位：m）。

*fAngle*：浮点型，靶板角度范围（通过角度范围控制靶板长度）（单位：m）。

*fHLow, fHUp*：浮点型，靶板高程的下限及上限值（单位：m）。

#### 备注

（1）可穿透环形靶板适用于单发立式或其他聚焦带平行于地面的战斗部。

（2）在一次计算中，可以设置多个可穿透靶板。

（3）当颗粒穿过靶板后信息将被该靶板记录下来（颗粒飞行轨迹不受影响），并可通过pfly. ExportPeneHeightTargetInfo(<>)函数将统计信息及各靶板上的信息进行输出。

#### 范例

```javascript
//靶板中心坐标(0,0,0)，靶板半径200m，靶板角度范围60°，靶板下边界0m，靶板上边界2m
pfly. CrtPeneHeightTarget (0.0, 0.0, 0.0, 200.0, 60, 0.0, 2.0);
```

<!--HJS_pfly_CrtGlueTarget-->

### CrtGlueTarget方法

#### 说明

设置垂直于地面的粘接环形靶板（靶板轴线为Y轴方向）。

#### 格式定义

pfly.CrtGlueTarget (*fx, fy, fz, frad, fHLow, fHUp* );

#### 参数

*fx, fy, fz*：浮点型，靶板中心坐标（单位：m）。

*frad*：浮点型，靶板半径（单位：m）。

*fHLow, fHUp*：浮点型，靶板高程的下限及上限值（单位：m）。

#### 备注

（1）在一次计算中，仅可设置一个粘接靶板，颗粒落入粘接靶板范围内时，将被该靶板捕获，颗粒将粘接到该靶板上。

#### 范例

```javascript
//靶板中心坐标(0,0,0)，靶板半径200m，靶板下边界0m，靶板上边界2m

pfly. CrtGlueTarget (0.0, 0.0, 0.0, 200.0, 0.0, 2.0);
```

<!--HJS_pfly_ExportPeneTargetInfo-->

### ExportPeneTargetInfo方法

#### 说明

输出可穿透靶板上的统计信息及每个靶板上的着靶颗粒信息(与pfly.CrtPeneTarget()脚本配套使用)。

#### 格式定义

pfly.ExportPeneTargetInfo ( *fFlyAngle, fCriEnergy, fEffectDens [, iExportTargetFlag]* );

#### 参数

*fFlyAngle*：浮点型，飞散角（单位：°）。

*fCriEnergy*：浮点型，临界能量（单位：J）。

*fEffectDens*：浮点型，每平方米上颗粒的数量（单位：1/m<sup>2</sup>）。

*iExportTargetFlag*：整型，文件导入指标，0表示不导出文件，1表示导出文件，默认为1。

#### 备注

（1）执行该命令后，将会在软件文本输出框内输出不同靶板计算获得的有效破片数量及破片密度，并给出最远飞行距离及对应的飞行速度；

（2）当*iExportTargetFlag*为1时，将在当前文件夹下产生一系列TargetPlateInfo_%d.txt的文本文件， %d表示对应的可穿透靶板的半径（当靶板上有颗粒时输出）。输出内容包括：颗粒ID号，颗粒组号，初始坐标X、Y、Z，方位角（Z轴方向为0°），当前坐标X、Y、Z，合速度及入射角。

#### 范例

```javascript
for(var i = 0; i < 10; i++)
{
  pfly.CrtPeneTarget( 0, 0, 0, 200.0 + 50.0 * i, 0.0, 2.0); 
}
```

<!--HJS_pfly_ExportPeneCircleTargetInfo-->

### ExportPeneCircleTargetInfo方法

#### 说明

输出可穿透靶板上的统计信息及每个靶板上的着靶颗粒信息(与pfly.CrtPeneCircleTarget()脚本配套使用)。

#### 格式定义

pfly.ExportPeneCircleTargetInfo ( *fFlyAngle, fCriEnergy, fEffectDens, iGrp, jGrp[, iExportTargetFlag]* );

#### 参数

*fFlyAngle*：浮点型，飞散角（单位：°）。

*fCriEnergy*：浮点型，临界能量（单位：J）。

*fEffectDens*：浮点型，每平方米上颗粒的数量（单位：1/m<sup>2</sup>）。

*iGrp*：整型，被导出颗粒的组号下限（单位：无）。

*jGrp*：整型，被导出颗粒的组号上限（单位：无）。

*jGrp*：整型，被导出颗粒的组号上线（单位：1/m<sup>2</sup>）。

*iExportTargetFlag*：整型，文件导入指标，0表示不导出文件，1表示导出文件，默认为1。

#### 备注

（1）执行该命令后，将会在软件文本输出框内输出不同靶板计算获得的有效破片数量及破片密度，并给出最远飞行距离及对应的飞行速度；

（2）当*iExportTargetFlag*为1时，将在当前文件夹下产生一系列TargetPlateInfo_%d.txt的文本文件， %d表示对应的可穿透靶板的半径（当靶板上有颗粒时输出）。输出内容包括：颗粒ID号，颗粒组号，初始坐标X、Y、Z，方位角（Z轴方向为0°），当前坐标X、Y、Z，合速度及入射角。

#### 范例

```javascript
for(var i = 0; i < 10; i++)
{
    //飞散角、临界能量、每平方米上的颗粒数、导出文件、颗粒组号上下限
    pfly.ExportPeneCircleTargetInfo(39, 56, 1.0 / 56.0 ,1, 1, 2); 
}
```

<!--HJS_pfly_ExportPeneHeightTargetInfo-->

### ExportPeneHeightTargetInfo方法

#### 说明

输出可穿透靶板上的统计信息及每个靶板上的着靶颗粒信息(与pfly.CrtPeneHeightTarget()脚本配套使用)。

#### 格式定义

pfly.ExportPeneHeightTargetInfo( *fFlyAngle, fCriEnergy, fEffectDens, iGrp, jGrp[, iExportTargetFlag]* );

#### 参数

*fFlyAngle*：浮点型，飞散角（单位：°）。

*fCriEnergy*：浮点型，临界能量（单位：J）。

*fEffectDens*：浮点型，每平方米上颗粒的数量（单位：1/m<sup>2</sup>）。

*iGrp*：整型，被导出颗粒的组号下限（单位：无）。

*jGrp*：整型，被导出颗粒的组号上限（单位：无）。

*iExportTargetFlag*：整型，文件导入指标，0表示不导出文件，1表示导出文件，默认为1。

#### 备注

（1）执行该命令后，将会在软件文本输出框内输出不同靶板计算获得的有效破片数量及破片密度，并给出最远飞行距离及对应的飞行速度；

（2）当*iExportTargetFlag*为1时，将在当前文件夹下产生一系列TargetPlateInfo_%d.txt的文本文件， %d表示对应的可穿透靶板的半径（当靶板上有颗粒时输出）。输出内容包括：颗粒ID号，颗粒组号，初始坐标X、Y、Z，方位角（Z轴方向为0°），当前坐标X、Y、Z，合速度及入射角。

#### 范例

```javascript
for(var i = 0; i < 10; i++)
{
    //飞散角、临界能量、每平方米上的颗粒数、导出文件、颗粒组号上下限
    pfly.ExportPeneHeightTargetInfo(39, 56, 1.0 / 56.0 ,1, 1, 2); 
}
```

<!--HJS_pfly_ExportGroundTargetInfo-->

### ExportGroundTargetInfo方法

#### 说明

输出地面靶板上的信息（地面法向为Y正方向）。

#### 格式定义

pfly.ExportGroundTargetInfo( *fCriE, fx[2], fz[2], divno[2], fTargetB[2], iGrpL, iGrpU [, iExportFlag]* );

#### 参数

*fCriE*：浮点型，临界能量，当颗粒能量大于临界能量时进行统计（单位：J）。

*fx[2]*：Array浮点型，包含2个分量，X方向统计的下限及上限。

*fz[2]*：Array浮点型，包含2个分量，Z方向统计的下限及上限。

*divno[2]*：Array整型，包含2个分量，X、Z两个方向上分割的格子数，每个格子用于统计颗粒用。

*fTargetB[2]*：Array浮点型，包含2个分量，用于统计体密度用。

*iGrpL, iGrpU*：整型，颗粒组号的下限及上限。

*iExportFlag*：整型，文件导入指标，0表示不导出文件，1表示导出文件，默认为1。

#### 备注

（1）执行该命令后，将会在软件文本输出框内输出统计区域内的有效颗粒数量，面密度大于1的格子数及体密度大于1的格子数；

（2）当iExportFlag为1时，将在当前文件夹下产生一系列GroundTargetInfo.dat文本文件及GroundTarget_Tec.dat文本文件。GroundTargetInfo.dat文本文件通过顺序方式记录了每个格子的坐标、面密度、面平均动能、面平均落角、体密度。GroundTarget_Tec.dat文本文件则为统计信息按照TecPlot格式进行的输出。

#### 范例

```javascript
var fx = [-100, 100];
var fz = [-100, 100];
var divno = [100, 100];
var fTargetB = [0.0, 2.0];
pfly.ExportGroundTargetInfo (78.0, fx, fz, divno, fTargetB, 1, 2,1 );
```

<!--HJS_pfly_ExportGroundStatiInfo-->

### ExportGroundStatiInfo方法

#### 说明

按同心圆环的方式输出地面上颗粒的统计信息。

#### 格式定义

pfly.ExportGroundStatiInfo ( *fcx, fcy, fcz, fRadBegin, fRadStep, iRadNo, iGrpL, iGrpU* );

#### 参数

*fcx, fcy, fcz*：浮点型，地面统计的圆心坐标（单位：m）。

*fRadBegin*：浮点型，统计的起始半径（单位：m）。

*fRadStep*：浮点型，统计的半径步长（单位：m）。

*iRadNo*：整型，统计的环数。

*iGrpL, iGrpU*：整型，颗粒组号的下限及上限。

#### 备注

（1）执行该命令后，将会在当前文件夹下产生GroundStatiInfo.dat文件，该文件中包含了不同统计半径圆环内的颗粒数量、累计颗粒数量、平均合速度、平均入射角、平均动能、大于设定能量的颗粒数量等信息。

#### 范例

```javascript
pfly.ExportGroundStatiInfo (0.0, 0.0, 0.0, 20.0, 5.0, 20,1,10);
```

<!--HJS_pfly_ExportRigidFaceTargetInfo-->

### ExportRigidFaceTargetInfo方法

#### 说明

按同心圆环的方式输出地面上颗粒的统计信息。

#### 格式定义

pfly.ExportRigidFaceTargetInfo( *iGrpL, iGrpU* );

#### 参数

*iGrpL, iGrpU*：整型，刚性面组号的下限及上限。

#### 备注

（1）执行该命令后，将会在当前文件夹下产生RdFaceTargetInfo_Group_iGrp_jGrp.txt.文件，输出内容包括：颗粒ID号，颗粒组号，颗粒质量，初始坐标X、Y、Z，当前坐标X、Y、Z，速度分量X、Y、Z，合速度，入射角及着靶颗粒所在的刚性面组号。

#### 范例

```javascript
pfly.ExportRigidFaceTargetInfo (1,10);
```

