setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 创建几何模型
var pid = igeo.genPoint(5, 5, 0, 0.2);
var sid = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);
igeo.setHardPointToFace(pid, sid);

// 生成网格
imeshing.genMeshByGmsh(2);

// 导入网格模型
blkdyn.ImportGrid("Gmsh", "FracSeepageModel.msh");

// 定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-8, 1e-8, 1e-8);

// 通过组初始化压力及饱和度条件（密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数）
fracsp.SetPropByGroup(1000.0, 1e6, 0.5, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

// 通过坐标施加动态边界条件（压力源）
var aValue = new Array();
aValue[0] = [0, 0];
aValue[1] = [50, 1e4];
aValue[2] = [100, 3e4];
aValue[3] = [150, 5e4];
aValue[4] = [200, 4e4];
aValue[5] = [300, 3e4];

fracsp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1, 1);

// 通过平面施加动态边界条件
fracsp.ApplyConditionByPlane("pp", aValue, fArrayGrad, 0, 0, 1, 0.1);

// 通过圆柱体施加动态边界条件
fracsp.ApplyDynaConditionByCylinder("pp", aValue, fArrayGrad, 0.5, 0.5, -1, 0.5, 0.5, 1, 0.19, 0.21);

// 设置监测节点
dyna.Monitor("fracsp", "sc_magvel", 5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// 获取裂隙渗流节点信息（压力、饱和度）
var nodePressure = fracsp.GetFracSeepageNodeValue(5, 5, 0);
var nodeSaturation = fracsp.GetFracSeepageNodeValue(5, 5, 1);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step 0.005");

// 执行时间步循环更新动态边界条件参数值
for (var i = 0; i < 100000; i++) {
    // 更新不同阶段的动态边界条件参数值
    if (i % 10000 === 0) {
        fracsp.ApplyDynaConditionByCoord("pp", aValue, fArrayGrad,
            4.99 + i * 0.0001, 5.01 - i * 0.0001,
            4.99 + i * 0.0001, 5.01 - i * 0.0001,
            -1, 1);
    }
}

// 计算渗流动态边界
API_PoreSeepageCalDynaBound();

// 计算节点压力及饱和度
var pressureResult = fracsp.CalNodePressure();

// 求解
dyna.Solve(100000);

// 获取裂隙渗流单元信息
var elemValue = fracsp.GetFracSeepageElemValue();

// 导出计算结果（通过RunUDFCmd实现）
dyna.RunUDFCmd("ExportResult FracSeepage");

// 打印提示信息
print("Solution Finished");

// 卸载已加载的库
dyna.FreeUDF();
