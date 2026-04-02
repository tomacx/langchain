setCurDir(getSrcDir());

imeshing.genBrick3D("砂岩", 1,1,1, 5,5,5);

var esel = new SelElemFaces(imeshing);

esel.box(-10, -0.1, -10, 10, 0.01, 10);

imeshing.extract(esel);
