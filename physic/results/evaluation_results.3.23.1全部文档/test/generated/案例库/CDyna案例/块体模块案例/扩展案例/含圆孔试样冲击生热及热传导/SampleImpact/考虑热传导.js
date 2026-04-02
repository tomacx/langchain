setCurDir(getSrcDir());

// 清除之前的计算结果和网格信息
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

var thick = 1.0;
var height = 0.1;
var fsize = 0.04;

// 生成一个长方体几何模型
igeo.genBrickV(0, 0, 0, thick, height, height, fsize, 1);

// 使用Gmsh进行网格划分
imeshing.genMeshByGmsh(3);

// 设置重力加速度为零，输出间隔为1000步
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 1000");

// 包含热传导计算模块并打开开关
dyna.Set("Config_Heat 1");
dyna.Set("Heat_Cal 1");

// 获取网格信息
blkdyn.GetMesh(imeshing);

// 设置模型类型为线弹性，材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(7800, 2.1e11, 0.25, 500e6, 500e6, 0, 0);

// 设置热传导材料参数：密度、初始温度、热导率、比热容、体膨胀系数
heatcd.SetPropByGroup(7800.0, 20.0, 3.125, 1000, 3e-5, 1);
heatcd.SetPropByGroup(7800.0, 20.0, 3.125, 1000, 3e-5, 2);

// 应用温度边界条件，设置整个模型的初始温度为40度
heatcd.ApplyConditionByCoord("temp", 40.0, [0, 0, 0], -100, 100, -100, 100, -100, 100, false);

// 固定模型在x方向的两端
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", thick - 1e-3, thick + 1e-3);

// 开始计算，共5000步
dyna.Solve(5000);

print("**************************************");
print("水平方向应力，SXX，理论解为    " + (1e-5 * 20 * 2.1e11));
print("**************************************");
