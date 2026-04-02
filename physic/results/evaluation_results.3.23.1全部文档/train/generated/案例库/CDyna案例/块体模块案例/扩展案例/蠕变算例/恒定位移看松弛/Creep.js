setCurDir(getSrcDir());

// 初始化参数设置
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 500");
dyna.Set("Contact_Detect_Tol 0.0");

// 创建颗粒
var xx = [0,1];
var yy = [0,1];
var zz = [0,0];
pdyna.CreateByCoord(10000, 1, 1, 0.002, 0.02, 0,xx,yy,zz);

// 设置模型和材料属性
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 1e7, 0.25, 0,0,0,0,0.1);

// 创建刚性面并设置速度
var aCoord = new Array(2);
aCoord[0] = [0,0,0];
aCoord[1] = [1,0,0];
rdface.Create(1,1,2,aCoord);

aCoord[0] = [1,0,0];
aCoord[1] = [1,1,0];
rdface.Create(1,2,2,aCoord);

aCoord[0] = [1,1,0];
aCoord[1] = [0,1,0];
rdface.Create(1,3,2,aCoord);

aCoord[0] = [0,1,0];
aCoord[1] = [0,0,0];
rdface.Create(1,4,2,aCoord);

var vel = 1e-5;
rdface.ApplyVelocityByGroup ([0,vel,0], 1, 1);
rdface.ApplyVelocityByGroup ([-vel,0,0],2,2);
rdface.ApplyVelocityByGroup ([0,-vel,0],3,3);
rdface.ApplyVelocityByGroup ([vel,0,0],4,4);

// 时间步长校正
dyna.TimeStepCorrect(0.5);

// 求解
dyna.Solve(8000);
