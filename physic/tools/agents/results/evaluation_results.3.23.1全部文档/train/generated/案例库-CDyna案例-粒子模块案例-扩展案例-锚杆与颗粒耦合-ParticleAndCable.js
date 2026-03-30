setCurDir(getSrcDir());

// ========== 1. 初始化求解器环境 ==========
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Contact_Detect_Tol 2e-3");
dyna.Set("Large_Displace 1");
dyna.Set("If_Cal_Bar 1");
dyna.Set("Bar_Out 1");

// ========== 2. 导入颗粒模型 ==========
pdyna.Import("gid", "1m1m.msh");

// ========== 3. 设置颗粒材料参数 ==========
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 3e8, 0.25, 1e7, 5e7, 30, 0.8, 0.0);

// ========== 4. 创建锚杆缆索元素 ==========
var anchorCount = 5;
for(var i = 0; i < anchorCount; i++) {
    var coord1 = new Array(0.1 + i * 0.2, 0.3, 0);
    var coord2 = new Array(0.1 + i * 0.2, 0.7, 0);
    bar.CreateByCoord("cable", coord1, coord2, 20);
}

// ========== 5. 设置锚杆材料属性 ==========
var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e7, 35, 1e11, 0.8, 0.0];
bar.SetPropByID(BarProp1, 1, 5, 1, 200);

// ========== 6. 设置边界条件 ==========
var coord1 = [-0.1, 0.5, 0];
var coord2 = [1.1, 0.5, 0];
pdyna.SetICMatByLine(-1, -1, 0.0, 0.0, 0.0, coord1, coord2);

pdyna.FixV("xyz", 0.0, "y", 0.98, 1.1);

// ========== 7. 设置监测点 ==========
dyna.Monitor("particle", "pa_ydis", 0, 0, 0);
dyna.Monitor("particle", "pa_ydis", 0.5, 0, 0);
dyna.Monitor("particle", "pa_ydis", 1, 0, 0);

// ========== 8. 执行求解 ==========
dyna.Solve(10000);
