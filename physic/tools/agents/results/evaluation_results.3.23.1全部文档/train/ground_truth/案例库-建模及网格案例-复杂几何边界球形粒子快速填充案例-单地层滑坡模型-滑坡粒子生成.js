setCurDir(getSrcDir());

var msh1 = imesh.importGid("zeiyugou.msh");

pargen.addBound(msh1);


pargen.setValue("OptiPosOption", 1);


///粒子半径2.0m
var parmsh = pargen.gen(2.0);
