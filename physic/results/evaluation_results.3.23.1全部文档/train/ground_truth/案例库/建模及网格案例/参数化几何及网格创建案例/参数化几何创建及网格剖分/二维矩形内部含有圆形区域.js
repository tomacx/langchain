setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

var length = 100.0;
var height = 80.0;
var frad    = 8.0;

var tunnel_h = 50.0;

var fsize1 = 5.0;
var fsize2 = 0.5;

//外侧 line loop
var loop1 = igeo.genRect(0,0,0,length,height,0,fsize1);

//隧道的line loop
var loop2 = igeo.genCircle(length * 0.5, tunnel_h, 0.0, frad, fsize2);

//矩形局域
igeo.genSurface([loop1, loop2], 1);

//内部圆形
igeo.genSurface([loop2], 2);

imeshing.genMeshByGmsh(2);
