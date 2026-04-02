setCurDir(getSrcDir());

// 清除当前环境设置
gflow.clear();

// 设置网格参数并导入地形数据文件
gflow.setValue("LastTime", 1500.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 200);
gflow.setValue("ParaNum", 32);
gflow.importGrid("data.txt");

// 设置多边形滑体
var afCoord = new Array(5);
afCoord[0] = [8.86251e+06, 2.9273e+06];
afCoord[1] = [8.86259e+06, 2.9276e+06];
afCoord[2] = [8.86272e+06, 2.92745e+06];
afCoord[3] = [8.86263e+06, 2.9271e+06];
gflow.setSlidingBodyByPolygon(afCoord, 10, 0);

// 增加椭球体滑床
gflow.setTerrainByEllipsoid(8.86259e+06, 2.9276e+06, 100, 100, 100, 0, 0);

// 设定监测点以记录时程信息
gflow.hist("Thickness", 8.86251e+06, 2.9273e+06);
gflow.hist("Thickness", 8.86272e+06, 2.92745e+06);

// 执行求解
gflow.exportGrid();
gflow.solve();

// 打印提示信息
print("Solution is OK!");
