// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

// 导入网格文件
blkdyn.GetMesh(imeshing);

// 设置材料参数
blkdyn.SetMat(2500, 3e8, 0.25, 3e3, 3e3, 15, 10);

// 固定边界条件
blkdyn.FixV("x", 0, "x", -0.01, 0.001);
blkdyn.FixV("x", 0, "x", 9.99, 10.01);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 创建锚索
var fArrayCoord1 = [4, 3.75, 0];
var fArrayCoord2 = [1, -0.694444444, 0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3, 20);

fArrayCoord1 = [5, 4.5, 0];
fArrayCoord2 = [1, -0.694444444, 0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3, 20);

fArrayCoord1 = [6, 5.25, 0];
fArrayCoord2 = [1, -0.694444444, 0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3, 20);

// 设置锚索力学模型
bar.SetModelByID("failure", 1, 100);

// 定义两种锚索材料
var BarProp1 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];
var BarProp2 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];

// 指定自由段的锚索材料
bar.SetPropByID(BarProp2, 1, 10, 1, 15);

// 指定锚固段的锚索材料
bar.SetPropByID(BarProp1, 1, 10, 16, 20);

// 施加预应力
bar.ApplyPreTenForce(1e4, 1, 11, 1, 1);

// 打开杆件计算开关
dyna.Set("If_Cal_Bar", 1);

// 设置时间步长和输出间隔
dyna.Set("Time_Step", 2e-4);
dyna.Set("Output_Interval", 500);

// 开始计算
dyna.Calc();
