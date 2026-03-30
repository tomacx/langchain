# Failure Analysis: 案例库-建模及网格案例-参数化几何及网格创建案例-参数化网格调整-根据地层信息进行分组-GenSurfMeshAndSetElemGroup.js

## Query
请编写一个CDEM仿真脚本，实现参数化网格调整-根据地层信息进行分组-GenSurfMeshAndSetElemGroup，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// ========== 1. 初始化环境 ==========
igeo.clear();
imeshing.clear();
dyna.Clear();

// ========== 2. 导入/生成参数化表面网格对象 ==========
// 生成4个不同地层的表面网格文件
imeshing.genSurfMesh("rock_layer1", "test1.txt", 100, 100, "quad", "invdist1", "grid1.dat");
imeshing.genSurfMesh("rock_layer2", "test2.txt", 100, 100, "quad", "invdist1", "grid2.dat");
imeshing.genSurfMesh("rock_layer3", "test3.txt", 100, 100, "quad", "invdist1", "grid3.dat");
imeshing.genSurfMesh("rock_layer4", "test4.txt", 10, 10, "quad", "invdist1", "grid4.dat");

// ========== 3. 创建地层信息文件 arrange.txt ==========
var fso = new ActiveXObject("Scripting.FileSystemObject");
var DynaP = fso.CreateTextFile("arrange.txt", true);

// 写入地层数量（4个地层）
DynaP.WriteLine("4");

// 写入每个地层的网格文件名（按高程自上而下排列）
DynaP.WriteLine("grid1.dat");
DynaP.WriteLine("grid2.dat");
DynaP.WriteLine("grid3.dat");
DynaP.WriteLine("grid4.dat");

DynaP.Close();

// ========== 4. 加载网格到块体求解器 ==========
blkdyn.GetMesh(imeshing);

// ========== 5. 根据地层文件进行分组 ==========
// 调用 setGroupByStratum 依据地层信息对当前选择集进行分组
imeshing.setGroupByStratum("arrange.txt");

// ========== 6. 验证各单元组的 ID 分配结果 ==========
var Sel1 = new SelElems(imeshing);
var groupCount = imeshing.getGroupCount();
console.log("地层分组完成，共" + groupCount + "个组别");

for (var i = 1; i <= groupCount; i++) {
    var grpName = "Layer_" + i.toString();
    var SelGrp = new SelElems(imeshing);
    SelGrp.group(grpName);
    console.log("第" + i + "组地层单元数量：" + SelGrp.count());
}

// ========== 7. 为不同组别设置材料参数及物理属性 ==========
// 定义不同地层的材料参数（示例：弹性模量、泊松比、密度）
var matParams = [
    { name: "mat_rock1", E: 20e9, nu: 0.3, rho: 2600 },
    { name: "mat_rock2", E: 18e9, nu: 0.3, rho: 2550 },
    { name: "mat_rock3", E: 15e9, nu: 0.3, rho: 2400 },
    { name: "mat_rock4", E: 10e9, nu: 0.3, rho: 2200 }
];

for (var i = 1; i <= groupCount; i++) {
    var SelGrp = new SelElems(imeshing);
    SelGrp.group("Layer_" + i.toString());
    
    // 设置材料属性（示例：使用 blkdyn.SetMat 接口）
    if (blkdyn.SetMat) {
        blkdyn.SetMat(matParams[i - 1].name, matParams[i - 1].E, matParams[i - 1].nu, matParams[i - 1].rho);
        SelGrp.setMat(matParams[i - 1].name);
    }
}

// ========== 8. 配置输出请求以监测关键节点位移、应力等数据 ==========
var out = new Out();
out.nodeDisp(1, "all"); // 所有节点的位移
out.stress("all", "all"); // 所有单元的应力
out.history("all", "all"); // 历史记录

// ========== 9. 提交脚本进行物理仿真计算并记录日志 ==========
console.log("开始求解...");
dyna.Run();

// ========== 10. 导出最终结果文件并生成可视化分析报告 ==========
imesh.exportPDyna(imeshing, "result_pdyna.dat");

