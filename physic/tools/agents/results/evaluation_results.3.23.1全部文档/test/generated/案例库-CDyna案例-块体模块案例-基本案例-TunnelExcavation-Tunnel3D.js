setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置求解不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步
dyna.Set("Time_Step 1e-3");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 创建椭圆形隧道模型（高度40m，宽度60m，竖向半轴3m，水平半轴4m，底部距离10m）
// 网格尺寸：模型1.0m，隧道0.2m，包含衬砌ShellFlag=1，衬砌厚度0.3m
igeo.genEllipseTunnelS(40, 60, 3, 4, 10, 1.0, 0.2, 1, 0.3);

// 设置块体模块为线弹性模型
blkdyn.SetModel("linear");

// 设置围岩材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
// 组号1：外部围岩，组号2：内部围岩，组号3：衬砌
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 1e6, 5e5, 35, 0.8, 0.0);

// 固定模型底部边界（Z方向速度约束）
blkdyn.FixV("z", 0.0, "z", -1e10, 1e10);

// 固定模型左右两侧边界（X方向速度约束）
blkdyn.FixV("x", 0.0, "x", -1, 2.0);
blkdyn.FixV("x", 0.0, "x", 98, 101);

// 设置监测点：监测隧道顶部、中部和底部的竖向位移
dyna.Monitor("block", "ydis", 30, 4, 0);
dyna.Monitor("block", "ydis", 30, 20, 0);
dyna.Monitor("block", "ydis", 30, 36, 0);

// 设置监测点：监测隧道顶部、中部和底部的竖向应力
dyna.Monitor("block", "syy", 30, 4, 0);
dyna.Monitor("block", "syy", 30, 20, 0);
dyna.Monitor("block", "syy", 30, 36, 0);

// 计算前初始化
dyna.BeforeCal();

// 执行求解器进行计算
dyna.Solve();

// 将监测数据输出至Result文件夹
dyna.OutputMonitorData();

// 将模型结果存储为可导入格式
OutputModelResult();

// 结束仿真脚本运行
print("隧道开挖仿真完成，结果已输出至Result文件夹");
