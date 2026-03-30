setCurDir(getSrcDir());

// ==================== 1. 初始化仿真模型 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 -9.8 0.0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 100000");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-2");
dyna.Set("If_Find_Contact_OBT 1");

// 包含孔隙渗流计算模块
dyna.Set("Config_PoreSeepage 1");
dyna.Set("PoreSeepage_Cal 0");

// 包含裂隙渗流计算模块
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 0");

// 设置最大裂隙宽度
dyna.Set("FS_MaxWid 5e-5");

// 关闭裂隙渗流与固体耦合开关
dyna.Set("FS_Solid_Interaction 0");

// 采用增量法计算液体压力及饱和度
dyna.Set("FS_Cal_Incremental 0");

// ==================== 2. 导入网格 ====================
var faceID = igeo.genRectS(0, 0, 0, 100, 50, 0, 2, 1);
imeshing.genMeshByGmsh(2);
blkdyn.GetMesh(imeshing);

// ==================== 3. 切割单元面并更新接触网格 ====================
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ==================== 4. 设置材料参数 ====================
blkdyn.SetModel("linear");
blkdyn.SetMatByGroup(2530, 0.25e10, 0.29, 2.17e6, 0.14e6, 35, 10, 1);

// ==================== 5. 设置接触面参数 ====================
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(100.0);

// ==================== 6. 第一阶段水力压裂参数设置 ====================
// IDNo=1, BoundType=1(压力边界), fBoundV1=注入压力(MPa), fBoundV2=压力衰减值(MPa/m)
// fCent=[x,y,z]为注入点坐标, IfCal=1开启计算
var injectPoint1 = new Array(50.0, 25.0, 0.0);
blkdyn.SetSimpleHyFracPram(1, 1, 30.0, 0.5, injectPoint1, true);

// ==================== 7. 配置简单流固耦合开关 ====================
// SimpleFSI=1开启，水位面坐标[0,0,H],水底面坐标[0,0,0]
var waterLevel = new Array(0.0, 0.0, 50.0);
var waterBottom = new Array(0.0, 0.0, 0.0);

// ==================== 8. 第一次水力压裂求解 ====================
fracsp.Solver();

// ==================== 9. 监测与提取数据（第一次） ====================
// 计算节点压力
var nodePressure = fracsp.CalNodePressure();

// 计算动态单元流速与流量（Darcy定律）
var elemDischarge = fracsp.CalElemDischargeByDarcyLaw();

// 计算与固体破裂的耦合
fracsp.CalIntSolid();

// ==================== 10. 更新参数进行第二次水力压裂 ====================
// 更新注入点坐标和压力参数
var injectPoint2 = new Array(50.0, 25.0, 0.0);
blkdyn.SetSimpleHyFracPram(1, 1, 35.0, 0.6, injectPoint2, true);

// ==================== 11. 第二次水力压裂求解 ====================
fracsp.Solver();

// ==================== 12. 监测与提取数据（第二次） ====================
var nodePressure2 = fracsp.CalNodePressure();
var elemDischarge2 = fracsp.CalElemDischargeByDarcyLaw();
fracsp.CalIntSolid();

// ==================== 13. 清除特定区域应力并导出结果 ====================
// 清除注入点周围圆柱区域内的应力（半径3m，高度50m）
var coord1 = new Array(50.0, 25.0, 0.0);
var coord2 = new Array(50.0, 25.0, 50.0);
blkdyn.ClearStressByCylinder(coord1, coord2, 3.0, 50.0);

// 导出裂隙宽度结果
var totalElem = Math.round(dyna.GetValue("Total_FS_ElemNum"));
var fso = new ActiveXObject("Scripting.FileSystemObject");
var filew = fso.CreateTextFile("Aperture_Result.txt", true);

filew.WriteLine("=== 水力压裂+瓦斯抽采-二次压裂结果 ===");
filew.WriteLine("节点压力数据: " + nodePressure2);
filew.WriteLine("单元流量数据: " + elemDischarge2);

for (var i = 1; i <= totalElem; i++) {
    var fcwidth = fracsp.GetElemValue(i, "CWidthIni");
    filew.WriteLine("Element " + i + " Width: " + fcwidth);
}

filew.Close();

print("仿真计算完成，结果已导出至 Aperture_Result.txt");
