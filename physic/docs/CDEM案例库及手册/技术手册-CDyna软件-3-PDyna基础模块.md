

<!--HJS_pdyna_basic_modules-->

# 颗粒基础模块

本模块主要用于求解通用离散元类的问题。用户可以利用该模块提供的接口函数并联合公共库中的接口函数，对散粒体的力学行为进行模拟，同时可以利用含粘接强度的颗粒模型研究连续体的渐进破坏过程。

基础模块（通用颗粒离散元模块）的接口函数主要包括颗粒的生成、导入及调整，颗粒本构模型的施加及材料参数的施加，颗粒初边值条件的施加等。

<!--HJS_pdyna_par_generation-->

## 颗粒的生成及调整

本节主要介绍颗粒导入、生成及调整相关的接口函数，接口函数列表见表3.1 。

<div align = "center">表3.1 颗粒生成及调整的相关函数</div>

<table>
    <tr>
        <th>序号</th>
        <th>函数名</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>0</td>
        <td>GetMesh</td>
        <td>从Genvi平台获取网格并加载到颗粒求解器求解器。</td>
    </tr>
    <tr>
        <td>1</td>
        <td>Import</td>
        <td>从外部文件导入颗粒（包含二维圆和三维球）</td>
    </tr>
    <tr>
        <td>2</td>
        <td>CreateFromBlock</td>
        <td>基于实体单元（节点或体心）创建颗粒</td>
    </tr>
    <tr>
        <td>3</td>
        <td>CreateByCoord</td>
        <td rowspan="2">在指定范围内按照设定参数随机生成颗粒</td>
    </tr>
    <tr>
        <td>4</td>
        <td>CreateByCylinder</td>
    </tr>
    <tr>
        <td>5</td>
        <td>AdvCreateByCoord</td>
        <td>颗粒高级随机生成，可指定随机模式</td>
    </tr>
    <tr>
        <td>6</td>
        <td>RegularCreateByCoord</td>
        <td rowspan="2">创建规则排布的颗粒</td>
    </tr>
    <tr>
        <td>7</td>
        <td>RegularCreateByCylinder</td>
    </tr>
    <tr>
        <td>8</td>
        <td>CrossCreateByCoord</td>
        <td rowspan="2">创建交错排布的颗粒</td>
    </tr>
    <tr>
        <td>9</td>
        <td>CrossCreateByCylinder</td>
    </tr>
    <tr>
        <td>10</td>
        <td>SingleCreate</td>
        <td>创建单个颗粒</td>
    </tr>
    <tr>
        <td>11</td>
        <td>LineCreate</td>
        <td>在一条线上创建颗粒</td>
    </tr>
    <tr>
        <td>12</td>
        <td>CircleCreate</td>
        <td>在圆周上创建颗粒</td>
    </tr>
    <tr>
        <td>13</td>
        <td>SetGroupByCoord</td>
        <td rowspan="8">对颗粒进行重新分组</td>
    </tr>
    <tr>
        <td>14</td>
        <td>SetGroupByCylinder</td>
    </tr>
    <tr>
        <td>15</td>
        <td>SetGroupByTable</td>
    </tr>
    <tr>
        <td>16</td>
        <td>SetGroupByID</td>
    </tr>
    <tr>
        <td>17</td>
        <td>SetGroupByLine</td>
    </tr>
    <tr>
        <td>18</td>
        <td>SetGroupByPlane</td>
    </tr>
    <tr>
        <td>19</td>
        <td>SetGroupByCircle</td>
    </tr>
     <tr>
        <td>20</td>
        <td>SetGroupBySphere</td>
    </tr>
    <tr>
        <td>21</td>
        <td>RandomizeGroup</td>
        <td>对颗粒进行随机分组</td>
    </tr>
    <tr>
        <td>22</td>
        <td>GenElemFromParticle</td>
        <td>基于颗粒创建多边形（多面体）单元</td>
    </tr>
    <tr>
        <td>23</td>
        <td>Export</td>
        <td>导出pdyna格式的颗粒</td>
    </tr>
    <tr>
        <td>24</td>
        <td>MoveByCoord</td>
        <td rowspan="2">对颗粒进行平移</td>
    </tr>
    <tr>
        <td>25</td>
        <td>MoveByGroup</td>
    </tr>
    <tr>
        <td>26</td>
        <td>RotaByCoord</td>
        <td rowspan="2">对颗粒进行选择</td>
    </tr>
    <tr>
        <td>27</td>
        <td>RotaByGroup</td>
    </tr>
    <tr>
        <td>28</td>
        <td>ZoomByCoord</td>
        <td rowspan="2">对颗粒进行缩放</td>
    </tr>
    <tr>
        <td>29</td>
        <td>ZoomByGroup</td>
    </tr>
</table>
<!--HJS_pdyna_GetMesh-->

### GetMesh方法

#### 说明

从Genvi平台获取网格并加载到颗粒求解器。

#### 格式定义

pdyna.GetMesh (<*mesh*>);

#### 参数

*mesh*：网格对象。

#### 备注

#### 范例

```javascript
//利用平台的imesh模块导入gid网格
var msh1 = imesh.importGid("particle.msh");
//将平台的网格加载到颗粒核心求解器
pdyna.GetMesh(msh1);
```



<!--HJS_pdyna_Import-->

### Import方法

#### 说明

从外部文件中导入颗粒。

#### 格式定义

pdyna.Import(<*FileType*[, *FilePath*]>);

#### 参数

*FileType*：输入文件类型，可以为ID号，也可以为字符串。

（1）ID号输入为：1-读入PDyna格式的颗粒，2-读入GiD格式的颗粒，3-读入Genvi格式的颗粒。

（2）字符串输入为：" PDyna"、"GiD"、"Genvi"，大小写均可。

*FilePath*：网格文件的导出路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（1）导入PDyna格式的颗粒（文件扩展名为.dat），其本文文件的格式为

​    ![](images\GDEM_Pdyna_1.png)                          

第一行为颗粒总数；第二行为表头，分别为颗粒序号，类型（1表示二维、2表示3维），颗粒组号，颗粒本构模型号，颗粒半径，颗粒体心X坐标，颗粒体心Y坐标，颗粒体心Z坐标；后续若干行（行数为颗粒总数）为具体颗粒的数值。

（2）导入GiD格式的颗粒，首先利用GiD软件建立几何模型，而后选择circle（二维）、sphere（三维）网格类型对几何模型进行颗粒剖分。选择菜单FILE—>Export—>ASCII project，将在指定目录下创建*.gid文件夹，该文件夹中的文本文件*.msh即为导入时的网格。

（3）导入Genvi格式的颗粒，首先用Genvi建立颗粒，然后菜单栏导出为Genvi通用格式gvx文本文件。

#### 范例

```javascript
pdyna.Import ("pdyna", "feng.dat");
pdyna.Import ("gid");
pdyna.Import ("genvi", "par.gvx");
```

<!--HJS_pdyna_CreateFromBlock-->

### CreateFromBlock方法

#### 说明

基于设定组号范围内的实体单元创建颗粒。

#### 格式定义

pdyna.CreateFromBlock(<*itype*, *GroupL*, *GroupU*>);

#### 参数

*itype*：整型，从实体单元中创建颗粒的方式，只能为1或者2。1表示基于单元体心创建颗粒（颗粒质心为单元体心，颗粒半径根据体积相等原则进行计算），2表示基于节点创建颗粒（颗粒质心为节点，颗粒半径为与该节点相连的所有棱长平均值的一半）。

*GroupL*、*GroupU*：整型，分别表示颗粒组号的下限及上限。

#### 备注

执行上述接口函数后，颗粒将会自动创建，并将在当前文件夹下产生PDyna格式的颗粒文件，文件名为ParticleFromBlock.dat。此时，用户可以重启PDyna软件，导入生成的颗粒网格并进行重新计算；也可直接进行计算，所生成颗粒的材料信息将从块体中继承，用户也可以通过pdyna.SetModel(<>)、pdyna.SetMat(<>)重新设定颗粒本构模型及颗粒材料信息。

此外，执行此接口函数后将跳出如下警告框，以提示用户已经成功创建了颗粒。

​    ![](images\GDEM_Pdyna_2.png)

####  范例

```javascript
//当单元的组号位于1-3之间时，基于这些单元的体心创建颗粒
pdyna.CreateFromBlock(1, 1,3);
```

<!--HJS_pdyna_CreateByCoord-->

### CreateByCoord方法

#### 说明

基于坐标上下限创建随机排布的颗粒。

#### 格式定义

pdyna.CreateByCoord(<*TotalNo*, *GroupNo*, *type*, *radmin*, *radmax*, *embed*, *x*[2],*y*[2],*z*[2]>); 

#### 参数

*TotalNo*：整型，此处创建的最大颗粒数量（颗粒上限值）。

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*radmin*：浮点型，颗粒最小半径（单位：m）。

*radmax*：浮点型，颗粒最大半径（单位：m）。

*embed*：浮点型，所创建的颗粒之间的叠合量，0表示不嵌入也不分离，正值表示允许嵌入的具体量，负值表示颗粒之间的分离量。（单位：m）

*x*[2]，*y*[2]，*z*[2]：Array浮点型，每个量包含2个分量，表示对应坐标的下限及上限。（单位：m）

#### 备注

（1）执行此命令后，将通过类均匀分布的随机模式产生不同半径的颗粒；每次产生颗粒时，将根据随机的半径及颗粒间的叠合量创建符合条件的颗粒，当迭代2万步仍然无有效颗粒产生，则自动退出颗粒的生成，此时的实际颗粒数量将小于TotalNo。

（2）当颗粒在产生过程中，点击工具栏的![](images\GDEM_Pdyna_3.png)将强制退出颗粒的生成而执行后续的接口函数；点击工具栏的![](images\GDEM_Pdyna_4.png)将强制退出颗粒的生成并退出整个命令流。

#### 范例

```javascript
//产生半径下限为1m，半径上限为5m，组号为1的300个随机分布的颗粒
var x = new Array(0.0, 100.0);
var y = new Array(0.0, 100.0);
var z = new Array(0.0, 100.0);
pdyna.CreateByCoord(300, 1, 2, 1.0, 5.0, 0,x,y,z);
```

<!--HJS_pdyna_CreateByCylinder-->

### CreateByCylinder方法

#### 说明

基于内外圆柱面创建随机排布的颗粒。

#### 格式定义

pdyna.CreateByCylinder(<*TotalNo*, *GroupNo*, *type*, *radmin*, *radmax*, *embed*, *end1*[3], *end2*[3], *fRad1*, *fRad2*>);

#### 参数

*TotalNo*：整型，此处创建的最大颗粒数量（颗粒上限值）。

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*radmin*：浮点型，颗粒最小半径（单位：m）。

*radmax*：浮点型，颗粒最大半径（单位：m）。

*embed*：浮点型，所创建的颗粒之间的叠合量，0表示不嵌入也不分离，正值表示允许嵌入的具体量，负值表示颗粒之间的分离量。（单位：m）

*end1*[3]：Array浮点型，包含3个分量，圆柱轴线端点1的坐标（单位：m）。

*end2*[3]：Array浮点型，包含3个分量，圆柱轴线端点2的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

（1）执行此命令后，将通过类均匀分布的随机模式产生不同半径的颗粒；每次产生颗粒时，将根据随机的半径及颗粒间的叠合量创建符合条件的颗粒，当迭代2万步仍然无有效颗粒产生，则自动退出颗粒的生成，此时的实际颗粒数量将小于TotalNo。

（2）当颗粒在产生过程中，点击工具栏的![](images/GDEM_Pdyna_3.png)将强制退出颗粒的生成而执行后续的接口函数；点击工具栏的![](images/GDEM_Pdyna_4.png)将强制退出颗粒的生成并退出整个命令流。

#### 范例

```javascript
//按圆柱方式产生随机颗粒
var end1 = new Array(0.0, 0.0, 0.0);
var end2 = new Array(50.0, 0.0, 0.0);
pdyna.CreateByCylinder(300, 1, 2, 1.0, 5.0, 0,end1, end2, 0.0, 50.0);
```



<!--HJS_pdyna_AdvCreateByCoord-->

### AdvCreateByCoord方法

#### 说明

基于坐标下限及上限创建高级随机排布的颗粒。

#### 格式定义

pdyna. AdvCreateByCoord (<*TotalNo*, *GroupNo*, *type*, *RandomName*, *pra1*, *pra2*, *embed*, *x*[2], *y*[2], *z*[2]>);

#### 参数

*TotalNo*：整型，此处创建的最大颗粒数量（颗粒上限值）。

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*RandomName*：字符串型，随机参数的名称，只能为均匀分布“*uniform*”、正态分布”*normal*” 及威布尔分布”*weilbull*”三种类型之一。

*pra1*、*pra2*：浮点型，随机参数。如果分布模式为“*uniform*”， *pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*embed*：浮点型，所创建的颗粒之间的叠合量，0表示不嵌入也不分离，正值表示允许嵌入的具体量，负值表示颗粒之间的分离量。（单位：m）

*x*[2]，*y*[2]，*z*[2]：Array浮点型，每个量包含2个分量，表示对应坐标的下限及上限。（单位：m）

#### 备注

（1）执行此命令后，将通过类均匀分布的随机模式产生不同半径的颗粒；每次产生颗粒时，将根据随机的半径及颗粒间的叠合量创建符合条件的颗粒，当迭代2万步仍然无有效颗粒产生，则自动退出颗粒的生成，此时的实际颗粒数量将小于TotalNo。

（2）当颗粒在产生过程中，点击工具栏的![](images/GDEM_Pdyna_3.png)将强制退出颗粒的生成而执行后续的接口函数；点击工具栏的![](images/GDEM_Pdyna_4.png)将强制退出颗粒的生成并退出整个命令流。

#### 范例

```javascript
//产生正态分布的颗粒
var x = new Array(0.0, 100.0);
var y = new Array(0.0, 100.0);
var z = new Array(0.0, 100.0);
pdyna. AdvCreateByCoord (300, 1, 2, "normal",5.0, 0.5, 0.0, x, y, z);
```



<!--HJS_pdyna_RegularCreateByCoord-->

### RegularCreateByCoord方法

#### 说明

根据坐标下限及上限创建规则排布的颗粒体系。

#### 格式定义

pdyna. RegularCreateByCoord (<*GroupNo*, *type*, *rad*, *x0, x1, y0, y1, z0, z1*>);

#### 参数

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*rad*：浮点型，颗粒半径（单位：m）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
//产生组号为2，规则排布的二维颗粒（圆）
pdyna. RegularCreateByCoord (2, 1, 0.5, -10, 10, -10, 10, 0,0);
```

<!--HJS_pdyna_RegularCreateByCylinder-->

### RegularCreateByCylinder方法

#### 说明

根据内外圆柱面创建规则排布的颗粒体系。

####  格式定义

pdyna. RegularCreateByCylinder (<*GroupNo*, *type*, *rad*, *end1*[3], *end2*[3], *fRad1*, *fRad2*>);

#### 参数

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*rad*：浮点型，颗粒半径（单位：m）。

*end1*[3]：Array浮点型，包含3个分量，圆柱轴线端点1的坐标（单位：m）。

*end2*[3]：Array浮点型，包含3个分量，圆柱轴线端点2的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
//在内外圆柱面之间，产生组号为2，规则排布的二维颗粒（圆）
var end1 = new Array(0.0, 0.0, 0.0);
var end2 = new Array(50.0, 0.0, 0.0);
pdyna.RegularCreateByCylinder (2, 1, 0.5, end1, end2, 0.0, 20.0);
```

<!--HJS_pdyna_CrossCreateByCoord-->

### CrossCreateByCoord方法

#### 说明

根据坐标下限及上限创建交错排布的颗粒体系。

#### 格式定义

pdyna. CrossCreateByCoord (<*GroupNo*, *type*, *rad*, *x0, x1, y0, y1, z0, z1*>);

#### 参数

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*rad*：浮点型，颗粒半径（单位：m）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
//产生组号为2，交错排布的二维颗粒（圆）
pdyna. CrossCreateByCoord (2, 1, 0.5, -10, 10, -10, 10, 0,0);
```

<!--HJS_pdyna_CrossCreateByCylinder-->

### CrossCreateByCylinder方法

#### 说明

根据内外圆柱面创建交错排布的颗粒体系。

#### 格式定义

pdyna. CrossCreateByCylinder (<*GroupNo*, *type*, *rad*, *end1*[3], *end2*[3], *fRad1*, *fRad2*>);

#### 参数

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*rad*：浮点型，颗粒半径（单位：m）。

*end1*[3]：Array浮点型，包含3个分量，圆柱轴线端点1的坐标（单位：m）。

*end2*[3]：Array浮点型，包含3个分量，圆柱轴线端点2的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
//在内外圆柱面之间，产生组号为2，交错排布的二维颗粒（圆）
var end1 = new Array(0.0, 0.0, 0.0);
var end2 = new Array(50.0, 0.0, 0.0);
pdyna. CrossCreateByCylinder (2, 1, 0.5, end1, end2, 0.0, 20.0);
```

