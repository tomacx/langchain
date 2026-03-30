setCurDir(getSrcDir());

// 清除模块数据
dyna.Clear();
doc.clearResult();

// ==================== 1. 全局仿真参数配置 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Renew_Interval 10");
dyna.Set("Contact_Detect_Tol 1e-4");
dyna.Set("UnBalance_Ratio 1e-5");

// ==================== 2. 导入颗粒模型网格 ====================
pdyna.Import("gid", "par.msh");

// ==================== 3. 设置颗粒材料本构（脆性断裂） ====================
pdyna.SetModel("brittleMC");
pdyna.SetMat(2500, 5e7, 0.25, 0, 0, 10, 0.8, 0.1);

// ==================== 4. 创建刚性面（关门结构） ====================
var fCoord = new Array();

// 上边界
fCoord[0] = new Array(0, -3, 0);
fCoord[1] = new Array(0, 5, 0);
rdface.Create(1, 1, 2, fCoord);

fCoord[0] = new Array(10, -3, 0);
fCoord[1] = new Array(10, 5, 0);
rdface.Create(1, 1, 2, fCoord);

// 下边界（关门结构）
for(var i = 0; i < 5; i++) {
    fCoord[0] = new Array(i * 2, 0, 0);
    fCoord[1] = new Array(i * 2 + 2, 0, 0);
    rdface.Create(1, 2 + i, 2, fCoord);
}

// 左边界
fCoord[0] = new Array(0, -3, 0);
fCoord[1] = new Array(10, -3, 0);
rdface.Create(1, 1, 2, fCoord);

// 右边界
for(var i = 0; i < 4; i++) {
    fCoord[0] = new Array(i * 2 + 2, -3, 0);
    fCoord[1] = new Array(i * 2 + 2, 0, 0);
    rdface.Create(1, 1, 2, fCoord);
}

// ==================== 5. 设置接触关系及阻尼参数 ====================
dyna.Set("Block_Rdface_Contact_Scheme 3");

// 设置刚性面与颗粒的接触模型
for(var i = 0; i < 5; i++) {
    rdface.SetModelByGroup(0, i + 2, i + 2);
}

// ==================== 6. 施加初始速度场（动力加载） ====================
dyna.Set("Particle_Out_Kill 2 0 2 -1 0 -100 100 1");
dyna.Set("Particle_Out_Stop_Cal 1 2 2 0.1");

// ==================== 7. 调整求解器控制参数 ====================
dyna.TimeStepCorrect(0.5);

// ==================== 8. 启动动态分析计算 ====================
dyna.Solve();

// ==================== 9. 设置不同工况并循环求解 ====================
for(var i = 0; i < 5; i++) {
    dyna.Set("Particle_Out_Kill 2 " + (i * 2) + " " + (i * 2 + 2) + " -1 0 -100 100 1");
    dyna.Set("Particle_Out_Stop_Cal 1 2 2 0.1");

    rdface.SetModelByGroup(0, i + 2, i + 2);
    dyna.Solve();

    rdface.SetModelByGroup(1, i + 2, i + 2);
}

// ==================== 10. 恢复初始状态并继续求解 ====================
dyna.Set("Particle_Out_Stop_Cal 0 2 2 0.1");
dyna.Solve();

// ==================== 11. 设置材料参数（矸石） ====================
pdyna.SetMat(2500, 5e7, 0.25, 0, 0, 10, 0.0, 0.1);

// ==================== 12. 导出结果文件 ====================
doc.SaveResult();
