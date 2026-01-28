<!--HJS_skwave_overview-->

## 冲击波模块

主要介绍冲击波模块特有的接口函数，此类接口函数的对象名为skwave，具体包括冲击波网格创建、计算模型及参数设置、初边值条件设定、单元及节点信息获取及设置等。

冲击波模块涉及的特有JavaScript接口函数如下表。

<div align = "center">冲击波模块涉及的特有接口函数</div>

<table>
  	<tr>
		<th>序号</th><th>函数名</th><th>说明</th>
	</tr>
    	<td>1</td><td>DefMesh</td><td>创建二维、三维计算域的正交网格。</td>
	</tr>
    	<td>2</td><td>SetSolid</td><td rowspan=4>设置固体域（不进行流体计算）</td>
	</tr>
    	<td>3</td><td>SetSolidBySphere</td>
	</tr>
    	<td>4</td><td>SetSolidByCylinder</td>
	</tr>
    	<td>5</td><td>SetSolidByPolygon</td>
	</tr>
    	<td>6</td><td>SetGasCloud</td><td rowspan=4>设置可燃气云（设定为1的区域可进行气云燃爆计算）</td>
	</tr>
    	<td>7</td><td>SetGasCloudBySphere</td>
	</tr>
    	<td>8</td><td>SetGasCloudByCylinder</td>
	</tr>
    	<td>9</td><td>SetGasCloudByPolygon</td>
	</tr>
    	<td>10</td><td>SetFirePos</td><td>设置可燃气云点火的位置及参数</td>
	</tr>
    	<td>11</td><td>Init</td><td rowspan=4>初始化流体参数</td>
	</tr>
    	<td>12</td><td>InitBySphere</td>
	</tr>
    	<td>13</td><td>nitByCylinder</td>
	</tr>
    	<td>14</td><td>InitByPolygon</td>
	</tr>
    	<td>15</td><td>SetBound</td><td>设置周边出流条件（透射或固壁）</td>
    </tr>
    	<td>16</td><td>SetInflow</td><td>设置周边出流条件</td>
    </tr>
    	<td>17</td><td>SetGama</td><td>设置绝热指数的计算形式</td>
    </tr>
    	<td>18</td><td>InheritSolid</td><td>从BlockDyna、PDyna中继承固体域</td>
    </tr>
    	<td>19</td><td>GetNodeValue</td><td>获得节点信息</td>
	</tr>
    	<td>20</td><td>SetNodeValue</td><td>设置节点信息</td>
    </tr>
    	<td>21</td><td>GetNodeID</td><td>根据坐标获取节点Id号</td>
	</tr>
</table>


为了进行可燃气体的燃爆计算，需要将全局开关量" SK_GasModel"设置为2。

<!--HJS_skwave_DefMesh-->

### DefMesh方法

#### 说明

设置二维、三维的流体计算域正交网格。

#### 格式定义

skwave.DefMesh(< *nDim*, *afLength*[*nDim*], *anDiv*[*nDim*] [, *afOrigin*[*nDim*] ]>);

#### 参数

*nDim*：整型，计算域维度，只能为2或3，代表二维或三维。

*afLength*[*nDim*]：Array浮点型，每个维度方向上的计算长度，包含*nDim*个分量，单位（m）。

*anDiv*[*nDim*]：Array整型，每个维度方向上的节点分割数，包含*nDim*个分量，大于等于2。

*afOrigin*[*nDim*]：Array浮点型，原点坐标，包含*nDim*个分量，可以不写，默认为（0,0,0）。

####  备注

此脚本函数包含两种使用方法，第一种不需要输入afOrigin，第二种输入afOrigin。

#### 范例

```javascript
//创建100m×100m，每个方向分割50个点的二维计算流体域
skwave.DefMesh(2, [100.0, 100.0], [50, 50]);
//创建100m×100m，每个方向分割50个点，坐标起始点为(50,0,0)的三维计算流体域
skwave.DefMesh(3, [100.0, 100.0, 100.0], [50, 50, 50], [50, 0, 0]);
```

