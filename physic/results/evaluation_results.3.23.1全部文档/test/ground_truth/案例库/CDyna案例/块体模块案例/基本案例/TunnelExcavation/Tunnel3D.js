//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//将系统不平衡率设定为1e-4，不平衡率达到该值，认为系统稳定，退出求解
dyna.Set("UnBalance_Ratio 1e-4");

//设置三个方向的重力加速度
dyna.Set("Gravity 0 0.0 -10.0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置云图的输出间隔为100步
dyna.Set("Output_Interval 100");

//设置监测内容的输出间隔为100步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.6
dyna.Set("Virtural_Step 0.6");

//导入Flac3D格式的网格，网格名为"tunnel.flac3d"
blkdyn.ImportGrid("flac3d", "tunnel.flac3d");

//设置所有单元为线弹性模型
blkdyn.SetModel("linear");

//设置底部材料参数
blkdyn.SetMatByCoord(2200,  3.0e9,  0.25,  50e3, 5e3, 20, 3, -1e4,1e4, -1e4, 1e4, -50, 25);

//设置顶部材料参数
blkdyn.SetMatByCoord(2200,  3.0e8,  0.3,   25e3,   0, 20, 0, -1e4,1e4, -1e4, 1e4, 25, 35);

//设置所有单元的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

//对模型四周及底部进行法向约束
blkdyn.FixV("x", 0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0, "x", 43.99, 44.01);
blkdyn.FixV("z", 0, "z", -40.1, -39.9);
blkdyn.FixV("y", 0, "y", -0.01, 0.01);
blkdyn.FixV("y", 0, "y", 50.9, 51.1);

//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
var BaseValue = [-770e3, -385e3, -770e3];
var Grad      = [0, 0, 22000, 0, 0, 11000, 0, 0, 22000];

//对模型所有单元初始化地应力
blkdyn.InitConditionByCoord("stress", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);

//求解至稳定
dyna.Solve();

//保存弹性计算结果
dyna.Save("elastic.sav");

//将所有单元的本构模型设定为理想弹塑性模型
blkdyn.SetModel("MC");

//塑性求解至稳定
dyna.Solve();

//保存塑性信息
dyna.Save("plastic.sav");

//开挖组号为4的单元
blkdyn.SetModel("none",4);

//求解至稳定
dyna.Solve();

//保存开挖组4后的结果
dyna.Save("exca4.sav");

//开挖组号为5的单元
blkdyn.SetModel("none", 5);

//求解至稳定
dyna.Solve();

//保存开挖组5后的结果
dyna.Save("exca5.sav");

//开挖组号为7的单元
blkdyn.SetModel("none", 7);

//求解至稳定
dyna.Solve();

//保存开挖组7后的结果
dyna.Save("exca7.sav");

//打印信息
print("Solution Finished");
