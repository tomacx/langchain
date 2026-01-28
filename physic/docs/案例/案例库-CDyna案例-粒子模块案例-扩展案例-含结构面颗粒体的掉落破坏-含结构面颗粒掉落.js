//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());


//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差，没找到接触之前，容差设置大一点
dyna.Set("Contact_Detect_Tol 5e-3");



//设置底部刚性面
var fCoord = new Array();
fCoord[0]=new Array(-10.0,-2.0,0.0);
fCoord[1]=new Array(10.0,-2.0,0.0);
rdface.Create (1, 1, 2, fCoord);


fCoord[0]=new Array(-10.0,-2.0,0.0);
fCoord[1]=new Array(-10,12.0,0.0);
rdface.Create (1, 1, 2, fCoord);

fCoord[0]=new Array(10.0,-2.0,0.0);
fCoord[1]=new Array(10,12.0,0.0);
rdface.Create (1, 1, 2, fCoord);


//导入gid格式的颗粒
pdyna.Import("gid","ParJoint.msh");

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("SSMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e7, 1e7, 30, 0.0, 0.1);

for(var i = 0; i < 50; i++)
{
pdyna. SetICMatByLine(1e9, 1e9, 0, 0, 0, [-20 + i * 3, -20, 0], [-10 + i * 3, 20, 0]);
pdyna. SetICMatByLine(1e9, 1e9, 0, 0, 0, [-10 + i * 3, -20, 0], [-40 + i * 3, 20, 0]);
}





//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 1e-4");

//设置接触容差为0（找到初始接触后，将后续接触容差设为0）
dyna.Set("Contact_Detect_Tol 0.0");

//计算3万步
dyna.Solve(30000);