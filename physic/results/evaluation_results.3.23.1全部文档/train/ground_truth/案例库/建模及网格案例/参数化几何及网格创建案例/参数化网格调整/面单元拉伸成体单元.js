setCurDir(getSrcDir());

igeo.genRectS(0,0,0,10,10,0,0.5,1);

igeo.genCircleS(20,0,0,5,0.5,2);

imeshing.genMeshByGmsh(2);


imeshing.extrude(0,0,5,10);
