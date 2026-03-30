setCurDir(getSrcDir());

// ==================== 1. 初始化求解器环境 ====================
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量计算开关（实体材料）
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度为0（冲击实验通常在水平面进行）
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 设置计算时步为5e-6秒（冲击问题需要小步长）
dyna.Set("Time_Step 5e-6");

// 设置不平衡率为1e-3
dyna.Set("UnBalance_Ratio 1e-3");

// 设置结果输出间隔为200步
dyna.Set("Output_Interval 200");

// 设置监测信息输出时步为50步
dyna.Set("Monitor_Iter 50");

// ==================== 2. 定义材料参数 ====================
// 钨球材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角）
var tungstenMat = [19300, 4e11, 0.28, 1e9, 1e9, 0.0, 0.0];

// 铝板材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角）
var aluminumMat = [2700, 7e10, 0.33, 5e6, 5e6, 30.0, 0.0];

// ==================== 3. 创建几何模型 ====================
// 清除几何数据
igeo.clear();
imeshing.clear();

// 创建钨球（半径0.1m的球体）
var sphereRadius = 0.1;
var sphereCenter = [0, 0, 0];
var sphereLoop = igeo.genSphere(sphereRadius, sphereCenter);

// 创建铝板（尺寸：2m x 2m x 0.05m的平板）
var plateLength = 2.0;
var plateWidth = 2.0;
var plateThickness = 0.05;
var plateLoop1 = igeo.genRect(0, 0, 0, plateLength, plateWidth, 0, 1.0);
var plateSurface = igeo.genSurface([plateLoop1], 2);

// ==================== 4. 网格划分 ====================
// 生成钨球网格（MPM颗粒）
pdyna.Import("gid", "sphere.msh");

// 生成铝板网格（块体单元）
imeshing.genMeshByGmsh(3, [plateLength, plateWidth, plateThickness], [0.02, 0.02, 0.01]);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// ==================== 5. 设置材料属性 ====================
// 设置钨球材料参数（组号1-100）
pdyna.SetMat(tungstenMat[0], tungstenMat[1], tungstenMat[2], tungstenMat[3], tungstenMat[4], tungstenMat[5], tungstenMat[6], tungstenMat[7]);

// 设置铝板材料参数（组号101-200）
blkdyn.SetMat(aluminumMat[0], aluminumMat[1], aluminumMat[2], aluminumMat[3], aluminumMat[4], aluminumMat[5], aluminumMat[6], aluminumMat[7]);

// ==================== 6. 配置接触力计算 ====================
// 设置颗粒与块体接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 5e9 5e9 0.0 0.0 0.0");

// 创建接触面
blkdyn.CrtIFace(1);

// 更新网格信息
blkdyn.UpdateIFaceMesh();

// ==================== 7. 施加边界条件与初始速度 ====================
// 固定铝板底部（z=0平面）
blkdyn.FixV("xy", 0.0, "z", -plateThickness/2, plateThickness/2);

// 钨球初始冲击速度（沿Z轴向下，-50m/s）
pdyna.InitCondByGroup("velocity", [0, 0, -50.0], 1, 100);

// ==================== 8. 设置求解参数 ====================
// 设置颗粒计算类型为MPM方法
dyna.Set("Particle_Cal_Type 4");

// 设置块体软化值
dyna.Set("Block_Soften_Value 1e-1 3e-1");

// 设置局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);

// ==================== 9. 调用自定义命令流监测 ====================
// 运行用户自定义命令流，用于特殊物理过程监测
dyna.RunUDFCmd("MonitorImpact 0 0 0");

// ==================== 10. 启动求解器 ====================
// 求解4000步（约0.02秒）
dyna.Solve(4000);

// ==================== 11. 结束脚本 ====================
