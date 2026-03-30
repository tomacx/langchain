setCurDir(getSrcDir());

// 1. 设置当前脚本所在路径及结果输出间隔步数参数
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");

// 2. 关闭虚拟质量开关并开启大变形计算选项
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Large_Displace 1");
dyna.Set("Mechanic_Cal 1");

// 3. 定义刚性面单元组号并调用 rdface.SetDeformMat 设置材料属性
rdface.SetDeformMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);

// 4. 设置全局坐标系下的重力加速度分量值（m/s^2）
rdface.SetGravity(0.0, -9.8, 0.0);

// 5. 使用 blkdyn.ApplyDynaVarFromFileByGCD 施加地震波动态面力载荷
// 参数：施加类型"face_force", 是否局部坐标false, 面力分量[1e6, 0, 0], 文件路径, 单元组号范围, 坐标范围
blkdyn.ApplyDynaVarFromFileByGCD("face_force", false, [1e6, 0, 0], "earthquake.txt", [1, 3], [-1e5, -0.9, -1e5, 1e5, -1e5, 1e5], [1, -1, 0, 0, 0.5]);

// 6. 调用 blkdyn.SetQuietBoundByCoord 在边界处施加无反射条件
blkdyn.SetQuietBoundByCoord(-10, 10, -10, 10, -10, 10);

// 7. 配置刚性面单元的位移与应力监测输出变量
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("rdface", "disp", 1, 0.0 + i, 0);
}
for (var i = 0; i <= 5; i++) {
    dyna.Monitor("rdface", "sxx", 1, 0.0 + i, 0);
}

// 8. 调用 dyna.RunUDFCmd 运行用户自定义命令流启动仿真
dyna.RunUDFCmd("StartSimulation");

// 9. 获取刚柔性面单元信息并验证载荷施加状态
rdface.GetElemValue();

// 10. 调用 dyna.FreeUDF 卸载已加载的动态链接库资源
dyna.FreeUDF();
