<!--HJS_bar_interfacefun-->

## 杆件单元接口函数

杆件对象（bar）为用户提供了杆件到创建及导入、杆件模型设置、杆件材料参数施加、杆件边界条件施加、杆件变量的获取及设置等多类接口函数，具体见表4.4。

<center>表4.4 杆件接口函数列表</center>

<table>
	<tr>
	    <th>序号</th><th>方法</th></th><th>说明</th>  
	</tr >
	    <td>0</td><td>GetMesh</td><td>从Genvi平台获取网格并加载到杆件求解器。</td>
	</tr>	
	</tr >
	    <td>1</td><td>Import</td><td>从外部文件导入杆件网格。</td>
	</tr>
	    <td>2</td><td>CreateByCoord</td><td>通过两点坐标创建单一的杆件。</td>
	</tr>
	    <td>3</td><td>CreateByDir</td><td>通过原点、方向及长度创建单一的杆件。。</td>
	</tr>
	    <td>4</td><td>SetGroupByID</td><td>	杆件的分组。</td>
	</tr>
	    <td>5</td><td>SetTypeByGroup</td><td>	杆件类型（锚杆、锚索、桩等）设置。</td>
	</tr>
	    <td>6</td><td>SetModelByID</td><td rowspan="2">	设定杆件的模型。</td>
	</tr>
	    <td>7</td><td>SetModelByGroup</td>
	</tr>
		<td>8</td><td>SetPropByID</td><td rowspan="4">设置杆件的材料参数。</td>
	</tr>
	    <td>9</td><td>SetPropByGroup</td>
	</tr>
	    <td>10</td><td>SetPropByCoord</td>
	</tr>
	    <td>11</td><td>SetLengthAndWidthByID</td>
	</tr>
		<td>12</td><td>FixVelByCoord</td><td rowspan="3">约束杆件某些节点的平动或转动速度。</td>
	</tr>
	    <td>13</td><td>FixVelByID</td>
	</tr>
	    <td>14</td><td>FixRotateVelByID</td>
	</tr>
		<td>15</td><td>ApplyForceByCoord</td><td rowspan="3">对杆件的某些节点施加全局坐标系下的力或力矩。</td>
	</tr>
	    <td>16</td><td>ApplyForceByID</td>
	</tr>
	    <td>17</td><td>ApplyMomentByID</td>
	</tr>
	    <td>18</td><td>ApplyGravity</td><td>对所有杆件施加重力。</td>
	</tr>
	    <td>19</td><td>ApplyPreTenForce</td><td>对杆件某些节点施加预应力。</td>
	</tr>
	    <td>20</td><td>BindLandauSource</td><td>对某些杆件关联朗道爆源模型的材料号。</td>
	</tr>
	    <td>21</td><td>GetBarInfo</td><td>获取每根杆件的信息。</td>
	</tr>
	    <td>22</td><td>GetSegValue</td><td>获取杆件中某个单元的信息。</td>
	</tr>
	    <td>23</td><td>GetNodeValue</td><td>获取杆件中某个节点的信息。</td>
	</tr>
	    <td>24</td><td>SetBarInfo</td><td>设置整根杆件的信息。</td>
	</tr>
	    <td>25</td><td>SetSegValue</td><td>设置杆件中某单元信息。</td>
	</tr>
	    <td>26</td><td>SetNodeValue</td><td>设置杆件中某节点信息。</td>
	</tr>
	    <td>27</td><td>Solver</td><td>杆件核心求解器，每一迭代步使用。</td>
	</tr>
</table>


若希望进行杆件计算，导入或创建杆件单元，设置相关参数及边界条件后，可通过dyna.Set(<>)设置"If_Cal_Bar"开启杆件计算，通过设置"BlastPAttenRatio"设定杆件爆源模型"BlastHole1"和"RadialUncoupling_BlastHole1"的压力衰减指数。

<!--HJS_bar_GetMesh-->

### GetMesh方法

#### 说明

从Genvi平台获取网格并加载到杆件求解器。

#### 格式定义

bar.GetMesh (<*mesh, [strBarType]*>);

#### 参数

*mesh*：网格对象。

