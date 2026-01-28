<!--HJS_heatcd_interfacefun-->

## 热传导接口函数

热传导对象（heatcd）为用户提供了热传导材料性质施加、热传导边界条件施加、热传导初始条件施加等接口函数，具体见表4.3。单独计算热传导问题时，导入网格可采用接口函数blkdyn.ImportGrid(<>)。

<center>表4.3 热传导接口函数列表</center>

<table>
	<tr>
	    <th>序号</th><th>方法</th></th><th>说明</th>  
	</tr >
	    <td>1</td><td>SetPropByCoord</td><td rowspan="2">热传导节点材料参数的设置</td>
	</tr>
	    <td>2</td><td>SetPropByGroup</td>
	</tr>
	    <td>3</td><td>ApplyConditionByCoord</td><td rowspan="3">热传导节点边界条件的施加</td>
	</tr>
	    <td>4</td><td>ApplyConditionByPlane</td>
	</tr>
	    <td>5</td><td>ApplyConditionByCylinder</td>
	</tr>
	    <td>6</td><td>InitConditionByCoord</td><td rowspan="3">热传导节点信息的初始化</td>
	</tr>
	    <td>7</td><td>InitConditionByPlane</td>
	</tr>
	    <td>8</td><td>InitConditionByCylinder</td>
	</tr>
	    <td>9</td><td>GetNodeValue</td><td>获取热传导节点信息</td>
	</tr>
	    <td>10</td><td>SetNodeValue</td><td>设置热传导节点信息的值</td>
	</tr>
	    <td>11</td><td>Solver</td><td>热传导核心求解器，每一迭代步使用</td>
	</tr>
	    <td>12</td><td>CalNodeTemperature</td><td>计算节点温度</td>
	</tr>
	    <td>13</td><td>CalElemHeatTransfer</td><td>计算单元热流速</td>
	</tr>
	    <td>14</td><td>CalContactHeatTransfer</td><td>计算接触面的热传递</td>
	</tr>
</table>
注：热传导单元与固体单元共网格，材料信息及场信息均存储于节点上。

若想进行热传导计算，在创建或导入网格前，需通过dyna.Set(<>)设置"Config_Heat"包含热传导模型。在任何阶段，均可设置"Heat_Cal"开启或关闭热传导计算，设置"If_Contact_Transf_Heat"确定接触面是否可以透传热量。

<!--HJS_heatcd_SetPropByCoord-->

### SetPropByCoord方法

#### 说明

当热传导节点位于坐标控制范围之内时，对该节点施加对应的热传导参数。

#### 格式定义

heatcd.SetPropByCoord(<*fDensity, fInitTemp, fHeatTransCoeff, fSpecificHeat, fBulkExpansionCoeff, x0, x1, y0, y1, z0, z1*>);

#### 参数

*fDensity*：浮点型，固体的密度（单位：kg/m<sup>3</sup>）。

*fInitTemp*：浮点型，初始温度（单位：℃）。

*fHeatTransCoeff*：浮点型，热传导系数（单位：W/m/℃）。

*fSpecificHeat*：浮点型，比热容（单位：J/kg/℃）。

*fBulkExpansionCoeff*：浮点型，体膨胀系数（单位：1/℃）。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

执行该命令后，当前温度的值也设定为输入值，即与初始温度一致。

#### 范例

```javascript
heatcd.SetPropByCoord(1000, 30.1, 3.125, 1000 , 1e-3,-10, 10, -10, 10, -10, 10);
```

<!--HJS_heatcd_SetPropByGroup-->

### SetPropByGroup方法

#### 说明

当单元组号与设定组号一致时，对该单元所有节点施加对应的热传导参数。

#### 格式定义

heatcd.SetPropByGroup (<*fDensity, fInitTemp, fHeatTransCoeff, fSpecificHeat, fBulkExpansionCoeff, iGroup*>);

#### 参数

*fDensity*：浮点型，固体的密度（单位：kg/m<sup>3</sup>）。

*fInitTemp*：浮点型，初始温度（单位：℃）。

*fHeatTransCoeff*：浮点型，热传导系数（单位：W/m/℃）。

*fSpecificHeat*：浮点型，比热容（单位：J/kg/℃）。

*fBulkExpansionCoeff*：浮点型，体膨胀系数（单位：1/℃）。

*iGroup*：整型，选择的组号。

#### 备注

执行该命令后，当前温度的值也设定为输入值，即与初始温度一致。

#### 范例

```javascript
heatcd.SetPropByGroup(1000, 30.1, 3.125, 1000 , 1e-3, 5);
```

<!--HJS_heatcd_ApplyConditionByCoord-->

### ApplyConditionByCoord方法

#### 说明

当单元某节点（或某面面心）坐标位于坐标控制范围之内时，对该单元（或该面）所有节点施加对应的热传导边界条件。

#### 格式定义

heatcd.ApplyConditionByCoord (<*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1, ifBoundary* >);

#### 参数

