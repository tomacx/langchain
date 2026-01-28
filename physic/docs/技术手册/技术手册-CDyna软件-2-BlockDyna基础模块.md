

<!--HJS_blkdyn_basic_modules-->

# 块体基础模块

块体基础模块主要用于模拟固体材料从连续体到非连续体的渐进破坏过程。用户可以基于该模块中的接口函数，实现固体材料弹性、塑性、损伤、破裂过程的模拟，还可以实现固体材料接触、碰撞、破碎、散落、堆积过程的模拟。

块体基础模块类（blkdyn）中的成员函数按照其实现的功能可分为计算网格设置、接触面设置、单元模型设置、接触面模型设置、一般初边值条件设置、动态边界条件设置、阻尼设置、信息输出设置、信息设置及获取、核心求解函数调用等多个类别。

<!--HJS_blkdyn_mesh_set-->

## 计算网格设置

计算网格设置中提供了网格导入、网格调整等多个功能函数，函数列表见表3.1。

<center>表3.1计算网格设置的相关函数</center>

<table>
  	<tr>
		<th>序号</th><th>函数名</th><th>说明</th>
    </tr>
    	<td>1</td><td>GetMesh</td><td>从Genvi平台获取网格并加载到块体模块求解器。</td>
	</tr>
	</tr>
    	<td>1</td><td>ImportGrid</td><td>从外部文件导入实体单元网格（支持二维及三维）。</td>
	</tr>
    	<td>2</td><td>GenBrick2D</td><td>创建参数化的二维砖块网格。</td>
	</tr>
    	<td>3</td><td>GenBrick3D</td><td>创建参数化的三维砖块网格。</td>
	</tr>
    	<td>4</td><td>GenCircle</td><td>创建参数化的二维圆域。</td>
	</tr>
    	<td>5</td><td>GenCylinder</td><td>创建参数化的三维圆柱。</td>
	</tr>
    	<td>6</td><td>MoveGrid</td><td>网格坐标移动。</td>
	</tr>
    	<td>7</td><td>RotateGrid</td><td>网格坐标旋转。</td>
	</tr>
    	<td>8</td><td>ZoomGrid</td><td>网格坐标缩放。</td>
	</tr>
    	<td>9</td><td>ShrinkGrid</td><td>网格按照各自的体心缩进。</td>
	</tr>
        <td>10</td><td>SetGroupByID</td><td rowspan=12>网格重新分组，便于进行后续的材料参数赋值、分步开挖等操作。</td>
	</tr>
        <td>11</td><td>SetGroupByCoord</td>
	</tr>
        <td>12</td><td>SetGroupByPlane</td>
	</tr>
        <td>13</td><td>SetGroupByCylinder</td>
	</tr>
        <td>14</td><td>SetGroupByTable</td>
	</tr>
        <td>15</td><td>SetGroupByGroup</td>
	</tr>
        <td>16</td><td>SetGroupByPlaneAndGroup</td>
	</tr>
        <td>17</td><td>SetGroupByLength</td>
	</tr>
        <td>18</td><td>SetGroupBySel</td>
	</tr>
        <td>19</td><td>SetGroupByLine</td>
	</tr>
        <td>20</td><td>SetGroupByCircle</td>
    </tr>
        <td>21</td><td>SetGroupBySphere</td>
	</tr>
        <td>22</td><td>RandomizeGridByCoord</td><td rowspan=2>网格节点坐标的空间随机（用于产生不规则网格）。</td>
	</tr>
        <td>23</td><td>RandomizeGridByGroup</td>
	</tr>
        <td>24</td><td>RandomizeGroupByElem</td><td rowspan=3>网格组号的空间随机（用于产生空间随机分布的若干组材料，便于开展若干种材料随机混合后的力学特性分析）。</td>
	</tr>
        <td>25</td><td>RandomizeGroupByBall</td>
	</tr>
        <td>26</td><td>RandomizeGroupByNode</td>
	</tr>
    </table>


<!--HJS_blkdyn_GetMesh-->

### GetMesh方法

#### 说明

从Genvi平台获取网格并加载到块体模块求解器。

#### 格式定义

blkdyn.GetMesh (<*mesh*>);

#### 参数

*mesh*：网格对象。

#### 备注

#### 范例

```javascript
//利用平台的imesh模块导入ansys网格
var msh1 = imesh.importAnsys("wedge94.dat");
//将平台的网格加载到块体模块核心求解器
blkdyn.GetMesh(msh1);
```

<!--HJS_blkdyn_ImportGrid-->

### ImportGrid方法

#### 说明

导入Patran、Ansys、Flac3D、GiD、ABAQUS、Gmsh、Midas、Genvi等商用或开源软件生成的计算网格。

#### 格式定义

blkdyn.ImportGrid (<*FileType*[, *FilePath*]>);

#### 参数

*FileType*：文件类型，可以为ID号，也可以为字符串。

（1）ID号输入为：1-从Patran导入，2-从Ansys导入，3-从 Flac3D 导入，4-从GiD导入，5-从 ABAQUS 导入，6-从Gmsh导入，7-从Midas，8-从Genvi导入。

（2）字符串输入为："Patran"、"Ansys"、"Flac3D"、"GiD"、"ABAQUS"、"Gmsh"、"Midas"、"Genvi"，大小写均可。

*FilePath*：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（1）从Patran导入时适用的单元类型包括Tria3、Quad4、Tet4、Wedge6及Hex8，通过File菜单Export下的Fromat中选择Neutral，输出文件名后缀为.out文件，文件名中英文均可。

（2）从Ansys中输出网格需要借助一段命令流文件"AnsysToBlockDyna.txt"（见附件1），在Ansys里建立网格（用plane42或solid45划分），在File菜单下选择Read input from，导入AnsysToBlockDyna.txt文件，在没有修改存放路径的情况下，将在D盘根目录下出现ansys.dat文件。

（3）从Flac3D中导入时，组号必需为大于等于1的自然数，可在Flac3D的命令行中输入expgrid ***.flac3d，然后通过本命令流导入。

（4）从GiD导入，在GiD菜单FILE—>Export—>ASCII project，将在指定目录下创建*.gid文件夹，该文件夹中的文本文件*.msh即为导入时的网格。

（5）从ABAQUS导入，支持的网格格式包括C3D8、C3D8R、C3D6、C3D4、C2D3、S3R、CPS3、CPE3、C2D4、C2D4R、S4R、CPS4、CPS4R、CPE4、CPE4R，导入的是*.inp文件。

（6）从Gmsh导入，首先利用Gmsh开源软件进行建模并划分网格，同时分物理组（Physical Surface/Volume），否则将存在点、线、面、体单元全部导出的现象。而后从File菜单下的Save mesh选项导出网格。

（7）从Midas导入，首先利用Midas软件进行建模，而后导出为fpn格式的文本文件。

（8）从Genvi导入，首先用Genvi建立网格，然后菜单栏导出为Genvi通用格式gvx文本文件。

（9）如果*FilePath*中直接输入网格文件名，则从软件当前路径下读入网格文件（用户可通过在命令输入框中输入pwd()查看当前路径）。用户也可以在网格文件名的前面增加路径，此时的路径分割符需要用两个正斜杠"\\"或一个反斜杠"/"表示。

#### 范例

```javascript
//从ansys导入文件
blkdyn.ImportGrid(2, "ansys.dat");
//从gid导入文件
blkdyn.ImportGrid("gid", "D:\\Gid\\slope.msh");
blkdyn.ImportGrid("gid", "D:/Gid/slope.msh");
```

<!--HJS_blkdyn_GenBrick2D-->

### GenBrick2D方法

#### 说明

创建参数化的二维方块模型。

#### 格式定义

blkdyn.GenBrick2D(<*fLengthX*, *fLengthY*, *iNoX*, *iNoY*, *iGroup>*);

#### 参数

*fLengthX*：浮点型，X正方向的长度（单位：m）。

*fLengthY*：浮点型，Y正方向的长度（单位：m）。

*iNoX*：整型，X正方向的单元个数，大于等于1。

*iNoY*：整型，Y正方向的单元个数，大于等于1。

*iGroup*：整型，单元的组号，大于等于1。

#### 备注

所创建二维网格的基点坐标为(0,0,0)。

#### 范例

```javascript
blkdyn.GenBrick2D(10.0, 10.0, 100, 100,1);
```

<!--HJS_blkdyn_GenBrick3D-->

### GenBrick3D方法

#### 说明

创建参数化的三维方块模型。

#### 格式定义

blkdyn.GenBrick3D(<*fLengthX*, *fLengthY*, *fLengthZ, iNoX*, *iNoY, iNoZ*, *iGroup>*);

#### 参数

*fLengthX*、*fLength*、*fLengthZ*：浮点型，分别表示X、Y、Z正方向的长度（单位：m）。

*iNoX*、*iNoY*、*iNoZ*：整型，分别表示X、Y、Z正方向的单元个数，大于等于1。

*iGroup*：整型，单元的组号，大于等于1。

#### 备注

所创建三维网格的基点坐标为(0,0,0)。

#### 范例

```javascript
blkdyn.GenBrick3D(10.0, 10.0, 10.0, 10, 10, 10, 1);
```

<!--HJS_blkdyn_GenCircle-->

### GenCircle方法

#### 说明

创建参数化的二维圆域模型。

#### 格式定义

blkdyn.GenCircle(<*fRadIn*, *fRadOut*, *iNoRad*, *iNoCir*, iGroup>);

#### 参数

*fRadIn*、*fRadOut*：浮点型，分别表示圆的内、外半径（单位：m）；内半径小于等于0，为实心圆；内半径大于0且小于外半径，圆环。

*iNoRad*、*iNoCir*：整型，分别表示径向及环向的单元分割数；其中径向分割数应该大于等于1，环向分割数应该大于等于3。

*iGroup*：整型，单元的组号，大于等于1。

#### 备注

所创圆域的圆心坐标为(0,0,0)。

#### 范例

```javascript
blkdyn.GenCircle(0.1,0.5,10,30,2);
```

<!--HJS_blkdyn_GenCylinder-->

### GenCylinder方法

#### 说明

创建参数化的三维圆柱模型。

#### 格式定义

blkdyn.GenCylinder (<*fRadIn*, *fRadOut*, *fHeight*, *iNoRad*, *iNoCir*, *iNoH*, *iGroup*>);

#### 参数

*fRadIn*、*fRadOut*：浮点型，分别表示圆柱的内、外半径（单位：m）；内半径小于等于0，为实心圆柱；内半径大于0且小于外半径，为空心圆柱。

*fHeight*：浮点型，圆柱的高度（单位：m）。

*iNoRad*、*iNoCir*、*iNoH*：整型，分别表示径向、环向及高度方向的单元分割数；其中径向分割数及高度方向分割数应该大于等于1，环向分割数应该大于等于3。

*iGroup*：整型，单元的组号，大于等于1。

#### 备注

所创圆柱的圆心坐标为(0,0,0)，轴向方向为Y轴正方形。

#### 范例

```javascript
blkdyn.GenCircle(0.0, 0.05, 0.2, 10, 40, 40, 1);
```

<!--HJS_blkdyn_MoveGrid-->

### MoveGrid方法

#### 说明

当某单元的组号位于组号下限及组号上限之间（包含下限及上限）时，对该单元向X、Y、Z移动一定的距离。

#### 格式定义

blkdyn.MoveGrid(<*fArrayCoord*[3], *iGroupLow*, *iGroupUp*>);

#### 参数

*fArrayCoord*：Array浮点型，包含3个分量，在全局坐标系下三个方向的移动分量（单位：m）。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
//将组号大于等于2小于等于4的单元向X轴正方向整体平移1m。
var coord = new Array(1.0, 0.0, 0.0);
blkdyn.MoveGrid(coord, 2, 4);
```

<!--HJS_blkdyn_RotateGrid-->

### RotateGrid方法

#### 说明

当某单元的组号位于组号下限及组号上限之间（包含下限及上限）时，对该单元沿着设定的原点及设定的转轴旋转设定的角度。

#### 格式定义

blkdyn.RotateGrid(<*fRotateAngle*, *fArrayOrigin*[3], *fArrayNormal*[3], *iGroupLow*, *iGroupUp*>);

#### 参数

*fRotateAngle*：浮点型，旋转角度（单位：度）。

*fArrayOrigin*：Array浮点型，包含3个分量，原点坐标（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，转轴方向。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

按照右手螺旋坐标系方向旋转，旋转角度为正，反之旋转角度为负。

#### 范例

```javascript
////定义原点
var origin = new Array(0.0, 0.0, 0.0);
////定义转轴方向
var normal = new Array(1.0, 0.0, 0.0);
///对组号位于3和5之间的单元，沿着设定的原点及转轴旋转30度
blkdyn.RotateGrid(30.0, origin, normal, 3, 5);
```

<!--HJS_blkdyn_ZoomGrid-->

### ZoomGrid方法

#### 说明

当某单元的组号位于组号下限及组号上限之间（包含下限及上限）时，对该单元沿着设定的原点进行缩放。

#### 格式定义

blkdyn.ZoomGrid(<*fZoomValue*, *fArrayCoord*[3], *iGroupLow*, *iGroupUp*>);

#### 参数

*fZoomValue*：浮点型，缩放比例（大于0的浮点数）。

*fArrayCoord*：Array浮点型，包含3个分量，原点坐标（单位：m）。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

缩放比例*fZoomValue*大于1时表示放大，小于1时表示缩小，等于1时表示不缩放。

#### 范例

```javascript
///定义原点坐标
var coord = new Array(0, 1, 2);
///将组号为2及3的单元缩小至原尺寸的0.1倍
blkdyn.ZoomGrid(0.1, coord, 2, 3);
```

<!--HJS_blkdyn_ShrinkGrid-->

### ShrinkGrid方法

#### 说明

当某单元的组号位于组号下限及组号上限之间（包含下限及上限）时，对该单元沿着自身的体心进行缩进。

#### 格式定义

blkdyn.ShrinkGrid(<*fCoeff*, *iGroupLow*, *iGroupUp*>);

#### 参数

*fCoeff*：浮点型，缩进比例因子（0-1之间）。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

缩进比例因子的取值位于0.0和1.0之间；当取0.0表示不缩进，当取1时表示100%缩进（全部凝结至体心）。

#### 范例

```javascript
///将组号为2及3的单元向各自的体心缩进0.1倍
blkdyn. ShrinkGrid(0.1, 2, 3);
```

<!--HJS_blkdyn_SetGroupByID-->

### SetGroupByID方法

#### 说明

将单元序号在小标号与大标号之间的单元设定为对应的组。

#### 格式定义

blkdyn.SetGroupByID(<*iGroup*, *iIDLow*, *iIDUp*>);

#### 参数

*iGroup*：整型，要设置的组号。

*iIDLow*：整型，单元序号的小标号。

*iIDUp*：整型，单元序号的大标号。

#### 备注

单元的ID号从1开始。

#### 范例

```javascript
///将单元ID号为5-1500之间的单元设置为组3
blkdyn.SetGroupByID(3, 5, 1500);
```

<!--HJS_blkdyn_SetGroupByCoord-->

### SetGroupByCoord方法

#### 说明

将单元体心位于x、y、z 上下限控制范围内的单元设定为对应的组。

#### 格式定义

blkdyn.SetGroupByCoord (<*iGroup*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*iGroup*：整型，选择要设置的组号。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
///将坐标上下限范围内的单元设置为组3
blkdyn.SetGroupByCoord(3, -3.0, 3.0, -1e5, 1e5, -10.0, 10.0);
```

<!--HJS_blkdyn_SetGroupByPlane-->

### SetGroupByPlane方法

#### 说明

当某单元的体心位于某面的上方或下方时，将该单元设置为对应的组。

#### 格式定义

blkdyn.SetGroupByPlane(<*iGroup*, *fArrayOrigin*[3], *fArrayNormal*[3], *ifAbove*>);

#### 参数

*iGroup*：整型，选择要设置的组号。

*fArrayOrigin*：Array浮点型，包含3个分量，原点坐标（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，单位法向。

*ifAbove*：布尔型，上下标识符。

#### 备注

根据原点及法向确定某一空间平面，根据面上下标志符确定位于面的上侧或下侧。*ifAbove*如果true，则位于面上方，如为false，则位于面下方。

#### 范例

```javascript
///定义原点
var origin = new Array(0.0, 0.0, 0.0);
///定义法向
var normal = new Array(1.0, 0.0, 0.0);
///将体心位于由origin及normal定义的平面上方的单元设定为组1
blkdyn. SetGroupByPlane(1, origin, normal, true);
```

<!--HJS_blkdyn_SetGroupByCylinder-->

### SetGroupByCylinder方法

#### 说明

将体心位于某一空心圆柱内的单元设置为特定组。

#### 格式定义

blkdyn.SetGroupByCylinder(<*iGroup*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*>);

#### 参数

*iGroup*：整型，选择要设置的组号。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
blkdyn.SetGroupByCylinder(3, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.2, 0.8);
```

<!--HJS_blkdyn_SetGroupByTable-->

### SetGroupByTable方法

#### 说明

以Table 中的坐标数据作为非规则封闭多边形，如果单元体心位于封闭多边形内部，则设定该单元为设定的组号。

#### 格式定义

blkdyn.SetGroupByTable(<*iGroup*, *strTableName*>);

#### 参数

*iGroup*：整型，选择要设置的组号。

*strTableName*：字符串型，Table表格的名字。

#### 备注

使用Table进行范围选择时，首先需借助dyna.CreateTable(<>)函数建立table 表格（见2.12.1节中的dyna.CreateTable函数）。Table中的坐标数据应安装顺时针或逆时针书写。

#### 范例

```javascript
///将名字为"table1"的表格中的数据框选的单元设定为组号1。
blkdyn. SetGroupByTable(1,"table1");
```

<!--HJS_blkdyn_SetGroupByGroup-->

### SetGroupByGroup方法

#### 说明

将位于组号下限及上限（含下限及上限）之间的单元重新设定为新的组。

#### 格式定义

blkdyn.SetGroupByGroup(<*iGroup*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iGroup*：整型，要设置的组号。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无

#### 范例

```javascript
blkdyn.SetGroupByGroup(5, 1, 4);
```

<!--HJS_blkdyn_SetGroupByPlaneAndGroup-->

### SetGroupByPlaneAndGroup方法

#### 说明

当某面穿过某单元且该单元在设定的组号下限及上限之间，将该单元设置为新的组号。

#### 格式定义

blkdyn.SetGroupByPlaneAndGroup(<*iGroup*, *fArrayOrigin*[3], *fArrayNormal*[3], iGroupLow, iGroupUp>);

#### 参数

*iGroup*：整型，要设置的组号。

*fArrayOrigin*：Array浮点型，包含3个分量，面的原点坐标（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，面的单位法向。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///设置面的原点
var origin = new Array(0.0, 0.0, 0.0);
///设置面的法向
var normal = new Array(0, 0, 0);
///被设定的面所穿过且组号为2及3的单元的组号重新设定为1。
blkdyn. SetGroupByPlaneAndGroup(1, origin, normal, 2, 3);
```

<!--HJS_blkdyn_SetGroupByLength-->

### SetGroupByLength方法

#### 说明

将单元的最小尺寸位于下限及上限之间的单元设定为特定的组号。

#### 格式定义

blkdyn.SetGroupByLength(<*iGroup*, *fLengthLow*, *fLengthUp*>);

#### 参数

*iGroup*：整型，选择要设置的组号。

*fLengthLow*：整型，边长或某一点到对面距离的下限值。（单位：m）。

*fLengthUp*：整型，边长或某一点到对面距离的上限值。（单位：m）。

#### 备注

该接口函数主要用于对一些特殊尺寸的单元做处理，如可用该函数找到过于畸形的单元，并通过其他接口函数进行删除处理等。

#### 范例

```javascript
///将单元尺寸为0-1e-4m之间的单元设定为组5
blkdyn.SetGroupByLength(5,0.0,1e-4);
```

<!--HJS_blkdyn_SetGroupByLine-->

### SetGroupByLine方法

#### 说明

将单元被线段穿过（二维）或单元体心到线段的距离小于设置值时（三维），对单元进行重新分组。

#### 格式定义

blkdyn.SetGroupByLine(<*iGroup*, *x0, y0, z0, x1, y1, z1 [,ftol]*>);

#### 参数

*iGroup*：整型，选择要设置的组号。

*x0*、*y0*、*z0*：浮点型，线段其中一个端点的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，线段另一个端点的坐标（单位：m）。

*ftol*：浮点型，容差，三维时起作用（单位：m）。

#### 备注

（1）当单元为二维单元时，根据线段是否穿过单元进行分组判断。

（2）当单元为三维单元时，根据单元体心到线段的距离是否小于容差进行判断，如果*ftol*不输入，则默认的容差为单元体系中最小的单元尺寸。

#### 范例

```javascript
///根据线段重新分组
blkdyn.SetGroupByLine(2, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0);
blkdyn.SetGroupByLine(2, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 1e-5);
```

<!--HJS_blkdyn_SetGroupByCircle-->

### SetGroupByCircle方法

#### 说明

将单元被圆盘穿过时，对单元进行重新分组。

#### 格式定义

blkdyn.SetGroupByCircle(<*iGroup*, *frad, fcx, fcy, fcz, fnx, fny, fnz*>);

#### 参数

*iGroup*：整型，选择要设置的组号。

*frad*：浮点型，圆半径（单位：m）。

*fcx**、**fcy**、**fcz*：浮点型，圆心坐标（单位：m）。

*fnx**、**fny**、**fnz*：浮点型，圆面的法向量。

#### 备注

#### 范例

```javascript
///根据圆面重新分组，半径0.5m，圆心（0,0,0），法向（0,1,0）
blkdyn.SetGroupByCircle(2, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0,0.0);
```

<!--HJS_blkdyn_SetGroupBySel-->

### SetGroupBySel方法

#### 说明

根据Genvi点、面、单元选择集中的元素进行重新分组。

#### 格式定义

blkdyn.SetGroupBySel(<*oSel, iGroup*>);

#### 参数

*oSel*：类对象，表示通过Genvi平台选择的单元。

*iGroup*：整型，选择要设置的组号。

#### 备注

如果选择集为点，则将与该点相关的所有单元的组号设置为*iGroup*；如果选择集为面，则将与该面相关的所有单元的组号设置为*iGroup*；如果选择集为单元，则将该单元的组号设置为*iGroup*。

#### 范例

```javascript
// 通过Genvi平台选择单元
oSel = new SelElems(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);
///将选择集中对应的单元设置为组5
blkdyn.SetGroupBySel(oSel, 5);
```

<!--HJS_blkdyn_SetGroupBySphere-->

### SetGroupBySphere方法

#### 说明

当单元体心位于内外同心球之间时，对相应的单元进行重新分组。

#### 格式定义

blkdyn.SetGroupBySphere(<*GroupNo*, *fCx, fCy, fCz, fRad1, fRad2>)*;

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*fCx*、*fCy*、*fCz*：浮点型，球心坐标（单位：m）。

*fRad1*、*fRad2*：浮点型，球的内半径及外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
//新组号为2，球心[0,0,0]，内半径1m，外半径2m
blkdyn.SetGroupBySphere(2,0,0,0,1,2);
```

<!--HJS_blkdyn_RandomizeGridByCoord-->

### RandomizeGridByCoord方法

#### 说明

对相应坐标范围内的网格节点的坐标进行随机，以产生随机网格。

#### 格式定义

blkdyn.RandomizeGridByCoord(<*strDirectName*, *fCoeff*, *x0*, *x1*, *y0*, *y1*, z*0*, *z1*>);

#### 参数

*strDirectName*：字符串型，表示节点坐标的随机方向，共包含x、y、z、xy、yz、zx、xyz等7种表述，字符串中最多三个字母。

*fCoeff*：浮点型，随机幅度，即节点离开原始位置的最大距离（单位：m）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

如为离散型网格的节点随机，随机可能会出现网格彼此重叠的现象。

#### 范例

```javascript
///将设定范围内的节点在xy两个方向进行随机，随机的最大尺度为0.2m
blkdyn.RandomizeGridByCoord("xy", 0.2, -1e5,1e5,0.1,0.5,-1e5,1e5);
```

<!--HJS_blkdyn_RandomizeGridByGroup-->

### RandomizeGridByGroup方法

#### 说明

对某一特定组号的单元节点进行随机，以便产生随机网格。

#### 格式定义

blkdyn.RandomizeGridByGroup(<*strDirectName*, *fCoeff*, *iGroup*>);

#### 参数

*strDirectName*：字符串型，表示节点坐标的随机方向，共包含x、y、z、xy、yz、zx、xyz等7种表述，字符串中最多三个字母。

*fCoeff*：浮点型，随机幅度，即节点离开原始位置的最大距离（单位：m）。

*iGroup*：整型，单元的组号。

#### 备注

如为离散型网格的节点随机，随机可能会出现网格彼此重叠的现象。

#### 范例

```javascript
///对组号为3的单元节点在xy两个方向进行随机，随机的最大尺度为0.01m
blkdyn.RandomizeGridByGroup("xy", 0.01, 3);
```

<!--HJS_blkdyn_RandomizeGroupByElem-->

### RandomizeGroupByElem方法

#### 说明

对某一特定组号的单元进行随机分组。

#### 格式定义

blkdyn.RandomizeGroupByElem (<*iTotal*, *fArrayValue*[], *iMainGroup*>);

#### 参数

*iTotal*：整型，随机分组的组数。

*fArrayValue*[]：Array浮点型，每组的随机比例由此数组决定。

*iMainGroup*：整型，需要进行随机的组号。

#### 备注

随机时，根据*fArrayValue*指定的比例，将*iMainGroup*对应的单元随机分成*iTotal*组。*fArrayValue*的数组个数应与*iTotal*一致，且*fArrayValue*数组中各元素的和应该为1.0（即所有随机比例的之和为100%）。

#### 范例

```javascript
///设置随机分组的组数为3
var total = 3;
///设置3组的占比分别为0.3、0.5、0.2
var value = new Array(0.3,0.5,0.2);
///对组号为1的单元进行随机分组操作
blkdyn.RandomizeGroupByElem(total, value, 1);
```

<!--HJS_blkdyn_RandomizeGroupByBall-->

### RandomizeGroupByBall方法

#### 说明

基于随机产生的圆或球，将特定组号的单元分成若干组，每个圆或球所包含的单元为一个新的组。

#### 格式定义

blkdyn.RandomizeGroupByBall(<*fRadMin*, *fRadMax*, *fEmbed*, *iTotalNo*, *iMainGroup*>);

#### 参数

*fRadMin*：浮点型，球的最小半径。

*fRadMax*：浮点型，球的最大半径。

*fEmbed*：浮点型，允许嵌入的量，正值表示允许嵌入的量，负值表示不允许嵌入的量（两球之间的Gap 量）。

*iTotalNo*：整型，产生的球总数（如果产生球时迭代10000 步还没有产生新的球，自动退出，由此球的总数小于*iTotalNo*）。

*iMainGroup*：整型，需要开展随机的单元组号。

#### 备注

当组号为*iMainGroup*的某单元的任意节点坐标位于随机生成的某圆或球的内部（含边界）时，即将该单元设定为对应的组号。每一个球体所包含的单元为一个新的组号。

#### 范例

```javascript
///产生100个半径为0.2m到0.5m随机分布且彼此间距均大于0.01m的球体，并将组1对应的单元按照100个球体的空间位置进行随机分组。
blkdyn.RandomizeGroupByBall(0.2, 0.5, -0.01, 100, 1);
```

<!--HJS_blkdyn_RandomizeGroupByNode-->

### RandomizeGroupByNode方法

#### 说明

以某一节点为中心，将包含该节点的所有单元设定为一个组。

#### 格式定义

blkdyn.RandomizeGroupByNode(<*iMainGroup*>);

#### 参数

*iMainGroup*：整型，对指定组的单元进行组号随机。

#### 备注

只有当与某节点相关的所有单元均未被分组时才对该节点所关联的单元进行分组。

#### 范例

```javascript
blkdyn.RandomizeGroupByNode(1);
```

<!--HJS_blkdyn_interface_set-->

## 接触面设置

接触面设置中提供了根据单元自由面设置接触、单元公共面切割设置接触及设置接触后网格信息更新等多个功能函数，函数列表见表3.2。

<center>表3.2接触面设置的相关函数</center>

<table>
  	<tr>
		<th>序号</th><th>函数名</th><th>说明</th>
	</tr>
         <td>1</td><td>CrtBoundIFaceByCoord</td><td rowspan=4>将设定范围内的单元的自由面设置为接触面。基于单元的自由面创建接触面，不会新增节点；仅对该面设置接触弹簧，进行后续的接触计算。</td>
	</tr>
        <td>2</td><td>CrtBoundIFaceByGroup</td>
	</tr>
        <td>3</td><td>CrtBoundIFaceByPlaneAndGroup</td>
	</tr>
        <td>4</td><td>CrtBoundIFaceBySel</td>
	</tr>
        <td>5</td><td>CrtIFace</td><td rowspan=9>将设定范围的单元面切割为接触面，执行这些函数后，将会新增节点，各单元间的拓扑将发生变化，软件内部将通过合并节点的方式自动调整各单元间的拓扑关系。单元面执行接触面切割后，将会在该面上设置弹簧，以便后续接触计算。</td>
	</tr>
        <td>6</td><td>CrtIFaceByCoord</td>
	</tr>
        <td>7</td><td>CrtIFaceByGroup</td>
	</tr>
        <td>8</td><td>CrtIFaceByGroupRange</td>
	</tr>
    	<td>9</td><td>CrtIFaceByDirection</td>
	</tr>
    	<td>10</td><td>CrtIFaceByCylinder</td>
	</tr>
    	<td>11</td><td>CrtIFaceByPlaneAndGroup</td>
	</tr>
    	<td>12</td><td>CrtIFaceByLine</td>
	</tr>
    	<td>13</td><td>CrtIFaceBySel</td>
	</tr>
        <td>14</td><td>SetRigidElemByGroup</td><td rowspan=4>将刚性墙的设置及取消，设置刚性墙后，对应的单元不执行力学计算，仅提供固定边界。</td>
	</tr>
        <td>15</td><td>SetRigidElemByCoord</td>
	</tr>
        <td>16</td><td>UnsetRigidElemByGroup</td>
	</tr>
        <td>17</td><td>UnsetRigidElemByCoord</td>
	</tr>
        <td>18</td><td>UpdateIFaceMesh</td><td>设置接触面后，更新相应的网格拓扑信息，并进行接触对的首次寻找及插值系数的首次计算。当所有接触面全部设置完毕后，方可使用该函数，且必须使用该函数进行相关信息的更新及初始化。</td>
	</tr>
        <td>19</td><td>SetPreIFaceByGroup</td><td rowspan=7>设定预定义接触面，这些接触面在计算时将自动显示出来，便于观察。此外，当某接触面设定为预定义面，则SetSimpleHyFracPram函数施加的压力将起作用。</td>
	</tr>
        <td>20</td><td>SetPreIFaceByLine</td>
	</tr>
        <td>21</td><td>SetPreIFaceByFriction</td>
	</tr>
        <td>22</td><td>SetPreIFaceByCoord</td>
	</tr>
    	<td>23</td><td>SetPreIFaceByPlane</td>
	</tr>
    	<td>24</td><td>SetPreIFaceByDirection</td>
	</tr>
    	<td>25</td><td>SetPreIFaceByCylinder</td>
	</tr>
    </table>
<!--HJS_blkdyn_CrtBoundIFaceByCoord-->

### CrtBoundIFaceByCoord方法

#### 说明

将某坐标范围内的单元的自由表面（无邻居单元的面）设定为接触面。

#### 格式定义

blkdyn. CrtBoundIFaceByCoord (<*x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

若某单元的自由表面的面心位于*x0*, *x1*, *y0*, *y1*, *z0*, *z1*控制的长方体内部（含边界），则将该面设置为接触面。

#### 范例

```javascript
///将设定坐标范围内的自由表面设置为接触面。
blkdyn. CrtBoundIFaceByCoord(-1,1,-5,5,-1e5,1e5);
```

<!--HJS_blkdyn_CrtBoundIFaceByGroup-->

### CrtBoundIFaceByGroup方法

#### 说明

将某一组号的单元的自由表面（无邻居单元的面）设定为接触面。

#### 格式定义

blkdyn. CrtBoundIFaceByGroup (<*iMainGroup*>);

#### 参数

*iMainGroup*：整型，进行接触面设置的单元组号。

#### 备注

基于单元的自由面创建接触面，不会新增节点；仅对该面设置接触弹簧，进行后续的接触计算。

#### 范例

```javascript
///将组号为5的单元的自由表面设置为接触面。
blkdyn. CrtBoundIFaceByGroup(5);
```

<!--HJS_blkdyn_CrtBoundIFaceBySel-->

### CrtBoundIFaceBySel方法

#### 说明

将Genvi选择集中的当前通道单元面集合中的单元自由表面（无邻居单元的面）设定为接触面。

#### 格式定义

blkdyn. CrtBoundIFaceBySel (*oSel*);

#### 参数

#### 备注

#### 范例

```javascript
///选中三维单元的面，二维单元的棱
oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-1e5,0.099,-1e5,1e5,0.101,1e5);
///将选择集中的单元自由面设置为接触面
blkdyn.CrtBoundIFaceBySel(oSel);
```

<!--HJS_blkdyn_CrtIFace-->

### CrtIFace方法

#### 说明

将指定范围的面切割为接触面。

#### 格式定义

共包含三种类型的函数格式。

blkdyn.CrtIFace ();

所有单元面均切割为接触面。

blkdyn.CrtIFace (*iGroup*);

单元组号为iGroup的单元面切割为接触面。

blkdyn.CrtIFace (*iGroup*, jGroup);

某公共面两侧的单元组号一侧为*iGroup*，另一侧为*jGroup*时，将该公共面切割为接触面。如果两个组号均为0，表示公共面两侧组号一致时均执行切割；如果两个组号均为-1，表示公共面两侧组号不一致时全部切；如果一侧组号大于0（有效组号），另一侧为0，表示切割该组号所对应单元的自由界面；如果一侧组号大于0（有效组号），另一侧为-1，表示切割该组号所对应单元的非自由面。

#### 参数

*iGroup*：整型，公共面一侧的单元组号。

*jGroup*：整型，公共面另一侧的单元组号。

#### 备注

无。

#### 范例

```javascript
blkdyn. CrtIFace ();
blkdyn. CrtIFace (1);
blkdyn. CrtIFace (1,2);
```

<!--HJS_blkdyn_CrtBoundIFaceByPlaneAndGroup-->

### CrtBoundIFaceByPlaneAndGroup方法

#### 说明

将设定平面及设定组号控制的单元的自由面设定为接触面。

#### 格式定义

blkdyn.CrtBoundIFaceByPlaneAndGroup(<iGroup, fArrayOrigin[3], fArrayNormal[3], fTolerance>);

#### 参数

*iGroup*：整型，需要进行接触面设置的组号。

*fArrayOrigin*：Array浮点型，包含3个分量，面的原点坐标（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，面的单位法向。

*fTolerance*：浮点型，判断是否位于面上的容差，即面心点到该平面的距离（单位：m）。

#### 备注

若某单元的组号为*iGroup*，且该单元的自由面的面心到由*fArrayOrigin*及*fArrayNormal*确定的平面的距离小于等于*fTolerance*，则将该单元的该自由面设定为接触面。

#### 范例

```javascript
///设置面的原点
var origin = new Array(0.0, 0.0, 0.0);
///设置面的法向
var normal = new Array(1.0, 0.0, 0.0);
///将单元组号为2，且到设定面的距离小于1e-3m的单元自由面设定为接触面。
blkdyn. CrtBoundIFaceByPlaneAndGroup (2, origin, normal, 1e-3);
```

<!--HJS_blkdyn_CrtIFaceByCoord-->

### CrtIFaceByCoord方法

#### 说明

若某单元某面的面心位于设定的坐标范围内，则将该面切割为接触面。

#### 格式定义

blkdyn.CrtIFaceByCoord(<*x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
blkdyn. CrtIFaceByCoord (-3.0, 3.0, -5.0, 5.0, -1.0, 1.0);
```

<!--HJS_blkdyn_CrtIFaceByGroup-->

### CrtIFaceByGroup方法

#### 说明

若某公共面两侧单元的组号分别为*iGroup1*及*iGroup2*，将该公共面设定为接触面。

#### 格式定义

blkdyn. CrtIFaceByGroup (<*iGroup1*, *iGroup2*>);

#### 参数

*iGroup1*：整型，公共面一侧的单元组号。

*iGroup2*：整型，公共面另一侧的单元组号。

#### 备注

如果某公共面两侧的单元满足设定的组号，则进行接触面切割。如果两个组号均为0，表示公共面两侧组号一致时均执行切割；如果两个组号均为-1，表示公共面两侧组号不一致时全部切；如果一侧组号大于0（有效组号），另一侧为0，表示切割该组号所对应单元的自由界面；如果一侧组号大于0（有效组号），另一侧为-1，表示切割该组号所对应单元的非自由面。

#### 范例

```javascript
///将一侧为组号1，另一侧为组号2的公共面切割为接触面。
blkdyn. CrtIFaceByGroup (1,2);
///如果公共面两侧的组号不一致，则将该公共面切割为接触面。
blkdyn. CrtIFaceByGroup (-1,-1);
```

<!--HJS_blkdyn_CrtIFaceByGroupRange-->

### CrtIFaceByGroupRange方法

#### 说明

将组号下限及上限范围内的单元的面全部切割为接触面。

#### 格式定义

blkdyn. CrtIFaceByGroupRange (<*iGroupLow*, *iGroupUp*>);

#### 参数

*iGroupLow*：整型，组号下限。

*iGroupUp*：整型，组号上限。

#### 备注

无。