<!--HJS_skwave_SetSolid-->

### SetSolid方法

#### 说明

根据坐标设置固体区域（该区域不执行流体计算）。

#### 格式定义

skwave.SetSolid(<*iType [, fXL, fXU, fYL, fYU, fZL, fZU]*>);

#### 参数

*iType*：整型，固体区域标记，只能为0或1，0表示流体区域，1表示固体区域。

*fXL, fXU*：浮点型，X方向的坐标下限及上限，单位（m）。

*fYL, fYU*：浮点型，Y方向的坐标下限及上限，单位（m）。

*fZL, fZU*：浮点型，Z方向的坐标下限及上限，单位（m）。

#### 备注

此脚本函数包含两种使用方法，第一种不需要输入控制范围，默认为所有的区域都进行对应的设置；第二种需要输入控制范围，凡是计算节点落在该范围内，则进行对应的设置。

#### 范例

```javascript
//所有区域设置为流体区域
skwave.SetSolid(0);
//当计算域节点落在X[-5,5]，Y[0,10]，Z[0,5]之内，则设置为固体区域
skwave.SetSolid(1, -5, 5, 0, 10, 0, 5);
```

<!--HJS_skwave_SetSolidBySphere-->

### SetSolidBySphere方法

#### 说明  

根据输入的球体区域确定固体区域（该区域不执行流体计算）。

#### 格式定义

skwave.SetSolidBySphere(<*iType, fCenter[3], fRad*>);

#### 参数

*iType*：整型，固体区域标记，只能为0或1，0表示流体区域，1表示固体区域。

*fCenter*：Array浮点型，包含3个分量，球体的中心（单位：m）。

*fRad*：浮点型，球体的半径，单位（m）。

#### 备注

#### 范例

```javascript
//对位于半径1m，中心点在(3,3,3)的球内的节点设置为固体区域
skwave.SetSolidBySphere(1, [3,3,3], 1.0);
```

<!--HJS_skwave_SetSolidByCylinder-->

### SetSolidByCylinder方法

#### 说明  

根据输入的圆柱区域确定固体区域（该区域不执行流体计算）。

#### 格式定义

skwave.SetSolidByCylinder(<*iType, fEnd1[3], fEnd2[3], fRadIn, fRadOut*>);

#### 参数

*iType*：整型，固体区域标记，只能为0或1，0表示流体区域，1表示固体区域。

*fEnd1[3]*：Array浮点型，包含3个分量，圆柱轴向上第一个端点的坐标（单位：m）。

*fEnd2[3]*：Array浮点型，包含3个分量，圆柱轴向上第二个端点的坐标（单位：m）。

*fRadIn*：浮点型，圆柱体的内半径，单位（m）。

*fRadOut*：浮点型，圆柱体的外半径，单位（m）。

#### 备注

若流体区域的节点位于内、外圆柱面之间，则执行对应的区域设定。

#### 范例

```javascript
//根据圆柱体区域设定固体区域
skwave.SetSolidByCylinder(1, [0,0,0], [1,0,0], 0.1, 1.0);
```

<!--HJS_skwave_SetSolidByPolygon-->

### SetSolidByPolygon方法

#### 说明

根据输入的多边形区域域确定固体区域（该区域不执行流体计算）。

#### 格式定义

skwave.SetSolidByPolygon(<*iType, afCoord[N][3]*>);

#### 参数

*iType*：整型，固体区域标记，只能为0或1，0表示流体区域，1表示固体区域。

*afCoord[N][3]*：Array浮点型，二维数组，N为多边形节点个数，每个点包含3个分量（单位：m）。

#### 备注

节点个数≥3，节点按顺时针或逆时针排列。

目前仅根据坐标在XY平面内的投影进行判断，若流体研究域的点位于XY平面投影多边形的范围内，则进行相应的设定。

#### 范例

