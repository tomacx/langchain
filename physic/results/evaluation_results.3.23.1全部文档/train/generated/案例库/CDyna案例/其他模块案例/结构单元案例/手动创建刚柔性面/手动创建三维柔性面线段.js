// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置柔性面的力学模型为板（2）
dyna.Set("RdFace_MechModel 2");

// 导入刚性面，创建二维线段
for(var i = 0; i < 10; i++) {
    rdface.Create(2, 1, 2, [i, 0, 0, i + 1, 0, 0]);
}

// 设置材料参数：泊松比、密度、弹性模量等
rdface.SetDeformMat(0.2, 2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);

// 设置边界条件，例如速度
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -0.01, 0.01, -1e5, 1e5, -1e5, 1e5);

// 设置动态计算时步为1e-4秒
dyna.Set("Time_Step 1e-4");

// 开始求解至稳定状态
dyna.Solve();
