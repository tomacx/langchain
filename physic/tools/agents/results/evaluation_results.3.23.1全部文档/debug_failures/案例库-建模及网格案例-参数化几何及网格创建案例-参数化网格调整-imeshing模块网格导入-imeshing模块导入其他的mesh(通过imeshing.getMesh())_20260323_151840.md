# Failure Analysis: 案例库-建模及网格案例-参数化几何及网格创建案例-参数化网格调整-imeshing模块网格导入-imeshing模块导入其他的mesh(通过imeshing.getMesh()).js

## Query
请编写一个CDEM仿真脚本，实现参数化网格调整-imeshing模块网格导入-imeshing模块导入其他的mesh(通过imeshing.getMesh())，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化：清除之前的几何和网格数据
igeo.clear();
imeshing.clear();

// ========== 1. 创建参数化几何模型并生成网格 ==========
// 使用genMeshByGmsh对参数化几何进行网格剖分
var geom = igeo.genRectS(-1, -1, 0, 1, 1, 0, 0.3, 1); // 创建矩形面
imeshing.genMeshByGmsh(2);

// ========== 2. 导入外部网格文件 ==========
var msh1 = imesh.importAnsys("wedge94.dat");
var msh2 = imesh.importGid("particle.msh");
var msh3 = imesh.importGid("hex.msh");

// ========== 3. 使用imeshing.getMesh()导入其他mesh到imeshing模块 ==========
// 将外部网格导入到imeshing模块的网格集合中
imeshing.getMesh(msh1);
sleep(500);
imeshing.getMesh(msh2);
sleep(500);
imeshing.getMesh(msh3);

// ========== 4. 参数化网格调整（网格细化） ==========
var Sel1 = new SelElems(imeshing);

// 对特定区域进行网格细化
var n1 = Sel1.box(-0.8, -0.8, 0, 0.8, 0.8, 0);
imeshing.refine(Sel1);
sleep(500);

var n2 = Sel1.box(-0.6, -0.6, 0, 0.6, 0.6, 0);
imeshing.refine(Sel1);
sleep(500);

var n3 = Sel1.box(-0.4, -0.4, 0, 0.4, 0.4, 0);
imeshing.refine(Sel1);
sleep(500);

// ========== 5. 设置单元分组（可选） ==========
var Sel2 = new SelElems(imeshing);
var n4 = Sel2.box(-0.2, -0.2, 0, 0.2, 0.2, 0);
var group1 = "group_A";
var group2 = "group_B";

// 设置分组
imeshing.setGroup(group1, n4);
sleep(500);

// ========== 6. 将网格加载到各求解器模块 ==========
// 块体模块求解器
blkdyn.GetMesh(imeshing);

// 颗粒核心求解器
pdyna.GetMesh(imeshing);

// 杆件求解器（可选）
bar.GetMesh(msh1, "bolt");

// 刚性面求解器（可选）
rdface.GetMesh(msh2);

// ========== 7. 配置监测点与输出设置 ==========
var monitor = new Monitor();
monitor.addPoint(0, 0, 0, "disp", "ux", "uy", "uz");
monitor.addPoint(0.5, 0.5, 0, "stress", "sx", "sy", "sz");

// 设置输出参数
var output = new Output();
output.setFormat("binary");
output.setInterval(100); // 每100时间步输出一次

// ========== 8. 导出网格与结果文件 ==========
imesh.exportPDyna(imeshing, "pdyna.dat");
imesh.exportCDyna(imeshing, "cdyna.dat");

// ========== 9. 获取监测数据 ==========
var result = monitor.getData();
console.log("监测数据已生成：" + result.size);

// ========== 10. 完成脚本运行 ==========
console.log("仿真脚本执行完成，网格与结果已导出");
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

