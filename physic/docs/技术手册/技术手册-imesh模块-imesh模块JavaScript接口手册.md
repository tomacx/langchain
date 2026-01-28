<!--HJS_imesh_overview-->

## imesh 类

imesh模块主要用于各类网格的导入导出及合并。

<center>网格导入导入导出类接口</center>

| **序号** | **函数名**        | **说明**                                        |
| -------- | ----------------- | ----------------------------------------------- |
| 1        | importAnsys       | 导入Ansys软件生成的计算网格。                   |
| 2        | importGid         | 导入Gid软件生成的计算网格。                     |
| 3        | importMidas       | 导入Midas软件生成的计算网格。                   |
| 4        | importGmsh        | 导入Gmsh软件生成的计算网格。                    |
| 5        | importStl         | 导入STL格式的三角网格。                         |
| 6        | importFlac3d      | 导入Flac3d软件生成的计算网格。                  |
| 7        | importPatran      | 导入Patran软件生成的计算网格。                  |
| 8        | importAbaqus      | 导入Abaqus软件生成的计算网格。                  |
| 9        | importLSDyna      | 导入LSDyna格式的计算网格。                      |
| 10       | importPDyna       | 导入PDyna格式的计算网格。                       |
| 11       | importGenvi       | 导入Genvi格式的计算网格。                       |
| 12       | importGenviPar    | 导入Genvi格式的颗粒类通用网格。                 |
| 13       | importGmshG       | 导入Gmsh格式的几何文件(*.geo)，并将其作为网格。 |
| 14       | exportGenvi       | 导出Genvi格式的计算网格。                       |
| 15       | exportAnsysBlkdyn | 导出Ansys转BlockDyna格式的网格。                |
| 16       | exportPDyna       | 导出PDyna格式的网格。                           |
| 17       | assemble          | 不同几何网格进行合并，产生新的网格。            |

<!--HJS_imesh_importAnsys-->

### importAnsys方法

#### 说明

导入Ansys软件生成的计算网格。

#### 格式定义

