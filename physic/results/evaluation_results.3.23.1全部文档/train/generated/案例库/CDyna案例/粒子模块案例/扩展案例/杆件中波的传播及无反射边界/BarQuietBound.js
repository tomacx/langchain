// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除Mesh模块几何数据和网格数据
igeo.clear();
imeshing.clear();

// 清除BlockDyna模型数据及Genvi平台数据
dyna.Clear();
doc.clearResult();

// 打开力学计算开关，设置重力加速度为0，并打开大变形计算开关
dyna.Set("Mechanic_Cal", 1);
dyna.Set("Gravity", 0.0, 0.0, 0.0);
dyna.Set("Large_Displace", 1);

// 设置输出间隔和监测信息输出时步，关闭虚质量计算开关
dyna.Set("Output_Interval", 500);
dyna.Set("Monitor_Iter", 10);
dyna.Set("If_Virtural_Mass", 0);

// 打开接触更新开关并设置接触容差为0.0
dyna.Set("If_Renew_Contact", 1);
dyna.Set("Contact_Detect_Tol", 0.0);

// 创建一个长方体模型，尺寸为20m x 5m x 1m，网格划分参数为20, 5, 1
blkdyn.GenBrick3D(20.0, 5.0, 1.0, 20, 5, 1);

// 设置所有单元的本构模型为线弹性模型，并设置材料参数（密度，弹性模量，泊松比等）
blkdyn.SetModel("linear");
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 对长方体的两侧面施加固定约束
blkdyn.FixV("x", -0.01, "x", 0.01);
blkdyn.FixV("y", -0.01, "y", 0.01);

// 在长方体的一端施加动态正弦力，模拟冲击载荷
var coeff = [1, 0, 0];
var xRange = [19.99, 20.01];
var yRange = [-5.0, 5.0];
var zRange = [-1.0, 1.0];
blkdyn.ApplyDynaSinVarByCoord("face_force", false, coeff, 0.0, 1e6, 0.0, xRange, yRange, zRange);

// 开始求解
dyna.Solve(5000);