```javascript
//根据多边形区域设定固体区域
skwave.SetSolidByPolygon(1, [0,0,0,  1,0,0,  1,1,0]);
//根据多边形区域设定固体区域
var aCoord = new Array(3);
aCoord[0] = [0, 0, 0];
aCoord[1] = [1, 0, 0];
aCoord[2] = [1, 1, 0];
skwave.SetSolidByPolygon(1, aCoord);
```

<!--HJS_skwave_SetGasCloud-->

### SetGasCloud方法

#### 说明

根据坐标设置可燃气云区域（该区域可执行可燃气云燃爆计算）。

#### 格式定义

skwave.SetGasCloud(<*iType [, fXL, fXU, fYL, fYU, fZL, fZU]*>);

#### 参数

*iType*：整型，可燃气云区域标记，只能为0或1，0表示普通气体区域，1表示可燃气体区域。

*fXL, fXU*：浮点型，X方向的坐标下限及上限，单位（m）。

*fYL, fYU*：浮点型，Y方向的坐标下限及上限，单位（m）。

*fZL, fZU*：浮点型，Z方向的坐标下限及上限，单位（m）。

#### 备注

此脚本函数包含两种使用方法，第一种不需要输入控制范围，默认为所有的区域都进行对应的设置；第二种需要输入控制范围，凡是计算节点落在该范围内，则进行对应的设置。

进行可燃气云设置，只有当节点的属性为气体属性时才能设置（不是固体）。

####  范例

```javascript
//所有区域设置为普通气体区域
skwave.SetGasCloud(0);
//当计算域节点落在X[-5,5]，Y[0,10]，Z[0,5]之内，则设置为可燃气体区域
skwave.SetGasCloud(1, -5, 5, 0, 10, 0, 5);
```

<!--HJS_skwave_SetGasCloudBySphere-->

### SetGasCloudBySphere方法

#### 说明  

根据输入的球体区域确定可燃气云区域（该区域可执行可燃气云燃爆计算）。

#### 格式定义

skwave.SetGasCloudBySphere(<*iType, fCenter[3], fRad*>);

#### 参数

*iType*：整型，可燃气云区域标记，只能为0或1，0表示普通气体区域，1表示可燃气体区域。

*fCenter*：Array浮点型，包含3个分量，球体的中心（单位：m）。

*fRad*：浮点型，球体的半径，单位（m）。

#### 备注

进行可燃气云设置，只有当节点的属性为气体属性时才能设置（不是固体）。

#### 范例

```javascript
//对位于半径1m，中心点在(3,3,3)的球内的节点设置为可燃气体区域
skwave.SetGasCloudBySphere(1, [3,3,3], 1.0);ja
```

<!--HJS_skwave_SetGasCloudByCylinder-->

### SetGasCloudByCylinder方法

#### 说明  

根据输入的圆柱区域确定可燃气云区域（该区域可执行可燃气云燃爆计算）。

#### 格式定义

skwave.SetGasCloudByCylinder(<*iType, fEnd1[3], fEnd2[3], fRadIn, fRadOut*>);

#### 参数

*iType*：整型，可燃气云区域标记，只能为0或1，0表示普通气体区域，1表示可燃气体区域。

*fEnd1[3]*：Array浮点型，包含3个分量，圆柱轴向上第一个端点的坐标（单位：m）。

*fEnd2[3]*：Array浮点型，包含3个分量，圆柱轴向上第二个端点的坐标（单位：m）。

*fRadIn*：浮点型，圆柱体的内半径，单位（m）。

*fRadOut*：浮点型，圆柱体的外半径，单位（m）。

#### 备注

若流体区域的节点位于内、外圆柱面之间，则执行对应的区域设定。

进行可燃气云设置，只有当节点的属性为气体属性时才能设置（不是固体）。

#### 范例

```javascript
//根据圆柱体区域设定可燃气体区域
skwave.SetGasCloudByCylinder(1, [0,0,0], [1,0,0], 0.1, 1.0);
```

