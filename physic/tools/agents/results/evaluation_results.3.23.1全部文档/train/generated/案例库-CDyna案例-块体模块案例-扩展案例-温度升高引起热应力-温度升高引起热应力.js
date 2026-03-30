setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 几何参数定义
var thick = 0.2;
var height = 1.0;
var fsize = 0.04;

// 创建三维方块网格模型
igeo.genBrickV(0, 0, 0, thick, height, thick, fsize, 1);

// 生成网格
imeshing.genMeshByGmsh(3);

// 设置重力加速度
dyna.Set("Gravity 0 0 0");

// 设置输出间隔
dyna.Set("Output_Interval 500");

// 包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

// 打开热传导计算开关
dyna.Set("Heat_Cal 1");

// 获取网格并关联到块体模块
blkdyn.GetMesh(imeshing);

// 设置单元模型类型为线弹性模型
blkdyn.SetModel("linear");

// 设置力学材料参数：密度、弹性模量、泊松比、剪切模量、体积模量
blkdyn.SetMat(7800, 2.1e11, 0.25, 500e6, 500e6, 0, 0);

// 设置热传导材料参数：密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup(7800.0, 20.0, 3.125, 1000, 3e-5, 1);
heatcd.SetPropByGroup(7800.0, 20.0, 3.125, 1000, 3e-5, 2);

// 施加温度载荷边界条件：设置初始温度为40度
heatcd.ApplyConditionByCoord("temp", 40.0, [0, 0, 0], -100, 100, -100, 100, -100, 100, false);

// 固定底部节点速度约束（X、Y、Z方向）
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("xyz", 0.0, "z", -0.001, 0.001);

// 设置监测点：Y方向位移监测
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 设置监测点：X方向位移监测
dyna.Monitor("block", "xdis", 0.15, 0.15, 0);

// 设置监测点：应力监测（SXX）
dyna.Monitor("block", "sxx", 0.15, 0.15, 0);

// 计算前初始化操作
dyna.BeforeCal();

// 循环迭代调用核心求解模块进行热应力耦合计算
for (var i = 0; i < 10000; i++) {
    // 计算节点温度增量
    var unbal = heatcd.CalNodeTemperature();

    // 计算单元热传导
    heatcd.CalElemHeatTransfer();

    // 计算接触面热量传递
    heatcd.CalContactHeatTransfer();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送结果信息至外部文件
    if (i != 0 && i % 100 == 0) {
        print("迭代步数：" + i + " 不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

// 打印提示信息
print("*****温度升高引起热应力计算完毕***********");
