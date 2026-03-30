setCurDir(getSrcDir());

// 清除环境数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关（压水灌浆主要关注渗流）
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度（重力向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 计算时步（ms）
dyna.Set("Time_Step 0.001");

// 瞬态可压缩液体渗流模式
dyna.Set("Seepage_Mode 1");

// 宾汉流模型（适用于灌浆液）
dyna.Set("Liquid_Seepage_Law 2");

// 截止开度，达到该值流体停止进入（m）
dyna.Set("PS_CirInject_Width 1e-6");

// 设置整体模型的最小孔隙开度（m）
dyna.Set("Pore_Min_Width 1.4e-4");

// 创建二维网格（模拟岩石块体）
blkdyn.GenBrick2D(20, 0.5, 10, 1, 1);

// 定义X、Y、Z三个方向的渗透系数（m/s）
var arrayK1 = new Array(1.66667e-7, 1.66667e-7, 1.66667e-7);

// 指定坐标控制范围内的孔隙渗流参数：流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK1, 1.0, 1);

// 单独指定剪切强度（Pa）
poresp.SetSinglePropByGroup("Strength", 11.75, 1);

// 定义梯度（压力梯度）
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设定模型四周的水压力边界条件（Pa）
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);

// 初始化裂缝宽度参数
var totalElem = Math.round(dyna.GetValue("Total_FS_ElemNum"));

// 创建Aperture.txt文件用于记录裂缝宽度演化
var fso = new ActiveXObject("Scripting.FileSystemObject");
var filew = fso.CreateTextFile("Aperture.txt", true);

filew.WriteLine("Element_ID,Initial_Width(m)");

for(var i = 1; i <= totalElem; i++)
{
   var fcwidth = fracsp.GetElemValue(i, "CWidthIni");
   filew.WriteLine(i + "," + fcwidth);
}

filew.Close();

print("Aperture.txt created successfully.");

// 执行求解（50000步）
dyna.Solve(50000);

// 导出块体动力学网格为Flac3D格式
blkdyn.ExportGrid(2, "mesh.flac3d");

// 导出裂隙渗流网格文件
fracsp.ExportGrid(1, "fracture_grid.dat");

print("Solution Finished");
print("Export completed.");