imesh.importAnsys( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）从Ansys中输出网格需要借助一段命令流文件“AnsysToCDEM.txt”（附录 1 ），在Ansys里建立网格（用plane42或solid45划分），在File菜单下选择Read input from，导入AnsysToCDEM.txt文件，在没有修改存放路径的情况下，将在D盘根目录下出现ansys.dat文件。
（ 3 ）此命令等同于GENVI平台的文件->导入->Ansys网格。

#### 范例

```js
imesh.importAnsys();
imesh.importAnsys("ansys.dat");
```

<!--HJS_imesh_importGid-->

### importGid方法

#### 说明

导入Gid软件生成的计算网格。

#### 格式定义

imesh.importGid( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）从GiD导入，在GiD菜单FILE—>Export—>ASCII project，将在指定目录下创建*.gid文件夹，该文件夹中的文本文件*.msh即为导入时的网格。
（ 3 ）此命令等同于GENVI平台的文件->导入->Gid网格。

#### 范例

```js
imesh.importGid();
imesh.importGid( "gid.msh");
```

<!--HJS_imesh_importMidas-->

### importMidas方法

#### 说明

导入Midas软件生成的计算网格。

#### 格式定义

imesh.importMidas( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）从Midas导入，首先利用Midas软件进行建模，而后导出为fpn格式的文本文件。
（ 3 ）此命令等同于GENVI平台的文件->导入->Midas网格。

#### 范例

```js
imesh.importMidas();
imesh.importMidas( "Midas.fpn");
```

<!--HJS_imesh_importGmsh-->

### importGmsh方法

#### 说明

导入Gmsh软件生成的计算网格。

#### 格式定义

imesh.importGmsh( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）从Gmsh导入，首先利用Gmsh开源软件进行建模并划分网格，同时分物理组（Physical Surface/Volume），否则将存在点、线、面、体单元全部导出的现象。而后从File菜单下的Save mesh选项导出网格。
（ 3 ）此命令等同于GENVI平台的文件->导入->Gmsh网格。

#### 范例

```js
imesh.importGmsh();
imesh.importGmsh( "Gmsh.msh");
```

<!--HJS_imesh_importStl-->

### importStl方法

#### 说明

导入STL格式的三角网格。

#### 格式定义

imesh.importStl( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）导入STL格式的三角网时，文本格式及二进制格式均可，由于从STL导入的三角网是离散的，作为面单元使用时，需要进行连接（Merge）。
（ 3 ）此命令等同于GENVI平台的文件->导入->STL文件。

#### 范例

```js
imesh.importStl();
imesh.importStl("STL.stl");
```

<!--HJS_imesh_importFlac3d-->

### importFlac3d方法

#### 说明

导入Flac3d软件生成的计算网格。

#### 格式定义

imesh.importFlac3d( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）从Flac3D中导入时，组号必需为大于等于 1 的自然数，可在Flac3D的命令行中输入expgrid ***.flac3d，然后通过本命令流导入。
（ 3 ）此命令等同于GENVI平台的文件->导入->FLAC3D文件。

#### 范例

```js
imesh.importFlac3d();
imesh.importFlac3d( "Flac3d.flac3d");
```

<!--HJS_imesh_importPatran-->

### importPatran方法

#### 说明

导入Patran软件生成的计算网格。

#### 格式定义

imesh.importPatran( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）从Patran导入时适用的单元类型包括Tria3、Quad4、Tet4、Wedge6及Hex8，通过File菜单Export下的Fromat中选择Neutral，输出文件名后缀为.out文件，文件名中英文均可。
（ 3 ）此命令等同于GENVI平台的文件->导入->Patran网格。

#### 范例

```js
imesh.importPatran();
imesh.importPatran( "Patran.out");
```

<!--HJS_imesh_importAbaqus-->

### importAbaqus方法

#### 说明

导入Abaqus软件生成的计算网格。

#### 格式定义

imesh.importAbaqus( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）从ABAQUS导入，支持的网格格式包括C3D8、C3D8R、C3D6、C3D4、C2D3、S3R、CPS3、CPE3、C2D4、C2D4R、S4R、CPS4、CPS4R、CPE4、CPE4R，导入的是*.inp文件。
（ 3 ）此命令等同于GENVI平台的文件->导入->Abaqus网格。

#### 范例

```js
imesh.importAbaqus();
imesh.importAbaqus("Abaqus.inp");
```

<!--HJS_imesh_importLSDyna-->

### importLSDyna方法

#### 说明

导入LSDyna格式的计算网格。

#### 格式定义

imesh.importLSDyna( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平台的网格处新创建一个几何网格。
（ 2 ）导入LSDyna软件的k文件，k文件的格式为自由格式。
（ 3 ）此命令等同于GENVI平台的文件->导入->LS-Dyna网格。

#### 范例

```js
imesh.importLSDyna();
imesh.importLSDyna("LSDyna.k");
```

<!--HJS_imesh_importPDyna-->

### importPDyna方法

#### 说明

导入PDyna格式的计算网格。

#### 格式定义

imesh.importPDyna( *[FilePath]* );

#### 参数

*FilePath* ：网格文件的路径及文件名。可以是完整路径，也可以是相对路径，
或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界
面进行选取。

#### 备注

（ 1 ）网格导入采用了追加导入的方式。每导入一次网格，便会在GENVI平
台的网格处新创建一个几何网格。
（ 2 ）导入PDyna格式的颗粒（文件扩展名为.dat），其文件格式为

![](E:/SW2021/帮助文档转html/imesh/第二步工作/img/PDyna.png)



第一行为颗粒总数；

第二行为表头，分别为颗粒序号，类型（ 1 表示二维、2 表示 3 维），颗粒组号，颗粒本构模型号，颗粒半径，颗粒体心X坐标，颗粒体心Y坐标，颗粒体心Z坐标；

后续若干行（行数为颗粒总数）为具体颗粒的数值。

（ 3 ）此命令等同于GENVI平台的文件->导入->P-Dyna网格。

#### 范例

```js
imesh.importPDyna();
imesh.importPDyna("PDyna.dat");
```

<!--HJS_imesh_importGenvi-->

### importGenvi方法

#### 说明

调入Genvi通用网格文件。

#### 格式定义

imesh.importGenvi (<[ *strFileName* ]>);

#### 参数

*strFileName* ：字符串型，网格文件名（含路径）（文件扩展名为gvx）。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）若 *strFileName* 不写，则自动弹出文件选择对话框，通过鼠标键盘选取需要读入的文件。
（ 2）Genvi通用网格文件支持颗粒、线段、三角形、四边形、四面体、金字塔、三棱柱、六面体、多边形、多面体等多种单元类型（文件格式说明详见附录2 ）。

#### 范例

```js
//调入多面体网格
imesh. importGenvi ("polyhedron.gvx");
```



<!--HJS_imesh_importGenviPar-->

### importGenviPar方法

#### 说明

调入Genvi颗粒类通用网格文件。

#### 格式定义

imesh.importGenviPar(<[ *strFileName* ]>);

#### 参数

*strFileName* ：字符串型，网格文件名（含路径）（文件扩展名为gvpx）。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）若 *strFileName* 不写，则自动弹出文件选择对话框，通过鼠标键盘选取需要读入的文件。
（ 3 ）Genvi通用颗粒网格文件目前支持二维圆、椭圆、三维球、三维多面体球、三维圆柱等颗粒单元类型（文件格式说明详见附录3 ）。

#### 范例

```js
//调入多面体网格
imesh. importGenviPar ("circle.gvpx");
```



<!--HJS_imesh_importGmshG-->

### importGmshG方法

#### 说明

调入Gmsh格式的几何文件，并将其作为计算网格。

#### 格式定义

imesh.importGmshG(<[ *strFileName* ]>);

#### 参数

*strFileName* ：字符串型，网格文件名（含路径）（文件扩展名为geo）。可以是完整路径，也可以是相对路径，或当前目录下的文件名。也可以为空，如为空，则会跳出对话框，让用户通过界面进行选取。

#### 备注

（ 1 ）若 *strFileName* 不写，则自动弹出文件选择对话框，通过鼠标键盘选取需要读入的文件。
（ 2 ）调入成功后，将在平台上生成*.geo Mesh的几何网格对象。
（ 3 ）目前仅支持二维多边形几何及三维多面体几何的导入，导入后分别将其视为二维多边形单元及三维多面体单元。

#### 范例

```js
//调入多面体网格
imesh. importGmshG ("poly.geo");
```



<!--HJS_imesh_exportGenvi-->

### exportGenvi方法

#### 说明

导出Genvi通用网格文件。

#### 格式定义

imesh.exportGenvi (< *oMesh[, strFileName]* >);

#### 参数

*oMesh* ：Genvi内置网格对象。
*strFileName* ：字符串型，网格文件名（含路径）（文件扩展名为gvx）。

#### 备注

（ 1 ）若 *strFileName* 不写，则自动弹出文件选择对话框，通过鼠标键盘选取输出路径并设定文件名称。
（ 2 ）调入成功后，将在对应路径下产生Genvi通用网格格式文件。
（ 3 ）Genvi通用网格文件支持颗粒、线段、三角形、四边形、四面体、金字塔、三棱柱、六面体、多边形、多面体等多种单元类型（文件格式说明详见附录2 ）。

#### 范例

```js
//输出Genvi通用网格文件
imesh. exportGenvi (omesh, "block.gvx");
```

<!--HJS_imesh_exportAnsysBlkdyn-->

### exportAnsysBlkdyn方法

#### 说明

导出Ansys转BlockDyna格式的网格。

#### 格式定义

imesh.exportAnsysBlkdyn(< *oMesh[, strFileName]* >);

#### 参数

*oMesh* ：Genvi内置网格对象。
*strFileName* ：字符串型，网格文件名（含路径）（文件扩展名为dat）。

#### 备注

（ 1 ）若 *strFileName* 不写，则自动弹出文件选择对话框，通过鼠标键盘选取输出路径并设定文件名称。
（ 2 ）调入成功后，将在对应路径下产生Ansys转BlockDyna格式的网格文件。
（ 3 ）AnsysBlkdyn的网格文件支持杆件、三角形、四边形、四面体、三棱柱、金字塔、六面体等单元类型。

#### 范例

```js
//输出Genvi通用网格文件
imesh.exportAnsysBlkdyn(omesh, "blkdyn.dat");
```

<!--HJS_imesh_exportPDyna-->

### exportPDyna方法

#### 说明

导出PDyna格式的二维圆形及三维球形颗粒。

#### 格式定义

imesh.exportPDyna(< *oMesh[, strFileName]* >);

#### 参数

*oMesh* ：Genvi内置网格对象。
*strFileName* ：字符串型，网格文件名（含路径）（文件扩展名为dat）。

#### 备注

（ 1 ）若 *strFileName* 不写，则自动弹出文件选择对话框，通过鼠标键盘选取输出路径并设定文件名称。
（ 2 ）调入成功后，将在对应路径下产生PDyna格式的颗粒文件。
（ 3 ）PDyna格式的颗粒文件支持二维圆形颗粒及三维球形颗粒。

#### 范例

```js
//输出Genvi通用网格文件
imesh.exportPDyna(omesh, "pdyna.dat");
```



<!--HJS_imesh_assemble-->

### assemble方法

#### 说明

将Genvi平台上不同的几何网格或问题网格进行组装，并放置在一个新的几何网格中。

#### 格式定义

imesh.assemble(< *oMesh1, oMesh2, oMesh3......* >);

#### 参数

oMesh1, oMesh2, oMesh3：Genvi内置网格对象。

#### 备注

（ 1 ）输入参数至少包含 1 个Genvi内置网格对象。

#### 范例

```js
//对平台上的不同网格进行合并
imesh.assemble(omesh1, omesh2, omesh3);
```



<!--HJS_imesh_Append_1_AnsysExportCmd-->

###  附录1 Ansys输出网格的命令流

利用Ansys软件建立计算网格，供CDyna导入时，需要在Ansys下调入以下APDL命令流，即可在D盘根目录下产生ansys.dat的网格文件，该网格文件可被CDyna中的块体模块及刚性面模块调入。用户可修改以下APDL命令流中的文件存储路径，实现其他路径下文件的存储。

调用时，需要将以下脚本存储为文本文档，并存储至D盘根目录下；若用户希望存储至其他路径，需要在脚本中将对应的路径修改为所设定的路径。

使用ANSYS软件划分网格时，三维单元采用solid45或solid185进行剖分。二维单元采用plane42进行剖分，若软件GUI中无法选择plane42单元，可在命令行中输入”et, 1, plane42”进行设置。

```
/prep7

*MSG,ui

ANSYS to Dyna Suite, version=1.0 !

NUMMRG,NODE, , , ,LOW  

NUMMRG,ELEM, , , ,LOW

nsel,all 

esel,all

node_1=1

node_2=2

node_3=3

node_4=4

node_5=5

node_6=6

node_7=7

node_8=8

NUMCMP,ALL ! 压缩节点号和单元号以及材料号

*get,NodeNum,node,,NUM,MAX 

*get,EleNum,elem,,NUM,MAX 

 

*dim,NodeData,array,NodeNum,3 

*dim,EleData,array,EleNum,8 

*Dim,EleMat,array,EleNum,1,1

 

*do,i,1,NodeNum

*get,NodeData(i,1),node,i,LOC,x 

*get,NodeData(i,2),node,i,LOC,y 

*get,NodeData(i,3),node,i,LOC,z

*enddo

 

*vget,EleData(1,node_1),elem,1,NODE,node_1 

*vget,EleData(1,node_2),elem,1,NODE,node_2 

*vget,EleData(1,node_3),elem,1,NODE,node_3 

*vget,EleData(1,node_4),elem,1,NODE,node_4 

*vget,EleData(1,node_5),elem,1,NODE,node_5 

*vget,EleData(1,node_6),elem,1,NODE,node_6 

*vget,EleData(1,node_7),elem,1,NODE,node_7 

*vget,EleData(1,node_8),elem,1,NODE,node_8

*vget,EleMat(1),ELEM,1,ATTR,MAT 

 

!写节点数据到文件，该脚本的路径为D盘根目录，用户可按需进行修改。

*CFOPEN,ansys,dat,D:\

*vwrite, nodenum, elenum

%20I%20I 

*vwrite,sequ,NodeData(1,1),NodeData(1,2),NodeData(1,3) 

%20I%20.10G%20.10G%20.10G

*vwrite,sequ,EleData(1,1),EleData(1,2),EleData(1,3),EleData(1,4),EleData(1,5),EleData(1,6),EleData(1,7),EleData(1,8), EleMat(1) 

%20I%20I%20I%20I%20I%20I%20I%20I%20I%20I

*cfclos 

*MSG,ui 

File is created in D:\!
```



<!--HJS_imesh_Append_2_Genvi_Grid_Type-->

###  附录2 Genvi通用网格格式说明

#### 基本原则

（1）不空行。

（2）通过空格进行数据、字符串的分割，不可使用（Tab、”\t”）进行分割。

#### 表头

（1）第一行为表头，名称必须为"Genvi General Mesh Format 1.0"。

#### 节点

（1）第二行为节点关键字及节点个数"Nodes N";

（2）紧随其后的为N行的节点信息，每行包含4个数，分别为节点序号及3个节点坐标（如果为二维，可为2个节点坐标）；

#### 单元

（1）第N+3行，为单元关键字及单元个数"Elems M";

（2）紧随其后的为单元信息，初多面体单元外，共M行，每行包括单元序号、单元类型、单元组号、单元标签号、单元节点序号，若为颗粒，还包含颗粒半径等信息。

（3）目前支持的单元类型包括："Par"、"Bar2"、"Tri3"、"Quad4"、"Tet4"、"Pyra5"、"Wed6"、"Hex8"、"Poly2D"、"Poly3D"。

（4）单元组号及单元标签号为大于等于1的自然数。

（5）若为颗粒"Par"，则书写完单元节点序号后，最后一个为颗粒半径。

（5）若为多面体"Poly3D"，在常规单元行之后，下一行为单元面总数K，而后为K行的每个单元面的组成序号（单元内局点序号，从1开始）。

#### 组号名称

（1）    在单元书写完毕之后，为可选的输入项。

（2）   组号输入项为组号关键词和组号数量"GrpNames X"。

（3）   而后为X个行的组号名称信息，每行包含2个数，第一个为组号序号，第二个为组号名称。

（4）   如果某单元的组号没有对应的组号名称，则将组号（序号）作为该组的名称。

#### 标签号名称

（1）    在单元书写完毕之后，为可选的输入项。

（2）   标签号输入项为标签号关键词和组号数量"TagNames Y"

（3）   而后为Y个行的标签号名称信息，每行包含2个数，第一个为标签号序号，第二个为标签号名称。

（4）   目前此项功能为备用，将来可用于区分不同的力学属性（如固体单元、流体单元等）。

#### Genvi平台如何导入

（1）    通过脚本导入，imesh.importGenvi()。

（2）    通过菜单导入，文件->导入->Genvi通用网格

#### 示例

（1）颗粒网格示例

```
Genvi General Mesh Format 1.0

Nodes 4

1 0 0 0

2 1 0 0

3 1 1 0

4 0 1 0

Elems 4

1 Par 1 1 1 0.1

2 Par 2 1 2 0.2

3 Par 3 1 3 0.3

4 Par 4 1 4 0.4

GrpNames 1

2 feng
```

 

（2）四边形网格示例

```
Genvi General Mesh Format 1.0

Nodes 4

1 0 0 0

2 1 0 0

3 1 1 0

4 0 1 0

Elems 1

1 Quad4 2 1 1 2 3 4 

GrpNames 1

1 feng
```

 

（3）多边形网格示例

```
Genvi General Mesh Format 1.0

Nodes 11

1 0 0 0

2 1 0 0

3 1.5 0.5 0

4 2 1.5 0

5 0 1 0

6 4 4 0

7 5 4.5 0

8 5.5 7 0

9 4.5 6 0

10 4 6 0

11 3 5

Elems 2

1 Poly2D 1 1 1 2 3 4 5

2 Poly2D 2 1 6 7 8 9 10 11

GrpNames 2

1 block1

2 block2
```



（4）多面体网格示例

```
Genvi General Mesh Format 1.0

Nodes 5

1 0 0 0

2 1 0 0

3 1 1 0

4 0 1 0

5 0.5 0.5 1

Elems 1

1 Poly3D 1 1 1 2 3 4 5

5

1 2 3 4

1 2 5

2 3 5

3 4 5

4 1 5

GrpNames 1

1 block1
```



<!--HJS_imesh_Append_3_Genvi_Par_Type-->

###  附录3 Genvi颗粒网格格式说明

#### 基本原则

（1）不空行。

（2）通过空格进行数据、字符串的分割，不可使用（Tab、”\t”）进行分割。

#### 表头

（1）第一行为表头，名称必须为" Genvi General Particle Format 1.0"。

#### 颗粒

（1）第二行为颗粒数量关键字及颗粒个数" Num N"。

（2）紧随其后的为N行的颗粒信息，每行包含的数据量根据颗粒类型的不同而不同；但每一行的第1个元素为颗粒序号（大于等于1的整型），第2个元素为颗粒类型（字符串型），第3个元素为颗粒组号（大于等于1的整型），第4个元素为颗粒类型号（Tag）号（大于等于1的整型），第5个及之后的元素，根据颗粒类型的不同而不同。

（3）颗粒类型目前仅支持"Par"、"PoCir"、"PoElli"、"PoCyli"。

（4）若颗粒类型为"Par"，表示三维球形颗粒（采用Genvi平台高性能球形颗粒进行三维渲染展示）。该行共包含8个元素，依次为：1-颗粒序号（整型）、2-颗粒类型（为"Par"，字符串型）、3-颗粒组号（整型）、4-颗粒Tag号（整型）、5-颗粒体心X方向坐标（浮点型）、6-颗粒体心Y方向坐标（浮点型）、7-颗粒体心Z方向坐标（浮点型）、8-颗粒半径（浮点型）。

（5）若颗粒类型为"PoCir"，表示二维圆形颗粒（采用Genvi平台通用多边形单元进行渲染展示）。该行有2种数据格式，一种格式包含9个元素，一种包含12个元素；如果为9个元素的情况，依次为1-颗粒序号（整型）、2-颗粒类型（为" PoCir"，字符串型）、3-颗粒组号（整型）、4-颗粒Tag号（整型）、5-构成圆形的多边形数量（整型），6-颗粒体心X方向坐标（浮点型）、7-颗粒体心Y方向坐标（浮点型）、8-颗粒体心Z方向坐标（浮点型）、9-颗粒半径（浮点型）；如果为12个元素的情况，前9个元素与之前的一致，后3个元素表示圆面的法向在X轴、Y轴、Z轴的分量（若该三个元素不写，则默认的圆面法向为Z坐标的方向，），此三个法向分量不用归一化，软件读入时自动会进行归一化操作。

（6）若颗粒类型为"PoElli"，表示二维椭圆形颗粒（采用Genvi平台通用多边形单元进行渲染展示）。该行有2种数据格式，一种格式包含11个元素，一种包含16个元素；如果为11个元素的情况，依次为1-颗粒序号（整型）、2-颗粒类型（为" PoCir"，字符串型）、3-颗粒组号（整型）、4-颗粒Tag号（整型）、5-构成椭圆形的多边形数量（整型），6-颗粒体心X方向坐标（浮点型）、7-颗粒体心Y方向坐标（浮点型）、8-颗粒体心Z方向坐标（浮点型）、9-颗粒在X轴上的半径（浮点型，半径1）、10-颗粒在Y轴上的半径（浮点型，半径2、11-颗粒绕着Z轴的旋转角（浮点型，11个元素的格式下，认为椭圆形颗粒的法向为Z坐标方向）；若为16个元素的情况，前10个元素与之前的一致，后6个参数分别表示半径1的方向分量（3个元素，浮点型）及半径2的方向分量（3个元素，浮点型）。16元素模式下，沿着半径的方向分量不用归一化，软件读入时自动会进行归一化操作。

（7）若颗粒类型为"PoCyli"，表示三维圆柱体颗粒（采用Genvi平台通用多面体单元进行渲染展示）。该行有2种数据格式，一种格式包含11个元素，一种包含14个元素；如果为11个元素的情况，依次为1-颗粒序号（整型）、2-颗粒类型（为" PoCir"，字符串型）、3-颗粒组号（整型）、4-颗粒Tag号（整型）、5-圆柱体圆周的分割数量（整型），6-圆柱体高方向的分割数量（整型），7-颗粒体心X方向坐标（浮点型）、8-颗粒体心Y方向坐标（浮点型）、9-颗粒体心Z方向坐标（浮点型）、10-圆柱体半径（浮点型）、11-圆柱体高度（浮点型），11参数下，默认圆柱体的轴向为Z坐标方向；若为14个元素，前11个元素与之前的一致，后3个元素分别表示圆柱体的轴向在X轴的分量、Y轴的分量及Z轴的分量（3个分量不用归一化，软件读入时自动会进行归一化操作。）。

#### 组号名称

（1）在单元书写完毕之后，为可选的输入项。

（2）组号输入项为组号关键词和组号数量"GrpNames X"

（3）而后为X个行的组号名称信息，每行包含2个数，第一个为组号序号，第二个为组号名称。

（4）如果某单元的组号没有对应的组号名称，则将组号（序号）作为该组的名称。

#### 标签号名称

（1）在单元书写完毕之后，为可选的输入项。

（2）标签号输入项为标签号关键词和组号数量"TagNames Y"

（3）而后为Y个行的标签号名称信息，每行包含2个数，第一个为标签号序号，第二个为标签号名称。

（4）如果某单元的标签号没有对应的标签名称，则将标签号（序号）作为该标签的名称。

（5）目前此项功能为备用，将来可用于区分不同的力学属性（如固体单元、流体单元等）。

#### Genvi平台如何导入

（1）通过脚本导入，imesh.importGenviPar()。

（2）通过菜单导入，文件->导入->Genvi颗粒网格。

#### 示例

（1）二维颗粒及三维颗粒示例

```
Genvi General Particle Format 1.0

Num 4

1 PoCir 1 1 20 0 0 0 0.5 0 0 1

2 Par 2 1 4 4 0 0.2

3 Par 3 1 6 6 0 0.3

4 Par 4 1 8 6 0 0.4

GrpNames 1

2 feng
```

（2）椭圆形颗粒示例

```
Genvi General Particle Format 1.0

Num 4

1 PoElli 1 1 20 0 0 0 0.5 0.4 0

2 PoElli 2 1 20 2 0 0 0.5 0.3 30

3 PoElli 3 1 20 2 2 0 0.5 0.2 60

4 PoElli 4 1 20 0 2 0 0.5 0.1 120

GrpNames 1

2 feng
```

 

（3）圆柱体颗粒示例

```
Genvi General Particle Format 1.0

Num 4

1 PoCyli 1 1 20 1 0 0 0 0.5 0.5 0 1 0

2 PoCyli 2 1 20 1 2 0 0 0.5 1.0 1 1 1

3 PoCyli 3 1 20 1 2 2 0 0.5 1.5 3 1 2

4 PoCyli 4 1 20 1 0 2 0 0.5 2.0

GrpNames 1

2 feng
```

 

（4）二维圆形网格改变构成圆形的多边形数量

```
Genvi General Particle Format 1.0

Num 4

1 PoCir 1 1 4 0 0 0 0.5

2 PoCir 2 1 5 2 0 0 0.5

3 PoCir 3 1 6 2 2 0 0.5

4 PoCir 4 1 7 0 2 0 0.5

GrpNames 1

2 feng
```

 



<!--HJS_END-->