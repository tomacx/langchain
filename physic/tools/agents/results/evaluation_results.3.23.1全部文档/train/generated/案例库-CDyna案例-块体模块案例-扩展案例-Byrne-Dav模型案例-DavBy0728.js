setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

// 设置三个方向的重力加速度（Y方向向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置云图输出间隔为50
dyna.Set("Output_Interval 50");

// 设置监测信息提取间隔为100时步
dyna.Set("Moniter_Iter 100");

// 虚质量计算开关关闭
dyna.Set("If_Virtural_Mass 0");

// 包含孔隙渗流计算模块，开辟相应内存
dyna.Set("Config_PoreSeepage 1");

// 孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 1");

// 孔隙渗流与固体耦合的比奥固结计算开关关闭
dyna.Set("If_Biot_Cal 0");

// 创建三维砖块网格（DavBy0728案例尺寸）
blkdyn.GenBrick3D(10, 10, 10, 5.0, 5.0, 5.0, 1);

// 设定所有单元的本构为线弹性模型
blkdyn.SetModel("linear");

// 设定材料参数（密度、弹性模量、泊松比等）
// 格式：density, E, nu, G, K, c, phi, cohesion
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

// 将全局Byrne-Dav材料号65与单元组关联（组号范围1-10）
blkdyn.BindByrneDavMat(65, 1, 10);

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// 对模型底部进行法向约束（Z方向固定）
blkdyn.FixV("z", 0.0, "z", -0.01, 0.01);

// 设置监测点（Y方向位移监测）
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 计算前初始化环境并加载初始状态
dyna.BeforeCal();

// 执行求解循环
for (var i = 0; i < 10000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    var unbal = blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        // 推送文本信息
        print("不平衡率：" + unbal);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, i, 0.1);
    }
}

// 求解完成后保存结果
dyna.Save("DavBy0728.sav");
