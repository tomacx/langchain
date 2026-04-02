setCurDir(getSrcDir());

// 导入网格文件
rdface.Import("gid", "GidGrp.msh");

// 自动创建Part
var nTotal = rdface.CrtPartAuto("geo");
print(nTotal);

// 设置刚体动力学参数
dyna.Set("Time_Step 1e-3");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 100");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Gravity  0 0 -9.8");

// 创建颗粒离散元
pdyna.CreateByCoord(4000, 1,2, 0.2, 0.3,0.5, [0.5, 9.5],[ 0.5,9.5], [0.5, 4]);
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 5e7, 0.3, 0,0,10, 0, 0.01);

// 设置刚体属性
rdface.SetPartProp(8.910425e+04, [5.000302e+00,5.000109e+00,6.297744e+00], [2.117849e+05, 2.118690e+05,2.956193e+05, -1.237543e+01,-2.083668e+00,-1.517674e+01], "feng");

// 设置局部阻尼
rdface.SetPartLocalDamp(0.01, 0.01);

// 添加监测点
dyna.Monitor("rdface","rg_PartVelZ", 1,0,0);
dyna.Monitor("rdface","rg_PartDisZ", 1,0,0);

// 时间步长校正和求解
dyna.TimeStepCorrect(1.0);
dyna.Solve(100000);
