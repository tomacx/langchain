setCurDir(getSrcDir());

var height = 2.0;
var length = 0.8;

////////////////////////////////////////////////////网格导入
//重力方向必须Y轴负半轴，Y方向为重力方向
dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Large_Displace 1");


dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 2.0e-3");

dyna.Set("Output_Interval 500");

dyna.Set("Block_Soften_Value 0.2 0.2");

dyna.Set("If_Cal_Particle 0");


blkdyn.ImportGrid("gmsh", "GDEM.msh");

//侧壁破片等效层
blkdyn.SetMat(13000, 2e11, 0.3, 50e6, 50e6, 0, 0, 1);

//炸药单元
blkdyn.SetMat(1700, 1e9, 0.3, 800e6, 800e6, 0, 0, 2);


//炸药，参数
var apos = [-0.5 * length, height,0];
blkdyn.SetLandauSource(1, 1700, 7957, 7e6, 3.0, 1.3333, 26e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 2, 2);

blkdyn.SetModel("SoftenMC", 1);
blkdyn.SetModel("Landau", 2);


pdyna.Import("pdyna","Ball.dat");
pdyna.SetModel("brittleMC");
pdyna.SetMat(17936, 4e11,  0.2,  0, 0,  30, 0.0, 0.0);

//设置监测点
for(var i = 0; i <= 10; i++)
{
    dyna.Monitor("block","yvel", -0.5 * length + i * 0.1  * length , height,0)
}


////////////////////////////////////////////////////
///////////////////////起爆计算，速度进入平台期
//设置阻尼为0
blkdyn.SetLocalDamp(0.0);

dyna.Set("Time_Step 5e-8");

pdyna.SetModel("none");

dyna.Solve(10000);

dyna.Save("blast.sav");

////////////////////////////////////////////////



/////////////////////////////////////////////////
///////////飞行计算

pdyna.InheritInfoFromBlock(1,11);


pdyna.SetModel("brittleMC");

dyna.Set("Mechanic_Cal 0");

dyna.Set("If_Cal_Particle 1");

dyna.Set("Particle_Cal_Type 3");

//设置飞行参数，空气密度，地面高程，空气阻力模式（1-常阻力，2-马赫阻力，3-雷诺阻力），阻力参数（1时为阻力系数，2为声速，3为动力粘度）
pfly.SetFlyPara( 1.069, 0.0, 2, 340.0);


//设置颗粒形状，立方体、等效半径、等效质量、迎风面积，组号下限及上限
pfly.SetShapePara (2, 3.05e-3, 0.004380733, 37.21e-6, 1,100000);


//设置可穿透靶板，靶板中心坐标，靶板半径，靶板高度下限及上限
for(var i = 0; i < 10; i++)
{
   pfly.CrtPeneTarget( 0, 0, 0, 200.0 + 50.0 * i, 0.0, 2.0);
}

dyna.Set("Time_Step 5e-4");

dyna.Solve();

dyna.Save("Fly.sav");


//可穿透靶板信息输出
pfly.ExportPeneTargetInfo( 23.0, 78, 1.0 / 56.0 ,1 );


//颗粒地面统计输出
pfly.ExportGroundStatiInfo (0.0, 0.0, 0.0, 5.0, 5.0, 20,1,10000);

//颗粒地面靶板信息输出
var fx = [-100, 100];
var fz = [-100, 100];
var divno = [100,100];
var fTargetB = [0.0, 2.0];
pfly.ExportGroundTargetInfo (78.0, fx, fz, divno, fTargetB, 1, 200000, 1);
