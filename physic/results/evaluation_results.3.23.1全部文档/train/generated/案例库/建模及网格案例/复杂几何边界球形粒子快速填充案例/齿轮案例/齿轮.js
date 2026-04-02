setCurDir(getSrcDir());

// 导入几何模型文件
var msh1 = imesh.importStl("gear1.stl");
var msh2 = imesh.importStl("gear2.stl");
var msh3 = imesh.importStl("gear3.stl");

// 添加边界条件
pargen.addBound(msh1, msh2, msh3);

// 设置优化位置选项
pargen.setValue("OptiPosOption", 1);

// 半径是0.2mm的粒子填充
var parmsh = pargen.gen(0.0002);
