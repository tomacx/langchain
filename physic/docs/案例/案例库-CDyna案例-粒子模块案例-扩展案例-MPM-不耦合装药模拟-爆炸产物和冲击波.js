//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());


//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol  0.0")

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 500");

//设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");


//设置PCMM颗粒的接触容差
dyna.Set("PCMM_Elem_Tol 2e-4");

//设置颗粒的计算模式为2-PCMM颗粒模式
dyna.Set("Particle_Cal_Type 1");

dyna.Set("MPM_Cal_Mode 2");


blkdyn.ImportGrid("gmsh", "CDEM.msh");

blkdyn.SetModel("linear");
blkdyn.SetModel("JWL", 2);

blkdyn.SetMat(2000, 1.5e8, 0.25, 5e6, 5e6, 30, 5);

//指定组3的材料参数，炸药
blkdyn.SetMat(1150, 1e8, 0.25, 3e6, 1e6, 15, 5, 2);


//设置全局的JWL炸药参数，为TNT，材料序号1
// var apos = [60.0, 60.0, 0.0];
// blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);
// blkdyn.BindLandauSource(1, 2, 2);

///设定TNT爆源参数
var apos = [60.0, 60.0, 0.0];
blkdyn.SetJWLSource(1, 1630, 3e9, 10e9, 1e9, 4.2, 0.95, 0.3, 5e9, 6930.0, apos, 0.0, 10.0);
blkdyn.BindJWLSource(1, 2, 2);

blkdyn.SetLocalDamp(0.001);

//施加无反射边界
blkdyn.SetQuietBoundByCoord(-0.1, 0.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(119.1, 120.1, -1e5, 1e5, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, -0.1, 0.1, -1e5, 1e5);
blkdyn.SetQuietBoundByCoord(-1e5, 1e5, 119.1, 120.1, -1e5, 1e5);



pdyna.CrossCreateByCylinder(3, 1, 0.2, [60,60,-1], [60,60,1], 1, 5);


//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetModel("brittleMC");
//指定组1的材料参数，岩石
pdyna.SetMat(2500, 5e8, 0.25, 0, 0, 30, 0.0, 0.0);



//创建mpm背景网格
mpm.SetBackGrid(2, 1.5, [60-8,60-8,0], [11, 11, 0]);


//设置pcmm模型为线弹性模型
mpm.SetModelByGroup("MC",3,3);

//dyna.Set("Arti_Visc_Damp 1 1.0 1.0");

//mpm.SetFailCond ("PlaStrain", [1.0, 0.5], 1);

//dyna.Set("Time_Step 1e-10");

dyna.TimeStepCorrect(0.05);

//动力计算0.14ms

dyna.DynaCycle(1.4);