//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());


//设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

dyna.Set("Large_Displace 1");

////RdFace_MechModel  1-普通刚性面，2-板，3-壳
dyna.Set("RdFace_MechModel 2");

//导入刚性面
rdface.Import ("gid","building.msh");

///设置材料参数
rdface.SetDeformMat(0.2, 2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);

//设置边界条件
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -1e5, 1e5, -0.01, 0.01, -1e5, 1e5);


//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 1e-4");


//计算3万步
dyna.Solve(30000);
