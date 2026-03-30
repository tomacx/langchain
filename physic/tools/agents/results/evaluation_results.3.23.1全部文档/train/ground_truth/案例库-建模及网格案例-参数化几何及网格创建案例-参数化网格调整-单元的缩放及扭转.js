//设置工作目录为脚本文件所在目录
setCurDir(getSrcDir());

//清除几何信息
igeo.clear();

//清除网格信息
imeshing.clear();

//产生砖块网格
imeshing.genBrick2D("fg",2,10,20,200);


//进行缩放及扭转
imeshing.zoomAndTorsion(1,0,0,1,10,0,1,1,0,720);
