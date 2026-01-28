<!--HJS_rdface_interfacefun-->

## 刚（柔）性面接口函数

刚（柔）性面对象（rdface）为用户提供了刚(柔)性面单元的创建及导入、刚(柔)性面模型的设置、刚(柔)性面材料参数设置、刚(柔)性面平动及转动边界条件设置等多类接口函数，具体见表4.6。

<center>表4.6杆件接口函数列表</center>

<table>
	<tr>
	    <th>序号</th>
	    <th>方法</th>
	    <th>说明</th>  
	</tr >
    <tr >
	    <td>0</td>
	    <td>GetMesh</td>
	    <td>从Genvi平台获取网格并加载到刚(柔)性面求解器。</td>
	</tr>
	<tr >
	    <td>1</td>
	    <td>Create</td>
	    <td>单独创建一个刚(柔)性面</td>
	</tr>
	<tr>
	    <td>2</td>
	    <td>Import</td>
	    <td>从外部文件导入刚(柔)性面</td>
	</tr>
	<tr>
	    <td>3</td>
        <td>SetModelByGroup</td>
	    <td rowspan="2">设置刚(柔)性面的模型</td>
	 	</tr>
	<tr>
	    <td>4</td>
	    <td>SetModelByCoord</td>
	    	</tr>
	<tr><td>5</td>
	    <td>SetPropByGroup</td>
	    <td rowspan="2">设置刚(柔)性面的材料性质</td>
	</tr>
	<tr>
	    <td>6</td>
	    <td>SetPropByCoord</td>
	</tr>
	<tr>
	    <td>7</td>
	    <td>ApplyVelocityByGroup</td>
	    <td rowspan="2">施加刚(柔)性面的速度</td>
	</tr>
	<tr>
	    <td>8</td>
	    <td>ApplyVelocityByCoord</td>
	</tr>
	<tr>
	    <td>9</td>
	    <td>ApplyRotateCondition</td>
	    <td rowspan="2">施加刚(柔)性面的转动条件及伺服压力控制</td>
	</tr>
	<tr>
	    <td>10</td>
	    <td>ApplyServoCondition</td>
	</tr>
	<tr>
	    <td>11</td>
	    <td>ApplyRadialVelocity</td>
	    <td>施加刚(柔)性面的径向速度边界</td>
	</tr>
	<tr>
	    <td>12</td>
	    <td>ApplyBeltVelocity</td>
	    <td>施加刚(柔)性面的皮带速度</td>
	</tr>
    <tr>
	    <td>13</td>
	    <td>CrtPart</td>
	    <td>创建刚体部件</td>
	</tr>
    <tr>
	    <td>14</td>
	    <td>CrtPartAuto</td>
	    <td>自动创建刚体部件</td>
	</tr>
    <tr>
	    <td>15</td>
	    <td>CrtConnector</td>
	    <td>创建连接弹簧</td>
	</tr>
    <tr>
	    <td>16</td>
	    <td>SetPartProp</td>
	    <td>设置刚体部件材料参数</td>
	</tr>
    <tr>
	    <td>17</td>
	    <td>SetPartVel</td>
	    <td>设置刚体部件平动速度</td>
	</tr>
    <tr>
	    <td>18</td>
	    <td>SetPartRotaVel</td>
	    <td>设置刚体部件转动速度</td>
	</tr>
    <tr>
	    <td>18</td>
	    <td>SetPartForce</td>
	    <td>设置刚体部件外力</td>
	</tr>
    <tr>
	    <td>19</td>
	    <td>SetPartMoment</td>
	    <td>设置刚体部件外力矩</td>
	</tr>
    <tr>
	    <td>20</td>
	    <td>SetPartLocalDamp</td>
	    <td>设置刚体部件局部阻尼</td>
	</tr>
    <tr>
	    <td>21</td>
	    <td>CalPartPropAuto</td>
	    <td>自动计算刚体部件性质</td>
	</tr>
        <tr>
	    <td>22</td>
	    <td>SetDeformMat</td>
	    <td>设置柔性面材料参数</td>
	</tr>
    	</tr>
        <tr>
	    <td>23</td>
	    <td>SetGravity</td>
	    <td>设置柔性面重力</td>
	</tr>
	</tr>
    	</tr>
        <tr>
	    <td>24</td>
	    <td>SetFaceForceByCoord</td>
	    <td>设置柔性面面力</td>
	</tr>
 <tr>
	    <td>25</td>
	    <td>SetNodalForceByCoord</td>
	    <td>设置柔性面节点力</td>
	</tr>
<tr>
	    <td>26</td>
	    <td>SetVelocityByCoord</td>
	    <td>设置柔性面速度边界</td>
	</tr>
