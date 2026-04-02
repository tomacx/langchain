setCurDir(getSrcDir());

// 导入多个 STL 文件作为边界几何形状
var msh1 = imesh.importStl("boundary1.stl");
var msh2 = imesh.importStl("boundary2.stl");
var msh3 = imesh.importStl("boundary3.stl");

// 将导入的网格添加到 pargen 的边界中
pargen.addBound(msh1, msh2, msh3);

// 设置优化位置选项，以提高粒子填充质量
pargen.setValue("OptiPosOption", 1);

// 填充半径为0.5m的球形粒子
var parmsh = pargen.gen(0.5);
