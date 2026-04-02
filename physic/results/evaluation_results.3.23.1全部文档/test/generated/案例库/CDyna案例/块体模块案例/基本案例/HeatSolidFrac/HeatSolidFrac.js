setCurDir(getSrcDir());

// 清除之前的几何、网格、动力学数据等
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭力学计算开关，只进行热传导计算
dyna.Set("Mechanic_Cal 0");

// 包含热传导计算模块并开辟相应内存
dyna.Set("Config_Heat 1");

// 打开热传导计算开关
dyna.Set("Heat_Cal 1");

// 创建一个圆柱形网格，半径为5，高度为1，沿Z轴方向划分成50个单元格，沿周向划分成120个单元格
imeshing.genCircle("1", 1, 5, 50, 120);

// 将生成的网格导入到块体动力学模块中
blkdyn.GetMesh(imeshing);

// 设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (2700.0, 20.0, 3.125, 1000, 1e-3, 1);

// 定义梯度数组，用于指定温度条件的梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 固定模型中间空心区域的当前温度为50°C，自由面选项为真（只有自由面才固定温度）
heatcd.ApplyConditionByCylinder("temp", 50.0, fArrayGrad, 0,0,1, 0,0,-1, 0.99, 1.01, true);

// 设置计算步长为500s
dyna.Set("Time_Step 500");

// 执行预处理步骤
dyna.BeforeCal();

// 自定义求解循环，共执行1万步
for(var i = 0; i < 10000; i++)
{
    // 计算节点温度不平衡量
    var fUnBal = heatcd.CalNodeTemperature();

    // 计算单元热传导
    heatcd.CalElemHeatTransfer();

    // 每100步输出一次信息
    if(i % 100 == 0)
    {
        var str = "Iter  = " + i  + "  UnBal = " + fUnBal;
        print(str);

        // 更新当前时间步
        dyna.PutStep();
    }
}

// 打印提示信息，表示求解完成
print("Solution Finished");