<tr>
	    <td>27</td>
	    <td>ApplyDynaVel</td>
	    <td>设置柔性面动态速度边界</td>
	</tr>
	<tr>
	    <td>28</td>
	    <td>GetElemValue</td>
	    <td>获取刚(柔)性面单元的信息</td>
	</tr>
	<tr>
	    <td>29</td>
	    <td>SetElemValue</td>
	    <td>设置刚(柔)性面单元的信息</td>
	</tr>
    <tr>
	    <td>30</td>
	    <td>ExportTerrainData</td>
	    <td>导出Grid格式的地形文件</td>
	</tr>
	<tr>
	    <td>31</td>
	    <td>Solver</td>
	    <td>刚(柔)性面核心求解器，每一迭代步使用</td>
	</tr>
</table>



进行刚(柔)性面计算时，可通过dyna.Set(<>)设置"If_ContRiF_Cal_ViscDamp"确定是否采用粘性阻尼、设置"If_Contact_Use_FaceMat"确定刚(柔)性面参与的接触是否采用刚(柔)性面上的材料参数、设置"If_Contact_Use_GlobMat"确定刚(柔)性面参与的接触是否采用全局材料模型及参数，设置"If_Stiff_Use_Set_Value"确定是否采用输入的接触刚度参数（当"If_Contact_Use_FaceMat"或"If_Contact_Use_GlobMat"起作用时）。

<!--HJS_rdface_GetMesh-->

### GetMesh方法

#### 说明

从Genvi平台获取网格并加载到刚(柔)性面求解器。

#### 格式定义

rdface.GetMesh (<*mesh*>);

#### 参数

*mesh*：网格对象。

#### 备注

#### 范例

```javascript
//利用平台的imesh模块导入ansys网格
var msh1 = imesh.importAnsys("wedge94.dat");
//将平台的网格加载到rdface核心求解器
rdface.GetMesh(msh1);
```



<!--HJS_rdface_Create-->

### Create方法

#### 说明

刚(柔)性面的创建。

#### 格式定义

rdface.Create (<*itype, igroup, TotalPoint, fCoord[]*>);

#### 参数

*itype*：整型，刚(柔)性面的类型，只能为1或2，1表示线段（二维问题），2表示平面（三维问题）。

*Igroup*：整型，刚(柔)性面组号，大于等于1的自然数。

*TotalPoint*：整型，刚(柔)性面上的总节点数，刚(柔)性面为线段时总节点数为2，刚(柔)性面为平面时总节点数大于等于3。

*fCoord*：Array浮点型，包含TotalPoint个分量，每个分量表示一个节点的坐标（含3个子分量）。

#### 备注

#### 范例

```java
//刚(柔)性面创建
var fCoord=new Array();
fCoord[0]=new Array(1.0,1.0,1.0)
fCoord[1]=new Array(2.0,2.0,2.0)
rdface.Create (1, 1, 2, fCoord);
```

<!--HJS_rdface_Import-->

### Import方法

#### 说明

从外部文件导入刚(柔)性面单元。

#### 格式定义

