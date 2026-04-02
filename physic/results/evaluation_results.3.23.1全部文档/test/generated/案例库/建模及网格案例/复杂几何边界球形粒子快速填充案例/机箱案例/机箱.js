setCurDir(getSrcDir());

// 导入STL文件作为几何边界
var msh1 = imesh.importStl("object1.stl");
var msh2 = imesh.importStl("object2.stl");

pargen.addBound(msh1, msh2);

// 设置优化位置选项
pargen.setValue("OptiPosOption", 1);

// 填充半径为0.5m的粒子
var parmsh = pargen.gen(0.5);
