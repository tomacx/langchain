setCurDir(getSrcDir());

// 清除现有数据
igeo.clear();
imeshing.clear();

// ========== 参数定义 =========
var lx = 10.0;      // X方向总长度(m)
var ly = 5.0;       // Y方向总长度(m)
var lz = 2.0;       // Z方向总长度(m)
var nx = 10;        // X方向网格数量
var ny = 5;         // Y方向网格数量
var nz = 4;         // Z方向网格数量

// ========== 几何创建 =========
for(var i=0; i<=nx; i++) {
    for(var j=0; j<=ny; j++) {
        for(var k=0; k<=nz; k++) {
            var x1 = lx * i / nx;
            var x2 = lx * (i+1) / nx;
            var y1 = ly * j / ny;
            var y2 = ly * (j+1) / ny;
            var z1 = lz * k / nz;
            var z2 = lz * (k+1) / nz;

            // 创建三维几何块体
            igeo.genBrickV(x1, y1, z1, x2, y2, z2, i*ny*nz + j*nz + k);
        }
    }
}

// ========== 网格生成 =========
imeshing.genMeshByGmsh(3, "mesh");

// ========== 导入网格到求解器 =========
GetMesh("mesh.msh", 1);

// ========== 网格分组 =========
SetGroupByID(1, 1);
SetGroupByID(2, 2);

// ========== 材料属性赋值 =========
// 弹性模量 (Pa)
var E = 30e9;
// 泊松比
var nu = 0.3;
// 密度 (kg/m^3)
var rho = 2500.0;

// 为分组1设置材料参数
SetMaterialParam(1, "E", E);
SetMaterialParam(1, "nu", nu);
SetMaterialParam(1, "rho", rho);

// ========== 边界条件设置 =========
// 固定底部节点 (Z=0)
SetBoundaryCondition("Fixed", [0.0, 0.0, 0.0], [lx, ly, lz]);

// ========== 监测点设置 =========
var monitorPoints = [];
monitorPoints.push([lx/2, ly/2, lz/2]);
monitorPoints.push([lx*0.75, ly*0.75, lz*0.75]);

for(var i=0; i<monitorPoints.length; i++) {
    var pt = monitorPoints[i];
    SetMonitorPoint(pt[0], pt[1], pt[2], "disp", "stress");
}

// ========== 求解控制参数 =========
var totalTime = 0.1;      // 总时间(s)
var dt = 1e-7;            // 时间步长(s)

SetSolverParam("TotalTime", totalTime);
SetSolverParam("Dt", dt);

// ========== 执行求解 =========
RunSolver();

// ========== 输出结果 =========
print("Simulation completed.");
print("Mesh file: mesh.msh");
print("Monitor points set: " + monitorPoints.length);
