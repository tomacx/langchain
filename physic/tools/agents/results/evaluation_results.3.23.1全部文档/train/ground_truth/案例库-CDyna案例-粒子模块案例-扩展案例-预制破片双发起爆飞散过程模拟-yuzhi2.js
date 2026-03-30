setCurDir(getSrcDir());

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


blkdyn.ImportGrid("ansys", "2_0.01.dat");

//将设定坐标范围内的自由表面设置为接触面
blkdyn.CrtBoundIFaceByCoord(-1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
//更新接触面网格
blkdyn.UpdateIFaceMesh();

////////////////////////////////////////////////////////////////块体、界面信息栏
//设置单元本构模型为线弹性模型
blkdyn.SetModel("linear");
//设置炸药参数density young poisson cohesion tension friction dilation
blkdyn.SetMat(1800, 3e9, 0.24, 3e5, 1e5, 0, 0, 2);
//设置侧壁破片参数（钢）-等效层
blkdyn.SetMat(9000, 4e11, 0.3, 800e5, 800e5, 0, 0, 1);

//设置接触面模型
blkdyn.SetIModel("brittleMC");
//设置接触面参数
blkdyn.SetIMat(5e11, 5e11, 0.01, 0, 0);
////////////////////////////////////
blkdyn.SetIStiffByElem(100);
////////////////////////////////////
blkdyn.SetIStrengthByElem();


//设置阻尼为0
blkdyn.SetLocalDamp(0.1);

//施加重力
blkdyn.ApplyGravity();


////////////////////////////////////////////////////////////////爆炸载荷设定
//设置全局的朗道爆源模型：序号、装药密度、爆速、爆热、初始段绝热指数、第二段绝热指数、波阵面上的压力、点火点位置、点火时间、持续时间
var pos = new Array(2);
for (var i = 0; i < 2; i++)
{
	pos[i] = [i * 0.31, 0.0, 0];
}
blkdyn.SetLandauSource(1, 1800, 8070, 5.67e6, 3.0, 1.3333, 36.7e9, pos, 0.0, 100);
//将各组号单元与对应的的Landau爆源模型序号绑定
blkdyn.BindLandauSource(1, 2, 2);


////////////////////////////////////////////////////////////////颗粒(破片)网格导入
pdyna.Import("pdyna", "Ball_2_0.01.dat");


////////////////////////////////////////////////////////////////颗粒信息栏
//脆断模型
pdyna.SetModel("brittleMC");
//密度 弹模 泊松比 抗拉强度 粘聚力 内摩擦角 局部阻尼系数 粘性阻尼系数
pdyna.SetMat(16930, 4.1e11, 0.2, 0, 0, 30, 0.0, 0.0);


////////////////////////////////////////////////////
///////////////////////起爆计算，速度进入平台期
dyna.Set("Time_Step 1e-8");

blkdyn.SetModel("SoftenMC");
blkdyn.SetModel("Landau", 2);
//pdyna. SetModel("none");

dyna.Solve(10000);

dyna.Save("blast.sav");
//dyna.Restore("blast.sav");

////////////////////////////////////////////////



/////////////////////////////////////////////////
///////////飞行计算
dyna.Set("Output_Interval 1000");
pdyna.InheritInfoFromBlock(1,15);

blkdyn.SetModel("none");
pdyna.SetModel("brittleMC");

dyna.Set("Mechanic_Cal 0");

dyna.Set("If_Cal_Particle 1");
//1-传统颗粒流； 2-PCMM 颗粒； 3-带阻力的飞行颗粒（不进行接触更新计算）
dyna.Set("Particle_Cal_Type 3");

//设置飞行参数，空气密度，地面高程，空气阻力模式（1-常阻力，2-马赫阻力，3-雷诺阻力），阻力参数（1时为阻力系数，2为声速，3为动力粘度）
pfly.SetFlyPara( 1.069, -2, 2, 340.0);


//设置颗粒形状，立方体、等效半径、等效质量、迎风面积，组号下限及上限
pfly.SetShapePara (2, 4.390e-3, 4e-3, 5.024e-5, 1,1000);

//设置可穿透靶板，靶板中心坐标，靶板半径，靶板高度下限及上限
pfly.CrtPeneTarget(0.5772, 0, 0, 7.62, -2, 0);
pfly.CrtPeneTarget(0.5772, 0, 0, 30  , -2, 0);
for(var i = 0; i < 10; i++)
{
   pfly.CrtPeneTarget( 0.5772, 0, 0, 100 + i * 10, -2, 0);
}

dyna.Set("Time_Step 1e-3");

dyna.Solve();

dyna.Save("Fly.sav");


//可穿透靶板信息输出:飞散角、临界能量、每平方米上的颗粒数、导出文件
pfly.ExportPeneTargetInfo( 113, 78, 1.0 / 56.0 ,1 );


//设置圆盘信息
draw.setColor(0,0,0);

var x0 = 0.15;
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


for (var ilength = 100; ilength <= Length ;)
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

	ilength += 100;
}


//draw.AutoZoom = true;
draw.commit();
