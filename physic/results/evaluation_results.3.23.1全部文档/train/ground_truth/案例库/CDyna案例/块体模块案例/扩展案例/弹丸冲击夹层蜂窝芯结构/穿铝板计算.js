//设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());


//设置输出间隔为200步
dyna.Set("Output_Interval 2000");

//设置重力方向
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 1e-6");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置计算时步为1e-5
dyna.Set("Time_Step 5e-6");

//设置不平衡率为1e-3
dyna.Set("UnBalance_Ratio 1e-3");

//设置单元溶蚀，溶蚀提应变为1，溶蚀剪应变为1，开启溶蚀的组号为1
dyna.Set("Elem_Kill_Option 1 0.8 0.8 1 3");

//开启自动创建接触开关
dyna.Set("If_Auto_Create_Contact 1 1");

blkdyn.ImportGrid("ansys", "model-1.dat");

blkdyn.SetModel("FEP");

//设置前后蒙皮参数ALCLAD2024-T3 / QQ-A-250
blkdyn.SetMat(2730, 72e9, 0.33, 400e6, 400e6, 0.0, 5, 1);
blkdyn.SetMat(2730, 72e9, 0.33, 400e6, 400e6, 0.0, 5, 3);

//设置蜂窝芯参数LF2Y
blkdyn.SetMat(2730, 76e9, 0.33, 220e6, 220e6, 0.0, 5, 1, 10);

///////////////////////////////////金属铝
///设置全局的JohnsonCook参数
blkdyn.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0 , true);
///将组号为1-10的单元的JohnsonCook材料设置为全局材料中的1号材料
blkdyn.BindJCMat(1, 1, 10);
///设置序号为1的全局的MieGrueisen参数
blkdyn.SetMGMat(1, 2730, 5350, 1.34, 1.97, 1.5);
///将组号为1-10的单元的MieGrueisen材料设置为全局材料库中的5号材料。
blkdyn.BindMGMat(1, 1, 10);

// blkdyn.SetIStiffByElem(10);
// blkdyn.SetIStrengthByElem();


//初始化球体运动速度为1000m/s
//定义三个方向基础值
var values = new Array(0, 0, 1000);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将控制范围内的位移清零
blkdyn.InitConditionByGroup("velocity", values, gradient, 4, 4);

//固定底部mpm颗粒三个方向的速度
blkdyn.FixV("xyz", 0.0, "x", -1e5, 0.002);
blkdyn.FixV("xyz", 0.0, "x", 0.2 - 0.002, 1e5);
blkdyn.FixV("xyz", 0.0, "y", -1e5, 0.002);
blkdyn.FixV("xyz", 0.0, "y", 0.2 - 0.002, 1e5);

dyna.Monitor("block", "szz", 0.03, 0.17, -0.0005);
dyna.Monitor("block", "szz", 0.03, 0.10, -0.0005);
dyna.Monitor("block", "szz", 0.03, 0.03, -0.0005);
dyna.Monitor("block", "szz", 0.17, 0.17, -0.0005);
dyna.Monitor("block", "szz", 0.17, 0.10, -0.0005);
dyna.Monitor("block", "szz", 0.17, 0.03, -0.0005);

dyna.Monitor("block", "average_shear_stress", 0.03, 0.17, -0.0005);
dyna.Monitor("block", "average_shear_stress", 0.03, 0.10, -0.0005);
dyna.Monitor("block", "average_shear_stress", 0.03, 0.03, -0.0005);
dyna.Monitor("block", "average_shear_stress", 0.17, 0.17, -0.0005);
dyna.Monitor("block", "average_shear_stress", 0.17, 0.10, -0.0005);
dyna.Monitor("block", "average_shear_stress", 0.17, 0.03, -0.0005);

dyna.Monitor("block", "sozz", 0.03, 0.17, -0.0005);
dyna.Monitor("block", "sozz", 0.03, 0.10, -0.0005);
dyna.Monitor("block", "sozz", 0.03, 0.03, -0.0005);
dyna.Monitor("block", "sozz", 0.17, 0.17, -0.0005);
dyna.Monitor("block", "sozz", 0.17, 0.10, -0.0005);
dyna.Monitor("block", "sozz", 0.17, 0.03, -0.0005);

dyna.Monitor("block", "zdis", 0.03, 0.17, -0.0005);
dyna.Monitor("block", "zdis", 0.03, 0.10, -0.0005);
dyna.Monitor("block", "zdis", 0.03, 0.03, -0.0005);
dyna.Monitor("block", "zdis", 0.17, 0.17, -0.0005);
dyna.Monitor("block", "zdis", 0.17, 0.10, -0.0005);
dyna.Monitor("block", "zdis", 0.17, 0.03, -0.0005);

dyna.RegionMonitor("block", "xvel", 1, 1, 3, [4, 4]);
dyna.RegionMonitor("block", "yvel", 1, 1, 3, [4, 4]);
dyna.RegionMonitor("block", "zvel", 1, 1, 3, [4, 4]);
dyna.RegionMonitor("block", "magvel", 1, 1, 3, [4, 4]);

blkdyn.SetLocalDamp(0.0);

//dyna.TimeStepCorrect(0.9);
dyna.Set("Time_Step 5e-10");
dyna.ScaleTimeStep(1e-9, 1.5, 1);

//求解1000步
dyna.DynaCycle(4e-5);
