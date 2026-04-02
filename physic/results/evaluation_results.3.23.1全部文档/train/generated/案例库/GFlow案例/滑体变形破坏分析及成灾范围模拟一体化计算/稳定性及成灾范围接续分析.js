setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal", 1);

// 将结果输出间隔设定为 500 步
dyna.Set("Output_Interval", 500);

// 关闭大变形计算开关
dyna.Set("Large_Displace", 0);

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio", 1e-3);

// 设置 X、Y、Z 三个方向的重力加速度，
dyna.Set("Gravity", 0.0, 0.0, -9.8);

// 设置虚拟步长
dyna.Set("Virtural_Step", 0.5);

// 设置接触搜索方法
dyna.Set("Contact_Search_Method", 2);

// 导入计算网格数据
blkdyn.ImportGrid("ansys", "erdaohe2.dat");

// 指定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设置材料参数
blkdyn.SetMat(2000, 80e6, 0.25, 2e4, 1e4, 35, 10, 1);
blkdyn.SetMat(2680, 5.5e10, 0.2, 31e6, 15e6, 78, 10, 2);
blkdyn.SetMat(1800, 80e6, 0.25, 0, 0, 36, 10, 4);
blkdyn.SetMat(2000, 100e6, 0.2, 0, 0, 26, 10, 5);
blkdyn.SetMat(1900, 70e6, 0.2, 10e3, 5e3, 20, 10, 6);
blkdyn.SetMat(2680, 5.5e10, 0.2, 31e6, 15e6, 78, 10, 3);
blkdyn.SetMat(2680, 5.5e10, 0.2, 31e6, 15e6, 78, 10, 7);

// 自动固定边界
blkdyn.FixVAuto(0.1);

// 求解至稳定
dyna.Solve();

// 保存弹性场结果
dyna.Save("Elastic.sav");

// 调整材料参数以模拟塑性破坏
var R = 130;
var fValue = 0.4 + 0.4 * (130 - R) / (130 - 50);
blkdyn.SetMat(2000, 80e6, 0.25, 2e4 * fValue, 1e4 * fValue, 35 * fValue, 10, 1);

// 设置塑性场模型
blkdyn.SetModel("MC");

// 调整输出间隔
dyna.Set("Output_Interval", 500);

// 求解塑性场
dyna.Solve();

print("Solution is OK!");