rdface.Import (*<(importType* [, *FileName*]*>*);

#### 参数

*importType*：整型或字符串型。如果为整型，只能为1、2、3，1表示从ansys导入网格，2表示从gid导入网格，3表示从genvi导入网格。如果为字符串型，只能为"ansys"，"gid"或"genvi"，大小写均可。

*FileName*：字符串型，导入网格的文件名。也可以不写，运行时会跳出对话框，让用户自己选择对应的文件。

#### 备注

#### 范例

```java
//刚(柔)性面导入
rdface. Import (1, "ansys.dat")
rdface. Import("gid", "feng.msh")
```

<!--HJS_rdface_SetModelByGroup-->

### SetModelByGroup方法

#### 说明

通过组号设置刚(柔)性面的计算模型。

#### 格式定义

rdface.SetModelByGroup (<*imodel, iGroupLow, iGroupUp*>);

#### 参数

*imodel*：整型，刚(柔)性面的计算模型，目前只能为0、1、2、3。0-为空模型，1-3为实模型（1-线弹性、2-脆断、3-理想弹塑性）。

*iGroupLow*、*iGroupUp*：整型，刚(柔)性面组号的下限及上限。

#### 备注

#### 范例

```java
//将组号1-5的刚(柔)性面赋成空模型（开挖）
rdface. SetModelByGroup (0, 1, 5)；
```

<!--HJS_rdface_SetModelByCoord-->

### SetModelByCoord方法

#### 说明

通过坐标设置刚(柔)性面的计算模型。

#### 格式定义

rdface.SetModelByCoord (<*imodel, x[2],y[2],z[2]*>);

#### 参数

*imodel*：整型，刚(柔)性面的计算模型，目前只能为0、1、2、3。0-为空模型，1-3为实模型（1-线弹性、2-脆断、3-理想弹塑性）。

*X*、*y*、*z*：Array浮点型，均包含2个分量，为x、y、z坐标的下限及上限（单位：m）。

#### 备注

#### 范例

```java
//刚(柔)性面模型施加
var x=[1,1];//坐标x的取值范围
var y=[2,2];//坐标y的取值范围
var z=[3,3];//坐标z的取值范围
rdface. SetModelByCoord (imodel, x,y,z);
```

<!--HJS_rdface_SetPropByGroup-->

### SetPropByGroup方法

#### 说明

通过组号施加刚(柔)性面的材料参数。

#### 格式定义

rdface.SetPropByGroup (<*Kn, Ks, cohesion, tension, friction, iGroupLow, iGroupUp*>);

#### 参数

*Kn*：浮点型，法向刚度（单位：N/m）

*Ks*：浮点型，切向刚度（单位：N/m）

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：度）

*iGroupLow*、*iGroupUp*：整型，刚(柔)性面组号的下限及上限。

#### 备注

####    范例

```java
//刚(柔)性面施加性质
rdface. SetPropByGroup (1e10, 1e10, 3e6,1e6,30,1,10)；
```

<!--HJS_rdface_SetPropByCoord-->

### SetPropByCoord方法

#### 说明

通过坐标范围设置刚(柔)性面的材料参数。

#### 格式定义

rdface. SetPropByCoord (<*Kn, Ks, cohesion, tension, friction, x[2], y[2], z[2]*>);

#### 参数

*Kn*：浮点型，法向刚度（单位：N/m）

*Ks*：浮点型，切向刚度（单位：N/m）

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：度）

*x*、*y*、*z*：Array浮点型，均包含2个分量，为x、y、z坐标的下限及上限（单位：m）。

#### 备注

#### 范例

```java
//刚(柔)性面施加性质
x=new Array(0.0,100.0);//坐标x的取值范围
y=new Array(0.0,100.0);//坐标y的取值范围
z=new Array(0.0,100.0); //坐标z的取值范围
rdface.SetPropByCoord (1e10, 1e10, 3e6,1e6,30, x,y,z)；
```

<!--HJS_rdface_ApplyVelocityByGroup-->

### ApplyVelocityByGroup方法

#### 说明

通过组号施加刚(柔)性面的平动速度。

#### 格式定义

rdface.ApplyVelocityByGroup (<*Fix[3], iGroupLow, iGroupUp*>);

#### 参数

*FixV*：Array浮点型，包含3个分量，全局坐标系下的三个速度分量（单位：m/s）。

*iGroupLow*、*iGroupUp*：整型，刚(柔)性面组号的下限及上限。

#### 备注

#### 范例

```java
//刚(柔)性面的平动速度施加
var FixV=[1.0,1.0,1.0];
rdface.ApplyVelocityByGroup (FixV, 1,5)；
```

<!--HJS_rdface_ApplyVelocityByCoord-->

### ApplyVelocityByCoord方法

#### 说明

通过坐标施加刚(柔)性面的平动速度。

#### 格式定义

rdface.ApplyVelocityByCoord (<*FixV[3], x[2],y[2],z[2]* >);

#### 参数

*FixV*：Array浮点型，包含3个分量，全局坐标系下的三个速度分量（单位：m/s）。

*x*、*y*、*z*：Array浮点型，均包含2个分量，为x、y、z坐标的下限及上限（单位：m）。

#### 备注

#### 范例

```java
//刚(柔)性面的运动速度施加（坐标方式）
var FixV=[1.0,1.0,1.0];
var x=[0.0,1.0]; //坐标x的取值范围
var y=[0.0,1.0] ; //坐标x的取值范围
var z=[0.0,1.0] ; //坐标x的取值范围
rdface.ApplyVelocityByCoord (FixV, x, y, z)；
```

<!--HJS_rdface_ApplyRotateCondition-->

### ApplyRotateCondition方法

#### 说明

施加转动条件

#### 格式定义

rdface.ApplyRotateCondition (<*IDNo, fOrigin[3], fNormal[3], RotaVel, AxialVel, GlobVel[3], iGroupLow, iGroupUp*>);

#### 参数

*IDNo*：整型，转动施加序号（从1开始）

*fOrigin*：Array浮点型，包含三个分量，转动原点坐标（单位：m）

*fNormal*：Array浮点型，包含三个分量，转动法向分量

*RotaVel*：浮点型，转动速度（单位：转/秒）

*AxialVel*：浮点型，轴向速度（单位：m/s）

*GlobVel*：Array浮点型，包含三个分量，全局速度（单位：m/s）

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限、下限

#### 备注

#### 范例

```java
//刚(柔)性面转动条件的施加
var fOrigin=[0,0,0]；//坐标原点
var fNormal=[0,1,0]；//法向分量
var GlobVel=[3,3,3]；//速度分量值
rdface.ApplyRotateCondition (1, fOrigin, fNormal, 10, 10, GlobVel, 1, 5);
```

<!--HJS_rdface_ApplyServoCondition-->

### ApplyServoCondition方法

#### 说明

施加刚(柔)性面伺服控制参数。

#### 格式定义

rdface.ApplyServoCondition(*<(IfServoControl,ControlType[],ControlValue,fEquiMass, AdjustRange[2], LocalCoordSystemID, RotateApplyID)>*);

#### 参数

IfServoControl：布尔型，如果为true，则进行伺服控制；如果为false，则不进行伺服控制。

ControlType：字符串型，伺服类型，目前只能为"AxialForce"，即伺服轴力。

ControlValue：浮点型，伺服的值。

*fEquiMass*：浮点型，为旋转体的等效质量，虚质量计算时为虚拟质量，真实质量计算时为真实质量。

AdjustRange：Array浮点型，为速度调整的范围，"AxialForce"伺服时，需要不断调整法向进尺速度，如果进尺速度超过了调整的范围，则取范围的边界。

LocalCoordSystemID：整型，为局部坐标ID号（通过接口函数dyna. CreateLocalCoordSys(<>)设置局部坐标系时对应的ID号）。

RotateApplyID：整型，转动施加ID号（通过rdface.ApplyRotateCondition(<>)接口函数施加转动时对应的ID号）。

#### 备注

刚(柔)性面的伺服控制需要通过dyna. CreateLocalCoordSys(<>)及rdface.ApplyRotateCondition(<>)接口函数共同实现。

#### 范例

```java
//施加刚(柔)性面伺服控制
var AdjustRange = new Array (-1e5, 1e5);
rdface.ApplyServoCondition(true," AxialForce",20e6, 1e14, AdjustRange, 1, 1);
```

<!--HJS_rdface_ApplyRadialVelocity-->

### ApplyRadialVelocity方法

#### 说明

施加刚(柔)性面的径向速度边界

#### 格式定义

rdface.ApplyRadialVelocity(<*IDNo, nType, fOrigin[3], fNormal[3], fVel, GroupLow, GroupUp*>);

#### 参数

*IDNo*：整型，转动径向速度边界的序号（从1开始）

*nType*：整型，径向类型号，智能为1、2,1表示柱形径向，2表示球形径向

*fOrigin*：Array浮点型，包含三个分量，原点坐标（单位：m）

*fNormal*：Array浮点型，包含三个分量，柱形径向模式时为轴线法向量，球形径向模式不起作用，但必须写

*fVel*：浮点型，径向速度（单位：m/s），大于0表示膨胀，小于0表示收缩

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限、下限

#### 备注

#### 范例

```javascript
//刚(柔)性面径向速度条件的施加
var fOrigin=[0,0,0]；//坐标原点
var fNormal=[0,1,0]；//法向分量
//对组1至组5的刚(柔)性面施加速度为100的径向膨胀速度
rdface.ApplyRadialVelocity (1, 1, fOrigin, fNormal, 100.0, 1, 5);
```

<!--HJS_rdface_ApplyBeltVelocity-->

### ApplyBeltVelocity方法

#### 说明

将刚(柔)性面视为皮带，施加皮带速度。

#### 格式定义

rdface.ApplyBeltVelocity (<*fXVel, fYVel, fZVel, iGroupLow, iGroupUp* >);

#### 参数

*fXVel, fYVel, fZVel*：浮点型，全局坐标系下的三个速度分量（单位：m/s）。

*iGroupLow*、*iGroupUp*：整型，刚(柔)性面组号的下限及上限。

#### 备注

施加此速度后，刚(柔)性面不发生几何运动，但是具有运动速度，可用于模拟皮带轮上的皮带。

#### 范例

```javascript
//刚(柔)性面的皮带速度施加
rdface.ApplyBeltVelocity (10.0, 0, 0 , 1, 5)；
```

<!--HJS_rdface_CrtPart-->

### CrtPart方法

#### 说明

创建刚体部件，用于刚体动力学计算。

#### 格式定义

rdface.CrtPart(<*strPartName [,iGrp [, jGrp]]*>);

#### 参数

*strPartName*：字符串型，刚体部件的名称。

*iGrp*、*iGrp*：整型，刚(柔)性面组号的下限及上限。

#### 备注

必须将若干刚(柔)性面设置为刚体部件后，才能进行刚体动力学计算。

#### 范例

```javascript
//所有刚(柔)性面创建刚体部件
rdface.CrtPart ()；
//组号为1的刚(柔)性面创建刚体部件
rdface.CrtPart (1)；
//组号为1-5的刚(柔)性面创建刚体部件
rdface.CrtPart (1,5)；
```

<!--HJS_rdface_CrtPartAuto-->

### CrtPartAuto方法

#### 说明

创建刚体部件，用于刚体动力学计算。

#### 格式定义

rdface.CrtPartAuto(<*strCrtType(nCrtTypeId) [, [ftol]]*>);

#### 参数

*strCrtType*：字符串型，自动创建类型，只能为"group"、"geo"、"topo"。

*nCrtTypeId*：整型，自动创建类型，只能为1、2、3。

*ftol*：浮点型，容差，只有当创建类型为"geo"时起作用。

#### 备注

必须将若干刚(柔)性面设置为刚体部件后，才能进行刚体动力学计算。

#### 范例

```javascript
//根据组号自动创建刚体部件
rdface.CrtPartAuto ("group")；
//根据几何自动创建刚体部件，容差为1e-3m
rdface.CrtPartAuto ("geo", 1e-3)；
//根据拓扑自动创建刚体部件
rdface.CrtPartAuto (3)；
```

<!--HJS_rdface_CrtConnector-->

### CrtConnector方法

#### 说明

创建刚体间的弹簧连接，用于传递刚体间的作用力。

#### 格式定义

rdface.CrtConnector(<*afCoord1[3], afCoord2[3]*, *nPartID1,nPartID2,fKn,fKt,fDampRatio,fKnRota,fKtRota,fDampRatioRota*>);

rdface.CrtConnector(<*afCoord1[3], afCoord2[3]*, *strPartName1,strPartName2,fKn,fKt,fDampRatio,fKnRota,fKtRota,fDampRatioRota*>);

#### 参数

*afCoord1[3]*：浮点数组，含3个分量，弹簧第1点的坐标（单位：m）。

*afCoord2[3]*：浮点数组，含3个分量，弹簧第2点的坐标（单位：m）。

*nPartID1,nPartID2*：整型，弹簧连接的两个刚体部件的ID号。

*strPartName1,strPartName2*：字符串型，弹簧连接的两个刚体部件的名称。

*fKn,fKt*：浮点型，弹簧的法向刚度及切向刚度。

*fDampRatio*：浮点型，弹簧的法向及切向阻尼系数。

*fKnRota,fKtRota*：浮点型，弹簧的弯曲及扭转刚度。

*fDampRatioRota*：浮点型，弹簧的转动阻尼系数。

#### 备注

无。

#### 范例

```javascript
//设置刚体部件"body"与"whellLB"间的连接弹簧
rdface.CrtConnector([4,0.500018 + 0.002,0.175], [4,0.500018,0.175], "body","whellLB",1e6, 1e6,0.1,0,0,0);
```

<!--HJS_rdface_SetPartProp-->

### SetPartProp方法

#### 说明

设置刚体部件的参数。

#### 格式定义

rdface.SetPartProp(<*fMass, afCentroid[3], afJ[6],  nPartId*>);

rdface.CrtPart(<*fMass, afCentroid[3], afJ[6],  strPartName*>);

#### 参数

*fMass*：浮点型，刚体部件质量（单位：kg）。

*afCentroid[3]*：浮点数组，含3个分量，刚体质心坐标（单位：m）。

*afJ[6]*：浮点数组，含6个分量，刚体转动惯量的分量（单位：kg.m^2）。

*nPartId*：整型，刚体部件的ID号。

*strPartName*：字符串型，刚体部件的名称。

#### 备注

无。

#### 范例

```javascript
//设置刚体部件"wheel"的参数
rdface.SetPartProp(1.9e+03, [-9.363010e-06,4.997800e-01,1.240097e-01], [1.313625e+01,  1.315585e+01,2.425868e+01,0,0,0], "wheel");
```

<!--HJS_rdface_SetPartVel-->

### SetPartVel方法

#### 说明

设置刚体部件的平动速度。

#### 格式定义

rdface.SetPartVel(<*afVel[3], abFixed[3]  [, strPartName]*>);

rdface.SetPartVel(<*afVel[3], abFixed[3]  [, iParId]*>); 

rdface.SetPartVel(<*afVel[3], abFixed[3]  [, PartIdLow, PartIdUp]*>);

#### 参数

*afVel[3]*：浮点数组，含3个分量，施加的平动速度（单位：m/s）。

*abFixed[3]*：整型数组，含3个分量，是否固定速度（0-不固定，1-固定）。

*strPartName*：字符串型，刚体部件的名称。

*nPartId*：整型，刚体部件的ID号。

*PartIdLow, PartIdUp*：整型，刚体部件ID号的下限及上限。

#### 备注

无。

#### 范例

```javascript
//对所有刚体部件施加x方向1.5m/s的平动速度
rdface.SetPartRotaVel([1.5,0,0],[1,0,0]);
//对名为"test"的刚体部件施加x方向1.5m/s的平动速度
rdface.SetPartRotaVel([1.5,0,0],[1,0,0],"test");
```

<!--HJS_rdface_SetPartRotaVel-->

### SetPartRotaVel方法

#### 说明

设置刚体部件的转动速度。

#### 格式定义

rdface.SetPartRotaVel(<*afRotaVel[3], abRotaFixed[3]  [, strPartName]*>);

rdface.SetPartRotaVel(<*afRotaVel3], abRotaFixed[3]  [, iParId]*>); 

