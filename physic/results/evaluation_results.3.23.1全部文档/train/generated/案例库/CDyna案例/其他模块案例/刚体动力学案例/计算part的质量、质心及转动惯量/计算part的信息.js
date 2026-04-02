setCurDir(getSrcDir());

// 导入网格文件
imesh.importAnsys("bound.dat");

// 计算part信息
var aa = gFun.calArbi3DModelInfo(cMesh[2], 1500, 100, 1, 1);

print(aa);
