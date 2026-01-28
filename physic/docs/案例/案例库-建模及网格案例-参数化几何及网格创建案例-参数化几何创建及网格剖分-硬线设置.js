//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//创建矩形面
var fid = igeo.genRectS(0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.1, 1);

//产生2条线
var lid1 = igeo.genLine(0.2,0.2,0.0, 0.6, 0.4, 0.0, 0.005, 0.005);
var lid2 = igeo.genLine(0.5,0.6,0.0, 0.8, 0.8, 0.0, 0.005, 0.005);

//设置硬线
igeo.setHardLineToFace(lid1, fid);
igeo.setHardLineToFace(lid2, fid);

//划分二维网格
imeshing.genMeshByGmsh(2);