rdface.SetPartRotaVel(<*afRotaVel[3], abRotaFixed[3]  [, PartIdLow, PartIdUp]*>);

#### 参数

*afRotaVel[3]*：浮点数组，含3个分量，施加的转动速度（单位：转/s）。

*abRotaFixed[3]*：整型数组，含3个分量，是否固定转动速度（0-不固定，1-固定）。

*strPartName*：字符串型，刚体部件的名称。

*nPartId*：整型，刚体部件的ID号。

*PartIdLow, PartIdUp*：整型，刚体部件ID号的下限及上限。

#### 备注

无。

#### 范例

```javascript
//对所有刚体部件的转速都设置为0
rdface.SetPartRotaVel([0,0,0],[1,1,1]);
```

<!--HJS_rdface_SetPartForce-->

### SetPartForce方法

#### 说明

设置刚体部件的外力。

#### 格式定义

rdface.SetPartForce(<*afAppliedForce[3]  [, strPartName]*>);

rdface.SetPartForce(<*afAppliedForce[3]  [, iParId]*>); 

rdface.SetPartForce(<*afAppliedForce[3]  [, PartIdLow, PartIdUp]*>);

#### 参数

*afAppliedForce[3]*：浮点数组，含3个分量，施加的外力（单位：N）。

*strPartName*：字符串型，刚体部件的名称。

