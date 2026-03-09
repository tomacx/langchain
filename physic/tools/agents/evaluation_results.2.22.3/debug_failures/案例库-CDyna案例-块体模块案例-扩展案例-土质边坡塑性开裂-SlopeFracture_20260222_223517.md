# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-土质边坡塑性开裂-SlopeFracture.js

## Query
我想做一个CDyna案例的数值模拟，功能是CDyna案例，功能是块体模块案例-扩展案例-土质边坡塑性开裂-SlopeFracture。请根据 CDEM 技术手册，合理选择blkdyn、dyna、igeo、imeshing等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 1. 创建几何体
igeo.CreateBox([10, 10, 10], [0, 0, 0]);

// 2. 划分网格
imeshing.SetGridSize(100);
imeshing.GenerateMesh();

// 3. 设置物理参数和材料模型
blkdyn.SetModel("linear");
blkdyn.SetMat(2000, 3e9, 0.25, 1e4, 1e4, 20, 10);

// 4. 施加边界条件和载荷
blkdyn.FixV("y", 0, "y", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 9.999, 11);

// 5. 进行求解
dyna.Solve();
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

var afcoord = new Array ();
afcoord[0] = [0.0, 0.0, 0.0, 0.5];
afcoord[1] = [10.0, 0.0, 0.0, 0.5];
afcoord[2] = [10.0, 8.0, 0.0, 0.5];
afcoord[3] = [5.0, 8.0, 0.0, 0.5];
afcoord[4] = [4.0, 3.0, 0.0, 0.5];
afcoord[5] = [0.0, 3.0, 0.0, 0.5];
var id = igeo.genPloygenS(afcoord, 1);

imeshing.genMeshByGmsh(2);

dyna.Set("Output_Interval 500");

dyna.Set("Block_Soften_Value 2e-3  2e-3");

dyna.Set("Contact_Cal_Quantity 1");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2000,3e9,0.25,1e4,1e4,20,10);

blkdyn.SetIModel("ETSFM");

blkdyn.SetIMat(3e10,3e10, 10, 3e6, 1e6);


blkdyn.FixV("y",0,"y",-0.001,0.001);
blkdyn.FixV("x",0,"x", -0.001,0.001);
blkdyn.FixV("x",0,"x", 9.999,11);


dyna.Solve();

blkdyn.SetModel("MC");

blkdyn.SetLocalDamp(0.1);


dyna.Solve(30000);

```
