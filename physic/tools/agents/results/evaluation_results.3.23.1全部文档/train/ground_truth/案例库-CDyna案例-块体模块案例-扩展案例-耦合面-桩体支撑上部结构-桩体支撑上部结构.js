setCurDir(getSrcDir());

dyna.Set("Para_Threads_Num 1");

dyna.Set("Output_Interval 500");

blkdyn.ImportGrid("gid","PileSupport.msh");

blkdyn.SetModel("linear");

blkdyn.SetMat(2500, 3e10, 0.25, 3e4, 1e4, 15, 15);

blkdyn.FixV("x",0.0, "x", -0.001, 0.001);
blkdyn.FixV("x",0.0, "x", 49.99, 51);
blkdyn.FixV("z",0.0, "z", -0.001, 0.001);
blkdyn.FixV("z",0.0, "z", -51,-49.99);
blkdyn.FixV("y",0.0, "y", -0.001, 0.001);

//创建耦合面
trff.CrtFace(2,2);

//设置耦合面模型为弹性模型
trff.SetModel("linear");

//设置耦合参数
trff.SetMat(5e9, 5e9, 20, 0, 0, 1e8);

dyna.Solve();
