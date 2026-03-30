//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置三个方向的重力加速度值
dyna.Set("Gravity 0.0 0.0 -9.8");

//打开大变形计算开关
dyna.Set("Large_Displace 0");

//设置云图输出间隔为500
dyna.Set("Output_Interval 200");

//设置监测信息提取间隔为1000时步
dyna.Set("Moniter_Iter 200");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量计算时步
dyna.Set("Virtural_Step 0.6");

//设置单元体积膨胀断裂应变及等效剪切断裂应变
dyna.Set("Block_Soften_Value 0.01 0.03");

//导入Midas格式的网格
blkdyn.ImportGrid("Midas", "ZFT25.fpn");

//设置单元模型为线弹性模型
blkdyn.SetModel("linear");

//设置组号为1的单元材料，正方体
blkdyn.SetMat(2000, 5e6, 0.3, 0, 0, 35, 1);

//设置所有节点的局部阻尼0.8
blkdyn.SetLocalDamp(0.8);

//对模型左右两侧及底部进行法向约束
blkdyn.FixV("z", 0.0, "z", -0.05, 0.05);
blkdyn.FixV("x", 0.0, "x", -0.05, 0.05);
blkdyn.FixV("x", 0.0, "x", 0.95, 1.05);
blkdyn.FixV("y", 0.0, "y", -0.05, 0.05);
blkdyn.FixV("y", 0.0, "y", 0.95, 1.05);

//施加重力
blkdyn.ApplyGravity();

//求解至稳定
dyna.Solve();

//设置模型为Mohr-Coulomb模型
blkdyn.SetModel("Davidenkov", 1, 1);
blkdyn.SetDavidenkovMat(1, 5e6, 0.3, 1.1, 0.35, 3.8e-4);
blkdyn.BindDavidenkovMat(1, 1, 11);

//求解至稳定
dyna.Solve();

//保持save文件
dyna.Save("Ini-equil-20231103.sav");

//*************************初始化位移*************************
//定义三个方向基础值
var values = new Array(0.0, 0.0, 0.0);

//定义变化梯度
var gradient = new Array(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

//设置监测点
dyna.Monitor("block", "soxx", 0.04, 0.0125, 0.0);
dyna.Monitor("block", "sxx", 0.04, 0.0125, 0.0);
dyna.Monitor("block", "General_P5", 0.04, 0.0125, 0.0);

//计算14万步
dyna.Solve(140000);
