<!--HJS_pcmm_InterfaceFun-->

## PCMM接口函数

pcmm模块采用基于颗粒接触的无网格方法（PCMM）模拟大量粒子的连续介质力学行为，该模块所用到的粒子、初边值条件及材料性质等大部分可从pdyna模块中继承；同时，pcmm模块提供了pcmm本构模型的设定、特定材料参数的设定及关联以及特殊边界条件的设定等内容。

PCMM对象（pcmm）为用户提供了pcmm本构模型设定、pcmm特殊参数的设定及关联、pcmm特殊边界条件的设定等，具体见表4.1。

<div align = "center">表4.1pcmm接口函数列表</div>

<table>
    <tr>
        <th>序号</th><th>方法</th><th>说明</th>
    </tr>
        <td>1</td><td>SetModelByGroup</td><td rowspan="2">设置本构模型 </td>
    </tr>
        <td>2</td><td> SetModelByCoord</td>
    </tr>
        <td>3</td><td>SetKGVByGroup</td><td>单独设置体积模量、剪切模量及动力粘度</td>
    </tr>
        <td>4</td><td>  ApplyQuietBoundByCoord</td><td>施加静态边界条件（无反射）</td>
    </tr>
</table>

注：启用pcmm模块，必须通过dyna.Set(<>)接口函数，将"Particle_Cal_Type"设定为2，并设定合适的pcmm单元创建容差"PCMM_Elem_Tol"。

PCMM对应的本构包括线弹性本构、Drucker-Prager本构、Mohr-Coulomb本构、考虑应变软化效应的Mohr-Coulomb本构、考虑粘性效应的Mohr-Coulomb本构、流体模型、JohnsonCook模型、JWL爆源模型、空气绝热膨胀模型、Young模型等，具体如表4.2。

<div align = "center">表4.2颗粒的本构模型及描述</div>

| **模型名称**                       | **对应字符串** | **对应编号** | **关联命令及释义**                                           |
| :--------------------------------- | :------------- | :----------: | :----------------------------------------------------------- |
| 线弹性模型                         | "linear"       |      1       | 通过pdyna.SetMat…系列函数设置材料参数。                      |
| Drucker-Prager模型                 | "DP"           |      2       | 通过pdyna.SetMat…系列函数设置材料参数。 <br />通过dyna.Set函数设置"DP_Model_Option"，可以设置DP模型的三种形式（内部适应、等面积、外部适应）。 |
| Mohr-Coulomb模型                   | "MC"           |      3       | 通过pdyna.  SetMat…系列函数设置材料参数。                    |
| 考虑应变软化效应的Mohr-Coulomb模型 | "SoftenMC"     |      4       | 通过pdyna.  SetMat…系列函数设置材料参数。<br />通过dyna.Set函数设置"Block_Soften_Value"，可以设置体积膨胀极限应变及等效剪切极限应变；达到体积膨胀应变极限，抗拉强度为0；达到等效剪切极限应变，粘聚力为0。 <br />通过dyna.Set函数设置"If_Elem_Soften_K_G"，当单元处于软化阶段时，同时软化单元的体积模量及剪切模量。 |
| 考虑粘性效应的Mohr-Coulomb模型     | "ViscMC"       |      5       | 通过pdyna.SetMat…系列函数设置材料参数。<br />通过pcmm.SetKGVByGroup接口函数设置独立的体积模量、剪切模量及动力粘度。 |
| 流体模型                           | "Fluid"        |      6       | 通过pdyna.SetMat…系列函数设置材料参数。<br/>通过mpm.SetKGVByGroup接口函数设置独立的体积模量、剪切模量及动力粘度（此时剪切模量不重要）。 |
| JohnsonCook模型                    | "JC"           |      7       | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna.SetJCMat、pdyna.BindJCMat、pdyna.SetMGMat、pdyna.BindMGMat设置全局的JohnsonCook及MieGrueisen参数，并与颗粒进行关联。 |
| JWL爆源模型                        | "JWL"          |      8       | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna. SetJWLSource设置全局的JWL爆源模型参数、通过函数pdyna. BindJWLSource将全局参数与颗粒关联。 |
| 空气绝热膨胀模型                   | "Air"          |      9       | 通过pdyna.SetMat…系列函数设置基础材料参数（主要为密度）。<br/>通过pdyna. SetAirMat设置全局的空气模型参数、通过函数pdyna. BindAirMat将全局参数与颗粒关联。 |
| Young模型                          | "Young"        |      15      | 通过pdyna.SetMat…系列函数设置基础材料参数。等效拉伸应变由抗拉强度及弹性模量计算获得。<br>通过dyna.Set函数设置"Block_Soften_Value"，设置Young模型中损伤因子计算时的系数及指数，第一个为系数（一般为10^5~10^6量级），第二个为指数（一般为1-3）。 |

