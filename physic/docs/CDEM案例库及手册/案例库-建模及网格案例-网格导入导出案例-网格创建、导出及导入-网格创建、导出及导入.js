//设置当前路径为JS脚本所在路径
setCurDir(getSrcDir());

//产生几何
igeo.genBallV(0,0,0,1,0.2,1);

//剖分网格
imeshing.genMeshByGmsh(3);

//网格导出
imesh.exportGenvi(imeshing, "Genvi.gvx");

//网格导入
imesh.importGenvi("Genvi.gvx");