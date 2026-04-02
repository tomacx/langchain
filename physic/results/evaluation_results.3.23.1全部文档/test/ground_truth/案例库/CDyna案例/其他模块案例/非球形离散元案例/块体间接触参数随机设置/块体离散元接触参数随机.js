//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//导入genvi格式的多边形数据
pdyna.ImportPartGenvi("brick2d.gvx");

pdyna.RandomizePartMat("density", "uniform", 1900, 2400, 1,11);

pdyna.RandomizePartMat("young", "normal", 3e9, 3e8, 1,11);

pdyna.RandomizePartMat("poisson", "normal", 0.3, 0.05, 1,11);

pdyna.RandomizePartMat("cohesion", "weibull", 1.4, 1e6, 1,11);

pdyna.RandomizePartMat("tension", "weibull", 0.9, 1e6, 1,11);

pdyna.RandomizePartMat("friction", "uniform", 10,30, 1,11);

pdyna.RandomizePartMat("localdamp", "uniform",0.1, 0.2, 1,11);

pdyna.RandomizePartMat("viscdamp", "uniform",0.1, 0.2, 1,11);

pdyna.RandomizePartMat("localdamprota", "uniform",0.05, 0.1, 1,11);

pdyna.ExportPartInfo("pdyna_part_info");

print("颗粒part信息输出完毕!");
