//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 -9.8 0.0");

//打开单元大变形计算开关
dyna.Set("Large_Displace 1");

//打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//设置计算时步为4e-5
dyna.Set("Virtural_Step 0.3");

//创建长宽为1m，厚5cm的板
blkdyn.ImportGrid("gmsh","soil-fem.msh");

//设置单元模型为线弹性模型
blkdyn.SetModel("SoftenMC");

//设置单元材料，依次为密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 1e8,0.25, 3e5, 3e5, 25, 15);

//设置单元的局部阻尼
blkdyn.SetLocalDamp(0.8);

blkdyn.FixV("xyz",0,"y", -0.05, 0.05);
blkdyn.FixV("xyz",0,"x", 1.95, 2.05);

pdyna.Import("pdyna","soil-dem.dat");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("SSMC");



//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 3e5, 3e5, 25, 0.8, 0.0);

pdyna.FixV("xyz",0,"y", -0.05, 0.05);
pdyna.FixV("xyz",0,"x", 1.95, 2.05);

//创建顶部刚性面
var fCoord = new Array();
fCoord[0]=new Array(0,0.6,0.0);
fCoord[1]=new Array(-0.8,0.5,0.0);
rdface.Create (1, 2, 2, fCoord);

var fCoord = new Array();
fCoord[0]=new Array(0,0.6,0.0);
fCoord[1]=new Array(-0.8,1.2,0.0);
rdface.Create (1, 2, 2, fCoord);

rdface.SetModelByGroup(0,1,11);


dyna.Set("If_Cal_FEM_DEM_Evolvement 1");


dyna.Solve();

//设置单元的局部阻尼
blkdyn.SetLocalDamp(0.02);

////重新设置材料参数，主要是阻尼参数
pdyna. SetSingleMat("LocalDamp",0.0);
pdyna. SetSingleMat("ViscDamp",0.1);

///设置刚性面模型为实模型
rdface.SetModelByGroup(1,1,11);
//设置刚性面运动速度2m/s
rdface.ApplyVelocityByGroup ([2,0,0], 1,11);


dyna.Set("If_Virtural_Mass 0");

dyna.TimeStepCorrect(0.5);

//求解2万步
dyna.Solve(20000);

//打印信息
print("Solution is ok!");

