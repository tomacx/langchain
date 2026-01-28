setCurDir(getSrcDir());



///////////////////////////////////////////////////////几何及网格
var height = 2.0;
var length = 0.8;
var dout = 0.15;
var din  = 0.14;
var thick = dout - din;

var sizeout = 0.05;
var sizein  = 0.05;

var sloop1 = geo.GenCylinder(-0.5 * length, height,0,0.5 * length, height,0, 0.0, dout, sizeout, sizeout, 1);


var sloop2 = geo.GenCylinder(-0.5 * length + thick, height,0,0.5 * length - thick, height,0, 0.0, din, sizein,sizein, 2);

var id1 = geo.GenVolume([sloop1, sloop2], 1);

var id2 = geo.GenVolume([sloop2], 2);

mesh.GenMeshByGmsh(3);
///////////////////////////////////////////////////////////



//颗粒创建
//颗粒半径
var prad = 0.004;

//颗粒排数
var rowsum = Math.floor ( (length - 2.0 * thick) / (prad * 2.0) );

//每排颗粒数
var colsum = Math.floor ( 2.0 * Math.PI * (din + 0.5 * thick) / (prad * 2.0) );

for(var i = 0; i < rowsum; i++)
{
var xcoord = -0.5 * length + thick + prad + i * 2.0 * prad;

//mesh. GenParCircle(<iType, sGroup, TotalNo, BallRad, CircleRad, CenterX,CenterY, CenterZ, NormalX, NormalY, NormalZ >);
var igroup = i + 1;

var qq = "" + igroup;
imesh. genParCircle (3, qq, colsum, prad, din + 0.5 * thick, xcoord, height, 0, 1, 0, 0);
}

imesh.exportPDyna("Ball.dat");

