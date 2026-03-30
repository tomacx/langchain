setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

var thick = 1.0;
var height = 0.1;
var fsize = 0.04;
igeo.genBrickV(0,0,0, thick,height ,height, fsize, 1);


imeshing.genMeshByGmsh(3);

dyna.Set("Gravity 0 0 0 ");
dyna.Set("Output_Interval 1000");

//包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

//打开热传导计算开关
dyna.Set("Heat_Cal 1");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("linear");
blkdyn.SetMat(7800,2.1e11,0.25,500e6, 500e6, 0,0);

//设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (7800.0, 20.0, 3.125, 1000, 3e-5, 1);
heatcd.SetPropByGroup (7800.0, 20.0, 3.125, 1000, 3e-5, 2);

heatcd.ApplyConditionByCoord("temp", 40.0, [0,0,0], -100, 100, -100, 100, -100, 100, false);

blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", thick - 1e-3, thick + 1e-3);

dyna.Solve(5000);

print("**************************************");
print("水平方向应力，SXX，理论解为    "   + (1e-5 * 20 * 2.1e11));
print("**************************************");
