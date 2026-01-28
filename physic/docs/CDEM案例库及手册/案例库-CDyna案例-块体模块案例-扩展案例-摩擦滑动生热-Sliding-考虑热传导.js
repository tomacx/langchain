setCurDir(getSrcDir());

dyna.Clear();


//设置三个方向的重力加速度值
dyna.Set("Gravity  9.8 -9.8 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

//设置云图输出间隔为500
dyna.Set("Output_Interval 500");

//设置监测信息提取间隔为10时步
dyna.Set("Moniter_Iter 10");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

//打开热传导计算开关
dyna.Set("Heat_Cal 1");

dyna.Set("PlaSlipHeat_TransCal_Option 1 0.6");

blkdyn.ImportGrid("gid", "slidbody.msh");


blkdyn.CrtIFaceByCoord(-1e5, 1e5, 0.099,0.101, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(2500, 3e8, 0.22, 8e6, 5e6, 35, 10);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e9, 1e9, 20.0, 0 ,0);

blkdyn.SetLocalDamp(0.01);


blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);


//设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (2500.0, 25.0, 3.125, 1000, 3e-5, 1);
heatcd.SetPropByGroup (2500.0, 25.0, 3.125, 1000, 3e-5, 2);

dyna.TimeStepCorrect(0.5);


dyna.Monitor("block", "xdis", 0.15, 0.15, 0);
dyna.Monitor("block", "sxx",  0.15, 0.15, 0);


dyna.DynaCycle(10);


print("**********************求解完毕**********************");




