//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

dyna.Set("Para_Threads_Num 1");

//打开单元大变形计算开关
dyna.Set("Large_Displace 1");

//打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//设置计算时步为5e-5
dyna.Set("Time_Step 5e-5");

//创建长宽为1m，厚5cm的板
blkdyn.GenBrick3D(1,0.05,1,20,2,20,1);

//设置单元模型为线弹性模型
blkdyn.SetModel("linear");

//设置单元材料，依次为密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 1e6,0.25, 3e4, 1e4, 35, 15);

//设置单元的局部阻尼
blkdyn.SetLocalDamp(0.01);

//固定板左右两侧三个方向的速度为0.0
blkdyn.FixV("xyz", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("xyz", 0.0, "x",  0.999, 1.01);

//创建随机分布的颗粒
var x = [0.3,0.7];
var y = [0.2,0.5];
var z = [0.3,0.7];
pdyna.CreateByCoord(5000,2,2, 0.02, 0.02, 0.005, x, y, z);

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e6, 0.2, 0.0, 0.0, 20, 0.0, 0.05);

//对颗粒单独施加重力
pdyna.ApplyGravity(0.0, -9.8, 0.0);

//求解2万步
dyna.Solve(20000);

//打印信息
print("Solution is ok!");
