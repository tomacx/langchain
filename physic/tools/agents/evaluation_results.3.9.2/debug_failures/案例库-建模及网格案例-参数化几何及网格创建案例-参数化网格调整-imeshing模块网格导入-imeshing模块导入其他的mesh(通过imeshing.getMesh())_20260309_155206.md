# Failure Analysis: 案例库-建模及网格案例-参数化几何及网格创建案例-参数化网格调整-imeshing模块网格导入-imeshing模块导入其他的mesh(通过imeshing.getMesh()).js

## Query
我想做一个建模及网格案例的数值模拟，功能是建模及网格案例，功能是参数化几何及网格创建案例-参数化网格调整-imeshing模块网格导入-imeshing模块导入其他的mesh(通过imeshing.getMesh())。请根据 CDEM 技术手册，合理选择imeshing等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

//创建矩形线环
var LineLoop1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1);

//创建椭圆线环
var Point1 = igeo.genPoint(6, 3, 0, 1);
var LineLoop2 = igeo.genEllipse(Point1, 3, 2, 0, 0, 0, 1);

//创建圆形线环
var LineLoop3 =igeo.genCircle(5, 15, 0, 3, 1); 

//创建面
var aLineLoop1 = [LineLoop1, LineLoop2, LineLoop3];
var Surface1 = igeo.genSurface(aLineLoop1, 1);

//面拉伸为体
var aSurface1 = [Surface1];
var Volume1 = igeo.extrude("Surface", aSurface1, 0, 0, 10, 1, 1, 1);

//创建圆柱体
var Volume2 = igeo.genCylinderV(15, 10, 0, 15, 10, -4, 2, 4, 0.3, 0.3, 2);

//两个体的粘接操作
var Volume3 = igeo.glue("Volume", Volume2, Volume1);

//划分三维网格
imeshing.genMeshByGmsh(3);
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

imesh.importGid("2d.msh");

imesh.importGid("gidmesh.msh");

imesh.importGid("hex.msh");

sleep(1000);

imeshing.getMesh(cMesh[2]);

sleep(1000);

imeshing.getMesh(cMesh[3]);

sleep(1000);

imeshing.getMesh(cMesh[4]);

sleep(1000);
```
