//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

//创建面
var id = igeo.genRectS(0,0,0,1,1,0,0.1,1);

//设置二维网格划分方式为Frontal
imeshing.setValue("MeshType2D", 6);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);
