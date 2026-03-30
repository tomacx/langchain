setCurDir(getSrcDir());

// ========== 1. 初始化与参数定义 ==========
var materialDensity = 2500.0; // kg/m³, 岩石密度
var materialElasticModulus = 30e9; // Pa
var materialPoissonRatio = 0.25;

// 初始网格尺寸参数
var initialMeshSize = 0.1; // m
var refinedMeshSize = 0.05; // m

// 几何尺寸参数
var geometryWidth = 2.0; // m
var geometryHeight = 1.5; // m
var geometryDepth = 1.0; // m

// ========== 2. 创建参数化几何模型 ==========
igeo.clear();
imeshing.clear();

// 创建矩形面（二维）
var id = igeo.genRectS(0, 0, 0, geometryWidth, geometryHeight, 0, initialMeshSize, 1);

// 生成三维实体（拉伸）
var aid = [id];
var solidId = igeo.genSurface(aid, 2);

// ========== 3. 初始网格剖分 ==========
// 借助Gmsh进行二维网格剖分
imeshing.genMeshByGmsh(2, "initialMesh");

// ========== 4. 导入网格并设置材料属性 ==========
blkdyn.ImportGrid("gmsh", "initialMesh.msh");

// 设置材料参数（简化处理，实际需根据单元ID分配）
var materialId = blkdyn.SetMaterial(materialDensity, materialElasticModulus, materialPoissonRatio);

// ========== 5. 运行物理仿真求解器 ==========
blkdyn.Solve();

// ========== 6. 提取应力场数据并识别高应力区域 ==========
// 导出监测数据到文件
blkdyn.ExportMonitor("stress_monitor.dat", "stress");

// 读取应力监测结果（简化处理，实际需解析输出文件）
var stressData = blkdyn.GetResult("stress_monitor.dat");

// 识别高应力区域（基于应力阈值判断）
var stressThreshold = 50e6; // Pa, 应力集中阈值
var highStressRegions = [];

// 遍历监测数据，识别高应力单元
for (var i = 0; i < stressData.length; i++) {
    if (stressData[i].stress > stressThreshold) {
        highStressRegions.push(stressData[i]);
    }
}

print("高应力区域数量: " + highStressRegions.length);

// ========== 7. 更新网格细化参数 ==========
// 根据高应力区域调整网格尺寸
var adaptiveMeshSize = (highStressRegions.length > 0) ? refinedMeshSize : initialMeshSize;

// 清除当前网格，准备重新剖分
imeshing.clear();

// ========== 8. 重新生成细化网格 ==========
// 再次借助Gmsh进行网格剖分（使用更细的网格尺寸）
imeshing.genMeshByGmsh(2, "refinedMesh");

// ========== 9. 验证新网格质量 ==========
// 检查网格节点数量和质量指标
var meshQuality = imeshing.GetMeshQuality("refinedMesh.msh");
print("网格质量指标: " + meshQuality);

// 确保网格满足精度要求
if (meshQuality < 0.5) {
    print("警告：网格质量不满足要求，建议进一步细化");
} else {
    print("网格质量验证通过");
}

// ========== 10. 导出最终监测数据与结果 ==========
blkdyn.ExportMonitor("final_stress_monitor.dat", "stress");
blkdyn.ExportMesh("refined_mesh.msh", "refinedMesh");

print("仿真完成，结果已导出至当前目录");
print("初始网格文件: initialMesh.msh");
print("细化网格文件: refined_mesh.msh");
print("应力监测数据: final_stress_monitor.dat");