<!--HJS_skwave_SetGasCloudByPolygon-->

### SetGasCloudByPolygon方法

#### 说明

根据输入的多边形区域域确定可燃气体区域（该区域可执行可燃气云燃爆计算）。

#### 格式定义

skwave.SetGasCloudByPolygon(<iType, afCoord[N][3]>);

#### 参数

*iType*：整型，可燃气云区域标记，只能为0或1，0表示普通气体区域，1表示可燃气体区域。

*afCoord[N][3]*：Array浮点型，二维数组，N为多边形节点个数，每个点包含3个分量（单位：m）。

#### 备注

节点个数≥3，节点按顺时针或逆时针排列。

目前仅根据坐标在XY平面内的投影进行判断，若流体研究域的点位于XY平面投影多边形的范围内，则进行相应的设定。

进行可燃气云设置，只有当节点的属性为气体属性时才能设置（不是固体）。

#### 范例

```javascript
//根据多边形区域设定可燃气云区域
skwave.SetGasCloudByPolygon(1, [0,0,0,  1,0,0,  1,1,0]);
//根据多边形区域设定可燃气云区域
var aCoord = new Array(3);
aCoord[0] = [0, 0, 0];
aCoord[1] = [1, 0, 0];
aCoord[2] = [1, 1, 0];
skwave. SetGasCloudByPolygon(1, aCoord);
```

<!--HJS_skwave_SetFirePos-->

### SetFirePos方法

#### 说明

设置可燃气体球形点火点位置及点火参数。

#### 格式定义

skwave.SetFirePos(<*fCX, fCY, fCZ, fRad, fDens, fRadVel, fPres*>);

#### 参数

*fCX, fCY, fCZ*：浮点型，点火点的坐标（单位：m）。

*fRad*：浮点型，点火半径（单位：m）。

*fDens*：浮点型，点火区域燃烧后的密度（单位：kg/m<sup>3</sup>）。

*fRadVel*：浮点型，点火区域燃烧后的径向速度（单位：m/s）。

*fPres*：浮点型，点火区域燃烧后的压力（单位：Pa）。

#### 备注

点火区域的流速将随着径向距离的增大而线性增大到设定值（中心点的速度为0，边缘点的速度为*fRadVel*）。

#### 范例

```javascript
//球形点火区域的球形坐标[300,250,250]，半径=20m，点火后气体密度=1.945kg/m3，点火后的流速=416.2m/s，点火区域的压力=0.627MPa。
skwave.SetFirePos(300, 250, 250, 20, 1.945, 4.162E2,  6.27E5);
```

<!--HJS_skwave_Init-->

### Init方法

#### 说明

根据坐标区域对流体域参数进行初始化。

#### 格式定义

skwave.Init(<*fPressure, fDensity, fVel[3] [, fXL, fXU, fYL, fYU, fZL, fZU]*>);

#### 参数

*fPressure*：浮点型，压力，单位（Pa）。

*fDensity*：浮点型，密度，单位（kg/m3）。

*fVel[3]*：Array浮点型，包含3个分量，流速，单位（m/s）。

*fXL, fXU*：浮点型，X方向的坐标下限及上限，单位（m）。

*fYL, fYU*：浮点型，Y方向的坐标下限及上限，单位（m）。

*fZL, fZU*：浮点型，Z方向的坐标下限及上限，单位（m）。

#### 备注

此脚本函数包含两种使用方法，第一种不需要输入控制范围，默认为所有的区域都初始化为设定值；第二种需要输入控制范围，凡是计算节点落在该范围内，则初始化为设定值。

#### 范例

```javascript
//所有区域都进行初始化，初始化压力为1MPa，密度为1.03kg/m3，三个方向流速均为0。
skwave.Init(1e6, 1.03, [0,0,0]);
//当计算域节点落在X[-5,5]，Y[0,10]，Z[0,5]之内，则进行初始化。初始化压力为1MPa，密度为1.03kg/m3，三个方向流速均为0。
skwave. Init(1e6, 1.03, [0,0,0],1, -5, 5, 0, 10, 0, 5);
```

