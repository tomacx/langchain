setCurDir(getSrcDir());

// 清除现有模型数据
dyna.Clear();

// 开启力学计算模式
dyna.Set("Mechanic_Cal 1");

// 设置不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

// 设置重力加速度（x, y, z方向）
dyna.Set("Gravity 0.0 0.0 -9.8");

// 开启大变形计算
dyna.Set("Large_Displace 1");

// 设置结果云图输出间隔
dyna.Set("Output_Interval 200");

// 设置监测信息提取间隔
dyna.Set("Moniter_Iter 200");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量计算时步
dyna.Set("Virtural_Step 0.6");

// 设置单元体积膨胀断裂应变及等效剪切断裂应变
dyna.Set("Block_Soften_Value 0.01 0.03");

// 导入网格文件（示例：使用Midas格式）
blkdyn.ImportGrid("Midas", "DavidenkovModel.fpn");

// 设置单元模型为Davidenkov土动力学模型
blkdyn.SetModel("Davidenkov", 1, 1);

// 设置全局Davidenkov材料参数
// iNumber=1: 材料序号
// fGmax0=5e6: 最大剪切模量(Pa)
// fMu=0.3: 泊松比
// fdA=1.1: 拟合参数1
// fdB=0.35: 拟合参数2
// fdGamay=3.8e-4: 拟合参数3
blkdyn.SetDavidenkovMat(1, 5e6, 0.3, 1.1, 0.35, 3.8e-4);

// 将全局材料序号1绑定到组号1-11的单元
blkdyn.BindDavidenkovMat(1, 1, 11);

// 设置所有节点的局部阻尼
blkdyn.SetLocalDamp(0.8);

// 对模型底部进行法向约束（z方向）
blkdyn.FixV("z", 0.0, "z", -0.05, 0.05);

// 对模型左右两侧进行法向约束（x方向）
blkdyn.FixV("x", 0.0, "x", -0.05, 0.05);
blkdyn.FixV("x", 0.0, "x", 1.05, 1.05);

// 对模型前后两侧进行法向约束（y方向）
blkdyn.FixV("y", 0.0, "y", -0.05, 0.05);
blkdyn.FixV("y", 0.0, "y", 1.05, 1.05);

// 施加重力载荷
blkdyn.ApplyGravity();

// 设置监测点：顶部区域应力监测
dyna.Monitor("block", "syy", 0.0, 0.5, 0);
dyna.Monitor("block", "syy", 0.25, 0.5, 0);
dyna.Monitor("block", "syy", 0.5, 0.5, 0);

// 设置监测点：底部区域应力监测
dyna.Monitor("block", "syy", 0.0, 0.0, 0);
dyna.Monitor("block", "syy", 0.25, 0.0, 0);
dyna.Monitor("block", "syy", 0.5, 0.0, 0);

// 绘制监测点位置（可选）
// dyna.DrawMonitorPos();

// 求解至稳定
dyna.Solve();

// 保存结果文件
dyna.Save("Davidenkov-Model.sav");

// 输出模型结果到Result文件夹
dyna.OutputModelResult();

// 输出监测数据到Result文件夹
dyna.OutputMonitorData();
