<!--HJS_link_interfacefun-->

## Link单元接口函数

Link对象（link）为用户提供了Link单元创建、Link单元模型设置及Link单元材料参数设置等多类接口函数，具体见表4.5。

<center>表4.5杆件接口函数列表</center>

<table>
	<tr>
	    <th>序号</th>
	    <th>方法</th>
	    <th>说明</th>  
	</tr >
	<tr >
	    <td>1</td>
	    <td>CreateByCoord</td>
	    <td>通过坐标点单独创建一个link单元。</td>
	</tr>
	<tr>
	    <td>2</td>
	    <td>CreateFromElemByGroup</td>
	    <td rowspan="3">基于单元的棱（面）创建Link单元。</td>
	</tr>
	<tr>
	    <td>3</td>
	    <td>CreateFromElemByLine</td>
	 	</tr>
	<tr>
	    <td>4</td>
	    <td>CreateFromElemByCoord</td>
	    	</tr>
	<tr><td>5</td>
	    <td>SetModelByGroup</td>
	    <td>通过组号来设置Link单元的计算模型。</td>
	</tr>
	<tr>
	    <td>6</td>
	    <td>SetPropByGroup</td>
	    <td>通过组来设置Link单元参数。</td>
	</tr>
	<tr>
	    <td>7</td>
	    <td>GetElemValue</td>
	    <td>获取某一Link单元的信息。</td>
	</tr>
	<tr>
	    <td>8</td>
	    <td>SetElemValue</td>
	    <td>设置某一Link单元的信息。</td>
	</tr>
</table>


Link单元为由实体单元的两个节点构成的杆件单元（两个节点组成的一个单元）。Link单元必须依附于实体单元起作用，主要用于对实体单元进行刚度及强度的增强；Link单元没有独立的节点，其节点为固体的实体单元对应的节点。

开展Link单元计算时，可通过dyna.Set(<>)函数设置" If_Cal_Link"，控制是否开启Link计算。

<!--HJS_link_CreateByCoord-->

### CreateByCoord方法

#### 说明

通过两个坐标点单独创建一个link单元。

#### 格式定义

link.CreateByCoord (<*fArrayCoord1*[3],*fArrayCoord2*[3], *iGroup*>);

#### 参数

*fArrayCoord1*：Array浮点型，包含3个分量，第一点的坐标（单位：m）。

*fArrayCoord2*：Array浮点型，包含3个分量，第二点的坐标（单位：m）。

*iGroup*：整型，Link单元的组号。

#### 备注

执行该函数时，自动搜索离*fArrayCoord1*及*fArrayCoord2*最近的实体单元节点，并作为Link单元的两个节点。

#### 范例

```java
var coord1 = new Array(0, 1, 2);
var coord2 = new Array(3, 4, 5);
link.CreateByCoord(coord1, coord2, 1);
```

<!--HJS_link_CreateFromElemByGroup-->

### CreateFromElemByGroup方法

#### 说明

基于单元组号从实体单元边界上创建Link单元。

#### 格式定义

link.CreateFromElemByGroup(<*iGroupLow*,*iGroupUp*>);

#### 参数

*iGroupLow*、*iGroupUp*：整型，实体单元组号的下限及上限。

#### 备注

若单元的某面为自由面、或接触面、或该面的邻居单元为空模型（开挖单元）时，将该面的各边设定为Link单元。若三维面为四边形，则除了四条边为Link单元为，某一条对角线也为Link单元。

#### 范例

```java
link.CreateFromElemByGroup(1, 2);
```

<!--HJS_link_CreateFromElemByLine-->

### CreateFromElemByLine方法

#### 说明

基于线段在实体单元边界上创建link单元。

#### 格式定义

link.CreateFromElemByLine(<*fArrayCoord1[3], fArrayCoord2[3], fTol*>);

#### 参数

*fArrayCoord1*：Array浮点型，包含3个分量，第一个节点的坐标（单位：m）。

*fArrayCoord1*：Array浮点型，包含3个分量，第二个节点的坐标（单位：m）。

