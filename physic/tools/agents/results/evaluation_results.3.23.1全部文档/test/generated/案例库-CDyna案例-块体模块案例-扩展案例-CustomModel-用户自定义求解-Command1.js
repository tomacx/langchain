setCurDir(getSrcDir());

// 初始化仿真环境参数
dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 1e-6");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");

// 创建几何模型：立方体颗粒组
pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0);

// 设置颗粒模型为自定义本构
pdyna.SetModel("Custom");

// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 45, 0.8, 0.1);

// 固定模型底部速度约束
pdyna.FixV("xyz", 0.0, "y", -11, -9);

// 加载动态链接库
dyna.LoadUDF("CustomModel.dll");

// 设置自定义命令流参数：Command1为自定义求解命令标识
dyna.SetUDFValue([1e6, 1.33]); // 初始压力、绝热指数等参数

// 运行用户自定义命令流，调用CustomModel中的UserDefFunction_Execute函数
dyna.RunUDFCmd("Command1");

// 配置监测参数：位移、应力、应变
dyna.Set("Monitor_Displacement 1");
dyna.Set("Monitor_Stress 1");
dyna.Set("Monitor_Strain 1");

// 执行求解
dyna.Solve();

// 获取计算结果数据
var resultData = dyna.GetValue("Result_Data");
var convergenceStatus = dyna.GetValue("Convergence_Status");

// 处理并输出监测结果
if (convergenceStatus === "Converged") {
    print("仿真收敛成功，结果已保存至输出目录");
} else {
    print("警告：仿真未完全收敛，请检查自定义本构参数");
}

print("Command1执行完成，返回数据：" + resultData);

// 释放动态链接库资源
dyna.FreeUDF();
