//设置脚本文件所在路径为工作路径
setCurDir(getSrcDir());

//清楚dyna核心模块及平台doc结果文件模块
dyna.Clear();
doc.clearResult();

//设置大变形开关
dyna.Set("Large_Displace 1");

//设置计算输出间隔为500
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//设置重力为0
dyna.Set("Gravity 0 0 0");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

//创建三维长方体模型
blkdyn.GenBrick3D(0.1,0.01, 0.01,  20,2,2,1);

//设置单元本构为MR模型
blkdyn.SetModel("MR");

//设置基础材料参数
blkdyn.SetMat(1100, 2e7, 0.485, 1e6, 1e6, 35,15);

//设置橡胶参数，2参数模型，C10 = 0.8073MPa，C01=0.1689MPa，D=100MPa
var MRMat = [0.8073, 0.1689, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10.0, 0.0];

//核心模块增加橡胶参数
blkdyn.SetMRMat(1, MRMat);

//关联橡胶参数
blkdyn.BindMRMat(1, 1, 100);

//左侧法向固定
blkdyn.FixV("x", 0, "x", -0.0001, 0.0001);

//右侧施加准静态速度载荷
blkdyn.FixV("x", 3e-7, "x",0.099,0.101);

//设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.2);

//监测x方向正应变
dyna.Monitor("block","soxx",0.04, 0.0125, 0.0);
dyna.Monitor("block","soxx", 0.05, 0.0125, 0.0);
dyna.Monitor("block","soxx", 0.06, 0.0125, 0.0);

//监测x方向正应力
dyna.Monitor("block","sxx",0.04, 0.0125, 0.0);
dyna.Monitor("block","sxx", 0.05, 0.0125, 0.0);
dyna.Monitor("block","sxx", 0.06, 0.0125, 0.0);

//监测内置变量5，该模型中表示静水压力P
dyna.Monitor("block","General_P5",0.04, 0.0125, 0.0);
dyna.Monitor("block","General_P5", 0.05, 0.0125, 0.0);
dyna.Monitor("block","General_P5", 0.06, 0.0125, 0.0);

//计算14万步
dyna.Solve(140000);
