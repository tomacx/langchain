# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-刚性面施加地震波-RdFace-Block.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-刚性面施加地震波-RdFace-Block

## Generated Code
```javascript
// 块体模块案例-扩展案例-刚性面施加地震波-RdFace-Block
setCurDir(getSrcDir());

dyna.Set("Time_Step 5e-3");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Output_Interval 200");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Renew_Interval 10");

//dyna.Set("Block_Rdface_Contact_Scheme 3");

//dyna.Set("If_Search_PBContact_Adavance 1");

dyna.Set("Contact_Search_Method 2");

dyna.Set("Virtural_Step 0.1");

dyna.Set("If_Particle_Cal_Rolling 0");

pdyna.RegularCreateByCoord(1, 2, 0.01,-0.5, 3, -0.31,0.0,-0.8, 0.8);

pdyna.SetMat(2000, 5e8, 0.25, 1e4, 3e4, 30, 0.8, 0.0);

pdyna.FixV("xyz", 0.0, "y", -1e5, -0.29);
pdyna.FixV("x", 0.0, "x", -1e5, -0.47);
pdyna.FixV("x", 0.0, "x", 2.97,1e5);
pdyna.FixV("z", 0.0, "z", -1e5, -0.77);
pdyna.FixV("z", 0.0, "z", 0.77,1e5);

pdyna.SetModel("brittleMC");

rdface.Import("gid","wheel.msh"); ///rdfacepartRota.dat

rdface.CrtPart("feng");

rdface.SetPartProp(1.9e+03, [-9.363010e-06,4.997800e-01,1.240097e-01], [1.313625e+01,  1.315585e+01,2.425868e+01,0,0,0], "feng");

rdface.SetPartRotaVel([0,0,0],[1,1,1]);

rdface.SetPartForce([0,-20000,0]);

rdface.SetPartLocalDamp(0.8, 0.8);

dyna.Monitor("rdface","rg_xDis", 1,1,1);
dyna.Monitor("rdface","rg_yDis", 1,1,1);
dyna.Monitor("rdface","rg_zDis", 1,1,1);

dyna.Set("If_Virtural_Mass 0");

dyna.TimeStepCorrect(0.5);

dyna.Solve();

pdyna.SetMat(2000,5e8, 0.25, 1e4, 3e4, 30, 0.0, 0.1);

blkdyn.SetLocalDamp(0.02);
rdface.SetPartRotaVel([0,0,-30],[1,1,1]);
rdface.SetPartLocalDamp(0.02, 0.05);

dyna.Solve(1000000);
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//颗粒接触的更新时步为10
dyna.Set("Renew_Interval 10");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 5e-3");

dyna.Set("If_Renew_Contact 1");

dyna.Set("If_Cal_EE_Contact 1");

imeshing.genBrick3D("g1",5,5,5,5,5,5);

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(2500,5e8, 0.25, 1e4, 1e4, 15, 10);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIStiffByElem(1.0);
blkdyn.SetIStrengthByElem();

blkdyn.SetLocalDamp(0.01);

rdface.Create(2,2,4,[-10,0,-10,  15,0,-10,  15,0,15,  -10,0,15]);

rdface.ApplyDynaVel("nor-7-lef-hori.txt", [3,0,3], [1,0,1], 1, 11);
rdface.ApplyDynaVel("nor-7-lef-ver.txt", [0,3,0], [0,1,0], 1, 11);

//设定动态计算时步
dyna.TimeStepCorrect(0.5);

dyna.Monitor("rdface", "rg_xVel",  1, 11,0);
dyna.Monitor("rdface", "rg_yVel",  1, 11,0);
dyna.Monitor("rdface", "rg_zVel",  1, 11,0);

//动态求解28s
dyna.DynaCycle(28.0);

//打印提示信息
print("Solution Finished");
```