#### 范例

```javascript
///若单元的组号为1、2、3、4，则将该单元的所有面切割为接触面。
blkdyn. CrtIFaceByGroupRange(1,4);
```

<!--HJS_blkdyn_CrtIFaceByDirection-->

### CrtIFaceByDirection方法

#### 说明

将单元面的法向与设定法向一致的单元面切割为接触面。

#### 格式定义

blkdyn. CrtIFaceByDirection(<*fArrayNormal*[3] >);

#### 参数

*fArrayNormal*：Array浮点型，包含3个分量，面的单位法向。

#### 备注

若某单元的面法向与设定法向点积的绝对值大于0.999，则将该面进行切割，设定为接触面；*fArrayNormal*的分量不需要归一化，软件内部自动执行归一化处理。

#### 范例

```javascript
///设置面的法向
var normal = new Array(1.0, 0, 0);
//切割生成接触面
blkdyn. CrtIFaceByDirection(normal);
```

<!--HJS_blkdyn_CrtIFaceByCylinder-->

### CrtIFaceByCylinder方法

#### 说明

若单元某面的面心位于空心圆柱的范围内，则将该面切割为接触面。

#### 格式定义

blkdyn. CrtIFaceByCylinder (<*x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*>);

#### 参数

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
///将内半径为3m，外半径为5m，高为2m的圆柱控制范围内的面切割为接触面。
blkdyn. CrtIFaceByCylinder (0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 3.0, 5.0);
```

<!--HJS_blkdyn_CrtIFaceByPlaneAndGroup-->

### CrtIFaceByPlaneAndGroup方法

#### 说明

若某单元属于设定组号，且该单元的某个面的面心坐标到设定平面的距离小于设定值，则将该面切割为接触面。

#### 格式定义

blkdyn.CrtIFaceByPlaneAndGroup(<*iGroup*, *fArrayOrigin*[3], *fArrayNormal*[3], *fTolerance*>);

#### 参数

*iGroup*：整型，需要进行接触面设置的组号。

*fArrayOrigin*：Array浮点型，包含3个分量，面的原点坐标（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，面的单位法向。

*fTolerance*：浮点型，判断是否位于面上的容差，即面心点到该平面的距离（单位：m）。

#### 备注

若某单元的组号为*iGroup*，且该单元的某面的面心到由*fArrayOrigin*及*fArrayNormal*确定的平面的距离小于等于*fTolerance*，则将该单元的该面切割为接触面。

#### 范例

```javascript
///设置面的原点
var origin = new Array(0.0, 0.0, 0.0);
///设置面的法向
var normal = new Array(1.0, 0.0, 0.0);
///将单元组号为2，且到设定面的距离小于1e-3m的单元面设定为接触面。
blkdyn. CrtIFaceByPlaneAndGroup (2, origin, normal, 1e-3);
```

<!--HJS_blkdyn_CrtIFaceByLine-->

### CrtIFaceByLine方法

#### 说明

若某单元某面的面心到设定线段的距离小于设定的容差，则将该面切割为接触面。

#### 格式定义

blkdyn. CrtIFaceByLine (*fArrayCoord1*[3], *fArrayCoord2*[3], *fTolerance*);

#### 参数

*fArrayCoord1*：Array浮点型，3个分量，线段的第一个点（单位：m）。

*fArrayCoord2*：Array浮点型，3个分量，线段的第二个点（单位：m）。

*fTolerance*：距离容差（单位：m）。

#### 备注

当单元某面的面心到由*fArrayCoord1*及*fArrayCoord2*确定的线段的距离小于*fTolerance*，则将该面切割为接触面。

该函数仅适用于二维接触面的切割生成；对于三维接触面的切割，当容差调大后，类似于切割出一个圆柱体区域（两端为球体）。

#### 范例

```javascript
///指定线段的第一个点
var coord1 = new Array(0.0, 0.0, 0.0);
///指定线段的第二个点
var coord2 = new Array(1.0, 1.0, 0.0);
///将面心到由coord1及coord2确定的线段的距离小于1e-3m的单元面切割为接触面。
blkdyn. CrtIFaceByLine(coord1, coord2, 1e-3);
```

<!--HJS_blkdyn_CrtIFaceBySel-->

### CrtIFaceBySel方法

#### 说明

将Genvi选择集中的当前通道单元面集合中的单元面切割为接触面。

#### 格式定义

blkdyn. CrtIFaceBySel (<*oSel*>);

#### 参数

#### 备注

#### 范例

```javascript
///选中三维单元的面，二维单元的棱
oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-1e5,0.099,-1e5,1e5,0.101,1e5);
///将选择集中的单元面切割为接触面
blkdyn. CrtIFaceBySel(oSel);
```

<!--HJS_blkdyn_SetRigidElemByGroup-->

### SetRigidElemByGroup方法

#### 说明

将某一特定组号的单元设置为刚性墙体，只提供接触检测的边界，单元自身不参与应力计算。

#### 格式定义

blkdyn.SetRigidElemByGroup(<*iGroup*>);

#### 参数

*iGroup*：整型，需要设置的组号。

#### 备注

刚性墙体只提供接触边界，不计算弹性力；当单元较多且部分单元仅起到提供接触边界的作用时，可将这些单元设置为刚性墙体，从而简化计算。

#### 范例

```javascript
blkdyn.SetRigidElemByGroup(1);
```

<!--HJS_blkdyn_SetRigidElemByCoord-->

### SetRigidElemByCoord方法

#### 说明

将某一特定组号的单元设置为刚性墙体，只提供接触检测的边界，单元自身不参与应力计算。

#### 格式定义

blkdyn.SetRigidElemByCoord(<*x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

刚性墙体只提供接触边界，不计算弹性力；当单元较多且部分单元仅起到提供接触边界的作用时，可将这些单元设置为刚性墙体，从而简化计算。

#### 范例

```javascript
blkdyn.SetRigidElemByCoord(-1.0,1.0,-5.0, 5.0, -1e5,1e5);
```

<!--HJS_blkdyn_UnsetRigidElemByGroup-->

### UnsetRigidElemByGroup方法

#### 说明

解除某组号对应单元的刚性墙设置。

#### 格式定义

blkdyn.UnsetRigidElemByGroup(<*iGroup*>);

#### 参数

*iGroup*：整型，要设置的组号。

#### 备注

无。

#### 范例

```javascript
blkdyn.UnsetRigidElemByGroup(1);
```

<!--HJS_blkdyn_UnsetRigidElemByCoord-->

### UnsetRigidElemByCoord方法

#### 说明

解除某坐标范围内单元的刚性墙设置。

#### 格式定义

blkdyn.UnsetRigidElemByCoord (<*x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
blkdyn.UnsetRigidElemByCoord(-1.0,1.0,-5.0, 5.0, -1e5,1e5);
```

<!--HJS_blkdyn_UpdateIFaceMesh-->

### UpdateIFaceMesh方法

#### 说明

更新网格的拓扑信息，首次寻找接触对，并计算插值系数。

#### 格式定义

blkdyn. UpdateIFaceMesh ();

#### 参数

无。

#### 备注

若计算接触碰撞等非连续问题，必须设置接触面，当所有的接触面设置完毕且刚性墙设置完毕后，必须借助本函数进行网格拓扑的调整及接触信息的初始化。

#### 范例

```javascript
///接触面设置后，更新网格拓扑信息，寻找接触。
blkdyn. UpdateIFaceMesh ();
```

<!--HJS_blkdyn_SetPreIFaceByGroup-->

### SetPreIFaceByGroup方法

#### 说明

根据接触面两侧的组号设定预定义界面。

#### 格式定义

blkdyn.SetPreIFaceByGroup(<*iFlag, iGroup, jGroup*>);

#### 参数

*iFlag*：整型，只能为0或1，0表示取消预定义界面设定，1表示进行预定义界面的设定。

*iGroup*：整型，接触面一侧的组号。

*jGroup*：整型，接触面另一侧的组号。

#### 备注

（1）当某接触面为预定义面时，将在结果云图中以线段方式显示该接触面，不管接触面是否发生破断。

（2）简单水力压裂时（参看blkdyn.SetSimpleHyFracPram(<>)），在预定义界面上将会出现水压力。

（3）如果某接触面两侧的单元满足设定的组号，则进行预定义界面的设置。如果两个组号均为0，表示公共面两侧组号一致时进行设定；如果两个组号均为-1，表示公共面两侧组号不一致时进行设定。

#### 范例

```javascript
///将组号为1及2的交界面对应的接触面设定为预定义界面。
blkdyn. SetPreIFaceByGroup (1, 1, 2);
```

<!--HJS_blkdyn_SetPreIFaceByLine-->

### SetPreIFaceByLine方法

#### 说明

当接触面面心坐标位于线段上时，将接触面设定为预定义界面。

#### 格式定义

blkdyn.SetPreIFaceByLine(<*iFlag, fX0, fY0, fZ0, fX1, fY1, fZ1, fTol*>);

#### 参数

*iFlag*：整型，只能为0或1，0表示取消预定义界面设定，1表示进行预定义界面的设定。

*fX0, fY0, fZ0*：浮点型，线段一个端点的坐标（单位：m）。

*fX1, fY1, fZ1*：浮点型，线段另一个端点的坐标（单位：m）。

*fTol*：浮点型，容差（单位：m）。

#### 备注

（1）当某接触面为预定义面时，将在结果云图中以线段方式显示该接触面，不管接触面是否发生破断。

（2）简单水力压裂时（参看blkdyn.SetSimpleHyFracPram(<>)），在预定义界面上将会出现水压力。

#### 范例

```javascript
///根据线段坐标设定预定义界面。
blkdyn. SetPreIFaceByLine (1, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.001);
```

<!--HJS_blkdyn_SetPreIFaceByFriction-->

### SetPreIFaceByFriction方法

#### 说明

当接触面上设定的摩擦角介于输入的摩擦角下限及上限之间时，将该接触面设定为预定义界面。

#### 格式定义

blkdyn.SetPreIFaceByFriction(<*iFlag, fFricLow, fFricUp*>);

#### 参数

*iFlag*：整型，只能为0或1，0表示取消预定义界面设定，1表示进行预定义界面的设定。

*fFricLow*：浮点型，内摩擦角下限（单位：度）。

*fFricUp*：浮点型，内摩擦角上限（单位：度）。

#### 备注

（1）当某接触面为预定义面时，将在结果云图中以线段方式显示该接触面，不管接触面是否发生破断。

（2）简单水力压裂时（参看blkdyn.SetSimpleHyFracPram(<>)），在预定义界面上将会出现水压力。

#### 范例

```javascript
///将摩擦角在15°到16°之间的接触面设定为预定义接触面。
blkdyn. SetPreIFaceByFriction (1, 15,16);
```

<!--HJS_blkdyn_SetPreIFaceByCoord-->

### SetPreIFaceByCoord方法

#### 说明

当接触面面心坐标位于设定坐标范围内时，将该接触面设定为预定义界面。

#### 格式定义

blkdyn.SetPreIFaceByCoord(<*iFlag, x1, x2, y1, y2, z1, z2*>);

#### 参数

*iFlag*：整型，只能为0或1，0表示取消预定义界面设定，1表示进行预定义界面的设定。

*x1, x2*：浮点型，x坐标的下限及上限（单位：m）。

*y1, y2*：浮点型，y坐标的下限及上限（单位：m）。

*z1, z2*：浮点型，z坐标的下限及上限（单位：m）。

#### 备注

（1）当某接触面为预定义面时，将在结果云图中以线段方式显示该接触面，不管接触面是否发生破断。

（2）简单水力压裂时（参看blkdyn.SetSimpleHyFracPram(<>)），在预定义界面上将会出现水压力。

#### 范例

```javascript
blkdyn. SetPreIFaceByCoord (1,-0.001, 0.001, -1,1,-100,100);
```

<!--HJS_blkdyn_SetPreIFaceByPlane-->

### SetPreIFaceByPlane方法

#### 说明

当接触面面心坐标位于某设定平面范围内时，将该接触面设定为预定义界面。

#### 格式定义

blkdyn.SetPreIFaceByPlane(<*iFlag, fCx, fCy, fCz, fNx, fNy, fNz, fTol*>);

#### 参数

*iFlag*：整型，只能为0或1，0表示取消预定义界面设定，1表示进行预定义界面的设定。

*fCx, fCy, fCz*：浮点型，平面上一点的坐标（单位：m）。

*fNx, fNy, fNz*：浮点型，平面的单位面积法向量。

*fTol*：浮点型，到平面的容差（单位：m）。

#### 备注

（1）当某接触面为预定义面时，将在结果云图中以线段方式显示该接触面，不管接触面是否发生破断。

（2）简单水力压裂时（参看blkdyn.SetSimpleHyFracPram(<>)），在预定义界面上将会出现水压力。

#### 范例

```javascript
//平面内一点坐标为(0,0,0)，平面法向为(1,0,0)，容差1mm
blkdyn. SetPreIFaceByPlane(1,0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1e-3);
```

<!--HJS_blkdyn_SetPreIFaceByDirection-->

### SetPreIFaceByDirection方法

#### 说明

当接触面的法向与设定法向的点击大于某一值时，将该接触面设定为预定义界面。

#### 格式定义

blkdyn.SetPreIFaceByDirection (<*iFlag, fNx, fNy, fNz, fTol*>);

#### 参数

*iFlag*：整型，只能为0或1，0表示取消预定义界面设定，1表示进行预定义界面的设定。

*fNx, fNy, fNz*：浮点型，平面的单位面积法向量。

*fTol*：浮点型，临界值，0-1之间，当为1时，表示半弹簧法向与设定法向完全一致时施加。

#### 备注

（1）当某接触面为预定义面时，将在结果云图中以线段方式显示该接触面，不管接触面是否发生破断。

（2）简单水力压裂时（参看blkdyn.SetSimpleHyFracPram(<>)），在预定义界面上将会出现水压力。

#### 范例

```javascript
blkdyn. SetPreIFaceByDirection(1, 1.0, 0.0, 0.0, 0.999);
```

<!--HJS_blkdyn_SetPreIFaceByCylinder-->

### SetPreIFaceByCylinder方法

#### 说明

当接触面面心坐标位于内外圆柱之间时，将该接触面设定为预定义界面。

#### 格式定义

blkdyn.SetPreIFaceByCylinder (<*x0, y0, z0, x1, y1, z1, fRad1, fRad2>)*;

#### 参数

*iFlag*：整型，只能为0或1，0表示取消预定义界面设定，1表示进行预定义界面的设定。

*x0, y0, z0*：浮点型，圆柱某一端点坐标（单位：m）。

*x1, y1, z1*：浮点型，圆柱另一端点坐标（单位：m）。

*fRad1, fRad2*：浮点型，圆柱的内、外半径（单位：m）。

#### 备注

（1）当某接触面为预定义面时，将在结果云图中以线段方式显示该接触面，不管接触面是否发生破断。

（2）简单水力压裂时（参看blkdyn.SetSimpleHyFracPram(<>)），在预定义界面上将会出现水压力。

#### 范例

```javascript
blkdyn. SetPreIFaceByCylinder(1, 0,0,0, 10,0,0, 0.1, 0.5);
```

<!--HJS_blkdyn_Model_Set-->

## 单元模型设置

单元模型设置中提供了单元本构模型设定、单元材料参数设定、单元材料参数关联、单元材料随机等多个功能函数，函数列表见表3.3。

<center>表3.3单元模型设置的相关函数</center>

<table>
  	<tr>
		<th>序号</th><th>函数名</th><th>说明</th>
	</tr>
         <td>1</td><td>SetModel</td><td rowspan=6>指定单元的本构模型，具体的本构模型描述见表3.4</td>
	</tr>
        <td>2</td><td>SetModelByCoord</td>
	</tr>
        <td>3</td><td>SetModelByCylinder</td>
	</tr>
        <td>4</td><td>SetModelByPlaneAndGroup</td>
	</tr>
        <td>5</td><td>SetModelByTable</td>
	</tr>
        <td>6</td><td>SetModelByGroupAndCoord</td>
	</tr>
        <td>7</td><td>SetMat</td><td rowspan=8>指定固体单元的基础材料参数，包含density，young，poisson，cohesion，tension，friction，dilation等7个，均为国际单位值。</td>
	</tr>
        <td>8</td><td>SetMatByGroup</td>
	</tr>
        <td>9</td></td><td>SetMatByGroupRange</td>
	</tr>
        <td>10</td><td>SetMatByCoord</td>
	</tr>
        <td>11</td><td>SetMatByCylinder</td>
	</tr>
        <td>12</td><td>SetMatByCoordAndGroup</td>
	</tr>
    	<td>13</td><td>SetMatByPorePAndGroup</td>
	</tr>
        <td>14</td><td>SetMatByStratum</td>
	</tr>
        <td>15</td><td>RandomizeMatByGroup</td><td rowspan=2>单元性质随机。</td>
	</tr>
        <td>16</td><td>RandomizeMatByCoord</td>
	</tr>
        <td>17</td><td>AdvRandomizeMatByGroup</td><td rowspan=2>单元性质超级随机。</td>
	</tr>
        <td>18</td><td>AdvRandomizeMatByCoord</td>
	</tr>
        <td>19</td><td>SetKGMat</td><td>单独设置体积模量及剪切模量。</td>
	</tr>
        <td>20</td><td>SetCreepMat</td><td>全局蠕变模型材料参数设置。</td>
	</tr>
        <td>21</td><td>BindCreepMat</td><td>关联蠕变模型材料号。</td>
	</tr>
        <td>22</td><td>SetJCMat</td><td>全局JohnsonCook材料参数设置。</td>
	</tr>
        <td>23</td><td>BindJCMat</td><td>关联JohnsonCook全局材料号。</td>
	</tr>
        <td>24</td><td>SetMGMat</td><td>全局MieGrueisen材料参数设置。</td>
	</tr>
        <td>25</td><td>BindMGMat</td><td>关联MieGrueisen全局材料号。</td>
	</tr>
        <td>26</td><td>SetUbiJointMat</td><td>全局遍布节理模型参数设置。</td>
	</tr>
        <td>27</td><td>BindUbiJointMat</td><td>关联遍布节理模型号。</td>
	</tr>
        <td>28</td><td>SetTransIsoMat</td><td>全局横贯各向同性材料参数设置。</td>
	</tr>
        <td>29</td><td>BindTransIsoMat</td><td>关联横贯各向同性材料号。</td>
	</tr>
        <td>30</td><td>SetLandauSource</td><td>全局朗道爆炸模型参数设置。</td>
	</tr>
        <td>31</td><td>SetLandauGasLeakMat</td><td>设置朗道爆源模型气体逸散参数。</td>
	</tr>
        <td>32</td><td>BindLandauSource</td><td>关联全局朗道爆炸模型号。</td>
	</tr>
        <td>33</td><td>SetJWLSource</td><td>全局JWL爆炸模型参数设置。</td>
	</tr>
        <td>34</td><td>SetLandauGasLeakMat</td><td>设置JWL爆源模型气体逸散参数。</td>
	</tr>
        <td>35</td><td>BindJWLSource</td><td>关联全局JWL爆炸模型号。</td>
	</tr>
        <td>36</td><td>SetAirStateMat</td><td>全局的空气参数设置。</td>
	</tr>
        <td>37</td><td>BindAirMat</td><td>将全局空气参数与单元进行关联。</td>
	</tr>
        <td>38</td><td>SetHJCMat</td><td>全局HJC材料参数设置。</td>
	</tr>
        <td>39</td><td>BindHJCMat</td><td>将全局HJC参数与单元进行关联。</td>
	</tr>
        <td>40</td><td>SetJH2Mat</td><td>全局JH2材料参数设置。</td>
	</tr>
        <td>41</td><td>BindJH2Mat</td><td>将全局JH2参数与单元进行关联。</td>
	</tr>
        <td>42</td><td>SetTCKUSMat</td><td>全局TCKUS参数设置。</td>
	</tr>
        <td>43</td><td>BindTCKUSMat</td><td>将全局TCKUS参数与单元关联。</td>
	</tr>
        <td>44</td><td>SetMRMat</td><td>全局Mooney Rivlin参数设置。</td>
	</tr>
        <td>45</td><td>BindMRMat</td><td>将全局Mooney Rivlin参数与单元关联。</td>
	</tr>
        <td>46</td><td>SetSJRockMat</td><td>随机节理岩体模型（Wu模型）参数设置。</td>
	</tr>
        <td>47</td><td>SetSatRockMat</td><td>全局SatRock参数设置。</td>
	</tr>
        <td>48</td><td>BindSatRockMat</td><td>将全局SatRock参数与单元关联。</td>
	</tr>
        <td>49</td><td>SetElemJointMat</td><td>设置ElemJoint模型的单元参数。</td>
	</tr>
        <td>50</td><td>SetLeeTarverSource</td><td>设置全局LeeTarver爆源模型参数。</td>
	</tr>
        <td>51</td><td>BindLeeTarverSource</td><td>将全局LeeTarver爆源参数与单元关联。</td>
	</tr>
        <td>52</td><td>SetHJCKUSMat</td><td>设置全局HJCKUS模型参数。</td>
	</tr>
        <td>53</td><td>BindBindHJCKUSMat</td><td>将全局HJCKUS参数与单元关联。</td>
	</tr>
        <td>54</td><td>SetDavidenkovMat</td><td>设置全局Davidenkov模型参数。</td>
	</tr>
        <td>55</td><td>BindDavidenkovMat</td><td>将全局Davidenkov参数与单元关联。</td>
	</tr>
        <td>56</td><td>SetByrneDavMat</td><td>设置全局ByrneDav模型参数。</td>
	</tr>
        <td>57</td><td>BindByrneDavMat</td><td>将全局ByrneDav参数与单元关联。</td>
	</tr>
    </table>




注：固体的材料参数中，密度、弹性模量、泊松比、体积模量、剪切模量、粘聚力、内摩擦角、剪胀角、抗拉强度、刚度阻尼系数、质量阻尼系数等设定于每个单元上，局部阻尼设定于每个节点上，其他材料参数均为全局参数，需要进行参数的关联操作。

在块体模块中，固体单元中可设置线弹性、理想弹塑性、应变软化、蠕变、遍布节理、炸药等多种本构模型，各模型的描述具体见表3.4。

<center>表3.4固体单元对应的本构模型</center>

<table>
  	<tr>
		<th>模型名称</th><th>对应字符串</th><th>对应编号</th><th>关联命令及释义</th>
	</tr>
         <td>空模型（开挖模型）</td><td>"none"</td><td>0</td><td>当某单元为空模型时，该单元将不执行应力计算，并在界面展示时不显示该单元。</td>
	</tr>
         <td>线弹性模型</td><td>"linear"</td><td>1</td><td>通过blkdyn.SetMat…系列函数设置材料参数。</td>
	</tr>
         <td>Drucker-Prager模型</td><td>"DP"</td><td>2</td><td>通过blkdyn.SetMat…系列函数设置材料参数。<br>通过dyna.Set函数设置"DP_Model_Option"，可以设置DP模型的三种形式（内部适应、等面积、外部适应）。</td>
	</tr>
         <td>Mohr-Coulomb模型</td><td>"MC"</td><td>3</td><td>通过blkdyn. SetMat…系列函数设置材料参数。</td>
	</tr>
         <td>考虑应变软化效应的Mohr-Coulomb模型</td><td>SoftenMC"</td><td>4</td><td>通过blkdyn. SetMat…系列函数设置材料参数。<br>通过dyna.Set函数设置"Block_Soften_Value"，可以设置体积膨胀极限应变及等效剪切极限应变；达到体积膨胀应变极限，抗拉强度为0；达到等效剪切极限应变，粘聚力为0。<br>通过dyna.Set函数设置"If_Elem_Soften_K_G"，当单元处于软化阶段时，同时软化单元的体积模量及剪切模量</td>
	</tr>
         <td>Burgers粘弹塑性模型</td><td>"burger"</td><td>5</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数。通过blkdyn.SetCreepMat、blkdyn. BindCreepMat设置蠕变参数。
<br>通过dyna.Set函数设置"Creep_Cal"、"Creep_G_Inherit"、"Elem_Plastic_Cal_Creep"、"Auto_Creep_Time"等，对计算过程进行控制。</td>
	</tr>
         <td>流体弹塑性模型</td><td>"FEP"</td><td>6</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn.SetJCMat、blkdyn.BindJCMat、blkdyn.SetMGMat、blkdyn.BindMGMat设置全局的JohnsonCook及MieGrueisen参数，并与单元进行关联。</td>
	</tr>
         <td>遍布节理模型</td><td>"Joint"</td><td>7</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数。<br>通过blkdyn.SetUbiJointMat设置全局的遍布节理参数、通过函数blkdyn.BindUbiJointMat将全局参数与单元关联。</td>
	</tr>
         <td>横观各向同性模型</td><td>"TransIso"</td><td>8</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数。<br>通过blkdyn. SetTransIsoMat设置全局的横观各向同性参数、通过函数blkdyn.BindTransIsoMat将全局参数与单元关联。</td>
	</tr>
         <td>朗道爆源模型</td><td>"Landau"</td><td>9</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn. SetLandauSource设置全局的朗道爆源模型参数、通过函数blkdyn. BindLandauSource将全局参数与单元关联。</td>
	</tr>
         <td>JWL爆源模型</td><td>"JWL"</td><td>10</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn. SetJWLSource设置全局的JWL爆源模型参数、通过函数blkdyn. BindJWLSource将全局参数与单元关联。</td>
	</tr>
         <td>考虑应变率效应的Mohr-Coulomb应变软化模型</td><td>"SRSoftenMC"</td><td>11</td><td>通过blkdyn. SetMat…系列函数设置材料参数。<br>通过dyna.Set函数设置"Block_Soften_Value"，可以设置体积膨胀极限应变及等效剪切极限应变；达到体积膨胀应变极限，抗拉强度为0；达到等效剪切极限应变，粘聚力为0。<br>通过dyna.Set函数设置"If_Elem_Soften_K_G"，当单元处于软化阶段时，同时软化单元的体积模量及剪切模量。<br>通过dyna.Set函数设置"Strain_Ratio_Pram"，确定拉伸强度应变率增强系数，及粘聚力应变率增强系数。</td>
	</tr>
         <td>空气绝热膨胀模型</td><td>"Air"</td><td>12</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn. SetAirMat设置全局的空气模型参数、通过函数blkdyn. BindAirMat将全局参数与单元关联。</td>
	</tr>
         <td>横观各向同性节理</td><td>"TransJoint"</td><td>13</td><td>横观各向同性弹性模型与遍布节理模型的耦合。<br>通过blkdyn.SetMat…系列函数设置基础材料参数。通过blkdyn. SetTransIsoMat设置全局的横观各向同性参数、通过函数blkdyn. BindTransIsoMat将全局参数与单元关联。<br>通过blkdyn.SetUbiJointMat设置全局的遍布节理参数、通过函数blkdyn.BindUbiJointMat将全局参数与单元关联。节理面法向与各向同性面法向应保持一致。</td>
	</tr>
         <td>HJC模型</td><td>"HJC"</td><td>14</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn. SetHJCMat设置全局的HJC模型参数、通过函数blkdyn. BindHJCMat将全局参数与单元关联。</td>
	</tr>
         <td>JH2模型</td><td>"JH2"</td><td>15</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn. SetJH2Mat设置全局的JH2模型参数、通过函数blkdyn. BindJH2Mat将全局参数与单元关联。</td>
	</tr>
         <td>TCK模型</td><td>"TCK"</td><td>16</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数。<br>通过blkdyn. SetTCKUSMat设置全局的TCKUS模型参数、通过函数blkdyn. BindTCKUSMat将全局参数与单元关联。</td>
	</tr>
         <td>KUS模型</td><td>"KUS"</td><td>17</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数。<br>通过blkdyn. SetTCKUSMat设置全局的TCKUS模型参数、通过函数blkdyn. BindTCKUSMat将全局参数与单元关联。</td>
	</tr>
         <td>Young模型</td><td>"Young"</td><td>18</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数。等效拉伸应变由抗拉强度及弹性模量计算获得。<br>通过dyna.Set函数设置"Block_Soften_Value"，设置Young模型中损伤因子计算时的系数及指数，第一个为系数（一般为105~106量级），第二个为指数（一般为1-3）。</td>
	</tr>
         <td>橡胶模型</td><td>"MR"</td><td>19</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数，主要为密度，弹性模量及泊松比。<br>通过blkdyn. SetMRMat设置全局的MR模型参数、通过函数blkdyn. BindMRMat将全局参数与单元关联。</td>
	</tr>
 <td>SJRock-Wu随机结构面岩体模型</td><td>"SJRock"</td><td>20</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数。<br>通过blkdyn.SetSJRockMat设置随机结构面参数。</td>
	</tr>
         <td>饱和岩体动力模型</td><td>"SatRock"</td><td>21</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数，主要为密度，弹性模量及泊松比。<br>通过blkdyn.SetSatRockMat设置全局的SatRock模型参数、通过函数blkdyn. BindSatRockMat将全局参数与单元关联。</td>
</tr>
  <td>ElemJoint模型</td><td>"ElemJoint"</td><td>22</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>全局接口dyna.Set("If_ElemJoint_Model 1");如果打开，则后续通过blkdyn.SetElemJointMat接口设置的节理穿过的单元都施加ElemJoint本构，其他单元依然通过blkdyn.SetModel施加。</td>
	</tr>
 <td>点火增长模型</td><td>"LeeTarver"</td><td>23</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn. SetJWLSource设置全局的JWL爆源模型参数、通过函数blkdyn.BindJWLSource将全局参数与单元关联。<br>通过blkdyn. SetLeeTarverSource设置全局的LeeTarver点火增长模型参数、通过函数blkdyn.BindLeeTarverSource将全局参数与单元关联。</td>
	</tr>
 <td>HJC-KUS联合模型</td><td>"HJCKUS"</td><td>24</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度）。<br>通过blkdyn.SetHJCKUSMat设置全局的HJC模型参数、通过函数blkdyn. BindHJCKUSMat将全局参数与单元关联。</td>
	</tr>
 <td>Davidenkov土动力学模型</td><td>"Davidenkov"</td><td>25</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度、弹性模量）。<br>通过blkdyn.SetDavidenkovMat设置全局的模型参数、通过函数blkdyn.BindDavidenkovMat将全局参数与单元关联。</td>
	</tr>
 <td>Byrne-Davidenkov土体动力液化模型</td><td>"ByrneDav"</td><td>26</td><td>通过blkdyn.SetMat…系列函数设置基础材料参数（主要为密度、弹性模量）。<br>通过blkdyn.SetByrneDavMat设置全局的模型参数、通过函数blkdyn.BindByrneDavMat将全局参数与单元关联。</td>
	</tr>
         <td>自定义模型</td><td>"Custom"</td><td>1024</td><td>通过dyna.LoadUDF调入动态链接库。
<br>通过dyna. SetUDFValue函数设置用户自定义的全局参数，供自定义本构模型使用。</td>
	</tr>


注：

（1）    当单元的本构为"linear"、"DP"、"MC"、"SoftenMC"、"burger"、"Joint"、"SRSoftenMC"时，通过dyna.Set设置" If_Bulk_Nolinear"，可以设置单元在体积压缩时是否执行非线性计算；通过dyna.Set设置"K_G_Degrad_With_Strain"，可以设置是否根据体积总应变及等效剪切总应变，自动折减体积模量及剪切模量。

（2）    当单元模型为"burger"时，单元内置参量（Para）的6个参量分别表示开尔文偏应变，可通过dyna.Plot("Elem","Para")进行查看。

（3）    当单元模型为"FEP"时，单元内置参量（Para）的前5个参数变量分别表示压力、温度、能量、等效塑性应变、等效塑性应变率，可通过dyna.Plot("Elem","Para")进行查看。

（4）    当单元模型为" HJC"时，单元内置参量（Para）的6个分量分别表示压力、损伤因子、卸载前的最大压缩应变、卸载前的最大压力、累计塑性压缩应变、累计塑性剪应变，可通过dyna.Plot("Elem","Para")进行查看。

（5）    当单元模型为" JH2"时，单元内置参量（Para）的前4个参数变量分别表示压力、损伤因子、等效塑性应变及压力增量，可通过dyna.Plot("Elem","Para")进行查看。

（6）    当单元模型为"TCK"、"KUS"及"Young"时，损伤计算采用全量法；若未达到损伤条件，则采用增量法计塑性流动，选择用DP模型，且DP模型中的强度随损伤增加线性减小为0。此外，采用上述模型时，当单元出现损伤，设置残余模量为初始模量的1/100。

（7）    当单元模型为"TCK"、"KUS"时，单元内置参量（Para）的前3个参数变量分别表示裂纹密度、损伤因子及有效泊松比，可通过dyna.Plot("Elem","Para")进行查看。

（8）    当单元模型为"Young"时，单元内置参量（Para）的前2个参数变量分别表示裂纹密度、损伤因子，可通过dyna.Plot("Elem","Para")进行查看。

（9）    当单元模型为"MR"模型时，采用全量法进行计算。单元内置参量（Para）的6个参数变量分别表示：应变第一不变量、应变第二不变量、体积变化率、应变能密度、体应力、等效偏应变率。

（10）  当单元模型为"SatRock"时，单元内置参量（Para）的前5个参数变量分别表示损伤因子、等效塑性应变、孔隙率、有效应力、水压力，可通过dyna.Plot("Elem","Para")进行查看。

（11）  当单元模型为"Davidenkov"时，单元内置参量（Para）的第1个参数表示当前动剪切模量。

（12）   当单元模型为"ByrneDav"时，单元内置参量（Para）的第1个参数表示超孔压比、第2个参数表示当前动剪切模量。

<!--HJS_blkdyn_SetModel-->

### SetModel方法

#### 说明

设置单元的本构模型。

#### 格式定义

共包含三种函数格式。

（1）blkdyn.SetModel(*strModelName*);

​       设置所有单元为某一种本构模型。

（2）blkdyn.SetModel(*strGroupName*, *iGroup*);

​       设置组号为*iGroup*的单元为某一种本构模型。

（3）blkdyn.SetModel(*strGroupName*, *iGroupLow*, *iGroupUp*);

​       设置组号为*iGroupLow*~ *iGroupUp*的之间的单元为某一种模型。即

*iGrp*>= *iGroupLow*&&*iGrp*<= *iGroupUp*

#### 参数

*strModelName*：字符串型，本构模型的名称，包括："none"、"linear"、"DP"、"MC"、"SoftenMC"、"burger"、"FEP"、"Joint"、"TransIso"、"Landau"、"JWL"、"SRSoftenMC"、"Air"、"TransJoint"、"HJC"、"JH2"、"TCK"、"KUS"、"Young"、"MR"、"SJRock"、"SatRock"、"ElemJoint"、"LeeTarver"、"HJCKUS"、"Davidenkov"、"ByrneDav"、"Custom"等，具体含义见表3.4。

*iGroup*：单元组号

*iGroupLow*：单元组号下限

*iGroupUp*：单元组号上限

####  备注

无。

#### 范例

```javascript
//将所有单元设置为线弹性模型
blkdyn.SetModel("linear");
//将组号为1的单元设置为Drucker-Parger模型
blkdyn.SetModel("DP",1);
//将组号为1-3的单元设置为遍布节理模型
blkdyn.SetModel("Joint ",1,3);
```

<!--HJS_blkdyn_SetModelByCoord-->

### SetModelByCoord方法

#### 说明

根据坐标设置模型类型。通过x、y、z三个坐标的控制，将体心落在控制范围之内的单元设定为指定模型。

#### 格式定义

