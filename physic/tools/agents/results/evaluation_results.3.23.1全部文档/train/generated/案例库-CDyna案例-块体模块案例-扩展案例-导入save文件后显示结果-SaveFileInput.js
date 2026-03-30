setCurDir(getSrcDir());

// 配置求解器输出间隔及自动保存文件开关参数
dyna.Set("Output_Interval 500");
dyna.Set("SaveFile_Out 1");

// 导入网格（需先加载对应网格）
blkdyn.ImportGrid("gid", "112.msh");

// 创建接触面并更新网格
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置模型类型
blkdyn.SetModel("MC");

// 设置材料属性（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼）
blkdyn.SetMat(2500, 1e8, 0.25, 10e6, 5e6, 15, 15);

// 设置模型为脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 设置局部阻尼
blkdyn.SetLocalDamp(0.05);

// 施加边界条件（固定X和Y方向）
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 0.999, 1.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", 0.999, 1.01);

// 调用 Restore 函数调入指定的二进制 save 文件
dyna.Restore("Elastic.sav");

// 定义监测点坐标（示例：在(50.0, 50.0)处监测）
var monitorCoord = new Array(50.0, 50.0);

// 设置需监测的物理量类型（堆积体厚度）
gflow.hist("Thickness", 50.0, 50.0);

// 绘制监测点在模型视图中的空间位置标记
gflow.drawHistPos();

// 导入 Tecplot 格式的计算结果文件进行后处理显示
gflow.resultImport("aa.plt");

// 执行求解器继续从保存状态开始计算过程
dyna.Solve(1000);

// 获取并输出指定监测点的时程数据信息
var histData = gflow.GetHistData("Thickness", 50.0, 50.0);
print("监测点厚度数据: " + histData);

// 提交最终图形化结果并完成脚本执行流程
gflow.commit();
