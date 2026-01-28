//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

pdyna.ImportPartGenvi("block3d.gvx", 1,10);

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2000, 1e7, 0.25, 0.0, 0.0,  10, 0.01, 0.1, 0.1);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

var afValue = [0,0,0];
var abFixFlag = [1,1,1];
pdyna.SetPartVel(afValue, abFixFlag, 1,1);


var afValue = [0,0,0];
var abFixFlag = [1,1,1];
pdyna.SetPartRotaVel(afValue, abFixFlag, 1,1);

//自动计算时步
dyna.TimeStepCorrect(0.3);

//计算3万步
dyna.Solve(100000);
