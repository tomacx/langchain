setCurDir(getSrcDir());

// 1. 初始化仿真环境并清除之前的计算结果与图形显示
doc.clearResult();
dyna.Clear();
imeshing.clear();
igeo.clear();

// 2. 使用几何接口生成横观各向同性模型的基础矩形区域边界
var f1 = igeo.genRect(0, 0, 0, 60, 40, 0, 2);
var f2 = igeo.genRect(27, 20, 0, 33, 24, 0, 0.5);

var loop = [f1, f2];
igeo.genSurface(loop, 1);

var loop = [f2];
igeo.genSurface(loop, 2);

// 3. 调用网格划分模块对生成的几何区域进行离散化网格处理
imeshing.genMeshByGmsh(2);

// 4. 设置块体模块模型类型为横观各向同性模型以支持特定材料属性
blkdyn.GetMesh(imeshing);
blkdyn.SetModel("TransIso");

// 5. 定义全局横观各向同性材料的弹性模量、泊松比及法向参数
var normal = new Array(1, 1, 0);
blkdyn.SetTransIsoMat(1, 3e10, 0.25, 1e10, 0.30, normal);

// 6. 绑定设定的横观各向同性材料到指定的单元组号范围内
blkdyn.BindTransIsoMat(1, 1, 10);

// 7. 配置朗道爆源模型参数以模拟爆炸冲击波的产生过程
blkdyn.SetLandauSource(1, 800, 6500, 4e6, 3.0, 1.3333, 2.0e9, [0, 0, 0], 0, 1);

// 8. 设置计算控制参数包括虚拟步长与结果输出时间间隔
dyna.Set("Virtural_Step 0.5");
dyna.Set("Output_Interval 1000");
dyna.Set("Moniter_Iter 10");

// 9. 定义监测区域以获取特定空间范围内压力或位移的演化数据
dyna.Monitor("block", "sw_pp", 1, 1, 1, [-1e5, 1e5, -1e5, 1e5, -1e5, 1e5]);
dyna.Monitor("block", "ydis", 5, 40, 0);
dyna.Monitor("block", "xdis", 10, 40, 0);

// 10. 执行仿真计算并绘制云图以可视化波的传播过程与结果
dyna.Solve();
dyna.Save("transiso_explosion.sav");

// 绘制压力云图
dyna.Plot("skwave", "sw_pp", 1);

// 绘制位移云图
dyna.Plot("block", "ydis", 1);