blkdyn.SetModelByCoord(<*strModelName*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*strModelName*：字符串型，本构模型的名称，包括："none"、"linear"、"DP"、"MC"、"SoftenMC"、"burger"、"FEP"、"Joint"、"TransIso"、"Landau"、"JWL"、"SRSoftenMC"、"Air"、"TransJoint"、"HJC"、"JH2"、"TCK"、"KUS"、"Young"、"MR"、"SJRock"、"SatRock"、"ElemJoint"、"LeeTarver"、"HJCKUS"、"Davidenkov"、"ByrneDav"、"Custom"等，具体含义见表3.4。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
//将坐标范围内的单元设置为线弹性模型
blkdyn.SetModelByCoord("linear", 3, 5, 3, 5, -1, 10);
```



<!--HJS_blkdyn_SetModelByCylinder-->

### SetModelByCylinder方法

#### 说明

如果单元体心落在两个同心圆柱面之内，将该单元设定为指定模型。

####  格式定义

blkdyn.SetModelByCylinder(<*strModelName*, *x0*, *y0*, z0, *x1*, *y1*, *z1*, *fRad1*, *fRad2>);

#### 参数

*strModelName*：字符串型，本构模型的名称，包括："none"、"linear"、"DP"、"MC"、"SoftenMC"、"burger"、"FEP"、"Joint"、"TransIso"、"Landau"、"JWL"、"SRSoftenMC"、"Air"、"TransJoint"、"HJC"、"JH2"、"TCK"、"KUS"、"Young"、"MR"、"SJRock"、"SatRock"、"ElemJoint"、"LeeTarver"、"HJCKUS"、"Davidenkov"、"ByrneDav"、"Custom"等，具体含义见表3.4。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
blkdyn.SetModelByCylinder("linear",0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 10.0);
```

<!--HJS_blkdyn_SetModelByPlaneAndGroup-->

### SetModelByPlaneAndGroup方法

#### 说明

如果单元的组号位于组号的下限与上下之间（包含下限及上限），且单元被设定的平面所穿过，则将该单元设定为指定的本构模型。

#### 格式定义

blkdyn.SetModelByPlaneAndGroup(<*strModelName*, *fArrayOrigin*[3], *fArrayNormal*[3], *iGroupLow*, *iGroupUp*>);

#### 参数

*strModelName*：字符串型，本构模型的名称，包括："none"、"linear"、"DP"、"MC"、"SoftenMC"、"burger"、"FEP"、"Joint"、"TransIso"、"Landau"、"JWL"、"SRSoftenMC"、"Air"、"TransJoint"、"HJC"、"JH2"、"TCK"、"KUS"、"Young"、"MR"、"SJRock"、"SatRock"、"ElemJoint"、"LeeTarver"、"HJCKUS"、"Davidenkov"、"ByrneDav"、"Custom"等，具体含义见表3.4。

*fArrayOrigin*：Array浮点型，包含3个分量，面的原点坐标（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，面的单位法向。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

当单元的节点位于设定平面的两侧时，则判定为该单元被设定的平面穿过。

#### 范例

```javascript
//指定平面上的某一点
var origin = new Array(0.0, 0.0, 0.0);
//指定平面法向
var normal = new Array(1.0, 0.0, 0.0);        
//将组号为1-5且被设定平面穿过的单元的本构模型设定为线弹性模型
blkdyn.SetModelByPlaneAndGroup("linear", origin, normal, 1, 5);
```

<!--HJS_blkdyn_SetModelByTable-->

### SetModelByTable方法

#### 说明

若某单元的体心位于某Table表格中的数据表示的封闭多边形内部，则将该单元设定为指定的本构模型。

#### 格式定义

blkdyn.SetModelByTable(<*strModelName*, *strTableName*>);

#### 参数

*strModelName*：字符串型，本构模型的名称，包括："none"、"linear"、"DP"、"MC"、"SoftenMC"、"burger"、"FEP"、"Joint"、"TransIso"、"Landau"、"JWL"、"SRSoftenMC"、"Air"、"TransJoint"、"HJC"、"JH2"、"TCK"、"KUS"、"Young"、"MR"、"SJRock"、"SatRock"、"ElemJoint"、"LeeTarver"、"HJCKUS"、"Davidenkov"、"ByrneDav"、"Custom"等，具体含义见表3.4。

*strTableName*：字符串型，Table表格的名字。

#### 备注

使用Table进行范围选择时，首先需借助dyna.CreateTable(<>)函数建立table 表格（见2.12.1节中的dyna.CreateTable函数）。Table中的坐标数据应安装顺时针或逆时针书写。

#### 范例

```javascript
blkdyn.SetModelByTable("linear", "feng");
```

<!--HJS_blkdyn_SetModelByGroupAndCoord-->

### SetModelByGroupAndCoord方法

#### 说明

若某单元的组号及单元体心的坐标进行本构模型设置。

#### 格式定义

blkdyn.SetModelByTable(<*strModelName, iGrpL, iGrpU, fx0, fx1, fy0, fy1, fz0, fz1*>);

#### 参数

*strModelName*：字符串型，本构模型的名称，包括："none"、"linear"、"DP"、"MC"、"SoftenMC"、"burger"、"FEP"、"Joint"、"TransIso"、"Landau"、"JWL"、"SRSoftenMC"、"Air"、"TransJoint"、"HJC"、"JH2"、"TCK"、"KUS"、"Young"、"MR"、"SJRock"、"SatRock"、"ElemJoint"、"LeeTarver"、"HJCKUS"、"Davidenkov"、"ByrneDav"、"Custom"等，具体含义见表3.4。

*iGrpL, iGrpU*：整型，组号的下限及上限。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.SetModelByTable("linear", 1, 1, 0, 2, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_blkdyn_SetMat-->

### SetMat方法

#### 说明

指定单元的基础材料参数。

#### 格式定义

blkdyn.SetMatByGroup(<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *iGroup*>);

共包含三种函数格式。

（1）blkdyn. SetMat (<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*>);

设置所有单元为某一种材料参数。

（2）blkdyn. SetMat (<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *iGroup*>);

设置组号为*iGroup*的单元为某一种材料参数。

（3）blkdyn. blkdyn. SetMat (<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *iGroupLow*, *iGroupUp*>);

设置组号为*iGroupLow*~ *iGroupUp*的之间的单元为某一种材料参数。即*iGrp*>= *iGroupLow*&&*iGrp*<= *iGroupUp*

#### 参数

*density*：浮点型，材料密度（单位：kg/m<sup>3</sup>）

*young*：浮点型，弹性模量（单位：Pa）

*poisson*：浮点型，泊松比

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：°）

*dilation*浮点型，剪胀角（单位：°）

*iGroup*，整型，单元的组号

*iGroupLow*，整型，单元组号下限

*iGroupUp*，整型，单元组号上限

#### 备注

执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

#### 范例

```javascript
blkdyn.SetMat(2500, 3.0e10, 0.25, 2e3, 1e3, 20.0, 10.0);
blkdyn.SetMat (2500, 3.0e10, 0.25, 2e3, 1e3, 20.0, 10.0, 5);
blkdyn.SetMat (2500, 3.0e10, 0.25, 2e3, 1e3, 20.0, 10.0,1, 1000);
```

<!--HJS_blkdyn_SetMatByGroup-->

### SetMatByGroup方法

#### 说明

当单元的组号为设定组号时，指定单元的基础材料参数。

#### 格式定义

blkdyn.SetMatByGroup(<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *iGroup*>);

#### 参数

*density*：浮点型，材料密度（单位：kg/m<sup>3</sup>）

*young*：浮点型，弹性模量（单位：Pa）

*poisson*：浮点型，泊松比

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：°）

*dilation*浮点型，剪胀角（单位：°）

*iGroup*，整型，单元的组号

#### 备注

执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

#### 范例

```javascript
blkdyn.SetMatByGroup(2500, 3.0e10, 0.25, 2e3, 1e3, 20.0, 10.0, 1);
```

<!--HJS_blkdyn_SetMatByGroupRange-->

### SetMatByGroupRange方法

#### 说明

当单元的组号介于设定组号下限及上限之间（包含下限及上限）时，指定单元的基础材料参数。

#### 格式定义

blkdyn.SetMatByGroupRange(<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *iGroupLow*, *iGroupUp*>);

#### 参数

*density*：浮点型，材料密度（单位：kg/m<sup>3</sup>）

*young*：浮点型，弹性模量（单位：Pa）

*poisson*：浮点型，泊松比

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：°）

*dilation*浮点型，剪胀角（单位：°）

*iGroupLow*，整型，单元的组号下限

*iGroupUp*，整型，单元的组号上限

#### 备注

执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

#### 范例

```javascript
blkdyn.SetMatByGroupRange(2500, 3.0e10, 0.25, 2e3, 1e3, 20, 10, 1, 5);
```

<!--HJS_blkdyn_SetMatByCoord-->

### SetMatByCoord方法

#### 说明

当单元的体心位于坐标控制范围内时，指定单元的基础材料参数。

#### 格式定义

blkdyn.SetMatByCoord(<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*density*：浮点型，材料密度（单位：kg/m<sup>3</sup>）

*young*：浮点型，弹性模量（单位：Pa）

*poisson*：浮点型，泊松比

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：°）

*dilation*浮点型，剪胀角（单位：°）

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

#### 范例

```javascript
blkdyn.SetMatByCoord(2500, 3.0e10, 0.25, 2e3, 1e3, 20, 10,-1e5, 1e5, -1e5, 1e5, -3.0, 3.0);
```

<!--HJS_blkdyn_SetMatByCylinder-->

### SetMatByCylinder方法

#### 说明

当单元体心位于某内、外圆柱面中间时，设置该单元的基础材料参数。

#### 格式定义

blkdyn.SetMatByCylinder(<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*>);

#### 参数

*density*：浮点型，材料密度（单位：kg/m<sup>3</sup>）

*young*：浮点型，弹性模量（单位：Pa）

*poisson*：浮点型，泊松比

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：°）

*dilation*浮点型，剪胀角（单位：°）

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

#### 范例

```javascript
blkdyn.SetMatByCylinder(2500, 3.0e10, 0.25, 2e3, 1e3, 20, 10,0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 0.3, 1.2);
```

<!--HJS_blkdyn_SetMatByCoordAndGroup-->

### SetMatByCoordAndGroup方法

#### 说明

当单元的组号位于组号的下限及上限之间（包含下限及上限），且单元的体心坐标位于坐标控制范围之内，设置该单元的基础材料参数。

#### 格式定义

blkdyn.SetMatByCoordAndGroup(<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation*, *x0*, *x1*, y*0*, *y1*, *z0*, *z1*, *iGroupLow*, *iGroupUp*>);

#### 参数

*density*：浮点型，材料密度（单位：kg/m<sup>3</sup>）

*young*：浮点型，弹性模量（单位：Pa）

*poisson*：浮点型，泊松比

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：°）

*dilation*浮点型，剪胀角（单位：°）

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*iGroupLow*，整型，单元的组号下限

*iGroupUp*，整型，单元的组号上限

#### 备注

执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

#### 范例

```javascript
blkdyn.SetMatByCoordAndGroup(2500, 3.0e10, 0.25, 2e3, 1e3, 20, 10, -1e5,1e5,-1e5,1e5,-3.0, 3.0, 1, 5);
```

<!--HJS_blkdyn_SetMatByPorePAndGroup-->

### SetMatByPorePAndGroup方法

#### 说明

当单元的组号位于组号的下限及上限之间（包含下限及上限），且单元的孔隙压力位于下限值与上限值之间（包含下限及上限），设置该单元的基础材料参数。

#### 格式定义

blkdyn.SetMatByPorePAndGroup(<*density*, *young*, *poisson*, *cohesion*, *tension*, *friction*, *dilation, PorePLow, PorePUp, iGroupLow*, *iGroupUp*>);

#### 参数

*density*：浮点型，材料密度（单位：kg/m<sup>3</sup>）

*young*：浮点型，弹性模量（单位：Pa）

*poisson*：浮点型，泊松比

*cohesion*：浮点型，粘聚力（单位：Pa）

*tension*：浮点型，抗拉强度（单位：Pa）

*friction*：浮点型，内摩擦角（单位：°）

*dilation*浮点型，剪胀角（单位：°）

*PorePLow*：浮点型，孔隙水压力下限值（单位：Pa）

*PorePUp*：浮点型，孔隙水压力上限值（单位：Pa）

*iGroupLow*，整型，单元的组号下限

*iGroupUp*，整型，单元的组号上限

#### 备注

执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

#### 范例

```javascript
blkdyn.SetMatByPorePAndGroup(2500, 3.0e10, 0.25, 2e3, 1e3, 20, 10, 0.001, 1e6, 1, 5);
```

<!--HJS_blkdyn_SetMatByStratum-->

### SetMatByStratum方法

#### 说明

根据地层信息设置单元的材料参数。

#### 格式定义

blkdyn. SetMatByStratum (<*[strFileName [,iGrpL [, iGrpU [, nDiv]] ]]*>);

包含以下5种调用方式。

blkdyn. SetMatByStratum();

blkdyn. SetMatByStratum(*strFileName*);

blkdyn. SetMatByStratum(*strFileName, iGrpL*);

blkdyn. SetMatByStratum(*strFileName, iGrpL, iGrpU*);

blkdyn. SetMatByStratum(*strFileName, iGrpL, iGrpU, nDiv*);

#### 参数

*strFileName*：字符串型，地层信息的文件路径及文件名称。可以不写，不写则自动跳出文件选择对话框，进行鼠标选择。

*iGrpL*：整型，组号下限，可以不写，不写默认所有单元。

*iGrpU*：整型，组号上限，可以不写，不写默认对组号为*iGrpL*的单元执行操作。

*nDiv*：整型，单元分割数，可以不写，不写默认分割数为10。

#### 备注

（1）  调用成功，范围0；调用失败，返回-1。

（2）  地层信息文件是一个文本文件，内容包含了地层数量（大于等于1的自然数），自上而下每个地层的网格文件名（每个文件为GdemGrid格式文件）以及每个地层的材料参数。

（3）  需要注意的是，地层信息文件（即下图中的arrange.txt）中，地层网格文件名的排列顺序为按照高程自上而下，即靠近地表的地层放在前面。此外，每个地层的材料参数依次为：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角。

（4）  算法实施时，根据模型最大单元边长及单元分割数nDiv，计算每个单元XYZ的格子数，而后判定每个格子与地层的拓扑情况，进而对材料参数进行平均。

（5）  进行单元与地层的关系搜索时，由于需要根据nDiv将单元分成若干格子，nDiv越大，搜索时间越长，默认nDiv值为10，软件中规定nDiv的值为1-100之间。

（6）  执行该函数后，软件内部自动计算单元各节点的真实质量及虚拟质量，并根据全局加速度值及节点的真实质量计算单元各节点所受到的重力。

![](images/GDEM_BlockDyna_1.png)

<center>地层信息文件</center>

![](images/GDEM_BlockDyna_2.png)

<center>GdemGrid网格文件</center>

#### 范例

```javascript
blkdyn.SetMatByStratum("arrange.txt");
```

<!--HJS_blkdyn_RandomizeMatByGroup-->

### RandomizeMatByGroup方法

#### 说明

对某特定组号单元的强度进行随机，强度的最终值=初始强度×随机系数。

#### 格式定义

blkdyn.RandomizeMatByGroup(<*strProperty*, *fRangeLow*, *fRangeUp*, *iGroup*>);

#### 参数

*strProperty*：字符串型，表示强度类型，可以是以下四个参数的任何一个

——"cohesion"，材料的内聚力（单位：Pa）

——"tension"，材料的抗拉强度（单位：Pa）

——"friction"，材料的内摩擦角（单位：度）

——"dilation"，材料的剪涨角（单位：度）

*fRangeLow*：浮点型，随机系数的下限

*fRangeUp*：浮点型，随机系数的上限

*iGroup*：整型，单元组号。

#### 备注

该函数执行前必须设置材料的强度参数（粘聚力、抗拉强度、内摩擦角、剪胀角），而后本函数采用均匀分布的概率模式，产生随机系数，随机系数位于*fRangeLow*与*fRangeUp*之间，最终的强度参数=初始参数×随机系数。

对于内摩擦角及剪胀角，是对其角度进行随机。

#### 范例

```javascript
///将组号为2的单元的粘聚力进行随机，随机系数的下限为0.1，上限为10，即最终的粘聚力的下限为初始粘聚力的0.1倍，上限为初始粘聚力的10倍。
blkdyn.RandomizeMatByGroup("cohesion", 0.1, 10.0, 2);
```

<!--HJS_blkdyn_RandomizeMatByCoord-->

### RandomizeMatByCoord方法

#### 说明

如果某单元的体心坐标位于坐标控制范围之内，对对该单元的强度参数进行随机，强度的最终值=初始强度×随机系数。

#### 格式定义

blkdyn.RandomizeMatByCoord (<*strProperty*, *fRangeLow*, *fRangeUp*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*strProperty*：字符串型，表示强度类型，可以是以下四个参数的任何一个

——"cohesion"，材料的内聚力（单位：Pa）

——"tension"，材料的抗拉强度（单位：Pa）

——"friction"，材料的内摩擦角（单位：度）

——"dilation"，材料的剪涨角（单位：度）

*fRangeLow*：浮点型，随机系数的下限

*fRangeUp*：浮点型，随机系数的上限

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

该函数执行前必须设置材料的强度参数（粘聚力、抗拉强度、内摩擦角、剪胀角），而后本函数采用均匀分布的概率模式，产生随机系数，随机系数位于*fRangeLow*与*fRangeUp*之间，最终的强度参数=初始参数×随机系数。

对于内摩擦角及剪胀角，是对其角度进行随机。

#### 范例

```javascript
///对坐标控制范围内的单元的抗拉强度进行随机，随机系数的下限为0.2，上限为1.2，即最终的抗拉强度的下限为初始抗拉强度的0.2倍，上限为初始抗拉强度的1.2倍。
blkdyn.RandomizeMatByCoord("tension", 0.2, 1.2, -1e5, 1e5, -5, 5, -1e5, 1e5);
```

<!--HJS_blkdyn_AdvRandomizeMatByGroup-->

### AdvRandomizeMatByGroup方法

#### 说明

对某设定组号的单元进行材料参数的超级随机。

#### 格式定义

blkdyn.AdvRandomizeMatByGroup (<*strProperty*, *strDistribution*, *fParam1*, *fParam2*, *iGroup*>);

#### 参数

*strProperty*：字符串型，随机参数类型名，共包含7类，为

——"density"，材料的密度（单位，kg/m<sup>3</sup>）

——"young"，材料的弹性模量（单位：Pa）

——"poisson"，材料的泊松比

——"cohesion"，材料的内聚力（单位：Pa）

——"tension"，材料的抗拉强度（单位：Pa）

——"friction"，材料的内摩擦角（单位：度）

——"dilation"，材料的剪涨角（单位：度）

*strDistribution*：字符串型，随机分布类型名，共包含3类，为

——"uniform"，均匀分布

——"normal"，正态分布

——"weibull"，韦伯分布

*fParam1*，*fParam2*：浮点型，随机分布的参数，为

——如果分布模式为"uniform"，*fParam1*及*fParam2*为随机值的下限及上限；

——如果分布模式为"normal"，*fParam1*及*fParam2*为期望与标准差；

——如果分布模式为"weibull"，*fParam1*及*fParam2*分别表示韦伯分布的*k*值及*λ*值。

*iGroup*：执行随机的单元组号。

#### 备注

（1）  当随机量为density时，程序内部自动更新了重力。

（2）  当随机量为弹性模量或者泊松比时，程序内部自动更新了虚质量。

（3）  正态分布时，如果产生的随机数小于0.0，强制等于0.0。

（4）  该函数产生的随机参数为绝对值，不需要提前设定基础材料参数。

（5）  对于内摩擦角及剪胀角，是对其角度进行随机。

#### 范例

```javascript
///对组号为2的单元的粘聚力执行均匀分布模式的随机，下限为1MPa，上限为3MPa。
blkdyn.AdvRandomizeMatByGroup("cohesion", "uniform", 1e6, 3e6, 2);
```

<!--HJS_blkdyn_AdvRandomizeMatByCoord-->

### AdvRandomizeMatByCoord方法

#### 说明

对某设定组号的单元进行材料参数的超级随机。

#### 格式定义

blkdyn.AdvRandomizeMatByCoord(<*strProperty*, *strDistribution*, *fParam1*, *fParam2*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*strProperty*：字符串型，随机参数类型名，共包含7类，为

——"density"，材料的密度（单位，kg/m<sup>3</sup>）

——"young"，材料的弹性模量（单位：Pa）

——"poisson"，材料的泊松比

——"cohesion"，材料的内聚力（单位：Pa）

——"tension"，材料的抗拉强度（单位：Pa）

——"friction"，材料的内摩擦角（单位：度）

——"dilation"，材料的剪涨角（单位：度）

*strDistribution*：字符串型，随机分布类型名，共包含3类，为

——"uniform"，均匀分布

——"normal"，正态分布

——"weibull"，韦伯分布

*fParam1*，*fParam2*：浮点型，随机分布的参数，为

——如果分布模式为"uniform"，*fParam1*及*fParam2*为随机值的下限及上限；

——如果分布模式为"normal"，*fParam1*及*fParam2*为期望与标准差；

——如果分布模式为"weibull"，*fParam1*及*fParam2*分别表示韦伯分布的*k*值及*λ*值。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）  当随机量为density时，程序内部自动更新了重力。

（2）  当随机量为弹性模量或者泊松比时，程序内部自动更新了虚质量。

（3）  正态分布时，如果产生的随机数小于0.0，强制等于0.0。

（4）  该函数产生的随机参数为绝对值，不需要提前设定基础材料参数。

（5）  对于内摩擦角及剪胀角，是对其角度进行随机。

#### 范例

```javascript
///对坐标范围内的内摩擦角执行正态分布模式的随机，期望为35°，标准差为2度。
blkdyn.AdvRandomizeMatByCoord("friction", "normal", 35.0, 2.0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_blkdyn_SetKGMat-->

### SetKGMat方法

#### 说明

单独设置固体单元的体积模量及剪切模量，此函数必须在设置了基础参数后方可进行。

#### 格式定义

blkdyn.SetKGMat(<*K*, *G*, *iGroup*>);

#### 参数

*K*：浮点型，体积模量（单位：Pa）

*G*：浮点型，剪切模量（单位：Pa）

*iGroup*：整型，单元组号。

#### 备注

此函数的意义在于设置一些极限状态：如体积模量为0，剪切模量不为0；或剪切模量为0，体积模量不为0 的情况。

#### 范例

```javascript
///将组号为3的单元的体积模量设置为2.1GPa，剪切模量设置为0GPa（模拟水）。
blkdyn.SetKGMat(2.1e9, 0.0, 3);
```

<!--HJS_blkdyn_SetCreepMat-->

### SetCreepMat方法

#### 说明

设置全局蠕变材料参数。

#### 格式定义

blkdyn.SetCreepMat(<*iNumber*, *fMaxwellViscosity*, *fMaxwellShearModulus*, *fKelvinViscosity*, *fKelvinShearModulus*>);

#### 参数

*iNumber*：整型，全局材料序号，从1开始。

*fMaxwellViscosity*：浮点型，马克斯韦尔体的动力粘度（单位：Pa.s）。

*fMaxwellShearModulus*：浮点型，马克斯韦尔体的剪切模量（单位：Pa）。

*fKelvinViscosity*：浮点型，开尔文体的动力粘度（单位：Pa.s）。

*fKelvinShearModulus*：浮点型，开尔文体的剪切模量（单位：Pa）。

#### 备注

（1）当单元的本构模型为"burger"时，上述蠕变参数起作用。

（2）通过dyna.Set函数设置" Creep_Cal"、"Creep_G_Inherit"、

"Elem_Plastic_Cal_Creep"、"Auto_Creep_Time"等，对蠕变的计算过程进行控制。如果" Creep_G_Inherit"为1，则本函数设置的马克斯韦尔体的剪切模量及开尔文体的剪切模量将不起作用。

#### 范例

```javascript
///设置序号为1的蠕变材料参数
blkdyn.SetCreepMat(1, 3e12, 1e10, 1e11, 1e10);
```

<!--HJS_blkdyn_BindCreepMat-->

### BindCreepMat方法

#### 说明

将蠕变材料号与块体单元进行关联。

#### 格式定义

blkdyn.BindCreepMat(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局蠕变材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号1-3的单元的蠕变材料与全局蠕变材料库中的5号材料进行关联。
blkdyn.BindCreepMat(5, 1, 3);
```

<!--HJS_blkdyn_SetJCMat-->

### SetJCMat方法

#### 说明

设置全局的JohnsonCook材料参数。

#### 格式定义

blkdyn.SetJCMat(<*iNumber*, *fA*, fB, *fn*, *fC*, *fm*, *fTb*, *fTm*, *fHc*, *fChr*, *bIfChangeTemp*>);

#### 参数

*iNumber*：整型，JohnsonCook材料序号，从1开始。

*fA*：浮点型，JohnsonCook材料参数，屈服应力，（单位：Pa）

*fB*：浮点型，JohnsonCook材料参数，应变硬化系数，（单位：Pa）

*fn*：浮点型，JohnsonCook材料参数，应变硬化指数

*fC*：浮点型，JohnsonCook材料参数，应变率相关系数

*fm*：浮点型，JohnsonCook材料参数，温度相关系数

*fTb*：浮点型，数值计算开始时材料所处的温度（大于等于室温，单位：K）

*fTm*：浮点型，材料的融化温度（单位：K）

*fHc*：浮点型，材料的热容（单位：J/kg/K）

*fChr*：浮点型，功热转化率（0.0-1.0，1.0表示塑性功完全转化为热，材料温度将升高）

*bIfChangeTemp*：布尔值，是否在计算中根据热改变温度，如果为true，则塑性功导致温度升高，材料的强度将降低。

#### 备注

（1）  当单元模型为"FEP"时起作用；

（2）  典型的JohnsonCook参数如表3.5所示。

<center>表3.5典型的JohnsonCook材料参数</center>

表3.5典型的JohnsonCook材料参数

| **材料名** | ***fA*** | ***fB*** | ***fn*** | ***fC*** | ***fm*** | ***fTm*** | ***fHc*** |
| ---------- | -------- | -------- | -------- | -------- | -------- | --------- | --------- |
| 铝         | 324e6    | 114e6    | 0.42     | 0.016    | 1.34     | 877       | 875       |
| 铜         | 107e6    | 213e6    | 0.26     | 0.024    | 1.09     | 1189      | 385       |
| 钨         | 1200e6   | 1030e6   | 0.019    | 0.034    | 0.4      | 1723      | 134       |

#### 范例

```javascript
///设置全局的JohnsonCook参数
blkdyn.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0 , true);
```

<!--HJS_blkdyn_BindJCMat-->

### BindJCMat方法

#### 说明

将全局的JohnsonCook材料号与单元进行关联。

#### 格式定义

blkdyn.BindJCMat(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局JohnsonCook材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为1-10的单元的JohnsonCook材料设置为全局材料中的1号材料
blkdyn.BindJCMat(1, 1, 10);
```

<!--HJS_blkdyn_SetMGMat-->

### SetMGMat方法

#### 说明

设置全局的MieGrueisen材料。

#### 格式定义

blkdyn.SetMGMat(<*iNumber*, *fdensity*, *fC*, *fLamuda*, *fGama*, *fa*>);

#### 参数

*iNumber*：整型，全局MieGrueisen材料序号，从1开始。

*fdensity*：浮点型，材料的初始密度（单位：kg/m<sup>3</sup>）

*fC*：浮点型，材料的纵波波速（单位：m/s）

*fLamuda*：浮点型，MieGrueisen模型无量纲参数

*fGama*：浮点型，MieGrueisen模型无量纲参数

*fa*：浮点型，MieGrueisen模型无量纲参数

#### 备注

（1）  当单元模型为"FEP"时起作用；

（2）  典型的MieGrueisen参数如表3.6所示。

<center>表3.6典型的MieGrueisen材料参数</center>

| **材料名** | *fdensity* | *fC* | *fLamuda* | *fGama* | *fa* |
| ---------- | ---------- | ---- | --------- | ------- | ---- |
| 铝         | 2703       | 5350 | 1.34      | 1.97    | 1.5  |
| 铜         | 8930       | 3940 | 1.49      | 2.02    | 1.5  |
| 钨         | 19220      | 4020 | 1.24      | 1.67    | 1.3  |

#### 范例

```javascript
///设置序号为1的全局的MieGrueisen参数
blkdyn.SetMGMat(1, 2703, 5350, 1.34, 1.97, 1.5);
```

<!--HJS_blkdyn_BindMGMat-->

### BindMGMat方法

#### 说明

将全局的MieGrueisen材料号与单元关联。

#### 格式定义

blkdyn.BindMGMat(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局MieGrueisen材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2-10的单元的MieGrueisen材料设置为全局材料库中的5号材料。
blkdyn.BindMGMat(5, 2, 10);
```

<!--HJS_blkdyn_SetUbiJointMat-->

### SetUbiJointMat方法

#### 说明

设置全局的遍布节理模型参数。

#### 格式定义

blkdyn.SetUbiJointMat(<*iNumber*, *friction*, *cohesion*, *tension*, *fArrayNormal*[3] >);

#### 参数

*iNumber*：整型，全局材料序号，从1开始。

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*friction*：浮点型，材料的内摩擦角（单位：度）

*fArrayNormal*：Array浮点型，包含3个分量，该组遍布节理面的单位法向。

#### 备注

（1）该参数在单元模型为"Joint"时起作用，且必须通过blkdyn.SetMat系列函数输入基础材料参数。

（2）通过dyna.Set(<>)设置"UbJoint_Mode_Option"，可以设置遍布节理模型的破坏模式，1为脆性断裂，2为理想弹塑性。

#### 范例

```javascript
///设定遍布节理面的法向
var normal = new Array(1, 1, 1);
///设定序号为1的全局遍布节理参数
blkdyn.SetUbiJointMat(1, 35, 3e6, 1e6, normal);
```

<!--HJS_blkdyn_BindUbiJointMat-->

### BindUbiJointMat方法

#### 说明

将全局遍布节理模型的序号与单元进行关联。。

#### 格式定义

blkdyn.BindUbiJointMat(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局遍布节理材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2-4的单元的遍布节理参数与全局材料库中的5号材料关联。
blkdyn.BindUbiJointMat(5,2,4);
```

<!--HJS_blkdyn_SetTransIsoMat-->

### SetTransIsoMat方法

#### 说明

设定横观各向同性弹性模型的全局材料参数。

#### 格式定义

blkdyn.SetTransIsoMat(<*iNumber*, *E1*, *u1*, *E2*, *u2*, *fArrayNormal*[3] >);

#### 参数

*iNumber*：整型，材料序号，从1开始。

*E1*：浮点型，各向同性平面上的弹性模量（单位：Pa）。

*u1*：浮点型，各向同性平面上的泊松比。

*E2*：浮点型，各向同性垂直面上的弹性模量（单位：Pa）。

*u2*：浮点型，各向同性垂直面上的泊松比。

*fArrayNormal*：Array浮点型，包含3个分量，各向同性面的法向。

#### 备注

该参数在单元模型为"TransIso"时起作用，且必须通过blkdyn.SetMat系列函数输入基础材料参数。

#### 范例

```javascript
///定义各向同性面的法向
var normal = new Array(1, 1, 1);
///设定全局材料号为1的横观各向同性材料参数。
blkdyn.SetTransIsoMat(1, 3e10, 0.23, 1e10, 0.3, normal);
```

<!--HJS_blkdyn_BindTransIsoMat-->

### BindTransIsoMat方法

#### 说明

把横观各向同性模型的全局材料号赋给设定的单元。

#### 格式定义

blkdyn.BindTransIsoMat(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局横观各向同性材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2-10的单元的横观各向同性材料与全局材料号2进行关联。
blkdyn.BindTransIsoMat(2, 2, 10);
```

<!--HJS_blkdyn_SetLandauSource-->

### SetLandauSource方法

#### 说明

设置全局的朗道爆源模型参数。

#### 格式定义

blkdyn.SetLandauSource(<*iNumber*, *fdensity*, *fD*, *fQ*, *fGama1*, *fGama2*, *fP_CJ*, *fArrayFirePos*[N] [3], *fBeginTime*, *fLastTime*>);

#### 参数

*iNumber*：整型，朗道爆源参数的序号，从1开始。

*fdensity*：浮点型，炸药的装药密度（单位：kg/m<sup>3</sup>）。

*fD*：浮点型，炸药爆速（m/s）

*fQ*：浮点型，单位质量下炸药的爆热（单位：J/kg）

*fGama1*：浮点型，爆生气体初始段的绝热指数（一般取3.0）

*fGama2*：浮点型，爆生气体第二段的绝热指数（一般取1.3333）

*fP_CJ*：浮点型，爆轰波阵面上的压力（CJ压力）（单位：Pa）

*fArrayFirePos*，Array浮点型，点火点的位置，可设置多个点火点，每个起爆点包含3个分量，（单位：m）

*fBeginTime*：浮点型，点火时间（单位：s）

*fLastTime*：浮点型，炸药单元加载持续时间（单位：s）

#### 备注

（1）当单元本构模型为"Landau"时起作用。

（2）当当前时间位于起爆时间*fBeginTime*之前时，若该单元不指定其它类型的本构模型，则执行Mohr-Coulomb理想弹塑性计算，计算参数采用初始输入的材料参数；当当前时间大于（*fBeginTime*+ *fLastTime*）时，该单元自动设置为空模型（"null"）。

（3）典型炸药的朗道参数为见表3.7.

<center>表3.7典型炸药的朗道参数</center>

| **炸药名**           | ***fdensity*** | ***fD*** | ***fQ*** | ***fGama1*** | ***fGama2*** | ***fP_CJ*** |
| -------------------- | -------------- | -------- | -------- | ------------ | ------------ | ----------- |
| 黑索金（RDX）        | 1820           | 8350     | 5.4e6    | 3.0          | 1.33333      | 32e9        |
| 梯恩梯（TNT）        | 1630           | 6930     | 4.5e6    | 3.0          | 1.33333      | 20e9        |
| 乳化炸药（emulsion） | 1150           | 5600     | 3.4e6    | 3.0          | 1.33333      | 9e9         |

#### 范例

```javascript
///设置起爆点位置
//var pos = new Array(0.0, 0.0, 0.0);
//设置多个起爆点
var pos = new Array(3);
pos[0] = [0,0,0];
pos[1] = [1,0,0];
pos[2] = [2,0,0];
///设置序号为1的朗道参数
blkdyn.SetLandauSource(1, 1150, 5600, 3.4e6, 3.0, 1.3333, 9e9, pos, 0.0, 1e-2);
```

<!--HJS_blkdyn_SetLandauGasLeakMat-->

### SetLandauGasLeakMat方法

#### 说明

将朗道爆源的气体逸散参数（将会引起炸药压力的衰减）。

#### 格式定义

blkdyn.SetLandauGasLeakMat( <*fCharTime*, *fCharIndex*, *iIDLow*, *iIDUp* >);

####  参数

*fCharTime*：浮点型，特征时间（单位：s），大于0。

*fCharIndex*：浮点型，特征指数（单位：s），大于0。

*iIDLow*：整型，选择爆源ID号的下限。

*iIDUp*：整型，选择爆源ID号的上限。

#### 备注

考虑到爆生气体将在爆炸发生后出现逸散现象，可借助指数衰减型函数刻画爆生气体压力由于逸散引起的衰减。其计算公式为：

p<sub>r</sub>=p*e<sup>-(t/t<sub>c</sub>)<sup>n</sup> </sup>                 

其中，*p*为根据爆源公式计算的爆炸压力，t<sub>c</sub>为特征时间（当*t*=时t<sub>c</sub>，表示压力变为了原有压力的36.8%），*n*为特征指数。

#### 范例

```javascript
///设置ID号为1-10的朗道爆源的气体逸散参数。
blkdyn.SetLandauGasLeakMat( 5e-4, 1.2, 1, 10);
```

<!--HJS_blkdyn_BindLandauSource-->

### BindLandauSource方法

#### 说明

将全局朗道材料库中特定的朗道材料号与单元内存中朗道材料号进行关联。

#### 格式定义

blkdyn.BindLandauSource(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局Landau材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的单元的Landau爆源模型序号设置为1。
blkdyn.BindLandauSource(1, 2, 3);
```

<!--HJS_blkdyn_SetJWLSource-->

### SetJWLSource方法

#### 说明

设置全局的JWL爆源模型参数。

#### 格式定义

blkdyn.SetJWLSource(<*iNumber*, *fdensity*, *fE0*, *fA*, *fB*, *fR1*, *fR2*, *fOmiga*, *fP_CJ*, *fD*, *fArrayFirePos*[N][3], *fBeginTime*, *fLastTime*>);

#### 参数

*iNumber*：整型，JWL爆源参数的序号，从1开始。

*fdensity*：浮点型，炸药的装药密度（单位：kg/m<sup>3</sup>）。

*fE0*：浮点型，爆轰产物的初始比内能（单位：J/m<sup>3</sup>）

*fA*：浮点型，材料参数（单位：Pa）

*fB*：浮点型，材料参数（单位：Pa）

*fR1*：浮点型，材料参数（无单位）

*fR2*：浮点型，材料参数（无单位）

*fOmiga*：浮点型，材料参数（无单位）

*fP_CJ*：浮点型，爆轰波阵面上的压力（CJ压力）（单位：Pa）

*fD*：浮点型，炸药爆速（m/s）

*fArrayFirePos*，Array浮点型，点火点的位置，可设置多个点火点，每个起爆点包含3个分量，（单位：m）

*fBeginTime*：浮点型，点火时间（单位：s）

*fLastTime*：浮点型，炸药单元加载持续时间（单位：s）

#### 备注

（1）当单元本构模型为"JWL"时起作用。

（2）当当前时间位于起爆时间*fBeginTime*之前时，若该单元不指定其它类型的本构模型，则执行Mohr-Coulomb理想弹塑性计算，计算参数采用初始输入的材料参数；当当前时间大于（*fBeginTime*+ *fLastTime*）时，该单元自动设置为空模型（"null"）。

（3）典型炸药的JWL参数为见表3.8.

<center>表3.8 典型炸药的JWL参数</center>

| **炸药名** | ***fdensity*** | ***fE0*** | ***fA*** | ***fB*** | ***fR1*** | ***fR2*** | ***fOmiga*** | ***fP_CJ*** | ***fD*** |
| :--------- | -------------- | --------- | -------- | -------- | --------- | --------- | ------------ | ----------- | -------- |
| TNT        | 1630           | 7.0e9     | 371.2e9  | 3.2e9    | 4.2       | 0.95      | 0.3          | 20e9        | 6930     |

####  范例

```javascript
///设定起爆点位置
//var pos = new Array(0.0, 0.0, 0.0);
//设置多个起爆点
var pos = new Array(3);
pos[0] = [0,0,0];
pos[1] = [1,0,0];
pos[2] = [2,0,0];
///设定TNT爆源参数
blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 15e-3 );
```

<!--HJS_blkdyn_SetJWLGasLeakMat-->

### SetJWLGasLeakMat方法

#### 说明

将JWL爆源的气体逸散参数（将会引起炸药压力的衰减）。

#### 格式定义

blkdyn.SetJWLGasLeakMat( <*fCharTime*, *fCharIndex*, *iIDLow*, *iIDUp* >);

#### 参数

*fCharTime*：浮点型，特征时间（单位：s），大于0。

*fCharIndex*：浮点型，特征指数（单位：s），大于0。

*iIDLow*：整型，选择爆源ID号的下限。

*iIDUp*：整型，选择爆源ID号的上限。

#### 备注

考虑到爆生气体将在爆炸发生后出现逸散现象，可借助指数衰减型函数刻画爆生气体压力由于逸散引起的衰减。其计算公式为：

p<sub>r</sub>=p*e<sup>-(t/t<sub>c</sub>)<sup>n</sup> </sup>                 

其中，*p*为根据爆源公式计算的爆炸压力，t<sub>c</sub>为特征时间（当*t*=时t<sub>c</sub>，表示压力变为了原有压力的36.8%），*n*为特征指数。

#### 范例

```javascript
///设置ID号为1-10的JWL爆源的气体逸散参数。
blkdyn.SetJWLGasLeakMat( 5e-4, 1.2, 1, 10);
```

<!--HJS_blkdyn_BindJWLSource-->

### BindJWLSource方法

#### 说明

将全局JWL材料库中特定的JWL材料号与单元内存中JWL材料号进行关联。

#### 格式定义

blkdyn.BindJWLSource (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局JWL材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的单元的JWL爆源模型序号设置为1。
blkdyn.BindJWLSource(1, 2, 3);
```

<!--HJS_blkdyn_SetLeeTarverSource-->

### SetLeeTarverSource方法

#### 说明

设置全局的LeeTarver点火增长模型参数。

#### 格式定义

blkdyn.SetLeeTarverSource(<*iNumber*, *fI*, *fa*, *fb*,  *fc*, *fd*, *fe*, *fg*, *fx*, *fy*, *fz*,*fG1*, *fG2*, *λ<sub>igmax</sub>*, *λ<sub>G1max</sub>*, *λ<sub>G2min</sub>*[, *iFireMode*]>);

#### 参数

*iNumber*：整型，LeeTarver点火增长模型参数的序号，从1开始。

*fI*：浮点型，模型参数（单位：us<sup>-1</sup>）。

*fa*：浮点型，模型参数（无单位）

*fb*：浮点型，模型参数（无单位）

*fc*：浮点型，模型参数（无单位）

*fd*：浮点型，模型参数（无单位）

*fe*：浮点型，模型参数（无单位）

*fg*：浮点型，模型参数（无单位）

*fx*：浮点型，模型参数（无单位）

*fy*：浮点型，模型参数（无单位）

*fz*，浮点型，模型参数（无单位）

*fG1*：浮点型，模型参数（单位：Mbar<sup>-y</sup>us<sup>-1</sup>）

*fG2*：浮点型，模型参数（单位：Mbar<sup>-y</sup>us<sup>-1</sup>）

*λ<sub>igmax</sub>*：浮点型，模型参数（无单位）

*λ<sub>G1max</sub>*：浮点型，模型参数（无单位）

*λ<sub>G2min</sub>*：浮点型，模型参数（无单位）

*iFireMode*：整型，点火模式：1-压力点火，2-时间点火，默认为1。

#### 备注

（1）LeeTarver三项式点火增长模型公式为：
$$
d\lambda/dt = I(1-\lambda)^b(\rho/\rho_0-1-a)^x+G_1(1-\lambda)^c\lambda^dp^y+G_2(1-\lambda)^e\lambda^gp^z
$$
​		等式右端三项依次表示为点火（炸药在冲击压缩过程中局部产生“热点”的过程以及描述热点区域的后续点火过程）、燃烧（没有发生反应的炸药发生分解的过程）和快反应（描述所有的“热点”汇合，使反应在短时间内快速完成）三个阶段。

​		$\lambda$为反应度（反应炸药量与炸药总量的比值），$\rho$和$\rho_0$分别为当前密度和初始密度，$p$局部压力（Mbar），$t$为时间（us）。

​		$\lambda_{igmax}、\lambda_{G1max}、\lambda_{G2min}$是控制三步反应程度的参数，当$0<\lambda<\lambda_{igmax}$，计算点火项，当$0<\lambda<\lambda_{G1max}$，计算增长项，当$0<\lambda<\lambda_{G2min}$，计算快速反应项。

​		点火项中$I$ 和 $x$决定了“热点”数量，$a$是临界压缩度，既足够强的冲击波作用于炸药使得炸药压缩度大于等于$a$时，炸药发生点火。增长项和完成项中 *G*1和 *G*2为表面积和体积之比，*c*、*e*、*d*、*g* 的数值决定热点成长的形状，当燃耗项阶数 *b*=*c*=2/3，则热点以球形燃烧。*G*1和 *d* 控制着点火后的早期反应与增长，*G*2和 *z* 则确定高压反应率；*y*、*z* 控制反应增长速率。

（2）当单元本构为LeeTarver，其炸药参数为JWL参数，通过blkdyn.SetJWLSource()设置相关参数。

（3）当$iFireMode=1$为压力点火，通过blkdyn.SetJWLSource()设置的参数中点火位置和点火时间不起作用；当$iFireMode=2$为时间点火，通过blkdyn.SetJWLSource()设置的参数中，仅点火位置所在单元按照时间点火执行，其他单元仍按照压力点火计算。

（4）典型炸药的LeeTarver参数为见表3.9.

<center>表3.8 典型炸药的JWL参数</center>

| **炸药名** | ***fdensity*** | ***fI*** | ***fa*** | ***fb*** | ***fc*** | ***fd*** | ***fe*** | ***fg*** | ***fx*** | ***fy*** | ***fz*** | ***fG1*** | ***fG2*** | ***λ<sub>igmax</sub>*** | ***λ<sub>G1max</sub>*** | ***λ<sub>G2min</sub>*** |
| :--------- | -------------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | --------- | --------- | ----------------------- | ----------------------- | ----------------------- |
| PBX9404    | 1842           | 7.43e11  | 0        | 0.667    | 0.667    | 0.111    | 0.333    | 1.0      | 20.0     | 1.0      | 2.0      | 3.1       | 400       | 0.3                     | 0.5                     | 0.0                     |

####  范例

```javascript
///设定LeeTarver参数
blkdyn.SetLeeTarverSource(1, 7.43e11, 0.00, 0.667, 0.667, 0.111, 0.333, 1.0, 20.0, 1.0, 2.0, 3.1, 400, 0.3, 0.50, 0.0, 1);
```

<!--HJS_blkdyn_BindLeeTarverSource-->

### BindLeeTarverSource方法

#### 说明

将全局LeeTarver材料库中特定的LeeTarver材料号与单元内存中LeeTarver材料号进行关联。

#### 格式定义

blkdyn.BindLeeTarverSource (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局LeeTarver材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的单元的LeeTarver爆源模型序号设置为1。
blkdyn.BindLeeTarverSource(1, 2, 3);
```

<!--HJS_blkdyn_SetAirMat-->

### SetAirMat方法

#### 说明

设置全局的空气绝热膨胀方程参数。

#### 格式定义

blkdyn.SetAirMat(<*iNumber*, *fdensity*,*fP0,fGama*>);

#### 参数

*iNumber*：整型，空气参数的序号，从1开始。

*fdensity*：浮点型，空气的密度（单位：kg/m<sup>3</sup>）。

*fP0*：浮点型，空气的初始压力（单位：Pa）

*fGama*：浮点型，绝热膨胀指数（一般取1.333）

#### 备注

当单元本构模型为"Air"时起作用。

#### 范例

```javascript
//编号为1，空气密度为2kg/m3，初始气压1MPa，绝热指数1.333

blkdyn.SetAirMat(1, 2.0, 1e6, 1.333 );
```

<!--HJS_blkdyn_BindAirMat-->

### BindAirMat方法

#### 说明

将全局空气材料库中特定的材料号与单元内存中空气的材料号进行关联。

#### 格式定义

blkdyn.BindAirMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局空气材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的单元的空气模型序号设置为1。
blkdyn.BindAirMat(1, 2, 3);
```

<!--HJS_blkdyn_SetHJCMat-->

### SetHJCMat方法

#### 说明

设置全局的HJC模型材料参数。

#### 格式定义

blkdyn.SetHJCMat(<*iNumber*, afPara[18]>);

#### 参数

*iNumber*：整型，HJC模型参数的序号，从1开始。

afPara：Array浮点型，包含18个参数，依次为：

1)    无侧限抗压强度，fComS（单位：Pa）

2)    材料归一化的内聚强度，fA（单位：无单位）

3)    归一化的压力硬化系数，fB（单位：无单位）

4)    压力硬化指数，fn（单位：无单位）

5)    应变率系数，fC（单位：无单位）

6)    归一化的最大强度（Mises屈服应力的最大值），fSmax（单位：无单位）

7)    材料剪切模量，fG（单位：Pa）

8)    损伤计算用系数，fD1（单位：无单位）

