//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//设置网格尺寸
var size = 0.1;

//创建多边形面
var feng = new Array();
feng[0] = [0,0,0,size ];
feng[1] = [10,0,0,size];
feng[2] = [10,6,0,size];
feng[3] = [7,6,0,size];
feng[4] = [3,3,0,size];
feng[5] = [0,3,0,size];
igeo.genPloygenS(feng,1);


//划分二维网格
imeshing.genMeshByGmsh(2);
