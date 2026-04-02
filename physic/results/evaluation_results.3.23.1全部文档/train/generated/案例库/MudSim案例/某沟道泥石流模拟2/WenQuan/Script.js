setCurDir(getSrcDir());

mflow.importGrid("GdemGrid", "grid.dat");

var rainfall = 56 * 1e-3 / 3600;

mflow.setRainData([0.0, rainfall, 1e6, rainfall]);

mflow.setParData([0.00020, 0.30, 0.00334, 0.3, 0.0131, 0.40]);

mflow.setValue("Output_Interval", 2000.0);
mflow.setValue("cohesion", 800);
mflow.setValue("friction", 15);
mflow.setValue("MaxTimeStep", 10);

// 设置监测点
var histPoints = [
    { x: 401458, y: 4.48574e6 },
    { x: 401850, y: 4.48558e6 },
    { x: 401643, y: 4.48508e6 },
    { x: 401528, y: 4.48485e6 }
];

var histVariables = ["height", "magvel", "c", "dh"];

histPoints.forEach(point => {
    histVariables.forEach(variable => {
        mflow.hist(variable, point.x, point.y);
    });
});

mflow.solve(86400);

// 导出数据
mflow.exportTextData();