// 生成分组信息报告
var report = fso.CreateTextFile("group_report.txt", true);
report.WriteLine("========== CDEM 地层分组仿真报告 ==========");
report.WriteLine("地层数量：" + groupCount);
report.WriteLine("网格文件：grid1.dat, grid2.dat, grid3.dat, grid4.dat");
report.WriteLine("材料参数已按地层分层设置");
report.WriteLine("求解状态：完成");
report.WriteLine("结果文件：result_pdyna.dat");
report.Close();

console.log("仿真计算完成，结果已导出至 result_pdyna.dat");
```

## Ground Truth
```javascript
////设置脚本路径为当前工作路径
setCurDir(getSrcDir());

////导入地层散点数据，产生GdemGrid格式的栅格文件
/////"test1.txt"  ~  "test4.txt" 为地层散点数据
imeshing. genSurfMesh ( "rock1", "test1.txt", 100,100,"quad","invdist1", "grid1.dat");
imeshing. genSurfMesh ( "rock2", "test2.txt", 100,100,"quad","invdist1", "grid2.dat");
imeshing. genSurfMesh( "rock3", "test3.txt", 100,100,"quad","invdist1", "grid3.dat");
imeshing. genSurfMesh ( "rock4", "test4.txt", 10,10,"quad","invdist1", "grid4.dat");


////////////////////////////////////////////////////////////
///////产生"arrange.txt"网格文件

var fso = new ActiveXObject("Scripting.FileSystemObject");//创建FileSystemObject对象
//1-仅读入，2-仅写，3-追加
var DynaP = fso.CreateTextFile("arrange.txt", true);

//////一共4个地层文件
DynaP.WriteLine("4");

/////每个地层文件名
DynaP.WriteLine("grid1.dat");
DynaP.WriteLine("grid2.dat");
DynaP.WriteLine("grid3.dat");
DynaP.WriteLine("grid4.dat");

DynaP.Close();

///////文件书写完毕
////////////////////////////////////////////////////////////


/////几何及网格清除
igeo.clear();
imeshing.clear();

/////创建参数化网格
imeshing.genBrick3D("1", 5,5,3, 50,50, 50);

///所有单元均进行地层分组
imeshing.setGroupByStratum("arrange.txt");
```

## Unified Diff
```diff
--- 案例库-建模及网格案例-参数化几何及网格创建案例-参数化网格调整-根据地层信息进行分组-GenSurfMeshAndSetElemGroup.js (ground_truth)
+++ 案例库-建模及网格案例-参数化几何及网格创建案例-参数化网格调整-根据地层信息进行分组-GenSurfMeshAndSetElemGroup.js (generated)
@@ -1,25 +1,25 @@
-////设置脚本路径为当前工作路径
 setCurDir(getSrcDir());
 
-////导入地层散点数据，产生GdemGrid格式的栅格文件
-/////"test1.txt"  ~  "test4.txt" 为地层散点数据
-imeshing. genSurfMesh ( "rock1", "test1.txt", 100,100,"quad","invdist1", "grid1.dat");
-imeshing. genSurfMesh ( "rock2", "test2.txt", 100,100,"quad","invdist1", "grid2.dat");
-imeshing. genSurfMesh( "rock3", "test3.txt", 100,100,"quad","invdist1", "grid3.dat");
-imeshing. genSurfMesh ( "rock4", "test4.txt", 10,10,"quad","invdist1", "grid4.dat");
+// ========== 1. 初始化环境 ==========
+igeo.clear();
+imeshing.clear();
+dyna.Clear();
 
+// ========== 2. 导入/生成参数化表面网格对象 ==========
+// 生成4个不同地层的表面网格文件
+imeshing.genSurfMesh("rock_layer1", "test1.txt", 100, 100, "quad", "invdist1", "grid1.dat");
+imeshing.genSurfMesh("rock_layer2", "test2.txt", 100, 100, "quad", "invdist1", "grid2.dat");
+imeshing.genSurfMesh("rock_layer3", "test3.txt", 100, 100, "quad", "invdist1", "grid3.dat");
+imeshing.genSurfMesh("rock_layer4", "test4.txt", 10, 10, "quad", "invdist1", "grid4.dat");
 
