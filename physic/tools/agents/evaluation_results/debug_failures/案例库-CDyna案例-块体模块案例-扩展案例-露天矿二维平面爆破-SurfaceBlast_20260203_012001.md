# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-露天矿二维平面爆破-SurfaceBlast.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-露天矿二维平面爆破-SurfaceBlast

## Generated Code
```javascript
// 生成 SurfaceBlast 脚本
var scdem = new SuperCDEM();

// 动态边界
var oSel = new SelNodes(scdem);
oSel.box(-1e10,-0.001,-1e10, 1e10,0.001,1e10);
scdem.setVel(oSel, "y", 0);

// 动态边界
var oSel = new SelElemFaces(scdem);
oSel.cylinder(0.15,0.15,0,0.15,0.15,0.005,0.0029,0.0031);
scdem.applyDynaBoundaryFromFileBySel("faceforce",true,-1,0,0,oSel,"BlastLoad.txt");

// 时间步长
scdem.timeStep = 2e-9;

// 动力学求解
scdem.dynaSolveGpu(1.5e-4);

// 释放GPU端内存
scdem.releaseGpuMem();
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 100");

//设置监测信息输出时步为10步
dyna.Set("Monitor_Iter 10");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 1");

//打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 0")

//从当前文件夹导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "surface.msh");

//对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace(1, 1);

//不同组间离散
blkdyn.CrtIFace(-1, -1);

//设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

//指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear", 1);

//指定组2的单元本构为JWL爆源模型本构
blkdyn.SetModel("Landau", 2, 100);

//指定组1-2的材料参数
blkdyn.SetMatByGroupRange(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0, 1, 100);

//将接触面模型设定为断裂能模型
blkdyn.SetIModel("FracE");

//指定所有接触面的基础材料参数
blkdyn.SetIMat(1e13, 1e13, 40.0, 15e6, 10e6);

//指定组1与组2交界面的材料参数，摩擦角、粘聚力及抗拉强度均为0.0
blkdyn.SetIMatByGroupInterface(1e13, 1e13, 0.0, 0.0, 0.0, -1, -1);

//指定组1与组2交界面上的断裂能，均为0
blkdyn.SetIFracEnergyByGroupInterface(0.0, 0.0, -1, -1);

//指定组1内部交界面的断裂能，拉伸断裂能100Pa.m，剪切断裂能1000Pa.m
blkdyn.SetIFracEnergyByGroupInterface(100, 1000, 1, 1);

//设置全局的JWL炸药参数，为TNT，材料序号1
var apos = [5.0, 5.0, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);

var apos = [10.0, 5.0, 0.0];
blkdyn.SetLandauSource(2, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 25e-3, 15e-3);

var apos = [15.0, 5.0, 0.0];
blkdyn.SetLandauSource(3, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 50e-3, 15e-3);


blkdyn.BindLandauSource(1, 2, 2);
blkdyn.BindLandauSource(2, 3, 3);
blkdyn.BindLandauSource(3, 4, 4);



dyna.Monitor("gvalue","gv_spring_broken_ratio");
dyna.Monitor("gvalue","gv_spring_crack_ratio");

//将局部阻尼设置为0.0
blkdyn.SetLocalDamp(0.05);

//将刚度阻尼系数设置为5e-7，质量阻尼系数设置为0.0
//blkdyn.SetRayleighDamp(5e-7, 0.0);

//设置全局计算时步
dyna.Set("Time_Step 2e-6");

//模型的外边界设定为无反射边界（粘性边界）
blkdyn.SetQuietBoundByCoord(19.999, 31,-100,100,-100,100);
blkdyn.SetQuietBoundByCoord(-100,100,-0.001,0.001,-100,100);


//动力计算1ms
dyna.DynaCycle(1);

//打印提示信息
print("Solution Finished");

```
