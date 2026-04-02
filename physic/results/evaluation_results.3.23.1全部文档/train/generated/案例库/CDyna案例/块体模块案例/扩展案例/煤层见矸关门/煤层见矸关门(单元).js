//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//清除dyna模块数据
dyna.Clear();

//清除平台结果模块数据
doc.clearResult();

//打开固体计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//**********打开接触更新开关**************************
dyna.Set("If_Renew_Contact 1");

//创建网格，长400m，高200m，长度方向50个网格，高度方向25个网格，组号为1
blkdyn.GenBrick2D(400, 200, 50, 25 ,1);

//将设定范围内的单元变成组2，便于开挖
blkdyn.SetGroupByCoord(2, 80, 320, 24, 40, -1, 1);

//**********接触面离散，全部单元离散*************************
blkdyn.CrtIFace();

//**********更新接触拓扑**************************
blkdyn.UpdateIFaceMesh();

//将单元模型设置为线弹性模型
blkdyn.SetModel("linear");

//设置组1及组2的材料参数
blkdyn.SetMat(2500, 1e10, 0.25, 1e6, 0.8e6, 40.0, 10.0);

//**********设置接触模型， 线弹性**************************
blkdyn.SetIModel("linear");

//**********设置接触参数，从单元中继承**************************
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

//模型底部施加全约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);

//模型左右两侧施加法向约束
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 399.99, 401);

//监测块体破坏度
dyna.Monitor("gvalue", "gv_block_broken_ratio");

//监测竖直应力
dyna.Monitor("block", "syy", 200, 150, 0);

//求解至稳定
dyna.Solve();
