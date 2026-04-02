// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开单元大变形计算开关
dyna.Set("Large_Displace 1");

// 打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为2e-3
dyna.Set("Contact_Detect_Tol 2e-3");

// 设置计算时步为5e-5
dyna.Set("Time_Step 5e-5");

// 打开棱-棱接触检测开关
dyna.Set("If_Cal_EE_Contact 1");

// 创建随机分布的颗粒
var x = [0, 1];
var y = [-1.2, -0.2];
var z = [0, 1];
pdyna.CreateByCoord(1000, 2, 2, 0.1, 0.1, 0.005, x, y, z);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e8, 0.2, 0.0, 0.0, 20, 0.01, 0.0);

// 刚性面创建
var fCoord = new Array();
fCoord[0] = [-2, -1.5, -2];
fCoord[1] = [-2, -1.5, 3];
fCoord[2] = [3, -1.5, 3];
fCoord[3] = [3, -1.5, -2];

// 导入刚性面
rdface.Import("gid", "GidGrp.msh");

// 根据几何自动创建Part
var nTotal = rdface.CrtPartAuto("geo");
print(nTotal);

// 设置计算步数并求解
dyna.Solve(1000);
