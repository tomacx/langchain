setCurDir(getSrcDir());


igeo.genRectS(0,0,0,1,1,0,0.01,1);

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);

blkdyn.RandomizeGroupByBall(0.05,0.2, 0, 200, 1);

pdyna.CreateFromBlock(2,1,111111);
