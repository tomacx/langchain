//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

//设置底部刚性面
var fCoord = [-15.0,-2.0,0.0,15.0,-2.0,0.0];
rdface.Create (1, 1, 2, fCoord);

var fCoord2 = [-15.0,-2.0,0.0,-15.0,8.0,0.0];
var fCoord3 = [15.0,-2.0,0.0,15.0,8.0,0.0];
rdface.Create (1, 1, 2, fCoord2);
rdface.Create (1, 1, 2, fCoord3);

dyna.Set("Auto_Put_Data_To_Host 0");

///设置多边形
var fpoly1 = [0,0,2,1,1,1.5];
var fpoly2 = [3,1,6,2,5,3,4,3];
var fpoly3 = [-1,2,2,3,1,4,0,3,-0.5,2.5];
var fpoly4 = [0,4,3,5,4,6,2,5];
pdyna.CrtPolygonPart(1, fpoly1, 0.1);
pdyna.CrtPolygonPart(2, fpoly2, 0.1);
pdyna.CrtPolygonPart(3, fpoly3, 0.1);

dyna.Set("Auto_Put_Data_To_Host 1");

pdyna.CrtPolygonPart(4, fpoly4, 0.1);

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 1e9, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 2e-4");

dyna.Set("Contact_Detect_Tol 5e-3");


//计算3万步
dyna.Solve(100000);
