setCurDir(getSrcDir());

// 导入几何模型文件
var msh1 = imesh.importGid("boundary.msh");

// 添加边界条件
pargen.addBound(msh1);

// 设置优化位置选项
pargen.setValue("OptiPosOption", 1);

// 生成半径为2.0m的粒子
var parmsh = pargen.gen(2.0);
