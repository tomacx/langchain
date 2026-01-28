setCurDir(getSrcDir());

var msh1 = imesh.importGid("dengzi.msh");

pargen.addBound(msh1);

///半径是1m
pargen.gen(1.0);