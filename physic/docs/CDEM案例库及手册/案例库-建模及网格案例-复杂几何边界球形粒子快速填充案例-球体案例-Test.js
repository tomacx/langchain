setCurDir(getSrcDir());

var msh1 = imesh.importGid("ball.msh");

pargen.addBound(msh1);

pargen.gen(0.1, -15.05,15.05,-15.05,15.05,-15.05,15.05, 1);