*strVar*：字符串类型，可以为以下四个字符串之一，"temp"、"temp0"、及"source"。"temp0"-初始温度（单位：℃）；"temp"-当前温度（单位：℃）；"flux"-边界流量（单位：w/m<sup>2</sup>）（正值表示流出，负值表示流入，在云图中显示时乘以了面积，显示的是流量）；"source"-点源边界（单位：w/m<sup>3</sup>）（正值表示源，负值表示汇）。

*fValue*：浮点型，具体施加的基础值。

fArrayGrad：Array浮点型，包含3个分量，为三个方向的梯度。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*ifBoundary*：布尔型，是否为单元边界面。如果为true，则只选择自由面，此时用于判断范围的坐标为面心坐标；如果为false，则内部面也选择，此时判断范围的坐标为单元节点坐标。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 10.0, 0); //变化梯度
heatcd.ApplyConditionByCoord("temp",30.1, grad, -10, 10, -10, 10, -10, 10, true);
```

<!--HJS_heatcd_ApplyConditionByPlane-->

### ApplyConditionByPlane方法

#### 说明

当单元某节点（或某面面心）坐标到设定面的距离小于容差限定值（0.001m）时，对该单元（或该面）所有节点施加对应的热传导边界条件。

#### 格式定义

heatcd.ApplyConditionByPlane (<*strVar, fValue, fArrayGrad[3], fArrayN[3], fArrayOrigin[3], ifBoundary*>);

#### 参数

*strVar*：字符串类型，可以为以下四个字符串之一，"temp"、"temp0"、及"source"。"temp0"-初始温度（单位：℃）；"temp"-当前温度（单位：℃）；"flux"-边界流量（单位：w/m<sup>2</sup>）（正值表示流出，负值表示流入，在云图中显示时乘以了面积，显示的是流量）；"source"-点源边界（单位：w/m<sup>3</sup>）（正值表示源，负值表示汇）。

*fValue*：浮点型，具体施加的基础值。

*fArrayGrad*：Array浮点型，包含3个分量，为三个方向的梯度。

*fArrayN*：Array浮点型，包含3个分量，平面法向的3个分量。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点坐标（单位：m）。

*ifBoundary*：布尔型，是否为单元边界面。如果为true，则只选择自由面，此时用于判断范围的坐标为面心坐标；如果为false，则内部面也选择，此时判断范围的坐标为单元节点坐标。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0);//变化梯度
var ns = new Array(0, 1, 0); //法向分量
var origins = new Array(0, 1, 0); //平面内一点坐标
heatcd.ApplyConditionByPlane("flux", 1e-2, grad, ns, origins, false);
```

<!--HJS_heatcd_ApplyConditionByCylinder-->

### ApplyConditionByCylinder方法

#### 说明

当单元某节点（或某面面心）坐标位于某一空心圆柱内时，对该单元（或该面）所有节点施加对应的热传导边界条件。

#### 格式定义

heatcd.ApplyConditionByCylinder(<*strVar, fValue, fArrayGrad[3], x0, y0, z0, x1, y1, z1, fRad1, fRad2, ifBoundary*>)

#### 参数

*strVar*：字符串类型，可以为以下四个字符串之一，"temp"、"temp0"、及"source"。"temp0"-初始温度（单位：℃）；"temp"-当前温度（单位：℃）；"flux"-边界流量（单位：w/m<sup>2</sup>）（正值表示流出，负值表示流入，在云图中显示时乘以了面积，显示的是流量）；"source"-点源边界（单位：w/m<sup>3</sup>）（正值表示源，负值表示汇）。

*fValue*：浮点型，具体施加的基础值。

fArrayGrad：Array浮点型，包含3个分量，为三个方向的梯度。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

*ifBoundary*：布尔型，是否为单元边界面。如果为true，则只选择自由面，此时用于判断范围的坐标为面心坐标；如果为false，则内部面也选择，此时判断范围的坐标为单元节点坐标。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0); //变化梯度
heatcd.ApplyConditionByCoord("temp0", 30.1, grad,0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.4, 0.5, true);
```

<!--HJS_heatcd_InitConditionByCoord-->

### InitConditionByCoord方法

#### 说明

当单元某节点（或某面面心）坐标位于坐标控制范围之内时，对该单元（或该面）所有节点的对应参数进行初始化操作。

#### 格式定义

heatcd.InitConditionByCoord(<*strVar, fValue, fArrayGrad[3], x0, x1, y0, y1, z0, z1, ifBoundary*>)

#### 参数

*strVar*：字符串型，可初始化的变量名，只有"temp"一个（当前温度，单位：℃）；

*fValue*：浮点型，初始化操作的基础值。

fArrayGrad：Array浮点型，包含3个分量，为三个方向的梯度。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*ifBoundary*：布尔型，是否为单元边界面。如果为true，则只选择自由面，此时用于判断范围的坐标为面心坐标；如果为false，则内部面也选择，此时判断范围的坐标为单元节点坐标。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0); //变化梯度
heatcd.InitConditionByCoord("temp", 30.1, grad, -10, 10, -10, 10, -10, 10, true);
```

<!--HJS_heatcd_InitConditionByPlane-->

