setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Time_Step 1.0e-4");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Virtural_Step 0.4");

// ==================== 2. PCMM模块初始化 ====================
dyna.Set("Particle_Cal_Type 2");
dyna.Set("PCMM_Elem_Tol 5e-5");
dyna.Set("Contact_Detect_Tol 1.0e-7");

// ==================== 3. 创建岩石靶体颗粒 ====================
// 岩石靶体：立方体区域，尺寸 2m x 2m x 2m，颗粒间距 0.01m
pdyna.RegularCreateByCoord(1, 1, 0.01, -1.0, 1.0, -1.0, 1.0, 0, 0);

// ==================== 4. 设置岩石材料属性 ====================
// 密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼、组号
pdyna.SetMat(2500, 3e10, 0.25, 5e6, 40e6, 35, 0.005, 0.0, 1);

// ==================== 5. 创建射流源几何模型 ====================
// 射流源：圆柱形，长度 0.5m，半径 0.05m，位于炸药前方
pdyna.RegularCreateByCoord(2, 1, 0.005, -0.25, 0.25, -0.25, 0.25, 0, 0);

// ==================== 6. 设置射流材料属性 ====================
pdyna.SetMat(8000, 1e11, 0.3, 1e9, 1e9, 45, 0.002, 0.0, 2);

// ==================== 7. 初始化射流速度矢量 ====================
var jetVelocity = new Array(100.0, 0.0, 0.0); // 初始喷射速度 100 m/s，沿X方向
pdyna.InitCondByGroup("velocity", jetVelocity, 2, 2);

// ==================== 8. 创建炸药单元 ====================
// 炸药：立方体区域，尺寸 0.3m x 0.3m x 0.3m
pdyna.RegularCreateByCoord(3, 1, 0.01, -0.15, 0.15, -0.15, 0.15, 0, 0);

// ==================== 9. 设置炸药材料参数（朗道模型） ====================
// 黑索金（RDX）参数：密度1820，D=8350m/s，Q=5.4e6 J/kg，Gama1=3.0，Gama2=1.33333，P_CJ=32e9 Pa
pdyna.SetMat(1820, 7e9, 0.25, 3e6, 1e6, 40, 0.0, 0.0, 3);

// ==================== 10. 设置炸药起爆参数 ====================
var firePos = new Array(0.0, 0.0, 0.0); // 点火点位置
var fBeginTime = 0.0; // 起爆时间
var fLastTime = 5e-6; // 加载持续时间

// 设置朗道模型参数（密度、D、Q、Gama1、Gama2、P_CJ）
pdyna.SetLandauMat(1820, 8350, 5.4e6, 3.0, 1.33333, 32e9);

// ==================== 11. 设置炸药起爆 ====================
pdyna.SetFireTime(fBeginTime, fLastTime, firePos);

// ==================== 12. 设置接触对定义 ====================
// 射流与岩石界面接触
pdyna.Contact("jet_rock", 2, 1, "surface"); // 组号：射流(2)-岩石(1)
pdyna.SetContactMat("jet_rock", 1e9, 1e9, 0.3); // 接触刚度、摩擦系数

// ==================== 13. 设置边界条件 ====================
// 固定岩石底部
pdyna.FixVByCoord("xyz", 1, -1.0, 1.0, 0.0, 0.0, 0.0);

// ==================== 14. 设置监测点 ====================
// 监测岩石表面应力、应变及颗粒速度
dyna.Monitor("particle", "pa_xvel", 0.0, 0.0001, 0);
dyna.Monitor("particle", "pa_yvel", 0.0, 0.0001, 0);
dyna.Monitor("particle", "pa_zvel", 0.0, 0.0001, 0);
dyna.Monitor("element", "stress_xx", 0.0, 0.0001, 0);
dyna.Monitor("element", "strain_xx", 0.0, 0.0001, 0);

// ==================== 15. 设置输出文件路径 ====================
// 粒子轨迹及穿透统计信息导出
pdyna.ExportTrajectory(1); // 岩石颗粒轨迹
pdyna.ExportTrajectory(2); // 射流颗粒轨迹
pdyna.ExportTrajectory(3); // 炸药颗粒轨迹

// ==================== 16. 设置求解器终止时间 ====================
var totalTime = 0.05; // 总计算时间 50ms
dyna.Set("Total_Time " + totalTime);

// ==================== 17. 启动计算任务 ====================
dyna.Solve(totalTime / dyna.Get("Time_Step"));

// ==================== 18. 后处理结果读取（模拟） ====================
// 读取破岩效果与能量分布监测数据
var result = doc.GetResult();
if (result) {
    var penetrationCount = result.GetPeneCount(); // 获取穿透颗粒数
    var energyDistribution = result.GetEnergyDist(); // 获取能量分布
    console.log("穿透颗粒数量：" + penetrationCount);
    console.log("能量分布数据：" + JSON.stringify(energyDistribution));
}
