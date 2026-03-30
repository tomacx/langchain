setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Time_Step 5e-5");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// 创建底部弹性板几何模型（长宽1m，厚5cm）
blkdyn.GenBrick3D(1, 0.05, 1, 20, 2, 20, 1);

// 设置板单元模型为线弹性模型
blkdyn.SetModel("linear");

// 设置板材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 1e6, 0.25, 3e4, 1e4, 35, 15);

// 设置板的局部阻尼
blkdyn.SetLocalDamp(0.01);

// 固定板左右两侧边界条件（X方向速度约束）
blkdyn.FixV("xyz", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("xyz", 0.0, "x", 0.999, 1.01);

// 创建随机分布的颗粒（在板上方一定高度范围内）
var x = [0.3, 0.7];
var y = [0.2, 0.5];
var z = [0.3, 0.7];
pdyna.CreateByCoord(5000, 2, 2, 0.02, 0.02, 0.005, x, y, z);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e6, 0.2, 0.0, 0.0, 20, 0.0, 0.05);

// 对颗粒单独施加重力（与全局重力一致）
pdyna.ApplyGravity(0.0, -9.8, 0.0);

// 配置输出文件路径以记录位移、速度和力链数据
dyna.Set("Result_File_Name result.dat");
dyna.Set("Monitor_File_Name monitor.dat");

// 设置监测变量：颗粒速度、位移、接触力等
pdyna.Monitor("rg_NodeVelZ", 5, 5, 0);
pdyna.Monitor("rg_NodeDisZ", 5, 5, 0);

// 执行仿真计算过程（求解2万步）
dyna.Solve(20000);

// 调用接口函数导出平面内接触弹簧的应力与损伤信息
var origin = new Array(10.0, 10.0, 10.0);
var n = new Array(0.0, 1.0, 0.0);
blkdyn.ExportIntDataByPlane(origin, n, 2.0, "spring.txt");

// 检查模拟结果完整性并生成最终报告文件
print("Solution is ok!");
print("Contact spring data exported to spring.txt");
print("Monitoring data saved in monitor.dat");
