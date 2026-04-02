setCurDir(getSrcDir());

// 导入几何边界文件
var msh1 = imesh.importStl("boundary1.stl");
var msh2 = imesh.importStl("boundary2.stl");

// 添加边界到pargen模块
pargen.addBound(msh1, msh2);

// 设置优化位置选项
pargen.setValue("OptiPosOption", 1);

// 填充半径为0.5m的粒子
var parmsh = pargen.gen(0.5);
