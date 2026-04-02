setCurDir(getSrcDir());

imeshing.genBrick2D("砂岩", 1,1,5,5);

var esel = new SelElems(imeshing);

var n = esel.box(-5,-0.3,-1, 5, 0.3, 1);

print(n)

imeshing.copy(5,0,0, 1, esel);