<!--HJS_skwave_InitBySphere-->

### InitBySphere方法

#### 说明  

根据输入的球体区域对流体域进行初始化。

#### 格式定义

skwave.InitBySphere(<*fPressure, fDensity, fVel[3], fCenter[3], fRad*>);

#### 参数

*fPressure*：浮点型，压力，单位（Pa）。

*fDensity*：浮点型，密度，单位（kg/m<sup>3</sup>）。

*fVel[3]*：Array浮点型，包含3个分量，流速，单位（m/s）。

*fCenter*：Array浮点型，包含3个分量，球体的中心（单位：m）。

*fRad*：浮点型，球体的半径，单位（m）。

#### 备注

#### 范例

```javascript
//对位于半径1m，中心点在(3,3,3)的球内的节点进行初始化
skwave.InitBySphere(1e6, 1.03, [0,0,0], [3,3,3], 1.0);
```

<!--HJS_skwave_InitByCylinder-->

### InitByCylinder方法

#### 说明  

根据输入的圆柱区域进行初始化。

#### 格式定义

skwave.InitByCylinder(<*fPressure, fDensity, fVel[3], fEnd1[3], fEnd2[3], fRadIn, fRadOut*>);

#### 参数

*fPressure*：浮点型，压力，单位（Pa）。

*fDensity*：浮点型，密度，单位（kg/m<sup>3</sup>）。

*fVel[3]*：Array浮点型，包含3个分量，流速，单位（m/s）。

*fEnd1[3]*：Array浮点型，包含3个分量，圆柱轴向上第一个端点的坐标（单位：m）。

*fEnd2[3]*：Array浮点型，包含3个分量，圆柱轴向上第二个端点的坐标（单位：m）。

*fRadIn*：浮点型，圆柱体的内半径，单位（m）。

*fRadOut*：浮点型，圆柱体的外半径，单位（m）。

#### 备注

若流体区域的节点位于内、外圆柱面之间，则执行对应的初始化操作。

#### 范例

```javascript
//根据圆柱体区域设定固体区域
skwave.InitByCylinder (1e5, 1.01, [0,0,0], [0,0,0], [1,0,0], 0.1, 1.0);
```

<!--HJS_skwave_InitByPolygon-->

### InitByPolygon方法

#### 说明

根据输入的多边形区域域进行初始化。

#### 格式定义

skwave.InitByPolygon(<fPressure, fDensity, fVel[3], afCoord[N][3]>);

#### 参数

*fPressure*：浮点型，压力，单位（Pa）。

*fDensity*：浮点型，密度，单位（kg/m<sup>3</sup>）。

*fVel[3]*：Array浮点型，包含3个分量，流速，单位（m/s）。

*afCoord[N][3]*：Array浮点型，二维数组，N为多边形节点个数，每个点包含3个分量（单位：m）。

#### 备注

节点个数≥3，节点按顺时针或逆时针排列。

目前仅根据坐标在XY平面内的投影进行判断，若流体研究域的点位于XY平面投影多边形的范围内，则进行相应的设定。

#### 范例

```javascript
//根据多边形区域设定固体区域
skwave.InitByPolygon(1e5, 1.01, [0,0,0], [0,0,0,  1,0,0,  1,1,0]);
//根据多边形区域设定固体区域
var aCoord = new Array(3);
aCoord[0] = [0, 0, 0];
aCoord[1] = [1, 0, 0];
aCoord[2] = [1, 1, 0];
skwave. InitByPolygon(1e5, 1.01, [0,0,0], aCoord);
```

<!--HJS_skwave_SetBound-->

### SetBound方法

#### 说明

设置模型四周的出流条件。

#### 格式定义

skwave.SetBound(<*iBX1, iBX2, iBY1, iBY2 [,iBZ1, iBZ2]*>);

#### 参数