**注：**

（1）**当单元的本构为"linear"、"DP"、"MC"、"SoftenMC"、"ViscMC"时，通过dyna.Set设置"If_Bulk_Nolinear"，可以设置单元在体积压缩时是否执行非线性计算。**

（2）**上表中7-9号模型均需要设置全局的材料参数，然后将全局材料参数序号与pcmm颗粒的组号进行关联。**

（3）**颗粒模块与块体模块公用相同的全局材料列表，即通过颗粒模块设置全局材料后，块体模块可以直接使用，不需要块体模块再设置一遍，反之亦然。**

<!--HJS_pcmm_SetModelByGroup-->

### SetModelByGroup方法

#### 说明

当颗粒组号位于组号下限与上限之间，设置pcmm的本构模型。

#### 格式定义

pcmm.SetModelByGroup(<*sModelName*, *groupLow*, *groupUp*>);

#### 参数

*sModelName*：字符串型，pcmm的本构模型，必须为"linear"、 "DP"、 "MC"、 "SoftenMC"、 "ViscMC"、 "Fluid"、 "JC"、 "JWL"、 "Air"、 "Young"其中之一。

*groupLow*，*groupUp*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
//组号在1-11之间的颗粒对应的本构模型设定为线弹性模型
pcmm.SetModelByGroup("linear", 1,11);
```



<!--HJS_pcmm_SetModelByCoord-->

### SetModelByCoord 方法

#### 说明

当颗粒体心位于坐标下限及上限范围内时，设置 pcmm 的本构模型

#### 格式定义

pcmm.SetModelByCoord(<*sModelName,x0,x1,y0,y1,z0,z1*>);

#### 参数

*sModelName*：字符串型，pcmm 的本构模型，必须为"linear"、 "DP"、 "MC"、 "SoftenMC"、 "ViscMC"、 "Fluid"、 "JC"、 "JWL"、 "Air"、 "Young"其中之一。

*x0、x1*：浮点型，选择范围的 x 坐标下限及上限（单位：m）。

*y0、y1*：浮点型，选择范围的 y 坐标下限及上限（单位：m）。 

*z0、z1*：浮点型，选择范围的 z 坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
//坐标控制范围内的颗粒对应的本构模型设定为线弹性模型
pcmm.SetModelByCoord("linear", -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_pcmm_SetKGVByGroup-->

### SetKGVByGroup 方法

#### 说明

当颗粒组号位于组号下限与上限之间，设置pcmm的体积模量、剪切模量及动力粘度。

#### 格式定义

pcmm.SetKGVByGroup(<*K, G, V, groupLow, groupUp*>);

#### 参数

*K, G, V*：浮点型，分别表示体积模量（单位：Pa）、剪切模量（单位： Pa）及动力粘度（单位：Pa.s）。

*groupLow, groupUp*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
//组号在1-11之间的颗粒设定体积模量、剪切模量及动力粘度
pcmm.SetKGVByGroup(2.1e9, 0.0, 1e-3, 1,11);
```

<!--HJS_pcmm_ApplyQuietBoundByCoord-->

### ApplyQuietBoundByCoord 方法

#### 说明

当颗粒体心位于坐标下限及上限范围内时，设置无反射（静态）边界条件。

#### 格式定义

pcmm.ApplyQuietBoundByCoord(*x0,x1,y0,y1,z0,z1*);

#### 参数

*x0、x1*：浮点型，选择范围的 x 坐标下限及上限（单位：m）。

*y0、y1*：浮点型，选择范围的 y 坐标下限及上限（单位：m）。 

*z0、z1*：浮点型，选择范围的 z 坐标下限及上限（单位：m）。

#### 备注

当颗粒设定为静态边界条件的颗粒后，在进行动态计算时，将根据颗粒在三 个方向的速度自动在三个方向上施加速度反力，实现应力波的透射过程。

#### 范例

```javascript
pcmm.ApplyQuietBoundByCoord (-0.001, 0.001, -1e5, 1e5, -1e5, 1e5);
```