9)    损伤计算用指数，fD2（单位：无单位）

10)    最小破碎塑性应变，fEfmin（单位：无单位）

11)    空洞坍塌压力，fPcrsh（单位：Pa）

12)    弹性极限体积应变，fUcrsh（单位：无单位）

13)    压实状态体积模量1，fK1（单位：Pa）

14)    压实状态体积模量2，fK2（单位：Pa）

15)    压实状态体积模量3，fK3（单位：Pa）

16)    空洞完全坍塌（压实）时的压力，fPlock（单位：Pa）

17)    空洞完全坍塌（压实）时的体积应变，fUlock（单位：无单位）

18)    材料能够承受的最大静水拉应力，fT（单位：Pa）

#### 备注

（1）  当单元本构模型为"HJC"时起作用。

（2）  HJC模型共19个参数，密度通过blkdyn.SetMat进行设置，故此处输入18个参数。

（3）  弹性时刻的体积模量通过fPcrsh / fUcrsh进行计算。

（4）  fEfmin主要用于为了防止材料在小幅拉伸波作用下的断裂。

#### 范例

```javascript
var HJCMat = [4.8e7, 0.79, 1.60, 0.61, 0.007, 7.0, 14.86e9, 0.04, 1.0, 0.01, 0.016e9, 0.001, 85e9, -171e9, 208e9, 0.8e9, 0.1, 0.004e9];
blkdyn.SetHJCMat(1, HJCMat);
```

<!--HJS_blkdyn_BindHJCMat-->

### BindHJCMat方法

#### 说明

将全局HJC材料库中特定的材料号与单元内存中HJC的材料号进行关联。

#### 格式定义

blkdyn.BindHJCMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局HJC材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的单元的HJC模型序号设置为1。
blkdyn.BindHJCMat(1, 2, 3);
```

<!--HJS_blkdyn_SetJH2Mat-->

### SetJH2Mat方法

#### 说明

设置全局的JH2模型材料参数。

#### 格式定义

blkdyn.SetJH2Mat(<*iNumber*, afPara[17]>);

#### 参数

*iNumber*：整型，JH2模型参数的序号，从1开始。

afPara：Array浮点型，包含17个参数，依次为：

1)    弹性模量，E（单位：Pa）

2)    泊松比，Mu（单位：无单位）

3)    压力系数，K2（单位：Pa）

4)    压力系数，K3（单位：Pa）

5)    Hugoniot弹性极限时的等效应力，SgmHel（单位：Pa）

6)    Hugoniot弹性极限时的静水压应力，PreHel（单位：Pa）

7)    完整材料的强度系数，A（单位：无单位）

8)    完整材料的强度指数，N（单位：无单位）

9)    断裂材料的强度系数，B（单位：无单位）

10)    断裂材料的强度指数，M（单位：无单位）

11)    应变率系数，C（单位：无单位）

12)    材料能承受的最大静水拉力，T（单位：Pa）

13)    损伤系数，D1（单位：无单位）

14)    损伤指数，D2（单位：无单位）

15)    能量转化系数，Beta（单位：无单位，在0-1之间）

16)    最大断裂强度系数，SMax（单位：无单位）

17)    参考应变率，Eps0，一般取1（单位：1/s）

#### 备注

（1）  当单元本构模型为"JH2"时起作用。

（2）  JH2模型共20个参数，密度通过blkdyn.SetMat进行设置；压力系数（体积模量）K1、剪切模量G，通过弹性模量及泊松比进行换算；故实际输入参数为17个。

#### 范例

```javascript
var JH2Mat = [8e10, 0.3, -1.5e11, 2.0e11, 5e9, 1e10, 1.01, 0.83, 0.68, 0.76, 0.005, 3.5e7, 0.01, 0.9, 1.0, 7.0, 1.0 ];
blkdyn.SetJH2Mat(1, JH2Mat);
```

<!--HJS_blkdyn_BindJH2Mat-->

### BindJH2Mat方法

#### 说明

将全局JH2材料库中特定的材料号与单元内存中JH2的材料号进行关联。

#### 格式定义

blkdyn.BindJH2Mat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局JH2材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的单元的JH2模型序号设置为1。
blkdyn.BindJH2Mat(1, 2, 3);
```

<!--HJS_blkdyn_SetTCKUSMat-->

### SetTCKUSMat方法

#### 说明

设置全局的TCK及KUS模型参数。

#### 格式定义

blkdyn.SetTCKUSMat(<*iNumber, fKIC, fLimStrRatio, fk, fm, fSita*>);

#### 参数

*iNumber*：整型，空气参数的序号，从1开始。

*fKIC*：浮点型，断裂韧度（单位：$Pa\sqrt m$）。

*fLimStrRatio*：浮点型，最大体积拉伸应变率（单位：1/s）

*fk*：浮点型，材料参数，系数，用于计算裂纹密度

*fm*：浮点型，材料参数，指数，用于计算裂纹密度

*fSita*：浮点型，材料参数，系数，用于计算有效应变

#### 备注

当单元本构模型为"TCK"或"KUS"时起作用。

#### 范例

```javascript
//编号为1
blkdyn.SetTCKUSMat(1, 7.67e5, 100.0, 2.3e24, 7.0, 1.0);
```

<!--HJS_blkdyn_BindTCKUSMat-->

### BindTCKUSMat方法

#### 说明

将全局TCKUS材料库中特定的材料号与单元内存中TCK模型或KUS模型的材料号进行关联。

#### 格式定义

blkdyn.BindTCKUSMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局TCK或KUS材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

#### 范例

```javascript
///将组号为2及3的单元的模型序号设置为1。
blkdyn.BindTCKUSMat(1, 2, 3);
```

<!--HJS_blkdyn_SetMRMat-->

<!--HJS_blkdyn_SetHJCKUSMat-->

### SetHJCKUSMat方法

#### 说明

设置全局的HJCKUS模型材料参数。

#### 格式定义

blkdyn.SetHJCKUSMat(<*iNumber*, afPara[21]>);

#### 参数

*iNumber*：整型，HJC模型参数的序号，从1开始。

afPara：Array浮点型，包含21个参数，依次为：

1)    无侧限抗压强度，fComS（单位：Pa）
2)    材料归一化的内聚强度，fA（单位：无单位）
3)    归一化的压力硬化系数，fB（单位：无单位）
4)    压力硬化指数，fn（单位：无单位）
5)    应变率系数，fC（单位：无单位）
6)    归一化的最大强度（Mises屈服应力的最大值），fSmax（单位：无单位）
7)    材料剪切模量，fG（单位：Pa）
8)    损伤计算用系数，fD1（单位：无单位）
9)    损伤计算用指数，fD2（单位：无单位）
10)    最小破碎塑性应变，fEfmin（单位：无单位）
11)    空洞坍塌压力，fPcrsh（单位：Pa）
12)    弹性极限体积应变，fUcrsh（单位：无单位）
13)    压实状态体积模量1，fK1（单位：Pa）
14)    压实状态体积模量2，fK2（单位：Pa）
15)    压实状态体积模量3，fK3（单位：Pa）
16)    空洞完全坍塌（压实）时的压力，fPlock（单位：Pa）
17)    空洞完全坍塌（压实）时的体积应变，fUlock（单位：无单位）
18)    材料能够承受的最大静水拉应力，fT（单位：Pa）
19)    *fKIC*：浮点型，断裂韧度（单位：$Pa\sqrt m$）。
20)    fk*：浮点型，材料参数，系数，用于计算裂纹密度*
21)    fm*：浮点型，材料参数，指数，用于计算裂纹密度*

#### 备注

（1）  当单元本构模型为"HJCKUS"时起作用。

（3）  弹性时刻的体积模量通过fPcrsh / fUcrsh进行计算。

（4）  fEfmin主要用于为了防止材料在小幅拉伸波作用下的断裂。

#### 范例

```javascript
var HJCKUSMat = [70.69e6, 0.761, 2.5, 0.79, 0.004423, 7, 9.76e9, 0.04, 1, 0.01, 23.56e6, 0.00102, 19.5e9, 24.76e9, 98.555e9, 1.57e9, 0.012, 5.82e6,1.14e6, 4.34e27, 7];
blkdyn.SetHJCMat(1, HJCKUSMat);
```

<!--HJS_blkdyn_BindHJCKUSMat-->

### BindHJCKUSMat方法

#### 说明

将全局HJCKUS材料库中特定的材料号与单元内存中HJCKUS的材料号进行关联。

#### 格式定义

blkdyn.BindHJCKUSMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局HJCKUS材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的单元的HJCKUS模型序号设置为1。
blkdyn.BindHJCKUSMat(1, 2, 3);
```

<!--HJS_blkdyn_SetMRMat-->

### SetMRMat方法

#### 说明

设置全局的橡胶MR模型材料参数。

#### 格式定义

blkdyn.SetMRMat(<*iNumber*, afPara[11]>);

#### 参数

*iNumber*：整型，MR模型参数的序号，从1开始。

afPara：Array浮点型，包含11个参数，依次为：C10、C01、C11、C20、C02、C21、C12、C30、C03、D、*μ*。

#### 备注

（1）  当单元本构模型为"MR"时起作用（9参数MR模型）。

（2）  C10~C03为MR模型的9个基本参数（主要用于描述剪切，单位MPa），D为MR体积模量常数（单位：MPa）、*μ*为应变率影响系数（无单位）。

（3）  C10 + C01 = G，D = K / 2， G、K分别为材料的初始剪切模量及体积模量。

（4）  应变率对应力的增强效应可表述为： 
$$
\sigma_n=\sigma_0[1+\mu\ln(\dot{\varepsilon}+1)]
$$

#### 范例

```javascript
var MRMat = [0.01, 0.28, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1];
blkdyn.SetMRMat(1, MRMat);
```

<!--HJS_blkdyn_BindMRMat-->

### BindMRMat方法

#### 说明

将全局MR材料库中特定的材料号与单元内存中MR模型的材料号进行关联。

#### 格式定义

blkdyn.BindMRMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局MR材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

#### 范例

```javascript
///将组号为2及3的单元的MR材料序号设置为1。
blkdyn.BindMRMat(1, 2, 3);
```

<!--HJS_blkdyn_SetSJRockMat-->

### SetSJRockMat方法



#### 说明

设置随机节理模型（SMRM模型）的材料参数。

#### 格式定义

blkdyn.SetSJRockMat(*nJointNo, afPara[,iGroup1 [,iGroup2]*>);

#### 参数

*nJointNo*：整型，随机节理岩体中节理组的序号，从1开始，只能支持3组，故该变量的值只能为1、2及3。

afPara：Array浮点型，二维数组，第一维包含6个元素，分别表示某一组结构面的倾向（单位：°）、倾角（单位：°）、节理密度（单位：Pa）、节理半径（单位：m）、结构面粘聚力（单位：Pa）及结构面内摩擦角（单位：°）。第二维为节理组数量，只能为1-3。

*iGroup1*、*iGroup2*：整型，单元组号。

#### 备注

（1）  当单元本构模型为"SJRock"时起作用。

（2）  执行该施加前，应该先通过blkdyn.SetMat系列函数设置基础参数；因为本次施加会复制基础材料参数至本随机节理模型。

（3）当*iGroup1*、*iGroup2*全部不写，表示所有单元都施加；当直接*iGroup1*，表示该组号施加；当写全*iGroup1*、*iGroup2*，表示位于该两个组号下限及上限之间的组号施加。

（4）通过设置"If_SMRM_Plastic_Cal"确定是否开启塑性计算，通过设置"If_SMRM_Joint_Brittle"确定节理计算是否为脆性。

#### 范例

```javascript
////倾向，倾角，节理密度，半径，粘聚力，摩擦角
var aProp = new Array(3);
aProp[0] = [0, 20, 20, 0.5, 0, 25];
aProp[1] = [0, 20, 20, 0.5, 0, 25];
aProp[2] = [0, 20, 20, 0.5, 0, 25];
blkdyn.SetSJRockMat(3, aProp);
blkdyn.SetSJRockMat(3, aProp,1);
blkdyn.SetSJRockMat(3, aProp,1,10);
```



<!--HJS_blkdyn_SetSatRockMat-->

### SetSatRockMat方法

#### 说明

设置饱和岩体动力学模型材料参数。

#### 格式定义

blkdyn.SetSatRockMat(<*iNumber*, afPara[25]>);

#### 参数

*iNumber*：整型，SatRock模型参数的序号，从1开始。

afPara：Array浮点型，包含25个参数，依次为：表观剪切模量（单位：Pa），计算实体压力相关参数Beta_s1（单位：Pa）、Beta_s2（单位：Pa）、Beta_s3（单位：Pa），计算水压力相关参数Beta_f1（单位：Pa）、Beta_f2（单位：Pa）、Beta_f3（单位：Pa），材料泊松比fPoisson，初始孔隙率fPorosity0，水初始体积分数fWaterFai0，比奥系数fBiot，用于计算孔隙率的体积变形耗散率与偏应变耗散率的比值fmd，用于计算当前体积分数的与初始体积分数有关的拟合系数faf、ftf，初始屈服面拟合系数faq、fbq、fcq，破坏面的拟合系数fap、fbp、fcp，应变硬化系数（控制应变硬化速度）fk，计算损伤因子相关的参数：系数n1(单位：1/s)、指数n2、临界损伤因子Dc、临界塑性应变CriPlaStrain。

#### 备注

（1）  当单元本构模型为"SatRock"时起作用，共包含25个输入参数。

（2）  Beta_s1为实体单元体积模量，Beta_f1为水体积模量。

#### 范例

```javascript
var afPara = new Array(25);

afPara[0] = 3.13e9;  //表观剪切模量   (Pa)

////计算实体压力相关参数
afPara[1] = 25.91e9;  //Beta_s1   (Pa) ，为实体体模量
afPara[2] = 32.65e9;  //Beta_s2   (Pa)
afPara[3] = 8.05e9;  //Beta_s3   (Pa)

////计算水压力相关参数
afPara[4] = 3.61e9;  //Beta_f1   (Pa) ，为水体模量
afPara[5] = 7.80e9;  //Beta_f2   (Pa)
afPara[6] = 7.83e9;  //Beta_f3  (Pa)

//材料泊松比，fPoisson 
afPara[7] = 0.307;  

/////初始孔隙率，fPorosity0 /////文献中给出
afPara[8] =0.0;  

/////水初始体积分数，fWaterFai0  
afPara[9] =0.34;  

/////比奥系数，fBiot   
afPara[10] =1.0;  

/////用于计算孔隙率，体积变形耗散率与偏应变耗散率的比值，0-1之间，取1，fmd 
afPara[11] =0.0;  

//////与初始体积分数有关的拟合系数，用于计算当前体积分数
afPara[12] =-0.20289;    ////faf  
afPara[13] =0.14657;    ////ftf   

/////拟合初始屈服面的拟合系数
afPara[14] =0.711e9;    ////faq  
afPara[15] =0.56e-9;    ////fbq   
afPara[16] =0.685e9;    ////fcq  

/////拟合破坏面的拟合系数
afPara[17] =1.92e9;    ////fap  
afPara[18] =0.335e-9;    ////fbp   
afPara[19] =1.89e9;    ////fcp 

////应变硬化系数（控制应变硬化速度）, fk
afPara[20] =2300.0;  

