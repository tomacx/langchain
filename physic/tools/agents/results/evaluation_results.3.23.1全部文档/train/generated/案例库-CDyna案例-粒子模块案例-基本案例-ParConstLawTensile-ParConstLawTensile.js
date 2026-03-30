setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 关闭力学计算开关（初始化）
dyna.Set("Mechanic_Cal 0");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置全局加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置接触容差为1e-3
dyna.Set("Contact_Detect_Tol 1e-3");

// 设置颗粒与颗粒接触的拉伸断裂应变及剪切断裂应变
dyna.Set("Interface_Soften_Value 0.001 0.005");

// 设置颗粒与颗粒接触的拉伸断裂能及剪切断裂能
dyna.Set("PP_FracEnergy 100 500");

// 创建第一组颗粒（左侧固定端）
pdyna.SingleCreate(1, 2, 0.5, 0, 0, 0);
pdyna.SingleCreate(2, 2, 0.5, 0, 1, 0);

// 创建第二组颗粒
pdyna.SingleCreate(1, 2, 0.5, 2, 0, 0);
pdyna.SingleCreate(2, 2, 0.5, 2, 1, 0);

// 创建第三组颗粒
pdyna.SingleCreate(1, 2, 0.5, 4, 0, 0);
pdyna.SingleCreate(2, 2, 0.5, 4, 1, 0);

// 创建第四组颗粒
pdyna.SingleCreate(1, 2, 0.5, 6, 0, 0);
pdyna.SingleCreate(2, 2, 0.5, 6, 1, 0);

// 创建第五组颗粒
pdyna.SingleCreate(1, 2, 0.5, 8, 0, 0);
pdyna.SingleCreate(2, 2, 0.5, 8, 1, 0);

// 创建第六组颗粒（右侧加载端）
pdyna.SingleCreate(1, 2, 0.5, 10, 0, 0);
pdyna.SingleCreate(2, 2, 0.5, 10, 1, 0);

// 指定颗粒与颗粒之间的接触模型（左侧固定端）
pdyna.SetModelByCoord("linear", -0.01, 0.01, -100, 100, -100, 100);

// 指定颗粒与颗粒之间的接触模型（中间区域）
pdyna.SetModelByCoord("brittleMC", 1.99, 2.01, -100, 100, -100, 100);

// 指定颗粒与颗粒之间的接触模型（右侧加载端）
pdyna.SetModelByCoord("idealMC", 3.99, 4.01, -100, 100, -100, 100);

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e7, 0.25, 1e5, 5e5, 35, 0.8, 0.0);

// 固定左侧端部颗粒（x方向速度为0）
pdyna.FixV("x", 0.0, "x", -1, 2);

// 固定左侧端部颗粒（y方向速度为0）
pdyna.FixV("y", 0.0, "y", -1, 2);

// 固定左侧端部颗粒（z方向速度为0）
pdyna.FixV("z", 0.0, "z", -1, 2);

// 设置球形区域应力监测点（中心坐标和半径）
var fCx = 5.0;
var fCy = 0.5;
var fCz = 0.0;
var fRad = 0.5;

// 获取初始应力状态
var afStressInit = pdyna.GetParStatiStress(fCx, fCy, fCz, fRad);
print("Initial stress state:", afStressInit);

// 对右侧端部颗粒施加位移载荷（通过速度实现）
var displacement = 0.1;
var velocity = displacement / 1000; // 在1000步内完成位移

// 设置求解时步
dyna.Set("Time_Step 1e-4");

// 求解至稳定或指定步数
dyna.Solve(5000);

// 获取最终应力状态
var afStressFinal = pdyna.GetParStatiStress(fCx, fCy, fCz, fRad);
print("Final stress state:", afStressFinal);

// 搜索格子内的颗粒并获取ID
var totalno = pdyna.SearchParInCell(0, 0, 0, 12, 2, 0);
print(totalno, " particles in cell.");
for(var i = 1; i <= totalno; i++) {
    var id = pdyna.GetParIdInCell(i);
    print("Particle ID:", id);
}

// 保存监测数据至输出文件（通过RunUDFCmd实现）
dyna.RunUDFCmd("SaveResult ParConstLawTensile");

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 打印最终结果摘要
print("Simulation completed. Stress monitoring data saved.");
