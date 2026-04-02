// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为100步
dyna.Set("Moniter_Iter 100");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置子空间更新时步为100步
dyna.Set("Renew_Interval 100");

// 设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 1e-3");

// 打开save文件自动保存开关
dyna.Set("SaveFile_Out 1");

////RdFace_MechModel  1-普通刚性面，2-板，3-壳
dyna.Set("RdFace_MechModel 1");

// 导入刚性面
rdface.Import ("gid","rdface.msh");

///设置材料参数
rdface.SetDeformMat(0.1, 2500, 3e8, 0.25, 3e6, 1e6, 35, 0.01);

// 设置边界条件
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -1e5, 1e5, 5-0.01, 5+0.01, -1e5, 1e5);

// 设置计算时步
dyna.Set("Time_Step 1e-4");

// 求解至稳定
dyna.Solve();
