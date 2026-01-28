//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//创建点
var size = 0.1
var ip1 = igeo.genPoint(0,0,0,size);
var ip2 = igeo.genPoint(1,0,0,size);
var ip3 = igeo.genPoint(0.5,1,0,size);
var ip4 = igeo.genPoint(0.5,0.5,1,size);

//创建线
var il1 = igeo.genLine(ip1, ip2);
var il2 = igeo.genLine(ip2, ip3);
var il3 = igeo.genLine(ip3, ip1);
var il4 = igeo.genLine(ip1, ip4); 
var il5 = igeo.genLine(ip2, ip4);
var il6 = igeo.genLine(ip3, ip4);

//创建线环
var temp = [il1, il2, il3];
var llop1 = igeo.genLineLoop(temp);
var temp = [il1, il4, il5];
var llop2 = igeo.genLineLoop(temp);
var temp = [il2, il5, il6];
var llop3 = igeo.genLineLoop(temp);
var temp = [il3, il6, il4];
var llop4 = igeo.genLineLoop(temp);

//创建面
var temp = [llop1];
var surf1 = igeo.genSurface(temp,1);

var temp = [llop2];
var surf2 = igeo.genSurface(temp,1);

var temp = [llop3];
var surf3 = igeo.genSurface(temp,1);

var temp = [llop4];
var surf4 = igeo.genSurface(temp,1);

//创建面环
var temp = [surf1, surf2, surf3, surf4]
var surloop = igeo.genSurfaceLoop(temp);

//创建体
var temp = [surloop]
var ivol = igeo.genVolume(temp,1);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(3);

