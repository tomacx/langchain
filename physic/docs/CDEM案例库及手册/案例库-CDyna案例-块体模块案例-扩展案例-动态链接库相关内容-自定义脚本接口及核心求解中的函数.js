//设置工作路径为JS文件所在路径
setCurDir(getSrcDir());

//清楚BlockDyna内存数据
dyna.Clear();


//设置结果输出时步为500步
dyna.Set("Output_Interval 500");

//创建三维方形网格
blkdyn.GenBrick3D(10,10,10,10,10,10,1);

//设置模型为线弹性模型
blkdyn.SetModel("linear");

//设置材料参数
blkdyn.SetMat(2500,3e10,0.25,3e6,1e6,30,10);

//固定边界条件
blkdyn.FixV("xyz",0,"y",-0.01,0.001);

//加载动态链接库
dyna.LoadUDF("CustomModel");

//运行动态链接库中的函数，自定义命令流
dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");
dyna.RunUDFCmd("PrintTotalVolume");

//打开允许用户在核心迭代中加入自定义函数功能
dyna.Set("If_Allow_UDF_Kernel 1");

//求解
dyna.Solve();

dyna.FreeUDF();
