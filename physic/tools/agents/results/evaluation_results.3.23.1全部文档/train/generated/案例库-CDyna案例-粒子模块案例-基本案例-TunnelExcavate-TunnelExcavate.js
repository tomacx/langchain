setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 设置求解器基本参数
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Output_Interval 500");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("Time_Step 1e-3");
dyna.Set("Contact_Detect_Tol 8e-2");

// 创建椭圆形隧道几何模型
// 参数: 模型高度, 模型宽度, 椭圆竖向半轴, 椭圆水平半轴, 底部距离, 网格尺寸, 衬砌标志, 衬砌厚度
igeo.genEllipseTunnelS(30.0, 40.0, 3.0, 4.0, 10.0, 1.0, 0.2, 1, 0.3);

// 导入网格（如果已生成）或获取当前网格
var msh = imesh.importGid("General", "tunnel.msh");
blkdyn.GetMesh(msh);

// 设置模型为线弹性
blkdyn.SetModel("linear");

// 设置围岩材料参数 (组号1) - 密度, 弹性模量, 泊松比, 抗拉强度, 抗压强度, 内摩擦角, 粘聚力
blkdyn.SetMatByGroup(2500, 3e8, 0.25, 1e5, 5e5, 35, 0.8, 1);

// 设置衬砌材料参数 (组号3) - 混凝土材料
blkdyn.SetMatByGroup(2400, 3e10, 0.2, 1e6, 3e6, 40, 15, 3);

// 固定模型底部边界条件
blkdyn.FixV("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.8);

// 设置监测点记录围岩位移和应力
dyna.Monitor("block", "xdis", 5.0, 10.0, 0);
dyna.Monitor("block", "ydis", 5.0, 10.0, 0);
dyna.Monitor("block", "sxx", 5.0, 10.0, 0);
dyna.Monitor("block", "syy", 5.0, 10.0, 0);

// 计算瑞利阻尼
blkdyn.CalRayleighDamp();

// 第一次求解至稳定（初始平衡）
dyna.Solve();

// 设置脆性模型进行开挖模拟
blkdyn.SetModel("brittleMC");

// 定义开挖区域 - 移除隧道内部单元模拟掘进
blkdyn.SetModelByCoord("none", 46, 54, 30, 40, -1, 1);

// 第二次求解至稳定（开挖后）
dyna.Solve();

// 单独设置阻尼参数
blkdyn.SetSingleMat("LocalDamp", 0.8);
blkdyn.SetSingleMat("ViscDamp", 0.05);

// 导出地形网格文件供其他求解器使用
rdface.ExportTerrainData(0.0, 100.0, 0.0, 100.0, 200, 200, "CdemGrid.dat");

// 输出监测数据到结果文件夹
dyna.OutputMonitorData();

// 输出模型结果
dyna.OutputModelResult();

// 打印仿真完成信息
print("Tunnel excavation simulation completed successfully.");