*fTol*：浮点型，容差（单位：m）。

#### 备注

若单元的某面为自由面、或接触面、或该面的邻居单元为空模型（开挖单元）时，将该面的满足条件的边设定为Link单元。

#### 范例

```java
var coord1 = new Array(0, 1, 2);
var coord2 = new Array(3, 4, 5);
link.CreateFromElemByLine(coord1, coord2, 0.01);
```

<!--HJS_link_CreateFromElemByCoord-->

### CreateFromElemByCoord方法

#### 说明

基于坐标范围在单元边界上创建link单元。。

#### 格式定义

link.CreateFromElemByCoord(<*x0, x1, y0, y1, z0, z1*>);

#### 参数

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

若单元面心在控制范围内，且单元的某面为自由面、或接触面、或该面的邻居单元为空模型（开挖单元）时，将该面的所有棱设定为Link单元。若三维面为四边形，则除了四条边为Link单元为，某一条对角线也为Link单元。

#### 范例

```java
link.CreateFromElemByCoord(-10, 10, -10, 10, -10, 10);
```

<!--HJS_link_SetModelByGroup-->

### SetModelByGroup方法

#### 说明

通过组号来设置Link单元的模型。

#### 格式定义

link.SetModelByGroup (<*iModel, iGroupLow, iGroupUp*>)

#### 参数

*iModel*：整型，Link单元模型号，取值只能为0、1、2。分别表示：0-空模型，1-线弹性，2-拉伸脆断破坏。

*iGroupLow*、*iGroupUp*：整型，Link单元组号的下限及上限。

#### 备注

#### 范例

```java
link.SetModelByGroup (1, 1, 8);
```

<!--HJS_link_SetPropByGroup-->

### SetPropByGroup方法

#### 说明

根据Link单元的组号来设置Link单元的材料参数。

#### 格式定义

link.SetPropByGroup (<*fCrossArea,fYoungM,fShearM,fTension,iGroupLow, iGroupUp*>)

#### 参数

*fCrossArea*：浮点型；截面积(单位：m<sup>2</sup>)。

*fYoungM*：浮点型，弹性模量(单位：Pa)。

*fShearM*：浮点型，剪切模量(单位：Pa)。

*fTension*：浮点型，抗拉强度(单位：Pa)。

*iGroupLow*、*iGroupUp*：整型，Link单元组号的下限及上限。

#### 备注

#### 范例

```java
link. SetPropByGroup (1e-2 , 1e9, 1e9, 1e6, 5, 6);
```

<!--HJS_link_GetElemValue-->

### GetElemValue方法

#### 说明

获取某一ID序号对应的Link单元信息。

#### 格式定义

link.GetElemValue (*IDNo*, *msValueName* [,*iflag*]);

#### 参数

*IDNo*：整型，Link单元的ID号，从1开始。

*msValueName*：字符串型，可供获取的Link单元信息**，具体见附表12**。

*Iflag*：整型，获取变量的分量ID号，如果为标量或对应的分量ID为1，可以不写，或写1。

#### 备注

#### 范例

```java
//获取第100号Link单元的长度
var flength = link.GetElemValue(100, "Length");
//获取第100号Link单元Z方向的力
var zforce = link.GetElemValue(100, "LinkForce", 3);
```

<!--HJS_link_SetElemValue-->

### SetElemValue方法

#### 说明

设置某一ID序号对应的Link单元信息。

#### 格式定义

link.SetElemValue (*IDNo*, *msValueName*, *fValue*[,*iflag*]);

#### 参数

*IDNo*：整型，Link单元的ID号，从1开始。

*msValueName*：字符串型，可供设置的Link单元信息**，具体见附表12**。

*fValue*：具体设置的值。

*Iflag*：整型，设置变量的分量ID号，如果为标量或对应的分量ID为1，可以不写，或写1。

#### 备注

#### 范例

```java
//设置第100号Link单元的模型
link.SetElemValue(100, "Model", 1);
//设置第100号Link单元Z方向的力
link.SetElemValue(100, "LinkForce", 1e6, 3);
```