## Unified Diff
```diff
--- 案例库-建模及网格案例-参数化几何及网格创建案例-参数化网格调整-imeshing模块网格导入-imeshing模块导入其他的mesh(通过imeshing.getMesh()).js (ground_truth)
+++ 案例库-建模及网格案例-参数化几何及网格创建案例-参数化网格调整-imeshing模块网格导入-imeshing模块导入其他的mesh(通过imeshing.getMesh()).js (generated)
@@ -1,21 +1,83 @@
 setCurDir(getSrcDir());
 
-imesh.importGid("2d.msh");
+// 初始化：清除之前的几何和网格数据
+igeo.clear();
+imeshing.clear();
 
-imesh.importGid("gidmesh.msh");
+// ========== 1. 创建参数化几何模型并生成网格 ==========
+// 使用genMeshByGmsh对参数化几何进行网格剖分
+var geom = igeo.genRectS(-1, -1, 0, 1, 1, 0, 0.3, 1); // 创建矩形面
+imeshing.genMeshByGmsh(2);
 
-imesh.importGid("hex.msh");
+// ========== 2. 导入外部网格文件 ==========
+var msh1 = imesh.importAnsys("wedge94.dat");
+var msh2 = imesh.importGid("particle.msh");
+var msh3 = imesh.importGid("hex.msh");
 
-sleep(1000);
+// ========== 3. 使用imeshing.getMesh()导入其他mesh到imeshing模块 ==========
+// 将外部网格导入到imeshing模块的网格集合中
+imeshing.getMesh(msh1);
+sleep(500);
+imeshing.getMesh(msh2);
+sleep(500);
+imeshing.getMesh(msh3);
 
-imeshing.getMesh(cMesh[2]);
+// ========== 4. 参数化网格调整（网格细化） ==========
+var Sel1 = new SelElems(imeshing);
 
-sleep(1000);
+// 对特定区域进行网格细化
+var n1 = Sel1.box(-0.8, -0.8, 0, 0.8, 0.8, 0);
+imeshing.refine(Sel1);
+sleep(500);
 
-imeshing.getMesh(cMesh[3]);
+var n2 = Sel1.box(-0.6, -0.6, 0, 0.6, 0.6, 0);
+imeshing.refine(Sel1);
+sleep(500);
 
-sleep(1000);
+var n3 = Sel1.box(-0.4, -0.4, 0, 0.4, 0.4, 0);
+imeshing.refine(Sel1);
+sleep(500);
 
-imeshing.getMesh(cMesh[4]);
+// ========== 5. 设置单元分组（可选） ==========
+var Sel2 = new SelElems(imeshing);
+var n4 = Sel2.box(-0.2, -0.2, 0, 0.2, 0.2, 0);
+var group1 = "group_A";
+var group2 = "group_B";
 
-sleep(1000);
+// 设置分组
+imeshing.setGroup(group1, n4);
+sleep(500);
+
+// ========== 6. 将网格加载到各求解器模块 ==========
+// 块体模块求解器
+blkdyn.GetMesh(imeshing);
+
+// 颗粒核心求解器
+pdyna.GetMesh(imeshing);
+
+// 杆件求解器（可选）
+bar.GetMesh(msh1, "bolt");
+
+// 刚性面求解器（可选）
+rdface.GetMesh(msh2);
+
+// ========== 7. 配置监测点与输出设置 ==========
+var monitor = new Monitor();
+monitor.addPoint(0, 0, 0, "disp", "ux", "uy", "uz");
+monitor.addPoint(0.5, 0.5, 0, "stress", "sx", "sy", "sz");
+
+// 设置输出参数
+var output = new Output();
+output.setFormat("binary");
+output.setInterval(100); // 每100时间步输出一次
+
+// ========== 8. 导出网格与结果文件 ==========
+imesh.exportPDyna(imeshing, "pdyna.dat");
+imesh.exportCDyna(imeshing, "cdyna.dat");
+
+// ========== 9. 获取监测数据 ==========
+var result = monitor.getData();
+console.log("监测数据已生成：" + result.size);
+
+// ========== 10. 完成脚本运行 ==========
+console.log("仿真脚本执行完成，网格与结果已导出");
```
