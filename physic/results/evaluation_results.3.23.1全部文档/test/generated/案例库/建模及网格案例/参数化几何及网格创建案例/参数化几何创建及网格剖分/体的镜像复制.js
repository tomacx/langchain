///设置工作目录为脚本文件所在目录
setCurDir(getSrcDir());

//清除几何信息和网格信息
igeo.clear();
imeshing.clear();

//创建矩形面
var id = igeo.genRectS(0, 0, 0, 1, 1, 0, 0.1, 1);

//设置二维网格划分方式为Frontal
imeshing.setValue("MeshType2D", 6);

//借助Gmsh进行网格剖分
imeshing.genMeshByGmsh(2);