<!--HJS_pdyna_SingleCreate-->

### SingleCreate方法

#### 说明

单独创建一个颗粒。

#### 格式定义

pdyna. SingleCreate(<*GroupNo*, *type*, *rad*, *cx, cy, cz*>);

#### 参数

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*rad*：浮点型，颗粒半径（单位：m）。

*cx*，*cy*，*cz*：浮点型，颗粒中心点的坐标分量（单位：m）。

#### 备注

无。

#### 范例

```javascript
pdyna.SingleCreate(2, 1, 0.5, 0.0, 1.0, 0.0);
```

<!--HJS_pdyna_LineCreate-->

### LineCreate方法

#### 说明

在一条线段上创建颗粒。

#### 格式定义

pdyna. LineCreate (<*GroupNo*, *type*, *TotalP*, *x1, y1, z1, x2, y2, z2*>);

#### 参数

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*TotalP*：整型，线段上的颗粒数量。

*x1*，*y1*，*z1*：浮点型，线段第一个点的坐标分量（单位：m）。

*x2*，*y2*，*z2*：浮点型，线段第二个点的坐标分量（单位：m）。

#### 备注

无。

#### 范例

```javascript
pdyna. LineCreate (2, 1, 10, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0);
```

<!--HJS_pdyna_CircleCreate-->

### CircleCreate方法

#### 说明

在圆周线上创建颗粒。

#### 格式定义

pdyna. CircleCreate (<*GroupNo*, *type*, *rad*, *TotalNo, origin[3], Normal[3], CircleRad >);*

#### 参数

*GroupNo*：整型，颗粒组号。

*type*：整型，颗粒类型，1表示二维颗粒，2表示三维颗粒。

*rad*：浮点型，颗粒半径（单位：m）。

*TotalNo*：整型，圆周上的总颗粒数量。

*origin*[3]：Array浮点型，包含3个分量，圆周的中心点坐标（单位：m）。

*Normal* [3]：Array浮点型，包含3个分量，圆周的单位法向分量。

*CircleRad*：浮点型，圆周的半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
var origin = [0.0, 0.0, 0.0];
var Normal = [0.0, 0.0, 1.0];
pdyna. CircleCreate (2, 1, 0.2, 100, origin, Normal, 10.0);
```

<!--HJS_pdyna_SetGroupByCoord-->

### SetGroupByCoord方法

#### 说明

根据坐标范围重新分组。

#### 格式定义

pdyna. SetGroupByCoord (<*GroupNo*, *x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
//将坐标范围内的颗粒重新设定为组5
pdyna.SetGroupByCoord (5, -2, 2, -2, 2, -2, 2);
```

<!--HJS_pdyna_SetGroupByCylinder-->

### SetGroupByCylinder方法

#### 说明

根据内外圆柱面圈定的范围重新分组。

#### 格式定义

pdyna. SetGroupByCylinder (<*GroupNo*, *x0, y0, z0, x1, y1, z1, fRad1, fRad2*>);

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
//将内外圆柱面范围内的颗粒设定为组号5
pdyna. SetGroupByCylinder (5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 5.0);
```

<!--HJS_pdyna_SetGroupByTable-->

### SetGroupByTable方法

#### 说明

将特定Table对应范围内的颗粒设定成特定的组。

#### 格式定义

pdyna. SetGroupByTable (<*GroupNo*, *strTableName* >);

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*strTableName*：字符串型，Table表格的名字。

#### 备注

（1）使用Table进行范围选择时，首先需借助dyna.CreateTable(<>)函数建立table 表格（见2.1.3节中的dyna.CreateTable函数）。Table中的坐标数据应安装顺时针或逆时针书写。

（2）对于二维颗粒（Type 为1），当颗粒中心坐标位于Table设定的多边形内部时，则进行分组；对于三维颗粒（Type为2），则当相互接触的两个颗粒分别位于Table设定的多变形的两侧，且当颗粒连接键与多边形的交点位于多边形内部时，则进行分组。

#### 范例

```javascript
//将名字为table1对应的范围内的颗粒设定为组号2
pdyna. SetGroupByTable (2, "table1");
```

<!--HJS_pdyna_SetGroupByID-->

### SetGroupByID方法

#### 说明

根据颗粒的ID号进行重新分组。

#### 格式定义

pdyna. SetGroupByID (<*GroupNo*, *id1*, *id2* >);

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*id1*, *id2*：整型，颗粒ID号的下限及上限。

#### 备注

无。

#### 范例

```javascript
//将第1到100号颗粒设定为组2
pdyna. SetGroupByID (2,1, 100);
```

<!--HJS_pdyna_SetGroupByLine-->

### SetGroupByLine方法

#### 说明

当颗粒与线段满足设定的关系时，对相应的颗粒进行重新分组。

#### 格式定义

该接口函数为重载函数，包含两种重载方式。

pdyna. SetGroupByLine (<*GroupNo*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*>);

此种模式下，当相互接触的两个颗粒所构建的接触键与输入线段相交，且交点位于线段内部时，将与连接键相连的两个颗粒进行分组。

pdyna. SetGroupByLine (<*GroupNo*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *ftol*>);

此种模式下，当颗粒中心到线段的距离小于容差时，对相应的颗粒进行分组。

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

*ftol*：浮点型，容差（单位：m）。

#### 备注

无。

#### 范例

```javascript
//线段起点坐标(0,0,0)，终点坐标(10,10,0)，将颗粒连接键与该线段相交且交点位于线段内的连接键两端的颗粒设定为组2
pdyna. SetGroupByLine (2,0,0,0,10,10,0);
//线段起点坐标(0,0,0)，终点坐标(10,10,0)，将到该线段的距离小于容差的颗粒设定为组2
pdyna. SetGroupByLine (2,0,0,0,10,10,0, 1e-3);
```

<!--HJS_pdyna_SetGroupByPlane-->

### SetGroupByPlane方法

#### 说明

当颗粒与平面满足设定的关系时，对相应的颗粒进行重新分组。

#### 格式定义

该接口函数为重载函数，包含两种重载方式。

pdyna.SetGroupByPlane (<*GroupNo*, *nx, ny, nz, cx, cy, cz>)*;

此种模式下，当相互接触的两个颗粒所构建的接触键与输入平面相交，将与连接键相连的两个颗粒进行分组。

pdyna. SetGroupByPlane (<*GroupNo*, *nx, ny, nz, cx, cy, cz*, *ftol*>);

此种模式下，当颗粒中心到平面的距离小于容差时，对相应的颗粒进行分组。

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*nx*、*ny*、*nz*：浮点型，平面单位法向量的分量。

*cx*、*cy*、*cz*：浮点型，平面上一点的坐标（单位：m）。

*ftol*：浮点型，容差（单位：m）。

#### 备注

无。

#### 范例

```javascript
//平面法向(0,0,1)，平面内一点(10,10,0)，将与该平面相交的连接键两端的颗粒设定为组2
pdyna. SetGroupByPlane (2,0,0,1,10,10,0);
//平面法向(0,0,1)，平面内一点(10,10,0)，将到该平面的距离小于容差的颗粒设定为组2
pdyna. SetGroupByPlane (2,0,0,1,10,10,0, 1e-3);
```

<!--HJS_pdyna_SetGroupByCircle-->

### SetGroupByCircle方法

#### 说明

当颗粒与圆满足设定的关系时，对相应的颗粒进行重新分组。

#### 格式定义

pdyna.SetGroupByCircle (<*GroupNo*, *nx, ny, nz, cx, cy, cz, frad>)*;

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*nx*、*ny*、*nz*：浮点型，圆单位法向量的分量。

*cx*、*cy*、*cz*：浮点型，圆心坐标（单位：m）。

*frad*：浮点型，圆的半径（单位：m）。

#### 备注

如果为二维颗粒（Type为1）时，当颗粒中心位于圆之内，则进行重新分组；对于三维颗粒（Type为2）时，当连接键与圆相交，且交点在圆内时，将连接键两侧的颗粒进行重新分组。

#### 范例

```javascript
//圆的法向(0,0,1)，圆的中心坐标(10,10,0)，将与该圆相交的颗粒设定为组2
pdyna. SetGroupByCircle(2,0,0,1,10,10,0);
```

<!--HJS_pdyna_SetGroupBySphere-->

### SetGroupBySphere方法

#### 说明

当颗粒体心位于内外同心球之间时，对相应的颗粒进行重新分组。

#### 格式定义

pdyna.SetGroupBySphere(<*GroupNo*, *fCx, fCy, fCz, fRad1, fRad2>)*;

#### 参数

*GroupNo*：整型，重新分组的颗粒组号。

*fCx*、*fCy*、*fCz*：浮点型，球心坐标（单位：m）。

*fRad1*、*fRad2*：浮点型，球的内半径及外半径（单位：m）。

#### 备注

无。

#### 范例

```javascript
//新组号为2，球心[0,0,0]，内半径1m，外半径2m
pdyna. SetGroupBySphere(2,0,0,0,1,2);
```

<!--HJS_pdyna_RandomizeGroup-->

### RandomizeGroup方法

#### 说明

随机颗粒的分组。

#### 格式定义

pdyna. RandomizeGroup (<*iTotal*, *fArrayValue*[], *iMainGroup* >);

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
pdyna. RandomizeGroup (total, value, 1);
```

<!--HJS_pdyna_GenElemFromParticle-->

### GenElemFromParticle方法

#### 说明

根据颗粒创建单元。

#### 格式定义

pdyna.GenElemFromParticle(<*edgelow*, *edgeup*, *randomCoeff*, *filename*>);

#### 参数

*edgelow*：整型，最小的边数（大于等于3）。

*edgeup*：整型，最大的边数（大于等于3）。

*randomCoeff*：浮点型，随机系数，介于0-1之间（如为0，则产生规则多边形）。

*filename*：字符串型，AnsysBlockDyna格式网格文件名（含路径）。

#### 备注

接口函数执行完毕后，在指定路径下产生AnsysBlockDyna格式的网格文件，目前只支持二维颗粒转化为三角形单元。具体转化时，以每个颗粒的体心为基准，构建多边形，并离散为一系列三角形。

#### 范例

```javascript
///产生边数在4-6之间的多边形，边长随机度为0.2，并将产生的网格存储于当前文件夹下，文件名为"feng.dat"。
pdyna.GenElemFromParticle(4, 6, 0.2, "feng.dat");
```

<!--HJS_pdyna_Export-->

### Export方法

#### 说明

导出PDyna格式的颗粒。

#### 格式定义

该接口函数为重载函数，包含3种形式。

将所有颗粒的信息全部导出，其函数形式为

pdyna.Export(<*FileName*>);

将指定组号下限及上限的颗粒进行导出，其函数形式为

pdyna.Export(<*groupL*, *groupU*, *FileName*>);

将指定坐标范围内的颗粒进行导出，其函数形式为

pdyna.Export(<*x0*, *x1*, *y0*, *y1*, *z0*, *z1*, *FileName*>);

#### 参数