*iBX1, iBX2*：整型，X方向两侧的出流条件，只能为0或1，0为透射条件，1为固壁条件。

*iBY1, iBY2*：整型，X方向两侧的出流条件，只能为0或1，0为透射条件，1为固壁条件。

*iBZ1, iBZ2*：整型，X方向两侧的出流条件，只能为0或1，0为透射条件，1为固壁条件。

#### 备注

（1）  若所研究的为二维问题，则*iBZ1, iBZ2*不用输入。

（2）  软件默认四周为透射边界。

#### 范例

```javascript
//设置所有的边界为固壁边界。
skwave.SetBound(1, 1, 1, 1, 1, 1);
```

<!--HJS_skwave_SetInflow-->

### SetInflow方法

#### 说明

设置模型四周的入流条件。

#### 格式定义

skwave.SetInflow(<*nId, iActFlag, iBoundPos, fDens, fVel, fPres [,nRegionType, aRegionV]*>);

#### 参数

*nId*：整型，边界入流条件ID号，为从1开始的自然数。

*iActFlag*：整型，激活标记，只能为0及1；若为0，为非激活状态，该Id号设置的入流条件不起作用；若为1，为激活状态。

*iBoundPos*：整型，边界位置代号，只能为1~6（二维模拟时为1~4），分别表示X下限、X上限、Y下限、Y上限、Z下限、Z上限。

*fDens*：浮点型，入流位置密度，单位（kg/m3）。

*fVel*：浮点型，入流速度，垂直于入流面，正值表示入流，负值表示出流，单位（m/s）。

*fPres*：浮点型，入流压力，单位（Pa）。

*nRegionType*：整型，范围控制类型代号，只能为1~3，1表示对应位置全部选择，2表示长方体框选，3表示球形框选。

*aRegionV*：Array浮点型，当*nRegionType*为1时，该数组不起作用，但该变量必须传入；当*nRegionType*为2时，变量个数为6个，分别代表X下限坐标、X上限坐标、Y下限坐标、Y上限坐标、Z下限坐标、Z上限坐标。当*nRegionType*为3时，变量个数为4个，分别表示球形坐标（XC、YC、ZC）及球体半径（单位：m）。

#### 备注

*nRegionType*及*aRegionV*可以同时不写，即传入前6个量，表示边界位置的节点全部选择施加入流条件。

#### 范例

```javascript
//设置X下限位置的入流条件为：密度130kg/m3，速度1000m/s，压力10MPa。
skwave.SetInflow(1, 1, 1, 130, 1000, 1e7);

//通过长方体框选设置入流条件
skwave.SetInflow(1, 1, 4, 130, 1000, 1e7, 2, [6,8,9,11,-1,1]);

//通过球形框选设置入流条件，球心坐标(5,0,0)，球体半径2m
skwave.SetInflow(1, 1, 3, 130, 1000, 1e7, 3, [5,0,0,2]);
```

<!--HJS_skwave_SetGama-->

### SetGama方法

#### 说明

设置绝热指数的计算形式。

#### 格式定义

共包含如下2种形式

skwave.SetGama(<*nMode* [, *fDens*, *fD*, *fQ*, *fGama1*, *fGama2*]>);

skwave.SetGama(<*nMode* [, *afValue*[N][2]]>);

#### 参数

*nMode*：整型，绝热指数的计算形式，只能为1、2、3。

*fDens*：浮点型，炸药密度（单位：kg/m3）。

*fD*：浮点型，爆速（单位：m/s）。

*fQ*：浮点型，爆热（单位：J/kg）。

*fGama1*：浮点型，高压段绝热指数，一般取3。

*fGama2*：浮点型，低压段绝热指数，一般取4/3。

*afValue*：Array浮点型，压力-绝热指数数据对（P-Gama数据对）。

#### 备注

（1）*nMode*只能为1~3，1表示采用常绝热指数进行计算（采用设置全局变量"SK_Gama"来设置常绝热指数），2表示根据朗道爆源模型进行计算，3表示根据P-Gama数据对插值进行计算。如果nMode为1，则不需要输入朗道模型参数或P-Gama数据对参数。

