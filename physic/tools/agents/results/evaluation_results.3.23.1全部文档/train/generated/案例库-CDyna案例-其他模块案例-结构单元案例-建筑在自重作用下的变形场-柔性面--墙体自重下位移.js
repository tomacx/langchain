setCurDir(getSrcDir());

// 配置全局重力加速度（Y方向-9.8 m/s²）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 创建三维建筑墙体网格模型（尺寸：宽2m×高4m×厚0.2m，单元数：10×20×1）
blkdyn.GenBrick3D(2, 4, 0.2, 10, 20, 1, 1);

// 设置单元模型为线弹性模型
blkdyn.SetModel("linear");

// 定义材料物理力学参数（密度、弹性模量、泊松比、屈服强度等）
// blkdyn.SetMat(密度, 弹性模量, 泊松比, 屈服应力1, 屈服应力2, 断裂能1, 断裂能2)
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

// 固定底部节点速度（X、Z方向完全固定，Y方向限制微小位移）
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 设置关键位置节点的位移监测点（墙体中部和顶部）
dyna.Monitor("block", "ydis", 1.0, 2.0, 0);
dyna.Monitor("block", "ydis", 1.5, 2.0, 0);
dyna.Monitor("block", "ydis", 2.0, 2.0, 0);

// 计算前初始化操作
dyna.BeforeCal();

// 循环迭代进行核心求解与变形计算
for (var i = 0; i < 10000; i++) {
    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    var unbal = blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        print("当前迭代步数：" + i);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, i, 0.1);
    }
}

// 最终输出监测数据
dyna.OutputMonitorData();
