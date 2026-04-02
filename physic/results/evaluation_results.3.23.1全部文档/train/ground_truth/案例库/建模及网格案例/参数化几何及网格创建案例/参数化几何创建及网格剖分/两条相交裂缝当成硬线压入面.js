setCurDir(getSrcDir());
igeo.clear();
imeshing.clear();

igeo.genLine(1,1,0, 2,2,0, 0.01, 0.02);
igeo.genLine(1,2,0, 2, 1, 0, 0.01, 0.02);

igeo.lineInt();

//相交操作后，原来的网格尺寸信息消失，重新赋值
igeo.setSize ("line", 0.02, 1, 4);

igeo.genRectS(0, 0, 0, 3, 3, 0, 0.2, 1);

igeo.setHardLineToFace(1, 1);
igeo.setHardLineToFace(2, 1);
igeo.setHardLineToFace(3, 1);
igeo.setHardLineToFace(4, 1);

imeshing.genMeshByGmsh(2);
