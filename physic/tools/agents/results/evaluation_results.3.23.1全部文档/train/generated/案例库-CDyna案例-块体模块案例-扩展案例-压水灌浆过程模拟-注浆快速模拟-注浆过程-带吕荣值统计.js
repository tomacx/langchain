setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置结果输出时步
dyna.Set("Output_Interval 10000000");

dyna.Set("Liquid_Seepage_Law 2");

dyna.Set("Seepage_Mode 4");

dyna.Set("Monitor_Iter 100");

dyna.Set("FS_CirInject_Width 1e-5");

// 创建岩石颗粒体系
var xMin = -10.0;
var xMax = 10.0;
var yMin = -10.0;
var yMax = 10.0;
var zMin = 0.0;
var zMax = 20.0;

var particleCount = 5000;
var particleSize = 0.05;

// 使用CreateByCoord生成颗粒体系
igeo.GeneratePoint([xMin, yMin, zMin]);
igeo.GeneratePoint([xMax, yMax, zMax]);

// 设置材料参数：密度、杨氏模量、泊松比、抗拉强度、粘聚力、摩擦系数
fracsp.SetPropByGroup(1810.0, 1e6, 3.33333e-6, 2e-4, 1, 11);

// 设置裂隙宽度随机化参数
fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 1, 2, 2);
fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 2, 2, 2);
fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 3, 2, 2);
fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 4, 2, 2);

// 设置注浆孔属性：ID=1，计算开关=1，类型=1(液体)，长度=10m，直径=0.2m
fracsp.SetJetBoreHoleProp(1, 1, 1, 10.0, 0.2, 0.0, 0.0, 5e-3);

// 准备吕荣值统计参数：孔径=0.1m，高程下限=2.5m，高程上限=7.5m，开度比=5.0，组号=10
fracsp.SetLvRongProp(0.1, 2.5, 7.5, 5.0, 10, 10);

// 设置注浆液流量边界条件（优化流量和极限流量）
var fQOpti = 20.0 * 1e-3 / 60.0; // m³/s
var fQLimt = 30.0 * 1e-3 / 60.0; // m³/s

// 设置压力边界条件（注入压力）
var injectPressure = 2e6; // Pa
fracsp.ApplyConditionByCoord("pp", injectPressure, [0, 0, 0], xMin - 0.1, xMax + 0.1, yMin - 0.1, yMax + 0.1, zMin - 0.1, zMax + 0.1, true);

// 设置外部压力边界条件
var ambientPressure = 1e5; // Pa
fracsp.ApplyConditionByCoord("pp", ambientPressure, [0, 0, 0], xMin - 2.0, xMax + 2.0, yMin - 2.0, yMax + 2.0, zMin - 2.0, zMax + 2.0, true);

// 初始化节点饱和度和压力信息
fracsp.SetNodeValue(1.0, "Saturation", 1, 11); // 饱和度初始化为1
fracsp.SetNodeValue(0.0, "Pressure", 1, 11);   // 压力初始化为0

// 获取注浆孔节点位置用于监测
var nodeid = fracsp.GetNodeID(xMin + 0.1, yMin + 0.1, zMin + 5.0);
var fx = fracsp.GetNodeValue(nodeid, "Coord", 1);
var fy = fracsp.GetNodeValue(nodeid, "Coord", 2);
var fz = fracsp.GetNodeValue(nodeid, "Coord", 3);

// 设置监测点位置
dyna.Set("Monitor_Pos " + fx + " " + fy + " " + fz);

// 启动时间步长循环进行耦合计算
var totalTime = 10.0; // 总时间10秒
var timeStep = 0.001; // 时间步长1ms
var totalSteps = Math.floor(totalTime / timeStep);

for (var step = 0; step < totalSteps; step++) {
    // 执行求解器迭代
    dyna.Solver();

    // 每100步输出一次结果
    if ((step + 1) % 100 === 0) {
        // 输出当前时步结果
        dyna.PutStep();

        // 监测吕荣值、水力导度及裂隙密度变化
        var lvRong = fracsp.GetNodeValue(nodeid, "UserDefNodeValue", 1);
        var hydraulicConductivity = fracsp.GetNodeValue(nodeid, "UserDefNodeValue", 2);
        var fissureDensity = fracsp.GetNodeValue(nodeid, "UserDefNodeValue", 5);

        // 打印监测信息
        print("Step: " + (step + 1) + ", LvRong: " + lvRong.toFixed(4) +
              ", Hydraulic Conductivity: " + hydraulicConductivity.toFixed(6) +
              ", Fissure Density: " + fissureDensity.toFixed(4));
    }
}

// 导出最终结果文件
dyna.OutputModelResult();

// 保存包含统计指标的sav重启动文件
fracsp.SaveRestart("restart.sav");

print("Solution Finished");
