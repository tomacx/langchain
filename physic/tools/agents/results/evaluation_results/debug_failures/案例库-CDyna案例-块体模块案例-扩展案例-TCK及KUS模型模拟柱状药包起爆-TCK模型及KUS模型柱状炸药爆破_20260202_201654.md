# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-TCK及KUS模型模拟柱状药包起爆-TCK模型及KUS模型柱状炸药爆破.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-TCK及KUS模型模拟柱状药包起爆-TCK模型及KUS模型柱状炸药爆破

## Generated Code
```javascript
blkdyn.RotateGrid(30.0, origin, normal, 3, 5);
```

## Ground Truth
```javascript
setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");


dyna.Set("UnBalance_Ratio 1e-5");

dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 100");


dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 10");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Virtural_Step 0.6");


dyna.Set("If_Cal_Rayleigh 1")

var msh1=imesh.importGmsh("boreblast.msh");
blkdyn.GetMesh(msh1);

//材料模型为TCK模型
blkdyn.SetModel("TCK", 1);

//材料模型为KUS模型
//blkdyn.SetModel("KUS", 1);

blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);

blkdyn.SetTCKUSMat(1,  2e5, 100.0, 2.3e25, 5.0, 1.0);
blkdyn.BindTCKUSMat(1,1,1);


blkdyn.SetModel("Landau", 2);
blkdyn.SetMat(1150, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 2);
var apos = [10.0, 10.0, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 2, 2);


dyna.Monitor("block", "sxx", 11, 10, 0);
dyna.Monitor("block", "sxx", 13, 10, 0);
dyna.Monitor("block", "sxx", 16, 10, 0);


blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(1e-6, 0.0);

dyna.Set("Time_Step 2e-6");

dyna.DynaCycle(4e-3);


print("Solution Finished");

```
