setCurDir(getSrcDir());


rdface.Import("gid","GidGrp.msh");

//////根据几何自动创建Part
var nTotal = rdface.CrtPartAuto("geo");

print(nTotal)

