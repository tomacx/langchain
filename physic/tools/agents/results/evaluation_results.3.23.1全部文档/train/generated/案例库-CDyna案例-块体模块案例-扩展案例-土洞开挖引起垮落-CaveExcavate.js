setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Output_Interval 1000");
dyna.Set("Monitor_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("Contact_Detect_Tol 1e-5");
dyna.Set("Contact_Search_Method 2");

// ==================== 2. 创建几何模型 ====================
var loopid1 = igeo.genRect(0, 0, 0, 60, 40, 0, 1.0);
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 创建外边界面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);

// 创建土洞区域（开挖巷道）
var caveLoop = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);
igeo.genSurface([caveLoop], 2);

// ==================== 3. 生成网格 ====================
imeshing.genMeshByGmsh(2);

// BlockDyna获取网格
blkdyn.GetMesh(imeshing);

// ==================== 4. 创建虚拟界面 ====================
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ==================== 5. 设置材料属性 ====================
// 围岩材料参数：密度(kg/m³),弹性模量(Pa),泊松比,抗压强度(Pa),抗拉强度(Pa),内摩擦角(度),粘聚力(Pa)
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// ==================== 6. 设置接触面属性 ====================
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// ==================== 7. 设置边界约束 ====================
// 底部法向约束（固定Y方向）
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 左侧法向约束（固定X方向）
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);

// 右侧法向约束（固定X方向）
blkdyn.FixV("x", 0.0, "x", 65.999, 66.7);

// ==================== 8. 设置局部阻尼 ====================
blkdyn.SetLocalDamp(0.8);

// ==================== 9. 设置监测点 ====================
// 顶部竖直位移监测
for (var i = 0; i < 15; i++) {
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block", "ydis", fvalue, 39, 0);
}

// 顶部水平位移监测
for (var i = 0; i < 15; i++) {
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block", "xdis", fvalue, 39, 0);
}

// ==================== 10. 导出地形数据 ====================
// 导出Grid格式的地形文件，供其他求解器使用
rdface.ExportTerrainData(0.0, 60.0, 0.0, 40.0, 200, 200, "CaveExcavate_Grid.dat");

// ==================== 11. 启动求解 ====================
dyna.Solve();

// ==================== 12. 保存结果 ====================
dyna.Save("CaveExcavate_Result.sav");
