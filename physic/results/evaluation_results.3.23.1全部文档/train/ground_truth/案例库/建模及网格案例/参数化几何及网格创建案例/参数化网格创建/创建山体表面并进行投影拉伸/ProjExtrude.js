//设置工作目录为脚本文件所在目录
setCurDir(getSrcDir());

//清除几何信息
igeo.clear();

//清除网格信息
imeshing.clear();

//基于点云数据产生表面网格
imeshing.genSurfMesh("fc","coord.txt",100,100,"tri");


//对imeshing模块中的所有单元执行投影拉伸操作
imeshing.projExtrude(0,0,0,0,0,1,10);
