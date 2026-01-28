setCurDir(getSrcDir());

imeshing.genBrick2D("f1", 0.1,1,5, 50, 0.5, 0.1);

imeshing.genBrick2D("f2", 0.6,0.1,30,5, 0, 0);

imeshing.genBrick2D("f3", 0.6,0.1,30,5, 0, 1.1);


imeshing.rotaExtrude(0,0.5,0,0,0.6,0,360,50);


blkdyn.GetMesh(imeshing);


blkdyn.SetModel("linear");

blkdyn.SetMat(2500,3e10, 0.25, 3e6, 1e6, 35, 15);

blkdyn.FixV("xyz",0,"y", 1.19,1.21);

dyna.Solve();