*nPartId*：整型，刚体部件的ID号。

*PartIdLow, PartIdUp*：整型，刚体部件ID号的下限及上限。

#### 备注

无。

#### 范例

```javascript
//对名为"test"的刚体部件施加Y方向的外力为-20000N
rdface.SetPartForce([0,-20000,0], "test");
```

<!--HJS_rdface_SetPartMoment-->

### SetPartMoment方法

#### 说明

设置刚体部件的外力矩。

#### 格式定义

rdface.SetPartMoment(<*afAppliedMoment[3]  [, strPartName]*>);

rdface.SetPartMoment(<*afAppliedMoment[3]  [, iParId]*>); 

rdface.SetPartMoment(<*afAppliedMoment[3]  [, PartIdLow, PartIdUp]*>);

#### 参数

*afAppliedMoment[3]*：浮点数组，含3个分量，施加的外力矩（单位：N.m）。

*strPartName*：字符串型，刚体部件的名称。

*nPartId*：整型，刚体部件的ID号。

*PartIdLow, PartIdUp*：整型，刚体部件ID号的下限及上限。

#### 备注

无。

#### 范例

```javascript
//对名为"test"的刚体部件施加Y方向的外力为-20000N.m
rdface.SetPartMoment([0,-20000,0], "test");
```

