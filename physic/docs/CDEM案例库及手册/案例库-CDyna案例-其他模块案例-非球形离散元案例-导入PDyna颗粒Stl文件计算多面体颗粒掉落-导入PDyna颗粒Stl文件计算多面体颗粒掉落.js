//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0 ");

//设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("GiD_Out 0");

dyna.Set("If_Particle_Cal_Rolling 0");

dyna.Set("Particle_Out_Kill 1 0 0.3 0 0.8 0 0.3 0");


//设置底部刚性面
rdface.Import("gid", "BoundMesh.msh");



//pdyna.CrtPolyhedronPartFromFile(<strSTLFile, strPDynaFile, strSizeScaleType, fPara1, fPara2, nGrpLow, nGrpUp, nRandomDirFlag [, Type, Value]>);
pdyna.CrtPolyhedronPartFromFile("SiglePar.stl", "pdyna-par.dat", "uniform", 1, 1.0, 1, 111, 1,2,0.003);

print("完成创建");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 1e6, 0.25, 0.0, 0.0, 10, 0.01, 0.05, 0.06);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");


//设置动态计算时步为1e-4秒
dyna.TimeStepCorrect(0.2);


//计算3万步
dyna.Solve(100000);


