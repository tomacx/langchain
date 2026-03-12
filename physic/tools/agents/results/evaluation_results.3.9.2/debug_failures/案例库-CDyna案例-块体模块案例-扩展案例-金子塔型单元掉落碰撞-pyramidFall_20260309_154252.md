# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-金子塔型单元掉落碰撞-pyramidFall.js

## Query
我想做一个CDyna案例的数值模拟，功能是CDyna案例，功能是块体模块案例-扩展案例-金子塔型单元掉落碰撞-pyramidFall。请根据 CDEM 技术手册，合理选择blkdyn、dyna、rdface等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript

```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-2");

dyna.Set("Renew_Interval 10");

var fCoord=new Array();
fCoord[0]=new Array(-5, -0.1, -5);
fCoord[1]=new Array(6, -0.1, -5);
fCoord[2]=new Array(6, -0.1, 6);
fCoord[3]=new Array(-5, -0.1, 6);
rdface.Create (2, 10, 4, fCoord);


blkdyn.ImportGrid("ansys","3col.dat");

blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();


blkdyn.SetModel("linear");
blkdyn.SetMat(2500,3e9, 0.25, 3e3, 1e3, 10, 10);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIStiffByElem(0.5);
blkdyn.SetIStrengthByElem();

blkdyn.SetLocalDamp(0.01)

dyna.Solve(30000);
```
