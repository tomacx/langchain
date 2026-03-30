//设置当前目录为JS脚本文件所在目录
setCurDir(getSrcDir());

//设置个方向的重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

//创建三维方块网格
blkdyn.GenBrick3D(10,10,10,20,20,20,1);

//设置单元的模型为线弹性模型
blkdyn.SetModel("linear");

//设置材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

//固定底部个方向的速度为
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

//设置Y方向的个监测点
dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);

//计算前初始haul
dyna.BeforeCal();

//循环万步
for(var i = 0; i < 10000; i++)
{
    //集成核心计算
    //var unbal = blkdyn.Solver();

    //计算单元变形力
    blkdyn.CalBlockForce();

    //计算节点运动
    var unbal = blkdyn.CalNodeMovement();

    //输出监测信息
    dyna.OutputMonitorData();

    //每隔步推送信息
    if(i != 0 && i % 100 == 0)
    {
        //推送文本信息
        print("不平衡率：" + unbal);

        //推送结果信息至GDEM-Env
        dyna.PutStep(1,i,0.1);
    }
}

//输出监测信息
dyna.OutputMonitorData();

//每隔步推送信息
if(i != 0 && i % 100 == 0)
{
    //推送文本信息
    print("不平衡率：" + unbal);

    //推送结果信息至GDEM-Env
    dyna.PutStep(1,i,0.1);
}

//输出结果信息
dyna.OutputModelResult();
