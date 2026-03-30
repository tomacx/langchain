setCurDir(getSrcDir());

// 初始化环境：关闭力学计算（纯热传导）或开启塑性模型
dyna.Set("Mechanic_Cal 1");
dyna.Set("Config_Heat 1");
dyna.Set("Heat_Cal 1");
dyna.Set("Output_Interval 500");

// 导入网格模型文件
blkdyn.ImportGrid("GiD", "heatfrac.msh");

// 设置热传导材料参数：密度、初始温度、热导率、比热容、体膨胀系数
heatcd.SetPropByGroup(2700.0, 20.0, 3.125, 1000, 1e-3, 1);

// 配置块体塑性模型和节理断裂模型
blkdyn.SetModel("linear");
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e9, 1e9, 20.0, 0, 0);

// 定义梯度（用于温度边界条件）
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设置初始温度场（可根据需要调整坐标范围）
heatcd.SetNodeValue(2700.0, 1);

// 定义接触面热传递属性
blkdyn.CrtIFaceByCoord(-1e5, 1e5, 0.099, 0.101, -1e5, 1e5);
blkdyn.UpdateIFaceMesh();

// 初始化接触面热传递计算
heatcd.CalContactHeatTransfer();

// 设置计算步长（单位：秒）
dyna.Set("Time_Step 500");

// 执行求解循环
var totalSteps = 10000;
var unbalThreshold = 0.01; // 温度不平衡阈值
var displLimit = 1e-3;     // 位移上限（安全系数计算用）
var coord = new Array(10.0, 10.0, 0.0);

// 核心求解循环
for (var i = 0; i < totalSteps; i++) {
    // 调用热传导核心求解器
    var unbal = heatcd.Solver();

    // 计算节点温度稳定性
    var nodeTempUnbal = heatcd.CalNodeTemperature();

    // 计算单元热流速
    heatcd.CalElemHeatTransfer();

    // 监测迭代过程（每100步输出一次）
    if (i % 100 == 0) {
        var str = "Iter=" + i + " UnBal=" + nodeTempUnbal;
        print(str);
        dyna.PutStep();
    }

    // 判断收敛性：温度不平衡值或位移超过阈值则终止
    if (nodeTempUnbal < unbalThreshold) {
        print("Converged: Temperature stability achieved");
        break;
    }
}

// 计算安全系数（基于位移判据）
var fos = dyna.SolveFosByCriDisp(6000, displLimit, coord, "static.sav");
print("Safety Factor (FoS): " + fos);

// 输出最终结果到文件
dyna.SaveResult("heatfrac_result.dat");

// 打印完成信息
print("Solution Finished");
