setCurDir(getSrcDir());

// 导入几何模型文件
var msh1 = imesh.importGid("example_model.msh");

// 添加边界到粒子生成器中
pargen.addBound(msh1);

// 设置优化位置选项
pargen.setValue("OptiPosOption", 1);

// 对几何边界区域填充半径为2.0m的粒子
var parmsh = pargen.gen(2.0);
