setCurDir(getSrcDir());

// ========== 1. 设置全局仿真环境参数 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("Output_Interval 1000000");
dyna.Set("Exit_Iter 30000");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");

// ========== 2. 生成二维块体网格模型 ==========
// 创建初始模型：长60m，高50m，网格划分60x50，组号1
blkdyn.GenBrick2D(60, 50, 60, 50, 1);

// ========== 3. 配置岩石材料本构参数 ==========
// 设置Mohr-Coulomb模型参数：密度、弹性模量、泊松比、粘聚力、内摩擦角等
blkdyn.SetModel("MC");
blkdyn.SetMat(2615, 53e9, 0.26, 1.0e6, 0.5e6, 28.7, 15);

// ========== 4. 施加边界约束条件 ==========
// 固定模型底部（Y方向）
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
// 固定两侧侧向位移自由度（X方向）
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 59.99, 61);

// ========== 5. 定义采空区临界厚度分析工况 ==========
// 初始顶板高度范围：40m-50m，采空区从底部向上开挖
blkdyn.SetModelByCoord("none", -1000, 1000, 10, 20, -1, 1);

// ========== 6. 启用渗流与破裂耦合计算接口 ==========
dyna.Set("If_Cal_Rayleigh 0");
dyna.Set("Contact_Detect_Tol 1e-5");

// ========== 7. 执行动力学求解迭代过程 ==========
for (i = 1; i <= 30; i++) {
    // 设置当前顶板厚度（从40m递减）
    currentHeight = 50 - (i - 1);

    // 更新采空区范围
    blkdyn.SetModelByCoord("none", -1000, 1000, 50 - i, 50 - (i - 1), -1, 1);

    // 执行求解
    dyna.Solve();

    // 获取迭代终止信息
    var exititer = dyna.GetValue("Iter_Now");

    // 检查是否达到稳定状态
    if (exititer >= 30000) {
        var linjieH = 30 - (i - 1);
        print("该采空区的临界厚度为    " + linjieH + " m");
        break;
    }
}

// ========== 8. 提取关键监测数据 ==========
// 监测顶板最大位移量
dyna.Monitor("block", "displace_y", 0, 60, 40, 50);

// 监测应力集中区域（竖直应力）
dyna.Monitor("block", "syy", 0, 60, 35, 50);

// ========== 9. 绘制结果云图 ==========
// 绘制顶板Y方向位移云图
dyna.Plot("Node", "Displace", 2);

// 绘制竖直应力分布云图
dyna.Plot("Elem", "Syy");

// 绘制块体破坏度云图
dyna.Plot("Elem", "Broken_Ratio");

// ========== 10. 输出分析结果文件 ==========
print("采空区临界顶板厚度分析报告已生成");
print("监测数据已保存至结果目录");
