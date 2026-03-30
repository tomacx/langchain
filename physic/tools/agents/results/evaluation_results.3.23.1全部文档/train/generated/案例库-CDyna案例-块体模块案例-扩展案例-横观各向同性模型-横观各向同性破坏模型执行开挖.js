setCurDir(getSrcDir());

doc.clearResult();
dyna.Clear();
imeshing.clear();
igeo.clear();

// 创建计算域几何面（60m x 40m）
var f1 = igeo.genRect(0, 0, 0, 60, 40, 0, 2);

// 创建开挖区域几何面（中心位置，深度方向）
var f2 = igeo.genRect(27, 20, 0, 33, 24, 0, 0.5);

var loop = [f1, f2];
igeo.genSurface(loop, 1);

var loop = [f2];
igeo.genSurface(loop, 2);

// 生成网格
imeshing.genMeshByGmsh(2);

// 获取网格到块体模块
blkdyn.GetMesh(imeshing);

// 设置计算参数
dyna.Set("Virtural_Step 0.5");
dyna.Set("Output_Interval 1000");
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");

// 设置单元模型为横观各向同性
blkdyn.SetModel("TransIso");

// 设置基础材料参数（密度、弹性模量、泊松比等）
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);

// 定义各向异性面法向（45°方向）
var normal = new Array(1, 1, 0);

// 设置横观各向同性材料参数
// 各向同性面上的弹性模量、泊松比；垂直面上的弹性模量、泊松比
blkdyn.SetTransIsoMat(1, 3e10, 0.25, 1e10, 0.30, normal);

// 对组1-10的单元绑定横观各向同性材料号1
blkdyn.BindTransIsoMat(1, 1, 10);

// 设置边界约束（底部及四周法向）
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 60, "x", -0.001, 0.001);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);
blkdyn.FixV("y", 40, "y", -0.001, 0.001);

// 设置监测点（采集位移、应力等时程信息）
for(var i = 0; i < 11; i++) {
    dyna.Monitor("block", "ydis", 5 + i * 5, 40, 0);
}

// 求解至稳定状态
dyna.Solve();

// 保存初始状态
dyna.Save("initial.sav");

// 定义开挖区域节点位移初始化（模拟开挖后自由面）
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

// 将组号1到3范围内的节点位移初始化为设定值（模拟开挖）
blkdyn.InitConditionByGroup("displace", values, gradient, 1, 3);

// 移除模型进行开挖计算
blkdyn.SetModel("none", 2);

// 重新求解开挖过程
dyna.Solve();

// 保存开挖后结果
dyna.Save("excavation.sav");

// 输出监测数据到Result文件夹
dyna.OutputMonitorData();

// 推送最终步结果至Genvi平台
var stepCount = dyna.GetStepCount();
if(stepCount > 0) {
    dyna.PutStep(1, stepCount, 0.1);
}
