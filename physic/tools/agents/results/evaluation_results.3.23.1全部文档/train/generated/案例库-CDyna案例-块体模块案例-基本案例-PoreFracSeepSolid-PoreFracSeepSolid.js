setCurDir(getSrcDir());

// 初始化CDyna仿真环境
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（Z方向向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭大变形计算
dyna.Set("Large_Displace 0");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 开启虚质量计算
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时步
dyna.Set("Virtural_Step 0.5");

// 设置系统不平衡率阈值
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算
dyna.Set("If_Renew_Contact 0");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 包含孔隙渗流计算模块
dyna.Set("Config_PoreSeepage 1");

// 关闭孔隙渗流计算开关（后续再开启）
dyna.Set("PoreSeepage_Cal 0");

// 包含裂隙渗流计算模块
dyna.Set("Config_FracSeepage 1");

// 关闭裂隙渗流计算开关（后续再开启）
dyna.Set("FracSeepage_Cal 0");

// 关闭裂隙渗流与固体耦合开关
dyna.Set("FS_Solid_Interaction 0");

// 创建矩形块体模型：长100m，宽50m，高20m
blkdyn.GenBrick2D(100, 50, 20, 20, 1);

// 对内部进行切割，形成接触面
blkdyn.CrtIFaceByCoord(0.001, 99.99, 0.001, 49.99, -1e5, 1e5);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设置固体材料参数：密度、弹性模量、泊松比、屈服强度、硬化模量等
// 参数范围：密度2500 kg/m³, E=5e10 Pa, ν=0.25, σy=8e6 Pa
blkdyn.SetMat(2500, 5e10, 0.25, 8e6, 3e6, 40.0, 15.0, 1, 100);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

// 接触面刚度从单元中获取
blkdyn.SetIStiffByElem(10.0);

// 接触面强度从单元中获取
blkdyn.SetIStrengthByElem();

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// 固定模型四周的法向速度（X方向）
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 99.99, 101);

// 固定模型四周的法向速度（Y方向）
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", 49.99, 51);

// 固定模型四周的法向速度（Z方向）
blkdyn.FixV("z", 0.0, "z", -0.001, 0.001);
blkdyn.FixV("z", 0.0, "z", 19.99, 21);

// 定义X、Y、Z三个方向的渗透系数（m/s）
var arrayK = new Array(8e-8, 8e-8, 8e-8);

// 设置孔隙渗流参数：密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
// 坐标范围：X[-500,500], Y[-500,500], Z[-500,500]
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.2, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义X、Y、Z三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

// 右侧裂隙边界的渗流压力施加为50kPa
fracsp.ApplyConditionByCoord("pp", 5e4, fArrayGrad, 9.99, 11.0, -1e5, 1e5, -1e5, 1e5);

// 从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数：密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e6, 8e-5, 1e-2, 1, 11);

// 开启孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 1");

// 开启裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 打开裂隙渗流与孔隙渗流的耦合开关
dyna.Set("FS_PoreS_Interaction 1");

// 设置计算时步为2ms
dyna.Set("Time_Step 0.0005");

// 迭代10万步
dyna.Solve(100000);

// 打印提示信息
print("Solution Finished");
