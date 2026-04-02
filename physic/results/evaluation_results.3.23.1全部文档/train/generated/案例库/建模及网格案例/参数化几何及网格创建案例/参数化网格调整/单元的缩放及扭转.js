// 设置当前目录为脚本文件所在目录
setCurDir(getSrcDir());

// 清除几何信息和网格信息
igeo.clear();
imeshing.clear();

// 生成一个二维圆形网格
igeo.genCircleS(0, 0, 0, 1e-3, 0.2e-3, 1);

// 使用Gmsh进行网格划分
imeshing.genMeshByGmsh(2);

// 创建拉伸路径的坐标数组
var afCoord = new Array();

var frad = 0.002;
var quanshu = 4.0;
var luojuDist = 0.005;

var deltdeg = 10.0;
var deltdist = luojuDist / 360.0 * deltdeg;
var totalseg = quanshu * 360.0 / deltdeg;

for (var i = 0; i <= totalseg; i++) {
    var hudu = i * deltdeg / 180.0 * Math.PI;
    var xcoord = frad * Math.cos(hudu) - frad;
    var ycoord = frad * Math.sin(hudu);
    var zcoord = i * deltdist;
    afCoord[i] = [xcoord, ycoord, zcoord];
}

// 执行高级拉伸操作
imeshing.advExtrude(afCoord, 0.05, 1, 1);

print("Finished");
