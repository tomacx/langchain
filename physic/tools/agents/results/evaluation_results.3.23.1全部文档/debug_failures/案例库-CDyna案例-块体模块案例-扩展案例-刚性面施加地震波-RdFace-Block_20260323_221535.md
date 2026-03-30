# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-刚性面施加地震波-RdFace-Block.js

## Query
请编写一个CDyna仿真脚本，实现刚性面施加地震波-RdFace-Block，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 1. 设置当前脚本所在路径及结果输出间隔步数参数
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");

// 2. 关闭虚拟质量开关并开启大变形计算选项
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Large_Displace 1");
dyna.Set("Mechanic_Cal 1");

// 3. 定义刚性面单元组号并调用 rdface.SetDeformMat 设置材料属性
rdface.SetDeformMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);

// 4. 设置全局坐标系下的重力加速度分量值（m/s^2）
rdface.SetGravity(0.0, -9.8, 0.0);

// 5. 使用 blkdyn.ApplyDynaVarFromFileByGCD 施加地震波动态面力载荷
// 参数：施加类型"face_force", 是否局部坐标false, 面力分量[1e6, 0, 0], 文件路径, 单元组号范围, 坐标范围
blkdyn.ApplyDynaVarFromFileByGCD("face_force", false, [1e6, 0, 0], "earthquake.txt", [1, 3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);

// 6. 调用 blkdyn.SetQuietBoundByCoord 在边界处施加无反射条件
blkdyn.SetQuietBoundByCoord(-10, 10, -10, 10, -10, 10);

// 7. 配置刚性面单元的位移与应力监测输出变量
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("rdface", "disp", 1, 0.0 + i, 0);
}
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("rdface", "sxx", 1, 0.0 + i, 0);
}

// 8. 调用 dyna.RunUDFCmd 运行用户自定义命令流启动仿真
dyna.RunUDFCmd("StartSimulation");

// 9. 获取刚柔性面单元信息并验证载荷施加状态
rdface.GetElemValue();

// 10. 调用 dyna.FreeUDF 卸载已加载的动态链接库资源
dyna.FreeUDF();
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

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-扩展案例-刚性面施加地震波-RdFace-Block.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-扩展案例-刚性面施加地震波-RdFace-Block.js (generated)
@@ -1,67 +1,40 @@
-//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
-//清除GDEM-Pdyna计算核心中的内存数据
-dyna.Clear();
+// 1. 设置当前脚本所在路径及结果输出间隔步数参数
+dyna.Set("Output_Interval 500");
+dyna.Set("Moniter_Iter 100");
 
-//清除GDEM-Env中的结果数据
-doc.clearResult();
+// 2. 关闭虚拟质量开关并开启大变形计算选项
+dyna.Set("If_Virtural_Mass 0");
+dyna.Set("Large_Displace 1");
+dyna.Set("Mechanic_Cal 1");
 
-//设置结果的输出间隔为500步
-dyna.Set("Output_Interval 500");
+// 3. 定义刚性面单元组号并调用 rdface.SetDeformMat 设置材料属性
+rdface.SetDeformMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);
 
-//关闭虚拟质量开关
-dyna.Set("If_Virtural_Mass 0");
+// 4. 设置全局坐标系下的重力加速度分量值（m/s^2）
+rdface.SetGravity(0.0, -9.8, 0.0);
 
-//设置重力加速度
-dyna.Set("Gravity 0.0 -9.8 0.0");
+// 5. 使用 blkdyn.ApplyDynaVarFromFileByGCD 施加地震波动态面力载荷
+// 参数：施加类型"face_force", 是否局部坐标false, 面力分量[1e6, 0, 0], 文件路径, 单元组号范围, 坐标范围
+blkdyn.ApplyDynaVarFromFileByGCD("face_force", false, [1e6, 0, 0], "earthquake.txt", [1, 3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);
 
-//打开大变形计算开关
-dyna.Set("Large_Displace 1");
+// 6. 调用 blkdyn.SetQuietBoundByCoord 在边界处施加无反射条件
+blkdyn.SetQuietBoundByCoord(-10, 10, -10, 10, -10, 10);
 
-//颗粒接触的更新时步为10
-dyna.Set("Renew_Interval 10");
+// 7. 配置刚性面单元的位移与应力监测输出变量
+for (var i = 0; i <= 5; i++) {
+    dyna.Monitor("rdface", "disp", 1, 0.0 + i, 0);
+}
+for (var i = 0; i <= 5; i++) {
+    dyna.Monitor("rdface", "sxx", 1, 0.0 + i, 0);
+}
 
-//设置接触容差为0
-dyna.Set("Contact_Detect_Tol 5e-3");
+// 8. 调用 dyna.RunUDFCmd 运行用户自定义命令流启动仿真
+dyna.RunUDFCmd("StartSimulation");
 
-dyna.Set("If_Renew_Contact 1");
+// 9. 获取刚柔性面单元信息并验证载荷施加状态
+rdface.GetElemValue();
 
-dyna.Set("If_Cal_EE_Contact 1");
-
-imeshing.genBrick3D("g1",5,5,5,5,5,5);
-
-blkdyn.GetMesh(imeshing);
-
-blkdyn.CrtIFace();
-
-blkdyn.UpdateIFaceMesh();
-
-blkdyn.SetModel("linear");
-
-blkdyn.SetMat(2500,5e8, 0.25, 1e4, 1e4, 15, 10);
-
-blkdyn.SetIModel("brittleMC");
-
-blkdyn.SetIStiffByElem(1.0);
-blkdyn.SetIStrengthByElem();
-
-blkdyn.SetLocalDamp(0.01);
-
-rdface.Create(2,2,4,[-10,0,-10,  15,0,-10,  15,0,15,  -10,0,15]);
-
-rdface.ApplyDynaVel("nor-7-lef-hori.txt", [3,0,3], [1,0,1], 1, 11);
-rdface.ApplyDynaVel("nor-7-lef-ver.txt", [0,3,0], [0,1,0], 1, 11);
-
-//设定动态计算时步
-dyna.TimeStepCorrect(0.5);
-
-dyna.Monitor("rdface", "rg_xVel",  1, 11,0);
-dyna.Monitor("rdface", "rg_yVel",  1, 11,0);
-dyna.Monitor("rdface", "rg_zVel",  1, 11,0);
-
-//动态求解28s
-dyna.DynaCycle(28.0);
-
-//打印提示信息
-print("Solution Finished");
+// 10. 调用 dyna.FreeUDF 卸载已加载的动态链接库资源
+dyna.FreeUDF();
```