*FileName*：字符串型，PDyna格式的颗粒文件的存储路径及文件名，如仅包含文件名，则在当前路径下存储文件。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
pdyna.Export("feng.dat");
pdyna.Export(1, 10, "particle1.dat");
pdyna.Export(-10,10, -1, 1, -0.5, 0.5, "particle2.dat");
```

<!--HJS_pdyna_MoveByCoord-->

### MoveByCoord方法

#### 说明

根据坐标范围对颗粒进行平移。

#### 格式定义

pdyna. MoveByCoord (<*ICx, ICy, ICz, x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*ICx, ICy, ICz*：浮点型，颗粒向三个方向平移的分量值（单位：m）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

各颗粒平移后的体心坐标可表示为：

颗粒最终的坐标 = 初始颗粒坐标 + 平移坐标。

#### 范例

```javascript
///对坐标范围内的颗粒向X正方向平移4m
pdyna. MoveByCoord (4, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_pdyna_MoveByGroup-->

### MoveByGroup方法

#### 说明

根据颗粒组号范围对颗粒进行平移。

#### 格式定义

pdyna. MoveByGroup (<*ICx, ICy, ICz, groupL*, *groupU* >);

#### 参数

*ICx, ICy, ICz*：浮点型，颗粒向三个方向平移的分量值（单位：m）。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

各颗粒平移后的体心坐标可表示为：

颗粒最终的坐标 = 初始颗粒坐标 + 平移坐标。

#### 范例

```javascript
///对组号1-4的颗粒向X正方向平移4m
pdyna. MoveByGroup (4, 0, 0, 1,4);
```

<!--HJS_pdyna_RotaByCoord-->

### RotaByCoord方法

#### 说明

根据坐标范围对颗粒进行旋转。

#### 格式定义

pdyna. RotaByCoord (<*RotaAngle, origin*[3]*, Normal*[3]*, x0, x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*RotaAngle*：浮点型，旋转角度。

*Origin*[3]：Array浮点型，包含3个分量，旋转的原点（单位：m）。

*Normal* [3]：Array浮点型，旋转轴的方向矢量。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

根据旋转的原点，旋转轴及旋转的角度，可计算出坐标范围内各颗粒经过旋转后的具体位置。

#### 范例

```javascript
///对坐标范围内的颗粒旋转15度
var origin = new Array(0.0,0.0,0.0);
var Normal = new Array(0.0,1.0,0.0);
pdyna.RotaByCoord (15, origin, Normal, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_pdyna_RotaByGroup-->

### RotaByGroup方法

#### 说明

根据坐标范围对颗粒进行旋转。

#### 格式定义

pdyna. RotaByGroup (<*RotaAngle, origin*[3]*, Normal*[3]*, groupL*, *groupU* >);

#### 参数

*RotaAngle*：浮点型，旋转角度。

*Origin*[3]：Array浮点型，包含3个分量，旋转的原点（单位：m）。

*Normal* [3]：Array浮点型，旋转轴的方向矢量。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

根据旋转的原点，旋转轴及旋转的角度，可计算出组号范围内各颗粒经过旋转后的具体位置。

#### 范例

```javascript
///对组号2-4之间的颗粒旋转15度
var origin = new Array(0.0,0.0,0.0);
var Normal = new Array(0.0,1.0,0.0);
pdyna.RotaByGroup (15, origin, Normal, 2,4);
```

<!--HJS_pdyna_ZoomByCoord-->

### ZoomByCoord方法

#### 说明

对坐标范围的颗粒半径进行缩放。

#### 格式定义

pdyna. ZoomByCoord (<*ZoomRatio, x0*, *x1*, *y0*, *y1*, *z0*, *z1*>);

#### 参数

*ZoomRatio*：浮点型，缩放比例，大于0小于1表示缩小，大于1表示放大。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

各颗粒缩放后的半径可表示为：

最终的颗粒半径 = 初始颗粒坐标 * *ZoomRatio*。

#### 范例

```javascript
///对坐标范围内的颗粒向X正方向平移4m
pdyna. ZoomByCoord (4, 0, 0, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_pdyna_ZoomByGroup-->

### ZoomByGroup方法

#### 说明

对组号范围内的颗粒半径进行缩放。

#### 格式定义

pdyna. ZoomByGroup (<*ZoomRatio, groupL*, *groupU* >);

#### 参数

*ZoomRatio*：浮点型，缩放比例，大于0小于1表示缩小，大于1表示放大。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

各颗粒缩放后的半径可表示为：

最终的颗粒半径 = 初始颗粒坐标 * *ZoomRatio*。

#### 范例

```javascript
///对组号1-4的颗粒向X正方向平移4m
pdyna. ZoomByGroup (4, 0, 0, 1,4);
```

<!--HJS_pdyna_Constitutive-->

## 颗粒本构及参数设置

本节主要介绍颗粒本构及参数的设置，具体见表3.2。

<div align = "center">表3.2颗粒本构及参数设置的相关函数</div>

<table>
    <tr>
        <th>序号</th><th>函数名</th><th>说明</th>
    </tr>
        <td>1</td><td>SetModel</td><td rowspan="2">设置颗粒的本构模型</td>
    </tr>
        <td>2</td><td>SetModelByCoord</td>
    </tr>
        <td>3</td><td>SetMat</td><td rowspan="2">设置颗粒的材料参数</td>
    </tr>
        <td>4</td><td>SetMatByCoord</td>
    </tr>
        <td>5</td><td>SetSingleMat</td><td>单独设置一个参数</td>
    </tr>
        <td>6</td><td>RandomizeMat</td><td>随机颗粒的材料参数</td>
    </tr>
        <td>7</td><td>SetICMat</td><td rowspan="5">单独设置颗粒与颗粒初始接触键上的材料参数</td>
    </tr>
        <td>8</td><td>SetICMatByCoord</td>
    </tr>
        <td>9</td><td>SetICMatByLine</td>
    </tr>
        <td>10</td><td>SetICMatByPlane</td>
    </tr>
        <td>11</td><td>SetICMatByTable</td>
    </tr>
</table>

说明：

（1）颗粒上的材料参数主要包括：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼及粘性阻尼等8个；颗粒与颗粒间初始连接键上的材料参数包括：法向刚度、切向刚度、粘聚力、内摩擦角及抗拉强度。

（2）当不单独施加颗粒与颗粒间初始连接键上的材料参数（包括刚度参数、强度参数）时（即不执行SetICMat相关接口函数时），颗粒与颗粒初始接触键之间的接触参数从颗粒参数中获取；如果单独施加，则初始接触上的参数取单独设定的值。

（3）如果两个颗粒的接触为非初始接触，则其参数（主要为接触刚度及摩擦系数）将从颗粒中获取。

颗粒的本构包含开挖本构、线弹性本构、脆性断裂本构、理想弹塑性本构、应变软化本构、指数衰减型损伤本构、Hertz接触本构及自定义本构等多种类型，本构的具体描述如表3.3所示。

<div align = "center">表3.3颗粒的本构模型及描述</div>

| **模型名称**               | **对应字符串** | **对应编号** | **关联命令及释义**                                           |
| -------------------------- | -------------- | ------------ | :----------------------------------------------------------- |
| 空模型（开挖模型）         | "none"         | 0            | 当某颗粒为空模型时，该颗粒将不执行接触搜索及接触力计算，并在界面展示时不显示该颗粒。 |
| 线弹性模型                 | "linear"       | 1            | 通过pdyna.SetMat或pdyna. SetICMat系列函数设置材料参数。      |
| Mohr-Coulomb脆性断裂模型   | "brittleMC"    | 2            | 通过pdyna.SetMat或pdyna. SetICMat系列函数设置材料参数。      |
| Mohr-Coulomb理想弹塑性模型 | "idealMC"      | 3            | 通过pdyna.SetMat或pdyna. SetICMat系列函数设置材料参数。      |
| Mohr-Coulomb应变软化模型   | "SSMC"         | 4            | 通过pdyna.SetMat或pdyna. SetICMat系列函数设置材料参数。  通过dyna.Set函数设置"  Interface_Soften_Value"，设置拉伸断裂应变及剪切断裂应变；当接触键的拉伸应变达到拉伸断裂应变，抗拉强度为0；当接触键的剪切应变达到剪切断裂应变，粘聚力为0。 |
| 指数衰减型损伤模型         | "Damage"       | 5            | 通过pdyna.SetMat或pdyna. SetICMat系列函数设置材料参数。  通过dyna.Set函数设置"  PP_FracEnergy"，设置拉伸断裂能及剪切断裂能。 |
| Hertz接触模型              | "Hertz"        | 6            | 通过pdyna.SetMat或pdyna. SetICMat系列函数设置材料参数。      |
| 自定义模型                 | "Custom"       | 1024         | 通过dyna.LoadUDF调入动态链接库。  通过dyna.SetUDFValue函数设置用户自定义的全局参数，供自定义本构模型使用。 |

<!--HJS_pdyna_SetModel-->

### SetModel方法

#### 说明

设置颗粒的接触本构模型。

#### 格式定义

该接口函数为重载函数，包含3种输入类型。

pdyna. SetModel(<*sModelName*>);

所有颗粒的本构模型均为*sModelName*。

pdyna. SetModel(<*sModelName*, *igroup*>);

组号为*igroup*的颗粒本构指定为*sModelName*。

pdyna. SetModel(<*sModelName*, *groupL*, *groupU*>);

组号大于等于*groupL*且小于等于*groupU*的颗粒的本构模型指定为*sModelName*。

#### 参数

*sModelName*：字符串型，颗粒的本构模型，必须为"none"、"linear"、"brittleMC"、"idealMC"、"SSMC"、"Damage"、"Hertz"、"Custom"其中之一。

*igroup*：整型，颗粒组号。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
pdyna. SetModel ("linear");
pdyna. SetModel ("linear", 1,11);
```

<!--HJS_pdyna_SetModelByCoord-->

### SetModelByCoord方法

#### 说明

当颗粒体心坐标位于指定范围内时设置颗粒的接触本构模型。

#### 格式定义

pdyna. SetModelByCoord(<*sModelName, x0, x1, y0, y1, z0, z1*>);

#### 参数

*sModelName*：字符串型，颗粒的本构模型，必须为"none"、"linear"、"brittleMC"、"idealMC"、"SSMC"、"Damage"、"Hertz"、"Custom"其中之一。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
pdyna. SetModelByCoord ("linear", -1e5, 1e5, -1e5, 1e5, -10, 10);
```

<!--HJS_pdyna_SetMat-->

### SetMat方法

#### 说明

设定颗粒的材料参数。

#### 格式定义

该接口函数为重载函数，包含3种形式。

pdyna. SetMat(<*density, young, poisson, tension, cohesion, friction, localdamp, viscdamp* >);

所有颗粒均设定指定的材料参数。

pdyna. SetMat (<*density, young, poisson, tension, cohesion, friction, localdamp, viscdamp*, *igroup*>);

组号为*igroup*的颗粒设定指定的材料参数。

pdyna. SetMat (<*density, young, poisson, tension, cohesion, friction, localdamp, viscdamp*, *groupL*, *groupU*>);

组号大于等于*groupL*且小于等于*groupU*的颗粒设定指定的材料参数。

#### 参数

*density*：浮点型，密度（单位：kg/m<sup>3</sup>）。

*young*：浮点型，弹性模量（单位：Pa）。

*poisson*：浮点型，泊松比。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

*localdamp*：浮点型，局部阻尼。

*viscdamp*：浮点型，粘性阻尼（临界阻尼比）。

*igroup*：整型，颗粒组号。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
pdyna. SetMat (2500, 3e10, 0.25, 1e6, 3e6, 35, 0.8, 0.0);
pdyna. SetMat (2500, 3e10, 0.25, 1e6, 3e6, 35, 0.8, 0.0, 2);
```

<!--HJS_pdyna_SetMatByCoord-->

### SetMatByCoord方法

#### 说明

当颗粒体心坐标位于设定范围内时设定该颗粒的材料参数。

#### 格式定义

pdyna. SetMatByCoord(<*density, young, poisson, tension, cohesion, friction, localdamp, viscdamp, x[2], y[2], z[2]* >);

#### 参数

*density*：浮点型，密度（单位：kg/m<sup>3</sup>）。

*young*：浮点型，弹性模量（单位：Pa）。

*poisson*：浮点型，泊松比。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

*localdamp*：浮点型，局部阻尼。

*viscdamp*：浮点型，粘性阻尼（临界阻尼比）。

*x[2]**，**y[2]**，**z[2]*：Array浮点型，包含2个分量，分别表示X坐标、Y坐标及Z坐标的下限及上限。

#### 备注

#### 范例

```javascript
var x = [-1e5, 1e5];
var y = [-1e5, 1e5];
var z = [-1e5, 1e5];
pdyna. SetModelByCoord (2500, 3e10, 0.25, 1e6, 3e6, 35, 0.8, 0.0, x, y, z);
```

<!--HJS_pdyna_SetSingleMat-->

### SetSingleMat方法

#### 说明

单独设定颗粒的某一个材料参数。

#### 格式定义

该接口函数为重载函数，包含3种形式。

pdyna. SetSingleMat(<*sMatName, fValue*>);

所有颗粒均设定指定的材料参数。

pdyna. SetMat (<*sMatName, fValue*, *igroup*>);

组号为*igroup*的颗粒设定指定的材料参数。

pdyna. SetMat (<*sMatName, fValue*, *groupL*, *groupU*>);

组号大于等于*groupL*且小于等于*groupU*的颗粒设定指定的材料参数。

#### 参数

*sMatName*：字符串型，材料参数的名称，只能为"Density"、"Young"、"Poisson"、"Kn"、"Kt"、"Cohesion"、"Tension"、"FrictionAngle"、"LocalDamp"、"ViscDamp"其中之一

 *fValue*：浮点型，材料参数的取值。

*igroup*：整型，颗粒组号。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
pdyna. SetSingleMat ("Cohesion", 1e6, 1,11);
```

<!--HJS_pdyna_RandomizeMat-->

### RandomizeMat方法

#### 说明

对颗粒的材料参数进行随机。

#### 格式定义

pdyna.RandomizeMat(<*MatName, RandomType, pra1, pra2, groupL, groupU*>);

#### 参数

*MatName*：字符串型，需要随机的材料参数的名字，必须为"density"、"young"、"poisson"、"cohesion"、"tension"、"friction"其中之一。

*RandomType*：字符串型，随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*pra1*、*pra2*：浮点型，随机参数。如果分布模式为"*uniform*"， *pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为"*normal*"， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为"*weilbull*"， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

（1）  当随机量为density时，程序内部自动更新了重力。

（2）  当随机量为弹性模量或者泊松比时，程序内部自动更新了虚质量。

（3）  正态分布时，如果产生的随机数小于0.0，强制等于0.0。

（4）  该函数产生的随机参数为绝对值，不需要提前设定基础材料参数。

（5）  对于内摩擦角，是对其角度进行随机。

#### 范例

```javascript
//对组号1至11的颗粒的粘聚力进行均匀分布模式的随机，粘聚力下限为1MPa，上限为10MPa
pdyna.RandomizeMat ("cohesion", "uniform", 1e6, 1e7, 1,11);
```

<!--HJS_pdyna_SetICMat-->

### SetICMat方法

#### 说明

设定颗粒间初始接触键的材料参数。

#### 格式定义

该接口函数为重载函数，包含3种形式。

pdyna. SetICMat(<*kn, kt, tension, cohesion, friction*>);

所有颗粒间初始接触键均设定指定的材料参数。

pdyna. SetICMat (<*kn, kt, tension, cohesion, friction*, *igroup*>);

若初始接触键两侧的颗粒组号均为jgroup，则设定接触键材料参数。

pdyna. SetICMat (<*kn, kt, tension, cohesion, friction*, *igroup*, *jgroup* >);

若初始接触键两侧颗粒组号分别为igroup及jgroup，则设定接触键材料参数。

#### 参数

*kn*：浮点型，初始接触键单位面积法向刚度（单位：Pa/m）。

*kt*：浮点型，初始接触键单位面积切向刚度（单位：Pa/m）。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

#### 备注

当输入两个组号（*igroup*, *jgroup*）时,如果*igroup*及*jgroup*均为0，表示接触键两侧颗粒具有相同组号时赋值，如果*igroup*及*jgroup*均为-1，表示接触键两侧颗粒不同组号时赋值。

#### 范例

```javascript
pdyna. SetICMat (1e9, 5e8, 1e6, 3e6, 30);
pdyna. SetICMat (1e9, 5e8, 1e6, 3e6, 30, -1, -1);
```

<!--HJS_pdyna_SetICMatByCoord-->

### SetICMatByCoord方法

#### 说明

当初始接触键两侧任意一个颗粒的体心坐标位于设定坐标范围内，设定该初始接触键的材料参数。

#### 格式定义

pdyna. SetICMatByCoord(<*kn, kt, tension, cohesion, friction, x0, x1, y0, y1, z0, z1*>);

#### 参数

*kn*：浮点型，初始接触键单位面积法向刚度（单位：Pa/m）。

*kt*：浮点型，初始接触键单位面积切向刚度（单位：Pa/m）。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
pdyna. SetICMatByCoord(1e9, 5e8, 1e6, 3e6, 30, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
```

<!--HJS_pdyna_SetICMatByLine-->

### SetICMatByLine方法

#### 说明

当颗粒初始接触键与对应的线段相交时，设定该初始接触键的材料参数。

#### 格式定义

pdyna. SetICMatByLine(<*kn, kt, tension, cohesion, friction, fArrayCoord1[3], fArrayCoord2[3]* >);

#### 参数

*kn*：浮点型，初始接触键单位面积法向刚度（单位：Pa/m）。

*kt*：浮点型，初始接触键单位面积切向刚度（单位：Pa/m）。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

*fArrayCoord1*：Array浮点型，包含3个分量，线段上一点坐标（单位：m）。

*fArrayCoord2*：Array浮点型，包含3个分量，线段上另一点坐标（单位：m）。

#### 备注

#### 范例

```javascript
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(0, 1, 0);
pdyna. SetICMat (1e9, 5e8, 1e6, 3e6, 30, coord1, coord2);
```

<!--HJS_pdyna_SetICMatByPlane-->

### SetICMatByPlane方法

#### 说明

当颗粒初始接触键与对应的平面相交时，设定该初始接触键的材料参数。

#### 格式定义

pdyna.SetICMatByLine(<*kn, kt, tension, cohesion, friction, fArrayNormal[3]**，**fArrayOrigin[3]* >);

#### 参数

*kn*：浮点型，初始接触键单位面积法向刚度（单位：Pa/m）。

*kt*：浮点型，初始接触键单位面积切向刚度（单位：Pa/m）。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

*fArrayNormal*：Array浮点型，平面法向3个分量。

*fArrayOrigin*：Array浮点型，包含3个分量，平面一点的坐标（单位：m）。

#### 备注

#### 范例

```javascript
//平面上的一点
var origin = new Array(1, 1, 1);
//平面法向
var normal = new Array(0, 1, 0);
pdyna. SetICMat (1e9, 5e8, 1e6, 3e6, 30, normal, origin);
```

<!--HJS_pdyna_SetICMatByTable-->

### SetICMatByTable方法

#### 说明

对于二维颗粒，当初始接触键两侧的任意一个颗粒位于Table中数据围成的多边形内部时，则设定材料参数；对于三维颗粒，当颗粒初始接触键与对应的Table中数据围成的多边形相交时，设定该初始接触键的材料参数。

#### 格式定义

pdyna. SetICMatByTable(<*kn, kt, tension, cohesion, friction, sTableName*>);

#### 参数

*kn*：浮点型，初始接触键单位面积法向刚度（单位：Pa/m）。

*kt*：浮点型，初始接触键单位面积切向刚度（单位：Pa/m）。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

*sTableName*：字符串型，Table表格的名字。

#### 备注

#### 范例

```javascript
pdyna. SetICMatByTable (1e9, 5e8, 1e6, 3e6, 30, "jointTable");
```

<!--HJS_pdyna_BoundCond-->

## 颗粒初边值条件设置

本节主要介绍颗粒初边值条件的设置，接口函数具体见表3.4。

<div align = "center">表3.4颗粒本构及参数设置的相关函数</div>

<table>
    <tr>
        <th>序号</th><th>函数名</th><th>说明</th>
    </tr>
        <td>1</td><td>FixV</td><td rowspan="5">固定颗粒的平动速度</td>
    </tr>
        <td>2</td><td>FixVByGroup</td>
    </tr>
        <td>3</td><td>FixVByCoord</td>
    </tr>
        <td>4</td><td>FixVByPlane</td>
    </tr>
        <td>5</td><td>FixVByCylinder</td>
    </tr>
        <td>6</td><td>AdvFixV</td><td rowspan="4">按空间梯度固定颗粒的平动速度</td>
    </tr>
        <td>7</td><td>AdvFixVByCoord</td>
    </tr>
        <td>8</td><td>AdvFixVByPlane</td>
    </tr>
        <td>9</td><td>AdvFixVByCylinder</td>
    </tr>
        <td>10</td><td>FreeV</td><td rowspan="5">解除颗粒的平动速度约束</td>
    </tr>
        <td>11</td><td>FreeVByGroup</td>
    </tr>
        <td>12</td><td>FreeVByCoord</td>
    </tr>
        <td>13</td><td>FreeVByPlane</td>
    </tr>
        <td>14</td><td>FreeVByCylinder</td>
    </tr>
        <td>15</td><td>FixRotaV</td><td>约束颗粒的转动速度</td>
    </tr>
        <td>16</td><td>FreeRotaV</td><td>解除颗粒的转动速度约束</td>
    </tr>
        <td>17</td><td>InitCondByGroup</td><td>设定颗粒位移、速度的初始值</td>
    </tr>
        <td>18</td><td>InitCondByGroup</td><td>设定颗粒位移、速度的初始值</td>
    </tr>
        <td>19</td><td>ApplyGravity</td><td>单独施加颗粒的重力</td>
    </tr>
        <td>20</td><td>ApplyForce</td><td>在颗粒上施加节点力</td>
    </tr>
        <td>21</td><td>ApplyFaceForce</td><td>在颗粒上施加面力</td>
    </tr>
        <td>22</td><td>ApplyMoment</td><td>在颗粒上施加转矩</td>
    </tr>
        <td>23</td><td>ApplyDynaCondSinByCoord</td><td rowspan="3">在颗粒上施加动态边界条件</td>
    </tr>
        <td>24</td><td>ApplyDynaCondLineByCoord</td>
    </tr>
        <td>25</td><td>ApplyDynaCondFileByCoord</td>
    </tr>
        <td>26</td><td>SetQuietBoundByCoord</td><td>施加无反射边界条件（静态边界条件）</td>
    </tr>
        <td>27</td><td>InheritInfoFromBlock</td><td>从块体中继承速度、位置等信息</td>
    </tr>
        <td>28</td><td>ExportInfo</td><td>输出vtk及文本型的颗粒信息</td>
    </tr>
</table>

<!--HJS_pdyna_FixV-->


### FixV方法

#### 说明

固定颗粒的平动速度。

#### 格式定义

pdyna.FixV(<*strDirection*, *fValue*, *RegDir*, *fLow*, *fUp* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*RegDir*：字符串型，控制方向字符串，可以是以下3种字符串之一："x"、"y"、"z"。

*fLow*、*fUp*：浮点型，对应控制方向的下限值及上限值（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FixV ("xyz", 0.0, "x", -0.01, 0.01);
```

<!--HJS_pdyna_FixVByGroup-->

### FixVByGroup方法

#### 说明

当颗粒组号位于下限及上限之间，固定该颗粒的平动速度。

#### 格式定义

pdyna.FixVByGroup(<strDirection, fValue, iGrpL, iGrpU >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*iGrpL, iGrpU*：整型，颗粒组号的下限及上限。

#### 范例

```javascript
pdyna.FixVByGroup ("xyz", 0.0, 1, 3);
```

<!--HJS_pdyna_FixVByCoord-->

### FixVByCoord方法

#### 说明

当颗粒体心坐标位于坐标范围内时，固定颗粒的平动速度。

#### 格式定义

pdyna.FixVByCoord(<*strDirection*, *fValue*, *x0, x1, y0, y1, z0, z1* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FixVByCoord("xyz", 0.0, -0.01, 0.01, -1e4, 1e4, -1e4, 1e4);
```

<!--HJS_pdyna_FixVByPlane-->

### FixVByPlane方法

#### 说明

当颗粒体心坐标到平面的距离小于容差时固定颗粒的平动速度。

#### 格式定义

pdyna.FixVByPlane(<*strDirection*, *fValue*, *fNormal[3], fOrigin[3], fTol*>);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*fNormal*：Array浮点型，包含3个分量，指定平面的单位法向量。

*fOrigin*：Array浮点型，包含3个分量，平面上一点的坐标（单位：m）。

*fTol*：浮点型，容差，到平面的距离（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
var n = new Array(0.0,1.0,0.0);
var origin = new Array(0.0,0.0,0.0);
pdyna.FixVByPlane("xyz", 0.0, n, origin, 1e-2);
```

<!--HJS_pdyna_FixVByCylinder-->

### FixVByCylinder方法

#### 说明

当颗粒体心坐标位于两个圆柱面内部时固定颗粒的平动速度。

#### 格式定义

pdyna.FixVByCylinder(<*strDirection*, *fValue*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*>);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FixVByCylinder("xyz", 0.0, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 1.0, 5.0);
```

<!--HJS_pdyna_AdvFixV-->

### AdvFixV方法

#### 说明

固定颗粒的平动速度（可以考虑固定速度值的空间梯度变化）。

#### 格式定义

pdyna.AdvFixV(<*strDirection*, *fValue, Grad[3], RegDir*, *fLow*, *fUp* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*Grad*[3]：Array浮点型，包含3个分量，沿着x、y、z三个坐标方向的梯度。

*RegDir*：字符串型，控制方向字符串，可以是以下3种字符串之一："x"、"y"、"z"。

*fLow*、*fUp*：浮点型，对应控制方向的下限值及上限值（单位：m）。

#### 备注

（1）  只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

（2）  施加至某一颗粒的最终速度为：*Vel* = *fValue* + *Grad*[0]×*x* + *Grad*[1]×*y* + Grad[2]×*z*。（x、y、z为颗粒体心坐标值）

#### 范例

```javascript
var grad = new Array (10.0, 0.0, 0.0);
pdyna.AdvFixV ("xyz", 0.1, grad, "x", -0.01, 0.01);
```

<!--HJS_pdyna_AdvFixVByCoord-->

### AdvFixVByCoord方法

#### 说明

当颗粒体心坐标位于坐标范围内时，固定颗粒的平动速度（可以考虑固定速度值的空间梯度变化）。

#### 格式定义

pdyna.AdvFixVByCoord(<*strDirection*, *fValue*, *Grad[3], x0, x1, y0, y1, z0, z1* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*Grad*[3]：Array浮点型，包含3个分量，沿着x、y、z三个坐标方向的梯度。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

（1）  只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

（2）  施加至某一颗粒的最终速度为：*Vel* = *fValue* + *Grad*[0]×*x* + *Grad*[1]×*y* + Grad[2]×*z*。（x、y、z为颗粒体心坐标值）

#### 范例

```javascript
var grad = new Array (10.0, 0.0, 0.0);
pdyna.AdvFixVByCoord("xyz", 0.1, grad, -0.01, 0.01, -1e4, 1e4, -1e4, 1e4);
```

<!--HJS_pdyna_AdvFixVByPlane-->

### AdvFixVByPlane方法

#### 说明

当颗粒体心坐标到平面的距离小于容差时固定颗粒的平动速度（可以考虑固定速度值的空间梯度变化）。

#### 格式定义

pdyna.AdvFixVByPlane(<*strDirection*, *fValue*, *Grad[3], fNormal[3], fOrigin[3], fTol*>);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*Grad*[3]：Array浮点型，包含3个分量，沿着x、y、z三个坐标方向的梯度。

*fNormal*：Array浮点型，包含3个分量，指定平面的单位法向量。

*fOrigin*：Array浮点型，包含3个分量，平面上一点的坐标（单位：m）。

*fTol*：浮点型，容差，到平面的距离（单位：m）。

#### 备注

（1）  只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

（2）  施加至某一颗粒的最终速度为：*Vel* = *fValue* + *Grad*[0]×*x* + *Grad*[1]×*y* + Grad[2]×*z*。（x、y、z为颗粒体心坐标值）

#### 范例

```javascript
var n = new Array(0.0,1.0,0.0);
var origin = new Array(0.0,0.0,0.0);
var grad = new Array (10.0, 0.0, 0.0);
pdyna.AdvFixVByPlane("xyz", 0.1,grad, n, origin, 1e-2);
```

<!--HJS_pdyna_AdvFixVByCylinder-->

### AdvFixVByCylinder方法

#### 说明

当颗粒体心坐标位于两个圆柱面内部时固定颗粒的平动速度（可以考虑固定速度值的空间梯度变化）。

#### 格式定义

pdyna.AdvFixVByCylinder(<*strDirection*, *fValue*, *Grad[3],* *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*>);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：m/s）。

*Grad*[3]：Array浮点型，包含3个分量，沿着x、y、z三个坐标方向的梯度。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

（1）  只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

（2）  施加至某一颗粒的最终速度为：*Vel* = *fValue* + *Grad*[0]×*x* + *Grad*[1]×*y* + Grad[2]×*z*。（x、y、z为颗粒体心坐标值）

#### 范例

```javascript
var grad = new Array (10.0, 0.0, 0.0);
pdyna.AdvFixVByCylinder("xyz", 0.1, grad, 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 1.0, 5.0);
```

<!--HJS_pdyna_FreeV-->

### FreeV方法

#### 说明

解除颗粒的平动速度约束。

#### 格式定义

pdyna.FreeV(<*strDirection*, *RegDir*, *fLow*, *fUp* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*RegDir*：字符串型，控制方向字符串，可以是以下3种字符串之一："x"、"y"、"z"。

*fLow*、*fUp*：浮点型，对应控制方向的下限值及上限值（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FreeV ("xyz", "x", -0.01, 0.01);
```

<!--HJS_pdyna_FreeVByGroup-->

### FreeVByGroup方法

#### 说明

当颗粒组号位于下限及上限之间，解除该颗粒的平动速度约束。

#### 格式定义

pdyna.FreeVByGroup(<*strDirection*, *iGrpL, iGrpU* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*iGrpL, iGrpU*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
pdyna.FreeVByGroup ("xyz", 2, 2);
```

<!--HJS_pdyna_FreeVByCoord-->

### FreeVByCoord方法

#### 说明

当颗粒体心坐标位于坐标范围内时，解除颗粒的平动速度约束。

#### 格式定义

pdyna.FreeVByCoord(<*strDirection*, *x0, x1, y0, y1, z0, z1* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FreeVByCoord("xyz", -0.01, 0.01, -1e4, 1e4, -1e4, 1e4);
```

<!--HJS_pdyna_FreeVByPlane-->

### FreeVByPlane方法

#### 说明

当颗粒体心坐标到平面的距离小于容差时解除颗粒的平动速度约束。

#### 格式定义

pdyna.FreeVByPlane(<*strDirection*, *fNormal[3], fOrigin[3], fTol*>);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fNormal*：Array浮点型，包含3个分量，指定平面的单位法向量。

*fOrigin*：Array浮点型，包含3个分量，平面上一点的坐标（单位：m）。

*fTol*：浮点型，容差，到平面的距离（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
var n = new Array(0.0,1.0,0.0);
var origin = new Array(0.0,0.0,0.0);
pdyna.FreeVByPlane("xyz", n, origin, 1e-2);
```

<!--HJS_pdyna_FreeVByCylinder-->

### FreeVByCylinder方法

#### 说明

当颗粒体心坐标位于两个圆柱面内部时解除颗粒的平动速度约束。

#### 格式定义

pdyna.FreeVByCylinder(<*strDirection*, *x0*, *y0*, *z0*, *x1*, *y1*, *z1*, *fRad1*, *fRad2*>);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*x0*、*y0*、*z0*：浮点型，圆柱轴线某一端的坐标（单位：m）。

*x1*、*y1*、*z1*：浮点型，圆柱轴线另一端的坐标（单位：m）。

*fRad1*：浮点型，圆柱体内半径（单位：m）。

*fRad2*：浮点型，圆柱体外半径（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FreeVByCylinder("xyz", 0.0, 0.0, 0.0, 10.0, 0.0, 0.0, 1.0, 5.0);
```

<!--HJS_pdyna_FixRotaV-->

### FixRotaV方法

#### 说明

固定颗粒的转动速度。

#### 格式定义

pdyna.FixRotaV(<*strDirection*, *fValue*, *RegDir*, *fLow*, *fUp* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*fValue*：浮点型，固定的速度值（单位：度/秒）。

*RegDir*：字符串型，控制方向字符串，可以是以下3种字符串之一："x"、"y"、"z"。

*fLow*、*fUp*：浮点型，对应控制方向的下限值及上限值（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FixRotaV ("xyz", 0.0, "x", -0.01, 0.01);
```

<!--HJS_pdyna_FreeRotaV-->

### FreeRotaV方法

#### 说明

解除颗粒的转动速度。

#### 格式定义

pdyna.FixRotaV(<*strDirection*, *RegDir*, *fLow*, *fUp* >);

#### 参数

*strModelName*：字符串型，约束方向名。可以是以下7种字符串之一："x"、"y"、"z"、"xy"、"yz"、"zx"、"xyz"。

*RegDir*：字符串型，控制方向字符串，可以是以下3种字符串之一："x"、"y"、"z"。

*fLow*、*fUp*：浮点型，对应控制方向的下限值及上限值（单位：m）。

#### 备注

只有当颗粒的体心坐标位于设定的坐标范围内时，才能被选中。

#### 范例

```javascript
pdyna.FreeRotaV ("xyz", "x", -0.01, 0.01);
```

<!--HJS_pdyna_InitCondByGroup-->

### InitCondByGroup方法

#### 说明

当颗粒组号位于下限及上限之间，设定该颗粒的初始值。

#### 格式定义

pdyna.InitCondByGroup (<*sIniType, fValue[3], groupL, groupU* >);

#### 参数

*sIniType*：字符串型，颗粒信息初始的类型，只能为"displace"、"velocity"、"rotadisp"、"rotavel"其中之一。

*fValue[3]*：Array浮点型，包含3个分量，三个方向的初始化值。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

#### 范例

```javascript
var fvalue = new Array(0.0, 0.0, 0.0);
pdyna.InitCondByGroup ("displace", fvalue, 1,100);
```

<!--HJS_pdyna_InitState-->

### InitState方法

#### 说明

清除颗粒的破坏状态，恢复至初始接触状态。

#### 格式定义

包含3种调用方式。

第一种，所有颗粒均进行初始化。

pdyna.InitState();

第二种，某一特定的组号进行初始化。

pdyna.InitState(<*iGroup*>);

第三种，位于组号下限及上限之间的颗粒进行初始化。

pdyna.InitState(<*groupL, groupU* >);

#### 参数

*iGroup*：整型，颗粒组号。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

l 主要初始化内容包括：颗粒自身的破坏指标，颗粒与颗粒之间、颗粒与块体之间、颗粒与刚性面之间的破坏指标。

l 此命令执行后，将当前所有接触对均设为初始接触，此后可重新设置颗粒接触的强度。

#### 范例

```javascript
//对组号1-100之间的颗粒进行状态初始化
pdyna.InitState(1,100);
```

<!--HJS_pdyna_ApplyGravity-->

### ApplyGravity方法

#### 说明

单独施加颗粒的重力。

#### 格式定义

pdyna.ApplyGravity(*gx, gy, gz*);

#### 参数

*gx*、*gy*、*gz*：浮点型，三个方向的重力加速度值（单位：m/s<sup>2</sup>）。

#### 备注

在使用pdyna.SetMat类接口函数进行颗粒材料参数施加时，已经根据全局重力加速度（通过dyna.Set("Gravity")进行设置）自动计算了颗粒的重力。如果想使用局部重力加速度值进行颗粒重力的单独设置，可利用本接口函数。

#### 范例

```ja
pdyna.ApplyGravity (0.0, -9.8, 0.0);
```

<!--HJS_pdyna_ApplyForce-->

### ApplyForce方法

#### 说明

当颗粒体心坐标位于坐标范围内时，在该颗粒上设置集中力。

#### 格式定义

pdyna.ApplyForce(<f*Value[3], x0, x1, y0, y1, z0, z1* >);

#### 参数

f*Value [3]*：Array浮点型，包含3个分量，三个方向的集中力（单位：N）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
var fvalue = [1e5, 0.0, 0.0];
pdyna.ApplyForce (fvalue, -1e5, 1e5, -0.01, 0.01, -1e5, 1e5);
```

<!--HJS_pdyna_ApplyFaceForce-->

### ApplyFaceForce方法

#### 说明

当颗粒体心坐标位于坐标范围内时，在该颗粒上设置面力。

#### 格式定义

pdyna.ApplyFaceForce(<f*Value[3], x0, x1, y0, y1, z0, z1*>);

#### 参数

f*Value [3]*：Array浮点型，包含3个分量，三个方向的面力（单位：Pa）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

设置面力时，输入值的量纲为应力的量纲。该输入的应力需要乘以颗粒的等效面积转化为节点力后施加于颗粒上。二维颗粒的等效面积为颗粒直径，三维颗粒的等效面积为颗粒的最大截面积（赤道面积）。

#### 范例

```javascript
var fvalue = [1e5, 0.0, 0.0];
pdyna.ApplyFaceForce (fvalue, -1e5, 1e5, -0.01, 0.01, -1e5, 1e5);
```

<!--HJS_pdyna_ApplyMoment-->

### ApplyMoment方法

#### 说明

当颗粒体心坐标位于坐标范围内时，在该颗粒上设置转矩。

#### 格式定义

pdyna.ApplyMoment(<f*Value[3], x0, x1, y0, y1, z0, z1* >);

#### 参数

f*Value [3]*：Array浮点型，包含3个分量，三个方向的力矩（单位：N·m）。

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

#### 范例

```javascript
var fvalue = [1e5, 0.0, 0.0];
pdyna.ApplyMoment (fvalue, -1e5, 1e5, -0.01, 0.01, -1e5, 1e5);
```

<!--HJS_pdyna_ApplyDynaCondSinByCoord-->

### ApplyDynaCondSinByCoord方法

#### 说明

当颗粒体心坐标位于设定坐标范围内时，在该颗粒上施加正弦形式的动态边界条件。

#### 格式定义

pdyna.ApplyDynaCondSinByCoord (<*name, coeff[3], fKesai, fAmp, fCycle, fIniPhase, fBegTime, fFinTime, x[2], y[2], z[2]*>);

#### 参数

*name*：字符串型，施加类型，包含2种形式："velocity"、"force"

*coeff*：浮点型，三个方向的载荷系数（*λi*）。

*fKesai*：浮点型，衰减指数。

*fAmp*：浮点型，振幅（单位：m/s或N）。

*fCycle*：浮点型，周期（单位：s）。

*fIniPhase*：浮点型，初相位

*fBegTime*：浮点型，开始时间（单位：s）。

*fFinTime*：浮点型，结束时间（单位：s）。

*x*[2]、*y*[2]、*z*[2]：浮点型，坐标的下限及上限（单位：m）。

#### 备注

当前时间位于*fBegTime*与*fFinTime*之间时，根据以下公式计算当前载荷值。
$$
{F_i} = {\lambda _i}A{e^{ - \xi wt}}\sin (wt + \phi ),w = \frac{{2\pi }}{T}
$$
其中，*Fi*为第*i*个方向的载荷值（速度、节点力），*λi*即为每个方向的载荷系数，衰减项  、振幅  、周期  、初相位  、*t*为当前时间。

#### 范例

```javascript
//设定三个方向载荷系数
var coeff=new Array(1.0, 0, 0)
//x方向下限及上限
var x= new Array(-0.01,0.01);
//y方向下限及上限
var y= new Array(-1.0,1.0);
//z方向下限及上限
var z= new Array(-1.0,10.0);
//设定动态速度边界
pdyna. ApplyDynaCondSinByCoord ("force", coeff, 0.0, 1e5, 0.1, 0.0, 0.0, 1.0, x, y, z);
```

<!--HJS_pdyna_ApplyDynaCondLineByCoord-->

### ApplyDynaCondLineByCoord方法

#### 说明

当颗粒体心坐标位于设定坐标范围内时，在该颗粒上施加线段形式的动态边界条件。

#### 格式定义

pdyna.ApplyDynaCondLineByCoord(<*name, coeff[3], fT0, fV0, fT1, fV1,x[2], y[2], z[2]*>);

#### 参数

*name*：字符串型，施加类型，包含2种形式："velocity"、"force"

*coeff*：浮点型，三个方向的载荷系数（*λi*）。

*fT0*：浮点型，线段起始时间（单位：s）。

*fV0*：浮点型，线段起始值（单位：m/s或N或Pa）。

*fT1*：浮点型，线段结束时间（单位：s）。

*fV1*：浮点型，线段结束值（单位：m/s或N或Pa）。

*x*[2]、*y*[2]、*z*[2]：浮点型，坐标的下限及上限（单位：m）。

#### 备注

如果当前时间位于*fT0*与*fT1*之间，根据以下公式计算当前载荷值，为
$$
{F_i} = {\lambda _i}\left[ {\frac{{fV1 - fV0}}{{fT1 - fT0}}(t - fT0) + fV0} \right]
$$
其中，*Fi*为第*i*个方向的载荷值（速度、节点力），*λi*即为每个方向的载荷系数，*t*为当前时间。

#### 范例

```javascript
//设定三个方向载荷系数
var coeff=new Array(1.0, 0, 0)
//x方向下限及上限
var x= new Array(-0.01,0.01);
//y方向下限及上限
var y= new Array(-1.0,1.0);
//z方向下限及上限
var z= new Array(-1.0,10.0);
//设定动态速度边界
pdyna.ApplyDynaCondLineByCoord ("force", coeff, 0.0, 0.0, 1.0, 1e5, x, y, z);
```

<!--HJS_pdyna_ApplyDynaCondFileByCoord-->

### ApplyDynaCondFileByCoord方法

#### 说明

当颗粒体心坐标位于设定坐标范围内时，在该颗粒上施加动态边界条件，载荷序列从文本文件读入。

#### 格式定义

pdyna.ApplyDynaCondFileByCoord (<*name, coeff[3], fname, x[2], y[2],z[2]*>);

#### 参数

*name*：字符串型，施加类型，包含2种形式："velocity"、"force"

*coeff*：浮点型，三个方向的载荷系数（*λi*）。

fname：字符串型，文本文件名。

*x*[2]、*y*[2]、*z*[2]：浮点型，坐标的下限及上限（单位：m）。

#### 备注

文本文件的格式类型为：第一行为载荷序列个数，第二行开始为载荷施加的时间（单位：s）及施加的值（单位：m/s或N或Pa），中间用空格分开（载荷格式如下图）。

![](images/GDEM_Pdyna_5.png)

<div align = "center">外部导入载荷格式</div>

#### 范例

```javascript
//设定三个方向载荷系数
var coeff=new Array(1.0, 0, 0)
//x方向下限及上限
var x= new Array(-0.01,0.01);
//y方向下限及上限
var y= new Array(-1.0,1.0);
//z方向下限及上限
var z= new Array(-1.0,10.0);
//设定动态速度边界
pdyna.ApplyDynaCondFileByCoord ("force", coeff, "dynaData.txt", x, y, z);
```

<!--HJS_pdyna_ApplyQuietBoundByCoord-->

### ApplyQuietBoundByCoord方法

#### 说明

当颗粒体心坐标位于设定坐标范围内时，在该颗粒上施加无反射边界条件（静态边界条件）。

#### 格式定义

pdyna.ApplyQuietBoundByCoord(<*x0, x1, y0, y1, z0, z1*>);

#### 参数

*x0*、*x1*：浮点型，选择范围的x坐标下限及上限（单位：m）。

*y0*、*y1*：浮点型，选择范围的y坐标下限及上限（单位：m）。

*z0*、*z1*：浮点型，选择范围的z坐标下限及上限（单位：m）。

#### 备注

当颗粒设定为静态边界条件的颗粒后，在进行动态计算时，将根据颗粒在三个方向的速度自动在三个方向上施加速度反力，实现应力波的透射过程。

#### 范例

```javascript
pdyna.ApplyQuietBoundByCoord(-1e5, 1e5, -0.01, 0.01, -1e5, 1e5);
```

<!--HJS_pdyna_InheritInfoFromBlock-->

### InheritInfoFromBlock方法

#### 说明

颗粒信息从指定组号的块体单元中继承，继承的内容位置、速度等。

#### 格式定义

pdyna. InheritInfoFromBlock (<*groupL, groupU* [*, iDelFlag*]>);

#### 参数

*groupL*：整型，组号下限。

*groupU*：整型，组号上限。

*iDelFlag*：整型，颗粒从块体中继承速度后是否直接置空单元（一种"删除操作"），0-不置空，1-置空。可以不写该参数，默认为1。

#### 备注

（1）从块体中继承信息时，颗粒的模型可以为任意模型（包括空模型"none"），但块体的模型必须为非空模型。

（2）当颗粒体心位移某块体内部，且该块体的组号位于上下限范围内时，才执行继承操作。

#### 范例

```javascript
pdyna. InheritInfoFromBlock (1, 10);
```

<!--HJS_pdyna_ExportInfo-->

### ExportInfo方法

#### 说明

导出颗粒的材料参数及边界条件等信息，供第三方软件查看。

#### 格式定义

pdyna.ExportInfo([*strFileName*]);

#### 参数

*strFileName*：字符串型，文件名（含路径，不含扩展名），可以不写，默认为"PDyna"。

#### 备注

执行后将在指定路径下产生两个文件，一个是扩展名为vtk格式的文件，可被Paraview软件读入并查看数据；一个是扩展名为dat的数据，可以被origin或excel等软件读入，进行数据处理。

#### 范例

```javascript
pdyna.ExportInfo();
pdyna.ExportInfo("ThisPrj");
```



<!--HJS_pdyna_glob_mat_set_bind-->

## 全局材料参数设置及关联

本节主要介绍一些与Pdyna软件相关的全局材料设置及关联的接口脚本，主要服务于MPM模块、PCMM模块中一些特殊材料参数的设置及关联。具体的接口函数如表3.5所示。

<div align = "center">表3.5全局材料参数设置及关联相关函数</div>

| 序号 | 函数名              | 说明                           |
| ---- | ------------------- | ------------------------------ |
| 1    | SetJWLSource        | 全局JWL爆炸模型参数设置。      |
| 2    | SetJWLGasLeakMat    | 设置JWL爆源模型气体逸散参数。  |
| 3    | BindJWLSource       | 关联全局JWL爆炸模型号。        |
| 4    | SetLandauSource     | 全局朗道爆炸模型参数设置。     |
| 5    | SetLandauGasLeakMat | 设置朗道爆源模型气体逸散参数。 |
| 6    | BindLandauSource    | 关联全局朗道爆炸模型号。       |
| 7    | SetAirMat           | 全局的空气参数设置。           |
| 8    | BindAirMat          | 将全局空气参数与单元进行关联。 |
| 9    | SetJCMat            | 全局JohnsonCook材料参数设置。  |
| 10   | BindJCMat           | 关联JohnsonCook全局材料号。    |
| 11   | SetMGMat            | 全局MieGrueisen材料参数设置。  |
| 12   | BindMGMat           | 关联MieGrueisen全局材料号。    |
| 13   | SetJH2Mat           | 全局JH2材料参数设置。          |
| 14   | BindJH2Mat          | 将全局JH2参数与单元进行关联。  |
| 15   | SetHJCMat           | 全局HJC材料参数设置。          |
| 16   | BindHJCMat          | 将全局HJC参数与单元进行关联。  |
| 17   | SetTCKUSMat         | 全局TCKUS参数设置。            |
| 18   | BindTCKUSMat        | 将全局TCKUS参数与单元关联。    |



<!--HJS_pdyna_glob_mat_SetJWLSource-->

### SetJWLSource方法

#### 说明

设置全局的JWL爆源模型参数。

#### 格式定义

pdyna.SetJWLSource(<*iNumber*, *fdensity*, *fE0*, *fA*, *fB*, *fR1*, *fR2*, *fOmiga*, *fP_CJ*, *fD*, *fArrayFirePos*[N][3], *fBeginTime*, *fLastTime*>);

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

（1）当mpm或pcmm的本构模型为"JWL"时起作用。

（2）当当前时间位于起爆时间*fBeginTime*之前时，若该颗粒不指定其它类型的本构模型，则执行Mohr-Coulomb理想弹塑性计算，计算参数采用初始输入的材料参数；当当前时间大于（*fBeginTime*+ *fLastTime*）时，该单元自动设置为空模型（"null"）。

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
pdyna.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, pos, 0.0, 15e-3 );
```

<!--HJS_pdyna_glob_mat_SetJWLGasLeakMat-->

### SetJWLGasLeakMat方法

#### 说明

将JWL爆源的气体逸散参数（将会引起炸药压力的衰减）。

#### 格式定义

pdyna.SetJWLGasLeakMat( <*fCharTime*, *fCharIndex*, *iIDLow*, *iIDUp* >);

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
pdyna.SetJWLGasLeakMat( 5e-4, 1.2, 1, 10);
```

<!--HJS_pdyna_glob_mat_BindJWLSource-->

### BindJWLSource方法

#### 说明

将全局JWL材料库中特定的JWL材料号与颗粒的JWL材料号进行关联。

#### 格式定义

pdyna.BindJWLSource (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局JWL材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的颗粒的JWL爆源模型序号设置为1。
pdyna.BindJWLSource(1, 2, 3);
```

<!--HJS_pdyna_glob_mat_SetLandauSource-->

### SetLandauSource方法

#### 说明

设置全局的朗道爆源模型参数。

#### 格式定义

pdyna.SetLandauSource(<*iNumber*, *fdensity*, *fD*, *fQ*, *fGama1*, *fGama2*, *fP_CJ*, *fArrayFirePos*[N] [3], *fBeginTime*, *fLastTime*>);

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

（1）当mpm本构模型为"Landau"时起作用。

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
pdyna.SetLandauSource(1, 1150, 5600, 3.4e6, 3.0, 1.3333, 9e9, pos, 0.0, 1e-2);
```

<!--HJS_pdyna_glob_mat_SetLandauGasLeakMat-->

### SetLandauGasLeakMat方法

#### 说明

将朗道爆源的气体逸散参数（将会引起炸药压力的衰减）。

#### 格式定义

pdyna.SetLandauGasLeakMat( <*fCharTime*, *fCharIndex*, *iIDLow*, *iIDUp* >);

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
pdyna.SetLandauGasLeakMat( 5e-4, 1.2, 1, 10);
```

<!--HJS_pdyna_glob_mat_BindLandauSource-->

### BindLandauSource方法

#### 说明

将全局朗道材料库中特定的朗道材料号与颗粒中朗道材料号进行关联。

#### 格式定义

pdyna.BindLandauSource(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局Landau材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的颗粒的Landau爆源模型序号设置为1。
pdyna.BindLandauSource(1, 2, 3);
```

<!--HJS_pdyna_glob_mat_SetAirMat-->

### SetAirMat方法

#### 说明

设置全局的空气绝热膨胀方程参数。

#### 格式定义

pdyna.SetAirMat(<*iNumber*, *fdensity*,*fP0,fGama*>);

#### 参数

*iNumber*：整型，空气参数的序号，从1开始。

*fdensity*：浮点型，空气的密度（单位：kg/m<sup>3</sup>）。

*fP0*：浮点型，空气的初始压力（单位：Pa）

*fGama*：浮点型，绝热膨胀指数（一般取1.333）

#### 备注

当MPM或PCMM的本构模型为"Air"时起作用。

#### 范例

```javascript
//编号为1，空气密度为2kg/m3，初始气压1MPa，绝热指数1.333

pdyna.SetAirMat(1, 2.0, 1e6, 1.333 );
```

<!--HJS_pdyna_glob_mat_BindAirMat-->

### BindAirMat方法

#### 说明

将全局空气材料库中特定的材料号与颗粒的空气材料号进行关联。

#### 格式定义

pdyna.BindAirMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局空气材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的颗粒的空气模型序号设置为1。
pdyna.BindAirMat(1, 2, 3);
```

<!--HJS_pdyna_glob_mat_SetJCMat-->

### SetJCMat方法

#### 说明

设置全局的JohnsonCook材料参数。

#### 格式定义

pdyna.SetJCMat(<*iNumber*, *fA*, fB, *fn*, *fC*, *fm*, *fTb*, *fTm*, *fHc*, *fChr*, *bIfChangeTemp*>);

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

（1）  当MPM或PCMM模型为"JC"时起作用；

（2）  典型的JohnsonCook参数如表3.5所示。

<center>表3.5 典型的JohnsonCook材料参数</center>

| **材料名** | ***fA*** | ***fB*** | ***fn*** | ***fC*** | ***fm*** | ***fTm*** | ***fHc*** |
| ---------- | -------- | -------- | -------- | -------- | -------- | --------- | --------- |
| 铝         | 324e6    | 114e6    | 0.42     | 0.016    | 1.34     | 877       | 875       |
| 铜         | 107e6    | 213e6    | 0.26     | 0.024    | 1.09     | 1189      | 385       |
| 钨         | 1200e6   | 1030e6   | 0.019    | 0.034    | 0.4      | 1723      | 134       |

#### 范例

```javascript
///设置全局的JohnsonCook参数
pdyna.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0 , true);
```

<!--HJS_pdyna_glob_mat_BindJCMat-->

### BindJCMat方法

#### 说明

将全局的JohnsonCook材料号与颗粒进行关联。

#### 格式定义

pdyna.BindJCMat(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局JohnsonCook材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为1-10的颗粒的JohnsonCook材料设置为全局材料中的1号材料
pdyna.BindJCMat(1, 1, 10);
```

<!--HJS_pdyna_glob_mat_SetMGMat-->

### SetMGMat方法

#### 说明

设置全局的MieGrueisen材料。

#### 格式定义

pdyna.SetMGMat(<*iNumber*, *fdensity*, *fC*, *fLamuda*, *fGama*, *fa*>);

#### 参数

*iNumber*：整型，全局MieGrueisen材料序号，从1开始。

*fdensity*：浮点型，材料的初始密度（单位：kg/m<sup>3</sup>）

*fC*：浮点型，材料的纵波波速（单位：m/s）

*fLamuda*：浮点型，MieGrueisen模型无量纲参数

*fGama*：浮点型，MieGrueisen模型无量纲参数

*fa*：浮点型，MieGrueisen模型无量纲参数

#### 备注

（1） 当MPM或PCMM模型为"JC"时起作用；

（2）  典型的MieGrueisen参数如表3.6所示。

<center>表3.6 典型的MieGrueisen材料参数</center>

| **材料名** | *fdensity* | *fC* | *fLamuda* | *fGama* | *fa* |
| ---------- | ---------- | ---- | --------- | ------- | ---- |
| 铝         | 2703       | 5350 | 1.34      | 1.97    | 1.5  |
| 铜         | 8930       | 3940 | 1.49      | 2.02    | 1.5  |
| 钨         | 19220      | 4020 | 1.24      | 1.67    | 1.3  |

#### 范例

```javascript
///设置序号为1的全局的MieGrueisen参数
pdyna.SetMGMat(1, 2703, 5350, 1.34, 1.97, 1.5);
```

<!--HJS_pdyna_glob_mat_BindMGMat-->

### BindMGMat方法

#### 说明

将全局的MieGrueisen材料号与颗粒关联。

#### 格式定义

pdyna.BindMGMat(<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局MieGrueisen材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2-10的颗粒的MieGrueisen材料设置为全局材料库中的5号材料。
pdyna.BindMGMat(5, 2, 10);
```

<!--HJS_pdyna_glob_mat_SetHJCMat-->

### SetHJCMat方法

#### 说明

设置全局的HJC模型材料参数。

#### 格式定义

pdyna.SetHJCMat(<*iNumber*, afPara[18]>);

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

（1）  当MPM本构模型为"HJC"时起作用。

（2）  HJC模型共19个参数，密度通过pdyna.SetMat进行设置，故此处输入18个参数。

（3）  弹性时刻的体积模量通过fPcrsh / fUcrsh进行计算。

（4）  fEfmin主要用于为了防止材料在小幅拉伸波作用下的断裂。

#### 范例

```javascript
var HJCMat = [4.8e7, 0.79, 1.60, 0.61, 0.007, 7.0, 14.86e9, 0.04, 1.0, 0.01, 0.016e9, 0.001, 85e9, -171e9, 208e9, 0.8e9, 0.1, 0.004e9];
pdyna.SetHJCMat(1, HJCMat);
```

<!--HJS_pdyna_glob_mat_BindHJCMat-->

### BindHJCMat方法

#### 说明

将全局HJC材料库中特定的材料号与颗粒中HJC的材料号进行关联。

#### 格式定义

pdyna.BindHJCMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局HJC材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的颗粒的HJC模型序号设置为1。
pdyna.BindHJCMat(1, 2, 3);
```

<!--HJS_pdyna_glob_mat_SetJH2Mat-->

### SetJH2Mat方法

#### 说明

设置全局的JH2模型材料参数。

#### 格式定义

pdyna.SetJH2Mat(<*iNumber*, afPara[17]>);

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

（1）  当MPM本构模型为"JH2"时起作用。

（2）  JH2模型共20个参数，密度通过pdyna.SetMat进行设置；压力系数（体积模量）K1、剪切模量G，通过弹性模量及泊松比进行换算；故实际输入参数为17个。

#### 范例

```javascript
var JH2Mat = [8e10, 0.3, -1.5e11, 2.0e11, 5e9, 1e10, 1.01, 0.83, 0.68, 0.76, 0.005, 3.5e7, 0.01, 0.9, 1.0, 7.0, 1.0 ];
pdyna.SetJH2Mat(1, JH2Mat);
```

<!--HJS_pdyna_glob_mat_BindJH2Mat-->

### BindJH2Mat方法

#### 说明

将全局JH2材料库中特定的材料号与颗粒中JH2的材料号进行关联。

#### 格式定义

pdyna.BindJH2Mat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局JH2材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

无。

#### 范例

```javascript
///将组号为2及3的颗粒的JH2模型序号设置为1。
pdyna.BindJH2Mat(1, 2, 3);
```

<!--HJS_pdyna_glob_mat_SetTCKUSMat-->

### SetTCKUSMat方法

#### 说明

设置全局的TCK及KUS模型参数。

#### 格式定义

pdyna.SetTCKUSMat(<*iNumber, fKIC, fLimStrRatio, fk, fm, fSita*>);

#### 参数

*iNumber*：整型，空气参数的序号，从1开始。

*fKIC*：浮点型，断裂韧度（单位：$Pa\sqrt m$）。

*fLimStrRatio*：浮点型，最大体积拉伸应变率（单位：1/s）

*fk*：浮点型，材料参数，系数，用于计算裂纹密度

*fm*：浮点型，材料参数，指数，用于计算裂纹密度

*fSita*：浮点型，材料参数，系数，用于计算有效应变

#### 备注

当MPM本构模型为"TCK"或"KUS"时起作用。

#### 范例

```javascript
//设置全局TCK（KUS）参数，材料参数编号为1
pdyna.SetTCKUSMat(1, 7.67e5, 100.0, 2.3e24, 7.0, 1.0);
```

<!--HJS_pdyna_glob_mat_BindTCKUSMat-->

### BindTCKUSMat方法

#### 说明

将全局TCKUS材料库中特定的材料号与颗粒中TCK模型或KUS模型的材料号进行关联。

#### 格式定义

pdyna.BindTCKUSMat (<*iNumber*, *iGroupLow*, *iGroupUp*>);

#### 参数

*iNumber*：整型，全局TCK或KUS材料序号，从1开始。

*iGroupLow*：整型，选择组号范围的下限。

*iGroupUp*：整型，选择组号范围的上限。

#### 备注

#### 范例

```javascript
///将组号为2及3的颗粒单元的模型序号设置为1。
pdyna.BindTCKUSMat(1, 2, 3);
```



<!--HJS_pdyna_NoSpherical_Particle-->

## 非球形颗粒接口

本节主要介绍非球形颗粒的 接口，具体见表3.6。

<div align = "center">表3.6 非球形颗粒计算接口</div>

| 序号 | 函数名                    | 说明                                                     |
| ---- | ------------------------- | -------------------------------------------------------- |
| 1    | CrtEllipsePart            | 创建单个椭圆形颗粒                                       |
| 2    | CrtEllipsoidPart          | 创建单个椭球体颗粒                                       |
| 3    | CrtPolygonPart            | 创建单个多边形颗粒                                       |
| 4    | CrtPolyhedronPart         | 创建单个多面体颗粒                                       |
| 5    | CrtPolyhedronPartSTL      | 基于STL文件创建单个多面体颗粒                            |
| 6    | CrtEllipsePartFromFile    | 导入PDyna格式的球颗粒文件，并基于此创建椭圆形颗粒        |
| 7    | CrtEllipsoidPartFromFile  | 导入PDyna格式的球颗粒文件，并基于此创建椭球体颗粒        |
| 8    | CrtPolygonPartFromFile    | 导入PDyna格式的球颗粒文件，并基于此创建多边形颗粒        |
| 9    | CrtPolyhedronPartFromFile | 导入PDyna格式的球颗粒文件及STL文，并基于此创建多面体颗粒 |
| 10   | ImportPartGenvi           | 导入Genvi格式的网格文件，创建多边形及多面体颗粒          |
| 11   | ImportPartGenviPar        | 导入GenviPar格式的网格文件，创建椭圆及椭球颗粒           |
| 12   | ExportPartGenvi           | 导出Genvi格式的网格文件                                  |
| 13   | ExportPartGenviPar        | 导出GenviPar格式的网格文件                               |
| 14   | SetPartMat                | 设置颗粒Part的材料参数                                   |
| 15   | RandomizePartMat          | 对Part的材料参数进行随机                                 |
| 16   | SetPartVel                | 设置Part的平动速度                                       |
| 17   | SetPartRotaVel            | 设置Part的转动速度                                       |
| 18   | SetPartForce              | 设置Part的外力                                           |
| 19   | SetPartMoment             | 设置Part的转矩                                           |
| 20   | ExportPartInfo            | 导出Part的信息                                           |



<!--HJS_pdyna_NoSpherical_Particle_CrtEllipsePart---->

###  CrtEllipsePart方法

#### 说明

通过输入质心坐标、长轴半径、短轴半径、旋转角度等参数，创建单个二维椭圆颗粒。

#### 格式定义

pdyna.CrtEllipsePart(<*nGrp*, *fCenterX*, *fCenterY*, *fCenterZ*, *fRad1*, *fRad2* [,*fSita* [*nSeg*]]>);

#### 参数

*nGrp*：整型，颗粒组号。

*fCenterX*，*fCenterY*，*fCenterZ*：浮点型，椭圆中心点的坐标（单位：m）。

*fRad1*，*fRad2*：浮点型，椭圆局部坐标系下X轴及Y轴上的半径（单位：m）。

*fSita*：浮点型，椭圆绕着Z轴的旋转角度（单位：度）。

*nSeg*：整型，椭圆的分段数量（≥3）。

#### 备注

（1）所创建的椭圆位于X-Y平面内，垂直于Z轴；

（2）分段数*nSeg*主要用于接触检测，分段数越多，接触检索越精确，但计算耗时越大。

#### 范例

```javascript
pdyna.CrtEllipsePart(1, 0, 2, 0, 1, 2,30,50);
pdyna.CrtEllipsePart(1, 0, 7, 0, 3, 1,10,50);
```



<!--HJS_pdyna_NoSpherical_Particle_CrtEllipsoidPart---->

### CrtEllipsoidPart方法

#### 说明

通过输入质心坐标、三个主轴方向上的颗粒半径、旋转轴、旋转角度等参数，创建单个三维椭球颗粒。

#### 格式定义

pdyna.CrtEllipsoidPart(<*nGrp*, *afCenter*, *fRad1*, *fRad2*, *fRad3* [,*afNormal*, *fSita* [,*nSegLongitude*, *nSegLatitude*]]>);

#### 参数

*nGrp*：整型，颗粒组号。

*afCenter*：浮点型数组，包含3个分量，为椭球中心点的坐标（单位：m）。

*fRad1*, *fRad2*, *fRad3*：浮点型，椭球局部坐标系下X轴、Y轴及Z轴上的半径（单位：m）。

*afNormal*：浮点型数组，包含3个分量，为旋转轴的方向矢量。

*fSita*：浮点型，椭球绕着旋转轴的旋转角度（单位：度）。

*nSegLongitude*, *nSegLatitude*：整型，椭球经度方向及维度方向的分段数量（≥3）。

#### 备注

分段数*nSegLongitude*, *nSegLatitude*主要用于接触检测，分段数越多，接触检索越精确，但计算耗时越大。

#### 范例

```javascript
var afCenter = [5,5,5];
var afNormal = [1,0,0];
pdyna.CrtEllipsoidPart(1, afCenter,3, 1, 2, afNormal, 30);
```



<!--HJS_pdyna_NoSpherical_Particle_CrtPolygonPart---->

### CrtPolygonPart方法

#### 说明

通过输入逆时针或者顺时针排列的多边形节点坐标及离散颗粒半径，实现二维多边形颗粒的创建。

#### 格式定义

pdyna.CrtPolygonPart(<*nGrp*, *afCoordInput*, *fDiscreteRadius*>);

#### 参数

*nGrp*：整型，颗粒组号。

*afCoordInput*：浮点型二维数组，第一维度表示顶点数量（N）；第二维度表示顶点坐标，包含2个分量，X坐标及Y坐标（单位：m）。

*fDiscreteRadius*：浮点型，多边形边界填充颗粒的半径（单位：m）。

#### 备注

（1）组成多边形的顶点数量N应该大于等于3；

（2）多边形位于XY平面内，垂直于Z轴；

（3）*fDiscreteRadius*主要用填充边界颗粒，用于接触检测，半径越小，填充的颗粒越多，接触检索越精确，但计算耗时越大。

#### 范例

```javascript
///设置多边形
var fpoly1 = [0,0,2,1,1,1.5];
var fpoly2 = [3,1,6,2,5,3,4,3];
var fpoly3 = [-1,2,2,3,1,4,0,3,-0.5,2.5];
var fpoly4 = [0,4,3,5,4,6,2,5];

pdyna.CrtPolygonPart(1, fpoly1, 0.1);
pdyna.CrtPolygonPart(2, fpoly2, 0.1);
pdyna.CrtPolygonPart(3, fpoly3, 0.1);
pdyna.CrtPolygonPart(4, fpoly4, 0.1);
```



<!--HJS_pdyna_NoSpherical_Particle_CrtPolyhedronPart---->

### CrtPolyhedronPart方法

#### 说明

通过输入构成多面体的顶点坐标、组成每个面的顶点数量、每个面顶点的全局节点索引号、离散颗粒半径等，实现三维多面体颗粒的创建。

#### 格式定义

pdyna.CrtPolyhedronPart(<*nGrp*, *afCoordInput*, *nFaceNodeSum*[nFaceSum], *aFaceNodeID*, *fDiscreteRadius*>);

#### 参数

*nGrp*：整型，颗粒组号。

*afCoordInput*：浮点型二维数组，第一维度表示顶点数量（N）；第二维度表示顶点坐标，包含3个分量，X坐标、Y坐标及Z坐标（单位：m）。

*nFaceNodeSum*：整型一维数组，表示多面体表面面片的构成顶点数量，每个面片的顶点数应该大于等于3。

*aFaceNodeID*：整型二维数组，多面体表面面片顶点的全局序号，包含M行（M应该大于等于4，表示构成多面体的面片数），每行包含K个值（K为构成某个面片的顶点数量，K应该大于等于3）。

*fDiscreteRadius*：浮点型，多面体边界填充颗粒的半径（单位：m）。

#### 备注

（1）组成多面体的顶点数量N应该大于等于4；

（2）*fDiscreteRadius*主要用填充边界颗粒，用于接触检测，半径越小，填充的颗粒越多，接触检索越精确，但计算耗时越大。

#### 范例

```javascript
///设置多面体
var Coord = [-1,-1,4,1,-1,4,1,1,4,1,-1,6];
var FaceNodeSum = [3, 3, 3, 3];
var FaceNode = [0,2,1, 0,3,2, 0,1,3, 1,2,3];
pdyna.CrtPolyhedronPart(2, Coord, FaceNodeSum, FaceNode, 0.05);
```

 

<!--HJS_pdyna_NoSpherical_Particle_CrtPolyhedronPartSTL---->

### CrtPolyhedronPartSTL方法

#### 说明

导入STL格式的多面体文件，并基于该文件创建多面体颗粒。

#### 格式定义

pdyna.CrtPolyhedronPartSTL(<*strSTLFile, nGroupNo, afCenter, fMaxLength, nRandomDirFlag [, Type, Value*]>);

#### 参数

*strStlName*：字符串型，STL格式网格文件的文件名。

*nGroupNo*：整型，颗粒组号。

*afCenter*：浮点型数组，创建的多面体的质心坐标分量（单位：m）。

*fMaxLength*：浮点型，创建的多面体的最大长度（单位：m）。

*nRandomDirFlag*：整型，是否开展方向随机，0表示不开展，1表示开展。

*Type*：整型，多面体颗粒填充类型，只能为1或2，1表示按照分段数进行颗粒填充，2表示按照指定的颗粒半径进行填充；默认为1。

*Value*：整型或浮点型，当Type=1时，该值为整型，表示分段数；当Type=2时，该值为浮点型，表示颗粒半径（单位：m）；默认分段数为5。

#### 备注

（1）一个STL文件里面的内容表征一个多面体；导入STL文件后，软件内部会根据设定的体心坐标及最大长度，旋转角度等等导入的STL文件所表示的多面体进行调整；

（2）由于软件采用填充球的方式实现颗粒接触，故设置的Type及Value，主要用于进行产生填充球，进行后续颗粒接触计算。

#### 范例

```JavaScript
var fCenter = [0,0,2];
pdyna.CrtPolyhedronPartSTL("R001.stl", 1, fCenter, 2.0, 1,  1, 1);
var fCenter = [5,0,2];
pdyna.CrtPolyhedronPartSTL("R002.stl", 2, fCenter, 2.0, 1,  1, 1);
```

 

<!--HJS_pdyna_NoSpherical_Particle_CrtEllipsePartFromFile---->

### CrtEllipsePartFromFile方法

#### 说明

基于PDyna格式文件中的圆颗粒信息创建椭圆形颗粒。

#### 格式定义

pdyna.CrtEllipsePartFromFile(<*strFile, strRad1ScaleType, fR1Para1, fR1Para2, strRad2ScaleType, fR2Para1, fR2Para2, strSitaRandomType, fSitaPara1, fSitaPara2 [, nSeg]*>);

#### 参数

*strFile*：字符串型，PDyna格式颗粒文件的文件名（含路径）。

*strRad1ScaleType*：字符串型，半径R1缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fR1Para1, fR1Para2*：浮点型，半径R1缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*strRad2ScaleType*：字符串型，半径R2缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fR2Para1*, *fR2Para2*：浮点型，半径R2缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*strSitaRandomType*：字符串型，旋转角θ的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fSitaPara1, fSitaPara2*：浮点型，旋转角θ的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*nSeg*：整型，椭圆的分段数，必须大于等于3，可以不写，默认为36。

#### 备注

（1）半径缩放因子为1，表示椭圆的最大半径为圆形颗粒的半径。

（2）*nSeg*分段数越多，填充颗粒越多，接触检索越精确，但计算耗时越大。

#### 范例

```javascript
//导入pdyna格式的颗粒并创建椭圆
pdyna.CrtEllipsePartFromFile("1m-1m-ball.dat", "uniform", 0.8,1, "uniform", 0.2,1, "uniform", 0.0, 360.0, 12);
```

 

<!--HJS_pdyna_NoSpherical_Particle_CrtEllipsoidPartFromFile---->

### CrtEllipsoidPartFromFile方法

#### 说明

基于PDyna格式文件中的球颗粒信息创建椭球形颗粒。

#### 格式定义

pdyna.CrtEllipsoidPartFromFile(<*strFile, strRad1ScaleType, fR1Para1, fR1Para2, strRad2ScaleType, fR2Para1, fR2Para2, strRad3ScaleType, fR3Para1, fR2Para3, [, nSegLongitude,  nSegLatitude]*>);

#### 参数

*strFile*：字符串型，PDyna格式颗粒文件的文件名（含路径）。

*strRad1ScaleType*：字符串型，半径R1缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fR1Para1, fR1Para2*：浮点型，半径R1缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*strRad2ScaleType*：字符串型，半径R2缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fR2Para1, fR2Para2*：浮点型，半径R2缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*strRad3ScaleType*：字符串型，半径R3缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fR3Para1, fR2Para3*：浮点型，半径R3缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

 *nSegLongitude,  nSegLatitude*：整型，经度方向及维度方向分割数，必须大于等于3，可以不写，默认为36。

#### 备注

（1）半径缩放因子为1，表示椭球的最大半径为球形颗粒的半径。

（2）*nSegLongitude*及*nSegLatitude*分段数越多，填充颗粒越多，接触检索越精确，但计算耗时越大。

#### 范例

```javascript
//导入pdyna格式的颗粒并创建椭球
pdyna.CrtEllipsoidPartFromFile("Rad4m.dat", "uniform", 0.8,1, "uniform", 0.2,1, "uniform", 0.2, 1.0, 12, 12);
```

 

<!--HJS_pdyna_NoSpherical_Particle_CrtPolygonPartFromFile---->

### CrtPolygonPartFromFile方法

#### 说明

基于PDyna格式文件中的圆颗粒信息创建多边形形颗粒。

#### 格式定义

pdyna.CrtPolygonPartFromFile(<*strFile, strRad1ScaleType, fR1Para1, fR1Para2, strRad2ScaleType, fR2Para1, fR2Para2, strSitaRandomType, fSitaPara1, fSitaPara2, nEdgeLow, nEdgeUp, fRadomCoeff[, nSeg]*>);

#### 参数

*strFile*：字符串型，PDyna格式颗粒文件的文件名（含路径）。

*strRad1ScaleType*：字符串型，半径R1缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fR1Para1, fR1Para2*：浮点型，半径R1缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*strRad2ScaleType*：字符串型，半径R2缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fR2Para1*, *fR2Para2*：浮点型，半径R2缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*strSitaRandomType*：字符串型，旋转角θ的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fSitaPara1, fSitaPara2*：浮点型，旋转角θ的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*nEdgeLow, nEdgeUp*：整型，多边形边数量下限及上限值，必须大于等于3,且*nEdgeLow* **<** *nEdgeUp*。

*fRadomCoeff*：浮点型，表示坐标点随机度，介于0-1之间（如为0，则产生规则多边形）。

*nSeg*：整型，椭圆的分段数，必须大于等于3，可以不写，默认为36。

#### 备注

（1）创建多边形的思路为，首先基于球形颗粒位置及半径创建椭圆，然后在椭圆上随机选点创建多边形。

（2）半径缩放因子为1，表示椭圆的最大半径为圆形颗粒的半径。

（3）*nSeg*分段数越多，填充颗粒越多，接触检索越精确，但计算耗时越大。

#### 范例

```javascript
//导入pdyna格式的颗粒并创建多边形
pdyna.CrtPolygonPartFromFile("1m-1m-ball.dat", "uniform", 0.8,1, "uniform", 0.2,1, "uniform", 0.0, 360.0, 3, 6, 0.5, 12);
```

 

<!--HJS_pdyna_NoSpherical_Particle_CrtPolyhedronPartFromFile---->

### CrtPolyhedronPartFromFile方法

#### 说明

基于PDyna格式文件中的球颗粒信息及STL文件中的多面体颗粒信息，创建多面体颗粒群。

#### 格式定义

pdyna.CrtPolyhedronPartFromFile(<*strSTLFile, strPDynaFile, strSizeScaleType, fPara1, fPara2, nGrpLow, nGrpUp, nRandomDirFlag [, Type, Value]*>);

#### 参数

*strStlFile*：字符串型，STL格式多面体文件的文件名（含路径）。

*strPDynaFile*：字符串型，PDyna格式颗粒文件的文件名（含路径）。

*strScaleType*：字符串型，尺寸缩放因子的随机类型，必须为"uniform"、"normal"、"weibull"其中之一。

*fPara1, fPara2*：浮点型，尺寸缩放因子的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*nGrpLow, nGrpUp*：整型，适用于填充多面体的颗粒组号下限及上限。

*nRandomDirFlag*：整型，是否开展方向随机，0表示不开展，1表示开展。

*Type*：整型，多面体颗粒填充类型，只能为1或2，1表示按照分段数进行颗粒填充，2表示按照指定的颗粒半径进行填充；默认为1。

*Value*：整型或浮点型，当Type=1时，该值为整型，表示分段数；当Type=2时，该值为浮点型，表示颗粒半径（单位：m）；默认分段数为5。

#### 备注

（1）一个STL文件里面的内容表征一个多面体；导入STL文件后，软件内部会根据设定的体心坐标及最大长度，旋转角度等等导入的STL文件所表示的多面体进行调整；

（2）由于软件采用填充球的方式实现颗粒接触，故设置的Type及Value，主要用于进行产生填充球，进行后续颗粒接触计算。

（3）尺寸缩放因子为1，表示多面体的最大尺寸为颗粒的直径。

#### 范例

```javascript
//导入STL文件及PDyna文件创建多面体群
pdyna.CrtPolyhedronPartFromFile("SiglePar.stl", "pdyna-par.dat", "uniform", 1, 1.0, 1, 111, 1,2,0.003);
```

 

<!--HJS_pdyna_NoSpherical_Particle_ImportPartGenvi---->

### ImportPartGenvi方法

#### 说明

导入Genvi格式的网格文件，并将网格文件中的三角形、四边形及多边形单元创建为多边形颗粒，将网格文件中的四面体、三棱柱、金字塔、六面体及多面体单元创建为多面体颗粒。

#### 格式定义

pdyna.ImportPartGenvi(<*FileName [, Type, Value]*>);

#### 参数

*FileName*：字符串型，Genvi格式的网格文件文件名（含路径）。

*Type*：整型，多面体颗粒填充类型，只能为1或2，1表示按照分段数进行颗粒填充，2表示按照指定的颗粒半径进行填充；默认为1。

*Value*：整型或浮点型，当Type=1时，该值为整型，表示分段数；当Type=2时，该值为浮点型，表示颗粒半径（单位：m）；默认分段数为5。

#### 备注

导入Genvi格式的网格文件后，自动进行识别，并自动创建多边形或多面体颗粒。

#### 范例

```javascript
//导入genvi格式的网格文件，创建多边形或多面体颗粒
pdyna.ImportPartGenvi("my.gvx");
pdyna.ImportPartGenvi("block3d.gvx", 1,10);
```

 

<!--HJS_pdyna_NoSpherical_Particle_ImportPartGenviPar---->

### ImportPartGenviPar方法

#### 说明

导入GenviPar格式的颗粒文件。

#### 格式定义

pdyna.ImportPartGenviPar(<*FileName [,nSeg]*>);

#### 参数

*FileName*：字符串型，GenviPar格式的颗粒文件文件名（含路径）。

nSeg：整型，分段数（该变量为预留字段，对目前支持的椭圆及椭球，不起作用）。

#### 备注

无。

#### 范例

```javascript
//导入genviPar格式的颗粒文件
pdyna.ImportPartGenviPar("ellipse.gvpx");
```



<!--HJS_pdyna_NoSpherical_Particle_ExportPartGenvi---->

### ExportPartGenvi方法

#### 说明

从颗粒Part列表中导出多边形、多面体、椭圆及椭球颗粒，并存储为Genvi网格格式。

#### 格式定义

pdyna.ExportPartGenvi(<*FileName*>);

#### 参数

*FileName*：字符串型，Genvi格式的网格文件文件名（含路径）。

#### 备注

椭圆及椭球的导出按照分割后的多边形及多面体形式导出。

#### 范例

```javascript
//导出genvi格式的网格文件
pdyna.ExportPartGenvi("my.gvx");
```



<!--HJS_pdyna_NoSpherical_Particle_ExportPartGenviPar---->

### ExportPartGenviPar方法

#### 说明

从颗粒Part列表中导出椭圆形及椭球体颗粒文件，并存储为GenviPar网格格式。

#### 格式定义

pdyna.ExportPartGenviPar(<*FileName*>);

#### 参数

*FileName*：字符串型，GenviPar格式的网格文件文件名（含路径）。

#### 备注

无。

#### 范例

```javascript
//导出genviPar格式的网格文件
pdyna.ExportPartGenviPar("my.gvpx");
```



 <!--HJS_pdyna_NoSpherical_Particle_SetPartMat---->

### SetPartMat方法

#### 说明

设置非球形颗粒的材料参数。

#### 格式定义

共包含3种调用方式。

（1）所有part颗粒都设置统一的参数

pdyna.SetPartMat(<*density, young, poisson, tension, cohesion, friction, localdamp, localdamprota, viscdamp*>);

（2）对组号为igroup的组颗粒施加参数

pdyna.SetPartMat(<*density, young, poisson, tension, cohesion, friction, localdamp, localdamprota, viscdamp, igroup>*);

（3）对组号位于groupL及groupU下限及上限之间的颗粒施加参数

pdyna.SetPartMat(<*density, young, poisson, tension, cohesion, friction, localdamp, localdamprota, viscdamp, groupL, groupU*>);

#### 参数

*density*：浮点型，密度（单位：kg/m3）。

*young*：浮点型，弹性模量（单位：Pa）。

*poisson*：浮点型，泊松比。

*tension*：浮点型，抗拉强度（单位：Pa）。

*cohesion*：浮点型，粘聚力（单位：Pa）。

*friction*：浮点型，内摩擦角（单位：度）。

*localdamp*：浮点型，平动局部阻尼。

*localdamprota*：浮点型，转动局部阻尼。

*viscdamp*：浮点型，粘性阻尼（临界阻尼比）。

*igroup*：整型，颗粒组号。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

对颗粒Part施加材料参数后，每个Part包含的颗粒也会自动施加对应的材料参数。

#### 范例

```javascript
//设置非球形颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、平动局部阻尼、转动局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 5e7, 0.25, 0.0, 0.0, 10, 0.01, 0.1, 0.1);
```

 

 <!--HJS_pdyna_NoSpherical_Particle_RandomizePartMat---->

### RandomizePartMat方法

#### 说明

通过随机方式设置非球形颗粒的材料参数。

#### 格式定义

pdyna.RandomizePartMat(<*RandomizePartMat, RandomType, pra1, pra2, groupL, groupU*>);

#### 参数

*RandomizePartMat*：字符串型，可随机的材料参数名称，只能为以下字符串之一，"density"，"young"，"poisson"，"cohesion"，"tension"，"friction"，"localdamp"，"localdamprota"，"viscdamp"。

*RandomType*：字符串型，材料参数随机模式，必须为"uniform"、"normal"、"weibull"其中之一。

*fPara1, fPara2*：浮点型，材料参数的随机参数。如果分布模式为“*uniform*”，*pra1*及*pra2*分别表示颗粒半径的下限及上限；如果分布模式为”*normal*”， *pra1*及*pra2*分别表示颗粒半径的期望及标准差；如果分布模式为”*weilbull*”， *pra1*及*pra2*分别表示随机参数中的*k*值及*λ*值。

*groupL*，*groupU*：整型，颗粒组号的下限及上限。

#### 备注

对颗粒Part施加随机材料参数后，每个Part包含的颗粒也会自动施加对应的材料参数。

#### 范例

```javascript
pdyna.RandomizePartMat("density", "uniform", 1900, 2400, 1,11);

pdyna.RandomizePartMat("young", "normal", 3e9, 3e8, 1,11);

pdyna.RandomizePartMat("poisson", "normal", 0.3, 0.05, 1,11);

pdyna.RandomizePartMat("cohesion", "weibull", 1.4, 1e6, 1,11);

pdyna.RandomizePartMat("tension", "weibull", 0.9, 1e6, 1,11);

pdyna.RandomizePartMat("friction", "uniform", 10,30, 1,11);

pdyna.RandomizePartMat("localdamp", "uniform",0.1, 0.2, 1,11);

pdyna.RandomizePartMat("viscdamp", "uniform",0.1, 0.2, 1,11);

pdyna.RandomizePartMat("localdamprota", "uniform",0.05, 0.1, 1,11);
```



 <!--HJS_pdyna_NoSpherical_Particle_SetPartVel---->

### SetPartVel方法

#### 说明

设置颗粒Part的平动速度。

#### 格式定义

包含两种调用方式。

（1）根据组号下限及上限设置平动速度条件

pdyna.SetPartVel(<*afVel[3], abFixed[3], GroupLow, GroupU*>);

（2）根据质心坐标范围设置平动速度条件

pdyna.SetPartVel(<*afVel[3], abFixed[3], fXLow, fXUp, fYLow, fYUp, fZLow, fZUp*>);

#### 参数

*afVel*：浮点型数组，包含3个分量，为施加平动速度的值（单位：m/s），包含X、Y、Z三个分量。

*abFixed*：整型数组，包含3个分量，表示是否固定某一个方向的平动速度，只能为0或1,0表示不固定，1表示固定。

*GroupLow, GroupU*：整型，组号的下限及上限值。

*fXLow, fXUp*：浮点型，X方向坐标的下限及上限（单位：m）。

*fYLow, fYUp*：浮点型，Y方向坐标的下限及上限（单位：m）。

*fZLow, fZUp*：浮点型，Z方向坐标的下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
var afValue = [0,0,0];
var abFixFlag = [1,1,1];
pdyna.SetPartVel(afValue, abFixFlag, 1,1);
```



 <!--HJS_pdyna_NoSpherical_Particle_SetPartRotaVel---->

### SetPartRotaVel方法

#### 说明

设置颗粒Part的转动速度。

#### 格式定义

包含两种调用方式。

（1）根据组号下限及上限设置转动速度条件

pdyna.SetPartRotaVel(<*afRotaVel[3], abFixed[3], GroupLow, GroupUp*>);

（2）根据质心坐标范围设置转动速度条件

pdyna.SetPartRotaVel(<*afRotaVel[3], abFixed[3], fXLow, fXUp, fYLow, fYUp, fZLow, fZUp*>);

#### 参数

*afRotaVel*：浮点型数组，包含3个分量，为施加转动速度的值（单位：rad/s），包含X、Y、Z三个分量。

*abFixed*：整型数组，包含3个分量，表示是否固定某一个方向的转动速度，只能为0或1,0表示不固定，1表示固定。

*GroupLow, GroupU*：整型，组号的下限及上限值。

*fXLow, fXUp*：浮点型，X方向坐标的下限及上限（单位：m）。

*fYLow, fYUp*：浮点型，Y方向坐标的下限及上限（单位：m）。

*fZLow, fZUp*：浮点型，Z方向坐标的下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
var afValue = [0,0,0];
var abFixFlag = [1,1,1];
pdyna.SetPartRotaVel(afValue, abFixFlag, 1,1);
```



 <!--HJS_pdyna_NoSpherical_Particle_SetPartForce---->

### SetPartForce方法

#### 说明

设置颗粒Part的外力边界条件。

#### 格式定义

包含两种调用方式。

（1）根据组号下限及上限设置外力边界条件

pdyna.SetPartForce(<*afForce[3], GroupLow, GroupU*>);

（2）根据质心坐标范围设置外力边界条件

pdyna.SetPartForce(<*afForce[3], fXLow, fXUp, fYLow, fYUp, fZLow, fZUp*>);

#### 参数

*afForce*：浮点型数组，包含3个分量，为施加外力的值（单位：N），包含X、Y、Z三个分量。

*GroupLow, GroupU*：整型，组号的下限及上限值。

*fXLow, fXUp*：浮点型，X方向坐标的下限及上限（单位：m）。

*fYLow, fYUp*：浮点型，Y方向坐标的下限及上限（单位：m）。

*fZLow, fZUp*：浮点型，Z方向坐标的下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
var afForce = [0,1e5,0];
pdyna.SetPartForce(afForce, 1, 1);
```



 <!--HJS_pdyna_NoSpherical_Particle_SetPartMoment---->

### SetPartMoment方法

#### 说明

设置颗粒Part的外力矩边界条件。

#### 格式定义

包含两种调用方式。

（1）根据组号下限及上限设置外力矩边界条件

pdyna.SetPartMoment(<*afMoment[3], GroupLow, GroupU*>);

（2）根据质心坐标范围设置外力矩边界条件

pdyna.SetPartMoment(<*afMoment[3], fXLow, fXUp, fYLow, fYUp, fZLow, fZUp*>);

#### 参数

*afMoment*：浮点型数组，包含3个分量，为施加外力矩的值（单位：N.m），包含X、Y、Z三个分量。

*GroupLow, GroupU*：整型，组号的下限及上限值。

*fXLow, fXUp*：浮点型，X方向坐标的下限及上限（单位：m）。

*fYLow, fYUp*：浮点型，Y方向坐标的下限及上限（单位：m）。

*fZLow, fZUp*：浮点型，Z方向坐标的下限及上限（单位：m）。

#### 备注

无。

#### 范例

```javascript
var afMoment = [0,1e5,0];
pdyna.SetPartMoment(afMoment, 1, 1);
```



 <!--HJS_pdyna_NoSpherical_Particle_ExportPartInfo---->

### ExportPartInfo方法

#### 说明

导出颗粒Part的信息。

#### 格式定义

pdyna.ExportPartInfo(<[*FileName*]>);

#### 参数

*FileName*：字符串型，导出文件的文件名（不包含扩展名），如果不写，默认文件名为“PDynaPart”。

#### 备注

执行后将在设定路径下产生vtk格式及文本格式的数据文件，文件中包含了part材料参数数据、约束数据等信息。

#### 范例

```javascript
pdyna.ExportPartInfo();
pdyna.ExportPartInfo("Test");
```



<!--HJS_pdyna_SecDev_Interface-->

## 二次开发专用接口

本节主要介绍颗粒二次开发专用接口，具体见表3.7。

<div align = "center">表3.7 颗粒信息设置及获取类相关函数</div>

| 序号 | 函数名                | 说明                                                         |
| ---- | --------------------- | ------------------------------------------------------------ |
| 1    | GetParticleID         | 获取离某一坐标最近的颗粒ID。                                 |
| 2    | GetParticleValue      | 获取颗粒的信息                                               |
| 3    | GetPPContactValue     | 获取颗粒与颗粒间的接触信息                                   |
| 4    | GetPFaceContactValue  | 获取颗粒与刚性面间的接触信息                                 |
| 5    | GetPBlockContactValue | 获取颗粒与块体单元间的接触信息                               |
| 6    | SetParticleValue      | 设置颗粒的信息                                               |
| 7    | SetPPContactValue     | 设置颗粒与颗粒间的接触信息                                   |
| 8    | SetPFaceContactValue  | 设置颗粒与刚性面间的接触信息                                 |
| 9    | SetPBlockContactValue | 设置颗粒与块体单元间的接触信息                               |
| 10   | Solver                | 核心求解器，每一迭代步执行。                                 |
| 11   | CellMapping           | 将颗粒映射至背景网格                                         |
| 12   | DetectContactAll      | 对颗粒-颗粒、颗粒-块体、颗粒-刚性面进行接触检测              |
| 13   | DetectPPContact       | 仅对颗粒-颗粒进行接触检测                                    |
| 14   | DetectPBContact       | 仅对颗粒-块体进行接触检测                                    |
| 15   | DetectPFContact       | 仅对颗粒-刚性面进行接触检测                                  |
| 16   | CalPPContact          | 计算颗粒-颗粒接触力                                          |
| 17   | CalPBContact          | 计算颗粒-块体接触力                                          |
| 18   | CalPFContact          | 计算颗粒-刚性面接触力                                        |
| 19   | CalRotaSpring         | 计算转角弹簧                                                 |
| 20   | CalQuietBound         | 计算无反射边界                                               |
| 21   | CalDynaBound          | 计算动态力                                                   |
| 22   | CalMovement           | 计算颗粒运动                                                 |
| 23   | PostProcess           | 颗粒后处理                                                   |
| 24   | SearchParInCell       | 搜索某一cell内的颗粒，返回颗粒总数                           |
| 25   | GetParIdInCell        | 获取某一索引号的颗粒ID号                                     |
| 26   | GetParStatiStress     | 获取球形统计区域内颗粒的统计应力，返回值为具有6个应力分量的数组 |



<!--HJS_pdyna_GetParticleID-->

### GetParticleID方法

获取离某一坐标点最近的颗粒序号，返回值可赋给JavScript变量。

#### 格式定义

pdyna. GetParticleID (*fx*, *fy*, *fz*);

#### 参数

*fx**、**fy**、**fz*：浮点型，三个坐标分量（单位：m）。

#### 备注

返回值-1，表示系统中未包含节点。

#### 范例

```javascript
var IDNo =pdyna.GetParticleID(5.0, 5.0, 5.0);
```

<!--HJS_pdyna_GetParticleValue-->

### GetParticleValue方法

#### 说明

获取某一ID号的颗粒信息。

#### 格式定义

pdyna.GetParticleValue (<*IDNo*, *msValueName*[,*iflag*]>);

#### 参数

*IDNo*：整型，颗粒的ID号，从1开始。

*msValueName*：字符串型，可供获取的颗粒信息，具体见附表2。

*iflag*：整型，获取变量的分量ID号，如果为标量（或想获取第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号颗粒的体心坐标
var xc = pdyna. GetParticleValue (100, "Centroid", 1);
var yc = pdyna. GetParticleValue (100, "Centroid", 2);
var zc = pdyna. GetParticleValue (100, "Centroid", 3);
```

<!--HJS_pdyna_GetPPContactValue-->

### GetPPContactValue方法

#### 说明

获取颗粒与颗粒之间的接触信息。

#### 格式定义

pdyna. GetPPContactValue (<*ID*, ICon, *msValueName*[,*iflag*]>);

#### 参数

*ID*：整型，颗粒的ID号，从1开始。

Icon：整型，序号为ID的颗粒的PP接触列表中的接触对序号，从1开始。

*msValueName*：字符串型，可供获取的颗粒与颗粒的接触信息，具体见附表3。

*iflag*：整型，获取变量的分量ID号，如果为标量（或想获取第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号颗粒，第1个颗粒-颗粒接触的X方向的全局接触力
var xforce = pdyna. GetPPContactValue (100, 1, "GlobalForce", 1);
```

<!--HJS_pdyna_GetPFaceContactValue-->

### GetPFaceContactValue方法

#### 说明

获取颗粒与刚性面之间的接触信息。

#### 格式定义

pdyna. GetPFaceContactValue (<*ID*, ICon, *msValueName*[,*iflag*]>);

#### 参数

*ID*：整型，颗粒的ID号，从1开始。

Icon：整型，序号为ID的颗粒的PFace接触列表中的接触对序号，从1开始。

*msValueName*：字符串型，可供获取的颗粒与刚性面的接触信息，具体见附表4。

*iflag*：整型，获取变量的分量ID号，如果为标量（或想获取第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号颗粒，第1个颗粒-刚性面接触的X方向的全局接触力
var xforce = pdyna. GetPFaceContactValue (100, 1, "GlobalForce", 1);
```

<!--HJS_pdyna_GetPBlockContactValue-->

### GetPBlockContactValue方法

#### 说明

获取颗粒与块体单元之间的接触信息。

#### 格式定义

pdyna. GetPBlockContactValue (<*ID*, ICon, *msValueName*[,*iflag*]>);

#### 参数

*ID*：整型，颗粒的ID号，从1开始。

Icon：整型，序号为ID的颗粒的块体接触列表中的接触对序号，从1开始。

*msValueName*：字符串型，可供获取的颗粒与块体的接触信息，具体见附表4。

*iflag*：整型，获取变量的分量ID号，如果为标量（或想获取第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//获取第100号颗粒，第1个颗粒-块体接触的X方向的全局接触力
var xforce = pdyna. GetPBlockContactValue (100, 1, "GlobalForce", 1);
```

<!--HJS_pdyna_SetParticleValue-->

### SetParticleValue方法

#### 说明

设置某一ID号的颗粒信息。

#### 格式定义

pdyna.SetParticleValue (<*IDNo*, *msValueName, fValue* [,*iflag*]>);

#### 参数

*IDNo*：整型，颗粒的ID号，从1开始。

*msValueName*：字符串型，可供设置的颗粒信息，具体见附表2

*fValue*：浮点型，需要设置的数值。

*iflag*：整型，设置变量的分量ID号，如果为标量（或想设置第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//设置第100号颗粒的粘聚力
pdyna. SetParticleValue (100, "Cohesion", 1e6);
```

<!--HJS_pdyna_SetPPContactValue-->

### SetPPContactValue方法

#### 说明

设置颗粒与颗粒之间的接触信息。

#### 格式定义

pdyna. SetPPContactValue (<*ID*, ICon, *msValueName, fValue* [,*iflag*]>);

#### 参数

*ID*：整型，颗粒的ID号，从1开始。

Icon：整型，序号为ID的颗粒的PP接触列表中的接触对序号，从1开始。

*msValueName*：字符串型，可供设置的颗粒与颗粒的接触信息，具体见附表3。

*fValue*：浮点型，需要设置的数值。

*iflag*：整型，设置变量的分量ID号，如果为标量（或想设置第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//设置第100号颗粒，第1个颗粒-颗粒接触的Y方向的全局接触力
pdyna. SetPPContactValue (100, 1, "GlobalForce",1e6, 2);
```

<!--HJS_pdyna_SetPFaceContactValue-->

### SetPFaceContactValue方法

#### 说明

设置颗粒与刚性面之间的接触信息。

#### 格式定义

pdyna. SetPFaceContactValue (<*ID*, ICon, *msValueName, fValue* [,*iflag*]>);

#### 参数

*ID*：整型，颗粒的ID号，从1开始。

Icon：整型，序号为ID的颗粒的PFace接触列表中的接触对序号，从1开始。

*msValueName*：字符串型，可供设置的颗粒与刚性面的接触信息，具体见附表4。

*fValue*：浮点型，需要设置的数值。

*iflag*：整型，设置变量的分量ID号，如果为标量（或想设置第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//设置第100号颗粒，第1个颗粒-刚性面接触的Z方向的全局接触力
pdyna. SetPFaceContactValue (100, 1, "GlobalForce", 1e5, 3);
```

<!--HJS_pdyna_SetPBlockContactValue-->

### SetPBlockContactValue方法

#### 说明

设置颗粒与块体单元之间的接触信息。

#### 格式定义

pdyna. SetPBlockContactValue (<*ID*, ICon, *msValueName, fValue* [,*iflag*]>);

#### 参数

*ID*：整型，颗粒的ID号，从1开始。

Icon：整型，序号为ID的颗粒的块体接触列表中的接触对序号，从1开始。

*msValueName*：字符串型，可供设置的颗粒与块体单元的接触信息，具体见附表4。

*fValue*：浮点型，需要设置的数值。

*iflag*：整型，设置变量的分量ID号，如果为标量（或想设置第一个分量），可以不写，或写1。

#### 备注

#### 范例

```javascript
//设置第100号颗粒，第1个颗粒-块体接触的Z方向的全局接触力
pdyna. SetPBlockContactValue (100, 1, "GlobalForce", 1e5, 3);
```

<!--HJS_pdyna_Solver-->

### Solver方法

#### 说明

PDyna集成核心求解器（包含DEM、PCMM、PFLY、MPM等多个求解器）。

#### 格式定义

pdyna.Solver ();

#### 参数

#### 备注

用户自定义求解过程时，调用该接口函数可实现PDyna的核心求解功能。

该函数的范围值为颗粒的不平衡率。

#### 范例

```javascript
var unbalRatio = pdyna. Solver ();
```

<!--HJS_pdyna_CellMapping-->

### CellMapping方法

#### 说明

将颗粒映射到背景格子上，便于接触检测。

#### 格式定义

pdyna. CellMapping ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，一般在每一迭代步的最开始执行。

#### 范例

```javascript
pdyna. CellMapping();
```

<!--HJS_pdyna_DetectContactAll-->

### DetectContactAll方法

#### 说明

进行接触检测，包括颗粒-颗粒、颗粒-块体、颗粒-刚性面三个部分。

#### 格式定义

pdyna. DetectContactAll ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触力求解前执行。

#### 范例

```javascript
pdyna. DetectContactAll ();
```

<!--HJS_pdyna_DetectPPContact-->

### DetectPPContact方法

#### 说明

进行颗粒与颗粒的接触检测。

#### 格式定义

pdyna. DetectPPContact ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触力求解前执行。

#### 范例

```javascript
pdyna. DetectPPContact ();
```

<!--HJS_pdyna_DetectPBContact-->

### DetectPBContact方法

#### 说明

进行颗粒与块体的接触检测。

#### 格式定义

pdyna. DetectPBContact ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触力求解前执行。

#### 范例

```javascript
pdyna. DetectPBContact ();
```

<!--HJS_pdyna_DetectPFContact-->

### DetectPFContact方法

#### 说明

进行颗粒与刚性面的接触检测。

#### 格式定义

pdyna. DetectPFContact ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触力求解前执行。

#### 范例

```javascript
pdyna. DetectPFContact ();
```

<!--HJS_pdyna_CalPPContact-->

### CalPPContact方法

#### 说明

计算颗粒与颗粒的接触力。

#### 格式定义

pdyna. CalPPContact ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触检测后执行。

#### 范例

```javascript
pdyna. CalPPContact ();
```

<!--HJS_pdyna_CalPBContact-->

### CalPBContact方法

#### 说明

计算颗粒与块体的接触力。

#### 定义

pdyna. CalPBContact ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触检测后执行。

#### 范例

```javascript
pdyna. CalPBContact ();
```

<!--HJS_pdyna_CalPFContact-->

### CalPFContact方法

#### 说明

计算颗粒与刚性面的接触力。

#### 格式定义

pdyna. CalPFContact ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触检测后执行。

#### 范例

```javascript
pdyna. CalPFContact ();
```

<!--HJS_pdyna_CalRotaSpring-->

### CalRotaSpring方法

#### 说明

计算颗粒与颗粒之间的转角弹簧力。

#### 格式定义

pdyna. CalRotaSpring ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，需在接触检测后执行。

#### 范例

```javascript
pdyna. CalRotaSpring ();
```

<!--HJS_pdyna_CalQuietBound-->

### CalQuietBound方法

#### 说明

计算无反射边界条件。

#### 格式定义

pdyna. CalQuietBound ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装。

#### 范例

```javascript
pdyna. CalQuietBound ();
```

<!--HJS_pdyna_CalDynaBound-->

### CalDynaBound方法

#### 说明

计算动态力。

#### 格式定义

pdyna. CalDynaBound ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装。

#### 范例

```javascript
pdyna. CalDynaBound ();
```

<!--HJS_pdyna_CalMovement-->

### CalMovement方法

#### 说明

计算颗粒的运动（包括平动及转动）。

#### 格式定义

pdyna. CalMovement ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装。

#### 范例

```javascript
pdyna. CalMovement ();
```

<!--HJS_pdyna_PostProcess-->

### PostProcess方法

#### 说明

对颗粒计算信息进行后处理，包括计算每个颗粒的应变及应力，颗粒超出或进入设定区域删除颗粒等。

#### 格式定义

pdyna. PostProcess ();

#### 参数

#### 备注

本脚本函数主要用于自定义DEM求解器的组装，一般在每一迭代步的最后执行。

#### 范例

```javascript
pdyna. PostProcess();
```

<!--HJS_pdyna_SearchParInCell-->

### SearchParInCell方法

#### 说明

搜索某一空间格子内的颗粒，返回颗粒的总数。

#### 格式定义

pdyna.SearchParInCell( < *fMinX, fMinY, fMinZ, fMaxX, fMaxY, fMaxZ* > );

#### 参数

*fMinX, fMinY, fMinZ*：浮点型，格子的最小坐标值（单位：m）。

*fMaxX, fMaxY, fMaxZ*：浮点型，格子的最大坐标值（单位：m）。

#### 备注

（1）  返回值为格子内的颗粒总数。

（2）  此函数与函数pdyna.GetParIdInCell(<iComp>)连用，返回与设定格子区域内可能发生作用的潜在颗粒。

#### 范例

```javascript
///搜索最小坐标[4,4,4]与最大坐标[6,6,6]控制下的格子内的颗粒
var totalno = pdyna.SearchParInCell(4, 4, 4, 6, 6, 6);
print(totalno, " particles in cell.");
for(var i = 1; i <= totalno; i++)
{
    var id = pdyna.GetParIdInCell(i);
    print(id);
}
```

<!--HJS_pdyna_GetParIdInCell-->

### GetParIdInCell方法

#### 说明

返回格子内某一颗粒的ID号。

#### 格式定义

pdyna.GetParIdInCell ( <*iComp* > );

#### 参数

*iComp*：整型，颗粒索引号，大于等于1，小于最大颗粒数。

#### 备注

（1）  返回值为某一索引号对应的颗粒ID。

（2）  此函数与函数pdyna. SearchParInCell ()连用，返回与设定格子区域内可能发生作用的潜在颗粒。

#### 范例

```javascript
///搜索最小坐标[4,4,4]与最大坐标[6,6,6]控制下的格子内的颗粒
var totalno = pdyna.SearchParInCell(4, 4, 4, 6, 6, 6);
print(totalno, " particles in cell.");
for(var i = 1; i <= totalno; i++)
{
	var id = pdyna.GetParIdInCell(i);
	print(id);
}
```

<!--HJS_pdyna_GetParStatiStress-->

### GetParStatiStress方法

#### 说明

统计球形区域边界的接触力，进而计算统计区域的应力，返回值为具有6个应力分量的数组。

#### 格式定义

pdyna.GetParStatiStress( <*fCx, fCy, fCz, fRad*> );

#### 参数

*fCx, fCy, fCz*：浮点型，统计球形区域的坐标（单位：m）。

*fRad*：浮点型，球形统计区域的半径（单位：m）。

#### 备注

（1）  返回值为具有6个应力分量的数组。

#### 范例

```javascript
///球形的体心为(5,5,5),半径为2
var afStress = pdyna.GetParStatiStress ( 5.0, 5.0, 5.0, 2.0);
print(afStress);
```