*strBarType*：字符串型，杆件单元类型，目前支持："bolt"、"cable"、"pile"、"post"、"beam"、"BlastHole1"、"BlastHole2"、"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"，大小写均可。该参数可以不写，默认为"bolt"。

#### 备注

#### 范例

```javascript
//利用平台的imesh模块导入ansys网格
var msh1 = imesh.importAnsys("bar.dat");
//将平台的网格加载到bar核心求解器
bar.GetMesh(msh1);
//带杆件单元类型的导入
bar.GetMesh(msh1,"pile");
```

<!--HJS_bar_Import-->

### Import方法

#### 说明

从外部文件导入杆件模型。

#### 格式定义

bar.Import(<*strFileType, strBarType, strFilename*>) 

#### 参数

*strFileType*：字符串型，网格导入类型，目前支持："patran"、"ansys"、"GiD"、"Midas"、"Genvi"等5类，大小写均可。

*strBarType*：字符串型，杆件单元类型，目前支持："bolt"、"cable"、"pile"、"post"、"beam"、"BlastHole1"、"BlastHole2"、"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"，大小写均可。

*strFilename*：字符串型，文件路径及文件名。

#### 备注

炮孔类型1（"BlastHole1"或"RadialUncoupling_BlastHole1"）时，杆件可任意插入实体单元内部，炮孔传递给实体单元应力，实体单元传递给炮孔体应变；炮孔类型2（"BlastHole2"）时，杆件单元与实体单元的边必需重合，杆件传递给实体单元的边界法向力，实体单元传递给杆件单元平均位移（用于计算半径的改变）。

从外部文件导入杆件单元时，每根杆件仅包含1个Segment（一个单元）。

#### 范例

```javascript
//从GiD导入文件名为test.msh的杆件文件，并设定杆件类型为bolt
bar.Import("GiD", "bolt", "c:/test.dat");
```

<!--HJS_bar_CreateByCoord-->

### CreateByCoord方法

#### 说明

通过杆件起始点和终止点的坐标创建杆件。

#### 格式定义

包含2种输入模式。

bar.CreateByCoord(<*strBarType, fArrayCoord1[3], fArrayCoord2[3], iSeg*>);

bar.CreateByCoord(<*strBarType, x0, y0, z0, x1, y1, z1, iSeg*>);

#### 参数

*strBarType*：字符串型，杆件单元类型，目前支持："bolt"、"cable"、"pile"、"post"、"beam"、"BlastHole1"、"BlastHole2"、"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"。

*fArrayCoord1*、*fArrayCoord2*：Array浮点型，包含3个分量，起点及终点坐标（单位：m）。

x0、x1：浮点型，选择范围的x坐标下限及上限（单位：m）。

y0、y1：浮点型，选择范围的y坐标下限及上限（单位：m）。

z0、z1：浮点型，选择范围的z坐标下限及上限（单位：m）。

*iSeg*：整型，杆件的分段数（即单元数），大于等于1。

#### 备注

炮孔类型1（"BlastHole1"或"RadialUncoupling_BlastHole1"）时，杆件可任意插入实体单元内部，炮孔传递给实体单元应力，实体单元传递给炮孔体应变；炮孔类型2（"BlastHole2"）时，杆件单元与实体单元的边必需重合，杆件传递给实体单元的边界法向力，实体单元传递给杆件单元平均位移（用于计算半径的改变）。

#### 范例

```javascript
//创建包含20个单元的杆件
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(0, 1, 0);
bar.CreateByCoord("pile", coord1, coord2, 20);
bar.CreateByCoord("pile", 5,5,5, 10,10,1, 20);
```

<!--HJS_bar_CreateByDir-->

### CreateByDir方法

#### 说明

根据杆件的起始点、方位角及长度等几何信息创建杆件。

#### 格式定义

bar.CreateByDir(<*strBarType, fArrayOrigin, fArrayNormal, fLength, iSeg*>);

#### 参数

*strBarType*：字符串型，杆件单元类型，目前支持："bolt"、"cable"、"pile"、"post"、"beam"、"BlastHole1"、"BlastHole2"、"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"。

*fArrayOrigin*：Array浮点型，包含3个分量，原点坐标（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，单位法向向量。

