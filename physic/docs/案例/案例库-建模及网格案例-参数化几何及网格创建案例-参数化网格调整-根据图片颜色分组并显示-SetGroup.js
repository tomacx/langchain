setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();


imeshing.genBrick2D("horse",4,3,400,300);


imeshing.setGroupByImage(255, "horse.bmp");

blkdyn.GetMesh(imeshing);

dyna.Plot("Elem","Group");