<!--HJS_rdface_SetPartLocalDamp-->

### SetPartLocalDamp方法

#### 说明

设置刚体部件的局部阻尼。

#### 格式定义

rdface.SetPartLocalDamp(<*fTransRatio, fRotaRatio  [, strPartName]*>);

rdface.SetPartLocalDamp(<*fTransRatio, fRotaRatio  [, iParId]*>); 

rdface.SetPartLocalDamp(<*fTransRatio, fRotaRatio  [, PartIdLow, PartIdUp]*>);

#### 参数

*fTransRatio, fRotaRatio*：浮点型，平动局部阻尼系数及转动局部阻尼系数。

*strPartName*：字符串型，刚体部件的名称。

*nPartId*：整型，刚体部件的ID号。

*PartIdLow, PartIdUp*：整型，刚体部件ID号的下限及上限。

#### 备注

无。

#### 范例

```javascript
//设置所有刚体部件的平动局部阻尼系数为0.02，转动局部阻尼系数为0.05
rdface.SetPartLocalDamp(0.02, 0.05);
```

<!--HJS_rdface_CalPartPropAuto-->

### CalPartPropAuto方法

#### 说明

设置刚体部件的局部阻尼。

#### 格式定义

rdface.CalPartPropAuto( <*fDensity, NDivNo[, strPartName]*>);

rdface.CalPartPropAuto( <*fDensity, NDivNo[,PartIdLow, PartIdUp ]*>);

#### 参数

*fDensity*：浮点型，刚体部件的密度（单位：kg/m^3）。

*NDivNo*：整型，背景网格的细分数量。

*strPartName*：字符串型，刚体部件的名称。

*PartIdLow, PartIdUp*：整型，刚体部件ID号的下限及上限。

#### 备注

背景网格细分数量*NDivNo*越大，刚体部件质量、刚体部件转动惯量计算越精确。

#### 范例

```javascript
//对刚体部件名为"test"的刚体自动计算性质，密度为2000kg/m^3，分割数为100。
rdface.CalPartPropAuto(2000, 100, "test");
```

<!--HJS_rdface_SetDeformMat-->

### SetDeformMat方法

#### 说明

设置柔性面的材料参数。

#### 格式定义

rdface.SetDeformMat(*<thickness, density, young, poisson, cohesion, tension, friction, localdamp [,group1 [, group2] ]>*);

#### 参数

*thickness*：浮点型，板（壳）厚度（单位：m）。

*density*：浮点型，材料密度（单位：kg/m^3）。

*young*：浮点型，材料弹性模量（单位：Pa）。

*poisson*：浮点型，材料泊松比（单位：/）。