### InitConditionByPlane方法

#### 说明

当单元某节点（或某面面心）坐标到设定面的距离小于容差限定值（0.001m）时，对该单元（或该面）所有节点的对应变量执行初始化操作。

#### 格式定义

heatcd.InitConditionByPlane(<*strVar, fValue, fArrayGrad[3], fArrayN[3], fArrayOrigin[3], ifBoundary*>)

#### 参数

*strVar*：字符串型，可初始化的变量名，只有"temp"一个（当前温度，单位：℃）；

*fValue*：浮点型，初始化操作的基础值。

*fArrayGrad*：Array浮点型，包含3个分量，为三个方向的梯度。

*fArrayN*：Array浮点型，包含3个分量，平面法向的3个分量。

*fArrayOrigin*： Array浮点型，包含3个分量，平面一点坐标（单位：m）。

*ifBoundary*：布尔型，是否为单元边界面。如果为true，则只选择自由面，此时用于判断范围的坐标为面心坐标；如果为false，则内部面也选择，此时判断范围的坐标为单元节点坐标。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0);//变化梯度
var ns = new Array(0, 1, 0); //法向分量
var origins = new Array(0, 0, 0); //平面内一点坐标
heatcd.InitConditionByPlane("temp",30.1, grad, ns, origins, 0.3, true);
```

<!--HJS_heatcd_InitConditionByCylinder-->

### InitConditionByCylinder方法

#### 说明

当单元某节点（或某面面心）坐标位于某一空心圆柱内时，对该单元（或该面）所有节点对应的变量进行初始化操作。

#### 格式定义

heatcd.InitConditionByCylinder(<>)

#### 参数

*strVar*：字符串型，可初始化的变量名，只有"temp"一个（当前温度，单位：℃）；

*fValue*：浮点型，初始化操作的基础值。

fArrayGrad：Array浮点型，包含3个分量，为三个方向的梯度。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

*ifBoundary*：布尔型，是否为单元边界面。如果为true，则只选择自由面，此时用于判断范围的坐标为面心坐标；如果为false，则内部面也选择，此时判断范围的坐标为单元节点坐标。

#### 备注

#### 范例

```javascript
var grad = new Array(0, 1, 0); //变化梯度
heatcd.InitConditionByCoord("temp",30.1, grad, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.4, 0.5, true);
```

<!--HJS_heatcd_GetNodeValue-->

### GetNodeValue方法

#### 说明

获取热传导节点信息的值。

#### 格式定义

heatcd.GetNodeValue(<*iNode, strValueName>*);

#### 参数

*iNode*：整型，热传导节点ID号，从1开始；

*strValueName*：字符串型，可供获取的热传导节点变量名，**具体见附表8**。

#### 备注

#### 范例

```javascript
//获取100号节点对应的当前温度值
var value= heatcd.GetNodeValue(100, "Temp");
```

<!--HJS_heatcd_SetNodeValue-->

### SetNodeValue方法

#### 说明

设置热传导节点信息。

#### 格式定义

heatcd.SetNodeValue(<*iNode, strValueName, fValue*>)

#### 参数

*iNode*：整型，热传导节点ID号，从1开始；

*strValueName*：字符串型，可供设置的热传导节点变量名，**具体见附表8**。

*fValue*：浮点型，设定的值。

#### 备注

#### 范例

```javascript
//设置100号节点对应的当前温度值为30摄氏度
heatcd.SetNodeValue(100, "Temp",30);
```

<!--HJS_heatcd_Solver-->

### Solver方法

#### 说明

热传导核心求解器（每一迭代步使用）。该接口脚本是CalNodeTemperature、CalElemHeatTransfer、CalContactHeatTransfer的集成。

#### 格式定义

heatcd.Solver()

#### 参数

无。

#### 备注

返回值为温度增量绝对值的平均值，用于评价计算是否稳定。

#### 范例

```javascript
var unbal = heatcd.Solver();
```

<!--HJS_heatcd_CalNodeTemperature-->

### CalNodeTemperature方法

#### 说明

根据节点热流量增量计算节点温度增量，进行计算节点当前时刻问题。

#### 格式定义

heatcd. CalNodeTemperature ();

#### 参数

无。

#### 备注

返回值为温度增量绝对值的平均值，用于评价计算是否稳定。

#### 范例

```javascript
var unbal = heatcd.CalNodeTemperature();
```

<!--HJS_heatcd_CalElemHeatTransfer-->

### CalElemHeatTransfer方法

#### 说明

根据节点温度及热传导系数计算单元的热流速。

#### 格式定义

heatcd.CalElemHeatTransfer ();

#### 参数

无。

#### 备注

#### 范例

```javascript
heatcd.CalElemHeatTransfer();
```

<!--HJS_heatcd_CalContactHeatTransfer-->

### CalContactHeatTransfer方法

#### 说明

计算接触面间的热量透传。

#### 格式定义

heatcd.CalContactHeatTransfer ();

#### 参数

无。

#### 备注

#### 范例

```javascript
heatcd.CalContactHeatTransfer();
```



