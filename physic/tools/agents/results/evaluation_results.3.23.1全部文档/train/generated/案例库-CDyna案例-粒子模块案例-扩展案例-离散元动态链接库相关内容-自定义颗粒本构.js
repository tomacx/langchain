setCurDir(getSrcDir());

// 清除BlockDyna内存数据
dyna.Clear();

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 设置重力加速度方向（向下）
dyna.Set("Gravity -9.8 0 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 加载CustomModel动态链接库
dyna.LoadUDF("CustomModel");

// 创建规则排布的颗粒（2D平面应变，x方向5个颗粒，y方向3个颗粒）
pdyna.RegularCreateByCoord(5, 3, 0.1, -2.5, 2.5, -1.5, 1.5, 0, 0);

// 设置颗粒模型为线弹性模型（初始状态）
pdyna.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
// 密度2500 kg/m³，弹性模量3e10 Pa，泊松比0.25，其他参数根据物理合理性设置
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 30, 0.02, 0.0);

// 固定模型底部速度（y方向约束）
pdyna.FixV("xyz", 0.0, "y", -1, 1);

// 设置自定义参数：弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角
var avalue = [3e10, 0.25, 1e6, 1e6, 30];
dyna.SetUDFValue(avalue);

// 设置用户自定义模型（脆性断裂Mohr-Coulomb模型）
pdyna.SetModel("custom");

// 配置结果输出策略：设置监测变量
dyna.Set("Output_If_Stress 1");
dyna.Set("Output_If_Damage 1");

// 求解计算
dyna.Solve();

// 释放动态链接库资源
dyna.FreeUDF();
