setCurDir(getSrcDir());

////////////////////////////////////////////////////公共接口设置
//重力方向必须Y轴负半轴，Y方向为重力方向
dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Large_Displace 1");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Renew_Contact 0");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 2.0e-3");

dyna.Set("Block_Soften_Value 0.2 0.2");

dyna.Set("If_Cal_Particle 0");

//导入ANSYS类型的块体网格
blkdyn.ImportGrid("ansys", "block.dat");


////////////////////////////////////////////////////////////////块体信息栏
//设置单元本构模型为线弹性模型
blkdyn.SetModel("linear");
//设置炸药参数density young poisson cohesion tension friction dilation
blkdyn.SetMat(1700, 3e9, 0.24, 3e5, 3e5, 0, 0, 1);
//设置侧壁破片参数（钢）-等效层
blkdyn.SetMat(7800, 2e11, 0.3, 10e6, 10e6, 0, 0, 2);

//设置阻尼为0
blkdyn.SetLocalDamp(0.0);

//施加重力
//blkdyn.ApplyGravity();


////////////////////////////////////////////////////////////////爆炸载荷设定
//设置全局的朗道爆源模型：序号、装药密度、爆速、爆热、初始段绝热指数、第二段绝热指数、波阵面上的压力、点火点位置、点火时间、持续时间
var pos = new Array(4.06192, 0, 0);
blkdyn.SetLandauSource(1, 1700, 7104, 4.6e6, 3.0, 1.3333, 21.4e9, pos, 0.0, 100);
//将各组号单元与对应的的Landau爆源模型序号绑定
blkdyn.BindLandauSource(1, 1, 1);

////////////////////////////////////////////////////////////////颗粒(破片)网格生成及导入
///////////////////////////////////////////////////////需要输入的参数
//炸药组号
var iChargeGrp = 1;

//壳体组号
var iShellGrpL    = 2;
var iShellGrpU    = 2;

///全弹一段，只能为1及0。如果为1，表示一段，如果为0，表示多段
//如果1段，不需要输入轴线坐标
var OneSegOption = 0;

//全弹所分段数
var nSegs = 2;

//轴线第一点坐标
var afEnd1 = new Array(nSegs);
afEnd1[0] = [3.15315,0,0];
afEnd1[1] = [3.36297,0,0];
//轴线第二点坐标
var afEnd2 = new Array(nSegs);
afEnd2[0] = [3.36297,0,0];
afEnd2[1] = [4.06192,0,0];

//壳体初始半径，外径（单位：cm）
var a0 = new Array(nSegs);
a0[0] = 10;
a0[1] = 20;

//初始壳体厚度（单位：cm）
var delta0 = new Array(nSegs);
delta0 [0] = 3;
delta0 [1] = 3;

//壳体内径（单位：cm）
var d0 = new Array(nSegs);
d0[0] = 6;
d0[1] = 17;

//炸药爆速（单位：km/s）
var De = 7.104;

//炸药密度（单位：kg/m3）
var chargDens = 1700.0;

//壳体密度（单位：kg/m3）
var ShellDens = 7800.0;

//炸药参数A，对CompB炸药，取0.32
var Ap  = 0.32;

//断裂应变（比例系数，通常1.5-2）（无单位）
var epslon = 1.5;

//破碎比能，钢14.7（无单位）
var W = 14.7;
///////////////////////////////////////////////////////需要输入的参数

for (var iseg = 0; iseg < nSegs; iseg++)
{
	//该段壳体总质量
	var M = 0.0;
	//装药比（药比壳体）
	var beta = 0.0;
	if(OneSegOption == 1)
	{
		M = pfly.CalShellMass( ShellDens, iShellGrpL, iShellGrpU);
		beta = pfly.CalChargeRatio( chargDens / ShellDens, iChargeGrp);
	}
	else
	{
		M = pfly.CalShellMass( ShellDens, iShellGrpL, iShellGrpU, afEnd1[iseg],afEnd2[iseg]);
		beta = pfly.CalChargeRatio( chargDens / ShellDens, iChargeGrp, afEnd1[iseg], afEnd2[iseg]);
	}

	print("该段壳体总质量为： " + M + "(kg)");
	print("该段壳体装药比为： " + beta);

	//格尼系数，格尼比能
	var sqrt_2E = 0.52 + 0.28 * De;
	//初速度 (m/s)
	var v0 = sqrt_2E * Math.sqrt(beta / (1.0 + 0.5 * beta)) * 1000.0;
	//壳体破碎时半径
	var af = a0[iseg] * epslon;
	//壳体破碎时厚度
	var delta = delta0[iseg] / epslon;
	//破片平均质量
	var averM = 82.2 * Math.pow(ShellDens / 1000.0, 1.0 / 3.0) * Math.pow(af, 4.0/3.0) * Math.pow(W, 2.0 / 3.0) * delta / Math.pow(v0, 4.0 / 3.0);
	//破片总数量
	var TotalNo = Math.round(M * 1000.0 / averM);

	//mott分布u值
	var mut = Ap * (  delta0[iseg] * Math.pow((d0[iseg] + delta0[iseg]), 3.0 / 2.0 ) / d0[iseg] ) * Math.sqrt(1.0 + 0.5 * beta);
	//乘以1e-3，单位kg
	var mu = mut * mut * 1e-3;

	print("总破片数为： " + TotalNo);
	print("mu为： " + mu  + "  kg");

	pfly.GenFragments(ShellDens, TotalNo, mu, 1e-8, 1e-8, iShellGrpL, iShellGrpU, afEnd1[iseg], afEnd2[iseg]);
}
pdyna.Export("par.dat");
////////////////////////////////////////////////////////////////颗粒(破片)网格生成及导入

