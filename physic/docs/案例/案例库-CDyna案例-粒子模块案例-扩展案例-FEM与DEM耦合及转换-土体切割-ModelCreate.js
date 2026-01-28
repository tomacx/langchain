setCurDir(getSrcDir());

igeo.genRectS(0,0,0,2,1,0,0.025,1);

imeshing.genMeshByGmsh(2,"soil-fem");

blkdyn.GetMesh(imeshing);


pdyna.CreateFromBlock(2, 1,11);

pdyna.Export("soil-dem.dat");