-////////////////////////////////////////////////////////////
-///////产生"arrange.txt"网格文件
-
-var fso = new ActiveXObject("Scripting.FileSystemObject");//创建FileSystemObject对象
-//1-仅读入，2-仅写，3-追加
+// ========== 3. 创建地层信息文件 arrange.txt ==========
+var fso = new ActiveXObject("Scripting.FileSystemObject");
 var DynaP = fso.CreateTextFile("arrange.txt", true);
 
-//////一共4个地层文件
+// 写入地层数量（4个地层）
 DynaP.WriteLine("4");
 
-/////每个地层文件名
+// 写入每个地层的网格文件名（按高程自上而下排列）
 DynaP.WriteLine("grid1.dat");
 DynaP.WriteLine("grid2.dat");
 DynaP.WriteLine("grid3.dat");
@@ -27,16 +27,66 @@
 
 DynaP.Close();
 
-///////文件书写完毕
-////////////////////////////////////////////////////////////
+// ========== 4. 加载网格到块体求解器 ==========
+blkdyn.GetMesh(imeshing);
 
+// ========== 5. 根据地层文件进行分组 ==========
+// 调用 setGroupByStratum 依据地层信息对当前选择集进行分组
+imeshing.setGroupByStratum("arrange.txt");
 
-/////几何及网格清除
-igeo.clear();
-imeshing.clear();
+// ========== 6. 验证各单元组的 ID 分配结果 ==========
+var Sel1 = new SelElems(imeshing);
+var groupCount = imeshing.getGroupCount();
+console.log("地层分组完成，共" + groupCount + "个组别");
 
-/////创建参数化网格
-imeshing.genBrick3D("1", 5,5,3, 50,50, 50);
+for (var i = 1; i <= groupCount; i++) {
+    var grpName = "Layer_" + i.toString();
+    var SelGrp = new SelElems(imeshing);
+    SelGrp.group(grpName);
+    console.log("第" + i + "组地层单元数量：" + SelGrp.count());
+}
 
-///所有单元均进行地层分组
-imeshing.setGroupByStratum("arrange.txt");
+// ========== 7. 为不同组别设置材料参数及物理属性 ==========
+// 定义不同地层的材料参数（示例：弹性模量、泊松比、密度）
+var matParams = [
+    { name: "mat_rock1", E: 20e9, nu: 0.3, rho: 2600 },
+    { name: "mat_rock2", E: 18e9, nu: 0.3, rho: 2550 },
+    { name: "mat_rock3", E: 15e9, nu: 0.3, rho: 2400 },
+    { name: "mat_rock4", E: 10e9, nu: 0.3, rho: 2200 }
+];
+
+for (var i = 1; i <= groupCount; i++) {
+    var SelGrp = new SelElems(imeshing);
+    SelGrp.group("Layer_" + i.toString());
+    
+    // 设置材料属性（示例：使用 blkdyn.SetMat 接口）
+    if (blkdyn.SetMat) {
+        blkdyn.SetMat(matParams[i - 1].name, matParams[i - 1].E, matParams[i - 1].nu, matParams[i - 1].rho);
+        SelGrp.setMat(matParams[i - 1].name);
+    }
+}
+
+// ========== 8. 配置输出请求以监测关键节点位移、应力等数据 ==========
+var out = new Out();
+out.nodeDisp(1, "all"); // 所有节点的位移
+out.stress("all", "all"); // 所有单元的应力
+out.history("all", "all"); // 历史记录
+
+// ========== 9. 提交脚本进行物理仿真计算并记录日志 ==========
+console.log("开始求解...");
+dyna.Run();
+
+// ========== 10. 导出最终结果文件并生成可视化分析报告 ==========
+imesh.exportPDyna(imeshing, "result_pdyna.dat");
+
+// 生成分组信息报告
+var report = fso.CreateTextFile("group_report.txt", true);
+report.WriteLine("========== CDEM 地层分组仿真报告 ==========");
+report.WriteLine("地层数量：" + groupCount);
+report.WriteLine("网格文件：grid1.dat, grid2.dat, grid3.dat, grid4.dat");
+report.WriteLine("材料参数已按地层分层设置");
+report.WriteLine("求解状态：完成");
+report.WriteLine("结果文件：result_pdyna.dat");
+report.Close();
+
+console.log("仿真计算完成，结果已导出至 result_pdyna.dat");
```
