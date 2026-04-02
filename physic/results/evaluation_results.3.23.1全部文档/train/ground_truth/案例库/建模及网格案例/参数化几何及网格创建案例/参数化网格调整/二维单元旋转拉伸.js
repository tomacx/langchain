// 设置当前目录
setCurDir(getSrcDir());

//产生二维砖块网格
imeshing.genBrick2D("fc",5,5,10,10);

//旋转拉伸
imeshing.rotaExtrude( -1, 0, 0, -1, 1,0,180, 20 );

print("Finished");
