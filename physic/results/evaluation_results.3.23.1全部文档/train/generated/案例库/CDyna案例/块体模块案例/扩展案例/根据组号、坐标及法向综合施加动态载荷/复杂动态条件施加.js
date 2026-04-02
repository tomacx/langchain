setCurDir(getSrcDir());

// 设置计算参数
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 500");

// 创建颗粒系统
var x = [-3,1];
var y = [0.1,2.4];
var z = [0,1];
pdyna.CreateByCoord(5000, 1, 1, 0.05, 0.1, 0.05, x, y, z);

// 设置颗粒模型和材料参数
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 导入刚性面边界
rdface.Import(2,"boundary.msh");

// 设置计算时步并求解
dyna.Set("Time_Step 1e-4");
dyna.Solve(10000);
