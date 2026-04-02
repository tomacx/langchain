//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());


//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0  0.0 -9.8");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 1e-4");

dyna.Set("Particle_Renew_Interval 1");

////RdFace_MechModel  1-普通刚性面，2-板，3-壳
dyna.Set("RdFace_MechModel 3");

dyna.Set("If_Search_PBContact_Adavance 1");

//导入刚性面
rdface.Import ("ansys","plate.dat");

///设置材料参数
rdface.SetDeformMat(0.01, 2500, 3e9, 0.25, 3e6, 1e6, 35, 0.01);

//设置边界条件
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -0.01, 0.01, -1e5, 1e5, -1e5, 1e5);
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, 10-0.01, 10+0.01, -1e5, 1e5, -1e5, 1e5);
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1,  -1e5, 1e5,-0.01, 0.01, -1e5, 1e5);
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1,  -1e5, 1e5, 10-0.01, 10+0.01,-1e5, 1e5);

rdface.SetGravity(0,0,0);

//创建随机分布的颗粒
var x = new Array(4.5, 5.5);
var y = new Array(4.5, 5.5);
var z = new Array(0.2, 1);
pdyna.CreateByCoord(3000, 1, 2, 0.1, 0.1, 0.1, x,y,z);

//设定颗粒模型为脆断模型
pdyna.SetModel("brittleMC");

//设定颗粒接触材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 5e8, 0.25, 0.0, 0.0, 0.0, 0.0, 0.05);

dyna.Monitor("rdface","rg_NodeVelZ", 5,5,0);
dyna.Monitor("rdface","rg_NodeDisZ", 5,5,0);

//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 2e-4");


//计算3万步
dyna.Solve(30000);