*fLength*：浮点型，选择范围的z坐标上限。

*iSeg*：整型，杆件的分段数（即单元数），大于等于1。

#### 备注

炮孔类型1（"BlastHole1"或"RadialUncoupling_BlastHole1"）时，杆件可任意插入实体单元内部，炮孔传递给实体单元应力，实体单元传递给炮孔体应变；炮孔类型2（"BlastHole2"）时，杆件单元与实体单元的边必需重合，杆件传递给实体单元的边界法向力，实体单元传递给杆件单元平均位移（用于计算半径的改变）。

#### 范例

```javascript
var origin = new Array(0, 0, 0);
var normal = new Array(0, 1, 0);
bar.CreateByDir("pile", origin, normal, 4, 50);
```

<!--HJS_bar_SetGroupByID-->

### SetGroupByID方法

#### 说明

根据杆件的ID号指定杆件单元的组号。

#### 格式定义

bar.SetModelByID(<*iGrp, iIDL, iIDU*>);

#### 参数

*iGrp*：整型，整根杆件的组号。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

#### 备注

#### 范例

```javascript
bar.SetGroupByID(5, 1, 10);
```

<!--HJS_bar_SetTypeByGroup-->

### SetTypeByGroup方法

#### 说明

根据组号设置杆件的类型。

#### 格式定义

bar.SetTypeByGroup(<*sType, iGroupL, iGroupU*>);

#### 参数

*sType*：字符串型，杆件类型，目前支持："bolt"、"cable"、"pile"、"post"、"beam"、"BlastHole1"、"BlastHole2"、"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"。

*iGroupL, iGroupU*：整型，杆件组号的下限及上限。

#### 备注

#### 范例

```javascript
bar.SetTypeByGroup("bolt", 1,1);
```

<!--HJS_bar_SetModelByID-->

### SetModelByID方法

#### 说明

根据杆件的ID号指定杆件单元的计算模型。

#### 格式定义

bar.SetModelByID(<*ModelType, iIDL, iIDU*>);

#### 参数

*ModelType*：字符串型，杆件的计算模型，共包含3个类型，为："none"、"linear"、"failure"，分别表示空模型（开挖模型）、线弹性模型、破坏模型（杆件自身及杆件与围岩的接触面可发生破坏）。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

#### 备注

#### 范例

```javascript
bar.SetModelByID(‘none’, 1, 10);
```

<!--HJS_bar_SetModelByGroup-->

### SetModelByGroup方法

#### 说明

根据杆件的组号指定杆件单元的计算模型。

#### 格式定义

bar.SetModelByID(<*ModelType, groupL, groupU*>);

#### 参数

*ModelType*：字符串型，杆件的计算模型，共包含3个类型，为："none"、"linear"、"failure"，分别表示空模型（开挖模型）、线弹性模型、破坏模型（杆件自身及杆件与围岩的接触面可发生破坏）。

*groupL**、**groupU*：整型，杆件组号的下限及上限。

#### 备注

#### 范例

```javascript
//对组号1到10的杆件设置为空模型
bar.SetModelByGroup (‘none’, 1, 10);
```

<!--HJS_bar_SetPropByID-->

### SetPropByID方法

#### 说明

通过杆件ID号及杆件单元的ID号设置杆件单元的材料参数。

#### 格式定义

bar.SetPropByID(<*fArrayValue[11], iIDL, iIDU, iSegL, iSegU*>);

#### 参数

*fArrayValue*：Array浮点型，杆件的材料参数，共包含11个分量。分别为杆件直径（单位：m，用于计算截面积）、杆件密度（单位：kg/m<sup>3</sup>）、杆件弹性模量（单位：Pa）、杆件泊松比、杆件抗拉强度（单位：Pa）、杆件抗压强度（单位：Pa）、杆件与围岩间浆液的粘聚力（单位：Pa）、杆件与围岩将浆液的内摩擦角（单位：度）、浆锚之间的刚度（单位：Pa/m）、杆件的局部阻尼系数、杆件的刚度阻尼系数。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限，从1开始。

*iSegL*，*iSegU*：整型，杆件中单元号的下限及上限，从1开始。

#### 备注

当杆件类型为

