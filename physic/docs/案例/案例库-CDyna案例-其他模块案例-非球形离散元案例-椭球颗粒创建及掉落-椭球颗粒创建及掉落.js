//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

//设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

dyna.Set("GiD_Out 1");

//dyna.Set("Bounding_Box 1 1.0");

//设置底部刚性面
rdface.Import("gid", "20m-20m-bound.msh");

dyna.Set("Auto_Put_Data_To_Host 0");
//导入gid格式的颗粒
var afCenter = [-5,-5,5];
var afNormal = [0,0,1];
pdyna.CrtEllipsoidPart(1, afCenter,3, 3, 1, afNormal, 30);

var afCenter = [-5,5,5];
var afNormal = [1,0,0];
pdyna.CrtEllipsoidPart(1, afCenter,3, 3, 1, afNormal, 30);

var afCenter = [5,5,5];
var afNormal = [1,0,0];
pdyna.CrtEllipsoidPart(1, afCenter,3, 1, 2, afNormal, 30);

var afCenter = [5,-5,5];
var afNormal = [0,1,0];
pdyna.CrtEllipsoidPart(1, afCenter,1, 3, 3, afNormal, 30);

var afCenter = [0,0,5];
var afNormal = [0,0,1];
pdyna.CrtEllipsoidPart(1, afCenter,1, 1, 0.2, afNormal, 30);

dyna.Set("Auto_Put_Data_To_Host 1");

var afCenter = [0,0,10];
var afNormal = [1,0,0];
pdyna.CrtEllipsoidPart(1, afCenter,3, 3, 1, afNormal, 30);




//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 1e9, 0.25, 0, 0, 30, 0.01, 0.1, 0.1);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");


//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 2e-4");

dyna.Set("Contact_Detect_Tol 5e-3");

//计算3万步
dyna.Solve(100000);
