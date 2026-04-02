setCurDir(getSrcDir());

// 清除之前的几何、网格和计算数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

var thick = 0.2;
var height = 1.0;
var fsize = 0.04;
var gap = 0.5;
var radin   = 0.0;
var radout = 0.03;
var radsize = 0.01;

// 创建几何模型
igeo.genBrickV(0,0,0, thick,height ,thick, fsize, 1);
igeo.genBrickV(gap,0,0, thick + gap,height ,thick, fsize, 1);

for(var i = 0; i < 6; i++)
{
    var fh = i * 0.15 + 0.15;
    igeo.genCylinderV(thick, fh, thick * 0.5, gap, fh, thick * 0.5, radin, radout, radsize, radsize, 2);

    igeo.glue("volume",i + 3, 1);
    igeo.glue("volume",i + 3, 2);
}

// 网格划分
imeshing.genMeshByGmsh(3);

// 设置计算参数
dyna.Set("Gravity 0 0 0 ");
dyna.Set("Output_Interval 1000");

// 包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");
dyna.Set("Heat_Cal 1");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("linear");
blkdyn.SetMat(7800,2.1e11,0.25,500e6, 500e6, 0,0);

// 设置热传导材料参数
heatcd.SetPropByGroup (7800.0, 20.0, 3.125, 1000, 3e-5, 1);
heatcd.SetPropByGroup (7800.0, 20.0, 3.125, 1000, 3e-5, 2);

// 应用温度条件
var fArrayGrad = new Array(0.0, 0.0, 0.0);
heatcd.ApplyConditionByCoord("temp", 40.0, [0,0,0], -100, 100, -100, 100, -100, 100, false);

// 固定边界条件
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("xyz", 0.0, "y", height - 1e-3, height + 1e-3);

// 开始计算
dyna.Solve(10000);

print("Solution Finished");
