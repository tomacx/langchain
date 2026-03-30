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

//导出Grid格式的地形文件
blkdyn.ExportTerrainData(537340,537454,  378140, 378248, 100, 100, 1.5);

//导出滑体文件
blkdyn.ExportTerrainData(537340,537454,  378140, 378248, 100, 100, 1.5);

//输出必要的结果与监测
dyna.Monitor("block","ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block","ydis", 5.0, 2.0, 5.0);

//保存仿真脚本
dyna.Save("ExcGroup_1.sav");

//运行仿真脚本
dyna.Solve();

//分析仿真结果
dyna.Analyze();
