//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//定义观察点坐标
var coord = new Array(10.0, 10.0, 0.0);

//设置计算时步
dyna.Set("Time_Step 1e-3");

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0  0.0 -9.8");

//设置接触容差为0.001m
dyna.Set("Contact_Detect_Tol 0.001");

//导入gid格式的刚性面边界
rdface.Import(2, "bound-mesh.msh");

//导入gid格式的颗粒
pdyna.Import("gid", "particle-coarse.msh");

//根据颗粒的ID号重新设置颗粒的组号
//pdyna.SetGroupByID(3, 1, 1111111);

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

//设置计算时步
dyna.Set("Time_Step 5e-3");

//求解至稳定
dyna.Solve();

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 10, 0.0, 0.1);

//迭代1万步
dyna.Solve(100000);

//计算安全系数
var fos = dyna.SolveFosByCriDisp(6000, 1e-3, coord, "static.sav");

//输出结果
print(fos);
