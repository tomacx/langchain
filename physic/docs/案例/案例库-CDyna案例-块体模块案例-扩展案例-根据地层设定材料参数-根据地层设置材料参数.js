setCurDir(getSrcDir());

dyna.Clear();

dyna.Set("Gravity 0 0 -9.8");


blkdyn.GenBrick3D(5, 5, 3, 50, 50, 30, 1);


blkdyn.SetMatByStratum("arrange.txt");


blkdyn.FixV("xyz",0.0, "z", -0.001, 0.001);

dyna.Solve();

//绘制弹性模量的云图
dyna.Plot("Elem","Young");
