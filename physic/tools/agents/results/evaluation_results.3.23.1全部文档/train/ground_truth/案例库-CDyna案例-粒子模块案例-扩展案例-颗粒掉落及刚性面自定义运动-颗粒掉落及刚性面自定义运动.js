//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除Genvi平台中的结果数据
doc. clearResult ();

dyna.Set("Particle_Renew_Interval 1")

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置3个方向的全局重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");



//创建第一组随机颗粒
var x = [-1.4, 1.4];
var y = [0, 1.8];
var z = [-1,1];
pdyna.CreateByCoord(5000,1,1, 0.05, 0.05, 0.0, x, y, z);


//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.0, 0.2);


//创建刚性面
var acoord = new Array();
acoord[0] = [-1.5, -0.5, 0]
acoord[1] = [1.5, -0.5, 0]
rdface.Create (1, 1, 2, acoord);

var acoord = new Array();
acoord[0] = [-1.5, 2, 0]
acoord[1] = [1.5, 2, 0]
rdface.Create (1, 1, 2, acoord);


var acoord = new Array();
acoord[0] = [-1.5, -0.5, 0]
acoord[1] = [-1.5, 2, 0]
rdface.Create (1, 1, 2, acoord);

var acoord = new Array();
acoord[0] = [1.5, -0.5, 0]
acoord[1] = [1.5, 2, 0]
rdface.Create (1, 1, 2, acoord);

dyna.TimeStepCorrect(0.8);

dyna.Solve(10000);



////////第二阶段，进行刚性面自定义移动

dyna.Set("Time_Now 0");

var nTotalRdFace = Math.round(  dyna.GetValue("Total_RigidFace_Num")   );

dyna.BeforeCal();
for(var istep = 0; istep < 100000; istep++)
{

var fTimeNow = dyna.GetValue("Time_Now");

var fXVel = 5.0 * Math.sin(2 * Math.PI * fTimeNow);
var fYVel = 3.0 * Math.sin(2 * Math.PI * fTimeNow);

for(var iface = 1; iface <= nTotalRdFace; iface++ )
{
rdface.SetElemValue(iface, "Velocity", fXVel, 1);
rdface.SetElemValue(iface, "Velocity", fYVel, 2);
}

dyna.Solver();

if(istep % 100 == 0)
{
print("自定义求解  nStep = " + istep + "     Time = " + fTimeNow    +   "     Velocity_X   "  + fXVel   +     "     Velocity_Y   "  + fYVel  );
}

if(istep % 500 == 0)
{
dyna.PutStep();
}

}
