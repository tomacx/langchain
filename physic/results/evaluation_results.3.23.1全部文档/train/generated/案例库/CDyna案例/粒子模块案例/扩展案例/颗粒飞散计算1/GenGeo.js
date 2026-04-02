setCurDir(getSrcDir());

var height = 2.0;
var length = 0.8;
var dout = 0.15;
var din  = 0.14;
var thick = dout - din;

var sizeout = 0.05;
var sizein  = 0.05;

// 创建几何模型
var sloop1 = geo.GenCylinder(-0.5 * length, height,0,0.5 * length, height,0, 0.0, dout, sizeout, sizeout, 1);
var sloop2 = geo.GenCylinder(-0.5 * length + thick, height,0,0.5 * length - thick, height,0, 0.0, din, sizein,sizein, 2);

var id1 = geo.GenVolume([sloop1, sloop2], 1);
var id2 = geo.GenVolume([sloop2], 2);

mesh.GenMeshByGmsh(3);

// 颗粒创建
var prad = 0.004;
var rowsum = Math.floor((length - 2.0 * thick) / (prad * 2.0));
var colsum = Math.floor(2.0 * Math.PI * (din + 0.5 * thick) / (prad * 2.0));

for(var i = 0; i < rowsum; i++) {
    var xcoord = -0.5 * length + thick + prad + i * 2.0 * prad;
    var igroup = i + 1;
    var qq = "" + igroup;
    imesh.genParCircle(3, qq, colsum, prad, din + 0.5 * thick, xcoord, height, 0, 1, 0, 0);
}

imesh.exportPDyna("Ball.dat");

// 导入网格
blkdyn.ImportGrid("gmsh", "GDEM.msh");

// 设置材料属性
blkdyn.SetMat(13000, 2e11, 0.3, 50e6, 50e6, 0, 0, 1);
blkdyn.SetMat(1700, 1e9, 0.3, 800e6, 800e6, 0, 0, 2);

// 设置炸药参数
var apos = [-0.5 * length, height, 0];
blkdyn.SetLandauSource(1, 1700, 7957, 7e6, 3.0, 1.3333, 26e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 2, 2);

// 设置模型
blkdyn.SetModel("SoftenMC", 1);
blkdyn.SetModel("Landau", 2);

pdyna.Import("pdyna","Ball.dat");
pdyna.SetModel("brittleMC");
pdyna.SetMat(17936, 4e11, 0.2, 0, 0, 30, 0.0, 0.0);

// 设置监测点
for(var i = 0; i <= 10; i++) {
    dyna.Monitor("block","yvel", -0.5 * length + i * 0.1 * length , height, 0);
}

// 起爆计算
blkdyn.SetLocalDamp(0.0);
dyna.Set("Time_Step 5e-8");
pdyna.SetModel("none");

dyna.Solve(10000);
dyna.Save("blast.sav");

// 飞行计算
pdyna.InheritInfoFromBlock();
pdyna.SetModel("brittleMC");
pdyna.SetMat(17936, 4e11, 0.2, 0, 0, 30, 0.0, 0.0);

dyna.Solve(5000);
dyna.Save("flight.sav");

// 导出结果
pdyna.exportPDyna("result.dat");
