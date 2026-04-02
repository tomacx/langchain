setCurDir(getSrcDir());

// 导入网格文件
var omsh1 = imesh.importAnsys("ansys.dat");
var omsh2 = imesh.importGid("gid.msh");

// 合并网格
var mergedMesh = imesh.merge([omsh1, omsh2]);

// 创建新的几何模型以容纳合并后的网格
igeo.genBoxV(0, 0, 0, 10, 10, 10);

// 将合并的网格应用到新创建的几何模型上
imeshing.setMesh(mergedMesh);

// 导出合并后的网格文件
imesh.exportGenvi(mergedMesh, "merged.gvx");

// 清理内存中的网格数据
imesh.clear();