*cohesion*：浮点型，材料粘聚力（单位：Pa）。

*tension*：浮点型，材料抗拉强度（单位：Pa）。

*friction*：浮点型，材料内摩擦角（单位：°）。

*localdamp*：浮点型，材料局部阻尼系数（单位：/）。

*group1 ,group12*：整型，柔性面组号。

#### 备注

（1）包含3种调用方式，第1种为不带组号，表示所有单元施加材料参数；第2种为带一个组号，表示对该组号的单元施加材料参数；第3种为带两个组号，分别表示组号的下限及上限，当单元的组号位于下限及上限之间，施加材料参数。

（2）静力问题，局部阻尼系数一般可取0.8；动力计算，局部阻尼系数可取0.01-0.03。

（3）执行该材料参数设置，将自动计算节点质量及虚拟质量，并将自动根据全局的重力加速度方向及大小计算重力。

#### 范例

```java
//对组号为1到3之间的单元施加参数
rdface.SetDeformMat(0.1, 2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8, 1, 3);
```

<!--HJS_rdface_SetGravity-->

### SetGravity方法

#### 说明

设置柔性面的重力。

#### 格式定义

rdface.SetGravity(*<fgx, fgy, fgz>*);

#### 参数

*fgx, fgy, fgz*：浮点型，重力加速度的三个分量（单位：m/s^2）。

#### 备注

```java
//对组号为1到3之间的单元施加参数
rdface.SetDeformMat(0.1, 2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8, 1, 3);
```











<!--HJS_rdface_GetElemValue-->

### GetElemValue方法

#### 说明

获取刚(柔)性面单元的信息。

#### 范例

```java
//施加重力
rdface.SetGravity(0.0, 0.0, -9.8);
```

<!--HJS_rdface_SetFaceForceByCoord-->

### SetFaceForceByCoord方法

#### 说明

设置柔性面的面力，当柔性面面心坐标位于坐标下限及上限范围内，施加该面力。

#### 格式定义

rdface.SetFaceForceByCoord(*<fFaceFx, fFaceFy, fFaceFz, fx1, fx2, fy1, fy2, fz1, fz2>*);

#### 参数

*fFaceFx, fFaceFy, fFaceFz*：浮点型，全局坐标系下面力的三个分量（单位：Pa）。

*fx1, fx2*：浮点型，x方向坐标的下限及上限（单位：m）。

*fy1, fy2*：浮点型，y方向坐标的下限及上限（单位：m）。

*fz1, fz2*：浮点型，z方向坐标的下限及上限（单位：m）。

#### 备注

面力的施加采用的是累加的算法，如对同一个柔性面多次执行面力施加，后一次施加的值将在前一次施加的值上累加。

#### 范例

```java
//设置面力
rdface.SetFaceForceByCoord(0.0, 0.0, -1e5, -1e6, 1e6, -1e6, 1e6, -0.01, 0.01);
```

<!--HJS_rdface_SetNodalForceByCoord-->

### SetNodalForceByCoord方法

#### 说明

设置柔性面的节点力边界，当柔性面节点坐标位于坐标下限及上限范围内，施加该节点力。

#### 格式定义

rdface.SetNodalForceByCoord(*<fNodalFx, fNodalFy, fNodalFz, fx1, fx2, fy1, fy2, fz1, fz2>*);

#### 参数

*fNodalFx, fNodalFy, fNodalFz*：浮点型，全局坐标系下节点力的三个分量（单位：N）。

*fx1, fx2*：浮点型，x方向坐标的下限及上限（单位：m）。

*fy1, fy2*：浮点型，y方向坐标的下限及上限（单位：m）。

*fz1, fz2*：浮点型，z方向坐标的下限及上限（单位：m）。

#### 备注

节点力的施加采用的是覆盖的算法，如对同一个节点多次执行节点力施加，后一次施加的值将覆盖前一次施加的值。

#### 范例

```java
//设置节点力
rdface.SetNodalForceByCoord(0.0, 0.0, -1e5, -1e6, 1e6, -1e6, 1e6, -0.01, 0.01);
```

<!--HJS_rdface_SetVelocityByCoord-->

### SetVelocityByCoord方法

#### 说明

设置柔性面的速度边界，当柔性面节点坐标位于坐标下限及上限范围内，施加该速度边界。

#### 格式定义

rdface.SetVelocityByCoord(*<fVel_x, fVel_y, fVel_z, bFix_x, bFix_y, bFix_z, fx1, fx2, fy1, fy2, fz1, fz2>*);

#### 参数

*fVel_x, fVel_y, fVel_z*：浮点型，全局坐标系下速度的三个分量（单位：m/s）。

*bFix_x, bFix_y, bFix_z*：整型，全局坐标系下速度的三个分量是否固定，0-不固定，1-固定，只能取0、1。

*fx1, fx2*：浮点型，x方向坐标的下限及上限（单位：m）。

*fy1, fy2*：浮点型，y方向坐标的下限及上限（单位：m）。

