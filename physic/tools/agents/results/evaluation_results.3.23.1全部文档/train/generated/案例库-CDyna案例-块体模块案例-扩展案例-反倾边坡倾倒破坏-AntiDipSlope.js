setCurDir(getSrcDir());

// 初始化CDyna仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 2e-3");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 5e-3");
dyna.Set("If_Renew_Contact 1");

// 导入反倾边坡几何模型数据
blkdyn.ImportGrid("ansys", "AntiDipRockSlope.dat");

// 创建并更新接触面网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置块体模型为线性弹性模型
blkdyn.SetModel("linear");

// 设置块体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
blkdyn.SetMat(2500, 2e10, 0.25, 3e6, 1e6, 35.0, 10.0, 0);

// 设置节理面模型为线性弹性
blkdyn.SetIModel("linear");

// 设置节理面材料参数
blkdyn.SetIMat(1e10, 1e10, 35.0, 1e6, 1e6);

// 设置节理面2的材料参数（软弱结构面）
blkdyn.SetIMat(1e10, 1e10, 20.0, 6e4, 1e4, -1, -1);

// 固定边界条件：X方向约束
blkdyn.FixVByCoord("x", 0.0, -1e10, 0.01, -1e10, 1e10, -1e10, 1e10);
blkdyn.FixVByCoord("x", 0.0, 119.99, 121, -1e10, 1e10, -1e10, 1e10);

// 固定边界条件：Y方向约束
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e10, 0.01, -1e10, 1e10);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.8);

// 定义位移监测关键点坐标（包含三个分量值）
var coord = new Array(30.0, 30.0, 0.0);
var coord2 = new Array(50.0, 70.0, 0.0);

// 设置位移监测点
dyna.Monitor("block", "xdis", 30, 30, 0);
dyna.Monitor("block", "xdis", 50, 70, 0);

// 设置位移上限阈值（单位：米）作为不稳定性判据
var displimit = 1e-2; // 1cm位移阈值

// 指定保存文件名称用于二分法初始阶段调入数据
var save_filename = "AntiDipSlope.sav";

// 调用dyna.SolveFosByCriDisp接口进行安全系数求解
// TotalStepForLoop: 迭代步数（建议6000步）
// displimit: 位移上限值（单位：m）
// coord: 监测点坐标数组
// save_filename: sav文件名
var fos = dyna.SolveFosByCriDisp(6000, displimit, coord, save_filename);

// 输出最终计算得到的安全系数数值结果
print("反倾边坡安全系数求解完成，结果为：" + fos);

// 保存仿真过程中的监测数据及结果文件供后续分析使用
dyna.Set("Output_Interval 500");
dyna.Solve();

print("Solution Finished");