#### 范例

```javascript
var vars = new Array(1e-2 ,2000 ,1.0e10, 0.3, 235e6, 235e6, 3e6 ,35, 1e9 , 0.8, 0);
bar.SetPropByID(vars,1, 2, 1 ,100);
```

<!--HJS_bar_SetPropByGroup-->

### SetPropByGroup方法

#### 说明

通过杆件组号设置杆件单元的材料参数。

#### 格式定义

bar.SetPropByGroup(<*fArrayValue[11], groupL, groupU*>);

#### 参数

*fArrayValue*：Array浮点型，杆件的材料参数，共包含11个分量。分别为杆件直径（单位：m，用于计算截面积）、杆件密度（单位：kg/m<sup>3</sup>）、杆件弹性模量（单位：Pa）、杆件泊松比、杆件抗拉强度（单位：Pa）、杆件抗压强度（单位：Pa）、杆件与围岩间浆液的粘聚力（单位：Pa）、杆件与围岩将浆液的内摩擦角（单位：度）、浆锚之间的刚度（单位：Pa/m）、杆件的局部阻尼系数、杆件的刚度阻尼系数。

*groupL**、**groupU*：整型，杆件组号的下限及上限。

#### 备注

当杆件类型为"BlastHole1"、"BlastHole2"时仅第一个参数起作用，即炮孔直径，当杆件类型为"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"时，第一、二个参数起作用，分别表示炮孔直径和不耦合系数。

#### 范例

```javascript
var vars = new Array(1e-2 ,2000 ,1.0e10, 0.3, 235e6, 235e6, 3e6 ,35, 1e9 , 0.8, 0);
bar.SetPropByGroup (vars,1, 2);
```

<!--HJS_bar_SetPropByCoord-->

### SetPropByCoord方法

#### 说明

通过坐标范围设置杆件单元的材料参数。

#### 格式定义

bar.SetPropByCoord(<*fArrayValue[11], x0, x1, y0, y1, z0, z1*>);

#### 参数

*fArrayValue*：Array浮点型，杆件的材料参数，共包含11个分量。分别为杆件直径（单位：m，用于计算截面积）、杆件密度（单位：kg/m<sup>3</sup>）、杆件弹性模量（单位：Pa）、杆件泊松比、杆件抗拉强度（单位：Pa）、杆件抗压强度（单位：Pa）、杆件与围岩间浆液的粘聚力（单位：Pa）、杆件与围岩将浆液的内摩擦角（单位：度）、浆锚之间的刚度（单位：Pa/m）、杆件的局部阻尼系数、杆件的刚度阻尼系数。

X0、x1：浮点型，选择范围的x坐标下限及上限（单位：m）。

y0、y1：浮点型，选择范围的y坐标下限及上限（单位：m）。

z0、z1：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

当杆件类型为"BlastHole1"、"BlastHole2"时仅第一个参数起作用，即炮孔直径，当杆件类型为"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"时，第一、二个参数起作用，分别表示炮孔直径和不耦合系数。

#### 范例

```javascript
var vars = new Array(1.0 ,2000 ,1.0e10, 0.3, 235e1, 235e1, 3e6 ,35, 1e9 , 0.8, 0);
bar.SetPropByID(vars, -10, 10, -10, 10, -10, 10);
```

<!--HJS_bar_SetLengthAndWidthByID-->

### SetLengthAndWidthByID方法

#### 说明

杆件类型为"pile"或"beam"时，通过杆件ID号及杆件单元ID号设置杆件截面的长度及宽度（若不设置，默认为圆形）。

#### 格式定义

bar.SetLengthAndWidthByID(<*fLength, fWidth, iIDL, iIDU, iSegL*, *iSegU*>);

#### 参数

*fLength*：浮点型，截面的长度（单位：m）。

*fWidth*：浮点型；截面的宽度（单位：m）。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限，从1开始。

*iSegL*，*iSegU*：整型，杆件中单元号的下限及上限，从1开始。

#### 备注

如果执行此函数，则认为杆件截面为矩形，截面上的长度方向为局部坐标系X轴方向，截面的宽度方向为局部坐标系Y轴方向，杆件法向为局部坐标系Z轴方向。局部坐标系在导入网格时会进行自动计算。

