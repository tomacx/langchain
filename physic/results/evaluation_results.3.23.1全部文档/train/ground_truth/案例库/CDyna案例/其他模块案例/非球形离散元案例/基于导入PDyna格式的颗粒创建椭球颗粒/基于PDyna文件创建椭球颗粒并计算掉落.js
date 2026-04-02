//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8 ");

//设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("GiD_Out 1");


//设置底部刚性面
rdface.Import("gid", "20m-20m-bound.msh");

//导入pdyna格式的颗粒并创建椭球
pdyna.CrtEllipsoidPartFromFile("Rad4m.dat", "uniform", 0.8,1, "uniform", 0.2,1, "uniform", 0.2, 1.0, 12, 12);


//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 5e7, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");


//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 2e-4");


//计算3万步
dyna.Solve(100000);
