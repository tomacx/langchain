setCurDir(getSrcDir());

// 初始化环境
gflow.clear();

// 配置全局计算参数
dyna.Set("Mechanic_Cal", "1");
dyna.Set("Output_Interval", "500");
dyna.Set("Large_Displace", "0");
dyna.Set("UnBalance_Ratio", "1e-3");
dyna.Set("Gravity", "0.0 0.0 -9.8");
dyna.Set("Virtural_Step", "0.5");
dyna.Set("Contact_Search_Method", "2");

// 导入地形网格文件
blkdyn.ImportGrid("ansys", "terrain.dat");

// 设置所有单元为线弹性本构（初始稳定性分析阶段）
blkdyn.SetModel("linear");

// 定义各地质组材料参数（国际单位制）
// 格式：密度，弹性模量，泊松比，粘聚力，内摩擦角，容重，厚度，组号
blkdyn.SetMat(2000, 80e6, 0.25, 2e4, 1e4, 35, 10, 1);   // 碎石含土层
blkdyn.SetMat(2680, 5.5e10, 0.2, 31e6, 15e6, 78, 10, 2); // 中风化花岗闪长岩
blkdyn.SetMat(1800, 80e6, 0.25, 0, 0, 36, 10, 4);        // 碎石填土层
blkdyn.SetMat(2000, 100e6, 0.2, 0, 0, 26, 10, 5);         // 碎石层
blkdyn.SetMat(1900, 70e6, 0.2, 10e3, 5e3, 20, 10, 6);    // 粉土层

// 自动施加边界约束（固定底部节点）
blkdyn.FixVAuto(0.1);

// 第一次求解：计算初始稳定状态
dyna.Solve();

// 保存弹性阶段计算结果
dyna.Save("Elastic.sav");

// ==================== 进入成灾演化阶段 ====================

// 动态调整滑体材料强度参数（模拟破坏条件）
var R = 130;
var fValue = 0.4 + 0.4 * (130 - R) / (130 - 50);
blkdyn.SetMat(2000, 80e6, 0.25, 2e4 * fValue, 1e4 * fValue, 35 * fValue, 10, 1);

// 切换到塑性本构模型（Mohr-Coulomb）
blkdyn.SetModel("MC");

// 调整输出间隔以监测变形演化过程
dyna.Set("Output_Interval", "500");

// 第二次求解：模拟完整变形破坏及成灾范围演化
dyna.Solve();

// 导出最终计算结果和厚度历史数据
gflow.exportGrid();

// 生成厚度分布图
gflow.drawHistPos();

// 打印提示信息
print("滑体变形破坏分析及成灾范围模拟完成！");