////////////////////////////////////////////////////////////////颗粒信息栏
//脆断模型
pdyna.SetModel("brittleMC");
//密度 弹模 泊松比 抗拉强度 粘聚力 内摩擦角 局部阻尼系数 粘性阻尼系数
pdyna.SetMat(7800, 2.06e11, 0.3, 0, 0, 30, 0.0, 0.0);


////////////////////////////////////////////////////////////////设置监测点
dyna.Monitor("block", "magvel", 3.12315, 0, 0);
dyna.Monitor("block", "magvel", 3.22453, 0.106093, 0);
dyna.Monitor("block", "magvel", 3.34251, 0.198309, 0);
dyna.Monitor("block", "magvel", 3.50034, 0.2, 0);
dyna.Monitor("block", "magvel", 3.64823, 0.2, 0);
dyna.Monitor("block", "magvel", 3.79613, 0.2, 0);
dyna.Monitor("block", "magvel", 3.94402, 0.2, 0);
dyna.Monitor("block", "magvel", 4.09192, 0.2, 0);
////////////////////////////////////////////////////
///////////////////////起爆计算，速度进入平台期
dyna.Set("Time_Step 5e-8");

blkdyn.SetModel("softenMC");
blkdyn.SetModel("Landau", 1);

dyna.Set("Output_Interval 500");
dyna.Solve(10000);
dyna.Save("blast.sav");
//dyna.Restore("blast.sav");


////////////////////////////////////////////////


////////////////////////////////////////////////
///////////飞行计算
dyna.Set("Output_Interval 1000");
pdyna.InheritInfoFromBlock(1,15,0);

//blkdyn.SetModel("none");
pdyna.SetModel("brittleMC");

dyna.Set("Mechanic_Cal 0");

dyna.Set("If_Cal_Particle 1");
//1-传统颗粒流； 2-PCMM 颗粒； 3-带阻力的飞行颗粒（不进行接触更新计算）
dyna.Set("Particle_Cal_Type 3");

//设置飞行参数，空气密度，地面高程，空气阻力模式（1-常阻力，2-马赫阻力，3-雷诺阻力），阻力参数（1时为阻力系数，2为声速，3为动力粘度）
pfly.SetFlyPara( 1.069, -2, 2, 340.0);


//根据尺寸比例，对自然破片的迎风面积及阻力系数取值进行修正
pfly.FragShapeCorrect (5.0,3.0,1.0);

pfly.CrtPeneTarget( 3.61, 0, 0, 5 , -2, 0);
pfly.CrtPeneTarget( 3.61, 0, 0, 10, -2, 0);
pfly.CrtPeneTarget( 3.61, 0, 0, 15, -2, 0);
pfly.CrtPeneTarget( 3.61, 0, 0, 20, -2, 0);
pfly.CrtPeneTarget( 3.61, 0, 0, 25, -2, 0);
//设置可穿透靶板，靶板中心坐标，靶板半径，靶板高度下限及上限
for(var i = 0; i < 20; i++)
{
   pfly.CrtPeneTarget( 3.61, 0, 0, 30 + i * 20, -2, 0);
}

dyna.Set("Time_Step 1e-4");

dyna.Solve(10000);

dyna.Save("Fly.sav");
//dyna.Restore("Fly.sav");


//可穿透靶板信息输出:飞散角、临界能量、每平方米上的颗粒数、导出文件
pfly.ExportPeneTargetInfo( 129, 78, 1.0 / 56.0 ,1 );


//设置圆盘信息
draw.setColor(0,0,0);

var x0 = 3.61;
var z0 = 0;

var Length = 600;

for (var cita = 0; cita < 180; )
{
	var x1 = x0 + Length * Math.cos(cita / 180 * Math.PI);
	var x2 = x0 - Length * Math.cos(cita / 180 * Math.PI);

	var z1 = z0 + Length * Math.sin(cita / 180 * Math.PI);
	var z2 = z0 - Length * Math.sin(cita / 180 * Math.PI);

	draw.line3d(x1, 0, z1, x2, 0, z2 );
	//draw.commit();

	cita += 30;
}


for (var ilength = 50; ilength <= Length ;)
{
	for (var cita1 = 0; cita1 < 360; )
	{
		var cita2 = cita1 + 5;

		var x1 = x0 + ilength * Math.cos(cita1 / 180 * Math.PI);
		var z1 = z0 + ilength * Math.sin(cita1 / 180 * Math.PI);

		var x2 = x0 + ilength * Math.cos(cita2 / 180 * Math.PI);
		var z2 = z0 + ilength * Math.sin(cita2 / 180 * Math.PI);

		draw.line3d(x1, 0,z1, x2, 0, z2);
		//draw.commit();

		cita1 += 5;
	}

	ilength += 50;
}


//draw.AutoZoom = true;
draw.commit();
