setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ==================== 1. 几何网格创建 ====================
// 定义圆孔试样尺寸
var specimenRadius = 0.1;      // 试样半径 (m)
var specimenHeight = 0.2;      // 试样高度 (m)
var holeRadius = 0.05;         // 圆孔半径 (m)

// 创建圆柱体试样（含中心圆孔）
igeo.genCylinder("specimen", 0, 0, 0, specimenRadius, specimenHeight);

// 创建冲击体（圆柱形）
var impactorRadius = 0.1;      // 冲击体半径 (m)
var impactorHeight = 0.05;     // 冲击体高度 (m)
igeo.genCylinder("impactor", 0, specimenHeight + impactorHeight/2, 0, impactorRadius, impactorHeight);

// 生成网格
imeshing.genMeshByGmsh(3);
blkdyn.GetMesh(imeshing);

// ==================== 2. 材料属性设置 ====================
// 试样材料参数（岩石类）
var matSpecimen = 1;
blkdyn.SetMat(2700, 3e9, 0.25, 5e6, 5e6, 0, 0); // 密度、弹性模量、泊松比、屈服强度、断裂能

// 冲击体材料参数（金属类）
var matImpactor = 2;
blkdyn.SetMat(7800, 2.1e11, 0.3, 500e6, 500e6, 0, 0); // 密度、弹性模量、泊松比、屈服强度、断裂能

// ==================== 3. 热传导配置参数设置 ====================
// 包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

// 打开热传导计算开关
dyna.Set("Heat_Cal 1");

// 设置接触传热开关为1，开启接触面热量传递
dyna.Set("If_Contact_Transf_Heat 1");

// 设置热传导系数放大因子（默认10.0）
dyna.Set("Heat_Conduct_Factor 10.0");

// ==================== 4. 热传导材料参数设置 ====================
// 试样热传导参数：密度、初始温度、导热系数、比热容、体膨胀系数
heatcd.SetPropByGroup(2700.0, 20.0, 3.125, 1000, 3e-5, matSpecimen);

// 冲击体热传导参数
heatcd.SetPropByGroup(7800.0, 20.0, 45.0, 500, 1e-5, matImpactor);

// ==================== 5. 边界条件设置 ====================
// 固定试样底部
blkdyn.FixV("xyz", 0.0, "z", -specimenHeight + 1e-3, specimenHeight - 1e-3);

// 冲击体初始速度（沿Z轴向下冲击）
var impactVelocity = 50.0; // m/s
blkdyn.SetVel("impactor", 0.0, 0.0, -impactVelocity);

// ==================== 6. 接触对设置 ====================
// 创建试样与冲击体之间的接触面
blkdyn.CrtIFaceByCoord(-1e5, 1e5, 0.099, 0.101, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();

// ==================== 7. 求解器设置 ====================
// 设置输出间隔
dyna.Set("Output_Interval 100");

// 设置监测信息提取间隔
dyna.Set("Moniter_Iter 10");

// 设置计算步长（根据冲击速度调整）
dyna.Set("Time_Step 50");

// ==================== 8. 创建温度监测点 ====================
// 圆孔中心区域监测点
heatcd.InitConditionByCoord("temp", 20.0, [0, 0, specimenHeight/2], -holeRadius, holeRadius, -1e-3, 1e-3);

// 圆孔边缘区域监测点（半径方向）
heatcd.InitConditionByCoord("temp", 20.0, [specimenRadius - holeRadius - 0.01, 0, specimenHeight/2], -0.01, 0.01, -1e-3, 1e-3);

// ==================== 9. 求解过程 ====================
dyna.BeforeCal();

for(var i = 0; i < 5000; i++) {
    var fUnBal = heatcd.CalNodeTemperature();
    heatcd.CalElemHeatTransfer();

    if(i % 100 == 0) {
        var str = "Iter = " + i + " UnBal = " + fUnBal;
        print(str);
        dyna.PutStep();
    }
}

// ==================== 10. 求解完成提示 ====================
print("Solution Finished");
print("热传导冲击生热分析完成，温度场分布已输出");
