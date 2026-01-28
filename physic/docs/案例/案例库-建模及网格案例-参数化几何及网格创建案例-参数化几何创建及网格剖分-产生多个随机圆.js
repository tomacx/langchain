//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

//创建满足随机分布的圆
var x = [0,100];
var y = [0, 100];
var z = [0, 100];
var frad = [5.0, 10.0];
var fdipd = [0, 360];
var fdipa = [0,90];
igeo.genRandomCircleS(200,x, y,z, "uniform", frad, "uniform", fdipd, "uniform", fdipa, 2, 1);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);