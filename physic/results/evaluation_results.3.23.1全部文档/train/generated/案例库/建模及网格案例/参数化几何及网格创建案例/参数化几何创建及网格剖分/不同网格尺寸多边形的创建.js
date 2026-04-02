// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 创建多边形边框
var afcoord = new Array();
afcoord[0] = [0.0, 0.0, 0.0, 0.01];
afcoord[1] = [1.0, 0.0, 0.0, 0.05];
afcoord[2] = [2.0, 2.0, 0.0, 0.1];
afcoord[3] = [2.0, 4.0, 0.0, 0.2];
afcoord[4] = [1.0, 3.0, 0.0, 0.4];
afcoord[5] = [0.0, 2.0, 0.0, 0.7];

var id = igeo.genPloygen(afcoord);

// 创建多边形面
var aid = [id];
var fid = igeo.genSurface(aid,1);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);

// 借助GDEM-BlockDyna调入网格，进行BlockDyna计算
blkdyn.ImportGrid("gmsh","GDEM.msh");
