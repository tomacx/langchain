////设置工作路径为当前javascript文件所在的路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统收敛的不平衡率为 1e-4
dyna.Set("UnBalance_Ratio 1e-4");

//设置 3 个方向的重力加速度值
dyna.Set("Gravity 0 0 -9.8");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置接触更新
dyna.Set("If_Renew_Contact 1");

//设置计算结果的输出间隔为 1000 步
dyna.Set("Output_Interval 1000");

//设置监测结果的输出时步为 100 步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为 0.5
dyna.Set("Virtural_Step 0.2");

//设置接触容差0.4
dyna.Set("Contact_Detect_Tol 0.4");
////////////////////////////////////////////////////////////////////////////

//导入 midas 格式的网格
blkdyn.ImportGrid("ansys", "mesh.dat");

//不同组间进行切割
blkdyn.CrtIFace(-1,-1);

//更新交界面网格信息
blkdyn.UpdateIFaceMesh();

//设置所有单元为线弹性模型
blkdyn.SetModel("linear");

//设置材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2300,   4.37E+10	,    0.28,	2.17E+06,    1.83E+06,   25.0,   5,   1);//覆岩
blkdyn.SetMatByGroup(1380,   4.91E+09	,    0.24,	1.25E+06,    5.00E+05,   32.0,   5,   2);//煤层
blkdyn.SetMatByGroup(2219,   1.28E+10	,    0.26,	2.50E+06,    1.30E+06,   31.5,   5,   3);//基岩

//设置所有单元为线弹性模型
blkdyn.SetIModel("linear");

blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(10);

//X 方向左侧法向约束
blkdyn.FixVByCoord("x", 0.0, -0.1, 0.1,  -1,110,  -1,110);

//X 方向右侧法向约束
blkdyn.FixVByCoord("x", 0.0, 99, 101,  -1,110,  -1,110);

//Y 方向左侧法向约束
blkdyn.FixVByCoord("y", 0.0, -1,110,  -0.1,0.1, -1, 110);

//Y 方向右侧法向约束
blkdyn.FixVByCoord("y", 0.0, -1,110,  99,101, -1, 110);

//z方向底部法向约束
blkdyn.FixVByCoord("z", 0.0, -1,110,  -1,110, -0.1,0.1);

//blkdyn.FixVAuto();

//模型顶部施加面力
var fVar = [0,0,-5e6];
var fGrad = [0,0,0,0,0,0,0,0,0];
blkdyn.ApplyConditionByCoord("face_force", fVar, fGrad, -1,101, -1,101, 39,41, false);

//设置全部节点的局部阻尼为 0.8
blkdyn.SetLocalDamp(0.8);

//弹性计算
dyna.Solve();
dyna.Save("linear.sav");
//dyna.Restore("linear.sav");


//将所有单元的计算模型设定为 Mohr-Coulomb 理想弹塑性模型
blkdyn.SetModel("softenMC");
//塑性计算
dyna.Solve();
dyna.Save("softenMC.sav");
//dyna.Restore("softenMC.sav");

//初始化地应力
var values = [0, 0, 0];
var gradient = [0,0,0,0,0,0,0,0,0];
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
//////////////////////////////////////////////////////////////////////////////////////////////////////

//弹簧脆断
blkdyn.SetIModel("brittleMC");

blkdyn.SetLocalDamp(0.1);

//构造采空区
blkdyn.SetGroupByCoord(4, 20, 60, 0,100, 10,15);
blkdyn.SetModelByCoord("none", 20, 60, 0,100, 10,15);

//构造巷道
blkdyn.SetGroupByCoord(4,  68, 72, 0,100, 10,15);
blkdyn.SetModelByCoord("none", 68, 72, 0,100, 10,15);

//构造区段煤柱
blkdyn.SetGroupByCoord(4,  60, 68, 40,48, 10,15);
blkdyn.SetModelByCoord("none", 60, 68, 40,48, 10,15);


//求解至稳定
dyna.Solve(10000);

//保持save文件
dyna.Save("caikongqu.sav");
//dyna.Restore("caikongqu.sav");

//监测测点
for (var i = 4; i <= 96; )
{
	dyna.Monitor("block", "syy", 64, i, 15);
	i += 4;
}

dyna.Set("Time_Now 0");

//工作面开采
//沿y轴正方向开挖，每次开挖8m
for(var istage = 0; istage < 8; istage++)
{
	var ycoord1 = istage * 8;
	var ycoord2 = istage * 8 + 8;

                blkdyn.SetGroupByCoord(5 + istage, 72, 100, ycoord1, ycoord2, 10, 15);
    	blkdyn.SetModelByCoord("none", 72, 100, ycoord1, ycoord2, 10, 15);

    //求解1万步
    dyna.Solve(10000);

    ///保持save文件
    var string = ycoord1 + "-" + ycoord2 + ".sav";
    dyna.Save(string);
    //dyna.Restore(string);
}

//打印求解信息
print("Solution Finished");
