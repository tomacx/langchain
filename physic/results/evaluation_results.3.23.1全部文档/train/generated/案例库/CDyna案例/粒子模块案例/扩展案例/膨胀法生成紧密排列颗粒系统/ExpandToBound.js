setCurDir(getSrcDir());

// 设置重力、输出间隔和接触检测容差
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 500");
dyna.Set("Contact_Detect_Tol 0.0");

// 定义颗粒生成区域
var xx = [0, 0.5];
var yy = [0, 0.5];
var zz = [0, 0];

// 创建10000个颗粒，直径范围为0.002到0.02米
pdyna.CreateByCoord(10000, 1, 1, 0.002, 0.02, 0, xx, yy, zz);

// 设置颗粒模型和材料参数
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 1e7, 0.25, 0, 0, 0, 0, 0.1);

// 创建刚性面边界
var aCoord = new Array(2);
aCoord[0] = [0, 0, 0];
aCoord[1] = [0.5, 0, 0];
rdface.Create(1, 1, 2, aCoord);

aCoord[0] = [0.5, 0, 0];
aCoord[1] = [0.5, 0.5, 0];
rdface.Create(1, 2, 2, aCoord);

aCoord[0] = [0.5, 0.5, 0];
aCoord[1] = [0, 0.5, 0];
rdface.Create(1, 3, 2, aCoord);

aCoord[0] = [0, 0, 0];
aCoord[1] = [0, 0.5, 0];
rdface.Create(1, 4, 2, aCoord);

// 设置刚性面边界的速度
var vel = 1e-5;
rdface.ApplyVelocityByGroup([0, vel, 0], 1, 1);
rdface.ApplyVelocityByGroup([-vel, 0, 0], 2, 2);
rdface.ApplyVelocityByGroup([0, -vel, 0], 3, 3);
rdface.ApplyVelocityByGroup([vel, 0, 0], 4, 4);

// 设置时间步长并求解
dyna.TimeStepCorrect(0.5);
dyna.Solve(8000);