（2）本命令与dyna.Set("SK_GamaMode")有类似功能，只是通过设置"SK_GamaMode"，只能采用内置的参数进行计算。而采用本命令，则可以指定不同的参数。

（3）当*nMode*为2时，朗道模型起作用，*fDens*、*fD*、*fQ*、*fGama1*、*fGama2*均为朗道模型的参数，当某节点的压力大于等于朗道模型中的临界压力（Pk），绝热指数设定为*fGama1*；反之，绝热指数设定为*fGama2*。

（4）当*nMode*为3时，P-Gama数据对起作用，数据对个数至少为2，且压力从小到大排列。

#### 范例

```javascript
//设置Gama的计算模型是朗道模型模式
skwave.SetGama(2,1620.0, 6930.0, 4.5e6, 3.0, 4.0 / 3.0);

//设置Gama的计算模式为常Gama模式
skwave. SetGama (1);

//设置Gama的计算模式为根据P-Gama数据对插值获得Gama
skwave. SetGama (3, [1e6, 1.333, 1e7, 1.8, 1e8, 2.2, 1e9, 3.0]);
```

<!--HJS_skwave_InheritSolid-->

### InheritSolid方法

#### 说明

根据BlockDyna的块体或PDyna的颗粒进行固体域的设定。

#### 格式定义

skwave.InheritSolid();

#### 参数

#### 备注

当流体域节点位于块体或颗粒内部，则将该节点设定为固体域。

#### 范例

```javascript
//根据块体或颗粒设定固体域
skwave.InheritSolid ();
```

<!--HJS_skwave_GetNodeValue-->

### GetNodeValue方法

#### 说明

获得冲击波模块某一Id节点的信息。

####  格式定义

skwave.GetNodeValue(<*NodeId*, *strName*>);

#### 参数

NodeID，整型，节点序号，大于等于1的自然数。

*strName**，*字符串型，变量名，具体见附表2。

#### 备注

返回值为浮点型的节点信息；若节点Id非法返回-1，变量名非法返回-2。

#### 范例

```javascript
//得到节点1的压力，并进行打印
var Pressure = skwave.GetNodeValue(1,"press");
print(Pressure);
```

<!--HJS_skwave_SetNodeValue-->

### SetNodeValue方法

#### 说明

设置冲击波模块某一Id节点的信息。

####  格式定义

skwave.SetNodeValue(<*NodeId*, *strName*, *fValue*>);

#### 参数

*NodeID*，整型，节点序号，大于等于1的自然数。

*strName**，*字符串型，变量名，具体见附表2。

*fValue*，浮点型，需要设置的变量值。

#### 备注

设置成功，返回0；节点Id非法返回-1，变量名非法返回-2。

#### 范例

```javascript
//设置节点1的压力为1e6 Pa，并进行返回值
var retV = skwave.SetNodeValue(1,"press", 1e6);
print(retV);
```

<!--HJS_skwave_GetNodeID-->

### GetNodeID方法

#### 说明

获得离某一输入坐标最近的节点的ID号。

#### 格式定义

skwave.GetNodeID(<*fX*, *fY*, *fZ*>);

#### 参数

*fX*, *fY*, *fZ*，浮点型，空间某坐标的三个分量值（单位：m）。

#### 备注

若存在冲击波单元的节点，范围节点ID（大于等于1的自然数）；若模型中部存在冲击波单元的节点，返回-1。

#### 范例

```javascript
//返回离坐标(5,5,5)最近的节点Id号
var Id = skwave.GetNodeID(5,5,5);
```

<!--HJS_skwave_AppendGlobalPara-->

### 可供设置及获取的冲击波相关的全局变量

详解附表1.9。

<!--HJS_skwave_AppendNodeInfo-->

### 可供设置及获取的冲击波节点信息

详见附表19。