#### 范例

```javascript
bar. SetLengthAndWidthByID(1.5, 2.0, 1, 3 , 1, 100);
```

<!--HJS_bar_FixVelByCoord-->

### FixVelByCoord方法

#### 说明

通过坐标范围约束杆件节点的平动速度。

#### 格式定义

bar.FixVelByCoord(<*bArrayType[3], fArrayValue[3], x0, x1, y0, y1, z0, z1*>);

#### 参数

*bArrayType*：Array布尔型，包含3个分量，表示全局坐标系下三个方向是否约束，true为约束，false为不约束。

*fArrayValue*：Array浮点型，包含3个分量，表示全局坐标系下三个方向平动速度的设定值（单位：m/s）。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
var types = new Array(false, true, false);//三个方向是否约束
var values = new Array(0, 10.0, 0);//三个方向的平动速度分量值
bar. FixVelByCoord(types, values, -10, 10, -10, 10, -10, 10);
```

<!--HJS_bar_FixVelByID-->

### FixVelByID方法

#### 说明

通过杆件ID号及杆件节点ID号约束杆件节点的平动速度。

#### 格式定义

bar.FixVelByID(<*bArrayType[3], fArrayValue[3], iIDL, iIDU, iNodeL, iNodeU*>);

#### 参数

*bArrayType*：Array布尔型，包含3个分量，表示全局坐标系下三个方向是否约束，true为约束，false为不约束。

*fArrayValue*：Array浮点型，包含3个分量，表示全局坐标系下三个方向平动速度的设定值（单位：m/s）。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

*iNodeL*、*iNodeU*：整型，杆件节点ID号的下限及上限。

#### 备注

#### 范例

```javascript
var types = new Array(false, true, false);//三个方向是否约束
var values = new Array(0, 10.0, 0); //三个方向的平动速度分量值
bar. FixVelByID (types, values, 1, 3,21, 21);
```

<!--HJS_bar_FixRotateVelByID-->

### FixRotateVelByID方法

#### 说明

通过杆件ID号及杆件节点号约束杆件节点的转动速度。

#### 格式定义

bar.FixRotateVelByID(<*bArrayType[3], fArrayValue[3], iIDL, iIDU, iNodeL, iNodeU*>);

#### 参数

*bArrayType*：Array布尔型，包含3个分量，表示全局坐标系下三个方向是否约束，true为约束，false为不约束。

*fArrayValue*：Array浮点型，包含3个分量，表示全局坐标系下三个方向转动速度的设定值（单位：弧度/秒）。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

*iNodeL*、*iNodeU*：整型，杆件节点ID号的下限及上限。

#### 备注

#### 范例

```javascript
var types = new Array(false, true, false);//三个方向是否约束
var values = new Array(0.0, 0.0, 0.0); //三个方向的转动速度分量值
bar. FixRotateVelByID(types, values, 1, 3, 1, 1);
```

<!--HJS_bar_ApplyForceByCoord-->

### ApplyForceByCoord方法

#### 说明

通过坐标范围对杆件节点施加全局坐标系下的力。

#### 格式定义

bar.ApplyForceByCoord(<*fArrayValue[3], x0, x1, y0, y1, z0, z1*>);

#### 参数

*fArrayValue*：Array浮点型，包含3个分量，表示全局坐标系下三个方向施加的力（单位：N）。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

杆件力的施加采用累加方式，即多次执行该接口函数，对应的杆件节点力将不断增加。

#### 范例

```javascript
var values = new Array(0.0, 1000.0, 0.0);//三个方向力分量的值
bar.ApplyForceByCoord(values, -10, 10, -10, 10, -10, 10);
```

<!--HJS_bar_ApplyForceByID-->

### ApplyForceByID方法

#### 说明

通过杆件ID号及杆件节点ID号对杆件节点施加全局坐标系下的力。

#### 格式定义

bar.ApplyForceByID (<*fArrayValue[3], iIDL, iIDU, iNodeL, iNodeU*>);

#### 参数

*fArrayValue*：Array浮点型，包含3个分量，表示全局坐标系下三个方向施加的力（单位：N）。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

*iNodeL*、*iNodeU*：整型，杆件节点ID号的下限及上限。

#### 备注

杆件力的施加采用累加方式，即多次执行该接口函数，对应的杆件节点力将不断增加。

#### 范例

```javascript
var values = new Array(0.0, 1000.0, 0.0);//三个方向力分量的值
bar. ApplyForceByID(values, 1, 3, 1,5);
```

<!--HJS_bar_ApplyMomentByID-->

### ApplyMomentByID方法

#### 说明

通过杆件ID号及杆件节点ID号对杆件节点施加全局坐标系下的力矩。

#### 格式定义

bar.ApplyMomentByID(<*fArrayValue[3], iIDL, iIDU, iNodeL, iNodeU*>);

#### 参数

*fArrayValue*：Array浮点型，包含3个分量，表示全局坐标系下三个方向施加的力矩（单位：N.m）。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

*iNodeL*、*iNodeU*：整型，杆件节点ID号的下限及上限。

#### 备注

杆件力矩的施加采用累加方式，即多次执行该接口函数，对应的杆件节点力矩将不断增加。

#### 范例

```javascript
var values = new Array(0.0, 1000.0,0.0);//三个方向力矩分量的值
bar.ApplyMomentByID(values, 1, 3, 1,5);
```

<!--HJS_bar_ApplyGravity-->

### ApplyGravity方法

#### 说明

施加杆件的重力。

#### 格式定义

bar.ApplyGravity(<*fgx, fgy, fgz>*);

#### 参数

*fgx**、**fgy**、**fgz*：浮点型，3个方向的重力加速度分量（单位：m/s2）。

#### 备注

执行该接口函数后，杆件节点上施加的所有节点外力将被清零，并根据杆件的节点质量，在杆件节点上设置节点重力。因此，当杆件上的力包含重力及其他外力时，需要先设置重力，后设置其他外力。

#### 范例

```javascript
bar.ApplyGravity(0.0, -9.8, 0.0);
```

<!--HJS_bar_ApplyPreTenForce-->

### ApplyPreTenForce方法

#### 说明

根据杆件ID号及杆件节点ID号对杆件节点施加预应力。

#### 格式定义

bar.ApplyPreTenForce(<*fValue, iIDL, iIDU, iNodeL, iNodeU*>);

#### 参数

*fValue*：浮点型；施加的预应力值（单位：N），应该大于0。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

*iNodeL*、*iNodeU*：整型，杆件节点ID号的下限及上限。

#### 备注

#### 范例

```
bar.ApplyPreTenForce(1500, 1, 3, 1 ,5);
```

<!--HJS_bar_BindLandauSource-->

### BindLandauSource方法

#### 说明

根据杆件的ID号将全局的朗道爆源模型参数与杆件单元进行绑定。

#### 格式定义

bar.BindLandauSource(<*iIDNo, iIDL, iIDU*>);

#### 参数

*iIDNo*：整型，朗道模型的全局材料号，从1开始。

*iIDL*、*iIDU*：整型，杆件ID号的下限及上限。

#### 备注

该设置仅当杆件类型为"BlastHole1"、"BlastHole2"、"RadialUncoupling_BlastHole1"、"RadialUncoupling_BlastHole2"时起作用。

全局朗道爆源参数可通过blkdyn.SetLandauSource(<>)进行设置。

#### 范例

```javascript
//将1到3号杆件的朗道爆源模型参数与全局朗道参数列表中的第2号参数进行关联。
Bar.BindLandauSource(1, 1, 3);
```

<!--HJS_bar_GetBarInfo-->

### GetBarInfo方法

#### 说明

获取某根杆件的信息。

#### 格式定义

bar.GetBarInfo(<*iBar, strValueName*[, *iFlag*]>);

#### 参数

*iBar*：整型，杆件的ID号，从1开始。

*strValueName*：字符串型，杆件信息变量名称，**具体见附表9**。

*iFlag*：整型，杆件变量对应的分量ID；如果杆件变量为标量、或希望获得分量为1时的值，则iFlag可以不输入。

#### 备注

#### 范例

```javascript
var value1 = bar.GetBarInfo(1, "Model");
var value2 = bar.GetBarInfo(1, "FirstCoord",3);
```

<!--HJS_bar_GetSegValue-->

### GetSegValue方法

#### 说明

获取杆件中某个单元的信息。

#### 格式定义

bar.GetSegValue(<*iBar, iSeg, strValueName*[*, iFlag*]>);

#### 参数

*iBar*：整型，杆件ID号。

*iSeg*：整型，杆件单元（Seg）的ID号。

*strValueName*：字符串型，可供获取的杆件单元变量名，**具体见附表10**。

*iFlag*：整型，杆件单元变量对应的分量ID；如果杆件单元变量为标量、或希望获得分量为1时的值，则iFlag可以不输入。

#### 备注

#### 范例

```javascript
var value1 = bar.GetSegValue(2, 2, "Length");
var value2 = bar.GetSegValue(2, 2, "LocalDir",9);
```

<!--HJS_bar_GetNodeValue-->

### GetNodeValue方法

#### 说明

获取杆件中某个节点的信息。

#### 格式定义

bar.GetNodeValue();

#### 参数

*iBar*：整型，杆件ID号。

*iNode*：整型，杆件中节点ID号。

*strValueName*：字符串型，可供获取的杆件节点变量，**具体见附表11**。

*iFlag*：整型，杆件节点变量对应的分量ID；如果杆件节点变量为标量、或希望获取分量为1时的值，则iFlag可以不输入。

#### 备注

#### 范例

```javascript
var value1 = bar.GetNodeValue(1,1,"Mass");
var value2 = bar.GetNodeValue(1,1,"Coord",3);
```

<!--HJS_bar_SetBarInfo-->

### SetBarInfo方法

#### 说明

设置某根杆件的信息。

#### 格式定义

bar.SetBarInfo();

#### 参数

*iBar*：整型，杆件的ID号，从1开始。

*strValueName*：字符串型，杆件信息变量名称，**具体见附表9**。

*fValue*：浮点型，具体的设置值。

*iFlag*：整型，杆件变量对应的分量ID；如果杆件变量为标量、或希望获得分量为1时的值，则iFlag可以不输入。

#### 备注

#### 范例

```javascript
var value1 = bar.SetBarInfo(1, "Model", 2);
```

<!--HJS_bar_SetSegValue-->

### SetSegValue方法

#### 说明

设置杆件某单元信息。

#### 格式定义

bar.SetSegValue(<>);

#### 参数

*iBar*：整型，杆件ID号。

*iSeg*：整型，杆件单元（Seg）的ID号。

*strValueName*：字符串型，可供获取的杆件单元变量名，**具体见附表10**。

*fValue*：浮点型，具体的设置值。

*iFlag*：整型，杆件单元变量对应的分量ID；如果杆件单元变量为标量、或希望设置分量为1时的值，则iFlag可以不输入。

#### 备注

#### 范例

```javascript
bar.SetSegValue(2, 2, "Stiffness", 1e9, 1);
bar.SetSegValue(2, 2, "Stiffness", 2e9, 2);
bar.SetSegValue(2, 2, "Stiffness", 3e9, 3);
bar.SetSegValue(2, 2, "Density", 7800);
```

<!--HJS_bar_SetNodeValue-->

### SetNodeValue方法

#### 说明

设置杆件某节点信息。

#### 格式定义

bar.SetNodeValue();

#### 参数

*iBar*：整型，杆件ID号。

*iNode*：整型，杆件中节点ID号。

*strValueName*：字符串型，可供设置的杆件节点变量，**具体见附表11**。

*fValue*：设置的具体值。

*iFlag*：整型，杆件节点变量对应的分量ID；如果杆件节点变量为标量、或希望设置分量为1时的值，则iFlag可以不输入。

#### 备注

#### 范例

```javascript
bar.SetNodeValue(1, 2, ,"Velocity",1e-6, 2);
bar.SetNodeValue(1, 2, "GroutFailType",0);
```

<!--HJS_bar_Solver-->

### Solver方法

#### 说明

杆件核心求解器（每一迭代步使用）。

#### 格式定义

bar.Solver()

#### 参数

无。

#### 备注

#### 范例

```javascript
bar.Solver();
```



