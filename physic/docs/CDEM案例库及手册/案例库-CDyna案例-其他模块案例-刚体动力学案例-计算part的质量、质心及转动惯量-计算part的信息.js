setCurDir(getSrcDir());

imesh.importAnsys("bound.dat");

//gFun.calArbi3DModelInfo(<pBoundMesh, fDensity [, nTotal [, nPrtFlag [, nExpParFlag]] ]>);

var aa = gFun.calArbi3DModelInfo(cMesh[2], 1500, 100, 1, 1);

print(aa)