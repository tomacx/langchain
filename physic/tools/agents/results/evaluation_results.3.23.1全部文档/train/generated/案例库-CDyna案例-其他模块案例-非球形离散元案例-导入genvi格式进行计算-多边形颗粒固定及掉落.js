setCurDir(getSrcDir());

// 设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度（Z轴向下）
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 导入Genvi格式的颗粒网格文件
pdyna.ImportPartGenvi("block3d.gvx", 1, 10);

// 设置颗粒材料参数
// 密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数
pdyna.SetPartMat(2500, 1e7, 0.25, 0.0, 0.0, 10, 0.01, 0.1, 0.1);

// 设置颗粒接触模型为Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置底部固定边界条件（平动速度）
var afValue = [0.0, 0.0, 0.0];
var abFixFlag = [1, 1, 1];
pdyna.SetPartVel(afValue, abFixFlag, 1, 1);

// 设置底部固定边界条件（转动速度）
var afRotaValue = [0.0, 0.0, 0.0];
var abRotaFixFlag = [1, 1, 1];
pdyna.SetPartRotaVel(afRotaValue, abRotaFixFlag, 1, 1);

// 自动计算时步
dyna.TimeStepCorrect(0.3);

// 求解计算
dyna.Solve(100000);
