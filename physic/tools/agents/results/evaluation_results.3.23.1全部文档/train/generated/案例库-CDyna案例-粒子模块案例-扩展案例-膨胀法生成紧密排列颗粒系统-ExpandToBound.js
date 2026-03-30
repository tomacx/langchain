setCurDir(getSrcDir());

// 初始化仿真环境参数
dyna.Set("If_Particle_NForce_Incremental 0");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Contact_Detect_Tol 0.001");
dyna.Set("Time_Step 1e-4");

// 导入容器域基础网格对象
var containerMesh = imesh.importGid("container.msh");

// 加载容器边界到模型
pargen.addBound(containerMesh);

// 配置颗粒生成参数
var particleCount = 5000;
var particleRadius = 0.05;
var domainX = [-3, 1];
var domainY = [0.1, 2.4];
var domainZ = [0, 1];

// 创建紧密排列颗粒系统
pdyna.CreateByCoord(particleCount, 1, 1, particleRadius, 0.1, 0.05, domainX, domainY, domainZ);

// 设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e7, 0.25, 0.0, 0.0, 25, 0.0, 0.3);

// 设置波传播边界条件（X、Y、Z方向四周出流）
skwave.SetBound(0, 0, 0, 0, 0, 0);

// 流体-固体耦合：将渗流边界压力施加给固体边界
poresp.AddBoundPresToSolid();

// 配置结果输出设置（位移、应力、压力监测）
dyna.Set("Output_Variables Displacement Stress Pressure");

// 执行仿真计算
var totalSteps = 10000;
var step = 0;
while (step < totalSteps) {
    dyna.Solve(1);
    step++;
}

// 导出最终结果文件
var fso = new ActiveXObject("Scripting.FileSystemObject");
var filew = fso.CreateTextFile("Results.txt", true);

var totalElem = Math.round(dyna.GetValue("Total_FS_ElemNum"));
filew.WriteLine("Total Elements: " + totalElem);

for (var i = 1; i <= totalElem; i++) {
    var fcwidth = fracsp.GetElemValue(i, "CWidthIni");
    filew.WriteLine("Element " + i + ": " + fcwidth);
}

filew.Close();

print("Simulation completed successfully.");
