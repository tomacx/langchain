//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("GiD_Out 1");

dyna.Set("If_Search_PBContact_Adavance 1");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//设置接触容差，没找到接触之前，容差设置大一点
dyna.Set("Contact_Detect_Tol 5e-3");


blkdyn.ImportGrid("gid","blockmesh2.msh");

blkdyn.CrtBoundIFaceByCoord(-1e5,1e5,-1e5,1e5,-1e5,1e5);

blkdyn.UpdateIFaceMesh();


blkdyn.SetModel("linear");

blkdyn.SetMat(2500,1e9, 0.25, 3e6,1e6,45,15);

blkdyn.SetIModel("linear");

blkdyn.SetIMat(1e10,1e10,35, 1e6, 1e6);




rdface.Import("gid","bound.msh");


//导入gid格式的颗粒
pdyna.Import("gid","parmesh2.msh");

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("linear");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 1e4, 1e4, 20, 0.8, 0.0);




dyna.Set("If_Virtural_Mass 0");

blkdyn.SetIModel("brittleMC");
pdyna.SetModel("brittleMC");

blkdyn.SetLocalDamp(0.01);
pdyna. SetSingleMat("LocalDamp",0.01);

//设置动态计算时步为1e-4秒
//dyna.Set("Time_Step 1e-4");

dyna.TimeStepCorrect(0.8);


//计算3万步
dyna.Solve(100000);