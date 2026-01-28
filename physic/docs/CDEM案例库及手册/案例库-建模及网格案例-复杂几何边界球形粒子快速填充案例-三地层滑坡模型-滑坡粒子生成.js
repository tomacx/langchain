setCurDir(getSrcDir());

var msh1 = imesh.importGid("top.msh");
var msh2 = imesh.importGid("middle.msh");
var msh3 = imesh.importGid("bottom.msh");

pargen.addBound(msh1, msh2, msh3);

pargen.setValue("OptiPosOption", 1);

///填充半径为1m的粒子
var parmsh = pargen.gen(1);