//////计算损伤因子相关材料参数
afPara[21] = 784;  //系数，n1  (1/s)
afPara[22] = 0.07;  //指数，n2  
afPara[23] = 0.56;  //临界损伤因子，Dc
afPara[24] = 0.005;  //临界塑性应变，CriPlaStrain
//////设定饱和岩体材料参数
blkdyn.SetSatRockMat(1, afPara);
```

<!--HJS_blkdyn_BindSatRockMat-->

### BindSatRockMat方法

#### 说明

将全局SatRock材料库中特定的材料号与单元内存中SatRock模型的材料号进行关联。

#### 格式定义

blkdyn.BindSatRockMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局SatRock材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

#### 范例

```javascript
///将组号为2及3的单元的SatRock材料序号设置为1。
blkdyn.BindMRMat(1, 2, 3);
```

<!--HJS_blkdyn_SetElemJointMat-->

### SetElemJointMat方法

#### 说明

设置细观节理单元模型参数。

#### 格式定义

blkdyn.SetElemJointMat(<*iNumber[, young, poisson], friction, cohesion, tension, fThickness, fLength, fCentroid[3], fArrayNormal[3]*>);

#### 参数

*iNumber*：整型，细观节理参数的序号，从1开始。

*young*：浮点型，弹性模量（单位：）。

*poisson*：浮点型，泊松比（无量纲量）

*friction*：浮点型，内摩擦角（单位：$°$）。

*cohesion*：浮点型，粘聚力（单位：$Pa$）

*tension*：浮点型，抗拉强度（单位：$Pa$）

*fThickness*：浮点型，节理厚度（单位：$m$）

*fLength*：浮点型，节理长度（单位：$m$）

*fCentroid[3]*：浮点型数组，节理中心坐标（单位：$m$​）

*fArrayNormal[3]*：浮点型数组，节理面法向向量（单位：$m$）

#### 备注

弹性模量和泊松比为可选量，不写默认为单元的弹模和泊松比。

二维计算中节理为线段，*fCentroid[3]*指线段中点坐标，*fLength*指线段长度；三维计算中节理为圆面，*fCentroid[3]*指圆心坐标，*fLength*指圆的直径。使用该接口前需要事先通过blkdyn.SetMat等接口设置单元参数，主要为密度、弹模和泊松比。

#### 范例

```javascript
//设定单元节理面厚度
var fThickness = 0.004;
//设定单元节理面长度
var fLength = 10;
//设定单元节理面中心坐标
var centroid = new Array(0.05, 0.1, 0.0);
//设定单元节理面的法向
var normal = new Array(1, 1, 0);
//设定序号为1的单元节理参数
blkdyn.SetElemJointMat(1, 20, 5e5, 5e5, fThickness, fLength, centroid, normal);
```

<!--HJS_blkdyn_SetDavidenkovMat-->

### SetDavidenkovMat方法

#### 说明

设置全局的Davidenkov土动力学模型材料参数。

#### 格式定义

blkdyn.SetDavidenkovMat(<*iNumber, fGmax0, fMu, fdA, fdB, fGamay*>);

#### 参数

*iNumber*：整型，Davidenkov模型参数的序号，从1开始。

*fGmax0*：浮点型，最大剪切模量（单位：Pa）。

*fMu*：浮点型，泊松比。

*fdA*：浮点型，拟合参数1。

*fdB*：浮点型，拟合参数2。

*fdGamay*：浮点型，拟合参数3。

#### 备注

当单元本构模型为"Davidenkov"时起作用。

#### 范例

```javascript
blkdyn.SetDavidenkovMat(1,5e6, 0.3, 1.1, 0.35, 3.8e-4);
```

<!--HJS_blkdyn_BindDavidenkovMat-->

### BindDavidenkovMat方法

#### 说明

将全局Davidenkov材料库中特定的材料号与单元内存中Davidenkov模型的材料号进行关联。

#### 格式定义

blkdyn.BindDavidenkovMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局Davidenkov材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

#### 范例

```javascript
///将组号为2及3的单元的Davidenkov材料序号设置为1。
blkdyn.BindDavidenkovMat(1, 2, 3);
```

<!--HJS_blkdyn_SetByrneDavMat-->

### SetByrneDavMat方法

#### 说明

设置全局的Davidenkov土动力学液化模型材料参数。

#### 格式定义

blkdyn.SetByrneDavMat(<*iNumber, fGmax0, fMu, fdA, fdB, fGamay, dSFRef, dca1, dc1, dc2, dcm, dcn, dck, Gamayth*>);

#### 参数

*iNumber*：整型，ByrneDav模型参数的序号，从1开始。

*fGmax0*：浮点型，最大剪切模量（单位：Pa）。

*fMu*：浮点型，泊松比。

*fdA*：浮点型，拟合参数1。

*fdB*：浮点型，拟合参数2。

*fdGamay*：浮点型，拟合参数3。

*dSFRef*：浮点型，参考压力（单位：Pa），一般取100kPa。

*dca1*：浮点型，按深度修正模量的参数。

*dc1*：浮点型，孔压模式参数1。

*dc2*：浮点型，孔压模式参数2。

*dcm*：浮点型，回弹模量参数1。

*dcn*：浮点型，回弹模量参数2。

*dck*：浮点型，回弹模量参数3。

*Gamayth*：浮点型，弹性应变阈值。

#### 备注

当单元本构模型为"ByrneDav"时起作用。

#### 范例

```javascript
blkdyn.SetByrneDavMat(1, 53e6, 0.25, 1.02, 0.43, 0.00041, 1e5, 0.5, 0.55, 1.38, 0.43, 0.62, 0.0025, 0.0002);
```

<!--HJS_blkdyn_BindByrneDavMat-->

### BindByrneDavMat方法

#### 说明

将全局ByrneDav材料库中特定的材料号与单元内存中ByrneDav模型的材料号进行关联。

#### 格式定义

blkdyn.BindByrneDavMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局ByrneDav材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

#### 范例

```javascript
///将组号为2及3的单元的ByrneDav材料序号设置为1。
blkdyn.BindByrneDavMat(1, 2, 3);
```



<!--HJS_blkdyn_IModel_Set-->

## 接触面模型设置

接触面模型设置中提供了接触面本构模型设定、接触面材料参数设定、接触面材料参数关联、接触面材料随机等多个功能函数，函数列表见表3.9。

<center>表3.9接触面模型设置的相关函数</center>

<table>
  	<tr>
		<th> 序号 </th><th>方法</th><th>说明</th>
	</tr>
         <td>1</td><td>SetIModel</td><td rowspan=5>设置接触面的本构模型，具体的本构模型见表3.10。</td>
	</tr>
        <td>2</td><td>SetIModelByCoord</td>
	</tr>
        <td>3</td><td>SetIModelByGroup</td>
	</tr>
        <td>4</td><td>SetIModelByLine</td>
	</tr>
        <td>5</td><td>SetIModelByGroupInterface</td>
	</tr>
        <td>6</td><td>SetIMat</td><td rowspan=12>设置接触面的基本材料参数，包括单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力及抗拉强度等5个。均为国际单位值。</td>
	</tr>
        <td>7</td><td>SetIMatByCoord</td>
	</tr>
        <td>8</td></td><td>SetIMatByPlane</td>
	</tr>
        <td>9</td><td>SetIMatByGroupInterface</td>
	</tr>
        <td>10</td><td>SetIMatByDirection</td>
	</tr>
        <td>11</td><td>SetIMatByCylinder</td>
	</tr>
    	<td>12</td><td>SetIMatByCoordAndDirection</td>
	</tr>
        <td>13</td><td>SetIMatByCoordAndPlane</td>
	</tr>
        <td>14</td><td>SetIMatByGroupAndPlane</td>
	</tr>
        <td>15</td><td>SetIMatByLine</td>
	</tr>
        <td>16</td><td>SetIMatByLineFit1</td>
	</tr>
        <td>17</td><td>SetIMatByLineFit2</td>
	</tr>
        <td>18</td><td>SetIMatBySel</td><td>根据Genvi平台单元面集合设置接触面材料，包括单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力及抗拉强度、拉伸断裂能、剪切断裂能等7个。</td>
	</tr>
        <td>19</td><td>SetBoundIMat</td><td>设置自由接触面的接触参数。</td>
	</tr>
        <td>20</td><td>SetIFracEnergyByGroupInterface</td><td rowspan=3>单独设置接触面的断裂能参数，包括拉伸断裂能及剪切断裂能。</td>
	</tr>
        <td>21</td><td>SetIFracEnergyByCoord</td>
	</tr>
        <td>22</td><td>SetIFracEnergyByLine</td>
	</tr>
        <td>23</td><td>SetIMatReductionByCoord</td><td rowspan=2>接触面的强度进行一定比例的折减</td>
	</tr>
        <td>24</td><td>SetIMatReductionByGroupInterface</td>
	</tr>
        <td>25</td><td>RandomizeIMat</td><td rowspan=2>接触面强度的随机</td>
	</tr>
        <td>26</td><td>RandomizeIMatByCoord</td>
	</tr>
        <td>27</td><td>AdvRandomizeIMatByGroupInterface</td><td rowspan=2>接触面强度的高级随机</td>
	</tr>
        <td>28</td><td>AdvRandomizeIMatByCoord</td>
	</tr>
        <td>29</td><td>SetIStiffByElem</td><td rowspan=2>从单元中获得刚度、强度</td>
	</tr>
        <td>30</td><td>SetIStrengthByElem</td>
	</tr>
        <td>31</td><td>SetISsdmMatByGroupInterface</td><td rowspan=2>设置应变强度分布模型的参数</td>
	</tr>
        <td>32</td><td>SetISsdmMatByCoord</td>
	</tr>
        <td>33</td><td>SetIHydroSupportMat</td><td>设置液压支架模型的全局材料参数。</td>
	</tr>
        <td>34</td><td>BindIHydroSupportMatByGroupInterface</td><td rowspan=2>将液压支架模型全局材料参数与接触面进行关联</td>
	</tr>
        <td>35</td><td>BindIHydroSupportMatByLine</td>
	</tr>
    </table>



接触面的材料参数中，单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度、拉伸断裂能、剪切断裂能、应变强度分布模型材料参数等均位于每根接触弹簧上，液压支架的模型参数为全局参数，故需要和接触面进行关联。

在块体模块中，接触面上可设置线弹性、脆性断裂Mohr-Coulomb模型、理想弹塑性Mohr-Coulomb模型、应变软化的Mohr-Coulomb模型等多种本构模型，各模型的描述具体见表3.10。

<center>表3.10接触面对应的本构模型</center>

<table>
  	<tr>
		<th>模型名称</th><th>对应字符串</th><th>对应编号</th><th>关联命令及释义</th>
	</tr>
         <td>线弹性模型</td><td>"linear"</td><td>1</td><td>通过blkdyn.SetIMat…系列函数设置材料参数。</td>
	</tr>
         <td>Mohr-Coulomb脆性断裂模型</td><td>"brittleMC"</td><td>2</td><td>通过blkdyn.SetIMat…系列函数设置材料参数。</td>
	</tr>
         <td>Mohr-Coulomb理想弹塑性模型</td><td>"idealMC"</td><td>3</td><td>通过blkdyn. SetIMat…系列函数设置材料参数。通过dyna.Set函数设置" Interface_Soften_Value"，可以设置拉伸极限应变及剪切极限应变；达到拉伸极限应变，抗拉强度为0；达到剪切极限应变，粘聚力为0。通过dyna.Set命令设置"Indep_CharL"作为计算特征应变的特征长度，默认为1.0。</td>
	</tr>
         <td>Mohr-Coulomb应变软化模型</td><td>"SSMC"</td><td>4</td><td>通过blkdyn. SetIMat…系列函数设置材料参数。通过dyna.Set函数设置" Interface_Soften_Value"，可以设置拉伸极限应变及剪切极限应变；达到拉伸极限应变，抗拉强度为0；达到剪切极限应变，粘聚力为0。通过dyna.Set函数设置" If_InterF_Soften_Kn_Kt"，当界面处于软化阶段时，同时软化界面的法向刚度及切向刚度。通过dyna.Set命令设置"Indep_CharL"作为计算特征应变的特征长度，默认为1.0。</td>
	</tr>
         <td>应变强度分布模型</td><td>"SSDM"</td><td>5</td><td>通导入网格前，必须通过dyna.Set函数设置" Config_JSSDM"为1，包含应变强度分布模型的计算功能，开辟相应的内存；通过blkdyn.SeItMat…系列函数设置基础材料参数。通过blkdyn. SetISsdmMatByGroupInterface、blkdyn. SetISsdmMatByCoord设置接触面应变强度分布参数。</td>
	</tr>
         <td>考虑应变率效应的Mohr-Coulomb脆性断裂模型</td><td>"SRBMC"</td><td>6</td><td>通通过blkdyn. SetIMat…系列函数设置材料参数。通过dyna.Set命令设置"Strain_Ratio_Pram"，确定拉伸强度应变率增强系数，及粘聚力应变率增强系数。通过dyna.Set命令设置"Indep_CharL"作为计算特征应变的特征长度，默认为1.0。</td>
	</tr>
         <td>基于单元平均塑性应变的交界面断裂模型</td><td>"EPSFM"</td><td>7</td><td>接触面两侧单元的平均塑性体应变或平均等效塑性剪应变超过设定值，接触面破裂；通过blkdyn.SetIMat…系列函数设置基础材料参数（强度参数不起作用，破裂有单元塑性应变决定）。通过dyna.Set函数设置" Block_Soften_Value"，确定平均塑性体应变极限值及平均剪应变极限值。</td>
	</tr>
         <td>断裂能模型</td><td>"FracE"</td><td>8</td><td>通过blkdyn.SetIMat…系列函数设置基础材料参数。通过blkdyn. SetIFracEnergyByGroupInterface、blkdyn. SetIFracEnergyByCoord、blkdyn.SetIFracEnergyByLine设置拉伸断裂能及剪切断裂能。</td>
	</tr>
         <td>基于单元平均总应变的交界面断裂模型</td><td>"ETSFM"</td><td>9</td><td>接触面两侧单元的平均总应变在接触面上进行投影，获得平均法向应变及平均切向应变，当应变超过设定值，接触面破裂；通过blkdyn.SetIMat…系列函数设置基础材料参数（强度参数不起作用，破裂有单元塑性应变决定）。通过dyna.Set函数设置" Block_Soften_Value"，确定平均法向总应变极限值及平均剪切总应变极限值。</td>
	</tr>
         <td>独立断裂摩擦模型</td><td>"IndiFS"</td><td>10</td><td>当接触面没有破断时，只有抗拉强度及粘聚力起作用，当接触面破断时，只有摩擦角起作用。通过blkdyn. SetIMat…系列函数设置材料参数。</td>
	</tr>
         <td>速率状态摩擦模型</td><td>"RSFM"</td><td>11</td><td>当接触面没有破断时，采用脆性断裂本构；当接触面破断后，采用速度状态摩擦型本构；通过blkdyn. SetIMat…系列函数设置没有破断时的材料参数，通过dyna.Set("IntF_RSFP")设置速度状态摩擦模型特有的参数。</td>
	</tr>
         <td>液压千斤顶模型</td><td>"HydroSupport"</td><td>20</td><td>通过blkdyn.SetIMat…系列函数设置基础材料参数。通过blkdyn. SetIHydroSupportMat设置全局材料参数。通过blkdyn. BindIHydroSupportMatByGroupInterface、blkdyn. BindIHydroSupportMatByLine将全局材料与接触面进行关联。</td>
	</tr>
         <td>自定义接触模型</td><td>"Custom"</td><td>1024</td><td>通过dyna.LoadUDF调入动态链接库。通过dyna. SetUDFValue函数设置用户自定义的全局参数，供自定义本构模型使用。</td>
	</tr>
</table>


（1）可通过设置"If_Kn_Nolinear"考虑接触面法向刚度的非线性，适用于模型编号1-11。

（2）通过设置" Contact_Cal_Quantity"开启接触面法向弹簧的全量法计算模式，适用于模型号1-4，6-11；应变强度分布模型只能用全量法计算，故该设置不起作用。

（3）通过设置"If_ContFrac_Reduced_Mat"确定接触面破裂后是否折减接触面的刚度及摩擦系数，适用于模型编号2-9。

（4）当接触面模型为"RSFM"时，弹簧当前状态下的综合摩擦系数可通过弹簧自定义参量（UserDefSpringValue）的1号分量获取，当前时刻状态量相比于初始时刻的改变量可通过弹簧自定义参量（UserDefSpringValue）的2号分量获取，当前时刻状态量可通过弹簧自定义参量（UserDefSpringValue）的3号分量获取。

（5）当接触模型号大于3时，棱棱接触模型、半弹簧与刚性面接触模型，采用脆性断裂接触模式。

<!--HJS_blkdyn_SetIModel-->

### SetIModel方法

#### 说明

将接触面界面设置为指定模型。

#### 格式定义

包含三种类型的函数表达。

blkdyn.SetIModel(*strModelName*); 

将所有接触面设定为统一的接触模型。

blkdyn.SetIModel(*strModelName, iGroup*); 

将组号为iGroup的单元对应的接触面设定为指定的接触面模型。

blkdyn.SetIModel(*strModelName*, *iGroup*, *jGroup*); 

若交界面一侧的单元组号为*iGroup*，另一侧为*jGroup*，则将此类接触面设定为指定的接触面模型。

#### 参数

*strModelName*：字符串型（或整型），接触面模型类型名，包含"linear"、"brittleMC"、"idealMC"、"SSMC"、"SSDM"、"SRBMC"、"EPSFM"、"FracE"、"ETSFM"、"IndiFS"、"RSFM"、"HydroSupport"、"Custom"等，或对应的整型序号，具体见表3.10。

*iGroup*：交界面一侧单元的组号

*jGroup*：交界面另一侧单元的组号

#### 备注

当输入两个组号（*iGroup*, *jGroup*）时，如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为iGroup及jGroup时施加接触本构。如果*iGroup*及*jGroup*均为0，表示接触对两侧块体相同组号时施加接触本构，如果*iGroup*及*jGroup*均为-1，表示接触对两侧块体不同组号时施加接触本构。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分施加接触本构；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面施加接触本构。

#### 范例

```javascript
//将全部接触面设定为线弹性模型
blkdyn.SetIModel("linear");
//将组1与组2的交界面设定为断裂能模型
blkdyn.SetIModel("FracE",1,2);
//将不同组号间的交界面设定为脆性断裂的Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC",-1, -1);
```

<!--HJS_blkdyn_SetIModelByCoord-->

### SetIModelByCoord方法

#### 说明

根据坐标设置接触面本构模型。如果界面的面心坐标位于控制范围之内，将该弹簧设定为指定模型。

#### 格式定义

blkdyn.SetIModelByCoord(<*strModelName, x0, x1, y0, y1, z0, z1*>);

#### 参数

*strModelName*：字符串型（或整型），接触面模型类型名，包含"linear"、"brittleMC"、"idealMC"、"SSMC"、"SSDM"、"SRBMC"、"EPSFM"、"FracE"、"ETSFM"、"IndiFS"、"RSFM"、"HydroSupport"、"Custom"等，或对应的整型序号，具体见表3.10。

*x0**、**x1：*浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1：*浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1：*浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
//设置模型类型
blkdyn.SetIModelByCoord("linear", -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetIModelByGroup-->

### SetIModelByGroup方法

#### 说明

设置接触面本构模型，通过弹簧所在母块体的组号下限及上限控制。

#### 格式定义

blkdyn.SetIModelByGroup (*strModelName, iGroupLow, iGroupUp*);

#### 参数

*strModelName*：字符串型（或整型），接触面模型类型名，包含"linear"、"brittleMC"、"idealMC"、"SSMC"、"SSDM"、"SRBMC"、"EPSFM"、"FracE"、"ETSFM"、"IndiFS"、"RSFM"、"HydroSupport"、"Custom"等，或对应的整型序号，具体见表3.10。

*iGroupLow*、*iGroupUp*：整型，选择组号范围的上下限。

#### 备注

#### 范例

```javascript
//将接触面所在母块体的组号为3-5的接触面设定为线弹性模型
blkdyn.SetIModelByGroup("linear", 3, 5);
```

<!--HJS_blkdyn_SetIModelByLine-->

### SetIModelByLine方法

#### 说明

如果接触面的面心落在某一线段上，则将该接触面设定为指定的接触本构。

#### 格式定义

blkdyn.SetIModelByLine(<*strModelName, fArrayCoord1, fArrayCoord2, fTolerance*>);

#### 参数

*strModelName*：字符串型（或整型），接触面模型类型名，包含"linear"、"brittleMC"、"idealMC"、"SSMC"、"SSDM"、"SRBMC"、"EPSFM"、"FracE"、"ETSFM"、"IndiFS"、"RSFM"、"HydroSupport"、"Custom"等，或对应的整型序号，具体见表3.10。

*fArrayCoord1*：Array浮点型，包含3个分量，直线上一点坐标（单位：m）。

*fArrayCoord2*：Array浮点型，包含3个分量，直线上另一点坐标（单位：m）。

*fTolerance*：浮点型，容差（单位：m）。

#### 备注

#### 范例

```javascript
///定义线段上的第一个点
var coord1 = new Array(0, 0, 0);
///定义线段上的第二个点
var coord2 = new Array(0, 1, 0);
blkdyn.SetIModelByLine("linear", coord1, coord2, 0.001);
```

<!--HJS_blkdyn_SetIModelByGroupInterface-->

### SetIModelByGroupInterface方法

#### 说明

在两个组的交界面上设置接触面本构模型，如果此弹簧存在目标面，且如果此弹簧所在母块体的组号与目标面所在目标块体的组号满足设定值，将该弹簧的模型设定为指定值。

#### 格式定义

blkdyn.SetIModelByGroupInterface ();

#### 参数

*strModelName*：字符串型（或整型），接触面模型类型名，包含"linear"、"brittleMC"、"idealMC"、"SSMC"、"SSDM"、"SRBMC"、"EPSFM"、"FracE"、"ETSFM"、"IndiFS"、"RSFM"、"HydroSupport"、"Custom"等，或对应的整型序号，具体见表3.10。

*iGroup1*:整型,其中一个块体的组号。

*iGroup2*:整型,其中另一个块体的组号。

#### 备注

当输入两个组号（*iGroup1*, *iGroup2*）时，如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为iGroup及jGroup时施加接触本构。如果*iGroup1*及*iGroup2*均为0，表示接触对两侧块体相同组号时施加接触本构，如果*iGroup1*及*iGroup2*均为-1，表示接触对两侧块体不同组号时施加接触本构。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分施加接触本构；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面施加接触本构。

#### 范例

```javascript
//将组号为2与3的交界面设置为线弹性接触本构模型
blkdyn.SetIModelByGroupInterface("linear", 2,3);
//将不同组号间的交界面设定为线弹性本构模型
blkdyn.SetIModelByGroupInterface("linear", -1,-1);
```

<!--HJS_blkdyn_SetIMat-->

### SetIMat方法

#### 说明

指定接触面上的材料参数。

#### 格式定义

共包含三种函数格式。

blkdyn.SetIMat(*normalstiff, shearstiff, friction, cohesion, tension*);

将所有的接触面赋予指定的材料参数。

blkdyn.SetIMat(*normalstiff, shearstiff, friction, cohesion, tension*, *iGroup*);

将单元的组号为*iGroup*的单元的面赋予指定的材料参数。

blkdyn.SetIMat(*normalstiff, shearstiff, friction, cohesion, tension*, *iGroup*, *jGroup*);

若接触面一侧单元的组号为*iGroup*，另一侧单元的组号为*jGroup*，则将该接触面赋予指定的材料参数。

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*iGroup*：接触面一侧的单元组号

*jGroup*：接触面另一侧的单元组号

#### 备注

当输入两个组号（*iGroup*, *jGroup*）时，如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为iGroup及jGroup时施加接触材料。如果*iGroup*及*jGroup*均为0，表示接触对两侧块体相同组号时施加接触材料，如果*iGroup*及*jGroup*均为-1，表示接触对两侧块体不同组号时施加接触材料。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分的接触施加接触材料；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面接触施加接触材料。

#### 范例

```javascript
blkdyn.SetIMat(1e9, 1e9, 30, 1e6, 1e5);
blkdyn.SetIMat(1e9, 1e9, 30, 1e6, 1e5, 1);
//对组号1与2的单元交界面设置接触面参数
blkdyn.SetIMat(1e9, 1e9, 30, 1e6, 1e5, 1,2);
```

<!--HJS_blkdyn_SetIMatByCoord-->

### SetIMatByCoord方法

#### 说明

如果接触面面心位于坐标控制范围内，将该接触面设定为指定材料参数。

#### 格式定义

blkdyn.SetIMatByCoord (*normalstiff, shearstiff, friction, cohesion, tension, x0, x1, y0, y1, z0, z1*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.SetIMatByCoord(1e9, 1e9, 30, 1e6, 1e5, -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetIMatByPlane-->

### SetIMatByPlane方法

#### 说明

如果接触面面心位于某平面内，则将该接触面设定为指定材料参数。

#### 格式定义

blkdyn.SetIMatByPlane(*normalstiff, shearstiff, friction, cohesion, tension, fArrayOrigin[3], fArrayNormal[3], fTolerance*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*fArrayNormal*：Array浮点型，平面法向3个分量。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

*fTolerance*：浮点型，容差（m）。

#### 备注

#### 范例

```javascript
//平面上的一点
var origin = new Array(1, 1, 1);
//平面法向
var normal = new Array(0, 1, 0);
blkdyn.SetIMatByPlane(1e9, 1e9, 30, 1e6, 1e5, origin, normal, 0.001);
```

<!--HJS_blkdyn_SetIMatByGroupInterface-->

### SetIMatByGroupInterface方法

#### 说明

如果某界面弹簧存在目标面，且如果此弹簧所在目块体的组号与目标面所在块体的组号满足设定值，将该弹簧的材料参数设定为指定值。

#### 格式定义

blkdyn.SetIMatByGroupInterface(*normalstiff, shearstiff, friction, cohesion, tension, iGroup1, iGroup2*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*iGroup1*:整型，其中一个块体的组号。

*iGroup2*:整型，其中另一个块体的组号。

#### 备注

当输入两个组号（*iGroup1*, *iGroup2*）时，如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为*iGroup1*及*iGroup2*时施加接触材料。如果*iGroup1*及*iGroup2*均为0，表示接触对两侧块体相同组号时施加接触材料，如果*iGroup1*及*iGroup2*均为-1，表示接触对两侧块体不同组号时施加接触材料。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分的接触施加接触材料；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面接触施加接触材料。

#### 范例

```javascript
blkdyn.SetIMatByGroupInterface(1e9, 1e9, 30, 1e6, 1e5, 6, 7);
```

<!--HJS_blkdyn_SetIMatByDirection-->

### SetIMatByDirection方法

#### 说明

若某接触面的法向满足设定的法向，则将该接触面设定为指定的材料参数。

#### 格式定义

blkdyn.SetIMatByDirection(*normalstiff, shearstiff, friction, cohesion, tension, fArrayNormal[3]*, *fTol*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*fArrayNormal*：Array浮点型，包含3个分量，单位法向。

*fTol*：单位法向的容差。

#### 备注

如果单位法向容差为0，意味着接触面的法向与*fArrayNormal*完全一致。

#### 范例

```javascript
var normal = new Array(0, 1, 0);
blkdyn.SetIMatByDirection(1e9, 1e9, 30, 1e6, 1e5, normal, 1e-3);
```

<!--HJS_blkdyn_SetIMatByCylinder-->

### SetIMatByCylinder方法

#### 说明

如果接触面的面心落在两个同心圆柱面之内，则将该接触面设定为指定的材料参数。

#### 格式定义

blkdyn.SetIMatByCylinder(*normalstiff*, *shearstiff*, *friction*, *cohesion*, *tension*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*，*fRad2*:浮点型，空心圆柱的内、外径（单位：m）

#### 备注

#### 范例

```javascript
blkdyn.SetIMatByCylinder(1e9, 1e9, 30, 1e6, 1e5, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,0.1, 0.5);
```

<!--HJS_blkdyn_SetIMatByCoordAndDirection-->

### SetIMatByCoordAndDirection方法

#### 说明

若某接触面的面心位于坐标控制范围内，且该面的法向满足设定的法向，则将该接触面设定为指定的材料参数。

#### 格式定义

blkdyn.SetIMatByCoordAndDirection(*normalstiff, shearstiff, friction, cohesion, tension, x0, x1, y0, y1, z0, z1, fArrayNormal[3]*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*fArrayNormal*：Array浮点型，包含3个分量，单位法向。

#### 备注

当接触面的法向与输入的法向之点积的绝对值大于0.999时，默认接触面法向与输入法向一致。

#### 范例

```javascript
var normal = new Array(0, 1, 0);
blkdyn.SetIMatByCoordAndDirection(1e9, 1e9, 30, 1e6, 1e5, -10, 10, -10, 10, -10, 10, normal);
```

<!--HJS_blkdyn_SetIMatByCoordAndPlane-->

### SetIMatByCoordAndPlane方法

#### 说明

当某接触面的面心位于坐标范围内，且该面心位于某平面内时，则将该接触面赋予指定的材料参数。

#### 格式定义

blkdyn.SetIMatByCoordAndPlane(*normalstiff, shearstiff, friction, cohesion, tension, x0, x1, y0, y1, z0, z1, fArrayOrigin[3], fArrayNormal[3], fTolerance*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*fArrayNormal*：Array浮点型，平面法向3个分量。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

*fTolerance*：浮点型，容差（m）。

#### 备注

#### 范例

```javascript
var origin = new Array(1, 1, 1);
var normal = new Array(0, 1, 0);
blkdyn.SetIMatByCoordAndPlane(1e9, 1e9, 30, 1e6, 1e5, -10, 10, -10, 10, -10, 10, origin, normal,14);
```

<!--HJS_blkdyn_SetIMatByGroupAndPlane-->

### SetIMatByGroupAndPlane方法

#### 说明

当某接触面的面心位于某平面内，且该接触面的母块体属于设定组号时，将该接触面赋予指定的材料参数。

#### 格式定义

blkdyn.SetIMatByGroupAndPlane(*normalstiff, shearstiff, friction, cohesion, tension, fArrayOrigin[3], fArrayNormal[3], fTolerance, iGroup*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*fArrayNormal*：Array浮点型，平面法向3个分量。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

*fTolerance*：浮点型，容差（m）。

*iGroup*：整型，组号。

#### 备注

#### 范例

```javascript
var origin = new Array(1, 1, 1);
var normal = new Array(2, 2, 2);
blkdyn.SetIMatByGroupAndPlane(1e9, 1e9, 30, 1e6, 1e5, origin, normal, 0.001, 9);
```

<!--HJS_blkdyn_SetIMatByLine-->

### SetIMatByLine方法

#### 说明

当某接触面的面心位于指定的线段内时，将该接触面赋予指定的材料参数（该函数仅适用于二维）。

#### 格式定义

blkdyn.SetIMatByLine(*normalstiff, shearstiff, friction, cohesion, tension, fArrayCoord1[3], fArrayCoord2[3], fTolerance*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*fArrayCoord1*：Array浮点型，包含3个分量，线段上一点坐标（单位：m）。

*fArrayCoord2*：Array浮点型，包含3个分量，线段上另一点坐标（单位：m）。

*fTolerance*：浮点型，容差（单位：m）。

#### 备注

#### 范例

```javascript
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(0, 1, 0);
blkdyn.SetIMatByLine(1e9, 1e9, 30, 1e6, 1e5, coord1, coord2, 1e-3);
```

<!--HJS_blkdyn_SetIMatByLineFit1-->

### SetIMatByLineFit1方法

#### 说明

如果输入的线段与某单元相交，则将该单元中与该线段的方向最接近的棱所在的接触面赋予指定的材料参数。（仅适用于二维）

#### 格式定义

blkdyn.SetIMatByLineFit1(*normalstiff, shearstiff, friction, cohesion, tension, fArrayCoord1[3], fArrayCoord2[3]*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

fArrayCoord1:Array型，包含3个分量，直线上一点坐标。

fArrayCoord2 :Array型，包含3个分量，直线上另一点坐标。

#### 备注

该函数可用于天然裂隙的形成，不必几何建模时画出裂隙，根据单元的边界寻找较为接近的边作为裂隙。执行该函数所选择的裂隙为一条完整的裂隙，但裂隙的走向与输入的线段存在一定的差异。

#### 范例

```javascript
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(0, 1, 0);
blkdyn.SetIMatByLineFit1(1e9, 1e9, 30, 1e6, 1e5, coord1, coord2);
```

<!--HJS_blkdyn_SetIMatByLineFit2-->

### SetIMatByLineFit2方法

#### 说明

当某单元与输入的线段相交时，将该单元所有的接触面赋予指定的材料参数。（仅适用于二维）

#### 格式定义

blkdyn.SetIMatByLineFit2(*normalstiff, shearstiff, friction, cohesion, tension, fArrayCoord1[3], fArrayCoord2[3]*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*fArrayCoord1*：Array浮点型，包含3个分量，线段上一点坐标（单位：m）。

*fArrayCoord2*：Array浮点型，包含3个分量，线段上另一点坐标（单位：m）。

#### 备注

该函数与blkdyn.SetIMatByLineFit1的用法一致，只是产生的裂缝不太连续，存在多条现象，但适应范围较blkdyn.SetIMatByLineFit1广，且赋予材料参数的弹簧位置与线段位置基本一致。

#### 范例

```javascript
//指定线段某一点的坐标
var coord1 = new Array(0, 0, 0);
//指定线段另一点的坐标
var coord2 = new Array(0, 1, 0);
blkdyn.SetIMatByLineFit2(1e9, 1e9, 30, 1e6, 1e5, coord1, coord2);
```

<!--HJS_blkdyn_SetIMatBySel-->

### SetIMatBySel方法

#### 说明

将Genvi平台当前通道面选择集中的单元面对应的接触设定为指定的接触参数。

#### 格式定义

blkdyn.SetIMatBySel(*oSel, normalstiff, shearstiff, friction, cohesion, tension, fTenF, fSheF*);

#### 参数

*oSel*：类对象，表示通过Genvi平台选择的单元面集

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*cohesion*：浮点型，材料的内聚力（单位：Pa）

*tension*：浮点型，材料的抗拉强度（单位：Pa）

*fTenF*：浮点型，拉伸断裂能（Pa.m）

*fSheF*：浮点型，剪切断裂能（Pa.m）

#### 备注

#### 范例

```javascript
// 通过Genvi平台选择单元面
oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);
//将选中的单元面设置指定材料参数
blkdyn.SetIMatBySel(oSel, 1e9, 1e9, 30, 1e6, 1e5);
```

<!--HJS_blkdyn_SetBoundIMat-->

### SetBoundIMat方法

#### 说明

当接触面为自由面（无目标接触）时，设置接触参数。

#### 格式定义

blkdyn.SetBoundIMat(<*normalstiff, shearstiff, friction [, iGroup [, jGroup] ]>*);

#### 参数

*normalstiff*：浮点型，单位面积上的法向刚度（单位：Pa/m）

*shearstiff*：浮点型，单位面积上的切向刚度（单位：Pa/m）

*friction*：浮点型，材料的摩擦角（单位：度）

*iGroup*：整型，组号i的值

*jGroup*：整型，组号j的值

#### 备注

（1）包含3种使用形式。不包含组号参数，所有自由接触面设置参数；包含一个组号iGroup，若自由接触面的母块体组号为iGroup时，设置接触参数；包含两个组号参数iGroup、jGroup，如自由接触面的组号值位于下限及上限之间，设置接触参数。

（2）自由接触面的抗拉强度及粘聚力自动设置为0。

#### 范例

```javascript
//所有自由接触面设置参数
blkdyn.SetBoundIMat(1e11, 1e11, 15);
//组号为1的自由接触面设置参数
blkdyn.SetBoundIMat(1e11, 1e11, 15, 1);
//组号在3-6之间的自由接触面设置参数
blkdyn.SetBoundIMat(1e11, 1e11, 15, 3, 6);
```

<!--HJS_blkdyn_SetIFracEnergyByGroupInterface-->

### SetIFracEnergyByGroupInterface方法

#### 说明

根据接触面两侧的单元组号设置接触面的断裂能参数。

#### 格式定义

blkdyn.SetIFracEnergyByGroupInterface(<*fTenF, fSheF, iGroup1, iGroup2*>);

#### 参数

*fTenF*：浮点型，拉伸断裂能（Pa.m）

*fSheF*：浮点型，剪切断裂能（Pa.m）

*iGroup1*：整型，其中一个块体的组号。

*iGroup2*：整型，其中另一个块体的组号。

#### 备注

对有接触对的弹簧才起作用。如果*iGroup1*及*iGroup2*均为0，表示接触对两侧块体相同组号时赋值，如果*iGroup1*及*iGroup2*均为-1，表示接触对两侧块体不同组号时赋值。

#### 范例

```javascript
//将组3与组4的交界面的拉伸断裂能设定为100Pa.m，剪切断裂能设为1000Pa.m
blkdyn.SetIFracEnergyByGroupInterface(100,1000, 3, 4);
```

<!--HJS_blkdyn_SetIFracEnergyByCoord-->

### SetIFracEnergyByCoord方法

#### 说明

若某接触面的面心位于坐标范围内，则对该接触面赋予指定的断裂能参数。

#### 格式定义

blkdyn.SetIFracEnergyByCoord(<*fTenF, fSheF, x0, x1, y0, y1, z0, z1*>);

#### 参数

*fTenF*：浮点型，拉伸断裂能（Pa.m）

*fSheF*：浮点型，剪切断裂能（Pa.m）

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.SetIFracEnergyByCoord(100, 2000, -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetIFracEnergyByLine-->

### SetIFracEnergyByLine方法

#### 说明

如果接触面的面心位于某线段的范围内，则将该接触面的断裂能赋予指定的值。

#### 格式定义

blkdyn.SetIFracEnergyByLine(<*fTenF, fSheF, fArrayCoord1[3], fArrayCoord2[3], fTolerance*>);

#### 参数

fTenF：浮点型，拉伸断裂能（Pa.m）

fSheF：浮点型，剪切断裂能（Pa.m）

fArrayCoord1：Array型，包含3个分量，直线上一点坐标（单位：m）。

fArrayCoord2：Array型，包含3个分量，直线上另一点坐标（单位：m）。

fTolerance：浮点型，容差（单位：m）。

#### 备注

#### 范例

```javascript
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(0, 1, 0);
blkdyn.SetIFracEnergyByLine(100, 2000, coord1, coord2, 1e-3);
```

<!--HJS_blkdyn_SetIMatReductionByCoord-->

### SetIMatReductionByCoord方法

#### 说明

如果接触面弹簧的坐标位于指定范围内，则对该弹簧已有的参数进行折减。

#### 格式定义

blkdyn.SetIMatReductionByCoord(*strProperty, fReduceValue, x0, x1, y0, y1, z0, z1*);

#### 参数

strProperty：字符串型，可修改的节理性质包括*"kn"*，*"kt"*，*"friction"*，*"cohesion"*，*"tension"*等。

fReduceValue：浮点型，折减系数

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1**：*浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）该函数必须在已经赋予接触面初始强度时方可进行，可模拟水及其他因素导致的接触面性质的改变。

（2）折减后的值=原始值×折减系数。

（3）内摩擦角按照正切值进行折减。

#### 范例

```javascript
//对坐标控制范围内的接触面的抗拉强度进行折减
blkdyn.SetIMatReductionByCoord(‘tension’, 0.2, -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetIMatReductionByGroupInterface-->

### SetIMatReductionByGroupInterface方法

#### 说明

如果接触面弹簧两侧的组号满足要求，则对该弹簧已有的参数进行折减。

#### 格式定义

blkdyn.SetIMatReductionByGroupInterface (*strProperty, fReduceValue, iGroup, jGroup*);

#### 参数

strProperty：字符串型，可修改的节理性质包括*"kn"*，*"kt"*，*"friction"*，*"cohesion"*，*"tension"*等。

fReduceValue：浮点型，折减系数。

*iGroup, jGroup*：整型，两个组号。

#### 备注

（1）该函数必须在已经赋予接触面初始强度时方可进行，可模拟水及其他因素导致的接触面性质的改变。

（2）折减后的值=原始值×折减系数。

（3）内摩擦角按照正切值进行折减。

（4）如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为*iGroup*及*jGroup*时执行参数折减。如果*iGroup*及*jGroup*均为0，表示接触对两侧块体相同组号时执行参数折减，如果*iGroup*及*jGroup*均为-1，表示接触对两侧块体不同组号时执行参数折减。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分的接触执行参数折减；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面接触执行参数折减。

#### 范例

```javascript
//对坐标控制范围内的接触面的抗拉强度进行折减
blkdyn.SetIMatReductionByCoord(‘tension’, 0.2, -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_RandomizeIMat-->

### RandomizeIMat方法

#### 说明

根据随机比例下限及上限，将所有的接触面进行材料参数的随机（该函数执行前，必须设定基础材料参数）。

#### 格式定义

blkdyn.RandomizeIMat(*strProperty, fValueLow, fValueUp*);

#### 参数

*strProperty*：字符串型，可用于随机的接触面材料参数名称。可以是以下值：法向刚度"kn"、切向刚度"kt"、摩擦系数"friction"、粘聚力"cohesion"、抗拉强度"tension"。

*fValueLow*、*fValueUp*：浮点型，随机比例下限、上限（无单位）。

#### 备注

（1）比例下限、上限的随机模式为均匀分布模式。

（2）最终随机值的取值范围为：基础值×比例下限~基础值×比例上限。

#### 范例

```javascript
//对接触面的粘聚力进行随机，随机比例下限为0.1，上限为10
blkdyn.RandomizeIMat("cohesion", 0.1, 10);
```

<!--HJS_blkdyn_RandomizeIMatByCoord-->

### RandomizeIMatByCoord方法

#### 说明

根据随机比例下限及上限，将坐标范围内的接触面进行材料参数的随机（该函数执行前，必须设定基础材料参数）。

#### 格式定义

blkdyn.RandomizeIMatByCoord(*strProperty, fValueLow, fValueUp, x0, x1, y0, y1, z0, z1*);

#### 参数

*strProperty*：字符串型，可用于随机的接触面材料参数名称。可以是以下值：法向刚度"kn"、切向刚度"kt"、摩擦系数"friction"、粘聚力"cohesion"、抗拉强度"tension"、拉伸断裂能"gft"、剪切断裂能"gfs"。

*fValueLow*、*fValueUp*：浮点型，随机比例下限、上限（无单位）。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）比例下限、上限的随机模式为均匀分布模式。

（2）最终随机值的取值范围为：基础值×比例下限~基础值×比例上限。

#### 范例

```javascript
blkdyn.RandomizeIMatByCoord("cohesion", 0.1,10, -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_AdvRandomizeIMatByGroupInterface-->

### AdvRandomizeIMatByGroupInterface方法

#### 说明

对组号交界面上的接触面材料参数进行高级随机设置。

#### 格式定义

blkdyn.AdvRandomizeIMatByGroupInterface(*strProperty, strDistribution, fParam1, fParam2, iGroup1, iGroup2*);

#### 参数

*strProperty*：字符串型，可用于随机的接触面材料参数名称。可以是以下值：法向刚度"kn"、切向刚度"kt"、摩擦系数"friction"、粘聚力"cohesion"、抗拉强度"tension"、拉伸断裂能"gft"、剪切断裂能"gfs"。

*strDistribution*：字符串型，随机分布的模式，可以是以下值：均匀分布"uniform"、正态分布"normal"、韦伯分布"weibull"。

*fParam1*：浮点型，随机函数的参数1。

*fParam2*：浮点型，随机函数的参数2。

*iGroup1*：整型。其中一个块体的组号。

*iGroup2*：整型。其中另一个块体的组号。

#### 备注

（1）随机分布模式为"uniform"时，*fParam1*及*fParam2*为随机值的下限及上限；

（2）随机分布模式为"normal"时，*fParam1*及*fParam2*为期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

（3）如果分布模式为"weibull"，*fParam1*及*fParam2*分别表示威布尔分布的*k*及*λ*值。

（4）对有接触对的弹簧才起作用。如果*iGroup1*及*iGroup2*均为0，表示接触对两侧块体相同组号时赋值，如果*iGroup1*及*iGroup2*均为-1，表示接触对两侧块体不同组号时赋值。

#### 范例

```javascript
//对组号1与组号2的交界面的粘聚力进行随机，随机模式为均匀分布，下限值为1MPa，上限值为2MPa
blkdyn.AdvRandomizeIMatByGroupInterface("cohesion", "uniform",1e6, 2e6, 1,2);
```

<!--HJS_blkdyn_AdvRandomizeIMatByCoord-->

### AdvRandomizeIMatByCoord方法

#### 说明

对坐标范围内的接触面的材料参数进行高级随机。

#### 格式定义

blkdyn.AdvRandomizeIMatByCoord(*strProperty, strDistribution, fParam1, fParam2, x0, x1, y0, y1, z0, z1*);

#### 参数

*strProperty*：字符串型，可用于随机的接触面材料参数名称。可以是以下值：法向刚度"kn"、切向刚度"kt"、摩擦系数"friction"、粘聚力"cohesion"、抗拉强度"tension"、拉伸断裂能"gft"、剪切断裂能"gfs"。

*strDistribution*：字符串型，随机分布的模式，可以是以下值：均匀分布"uniform"、正态分布"normal"、韦伯分布"weibull"。

*fParam1*：浮点型，随机函数的参数1。

*fParam2*：浮点型，随机函数的参数2。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）随机分布模式为"uniform"时，*fParam1*及*fParam2*为随机值的下限及上限；

（2）随机分布模式为"normal"时，*fParam1*及*fParam2*为期望与标准差；正态分布时，如果产生的随机数小于0，强制等于0。

（3）如果分布模式为"weibull"，*fParam1*及*fParam2*分别表示威布尔分布的*k*及*λ*值。

#### 范例

```javascript
blkdyn.AdvRandomizeIMatByCoord("cohesion", "uniform", 2e6, 4e6,-10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetIStiffByElem-->

### SetIStiffByElem方法

#### 说明

接触面的法向及切向刚度从单元刚度中继承。

#### 格式定义

包含3种输入方式

（1）接触面刚度是1倍单元刚度，所有接触弹簧都设定；

blkdyn.SetIStiffByElem();

（2）接触面刚度可以动态调整，所有接触弹簧都设定；

blkdyn.SetIStiffByElem(<*fCoeff*>);

（3）接触面刚度可以动态调整，指定组号之间进行设定；

blkdyn.SetIStiffByElem(<*fCoeff, iGroup, jGroup* >);

#### 参数

*fCoeff*：浮点型，接触面刚度的系数（一般可取1-100）。

*iGroup, jGroup*：整型，接触面两侧的组号。

#### 备注

当输入两个组号（*iGroup*, *jGroup*）时，如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为iGroup及jGroup时执行继承操作。如果*iGroup*及*jGroup*均为0，表示接触对两侧块体相同组号时执行继承操作，如果*iGroup*及*jGroup*均为-1，表示接触对两侧块体不同组号时执行继承操作。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分的接触执行继承操作；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面执行继承操作。

#### 范例

```javascript
blkdyn.SetIStiffByElem();
blkdyn.SetIStiffByElem(10.0);
blkdyn.SetIStiffByElem(100.0, 1,2);
```

<!--HJS_blkdyn_SetIStrengthByElem-->

### SetIStrengthByElem方法

#### 说明

接触面的粘聚力、内摩擦角及抗拉强度从对应的单元中继承。

#### 格式定义

包含3种输入方式

（1）接触面强度是单元的1倍，所有接触弹簧都设定；

blkdyn. SetIStrengthByElem ();

（2）接触面强度可以动态调整，所有接触弹簧都设定；

blkdyn. SetIStrengthByElem (<*fCoeff*>);

（3）接触面强度可以动态调整，指定组号之间进行设定；

blkdyn. SetIStrengthByElem (<*fCoeff, iGroup, jGroup* >);

#### 参数

*fCoeff*：浮点型，接触面强度的系数。

*iGroup, jGroup*：整型，接触面两侧的组号。

#### 备注

（1）当输入两个组号（*iGroup*, *jGroup*）时，如果两个组号均大于0（有效组号），则当接触面两侧的组号分别为iGroup及jGroup时执行继承操作。如果*iGroup*及*jGroup*均为0，表示接触对两侧块体相同组号时执行继承操作，如果*iGroup*及*jGroup*均为-1，表示接触对两侧块体不同组号时执行继承操作。如果一侧组号大于0（有效组号），另一侧为0，表示对该组号对应单元自由面部分的接触执行继承操作；如果一侧组号大于0（有效组号），另一侧为-1，表示对相应单元的非自由面执行继承操作。

（2）当界面弹簧存在目标面时，本界面弹簧的参数取弹簧母块体及弹簧接触块体参数中的小值；当界面弹簧不存在目标面时，取界面弹簧母块体参数。

#### 范例

```javascript
blkdyn.SetIStrengthByElem();
blkdyn.SetIStrengthByElem(0.5);
blkdyn.SetIStrengthByElem(0.1, 1, 2);
```

<!--HJS_blkdyn_SetISsdmMatByGroupInterface-->

### SetISsdmMatByGroupInterface方法

#### 说明

对组号交界面上的接触面进行应变强度分布模型材料参数的设置。

#### 格式定义

blkdyn.SetISsdmMatByGroupInterface(<*strDistribution, SpLength, MinTenStrain, MaxTenStrain, MinSheStrain, MaxSheStrain, Weibull_m, Weibull_n, iGroup1, iGroup2*>);

#### 参数

*strDistribution*：字符串型，分布函数，包括"uniform"和"weibull"

*SpLength*：浮点型，半弹簧长度（单位：m）

*MinTenStrain*：浮点型，最小拉应变

*MaxTenStrain*：浮点型，最大拉应变

*MinSheStrain*：浮点型，最小剪应变

*MaxSheStrain*：浮点型，最大剪应变

*Weibull_m*、*Weibull_n*：浮点型，韦伯分布m值及n值（m值为形状参数，n值为比例系数）。

*iGroup1*：整型，其中一个块体的组号

*iGroup2*：整型，其中另一个块体的组号

#### 备注

（1）设置应变强度分布模型的参数时，在导入网格前，必须通过dyna.Set函数设置"Config_JSSDM"为1，包含应变强度分布模型的计算功能，开辟相应的内存；该参数在接触面模型为"SSDM"（模型序号为5）时起作用。

（2）如果分布函数为"uniform"，则变量*Weibull_m*及*Weibull_n*不起作用，可以是任何值。

（3）该函数对有接触对的弹簧才起作用。如果*iGroup1*及*iGroup2*均为0，表示接触对两侧块体相同组号时赋值，如果*iGroup1*及*iGroup2*均为-1，表示接触对两侧块体不同组号时赋值。

#### 范例

```javascript
//对组2与组3的交界面设置应变强度分布模型的材料参数。
blkdyn.SetISsdmMatByGroupInterface("uniform", 1e-3, 0.0, 1e-2, 0.0, 5e-2, 0.1,10, 2, 3);
```

<!--HJS_blkdyn_SetISsdmMatByCoord-->

### SetISsdmMatByCoord方法

#### 说明

对坐标范围内的接触面进行应变强度分布模型材料参数设置

#### 格式定义

blkdyn.SetISsdmMatByCoord(<*strDistribution, SpLength, MinTenStrain, MaxTenStrain, MinSheStrain, MaxSheStrain, Weibull_m, Weibull_n, x0, x1, y0, y1, z0, z1*>);

#### 参数

*strDistribution*：字符串型，分布函数，包括"uniform"和"weibull"

*SpLength*：浮点型，半弹簧长度（单位：m）

*MinTenStrain*：浮点型，最小拉应变

*MaxTenStrain*：浮点型，最大拉应变

*MinSheStrain*：浮点型，最小剪应变

*MaxSheStrain*：浮点型，最大剪应变

*Weibull_m*、*Weibull_n*：浮点型，韦伯分布m值及n值。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）设置应变强度分布模型的参数时，在导入网格前，必须通过dyna.Set函数设置"Config_JSSDM"为1，包含应变强度分布模型的计算功能，开辟相应的内存；该参数在接触面模型为"SSDM"（模型序号为5）时起作用。

（2）如果分布函数为"uniform"，则变量*Weibull_m*及*Weibull_n*不起作用，可以是任何值。

#### 范例

```javascript
blkdyn.SetISsdmMatByCoord("uniform", 1e-3, 0.0, 1e-2, 0.0, 5e-2, 0.1,10,-10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetIHydroSupportMat-->

### SetIHydroSupportMat方法

#### 说明

设置液压支柱的全局材料参数。

#### 格式定义

blkdyn.SetIHydroSupportMat(*iNumber, mfK0, mfG0, mfK1, mfK2, mfP1, mfP2, mfP3, mfPreP*);

#### 参数

*iNumber*：整型，全局材料序号（从1开始）

m*f*K0：浮点型，初撑力以前的单位面积法向刚度（单位：Pa/m）

*mfG0*：浮点型，全局切向刚度（单位：Pa/m）

*mfK1*：浮点型，初撑力到额定力间的单位面积法向刚度（单位：Pa/m）

*mfK2*：浮点型，额定力到极限力间的单位面积法向刚度（单位：Pa/m）

*mfP1*：浮点型，支架初撑力（单位：Pa）

*mfP2*：浮点型，支架额定工作阻力（单位：Pa）

*mfP3*：浮点型，安全阀开启阻力（单位：Pa）

*mfPreP*：浮点型，初始预应力，可用于支架初始抬升（单位：Pa）

#### 备注

液压支柱材料参数必须在接触面本构模型为"HydroSupport"时（模型序号20）才起作用。

#### 范例

```javascript
blkdyn.SetIHydroSupportMat(1, 2e11, 2e11, 2.8e8, 5.0e8, 3.3e7, 5.0e7, 6.0e7, 0.0);
```

<!--HJS_blkdyn_BindIHydroSupportMatByGroupInterface-->

### BindIHydroSupportMatByGroupInterface方法

#### 说明

将两个组号交界面对应的接触面与全局液压支柱的材料进行关联。

#### 格式定义

blkdyn.BindIHydroSupportMatByGroupInterface(*iPropNumber, iGroup1, iGroup2*);

#### 参数

*iPropNumber*：整型，液压支柱模型材料序号（从1开始）。

*iGroup1*：整型，选择一组的组号。

*iGroup2*：整型，选择另一组的组号。

#### 备注

该函数对有接触对的弹簧才起作用。如果*iGroup1*及*iGroup2*均为0，表示接触对两侧块体相同组号时赋值，如果*iGroup1*及*iGroup2*均为-1，表示接触对两侧块体不同组号时赋值。

#### 范例

```javascript
//将组2与组3的交接面的液压支柱参数关联到全局材料库中的1号材料参数。
blkdyn.BindIHydroSupportMatByGroupInterface(1, 2, 3);
```

<!--HJS_blkdyn_BindIHydroSupportMatByLine-->

### BindIHydroSupportMatByLine方法

#### 说明

对线段范围内的接触弹簧设置液压支柱材料号（该函数仅适用于二维）。

#### 格式定义

blkdyn.BindIHydroSupportMatByLine(*iPropNumber, fArrayCoord1[3], fArrayCoord2[3], fTolerance*);

#### 参数

*iPropNumber*：整型，液压支柱模型材料序号（从1开始）。

*fArrayCoord1*：Array浮点型，包含3个分量，线段上一点坐标（单位：m）。

*fArrayCoord2*：Array浮点型，包含3个分量，线段上另一点坐标（单位：m）。

*fTolerance*：浮点型，容差（单位：m）。

#### 备注

#### 范例

```javascript
//指定线段上的第一个端点
var coord1 = new Array(0, 0, 0);
//指定线段上的第二个端点
var coord2 = new Array(0, 0, 0);
//将线段上的接触面的液压支架材料号设定为全局材料库中的第5号材料。
blkdyn.BindIHydroSupportMatByLine(5, coord1, coord2, 1e-5);
```

<!--HJS_blkdyn_BC_Set-->

## 一般初边值条件设置

一般初边值条件设置中提供了节点速度的固定及解除，静态节点力、面力及速度边界条件的施加，重力的施加，节点速度、位移、应力及孔隙压力的初始化等，函数列表见表3.11。

<center>表3.11一般初边值条件设置的相关函数</center>

<table>
  	<tr>
		<th> 序号 </th><th>方法</th><th>说明</th>
	</tr>
         <td>1</td><td>FixV</td><td rowspan=8>将设定范围内的节点速度分量固定为某一设定值。</td>
	</tr>
        <td>2</td><td>FixVByCoord</td>
	</tr>
        <td>3</td><td>FixVByCylinder</td>
	</tr>
        <td>4</td><td>FixVByPlane</td>
	</tr>
        <td>5</td><td>FixVByGroupInterface</td>
	</tr>
        <td>6</td><td>FixBoundVByCoord</td>
	</tr>
        <td>7</td><td>FixBySel</td>
	</tr>
        <td>8</td><td>FixVAuto</td>
	</tr>
        <td>9</td><td>FreeV</td><td rowspan=4>解除设定范围内的节点速度约束。</td>
	</tr>
        <td>10</td><td>FreeVByCoord</td>
	</tr>
        <td>11</td></td><td>FreeVByCylinder</td>
	</tr>
        <td>12</td><td>FreeVByPlane</td>
	</tr>
        <td>13</td><td>ApplyGravity</td><td>施加重力。</td>
	</tr>
        <td>14</td><td>ApplyReactForceByCoord</td><td>施加约束反力。</td>
	</tr>
         <td>15</td><td>ApplyConditionByCoord</td><td rowspan=6>设置单元、节点的静态边界条件，包括设置节点速度、节点力及单面面力等。</td>
	</tr>
        <td>16</td><td>ApplyConditionByPlane</td>
	</tr>
        <td>17</td><td>ApplyConditionByCylinder</td>
	</tr>
        <td>18</td><td>ApplyConditionByGroupAndCoord</td>
	</tr>
        <td>19</td><td>ApplyConditionBySphere</td>
	</tr>
        <td>20</td><td>ApplyConditionBySel</td>
	</tr>
         <td>21</td><td>InitConditionByCoord</td><td rowspan=3>设初始化设定范围内的单元（节点）的速度、位移、正应力、剪应力或孔隙压力。</td>
	</tr>
        <td>22</td><td>InitConditionByGroup</td>
	</tr>
        <td>23</td><td>InitConditionBySel</td>
	</tr>
        <td>24</td><td>ApplyRotateCondition</td><td>对设定的单元施加转动条件。</td>
	</tr>
         <td>25</td><td>SetSpringBoundByCoord</td><td rowspan=3>施加弹簧边界条件（包含全局坐标弹簧及局部坐标弹簧两种模式）。</td>
	</tr>
        <td>26</td><td>SetSpringBoundByPlane</td>
	</tr>
        <td>27</td><td>SetSpringBoundBySel</td>
	</tr>
        <td>28</td><td>SetSpringBoundState</td><td>设置弹簧边界的工作状态。</td>
	</tr>
        <td>29</td><td>InitialBlockState</td><td>初始化单元及解除面的塑性指示器（清零）。</td>
	</tr>
        <td>30</td><td>CalElemStiffMatrix</td><td>	计算单元的刚度矩阵（当应力计算模式为有限元或弹簧元时必须执行该函数）。</td>
	</tr>
         <td>31</td><td>ClearStress</td><td rowspan=3>对设定范围内的单元的应力及解除力进行清除。</td>
	</tr>
        <td>32</td><td>ClearStressByGroup</td>
	</tr>
        <td>33</td><td>ClearStressByCylinder</td>
	</tr>
        <td>34</td><td>SetSimpleHyFracPram</td><td>设置简单水力压裂参数。</td>
	</tr>
        <td>35</td><td>SetFluidLevel</td><td>设置液位线的空间位置，便于进行孔隙压力计算。。</td>
	</tr>
    </table>
<!--HJS_blkdyn_FixV-->

### FixV方法

#### 说明

固定某一方向坐标范围内的速度值。

#### 格式定义

blkdyn.FixV(*strDirection*, *fValue*, *RegDir*, *fLow*, *fUp*);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*RegDir*：字符串型，控制方向字符串，可以是以下3种字符串之一："x"、"y"、"z"。

*fLow*、*fUp*：浮点型，对应控制方向的下限值及上限值（单位：m）。

#### 备注

#### 范例

```javascript
///对x=0m的节点进行三个方向的全约束，设定速度为0。
blkdyn.FixV("xyz", 0.0, "x", -0.001, 0.001);
```

<!--HJS_blkdyn_FixVByCoord-->

### FixVByCoord方法

#### 说明

固定坐标范围内的节点速度。

#### 格式定义

blkdyn.FixVByCoord(*strDirection*, *fValue*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.FixVByCoord("x",0.0, 3, 5, 3, 5, -1, 10);
```

<!--HJS_blkdyn_FixVByCylinder-->

### FixVByCylinder方法

#### 说明

对两个圆柱面范围内的节点速度进行固定

#### 格式定义

blkdyn.FixVByCylinder(*strDirection*, *fValue*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.FixVByCylinder("x", 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.2, 0.3);
```

<!--HJS_blkdyn_FixVByPlane-->

### FixVByPlane方法

#### 说明

对某平面内的节点进行速度约束。

#### 格式定义

blkdyn.FixVByPlane(*strDirection*, *fValue*, *fArrayOrigin*[3], *fArrayNormal*[3], *fTolerance*);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*fArrayNormal*：Array浮点型，平面法向，3个分量。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

*fTolerance*：浮点型，容差（m）。

#### 备注

#### 范例

```javascript
//设定坐标原点
var origin = new Array(0, 0, 0);
//设定法向
var normal = new Array(1, 0, 0);
///将平面内节点的x方向速度设定为100m/s
blkdyn.FixVByPlane("x", 100, origin, normal, 1e-3);
```

<!--HJS_blkdyn_FixVByGroupInterface-->

### FixVByGroupInterface方法

#### 说明

对两个组号公共面上的节点施加速度约束。

#### 格式定义

blkdyn.FixVByGroupInterface(*strDirection*,*fValue*, *iGroup1*, *iGroup2*);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*iGroup1*：整型，其中一个块体的组号。

*iGroup2*：整型，其中另一个块体的组号。

#### 备注

*iGroup1*表示被施加约束的块体所在组号，*iGroup2*表示与块体具有公共面的块体的组号；如果*iGroup1*=*iGroup2*，那么组号为*iGroup1*的块体的所有节点均施加约束；如果*iGroup1*>0，*iGroup2*=0，表示组号为*iGroup1*的块体中无公共面的节点施加约束。

#### 范例

```javascript
///若公共面一侧单元的组号为3，另一侧单元的组号为5，则固定该公共面节点的x方向速度为0。
blkdyn.FixVByGroupInterface("x",0.0, 3, 5);
```

<!--HJS_blkdyn_FixBoundVByCoord-->

### FixBoundVByCoord方法

#### 说明

固定坐标范围内单元自由面上的节点速度。

#### 格式定义

blkdyn. FixBoundVByCoord(*strDirection*, *fValue*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

如果单元某面的面心在坐标控制范围之内，且这个面没有邻居面（即为自由面），则将该面上的节点进行约束。

#### 范例

```javascript
blkdyn.FixBoundVByCoord ("x",-0.1, -1e5, 1e5, -1e5, 1e5, -5, 5);
```

<!--HJS_blkdyn_FixVBySel-->

### FixVBySel方法

#### 说明

根据Genvi平台节点、面或单元的选择集施加速度约束。

#### 格式定义

blkdyn. FixVBySel( <*oSel, xFlag, yFlag, zFlag, xValue, yValue, zValue*> );

#### 参数

*oSel*：类对象，表示从Genvi平台选择的节点集。

*xFlag, yFlag, zFlag*：整型，表示3个方向施加速度约束的类型，只能为-1、0、1。1，固定某一方向的速度；-1，解除某一方向的速度约束，并设置该方向的速度初值； 0，不施加约束（保留原有约束状态）。

*xValue, yValue, zValue*：浮点型，三个方向施加的速度值（单位：m/s）。

#### 备注

如果*xFlag, yFlag, zFlag*中的某一标记值为0，表示该方向不施加约束（保留原有约束状态），与之对应的施加值无效。

#### 范例

```javascript
// 通过Genvi平台选择节点
oSel = new SelNodes(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);
//仅对选择集中节点的Y方向进行约束
blkdyn.FixVBySel (oSel, 0, 1, 0, 0.0, 0.0, 0.0);
```

 

<!--HJS_blkdyn_FixVAuto-->

### FixVAuto方法

#### 说明

以Z轴正方向为地面法向，对模型底部及四周进行约束。

#### 格式定义

blkdyn. FixVAuto ( <[*fTol*]> );

#### 参数

*fTol*：浮点型，单元自由面法向与Z轴间的容差（默认1×10<sup>-3</sup>）。

#### 备注

若单元自由面的外法线方向与Z轴负方向一致，约束这些自由面的Z方向；当单元自由面的外法线方向与Z轴垂直，约束该自由面的X及Y方向。

此脚本函数可用于边坡问题、隧道开挖问题边界条件的快速施加。

#### 范例

```javascript
blkdyn. FixVAuto ();
```

<!--HJS_blkdyn_FreeV-->

### FreeV方法

#### 说明

解除坐标范围内的速度约束。

#### 格式定义

blkdyn.FreeV(*strDirection*, *RegDir*, *fLow*, *fUp*);

#### 参数

*strModelName*：字符串型，解除约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*RegDir*：字符串型，控制方向字符串，可以是以下3种字符串之一："x"、"y"、"z"。

*fLow*、*fUp*：浮点型，对应控制方向的下限值及上限值（单位：m）。

#### 备注

#### 范例

```javascript
///对y=0.0的节点进行速度解除。
blkdyn.FreeV("xyz", "y", -0.001, 0.001);
```

<!--HJS_blkdyn_FreeVByCoord-->

### FreeVByCoord方法

#### 说明

解除坐标范围内的速度约束。

#### 格式定义

blkdyn.FreeVByCoord(*strDirection*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*);

#### 参数

*strModelName*：字符串型，解除约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.FreeVByCoord("x", 3, 5, 3, 5, -1, 10);
```

<!--HJS_blkdyn_FreeVByCylinder-->

### FreeVByCylinder方法

#### 说明

解除两个圆柱面范围内的节点速度约束。

#### 格式定义

blkdyn.FreeVByCylinder(*strDirection*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*);

#### 参数

*strModelName*：字符串型，解除约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.FreeVByCylinder("x", 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 5.99, 6.01);
```

<!--HJS_blkdyn_FreeVByPlane-->

### FreeVByPlane方法

#### 说明

解除设定平面内节点的速度约束。

#### 格式定义

blkdyn.FreeVByPlane(*strDirection*, *fArrayOrigin*[3], *fArrayNormal*[3], *fTolerance*);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fArrayNormal*：Array浮点型，平面法向，3个分量。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

*fTolerance*：浮点型，容差（m）。

#### 备注

#### 范例

```javascript
//指定平面上的一点
var origin = new Array(0, 0, 0);
//指定平面法向
var normal = new Array(1.0, 0, 0);
//将平面内x方向的速度约束进行解除。
blkdyn.FreeVByPlane("x", origin, normal, 1e-3);
```

<!--HJS_blkdyn_ApplyGravity-->

### ApplyGravity方法

#### 说明

施加重力，执行此命令实质上是将模型内每个节点的质量与节点加速度分量相乘，得到三个方向的重力。加入流体后，如果想更新各节点质量，直接调用该函数，所有节点质量便更新为饱和质量。

#### 格式定义

blkdyn.ApplyGravity();

#### 参数

无。

#### 备注

当给块体单元赋材料或者修正单元材料时，已经施加了重力；调用本函数后将对所有节点的重力设成零后重新计算一遍重力。

#### 范例

```javascript
blkdyn.ApplyGravity();
```

<!--HJS_blkdyn_ApplyReactForceByCoord-->

### ApplyReactForceByCoord方法

#### 说明

根据坐标范围，施加约束反力。

#### 格式定义

blkdyn. ApplyReactForceByCoord (<*strDirection, x0, x1, y0, y1, z0, z1*>);

#### 参数

*strModelName*：字符串型，所施加的反力方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*x0, x1*：浮点型，X方向坐标的下限及上限值（单位：m）。

*y0, y1*：浮点型，Y方向坐标的下限及上限值（单位：m）。

*z0, z1*：浮点型，Z方向坐标的下限及上限值（单位：m）。

#### 备注

执行该命令后，坐标控制范围内的节点反力将作为外力施加至节点上。

#### 范例

```javascript
blkdyn.ApplyReactForceByCoord("xyz", -0.001, 0.001, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_blkdyn_ApplyConditionByCoord-->

### ApplyConditionByCoord方法

#### 说明

若单元面心（面力控制）或节点坐标（节点速度及节点力控制）位于坐标范围内，则施加相应的静态边界条件。（注：节点力、面载荷都是累加的）

#### 格式定义

blkdyn.ApplyConditionByCoord(*strCondition, fArrayVar[3], fArrayGrad[9], x0, x1, y0, y1, z0, z1, ifNormal*);

#### 参数

*strCondition*：字符串型，施加类型，包括静态速度"velocity"、节点力"force"、面力载荷"face_force"等。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*ifNormal*：布尔型，是否为法向面力施加。

#### 备注

（1）*ifNormal*只有当*strCondition*为"face_force"时起作用，其他施加类型时不起作用。

（2）如果施加类型为"face_force"，且*ifNormal*为真，则*fArrayVar*定义的三个基础值中，只有第三个分量起作用，表示法向面力，且正值表示拉伸，负值表示压缩；此外，如果*ifNormal*为真，*fArrayGrad*对应的9个梯度向中，只有最后三个梯度起作用。

（2）如果施加类型为"face_force"，且*ifNormal*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力，此时*fArrayGrad*的9个分量将全部其作用。

#### 范例

```javascript
//设置施加的三个基础值
var values = new Array(0, -1e6, 0);
//设置9个变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
///若单元面心位于坐标范围内，则施加面力。
blkdyn.ApplyConditionByCoord("face_force", values, gradient, -4, 4, 0.1999, 0.2001, -1, 10, false );
```

<!--HJS_blkdyn_ApplyConditionByPlane-->

### ApplyConditionByPlane方法

#### 说明

当单元面心或节点坐标位于某平面内，则对单元面或节点施加对应静态条件。（注：节点力、面载荷都是累加的）

#### 格式定义

blkdyn.ApplyConditionByPlane(*strCondition, fArrayVar[3], fArrayGrad[9], fArrayNormal[3], fArrayOrigin[3], fTolerance, ifNormal*);

#### 参数

*strCondition*：字符串型，施加类型，包括静态速度"velocity"、节点力"force"、面力载荷"face_force"等。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*fArrayNormal*：Array浮点型，包含3个分量，平面法向。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

*fTolerance*：浮点型，容差（单位：m）。

*ifNormal*：布尔型，是否为法向面力施加。

#### 备注

（1）*ifNormal*只有当*strCondition*为"face_force"时起作用，其他施加类型时不起作用。

（2）如果施加类型为"face_force"，且*ifNormal*为真，则*fArrayVar*定义的三个基础值中，只有第三个分量起作用，表示法向面力，且正值表示拉伸，负值表示压缩；此外，如果*ifNormal*为真，*fArrayGrad*对应的9个梯度向中，只有最后三个梯度起作用。

（2）如果施加类型为"face_force"，且*ifNormal*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力，此时*fArrayGrad*的9个分量将全部其作用。

#### 范例

```javascript
//设定3个基础值
var values = new Array(0, -1e6, 0);
//设置变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//设定平面上一点
var origin = new Array(0, 2, 0);
//设定平面法向
var normal = new Array(1, 1, 1);
//若单元面心位于平面内，在该单元面上施加面力。
blkdyn.ApplyConditionByPlane("face_force", values, gradient, normal, origin, 1e-3, false );
```

<!--HJS_blkdyn_ApplyConditionByCylinder-->

### ApplyConditionByCylinder方法

#### 说明

当单元面心或节点坐标位于两个圆柱面内，则对单元面或节点施加对应静态条件。（注：节点力、面载荷都是累加的）

#### 格式定义

blkdyn.ApplyConditionByCylinder(*strCondition, fArrayVar[3], fArrayGrad[9], x0, y0, z0, x1, y1, z1, fRad1, fRad2, ifNormal*);

#### 参数

*strCondition*：字符串型，施加类型，包括静态速度"velocity"、节点力"force"、面力载荷"face_force"等。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

*ifNormal*：布尔型，是否为法向面力施加。

#### 备注

（1）*ifNormal*只有当*strCondition*为"face_force"时起作用，其他施加类型时不起作用。

（2）如果施加类型为"face_force"，且*ifNormal*为真，则*fArrayVar*定义的三个基础值中，只有第三个分量起作用，表示法向面力，且正值表示拉伸，负值表示压缩；此外，如果*ifNormal*为真，*fArrayGrad*对应的9个梯度向中，只有最后三个梯度起作用。

（2）如果施加类型为"face_force"，且*ifNormal*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力，此时*fArrayGrad*的9个分量将全部其作用。

#### 范例

```javascript
//设定3个基础值
var values = new Array(0, -1e6, 0);
//设定梯度变化
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.ApplyConditionByCylinder("face_force", values, gradient, 0, 1, 0, 0, 0, 0, 0.1, 0.2, false );
```

<!--HJS_blkdyn_ApplyConditionByGroupAndCoord-->

### ApplyConditionByGroupAndCoord方法

#### 说明

若单元面心位于坐标范围内，且单元位于组号范围内，则施加相应的静态边界条件。

#### 格式定义

blkdyn.ApplyConditionByGroupAndCoord(*strCondition, fArrayVar[3], fArrayGrad[9], GroupL, GroupU, x0, x1, y0, y1, z0, z1, ifNormal*);

#### 参数

*strCondition*：字符串型，施加类型，包括静态速度"velocity"、节点力"force"、面力载荷"face_force"等。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*GroupL*、*GroupU*：整型，组号的下限值及上限值。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*ifNormal*：布尔型，是否为法向面力施加。

#### 备注

（1）采用此接口函数，节点速度与节点力为替换模式、面力为累加模式。

（2）*ifNormal*只有当*strCondition*为"face_force"时起作用，其他施加类型时不起作用。

（3）如果施加类型为"face_force"，且*ifNormal*为真，则*fArrayVar*定义的三个基础值中，只有第三个分量起作用，表示法向面力，且正值表示拉伸，负值表示压缩；此外，如果*ifNormal*为真，*fArrayGrad*对应的9个梯度向中，只有最后三个梯度起作用。

（4）如果施加类型为"face_force"，且*ifNormal*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力，此时*fArrayGrad*的9个分量将全部其作用。

#### 范例

```javascript
//设置施加的三个基础值
var values = new Array(0, -1e6, 0);
//设置9个变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
///若单元面心位于坐标范围内，且组号为1-11号之间，则施加面力。
blkdyn.ApplyConditionByGroupAndCoord("face_force", values, gradient,1,11, -4, 4, 0.1999, 0.2001, -1, 10, false );
```

<!--HJS_blkdyn_ApplyConditionBySphere-->

### ApplyConditionBySphere方法

#### 说明

若单元面心位于内、外球半径之间，则施加相应的静态边界条件。

#### 格式定义

blkdyn.ApplyConditionBySphere(*strCondition, fArrayVar[3], fArrayGrad[9], fcx, fcy, fcz, frad1, frad2, ifNormal*);

#### 参数

*strCondition*：字符串型，施加类型，包括静态速度"velocity"、节点力"force"、面力载荷"face_force"等。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*fcx**、**fcy**、**fcz*：浮点型，球心坐标（单位：m）。

*frad1*、*frad2*：浮点型，球的内半径及外半径（单位：m）。

*ifNormal*：布尔型，是否为法向面力施加。

#### 备注

（1）采用此接口函数，节点速度与节点力为替换模式、面力为累加模式。

（2）*ifNormal*只有当*strCondition*为"face_force"时起作用，其他施加类型时不起作用。

（3）如果施加类型为"face_force"，且*ifNormal*为真，则*fArrayVar*定义的三个基础值中，只有第三个分量起作用，表示法向面力，且正值表示拉伸，负值表示压缩；此外，如果*ifNormal*为真，*fArrayGrad*对应的9个梯度向中，只有最后三个梯度起作用。

（4）如果施加类型为"face_force"，且*ifNormal*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力，此时*fArrayGrad*的9个分量将全部其作用。

#### 范例

```javascript
//设置施加的三个基础值
var values = new Array(0, -1e6, 0);
//设置9个变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
///对球心坐标为(0,0,0)，球半径为1m的面施加面力
blkdyn.ApplyConditionBySphere("face_force", values, gradient, 0.0, 0.0, 0.0, 0.99, 1.01 , false );
```

<!--HJS_blkdyn_ApplyConditionBySel-->

### ApplyConditionBySel方法

#### 说明

根据Genvi平台的选择操作，则施加相应的静态边界条件。

#### 格式定义

blkdyn.ApplyConditionBySel(*oSel, strCondition, fArrayVar[3], fArrayGrad[9] ifNormal*);

#### 参数

*oSel*：类对象，表示通过Genvi平台选择的单元自由边界或节点集

*strCondition*：字符串型，施加类型，包括静态速度"velocity"、节点力"force"、面力载荷"face_force"等。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*ifNormal*：布尔型，是否为法向面力施加。

#### 备注

（1）采用此接口函数，节点速度与节点力为替换模式、面力为累加模式。

（2）*ifNormal*只有当*strCondition*为"face_force"时起作用，其他施加类型时不起作用。

（3）如果施加类型为"face_force"，且*ifNormal*为真，则*fArrayVar*定义的三个基础值中，只有第三个分量起作用，表示法向面力，且正值表示拉伸，负值表示压缩；此外，如果*ifNormal*为真，*fArrayGrad*对应的9个梯度向中，只有最后三个梯度起作用。

（4）如果施加类型为"face_force"，且*ifNormal*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力，此时*fArrayGrad*的9个分量将全部其作用。

（5）施加条件的选择通道为Genvi中的当前选择通道（祥见Genvi接口手册）。对于"velocity"和"force"，选择类型为节点（SelNodes）；对于"face_force"，选择类型为单元面（SelElemBounds）。

#### 范例

```javascript
// 通过Genvi平台选择单元面
oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);

//设置施加的三个基础值
var values = new Array(0, -1e6, 0);
//设置9个变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//基于sel的选择施加边界条件
blkdyn.ApplyConditionBySel(oSel, "face_force", values, gradient, false);
```

<!--HJS_blkdyn_InitConditionByCoord-->

### InitConditionByCoord方法

#### 说明

当单元体心坐标或节点坐标位于坐标控制范围之内，初始化速度、位移、正应力、剪应力或孔隙压力等参数。

#### 格式定义

blkdyn.InitConditionByCoord(*strCondition,fArrayVar[3], fArrayGrad[9], x0, x1, y0, y1, z0, z1*);

#### 参数

*strCondition*：字符串型，包括初始化速度"velocity"（三个方向）、位移"displace"（三个方向）、正应力"stress"（三个正应力，sxx、syy、szz），剪应力"tstress"（三个剪应力，sxy，syz，szx），孔隙水压力"fpp"（一个值）。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）对应速度、位移及孔隙压力的初始化，控制范围坐标指的是节点坐标；如果对应力进行初始化，控制范围的坐标指的是单元体心。

（2）在初始化位移时，如果已经开启了大变形，则位移初始化后，软件内部对每个节点的初始坐标进行了更新，将当前坐标定义为初始坐标。

（3）如果为初始化孔隙压力，三个基础值中只有第一个值起作用，9个梯度中也只有前三个梯度起作用。

#### 范例

```javascript
//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_blkdyn_InitConditionByGroup-->

### InitConditionByGroup方法

#### 说明

当单元体心坐标或节点坐标位于坐标控制范围之内，初始化速度、位移、正应力、剪应力或孔隙压力等参数。

#### 格式定义

blkdyn.InitConditionByGroup(*strCondition,fArrayVar[3],fArrayGrad[9], iGroupLow, iGroupUp*);

#### 参数

*strCondition*：字符串型，包括初始化速度"velocity"（三个方向）、位移"displace"（三个方向）、正应力"stress"（三个正应力，sxx、syy、szz），剪应力"tstress"（三个剪应力，sxy，syz，szx），孔隙水压力"fpp"（一个值）。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

*iGroupLow*、*iGroupUp*：整型，组号范围选择的上下限。

#### 备注

（1）对应速度、位移及孔隙压力的初始化，控制范围坐标指的是节点坐标；如果对应力进行初始化，控制范围的坐标指的是单元体心。

（2）在初始化位移时，如果已经开启了大变形，则位移初始化后，软件内部对每个节点的初始坐标进行了更新，将当前坐标定义为初始坐标。

（3）如果为初始化孔隙压力，三个基础值中只有第一个值起作用，9个梯度中也只有前三个梯度起作用。

#### 范例

```javascript
//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("velocity", values, gradient, 1, 3);
```

<!--HJS_blkdyn_InitConditionBySel-->

### InitConditionBySel方法

#### 说明

根据Genvi选择的节点或单元集合，初始化速度、位移、正应力、剪应力或孔隙压力等参数。

#### 格式定义

blkdyn.InitConditionBySel(*oSel, strCondition,fArrayVar[3],fArrayGrad[9]*);

#### 参数

*oSel*：类对象，表示通过Genvi平台选择的单元集或节点集

*strCondition*：字符串型，包括初始化速度"velocity"（三个方向）、位移"displace"（三个方向）、正应力"stress"（三个正应力，sxx、syy、szz），剪应力"tstress"（三个剪应力，sxy，syz，szx），孔隙水压力"fpp"（一个值）。

*fArrayVar*：Array浮点型，表示全局坐标下三个方向分量的基础值。

*fArrayGrad*：Array浮点型，9个分量，表示每个基础值随着x、y、z坐标的变化梯度；前三个对应第一个基础值的变化，中间三个对应第二个基础值的变化，最后三个对应第三个基础值的变化。

#### 备注

（1）对应速度、位移及孔隙压力的初始化，控制范围坐标指的是节点坐标；如果对应力进行初始化，控制范围的坐标指的是单元体心。

（2）在初始化位移时，如果已经开启了大变形，则位移初始化后，软件内部对每个节点的初始坐标进行了更新，将当前坐标定义为初始坐标。

（3）如果为初始化孔隙压力，三个基础值中只有第一个值起作用，9个梯度中也只有前三个梯度起作用。

（4）初始化类型为正应力"stress"或剪应力"tstress"时，通过Genvi的选择类型只能是单元集合（SelElems）；其他初始化类型时，通过Genvi的选择类型为单元集合（SelElems）或节点集合（SelNodes）均可。

#### 范例

```javascript
// 通过Genvi平台选择节点
oSel = new SelNodes(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);

//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
/将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionBySel(oSel, "velocity", values, gradient);
```

<!--HJS_blkdyn_ApplyRotateCondition-->

### ApplyRotateCondition方法

#### 说明

但组号下限与上下范围内的单元施加转动条件。

#### 格式定义

blkdyn.ApplyRotateCondition(*IDNo,fOrigin[3],fNormal[3],RotaVel,AxialVel,GlobVel[3], GroupLow, GroupUp*);

#### 参数

*IDNo*：整型，转动施加序号（从1开始）

*fOrigin*：Array浮点型，包含三个分量，转动原点坐标（单位：m）

*fNormal*：Array浮点型，包含三个分量，转动法向分量

*RotaVel*：浮点型，转动速度（单位：转/秒）

*AxialVel*：浮点型，轴向速度（单位：m/s）

*GlobVel*：Array浮点型，包含三个分量，全局速度（单位：m/s）

*iGroupLow*、*iGroupUp*：整型，组号范围选择的下限、下限

#### 备注

当"If_Rota_Use_Nodal_Coord"开关为1时，*fOrigin*为轴向上第一点坐标，*fNormal*为轴线上第二点坐标，软件内部将根据距离自动搜索与两个坐标最近的节点；在计算转动时，将根据两个节点坐标计算法向。

#### 范例

```javascript
//设定转轴上的一点
var fOrigin=[0,0,0]
//设定转轴法向
var fNormal=[0,1,0]
//设定全局速度
varGlobVel=[3,3,3]
//设定转动条件
blkdyn.ApplyRotateCondition(1, fOrigin,fNormal,3.0,5.0,GlobVel,1,100);
```

<!--HJS_blkdyn_SetSpringBoundByCoord-->

### SetSpringBoundByCoord方法

#### 说明

当单元面的面心在坐标控制范围之内，对该面施加弹簧边界。

#### 格式定义

blkdyn.SetSpringBoundByCoord(<*iType, fk1, fk2, fk3, fx1, fx2, fy1, fy2, fz1, fz2*>);

#### 参数

*iType*：整型，弹簧条件类型，只能为1或2。1表示**局部**坐标系下的弹簧；2表示**全局**坐标系下的弹簧。

*fk1*：浮点型，局部坐标系下，表征切向1单位面积刚度；全局坐标系下，表示X方向单元面积刚度。（单位：Pa/m）

*fk2*：浮点型，局部坐标系下，表征切向2单位面积刚度；全局坐标系下，表示Y方向单元面积刚度。（单位：Pa/m）

*fk3*：浮点型，局部坐标系下，表征法向单位面积刚度；全局坐标系下，表示Z方向单元面积刚度。（单位：Pa/m）

*fx1, fx2*：浮点型，X坐标范围的下限及上限（单位：m）。

*fy1, fy2*：浮点型，Y坐标范围的下限及上限（单位：m）。

*fz1, fz2*：浮点型，Z坐标范围的下限及上限（单位：m）。

#### 备注

只有自由面及没有接触的弹簧面，方面被选中进行施加。

#### 范例

```javascript
//根据坐标范围设定边界条件
blkdyn.SetSpringBoundByCoord (1, 1e10, 0, 0, -0.01, 0.01, -100, 100, -100, 100);
```

<!--HJS_blkdyn_SetSpringBoundByPlane-->

### SetSpringBoundByPlane方法

#### 说明

当单元面的面心位于某平面的容差范围内时，施加弹簧边界条件。

#### 格式定义

blkdyn.SetSpringBoundByPlane(<*iType, fk1, fk2, fk3, fox, foy, foz, fnx, fny, fnz, ftol*>);

#### 参数

*iType*：整型，弹簧条件类型，只能为1或2。1表示**局部**坐标系下的弹簧；2表示**全局**坐标系下的弹簧。

*fk1*：浮点型，局部坐标系下，表征切向1单位面积刚度；全局坐标系下，表示X方向单元面积刚度。（单位：Pa/m）

*fk2*：浮点型，局部坐标系下，表征切向2单位面积刚度；全局坐标系下，表示Y方向单元面积刚度。（单位：Pa/m）

*fk3*：浮点型，局部坐标系下，表征法向单位面积刚度；全局坐标系下，表示Z方向单元面积刚度。（单位：Pa/m）

*fox, foy, foz*：浮点型，平面内一点的坐标（单位：m）。

*fnx, fny, fnz*：浮点型，平面法向量的三个分量（可以不是单位法向量，软件内部自动进行归一化）。

*ftol*：浮点型，容差（单位：m）。

#### 备注

只有自由面及没有接触的弹簧面，方面被选中进行施加。

#### 范例

```javascript
//根据平面设定弹簧边界条件，原点[0,0,0]，法向[1,1,0]，容差0.01
blkdyn.SetSpringBoundByPlane(2, 0, 0, 1e10, 0, 0,0, 1,1,0, 0.01);
```

<!--HJS_blkdyn_SetSpringBoundBySel-->

### SetSpringBoundBySel方法

#### 说明

根据单元面的选择集，施加弹簧边界条件。

#### 格式定义

blkdyn.SetSpringBoundBySel(<*oSel, iType, fk1, fk2, fk3* >);

#### 参数

*oSel*：类对象，表示通过Genvi平台选择的单元自由边界

*iType*：整型，弹簧条件类型，只能为1或2。1表示**局部**坐标系下的弹簧；2表示**全局**坐标系下的弹簧。

*fk1*：浮点型，局部坐标系下，表征切向1单位面积刚度；全局坐标系下，表示X方向单元面积刚度。（单位：Pa/m）

*fk2*：浮点型，局部坐标系下，表征切向2单位面积刚度；全局坐标系下，表示Y方向单元面积刚度。（单位：Pa/m）

*fk3*：浮点型，局部坐标系下，表征法向单位面积刚度；全局坐标系下，表示Z方向单元面积刚度。（单位：Pa/m）

#### 备注

（1）  只有自由面及没有接触的弹簧面，方面被选中进行施加。

#### 范例

```java
// 通过Genvi平台选择单元自由边界
oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);
blkdyn.SetSpringBoundBySel(oSel, 2, 0, 0, 1e10);
```

<!--HJS_blkdyn_SetSpringBoundState-->

### SetSpringBoundState方法

#### 说明

设置弹簧边界条件的工作状态。

#### 格式定义

blkdyn.SetSpringBoundState(<*iState, iIDLow, iIDUp* >);

#### 参数

*iState*：整型，弹簧边界状态，只能为0或1，0表示钝化弹簧边界，1表示激活边界。

*iIDLow, iIDUp*：整型，弹簧边界施加ID号的下限及上限（从1开始）。

#### 备注

弹簧边界的施加ID号从1开始起算，每执行一次弹簧边界的施加操作，ID号增加1。

#### 范例

```javascript
//将弹簧边界施加号为1-2号的边界进行钝化
blkdyn.SetSpringBoundState(0, 1, 2);
```

<!--HJS_blkdyn_InitialBlockState-->

### InitialBlockState方法

#### 说明

清除单元及界面上的塑性指示器。

#### 格式定义

blkdyn.InitialBlockState ();

#### 参数

无。

#### 备注

#### 范例

```javascript
//清除单元及界面上的塑性指示器
blkdyn.InitialBlockState();
```

<!--HJS_blkdyn_CalElemStiffMatrix-->

### CalElemStiffMatrix方法

#### 说明

用于计算每个单元的刚度矩阵（对于四边形、三棱柱及六面体，采用混合离散方式，计算子四面体的刚度阵）。

#### 格式定义

blkdyn.CalElemStiffMatrix ();

#### 参数

无。

#### 备注

当单元计算模型为有限元或弹簧元时，必须执行该函数；且必须在核心求解前执行该函数。

#### 范例

```javascript
//计算每个单元的刚度矩阵
blkdyn.CalElemStiffMatrix();
```

<!--HJS_blkdyn_ClearStress-->

### ClearStress方法

#### 说明

清除所有单元的应力，并清除弹簧力。

#### 格式定义

blkdyn.ClearStress();

#### 参数

无

#### 备注

#### 范例

```javascript
//应力全部清除
blkdyn.ClearStress();
```

<!--HJS_blkdyn_ClearStressByGroup-->

### ClearStressByGroup方法

#### 说明

对某一特定组号的单元进行应力清除，并清除弹簧力。

#### 格式定义

blkdyn.ClearStressByGroup(*igroup*);

#### 参数

*igroup*：整型，单元组号。

#### 备注

#### 范例

```javascript
//将组号为1的单元的应力清除
blkdyn.ClearStressByGroup (1);
```

<!--HJS_blkdyn_ClearStressByCylinder-->

### ClearStressByCylinder方法

#### 说明

若单元的体心位于内外圆柱面确定的范围内，则将该单元的应力及弹簧接触力进行清除。

#### 格式定义

blkdyn. ClearStressByCylinder (*point1*[3], *point2*[3], *fRad1*, *fRad2*);

#### 参数

*point1*：Array浮点型，包含3个分量，圆柱轴向上第一端点坐标；

*point2*：Array浮点型，包含3个分量，圆柱轴向上第二端点坐标；

*fRad1*、*fRad2*：浮点型，内外圆柱面的半径。

#### 备注

#### 范例

```javascript
//指定第一个端点的坐标
var coord1= new Array(0.0, 0.0, 0.0);
//指定第二个端点的坐标
var coord2= new Array(1.0, 0.0, 0.0);
blkdyn.ClearStressByCylinder (coord1, coord2, 1.0, 3.0);
```

<!--HJS_blkdyn_SetSimpleHyFracPram-->

### SetSimpleHyFracPram方法

#### 说明

设置简单水力压裂模式对应的参数。在简单水力压裂模式下，不做渗流应力耦合计算，一旦单元边界出现破裂，立即施加水压力。

#### 格式定义

blkdyn.SetSimpleHyFracPram(*IDNo*, *BoundType*, *fBoundV1*, *fBoundV2*, *fCent*[3], *IfCal*)；

#### 参数

*IDNo*：整型，简单水力压裂参数的需要，从1开始；

*BoundType*：整型，水压加载类型，值只能为1及2。1-压力边界，2-流量边界。

*fBoundV1*：浮点型，如果为压力边界，该值表示注入位置的压力；如果为流量边界，该值表示注入位置的流量。

*fBoundV2*：浮点型，如果为压力边界，该值表示每米压力衰减值；如果为流量边界，该值表示流体的体积模量。

*fCent*：Array浮点型，包含3个分量，水压注入点的坐标（单位：m）。

*IfCal*：布尔型，是否开启本序号对应的简单压裂计算。

#### 备注

（1）简单水力压裂模式，必须在设置了接触面的情况下才起作用。此外，只有当接触面为真实破裂面或为预定义面（参看blkdyn.SetPreIFace……系列函数）时，才施加对应的压力。

（2）在刚开始计算时，由于没有破裂出现，所以必须指定水压注入点附近的单元为真实破裂面（可设置需要定义的破裂面的粘聚力、抗拉强度及内摩擦角为0，这样在拉力或剪力作用下必然会破裂），或通过blkdyn.SetPreIFace系列函数设定为预定义面。

（3）当加载类型为压力加载时，某一位置的压力施加值为                                ，*P*0为注入点压力值，*ξ*为每米压力衰减值（单位：Pa/m），*d*为施加点到注入点的直线距离。

（4）通过函数dyna.Set设置"XYZ_Range"，可将简单水力压裂的作用范围限制在某一坐标范围内。

#### 范例

```javascript
//指定施加点坐标
var fC= new Array(0.0, 0.0, 0.0);
//指定简单水力压裂参数
blkdyn.SetSimpleHyFracPram (1, 1, 1e6, 0.9, fC, true);
```

<!--HJS_blkdyn_SetFluidLevel-->

### SetFluidLevel方法

#### 说明

通过读入流体自由面位置文件的方式设置流体的液位线，液位线以下将按照流体密度及重力加速度自动计算孔隙压力；如果开启渗流计算，则同时将孔隙饱和度设置为1。

#### 格式定义

blkdyn.SetFluidLevel(<*strFileName, fDensity, fGravity, GrpLow, GrpUp*>);

#### 参数

*strFileName*：字符串型，液位线文件名；

*fDensity*：浮点型，流体密度（单位：kg/m<sup>3</sup>>）。

*fGravity*：浮点型，重力加速度值的绝对值（单位：m/s<sup>2</sup>）。

*GrpLow, GrpUp*：整型，组号下限及组号上限。

#### 备注

（1）当单元的组号位于下限及上限之间，进行相应地设置。

（2）二维情况下，默认重力方向为Y轴负方向；三维情况下，默认重力方向为Z轴负方向。

（3）二维流体液位由按照顺序排列的二维液位点坐标（沿X轴正方向或负方向均可）组成的。二维液位文件的第一行为液位点数量，后续若干行为液位坐标（X、Y两个值），具体如图3.2所示。

![](images/GDEM_BlockDyna_3.png)

<center>图3.2 二维液位文件格式</center>

三维流体液位由M行N列的三维格点坐标构成。第一行为网格类型名，必须为" GdemGrid"；第二行有四个整数，分别为X方向节点数，Y方向节点数，X方向节点间距，Y方向节点间距。后续几行为按照顺序排列格点坐标（包含X、Y、Z三个方向），按照（X=1，Y=1）、（X=2，Y=1）、（X=3，Y=1）……、（X=1，Y=2）、（X=2，Y=2）、（X=3，Y=2）……顺序排列。具体如图3.3所示。

![](images/GDEM_BlockDyna_4.png)

<center>图3.3 三维液位文件格式</center>

#### 范例

```javascript
//导入三维水位文件，文件名为"water3D.dat"，密度为1000kg/m3，重力加速度为9.8m/s2，对组号1-11进行设置
blkdyn.SetFluidLevel("water3D.dat", 1000, 9.8, 1,11);
```

<!--HJS_blkdyn_DynaBC_Set-->

## 动态边界条件设置

动态边值条件设置中提供了动态速度、节点力、面力的施加，粘性边界条件施加，自由场边界条件的施加等函数，函数列表见表3.12。

<center>表3.12动态边界条件设置的相关函数</center>

<table>
  	<tr>
		<th>序号</th><th>方法</th><th>说明</th>
	</tr>
         <td>1</td><td>ApplyDynaSinVarByCoord</td><td rowspan=12>对设定范围内的单元面或节点施加设定的动态边界条件。</td>
	</tr>
        <td>2</td><td>ApplyDynaLineVarByCoord</td>
	</tr>
        <td>3</td><td>ApplyDynaVarFromFileByCoord</td>
	</tr>
        <td>4</td><td>ApplyDynaSinVarByCylinder</td>
	</tr>
        <td>5</td><td>ApplyDynaLineVarByCylinder</td>
	</tr>
        <td>6</td><td>ApplyDynaVarFromFileByCylinder</td>
	</tr>
        <td>7</td><td>ApplyDynaSinVarBySel</td>
	</tr>
        <td>8</td><td>ApplyDynaLineVarBySel</td>
	</tr>
        <td>9</td><td>ApplyDynaVarFromFileBySel</td>
	</tr>
        <td>10</td><td>ApplyDynaSinVarByGCD</td>
	</tr>
        <td>11</td><td>ApplyDynaLineVarByGCD</td>
	</tr>
        <td>12</td><td>ApplyDynaVarFromFileByGCD</td>
	</tr>
        <td>13</td><td>SetQuietBoundByCoord</td><td rowspan=4>对设定范围内的单元面施加无反射（静态）边界条件。</td>
	</tr>
        <td>14</td><td>SetQuietBoundByCylinder</td>
	</tr>
        <td>15</td></td><td>SetQuietBoundByPlane</td>
	</tr>
        <td>16</td><td>SetQuietBoundBySel</td>
	</tr>
        <td>17</td><td>SetFreeFieldBound</td><td rowspan=2>施加自由场边界条件。</td>
	</tr>
        <td>18</td><td>SetFreeFieldBound3DColumn</td>
	</tr>
        <td>19</td><td>ApplyShockWaveByCoord</td><td>施加冲击波动态边界条件</td>
	</tr>
</table>

<!--HJS_blkdyn_ApplyDynaSinVarByCoord-->

### ApplyDynaSinVarByCoord方法

#### 说明

当单元面心或节点坐标位于坐标控制范围内，施加正弦函数变化的动态边界条件。

#### 格式定义

blkdyn.ApplyDynaSinVarByCoord(*name,if_set,coeff[3],fKesai,fAmp,fCycle,fIniPhase,fBegTime,fFinTime,x[2],y[2],z[2]*);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fKesai*：浮点型，衰减指数

*fAmp*：浮点型，振幅（单位：m/s或N或Pa）。

*fCycle*：浮点型，周期（单位：s）。

*fIniPhase*：浮点型，初相位

*fBegTime*：浮点型，开始时间（单位：s）。

*fFinTime*：浮点型，结束时间（单位：s）。

*x*[2]、*y*[2]、*z*[2]：浮点型，坐标的下限及上限（单位：m）。

#### 备注

（1）当前时间位于*fBegTime*与*fFinTime*之间时，根据以下公式计算当前载荷值。
$$
{F_i} = {\lambda _i}A{e^{ - \xi wt}}\sin (wt + \phi ),w = \frac{{2\pi }}{T}
$$
其中，*F<sub>i</sub>*为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>*即为每个方向的载荷系数，衰减项$\xi$  、振幅$A$  、周期$T$  、初相位$\phi$  、*t*为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//设定三个方向载荷系数
var coeff=new Array(0.0318,0,0)
//x方向下限及上限
var x= new Array(-0.01,0.01)
//y方向下限及上限
var y= new Array(-1.0,1.0)
//z方向下限及上限
var z= new Array(-1.0,10.0)
//设定动态速度边界
blkdyn.ApplyDynaSinVarByCoord ("velocity",true,coeff,0.0,1.0,0.002,0,0,0.2,x,y,z);
```

<!--HJS_blkdyn_ApplyDynaLineVarByCoord-->

### ApplyDynaLineVarByCoord方法

#### 说明

当单元体心或节点坐标位于坐标控制范围之内，施加线性变化的动态边界条件（线段载荷）。

#### 格式定义

blkdyn.ApplyDynaLineVarByCoord(*name,if_set,coeff[3],fT0,fV0,fT1,fV1,x[2],y[2],z[2]*);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fT0*：浮点型，线段起始时间（单位：s）。

*fV0*：浮点型，线段起始值（单位：m/s或N或Pa）。

*fT1*：浮点型，线段结束时间（单位：s）。

*fV1*：浮点型，线段结束值（单位：m/s或N或Pa）。

*x*[2]、*y*[2]、*z*[2]：浮点型，坐标的下限及上限（单位：m）。

#### 备注

（1）如果当前时间位于*fT0*与*fT1*之间，根据以下公式计算当前载荷值，为
$$
{F_i} = {\lambda _i}\left[ {\frac{{fV1 - fV0}}{{fT1 - fT0}}(t - fT0) + fV0} \right]
$$
其中，*F<sub>i</sub>为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>*即为每个方向的载荷系数，*t*为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//设置三个方向载荷系数
var coeff=new Array(0,0,-1e6)
//x方向下限及上限
var x= new Array(-0.01,0.01)
//y方向下限及上限
var y= new Array(-1.0,1.0)
//z方向下限及上限
var z= new Array(-1.0,10.0)
blkdyn.ApplyDynaLineVarByCoord ("face_force",true,coeff, 0.0, 0.0, 1.0, 2e6 ,x,y,z);
```

<!--HJS_blkdyn_ApplyDynaVarFromFileByCoord-->

### ApplyDynaVarFromFileByCoord方法

#### 说明

当单元体心或节点坐标位于坐标控制范围之内，施加动态边界条件，载荷值从文件中读入。

#### 格式定义

blkdyn.ApplyDynaVarFromFileByCoord(*name,if_set,coeff[3],fname,x[2],y[2],z[2]*);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

fname：字符串型，文本文件名。

*x*[2]、*y*[2]、*z*[2]：浮点型，坐标的下限及上限（单位：m）。

#### 备注

（1）文本文件的格式类型为：第一行为载荷序列个数，第二行开始为载荷施加的时间（单位：s）及施加的值（单位：m/s或N或Pa），中间用空格分开（载荷格式如图3.1）。

![](D:\ZhuXG\4-SVN\1-Project1\Modules\DynaSuite\Docs\images\GDEM_BlockDyna_5.png)

<center>图3.1 外部导入载荷格式</center>

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//指定三个方向的载荷系数
var coeff=new Array(0.0318,0,0)
//x方向下限及上限
var x= new Array(-0.01,0.01)
//y方向下限及上限
var y= new Array(-1.0,1.0)
//z方向下限及上限
var z= new Array(-1.0,10.0)
blkdyn.ApplyDynaVarFromFileByCoord ("velocity", true ,coeff,"el-centro.txt" ,x,y,z);
```

<!--HJS_blkdyn_ApplyDynaSinVarByCylinder-->

### ApplyDynaSinVarByCylinder方法

#### 说明

当单元面心或节点坐标位于两个圆柱面之间时，施加正弦函数变化的动态边界条件。

#### 格式定义

blkdyn.ApplyDynaSin*VarByCylinder(name, if_set, coeff[3], fKesai, fAmp,fCycle, fIniPhase, fBegTime, fFinTime, fEnd1[3],fEnd2[3],fRad1,fRad2*);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fKesai*：浮点型，衰减指数

*fAmp*：浮点型，振幅（单位：m/s或N或Pa）。

*fCycle*：浮点型，周期（单位：s）。

*fIniPhase*：浮点型，初相位

*fBegTime*：浮点型，开始时间（单位：s）。

*fFinTime*：浮点型，结束时间（单位：s）。

*fEnd1**、**fEnd2*：Array浮点型，包含3个分量，圆柱轴线的两个端点坐标（单位：m）。

*fRad1, fRad2*：浮点型，圆柱面的内半径及外半径（单位：m）。

#### 备注

（1）当前时间位于*fBegTime*与*fFinTime*之间时，根据以下公式计算当前载荷值。
$$
{F_i} = {\lambda _i}A{e^{ - \xi wt}}\sin (wt + \phi ),w = \frac{{2\pi }}{T}
$$
其中，*F<sub>i</sub>为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>*即为每个方向的载荷系数，衰减项$\xi$  、振幅$A$  、周期$T$  、初相位$\phi$  、*t*为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//设定三个方向载荷系数
var coeff=new Array(0.0318,0,0)
//定义圆柱端点1的坐标
var end1= new Array(0.0, 0.0, 0.0)
//定义圆柱端点2的坐标
var end2= new Array(1.0, 0.0, 0.0)
//在半径为3m的圆柱面上施加动态速度边界
blkdyn.ApplyDynaSinVarByCylinder ("velocity",true,coeff,0.0, 1.0, 0.002, 0, 0, 0.2, end1, end2, 2.999, 3.001);
```

<!--HJS_blkdyn_ApplyDynaLineVarByCylinder-->

### ApplyDynaLineVarByCylinder方法

#### 说明

当单元体心或节点坐标位于内外圆柱面之内时，施加线性变化的动态边界条件（线段载荷）。

#### 格式定义

blkdyn.ApplyDynaLineVarByCylinder(*name,if_set,coeff[3],fT0,fV0,fT1,fV1, fEnd1[3], fEnd2[3], fRad1, fRad2*);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fT0*：浮点型，线段起始时间（单位：s）。

*fV0*：浮点型，线段起始值（单位：m/s或N或Pa）。

*fT1*：浮点型，线段结束时间（单位：s）。

*fV1*：浮点型，线段结束值（单位：m/s或N或Pa）。

*fEnd1**、**fEnd2*：Array浮点型，包含3个分量，圆柱轴线的两个端点坐标（单位：m）。

*fRad1, fRad2*：浮点型，圆柱面的内半径及外半径（单位：m）。

#### 备注

（1）如果当前时间位于*fT0*与*fT1*之间，根据以下公式计算当前载荷值，为
$$
{F_i} = {\lambda _i}\left[ {\frac{{fV1 - fV0}}{{fT1 - fT0}}(t - fT0) + fV0} \right]
$$
其中，*F<sub>i</sub>为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>*即为每个方向的载荷系数，*t*为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//设定三个方向载荷系数
var coeff=new Array(0.0, 0.0, 1.0)
//定义圆柱端点1的坐标
var end1= new Array(0.0, 0.0, 0.0)
//定义圆柱端点2的坐标
var end2= new Array(1.0, 0.0, 0.0)
//在半径为1m的圆柱面上施加动态法向面力边界
blkdyn.ApplyDynaLineVarByCylinder ("face_force",true,coeff, 0.0, 0.0, 1.0, 2e6 ,end1, end2 0.999, 1.001);
```

<!--HJS_blkdyn_ApplyDynaVarFromFileByCylinder-->

### ApplyDynaVarFromFileByCylinder方法

#### 说明

当单元体心或节点坐标位于内外圆柱之内时，施加动态边界条件，载荷值从文件中读入。

#### 格式定义

blkdyn.ApplyDynaVarFromFileByCylinder(*name,if_set,coeff[3],fname, fEnd1[3], fEnd2[3], fRad1, fRad2*);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

fname：字符串型，文本文件名。

*fEnd1**、**fEnd2*：Array浮点型，包含3个分量，圆柱轴线的两个端点坐标（单位：m）。

*fRad1, fRad2*：浮点型，圆柱面的内半径及外半径（单位：m）。

#### 备注

（1）文本文件的格式类型为：第一行为载荷序列个数，第二行开始为载荷施加的时间（单位：s）及施加的值（单位：m/s或N或Pa），中间用空格分开（载荷格式如图3.1）。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//设定三个方向载荷系数
var coeff=new Array(0.0, 0.0, 1.0)
//定义圆柱端点1的坐标
var end1= new Array(0.0, 0.0, 0.0)
//定义圆柱端点2的坐标
var end2= new Array(1.0, 0.0, 0.0)
//在半径为1m的圆柱面上施加动态法向面力边界
blkdyn.ApplyDynaVarFromFileByCylinder("face_force", true ,coeff, "el-centro.txt" ,end1, end2, 0.999, 1.001);
```

<!--HJS_blkdyn_ApplyDynaSinVarBySel-->

### ApplyDynaSinVarBySel方法

#### 说明

借助Genvi的选择操作，施加正弦函数变化的动态边界条件。

#### 格式定义

blkdyn.ApplyDynaSinVarBySel*(oSel, name, if_set, coeff[3], fKesai, fAmp,fCycle, fIniPhase, fBegTime, fFinTime*);

#### 参数

*oSel*：选择类，通过Genvi平台选择的节点集或单元面集

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fKesai*：浮点型，衰减指数

*fAmp*：浮点型，振幅（单位：m/s或N或Pa）。

*fCycle*：浮点型，周期（单位：s）。

*fIniPhase*：浮点型，初相位

*fBegTime*：浮点型，开始时间（单位：s）。

*fFinTime*：浮点型，结束时间（单位：s）。

#### 备注

（1）当前时间位于*fBegTime*与*fFinTime*之间时，根据以下公式计算当前载荷值。
$$
{F_i} = {\lambda _i}A{e^{ - \xi wt}}\sin (wt + \phi ),w = \frac{{2\pi }}{T}
$$
其中，*F<sub>i</sub>*为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>即为每个方向的载荷系数，衰减项$\xi$  、振幅$A$  、周期$T$  、初相位$\phi$  、*t*为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

（4）施加条件的选择通道为Genvi中的当前选择通道（祥见Genvi接口手册）。对于"velocity"和"force"，选择类型为节点（SelNodes）；对于"face_force"，选择类型为单元面（SelElemBounds）。

#### 范例

```javascript
// 通过Genvi平台选择节点
oSel = new SelNodes(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);

//设定三个方向载荷系数
var coeff=new Array(0.0318,0,0)
//根据sel的结果施加动态速度边界
blkdyn.ApplyDynaSinVarBySel (oSel, "velocity",true,coeff,0.0, 1.0, 0.002, 0, 0, 0.2);
```

<!--HJS_blkdyn_ApplyDynaLineVarBySel-->

### ApplyDynaLineVarBySel方法

#### 说明

借助Genvi的选择操作，施加线性变化的动态边界条件（线段载荷）。

#### 格式定义

blkdyn.ApplyDynaLineVarBySel(*oSel,name,if_set,coeff[3],fT0,fV0,fT1,fV1*);

#### 参数

*oSel*：选择类，通过Genvi平台选择的节点集或单元面集

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fT0*：浮点型，线段起始时间（单位：s）。

*fV0*：浮点型，线段起始值（单位：m/s或N或Pa）。

*fT1*：浮点型，线段结束时间（单位：s）。

*fV1*：浮点型，线段结束值（单位：m/s或N或Pa）。

#### 备注

（1）如果当前时间位于*fT0*与*fT1*之间，根据以下公式计算当前载荷值，为
$$
{F_i} = {\lambda _i}\left[ {\frac{{fV1 - fV0}}{{fT1 - fT0}}(t - fT0) + fV0} \right]
$$
其中，*F<sub>i</sub>为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>*即为每个方向的载荷系数，*t*为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

（4）施加条件的选择通道为Genvi中的当前选择通道（祥见Genvi接口手册）。对于"velocity"和"force"，选择类型为节点（SelNode）；对于"face_force"，选择类型为面（SelElemBounds）。

#### 范例

```javascript
// 通过Genvi平台选择单元面
oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);

//设定三个方向载荷系数
var coeff=new Array(0.0, 0.0, 1.0)
//根据sel的结果施加动态面力边界
blkdyn.ApplyDynaLineVarBySel (oSel, "face_force",true,coeff, 0.0, 0.0, 1.0, 2e6);
```

<!--HJS_blkdyn_ApplyDynaVarFromFileBySel-->

### ApplyDynaVarFromFileBySel方法

#### 说明

借助Genvi的选择操作，施加动态边界条件，载荷值从文件中读入。

#### 格式定义

blkdyn.ApplyDynaVarFromFileBySel(*oSel,name,if_set,coeff[3],fname*);

#### 参数

*oSel*：选择类，通过Genvi平台选择的节点集或单元面集

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

fname：字符串型，文本文件名。

#### 备注

（1）文本文件的格式类型为：第一行为载荷序列个数，第二行开始为载荷施加的时间（单位：s）及施加的值（单位：m/s或N或Pa），中间用空格分开（载荷格式如图3.1）。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

（4）施加条件的选择通道为Genvi中的当前选择通道（祥见Genvi接口手册）。对于"velocity"和"force"，选择类型只能为节点（SelNodes）；对于"face_force"，选择类型只能为面（SelElemBounds）。

#### 范例

```javascript
// 通过Genvi平台选择节点
oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.box(-0.1,-0.1,-0.1,10.1,10.1,10.1);

//设定三个方向载荷系数
var coeff=new Array(0.0, 0.0, 1.0)
//根据sel的结果施加动态面力边界
blkdyn.ApplyDynaVarFromFileBySel(oSel, "face_force", true ,coeff, "el-centro.txt");
```

<!--HJS_blkdyn_ApplyDynaSinVarByGCD-->

### ApplyDynaSinVarByGCD方法

#### 说明

根据组号、坐标及法向联合选择单元节点，施加正弦函数变化的动态边界条件。

#### 格式定义

blkdyn.ApplyDynaSinVarByGCD(<*name,if_set,coeff[3],fKesai,fAmp,fCycle,fIniPhase,fBegTime,fFinTime, nGrp[2], fCoord[6], fDir[5]*>);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fKesai*：浮点型，衰减指数

*fAmp*：浮点型，振幅（单位：m/s或N或Pa）。

*fCycle*：浮点型，周期（单位：s）。

*fIniPhase*：浮点型，初相位

*fBegTime*：浮点型，开始时间（单位：s）。

*fFinTime*：浮点型，结束时间（单位：s）。

*nGrp[2]*：整型数组，含2个元素，分别为组号下限及上限。

*fCoord[6]*：浮点型数组，含6个元素，表示坐标范围，依次为X方向坐标下限、X方向坐标上限、Y方向坐标下限、Y方向坐标上限、Z方向坐标下限、Z方向坐标上限。

*fDir[5]*：浮点型数组，含5个元素，表示所选择的法向，第1个元素为是否考虑法向选择，只能为0或1，0表示不考虑法向选择（全部法向皆可选），1表示考虑法向选择；第2-4个元素为单位法向量；第5个元素为容差（在0.0-1.0之间，0.0表示面法向与输入法向完全一致时选择，1.0表示只要点积大于等于0即可选择）。

#### 备注

（1）当前时间位于*fBegTime*与*fFinTime*之间时，根据以下公式计算当前载荷值。
$$
{F_i} = {\lambda _i}A{e^{ - \xi wt}}\sin (wt + \phi ),w = \frac{{2\pi }}{T}
$$
其中，*F<sub>i</sub>为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>*即为每个方向的载荷系数，衰减项$\xi$  、振幅$A$  、周期$T$  、初相位$\phi$  、*t为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//对设定范围内的节点施加动态速度
blkdyn.ApplyDynaSinVarByGCD("velocity", false, [1, 0,0], 0.0, 100, 0.005, 0, 0, 0.0025, [1,3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);
```

<!--HJS_blkdyn_ApplyDynaLineVarByGCD-->

### ApplyDynaLineVarByGCD方法

#### 说明

根据组号、坐标及法向联合选择单元节点，施加线性变化的动态边界条件（线段载荷）。

#### 格式定义

blkdyn.ApplyDynaLineVarByCoord(*name,if_set,coeff[3],fT0,fV0,fT1,fV1, nGrp[2], fCoord[6], fDir[5]*);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

*fT0*：浮点型，线段起始时间（单位：s）。

*fV0*：浮点型，线段起始值（单位：m/s或N或Pa）。

*fT1*：浮点型，线段结束时间（单位：s）。

*fV1*：浮点型，线段结束值（单位：m/s或N或Pa）。

*nGrp[2]*：整型数组，含2个元素，分别为组号下限及上限。

*fCoord[6]*：浮点型数组，含6个元素，表示坐标范围，依次为X方向坐标下限、X方向坐标上限、Y方向坐标下限、Y方向坐标上限、Z方向坐标下限、Z方向坐标上限。

*fDir[5]*：浮点型数组，含5个元素，表示所选择的法向，第1个元素为是否考虑法向选择，只能为0或1，0表示不考虑法向选择（全部法向皆可选），1表示考虑法向选择；第2-4个元素为单位法向量；第5个元素为容差（在0.0-1.0之间，0.0表示面法向与输入法向完全一致时选择，1.0表示只要点积大于等于0即可选择）。

#### 备注

（1）如果当前时间位于*fT0*与*fT1*之间，根据以下公式计算当前载荷值，为
$$
{F_i} = {\lambda _i}\left[ {\frac{{fV1 - fV0}}{{fT1 - fT0}}(t - fT0) + fV0} \right]
$$
其中，*F<sub>i</sub>为第*i*个方向的载荷值（速度、节点力或面力），*λ<sub>i</sub>*即为每个方向的载荷系数，*t*为当前时间。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//施加动态速度载荷
blkdyn.ApplyDynaLineVarByGCD("velocity", false, [1, 0,0], 0, 0, 2e-3, 100, [1,3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);
```

<!--HJS_blkdyn_ApplyDynaVarFromFileByGCD-->

### ApplyDynaVarFromFileByGCD方法

#### 说明

根据组号、坐标及法向联合选择单元节点，施加动态边界条件，载荷值从文件中读入。

#### 格式定义

blkdyn.ApplyDynaVarFromFileByGCD(<*name,if_set,coeff[3],fname,nGrp[2], fCoord[6], fDir[5]*>);

#### 参数

*name*：字符串型，施加类型，包含三种形式："velocity"、"force"、"face_force"

*if_set*：布尔型，设置方式。对于"velocity"，如果为true，表示基础值为0时约束该方向速度。对于"face_force"，如果为true，表示采用局部坐标系。

*coeff*：浮点型，三个方向的载荷系数（*λ<sub>i</sub>*）。

fname：字符串型，文本文件名。

*nGrp[2]*：整型数组，含2个元素，分别为组号下限及上限。

*fCoord[6]*：浮点型数组，含6个元素，表示坐标范围，依次为X方向坐标下限、X方向坐标上限、Y方向坐标下限、Y方向坐标上限、Z方向坐标下限、Z方向坐标上限。

*fDir[5]*：浮点型数组，含5个元素，表示所选择的法向，第1个元素为是否考虑法向选择，只能为0或1，0表示不考虑法向选择（全部法向皆可选），1表示考虑法向选择；第2-4个元素为单位法向量；第5个元素为容差（在0.0-1.0之间，0.0表示面法向与输入法向完全一致时选择，1.0表示只要点积大于等于0即可选择）。

#### 备注

（1）文本文件的格式类型为：第一行为载荷序列个数，第二行开始为载荷施加的时间（单位：s）及施加的值（单位：m/s或N或Pa），中间用空格分开（载荷格式如图3.1）。

（2）如果施加类型为"face_force"，且*if_set*为真，则*coeff*定义的三个载荷系数中，只有第三个分量起作用，表示法向面力系数，且正值表示拉伸，负值表示压缩。

（3）如果施加类型为"face_force"，且*if_set*为真，可通过dyna.Set函数设置" If_Local_Apply"（是否开启局部坐标施加，第一个切向分量），将两个切向也施加上切向面力。

#### 范例

```javascript
//根据文件数据施加动态面力载荷
blkdyn.ApplyDynaVarFromFileByGCD("face_force", false, [5e6, 0,0] , "temp.txt", [1,3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);
```

<!--HJS_blkdyn_SetQuietBoundByCoord-->

### SetQuietBoundByCoord方法

#### 说明

当单元体心坐标位于坐标控制范围之内，施加无反射边界（静态边界）。

#### 格式定义

blkdyn. SetQuietBoundByCoord (*x1*,*x2*,*y1*,*y2*,*z1*,*z2*);

#### 参数

*x1*，*x2*，*y1*，*y2*，*z1*，*z2*：浮点型，坐标的下限及上限（单位：m）。

#### 备注

无反射主要是为了在动态计算中消除人工边界引起的虚假反射而设置的粘性边界条件，施加的位置为块体单元的边界面。

#### 范例

```javascript
//无反射边界
blkdyn. SetQuietBoundByCoord (-10,10, -10,10, -10,10);
```

<!--HJS_blkdyn_SetQuietBoundByCylinder-->

### SetQuietBoundByCylinder方法

#### 说明

当单元某面的面心位于某一空心圆柱内时，施加无反射边界条件（静态边界）。

#### 格式定义

blkdyn. SetQuietBoundByCylinder (*point1*[3],*point2*[3],*fRad1*,*fRad2*);

#### 参数

*point1**、**point2*：Array浮点型，包含3个分量，圆柱轴线的两个端点坐标（单位：m）。

*fRad1, fRad2*：浮点型，圆柱面的内半径及外半径（单位：m）。

#### 备注

无反射主要是为了在动态计算中消除人工边界引起的虚假反射而设置的粘性边界条件，施加的位置为块体单元的边界面。

#### 范例

```javascript
//定义圆柱端点1的坐标
var end1= new Array(0.0, 0.0, 0.0)
//定义圆柱端点2的坐标
var end2= new Array(1.0, 0.0, 0.0)
//在半径为10m的圆柱面上施加无反射边界
blkdyn.SetQuietBoundByCylinder (end1, end2, 9.999, 10.001);
```

<!--HJS_blkdyn_SetQuietBoundByPlane-->

### SetQuietBoundByPlane方法

#### 说明

当单元某面面心的坐标到设定面的距离小于容差限定值时，施加无反射边界条件。

#### 格式定义

blkdyn. SetQuietBoundByPlane (*n[3],origin[3],tol*);

#### 参数

*n*：Array浮点型，包含3个分量，平面法向3个分量。

*origin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

*tol*：浮点型，容差（单位：m）。

#### 备注

无反射主要是为了在动态计算中消除人工边界引起的虚假反射而设置的粘性边界条件，施加的位置为块体单元的边界面。

#### 范例

```javascript
//设置平面法向
var n= new Array(0.0,1.0,0.0)
//设置平面上一点
var origin= new Array(-1.0,1.0,1.0)
blkdyn.SetQuietBoundByPlane (n,origin, 1e-3);
```

<!--HJS_blkdyn_SetQuietBoundBySel-->

### SetQuietBoundBySel方法

#### 说明

根据Genvi的面选择集中的面单元施加无反射边界。

#### 格式定义

blkdyn. SetQuietBoundBySel (*oSel*);

#### 参数

（1）无反射主要是为了在动态计算中消除人工边界引起的虚假反射而设置的粘性边界条件，施加的位置为块体单元的边界面。

（2）仅适用于Genvi中的面选择集。

#### 备注

（1）无反射主要是为了在动态计算中消除人工边界引起的虚假反射而设置的粘性边界条件，施加的位置为块体单元的边界面。

（2）仅适用于Genvi中的面选择集。

#### 范例

```javascript
//借助Genvi平台选择blkdyn对象的单元面集
var oSel = new SelElemBounds(vMesh["Dyna_BlkDyn"]);
oSel.sphere(0,0,0,9.99,10.01);
//根据当前面集中的面单元施加无反射
blkdyn.SetQuietBoundBySel(oSel);
```

<!--HJS_blkdyn_SetFreeFieldBound-->

### SetFreeFieldBound方法

#### 说明

施加二维自由场边界条件及三维Plane自由场边界条件（三维时还需要施加Column自由场条件，方可对反射波进行全面吸收）。

#### 格式定义

blkdyn. SetFreeFieldBound (s*trDirName, fLow, fUp*);

#### 参数

s*trDirName*：字符串型，自由场施加方向，从以下三个字符串中选取，"x"、"y"，"z"。

*fLow**、**fUp*：浮点型，设定方向的范围控制（单位：m）。

#### 备注

自由场也是为了消除人工边界的影响，它的适用范围较无反射条件（静态条件）的范围广。施加自由场后，将在施加的一侧向外产生一排自由场单元，用于吸收虚假振动。三维自由场单元还应该包括Column自由场单元。进行三维问题的无反射计算，必须同时包含Plane及Column两种自由场单元，且Column单元的施加应在Plane单元的后面。

#### 范例

```javascript
//对x=0m的面施加自由场边界
blkdyn.SetFreeFieldBound ("x", -0.001, 0.001);
```

<!--HJS_blkdyn_SetFreeFieldBound3DColumn-->

### SetFreeFieldBound3DColumn方法

#### 说明

施加三维Column自由场单元，此单元的施加必须在三维Plane自由场单元施加完毕后进行，软件会根据Plane自由场单元的位置，在两个相互垂直的Plane自由场交界处产生一排Column自由场单元。

#### 格式定义

blkdyn. SetFreeFieldBound3DColumn();

#### 参数

无。

#### 备注

#### 范例

```javascript
//三维情况下施加Column自由场单元
blkdyn.SetFreeFieldBound3DColumn ();
```

<!--HJS_blkdyn_ApplyShockWaveByCoord-->

### ApplyShockWaveByCoord方法

#### 说明

根据坐标施加冲击波动态边界条件。当单元面心位于设定的坐标范围内，且单元面迎着炸药方向，施加冲击波载荷。

#### 格式定义

blkdyn.ApplyShockWaveByCoord<*fTNTMass, afPos[3], fDetoTime, fSoundVel, fExpIndex, fx1, fx2, fy1, fy2, fz1, fz2*>);

#### 参数

*fTNTMass*，浮点型，等效TNT质量（单位：kg）。

*afPos*，Array浮点型，包含3个坐标分量，炸药爆炸点的空间坐标（单位：m）。

*fDetoTime*，浮点型，炸药起爆时间（单位：s）。

*fSoundVel*，浮点型，空气声速（单位：m/s）。

*fExpIndex*，浮点型，空气冲击波衰减指数（无单位）。

*fx1, fx2*，浮点型，X方向坐标下限及上限（单位：m）。

*fy1, fy2*，浮点型，Y方向坐标下限及上限（单位：m）。

*fz1, fz2*，浮点型，Z方向坐标下限及上限（单位：m）。

#### 备注

块体模块将根据冲击波计算经验公式，计算出不同作用点的冲击波到达时间、上升沿持续时间、峰值压力、下降沿持续时间等，并以动态面载荷的形式施加于自由单元的表面。

#### 范例

```javascript
//设置空气冲击波参数
blkdyn.ApplyShockWaveByCoord(100.0, [5, 2, 3], 0, 340, 1.0, 0.299, 9.701, -1,3.81, 0.299, 5.701);
```

<!--HJS_blkdyn_Damp_Set-->

## 阻尼设置

阻尼设置中，包含了局部阻尼的设置及瑞利阻尼的设置两个方面，具体接口函数见表3.13。

<center>表3.13 阻尼设置的相关函数</center>

<table>
  	<tr>
		<th>序号</th><th>方法</th><th>说明</th>
	</tr>
         <td>1</td><td>SetLocalDamp</td><td rowspan=3>设置局部阻尼</td>
	</tr>
        <td>2</td><td>SetLocalDampByCoord</td>
	</tr>
        <td>3</td><td>SetLocalDampByGroup</td>
	</tr>
        <td>4</td><td>SetRayleighDamp</td><td rowspan=3>设置瑞利阻尼</td>
	</tr>
        <td>5</td><td>SetRayleighDampByCoord</td>
	</tr>
        <td>6</td><td>SetRayleighDampByGroup</td>
	</tr>
</table>


（1）局部阻尼主要用于静态或准静态计算中，模型能量的快速耗散，一般可取0.8，如果利用局部阻尼研究真实动态问题，其与临界阻尼比的关系为$\xi  = \pi {\lambda _L}$，$%
\xi $为临界阻尼比，$
{\lambda _L}$为局部阻尼系数。

（2）瑞利阻尼主要用于真实动态问题中模型能量的耗时；刚度阻尼为变形阻尼（单元内各节点间的速度差异越大，阻尼越大），刚度阻尼对高频振动的耗散有较大作用；质量阻尼为环境阻尼（阻尼大小与节点速度呈正比）。

<!--HJS_blkdyn_SetLocalDamp-->

### SetLocalDamp方法

#### 说明

将数值模型的局部阻尼设定为一个统一的值。

#### 格式定义

blkdyn.SetLocalDamp(*value*);

#### 参数

Value：浮点型，局部阻尼值

#### 备注

#### 范例

```javascript
blkdyn.SetLocalDamp(0.8);
```

<!--HJS_blkdyn_SetLocalDampByCoord-->

### SetLocalDampByCoord方法

#### 说明

如果块体单元的节点坐标位于控制范围之内，将该节点的局部阻尼设定特定的值。

#### 格式定义

blkdyn.SetLocalDampByCoord(*value, x0, x1, y0, y1, z0, z1*);

#### 参数

*Value*：浮点型。局部阻尼值。

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
blkdyn.SetLocalDampByCoord(0.8, -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetLocalDampByGroup-->

### SetLocalDampByGroup方法

#### 说明

当单元组号位于组号的下限与上限之间时，将数值模型的局部阻尼设定为一个统一的值。

#### 格式定义

blkdyn.SetLocalDampByGroup(*value, iGroupLow, iGroupUp*);

#### 参数

*Value*：浮点型，局部阻尼值。

*iGroupLow*、*iGroupUp*：整型，选择组号范围的上下限。

#### 备注

#### 范例

```javascript
blkdyn.SetLocalDampByGroup(0.8, 2, 3);
```

<!--HJS_blkdyn_SetRayleighDamp-->

### SetRayleighDamp方法

#### 说明

将数值模型中所有块体的刚度阻尼系数及质量阻尼系数设定为统一值。

#### 格式定义

blkdyn.SetRayleighDamp(*damp_k, damp_m*);

#### 参数

*damp_k*：浮点型，刚度阻尼系数。

*damp_m*：浮点型，质量阻尼系数。

#### 备注

通过函数dyna.Set设置"If_Cal_Rayleigh"，打开或关闭瑞利阻尼计算。

通过函数dyna.Set将"RDamp_Input_Option"设置为2，可将输入方式改为临界阻尼比及显著频率模式，此时*damp_k*代表临界阻尼比，*damp_m*代表显著频率。

#### 范例

```javascript
blkdyn.SetRayleighDamp(1e-4, 10);
```

<!--HJS_blkdyn_SetRayleighDampByCoord-->

### SetRayleighDampByCoord方法

#### 说明

如果块体单元体心坐标位于控制范围之内，将该块体的刚度阻尼系数及质量阻尼系数设定为确定值。

#### 格式定义

blkdyn.SetRayleighDampByCoord(*damp_k, damp_m , x0, x1, y0, y1, z0, z1*);

#### 参数

*damp_k*：浮点型，刚度阻尼系数

*damp_m*：浮点型，质量阻尼系数

*x0**、**x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0**、**y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0**、**z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

通过函数dyna.Set设置"If_Cal_Rayleigh"，打开或关闭瑞利阻尼计算。

通过函数dyna.Set将"RDamp_Input_Option"设置为2，可将输入方式改为临界阻尼比及显著频率模式，此时*damp_k*代表临界阻尼比，*damp_m*代表显著频率。

#### 范例

```javascript
blkdyn.SetRayleighDampByCoord(1e-4, 0.1, -10, 10, -10, 10, -10, 10);
```

<!--HJS_blkdyn_SetRayleighDampByGroup-->

### SetRayleighDampByGroup方法

#### 说明

当单元组号位于组号下限与上限之间时，将该块体单元的刚度阻尼系数及质量阻尼系数设定为确定值。

#### 格式定义

blkdyn.SetRayleighDampByGroup(*damp_k, damp_m , iGroupLow, iGroupUp*);

#### 参数

*damp_k*：浮点型，刚度阻尼系数

*damp_m*：浮点型，质量阻尼系数

*iGroupLow*、*iGroupUp*：整型，选择组号范围的上下限。

#### 备注

通过函数dyna.Set设置"If_Cal_Rayleigh"，打开或关闭瑞利阻尼计算。

通过函数dyna.Set将"RDamp_Input_Option"设置为2，可将输入方式改为临界阻尼比及显著频率模式，此时*damp_k*代表临界阻尼比，*damp_m*代表显著频率。

#### 范例

```javascript
blkdyn.SetRayleighDampByGroup(1e-4, 10, 3, 4);
```

<!--HJS_blkdyn_ExportData-->

## 信息输出设置

信息输出设置中提供了单元网格输出、单元信息输出、接触面信息输出、块体基本曲线输出、监测信息后处理输出等多个函数，函数列表见表3.14。

<center>表3.14信息输出设置的相关函数</center>

<table>
  	<tr>
		<th>序号</th><th>方法</th><th>说明</th>
	</tr>
         <td>1</td><td>ExportGrid</td><td rowspan=2>将块体模块中的网格导出为其他类型的网格。</td>
	</tr>
        <td>2</td><td>ExportGridByGroup</td>
	</tr>
        <td>3</td><td>ExportElemDataByGroup</td><td rowspan=2>单元信息的输出。</td>
	</tr>
        <td>4</td><td>ExportElemDataByCoord</td>
	</tr>
        <td>5</td><td>ExportIntInfo</td><td rowspan=4>接触面信息的输出。</td>
	</tr>
        <td>6</td><td>ExportIntDataByGroupInS</td>
	</tr>
        <td>7</td><td>ExportIntDataByPlane</td>
	</tr>
        <td>8</td><td>ExportIntDataByTable</td>
	</tr>
         <td>9</td><td>ExportGradationCurveByGroup</td><td rowspan=2>块体级配曲线输出。</td>
	</tr>
        <td>10</td><td>ExportGradationCurveByCoord</td>
	</tr>
         <td>11</td><td>ExportResultDataByLine</td><td>空间线段上的单元结果信息插值输出。</td>
	</tr>
    <td>12</td><td>ExportVolumeInfoExceedMagDisp</td><td>超过设定位移的单元、接触面体积信息输出。</td>
	</tr>
    <td>13</td><td>ExportTerrainData</td><td>导出导出某一位移值的Grid格式的滑床网格及滑体网格。</td>
	</tr>
</table>



<!--HJS_blkdyn_ExportGrid-->

### ExportGrid方法

#### 说明

将块体动力学软件中的网格导出为其他类型的网格。

#### 格式定义

blkdyn.ExportGrid (<*FileType*[, *FilePath*]>);

#### 参数

*FileType*：输出文件类型，可以为ID号，也可以为字符串。

（1）ID号输入为：1-输出为Patran网格，2-输出为Flac3D网格，3-输出为Ansys网格，4-输出为AnsysBlkDyn网格，5-输出为GiD网格。

（2）字符串输入为："Patran"、"Flac3D"、"Ansys"、"AnsysBlkDyn"、"GiD"，大小写均可。

*FilePath*：网格文件的导出路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。如果为空，则将在Result文件夹下产生对应的网格文件。

#### 备注

#### 范例

```javascript
blkdyn. ExportGrid (2, "feng.flac3d");
blkdyn. ExportGrid ("gid");
```

<!--HJS_blkdyn_ExportGridByGroup-->

### ExportGridByGroup方法

#### 说明

当单元组号与设定组号一致时，对特定组号的网格进行输出。

#### 格式定义

blkdyn. ExportGridByGroup (*aGroup*);

#### 参数

aGroup：Array整型，输出的组号数组。

#### 备注

在当前文件夹产生AnsysBlkDyn格式的网格文件，网格文件名为：Gird_Export_By_Group_AnsysBlkDyn_Type.dat

#### 范例

```javascript
//对某几组的特定网格进行输出
var aGroup=new Array(1,2,3,5,10)
blkdyn. ExportGridByGroup (aGroup);
```

<!--HJS_blkdyn_ExportElemDataByGroup-->

### ExportElemDataByGroup方法

#### 说明

当单元组号与设定组号一致时，输出单元的几何、材料及损伤破坏信息。

#### 格式定义

blkdyn. ExportElemDataByGroup (*groupL, groupU, filename*);

#### 参数

*filename*：字符串型，输出信息的文件名

*groupL*、 *groupU*：整型，组的上限、下限

#### 备注

#### 范例

```javascript
//打印组号1-10之间块体的信息，并存储在elem.dat文件中。
blkdyn. ExportElemDataByGroup (1, 10,"elem.dat");
```

<!--HJS_blkdyn_ExportElemDataByCoord-->

### ExportElemDataByCoord方法

#### 说明

当单元体心坐标位于坐标控制范围之内，输出单元的几何、材料及损伤破坏信息。

#### 格式定义

blkdyn. ExportElemDataByCoord (*x[2],y[2],z[2],filename*);

#### 参数

*filename*：字符串型，输出信息的文件名

*x*[2]、*y*[2]、*z*[2]：Array浮点型，包含2个分量，坐标下限及上限

#### 备注

#### 范例

```javascript
//打印单元信息，并存储在文件名为feng.dat的文本文件中。
x=new Array(-10,10);
y=new Array(-10,10);
z=new Array(-10,10);
blkdyn. ExportElemDataByCoord (x,y,z,"feng.dat");
```

<!--HJS_blkdyn_ExportIntInfo-->

### ExportIntInfo方法

#### 说明

打印接触弹簧的接触信息及插值信息。

#### 格式定义

blkdyn. ExportIntInfo (*filename*);

#### 参数

*filename*：字符串型，打印文件的文件名

#### 备注

#### 范例

```javascript
//打印弹簧的接触信息及插值信息，并存储在spring.txt的文本文件中。
blkdyn. ExportIntInfo ("spring.txt");
```

<!--HJS_blkdyn_ExportIntDataByGroupInS-->

### ExportIntDataByGroupInS方法

#### 说明

当接触面两侧的组号与设定组号一致时，打印接触弹簧几何位置、材料参数、损伤破坏情况、应力及位移情况。

#### 格式定义

blkdyn. ExportIntDataByGroupInS(*iGroup,jGroup,filename*);

#### 参数

*filename*：字符串型，打印文件的文件名

*iGroup*、*jGroup*：整型，接触面两侧单元的组号。

#### 备注

当输入两个组号（*iGroup*, *jGroup*）时，对有接触对的弹簧才起作用。如果*iGroup*及*jGroup*均为0，表示接触对两侧块体相同组号时赋值，如果*iGroup*及*jGroup*均为-1，表示接触对两侧块体不同组号时赋值。

#### 范例

```javascript
//打印组1与组2交界面处的弹簧信息
blkdyn. ExportIntDataByGroupInS (1,2,"feng.txt");
```

<!--HJS_blkdyn_ExportIntDataByPlane-->

### ExportIntDataByPlane方法

#### 说明

当接触弹簧的坐标围岩某一平面内时，打印接触弹簧几何位置、材料参数、损伤破坏情况、应力及位移情况。

#### 格式定义

blkdyn. ExportIntDataByPlane(*origin[3],n[3], tol,filename*);

#### 参数

*filename*：字符串型，打印文件的文件名

*origin*：Array浮点型，包含3个分量，平面內一点坐标（单位：m）

*n*：Array浮点型，包含3个分量，平面法向分量

*tol*：浮点型，容差（单位：m）

#### 备注

#### 范例

```javascript
//某一平面内的弹簧信息打印
var origin=new Array(10.0,10.0,10.0);
var n=new Array(0.0,1.0,0.0);
blkdyn. ExportIntDataByPlane (origin,n, 2.0,"spring.txt");
```

<!--HJS_blkdyn_ExportIntDataByTable-->

### ExportIntDataByTable方法

#### 说明

当接触弹簧的X、Y坐标位移Table表格数据圈定的多边形之内时，打印接触弹簧几何位置、材料参数、损伤破坏情况、应力及位移情况。

#### 格式定义

blkdyn. ExportIntDataByTable (*TableName,filename*);

#### 参数

*TableName*：字符串型，Table表格的名字

*filename*：字符串型，打印文件的文件名

#### 备注

*Table*列表的创建方式见2.12.1节中的dyna.CreateTable函数。

#### 范例

```javascript
//当接触弹簧坐标位于Table1指定的多边形内部时，打印弹簧信息
blkdyn. ExportIntDataByTable ("Table1","feng.dat");
```

<!--HJS_blkdyn_ExportGradationCurveByGroup-->

### ExportGradationCurveByGroup方法

#### 说明

当单元组号与设定组号一致时，输出块体的级配曲线信息。

#### 格式定义

blkdyn. ExportGradationCurveByGroup (*groupL, groupU*);

#### 参数

*groupL*、*groupU*：整型，单元组好的下限及上限。

#### 备注

执行该函数后，软件会对组号下限及上限范围内的独立块体进行统计，并在当前文件夹下产生"块体级配曲线.dat"的文本文件（该文件包含：序号、体积（面积）、特征尺寸、最大尺寸、通过率、独立块体三个方向的速度），同时在当前文件夹下产生AnsysBlkDyn格式的Distribution_Block_Ansys_To_BlkDyn.dat网格文件（每个独立块体用不同的组号表示）。

#### 范例

```javascript
//对组号为1-10范围内的块体进行级配曲线输出
blkdyn. ExportGradationCurveByGroup (1, 10);
```

<!--HJS_blkdyn_ExportGradationCurveByCoord-->

### ExportGradationCurveByCoord方法

#### 说明

当单元所有节点的原始坐标位于坐标控制范围之内时，对该单元进行块度统计，并输出级配曲线。

#### 格式定义

blkdyn. ExportGradationCurveByCoord (*x[2],y[2],z[2]*);

#### 参数

*x[2],y[2],z[2]*：Array浮点型，包含两个分量，坐标下限及上限。

#### 备注

执行该函数后，软件会对坐标范围内的独立块体进行统计，并在当前文件夹下产生"块体级配曲线.dat"的文本文件（该文件包含：序号、体积（面积）、特征尺寸、最大尺寸、通过率、独立块体三个方向的速度），同时在当前文件夹下产生AnsysBlkDyn格式的Distribution_Block_Ansys_To_BlkDyn.dat网格文件（每个独立块体用不同的组号表示）。

#### 范例

```javascript
//块体级配曲线输出
x=new Array(-10,10);
y=new Array(-10,10);
z=new Array(-10,10);
blkdyn. ExportGradationCurveByCoord (x,y,z);
```

<!--HJS_blkdyn_ExportResultDataByLine-->

### ExportResultDataByLine方法

#### 说明

输出一条线段上的块体信息。

#### 格式定义

blkdyn. ExportResultDataByLine(*parme_name,xyz1[3],xyz2[3],total_no*);

#### 参数

*parme_name*：字符串型，可输出2.10.1节Monitor函数中"block"监测类型下的所有内容，如"xdis"、"sxx"等。

*xyz1**、**xyz2*：Array浮点型，包含3个分量，线段两个端点坐标（单位：m）

*total_no*：整型，输出点的个数

#### 备注

执行该函数后，将在当前文件夹下产生LineData.txt，并将结果输出至该文件；多次执行该函数，将在LineData.txt文件的尾部续写入新的结果。

#### 范例

```javascript
//输出一条线段上的x方向的位移信息，并插值生成100个点。
xyz1=new Array(0.0,0.0,0.0)
xyz2=new Array(10.0,10.0,10.0)
blkdyn. ExportResultDataByLine("xdis",xyz1,xyz2,100);
```



<!--HJS_blkdyn_ExportVolumeInfoExceedMagDisp-->

### ExportVolumeInfoExceedMagDisp方法

#### 说明

统计系统中总位移大于设定值的单元及弹簧信息（如数量、体积等），并进行输出。

#### 格式定义

blkdyn. ExportVolumeInfoExceedMagDisp (*initial_step,interval,number, magvalue*);

#### 参数

*initial_step*：整型，初始时步（第一个Save文件的文件名，不含扩展名）

*interval*：整型，间隔时步

*number*：整型，读入文件数量

*magvalue*：整型，位移阈值

#### 备注

执行该函数后，首先按照设置调入Result文件夹下自动创建的Save文件，统计位移信息，并在当前文件夹下输出文件名为"总位移大于设定值的单元及弹簧信息.dat"的文本文件。

#### 范例

```javascript
//统计单元位移超过0.5m的单元及弹簧信息。
blkdyn. ExportVolumeInfoExceedMagDisp (100,200,10, 0.5);
```



<!--HJS_blkdyn_ExportTerrainData-->

### ExportTerrainData方法

#### 说明

导出Grid格式的地形文件及滑体文件，供其他gflow软件进行计算。

#### 格式定义

blkdyn.ExportTerrainData(<*fXMin, fXMax, fYMin, fYMax, nXNo, nYNo, fCriDisp [, fZeroTol [, strFileName ]]*>);

#### 参数

*fXMin, fXMax, fYMin, fYMax*：浮点型，导出区域X方向及Y方向的最小坐标及最大坐标（单位：m）。

*nXNo, nYNo*：整型，导出区域X方向及Y方向格点数。

*fCriDisp*：浮点型，临界位移（单位：m），超过该位移，判定为滑体。

*fZeroTol*：浮点型，零坐标容差（用于计算控制），可以不写，默认为1e-3。

*strFileName*：字符串型，输出的Grid格式的文件名，不用写扩展名，执行时自动加上"_zbed.dat"及"_height.dat"的文件尾缀。该字符串可以不写，默认为文件名为"Cdem_zbed.dat"、"Cdem_height.dat"

#### 备注

#### 范例

```javascript
//导出地形文件及滑体文件
blkdyn.ExportTerrainData(537340,537454,  378140, 378248, 100, 100, 1.5);
```



<!--HJS_blkdyn_GetData-->

## 信息设置及获取

信息设置及获取模块，包含了单元信息、节点信息、接触面信息的获取及设置等函数，具体如表3.15所示。

<center>表3.15辅助功能设置的相关函数</center>

| **序号** | **方法**         | **说明**                                       |
| -------- | ---------------- | ---------------------------------------------- |
| 1        | GetElemID        | 获得离某一坐标最近的单元ID号。                 |
| 2        | GetNodeID        | 获得离某一坐标最近的节点ID号。                 |
| 3        | GetSpringID      | 获得离某一坐标最近的半弹簧ID号。               |
| 4        | GetFaceID        | 获得某一个单元中，离某一坐标最近的局部面ID号。 |
| 5        | GetElemValue     | 获得某一单元序号的值。                         |
| 6        | GetElemFaceValue | 获得某一单元序号及局部面序号的值。             |
| 7        | GetNodeValue     | 获得某一节点序号的值。                         |
| 8        | GetSpringValue   | 获得某一弹簧序号的值。                         |
| 9        | SetElemValue     | 设置某一单元序号的值。                         |
| 10       | SetNodeValue     | 设置某一节点序号的值。                         |
| 11       | SetSpringValue   | 设置某一弹簧序号的值。                         |
| 12       | SearchElemInCell | 搜索坐标上下限控制下的单元，返回单元总数。     |
| 13       | GetElemIdInCell  | 返回某一个单元的ID号。                         |

<!--HJS_blkdyn_GetElemID-->

### GetElemID方法

#### 说明

获取离某一坐标点最近的单元序号（靠单元体心判断），返回值可赋给JavScript变量。

#### 格式定义

blkdyn. GetElemID (*fx*, *fy*, *fz*);

#### 参数

*fx**、**fy**、**fz*：浮点型，三个坐标分量（单位：m）。

#### 备注

返回值-1，表示系统中未包含单元。

#### 范例

```javascript
var IDNo = blkdyn.GetElemID(5.0, 5.0, 5.0);
```

<!--HJS_blkdyn_GetNodeID-->

### GetNodeID方法

#### 说明

获取离某一坐标点最近的节点序号，返回值可赋给JavScript变量。

#### 格式定义

blkdyn. GetNodeID (*fx*, *fy*, *fz*);

#### 参数

*fx**、**fy**、**fz*：浮点型，三个坐标分量（单位：m）。

#### 备注

返回值-1，表示系统中未包含节点。

#### 范例

```javascript
var IDNo = blkdyn.GetNodeID(5.0, 5.0, 5.0);
```

<!--HJS_blkdyn_GetSpringID-->

### GetSpringID方法

#### 说明

获取离某一坐标点最近的半弹簧序号（靠半弹簧缩进位置坐标判断），返回值可赋给JavScript变量。

#### 格式定义

blkdyn. GetSpringID (*fx*, *fy*, *fz*);

#### 参数

*fx**、**fy**、**fz*：浮点型，三个坐标分量（单位：m）。

#### 备注

返回值-1，表示系统中未包含半弹簧。

#### 范例

```javascript
var IDNo = blkdyn.GetSpringID(5.0, 5.0, 5.0);
```

<!--HJS_blkdyn_GetFaceID-->

### GetFaceID方法

#### 说明

获取某一单元上离某一坐标点最近的面的局部序号（靠面心坐标判断），返回值可赋给JavScript变量。

#### 格式定义

blkdyn. GetFaceID (*ElemID*, *fx*, *fy*, *fz*);

#### 参数

*ElemID*：整型，单元的ID号，从1开始。

*fx**、**fy**、**fz*：浮点型，三个坐标分量（单位：m）。

#### 备注

返回值-1，表示系统中未包含单元的面。

#### 范例

```javascript
var IDNo = blkdyn.GetFaceID(100, 5.0, 5.0, 5.0);
```

<!--HJS_blkdyn_GetElemValue-->

### GetElemValue方法

#### 说明

获取某一ID序号对应的单元信息。

#### 格式定义

blkdyn. GetElemValue (*IDNo*, *msValueName*[,*iflag*]);

#### 参数

*IDNo*：整型，单元的ID号，从1开始。

*msValueName*：字符串型，可供获取的单元信息，具体见**附表2**。

*iflag*：整型，获取变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号单元的体心坐标
var xc = blkdyn.GetElemValue(100, "Centroid", 1);
var yc = blkdyn.GetElemValue(100, "Centroid", 2);
var zc = blkdyn.GetElemValue(100, "Centroid", 3);
```

<!--HJS_blkdyn_GetElemFaceValue-->

### GetElemFaceValue方法

#### 说明

获取某一ID序号单元对应的某一局部ID面的信息。

#### 格式定义

blkdyn. GetElemFaceValue (*ielem, iface, msValueName, fValue* [, *iflag*]);

#### 参数

*ielem*：整型，节点的ID号，从1开始。

*iface*：整型，节点的局部面号，从1开始，三角形为1-3；六面体为1-6。

*msValueName*：字符串型，可供获取的局部面信息，具体见**附表5**。

*iflag*：整型，获取变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号单元第4号面的面向坐标
var xc = blkdyn.GetElemFaceValue(100,4, "FaceCenter", 1);
var yc = blkdyn. GetElemFaceValue(100, 4,"FaceCenter", 2);
var zc = blkdyn. GetElemFaceValue(100, 4, "FaceCenter", 3);
```

<!--HJS_blkdyn_GetNodeValue-->

### GetNodeValue方法

#### 说明

获取某一ID序号对应的节点信息。

#### 格式定义

blkdyn. GetNodeValue (*IDNo*, *msValueName*[, *iflag*]);

#### 参数

*IDNo*：整型，节点的ID号，从1开始。

*msValueName*：字符串型，可供获取的节点信息，具体见**附表3**。

*iflag*：整型，获取变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号节点3个方向的位移分量
var xdis = blkdyn.GetNodeValue(100, "Displace", 1);
var ydis = blkdyn. GetNodeValue (100, "Displace", 2);
var zdis = blkdyn. GetNodeValue (100, "Displace", 3);
```

<!--HJS_blkdyn_GetSpringValue-->

### GetSpringValue方法

#### 说明

获取某一ID序号对应的弹簧信息。

#### 格式定义

blkdyn. GetSpringValue (*IDNo*, *msValueName* [, *iflag*]);

#### 参数

*IDNo*：整型，弹簧的ID号，从1开始。

*msValueName*：字符串型，可供获取的弹簧信息，具体见附表**4**。

*iflag*：整型，获取变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号弹簧的法向刚度
var kn = blkdyn.GetSpringValue(100, "Kn");
```

<!--HJS_blkdyn_SetElemValue-->

### SetElemValue方法

#### 说明

设置某一ID序号对应的单元信息。

#### 格式定义

blkdyn. SetElemValue (*IDNo*, *msValueName, fValue* [,*iflag*]);

#### 参数

*IDNo*：整型，单元的ID号，从1开始。

*msValueName*：字符串型，可供设置的单元信息，具体见**附表2**。

*fValue*：需要设置的值。

*iflag*：整型，设置变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```javascript
///设置第100号单元的Y方向的正应力（ID号为2）为1MPa
blkdyn.SetElemValue(100, "Stress",1e6, 2);
///设置第100号单元的弹性模量为3GPa
blkdyn.SetElemValue(100, "Young", 3e9);
```

<!--HJS_blkdyn_SetNodeValue-->

### SetNodeValue方法

#### 说明

设置某一ID序号对应的节点信息。

#### 格式定义

blkdyn. SetNodeValue (<*IDNo*, *msValueName, fValue* [,*iflag*]>);

#### 参数

*IDNo*：整型，节点的ID号，从1开始。

*msValueName*：字符串型，可供设置的节点信息，具体见**附表3**。

*fValue*：需要设置的值。

*iflag*：整型，设置变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```javascript
///设置第100号节点的Y方向的正应力（ID号为2）为1MPa
blkdyn.SetNodeValue(100, "Stress",1e6, 2);
///设置第100号节点的局部阻尼为0.8
blkdyn.SeNodeValue(100, "LocalDamp", 0.8);
```

<!--HJS_blkdyn_SetSpringValue-->

### SetSpringValue方法

#### 说明

设置某一ID序号对应的半弹簧信息。

#### 格式定义

blkdyn. SetSpringValue (*IDNo*, *msValueName, fValue* [,*iflag*]);

#### 参数

*IDNo*：整型，半弹簧的ID号，从1开始。

*msValueName*：字符串型，可供设置的半弹簧信息**，具体见附表****4****。**

*fValue*：需要设置的值。

*iflag*：整型，设置变量的分量ID号，如果为标量，可以不写，或写1。

#### 备注

#### 范例

```javascript
///设置第100号半弹簧的拉伸段磊能为100，剪切断裂能为1000。
blkdyn. SetSpringValue (100, "FractureEnergy",100, 1);
blkdyn. SetSpringValue (100, "FractureEnergy",1000, 2);
///设置第100号半弹簧对应的本构模型号为1（线弹性本构）。
blkdyn. SetSpringValue (100, "JModel", 1);
```

<!--HJS_blkdyn_SearchElemInCell-->

### SearchElemInCell方法

#### 说明

搜索某一空间格子内的单元，返回单元的总数。

#### 格式定义

blkdyn.SearchElemInCell( < *fMinX, fMinY, fMinZ, fMaxX, fMaxY, fMaxZ* > );

#### 参数

*fMinX, fMinY, fMinZ*：浮点型，格子的最小坐标值（单位：m）。

*fMaxX, fMaxY, fMaxZ*：浮点型，格子的最大坐标值（单位：m）。

#### 备注

（1）  返回值为格子内的单元总数。

（2）  此函数与函数blkdyn.GetElemIdInCell(<iComp>)连用，返回与设定格子区域内可能发生作用的潜在单元。

#### 范例

```javascript
///搜索最小坐标[4,4,4]与最大坐标[6,6,6]控制下的格子内的单元
var totalno = blkdyn.SearchElemInCell(4, 4, 4, 6, 6, 6);
print(totalno, " elements in cell.");
for(var i = 1; i <= totalno; i++)
{
var id = blkdyn.GetElemIdInCell(i);
print(id);
}
```

<!--HJS_blkdyn_GetElemIdInCell-->

### GetElemIdInCell方法

#### 说明

返回格子内某一单元的ID号。

#### 格式定义

blkdyn.GetElemIdInCell ( <*iComp* > );

#### 参数

*iComp*：整型，单元索引号，大于等于1，小于最大单元数。

#### 备注

（1）  返回值为某一索引号对应的单元ID。

（2）  此函数与函数blkdyn. SearchElemInCell ()连用，返回与设定格子区域内可能发生作用的潜在单元。

#### 范例

```javascript
///搜索最小坐标[4,4,4]与最大坐标[6,6,6]控制下的格子内的单元
var totalno = blkdyn.SearchElemInCell(4, 4, 4, 6, 6, 6);
print(totalno, " elements in cell.");
for(var i = 1; i <= totalno; i++)
{
var id = blkdyn.GetElemIdInCell(i);
print(id);
}
```

<!--HJS_blkdyn_Call_Solver-->

## 核心求解函数调用

核心求解模块包括单元变形力计算、接触力计算、节点运动计算、阻尼力计算及动态条件施加等，具体如表3.16所示。

<center>表3.16核心求解函数对应的接口</center>

| **序号** | **方法**                  | **说明**                                               |
| -------- | ------------------------- | ------------------------------------------------------ |
| 1        | CalBlockForce             | 计算单元变形力                                         |
| 2        | CalContactForce           | 寻找接触，计算接触力                                   |
| 3        | CalDynaBound              | 计算动态边界                                           |
| 4        | CalSpringBound            | 计算弹簧边界                                           |
| 5        | CalRayleighDamp           | 计算瑞利阻尼力                                         |
| 6        | CalQuietBound             | 计算静态边界条件（无反射）                             |
| 7        | CalFreeFieldBound         | 计算自由场边界（无反射）                               |
| 8        | CalNodeMovement           | 先进行力的求解，在进行运动的求解。                     |
| 9        | Solver                    | 块体模块核心求解器，上述1-7功能的集合。                |
| 10       | CalElemForce              | 根据软件内置的有限体积法计算指定单元的单元变形力。     |
| 11       | CalElemForceByStiffMatrix | 根据单元刚度矩阵法计算一个单元的节点力。               |
| 12       | CalElemForceByFVM         | 采用FVM计算一个单元的节点力。                          |
| 13       | RenewNodalSS              | 根据单元的应变、应力，更新节点的应变及应力，便于显示。 |

<!--HJS_blkdyn_CalBlockForce-->

### CalBlockForce方法

#### 说明

计算块体的变形力。

#### 格式定义

blkdyn.CalBlockForce ();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现单元变形力的求解。

#### 范例

```javascript
blkdyn. CalBlockForce ();
```

<!--HJS_blkdyn_CalContactForce-->

### CalContactForce方法

#### 说明

寻找接触，计算接触力。

#### 格式定义

blkdyn.CalContactForce ();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现接触寻找及接触力的求解。

#### 范例

```javascript
blkdyn. CalContactForce ();
```

<!--HJS_blkdyn_CalDynaBound-->

### CalDynaBound方法

#### 说明

计算动态边界。

#### 格式定义

blkdyn.CalDynaBound();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现动态边界的施加。动态边界可通过3.6节ApplyDyna相关接口函数设置。

#### 范例

```javascript
blkdyn. CalDynaBound();
```

<!--HJS_blkdyn_CalSpringBound-->

### CalSpringBound方法

#### 说明

计算弹簧边界条件。

#### 格式定义

blkdyn.CalSpringBound();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现弹簧边界的求解。弹簧边界的施加可通过3.5节SetSpringBound相关接口函数设置。

#### 范例

```javascript
blkdyn. CalSpringBound();
```

<!--HJS_blkdyn_CalRayleighDamp-->

### CalRayleighDamp方法

#### 说明

计算瑞利阻尼。

#### 格式定义

blkdyn. CalRayleighDamp ();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现瑞利阻尼力的计算。

#### 范例

```javascript
blkdyn.CalRayleighDamp();
```

<!--HJS_blkdyn_CalQuietBound-->

### CalQuietBound方法

#### 说明

计算静态边界条件，实现无反射功能。

#### 格式定义

blkdyn.CalQuietBound();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现静态边界的计算，静态边界可通过3.6节SetQuietBound实现。

#### 范例

```javascript
blkdyn.CalQuietBound();
```

<!--HJS_blkdyn_CalFreeFieldBound-->

### CalFreeFieldBound方法

#### 说明

自由场边界计算，实现无反射功能。

#### 格式定义

blkdyn.CalFreeFieldBound();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现自由场边界的计算，自由场边界可通过3.6节SetFreeField实现。

#### 范例

```javascript
blkdyn.CalFreeFieldBound ();
```

<!--HJS_blkdyn_CalNodeMovement-->

### CalNodeMovement方法

#### 说明

计算节点运动。

#### 格式定义

blkdyn.CalNodeMovement ();

#### 参数

#### 备注

（1）用户自定义求解过程时，调用该接口函数可实现节点运动过程的计算。

（2）返回值为当前时刻系统的不平衡率。

#### 范例

```javascript
var fratio = blkdyn.CalNodeMovement ();
```

<!--HJS_blkdyn_Solver-->

### Solver方法

#### 说明

块体模块核心求解器。

#### 格式定义

blkdyn.Solver ();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现块体模块的核心求解功能。

#### 范例

```javascript
blkdyn. Solver ();
```

<!--HJS_blkdyn_CalElemForce-->

### CalElemForce方法

#### 说明

根据软件内置的有限体积法，计算某一个指定单元的变形力。

#### 格式定义

blkdyn.CalElemForce (<*ElemID* >);

#### 参数

*ElemID*：整型，单元ID（从1开始）。

#### 备注

（1）该接口用于某一特定单元的变形力计算，用户可通过blkdyn.SetModel、blkdyn.SetMat系列函数进行计算模型及计算参数的指定。

#### 范例

```javascript
//计算第10号单元的单元变形力
blkdyn.CalElemForce (10);
```

<!--HJS_blkdyn_CalElemForceByStiffMatrix-->

### CalElemForceByStiffMatrix方法

#### 说明

采用单元刚度矩阵法，根据单元的节点位移计算单元的节点力（全量法）。

#### 格式定义

blkdyn.CalElemForceByStiffMatrix (<*ElemID*, *afDisp*[][3]>);

#### 参数

*ElemID*：整型，单元ID（从1开始）。

*afDisp*[][3]：Array浮点型，单元的节点位移数组，第一个维度为单元节点局部序号，第二个维度为位移分量值。

#### 备注

（1）该接口函数用于用户借助刚度矩阵法进行单元力的求解，内置的本构为线弹性本构，并指定采用全量法计算。用户可通过blkdyn.SetMat系列函数设置单元的密度、弹性模量及泊松比。

（2）计算前，用户需先调用blkdyn.CalElemStiffMatrix();进行单元刚度矩阵的求解。

#### 范例

```javascript
//三角形单元
var afDisp = new Array(3);
afDisp[0] = [0,0,0];
afDisp[1] = [0,0,0];
afDisp[2] = [0, 0.1, 0];
blkdyn.CalElemForceByStiffMatrix (1, afDisp);
```

<!--HJS_blkdyn_CalElemForceByFVM-->

### CalElemForceByFVM方法

#### 说明

采用有限体积法，根据单元的节点位移计算单元的节点力（全量法）。

#### 格式定义

blkdyn.CalElemForceByFVM (<*ElemID*, *afDisp*[][3]>);

#### 参数

*ElemID*：整型，单元ID（从1开始）。

*afDisp*[][3]：Array浮点型，单元的节点位移数组，第一个维度为单元节点局部序号，第二个维度为位移分量值。

#### 备注

（1）该接口函数用于用户借助有限体积法进行单元力的求解，内置的本构为线弹性本构，并指定采用全量法计算。用户可通过blkdyn.SetMat系列函数设置单元的密度、弹性模量及泊松比。

（2）用户可通过dyna.Set(<>)设置"Solid_Cal_Mode"，告知软件核心采用混合离散有限体积法还是简单有限体积法进行节点力的求解。

#### 范例

```javascript
//三角形单元
var afDisp = new Array(3);
afDisp[0] = [0,0,0];
afDisp[1] = [0,0,0];
afDisp[2] = [0, 0.1, 0];
blkdyn.CalElemForceByFVM(1, *afDisp*);
```

<!--HJS_blkdyn_RenewNodalSS-->

### RenewNodalSS方法

#### 说明

根据单元的应变、应力，更新节点的应变应力。

#### 格式定义

blkdyn.RenewNodalSS();

#### 参数

#### 备注

（1）该函数主要用于blkdyn.CalElemForce (<*ElemID* >)及blkdyn.CalElemForceByStiffMatrix (<*ElemID*, *afDisp*[][3]>)函数，计算单元变形力后，将单元上的应力插值至节点，便于云图显示。

#### 范例

```GetMeshjavascript
//更新节点应力、应变
blkdyn.RenewNodalSS();
```
