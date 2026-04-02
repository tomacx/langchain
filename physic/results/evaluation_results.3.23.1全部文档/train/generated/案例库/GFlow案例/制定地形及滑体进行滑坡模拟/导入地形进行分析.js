setCurDir(getSrcDir());

gflow.clear();
gflow.setValue("LastTime", 1500.0);
gflow.setValue("CourantCoeff", 0.2);
gflow.setValue("OutputInterval", 200);
gflow.setValue("ParaNum", 32);
gflow.importGrid("data.txt");
gflow.setMat(20, 0.0, 0.0);

// 定义滑体为椭球形
gflow.setSlidingBodyByEllipsoid(8.86259e+06, 2.9276e+06, 100, 100, 100, 0, 0);

// 添加监测点以记录时程信息
gflow.hist("Thickness", 8.86251e+06, 2.9273e+06);
gflow.hist("Thickness", 8.86272e+06, 2.92745e+06);

// 导出网格文件以便进一步分析
gflow.exportGrid();

// 求解滑坡模拟若干步
gflow.solve();

// 打印提示信息确认解决方案完成
print("Solution is OK!");
