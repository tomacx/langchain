# Failure Analysis: 案例库-建模及网格案例-参数化几何及网格创建案例-参数化几何创建及网格剖分-MirrorCopy-Volume.js

## Query
我想做一个建模及网格案例的数值模拟，功能是建模及网格案例，功能是参数化几何及网格创建案例-参数化几何创建及网格剖分-MirrorCopy-Volume。请根据 CDEM 技术手册，合理选择igeo、imeshing等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

//创建面
var id = igeo.genRectS(0,0,0,1,1,0,0.1,1);

//设置二维网格划分方式为Frontal
imeshing.setValue("MeshType2D", 6);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);
```

## Ground Truth
```javascript
setCurDir(getSrcDir());


var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Volume2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);
var Volume3 = igeo.genCylinderV(0, 10, 0, 0, 15, 0, 0, 4, 0, 0.5, 3);

var Volume4 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

var Volume5 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Volume6 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);
var Volume7 = igeo.genBrickV(60, 0, 0, 70, 15, 8, 1.5, 7);

var aVolume1 = [Volume1, Volume2, Volume3, Volume4, Volume5, Volume6, Volume7];
var Ope1 = igeo.mirrorCopy("Volume", aVolume1, -20, 0, 0, 0, 0, 50, -20, 10, 0);

imeshing.genMeshByGmsh(3);

print("Finished");
```
