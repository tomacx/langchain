setCurDir(getSrcDir());


igeo.genRectS(-1,-1, 0,1,1, 0, 0.3, 1);

imeshing.genMeshByGmsh(2);

var Sel1 = new SelElems(imeshing);
var n1 = Sel1.box(-0.8, -0.8, 0, 0.8, 0.8, 0);
imeshing.refine(Sel1);
sleep(1000);

var Sel1 = new SelElems(imeshing);
var n1 = Sel1.box(-0.6, -0.6, 0, 0.6, 0.6, 0);
imeshing.refine(Sel1);
sleep(1000);

var Sel1 = new SelElems(imeshing);
var n1 = Sel1.box(-0.4, -0.4, 0, 0.4, 0.4, 0);
imeshing.refine(Sel1);
sleep(1000);


var Sel1 = new SelElems(imeshing);
var n1 = Sel1.box(-0.2, -0.2, 0, 0.2, 0.2, 0);
imeshing.refine(Sel1);
sleep(1000);

var Sel1 = new SelElems(imeshing);
var n1 = Sel1.box(-0.1, -0.1, 0, 0.1, 0.1, 0);
imeshing.refine(Sel1);
sleep(1000);
