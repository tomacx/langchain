setCurDir(getSrcDir());

// 清除内存数据
dyna.Clear();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

// 设置重力加速度（z方向向下）
dyna.Set("Gravity 0.0 0.0 -9.8");

// 关闭大变形计算
dyna.Set("Large_Displace 0");

// 设置云图输出间隔为200步
dyna.Set("Output_Interval 200");

// 设置监测信息提取间隔为1000时步
dyna.Set("Moniter_Iter 200");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量计算时步
dyna.Set("Virtural_Step 0.6");

// 设置单元体积膨胀断裂应变及等效剪切断裂应变
dyna.Set("Block_Soften_Value 0.01 0.03");

// 定义三维计算域：20m×20m×20m，每个方向分割50个节点
skwave.DefMesh(3, [20.0, 20.0, 20.0], [50, 50, 50]);

// 设置Davidenkov材料参数（序号1）
// Gmax0:最大剪切模量(Pa), Mu:泊松比, A,B,Gamay:拟合参数
blkdyn.SetDavidenkovMat(1, 5e6, 0.3, 1.1, 0.35, 3.8e-4);

// 将全局材料序号1绑定到单元组号1-100
blkdyn.BindDavidenkovMat(1, 1, 100);

// 设置所有节点的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 对模型底部进行法向约束（z方向）
blkdyn.FixV("z", 0.0, "z", -0.05, 0.05);

// 对模型左右两侧进行法向约束（x方向）
blkdyn.FixV("x", 0.0, "x", -0.05, 0.05);
blkdyn.FixV("x", 0.0, "x", 19.95, 20.05);

// 对模型前后两侧进行法向约束（y方向）
blkdyn.FixV("y", 0.0, "y", -0.05, 0.05);
blkdyn.FixV("y", 0.0, "y", 19.95, 20.05);

// 施加重力
blkdyn.ApplyGravity();

// 在模型中心位置绘制监测点（用于输出结果的物理位置）
dyna.DrawMonitorPos(10.0, 10.0, 10.0);

// 设置监测变量：位移、应力等典型测点的时程信息
dyna.Monitor("node", "disp_x", 10.0, 10.0, 10.0);
dyna.Monitor("node", "disp_y", 10.0, 10.0, 10.0);
dyna.Monitor("node", "disp_z", 10.0, 10.0, 10.0);
dyna.Monitor("node", "stress_xx", 10.0, 10.0, 10.0);
dyna.Monitor("node", "stress_yy", 10.0, 10.0, 10.0);
dyna.Monitor("node", "stress_zz", 10.0, 10.0, 10.0);

// 求解至稳定
dyna.Solve();

// 推送当前时步结果信息至Genvi平台展示
dyna.PutStep(1, 0, 0.1);

// 将监测数据输出至Result文件夹下的监测文件
dyna.OutputMonitorData();

// 存储当前时步的结果信息为其他软件可导入的格式文件
dyna.OutputModelResult();

// 保持save文件用于后续分析
dyna.Save("Davidenkov-Model-linear.sav");
