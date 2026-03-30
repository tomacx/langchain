setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 设置求解器参数
dyna.Set("Output_Interval 100");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("UnBalance_Ratio 5e-4");
dyna.Set("Time_Step 1e-3");

// 创建初始几何模型（块体）
blkdyn.GenBrick3D(10, 10, 10, 10, 10, 10, 1);

// 设置块体材料参数（线弹性）
blkdyn.SetModel("SoftenMC");
blkdyn.SetMat(2500, 1e8, 0.25, 1e6, 1e6, 35, 0.8, 0.0);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.05);

// 导入颗粒模型（可选）
pdyna.Import("pdyna", "particle.dat");

// 设置颗粒接触模型
pdyna.SetModel("linear");

// 设置颗粒材料参数
pdyna.SetMat(2500, 1e8, 0.25, 1e6, 1e6, 35, 0.8, 0.0);

// 固定边界条件（左右两侧及底部）
pdyna.FixV("xyz", 0.0, "x", -2, 3.0);
pdyna.FixV("xyz", 0.0, "y", -3, 3);
pdyna.FixRotaV("xyz", 0.0, "x", -1, 2.0);
pdyna.FixRotaV("xyz", 0.0, "y", -1, 2);

// 设置ByrneDav材料参数（如需液化模型）
blkdyn.SetByrneDavMat(1, 53e6, 0.25, 1.02, 0.43, 0.00041, 1e5, 0.5, 0.55, 1.38, 0.43, 0.62, 0.0025, 0.0002);

// 创建选择集用于网格移动
var Sel1 = new SelElems(cMesh[0]);
var n1 = Sel1.box(0, 0, 0, 5, 5, 5);

// 执行网格平移操作（示例：X方向移动1米）
imeshing.move(1.0, 0.0, 0.0, Sel1);

// 设置监测点
dyna.Monitor("particle", "pa_xdis", 32.3547, 65.9723, 0);
dyna.Monitor("particle", "pa_xdis", 39.0829, 52.8447, 0);

// 执行求解循环
var step = 0;
while (step < 1000) {
    // 计算颗粒运动
    pdyna.CalMovement();

    // 每100步输出状态信息
    if (step != 0 && step % 100 == 0) {
        print("当前步数：" + step);
        dyna.PutStep(1, step, 0.1);
    }

    step++;
}

// 打印求解完成信息
print("ModelMove仿真计算完成！");

// 输出最终结果
dyna.OutputModelResult();
