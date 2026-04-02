setCurDir(getSrcDir());
igeo.clear();
imeshing.clear();

var vid = igeo.genBrickV(0,0,0,10,10,10,1,1);

var sid = igeo.genCircleS(5,5,5,2,0.2,2);

igeo.setHardSurfToVol( sid ,vid );

imeshing.genMeshByGmsh(3);