*fz1, fz2*：浮点型，z方向坐标的下限及上限（单位：m）。

#### 备注

如果速度固定，计算过程中该节点的速度始终保持设定的速度；如果速度不固定，相当于施加了一个速度初值，计算过程中速度会根据节点受力而改变。

#### 范例

```java
//设置速度边界，三个方向的速度均为0，且均固定
rdface.SetVelocityByCoord(0.0, 0.0, 0.0,  1,1,1,  -1e6, 1e6, -1e6, 1e6, -0.01, 0.01);
```

<!--HJS_rdface_ApplyDynaVel-->

### ApplyDynaVel方法

#### 说明

设置柔性面的动态平动速度边界。

#### 格式定义

rdface.ApplyDynaVel(<strFile, afVelCoeff, anApplyFlag, GroupLow, GroupUp>);

#### 参数

*strFile*：字符串型，速度时程文本文件，该文本文件的第一行为时程点数，从第二行开始，每行两个数，第一个数为时间，第二个数为速度值（单位：m/s）。

*afVelCoeff*：浮点型数组，包含3个分量，表示X、Y、Z三个方向的速度系数，该系数乘以文本文件中的速度值为最终的速度。

*anApplyFlag*：整型数组，包含3个分量，某一方向的动态速度是否施加标记，0-不施加，1-施加。一旦选择为1，该方向的动态速度将替换为本次施加的速度，之前时间的动态速度将被覆盖。

*GroupLow, GroupUp*：整型，刚性面组号的下限及上限。

#### 备注

（1）该命令在导入刚性面后且计算前施加，可以针对某一范围的刚性面组号进行多次施加。

（2）当计算时间位于某时程文件中两个时间之间时，将采用线性插值的方式计算出该时刻的实际速度。

#### 范例

```javascript
//对刚性面组施加水平及竖向速度
rdface.ApplyDynaVel("nor-7-lef-hori.txt", [3,0,3], [1,0,1], 1, 11);
rdface.ApplyDynaVel("nor-7-lef-ver.txt", [0,3,0], [0,1,0], 1, 11);
```

<!--HJS_rdface_GetElemValue -->

### GetElemValue 方法

#### 说明

获取刚(柔)性面单元的信息。

#### 格式定义

rdface. GetElemValue (<*ielem*,*msValueName*[,*iflag*]>);

#### 参数

*ielem*：整型，单元序号，从1开始。

*msValueName*：字符串型，可供获取的刚(柔)性面单元变量**，具体见附表9**。

*iflag*：整型，设置变量的分量ID号，如果获取的变量为标量或希望获取ID为1是的量，可以不写，或写1。

#### 备注

#### 范例

```java
//将第10号刚(柔)性面的总节点数赋给totalno变量
var totalno = rdface.GetElemValue(10, "TotalVertex");
```

<!--HJS_rdface_SetElemValue-->

### SetElemValue方法

#### 说明

设置刚(柔)性面单元的信息。

#### 格式定义

rdface. SetElemValue (<*ielem*,*msValueName, fValue,* [,*iflag*]>);

#### 参数

*ielem*：整型，单元序号，从1开始。

*msValueName*：字符串型，可供设置的刚(柔)性面单元变量**，具体见附表9**。

*fValue：*浮点型，需要设置的变量的具体数值。

*iflag*：整型，设置变量的分量ID号，如果设置的变量为标量或希望设置ID为1是的量，可以不写，或写1。

#### 备注

#### 范例

```java
//设置第10号刚(柔)性面单元的法向刚度Kn为1e9 N/m
var totalno = rdface.SetElemValue(10, "Kn", 1e9);
```



<!--HJS_rdface_ExportTerrainData-->

### ExportTerrainData方法

#### 说明

导出Grid格式的地形文件（滑床文件），供其他求解器求解地质流体问题使用。

#### 格式定义

rdface.ExportTerrainData(<*fXMin, fXMax, fYMin, fYMax, nXNo, nYNo, strFileName [,fFillData]*>);

#### 参数

*fXMin, fXMax, fYMin, fYMax*：浮点型，导出的Grid格式网格在X方向、Y方向的最小值及最大值。

*nXNo, nYNo*：整型，X方向及Y方向的格点数量。

*strFilename*：字符串型，输出的Grid格式的网格文件名。

*fFillData*：浮点型，超出区域的填充赋值，可以不写。如果不写，则自动填充-1e20表示超出区域；如果写，则超出区域自动填充*fFillData*设定的值。

#### 备注

#### 范例

```java
rdface.ExportTerrainData(0.0, 100.0, 0.0, 100.0, 200, 200, "CdemGrid.dat");
```



<!--HJS_rdface_Solver-->

### Solver方法

#### 说明

刚(柔)性面核心求解器（每一迭代步使用）。

#### 格式定义

rdface.Solver()

#### 参数

无。

#### 备注

#### 范例

```java
rdface.Solver();
```



