setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 设置输出间隔
dyna.Set("Output_Interval 500");

// 关闭力学计算，仅进行热传导分析
dyna.Set("Mechanic_Cal 0");

// 包含热传导计算模块
dyna.Set("Config_Heat 1");

// 开启热传导计算开关
dyna.Set("Heat_Cal 1");

// 创建几何模型：立方体
var thick = 1.0;
var height = 0.5;
igeo.genBrickV(0, 0, 0, thick, height, height, 1);

// 生成网格
imeshing.genMeshByGmsh(3);

// 获取网格到块体模块
blkdyn.GetMesh(imeshing);

// 设置力学模型类型
blkdyn.SetModel("linear");

// 设置力学材料参数：密度、弹性模量、泊松比、剪切模量、体积模量
blkdyn.SetMat(7800, 2.1e11, 0.25, 500e6, 500e6, 0, 0);

// 设置热传导材料参数：密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup(7800.0, 20.0, 3.125, 1000, 3e-5, 1);

// 设置接触面热传递开关和放大因子
dyna.Set("If_Contact_Transf_Heat 1");
dyna.Set("Contact_Heat_Transfer_Factor 10.0");

// 施加初始温度条件：整个模型初始温度为20°C
heatcd.InitConditionByCoord("temp", 20.0, [0, 0, 0], -100, 100, -100, 100, -100, 100, false);

// 施加热传导边界条件：左侧面固定温度50°C
heatcd.ApplyConditionByCoord("temp", 50.0, [0, 0, 0], -1e-3, 1e-3, -height, height, -height, height, false);

// 设置计算步长
dyna.Set("Time_Step 500");

// 执行求解循环
dyna.BeforeCal();
for (var i = 0; i < 10000; i++) {
    var fUnBal = heatcd.CalNodeTemperature();
    heatcd.CalElemHeatTransfer();

    if (i % 100 == 0) {
        var str = "Iter = " + i + " UnBal = " + fUnBal;
        print(str);
        dyna.PutStep();
    }
}

// 获取节点温度结果
var tempResult = heatcd.GetNodeValue("temp", 1, 0, 0, 0);
print("节点温度监测结果: " + tempResult);

// 计算单元热流速
heatcd.CalElemHeatTransfer();

// 打印提示信息
print("Solution Finished");

// 卸载动态链接库
dyna.FreeUDF();
