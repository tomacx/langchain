//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

//创建面
var id1 = igeo.genBall(0,0,0,1.0,0.1,1);
var id2 = igeo.genBall(0,0,0,0.8,0.1,2);

//创建体
var loop  = [id1, id2];
igeo.genVolume(loop,3);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(3);
