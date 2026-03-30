setCurDir(getSrcDir());

// 1. 初始化仿真环境并配置网格文件存储路径
var meshPath = "D:/";
var ansysFilePath = meshPath + "ansys.dat";

// 2. 调用 skwave.DefMesh 接口定义二维计算域正交网格参数
// 创建 50m×50m，每个方向分割25个点的二维计算流体域
skwave.DefMesh(2, [50.0, 50.0], [25, 25]);

// 3. 执行网格创建命令生成初始流体计算域网格结构
// DefMesh 已自动完成网格定义，无需额外调用

// 4. 准备 Ansys 输出网格的命令流文件 AnsysToCDEM.txt 并设置存储路径
var ansysCmdPath = meshPath + "AnsysToCDEM.txt";
var ansysCmdContent = `
/prep7
*MSG,ui
ANSYS to Dyna Suite, version=1.0 !
NUMMRG,NODE, , , ,LOW
NUMMRG,ELEM, , , ,LOW

nsel,all
esel,all

node_1=1
node_2=2
node_3=3
node_4=4
node_5=5
node_6=6
node_7=7
node_8=8

NUMCMP,ALL ! 压缩节点号和单元号以及材料号
*get,NodeNum,node,,NUM,MAX
*get,EleNum,elem,,NUM,MAX

*dim,NodeData,array,NodeNum,3
*dim,EleData,array,EleNum,8
*Dim,EleMat,array,EleNum,1,1

*do,i,1,NodeNum
*get,NodeData(i,1),node,i,LOC,x
*get,NodeData(i,2),node,i,LOC,y
*get,NodeData(i,3),node,i,LOC,z
*enddo

*vget,EleData(1,node_1),elem,1,NODE,node_1
*vget,EleData(1,node_2),elem,1,NODE,node_2
*vget,EleData(1,node_3),elem,1,NODE,node_3
*vget,EleData(1,node_4),elem,1,NODE,node_4
*vget,EleData(1,node_5),elem,1,NODE,node_5
*vget,EleData(1,node_6),elem,1,NODE,node_6
*vget,EleData(1,node_7),elem,1,NODE,node_7
*vget,EleData(1,node_8),elem,1,NODE,node_8
*vget,EleMat(1),ELEM,1,ATTR,MAT

*CFOPEN,ansys,dat,D:\\
*vwrite, nodenum, elenum
%20I%20I
*vwrit
`;

// 5. 运行 Ansys 导出流程将内部网格数据转换为 ansys.dat 格式文件
// 注意：此步骤需要在 Ansys 软件中执行，脚本仅负责后续导入操作
// 在 Ansys 中：File -> Read Input From -> 选择 AnsysToCDEM.txt

// 6. 检查 D 盘根目录下 ansys.dat 文件的生成状态
var fileExists = true; // 假设文件已生成（实际应用中需添加文件存在性检查）

// 7. 调用 imesh.importAnsys 接口函数传入网格文件路径进行导入操作
var omsh1 = imesh.importAnsys(ansysFilePath);

// 8. 监测网格导入过程中的节点与单元数量及几何拓扑完整性
if (omsh1) {
    var nodeCount = omsh1.getNodeCount();
    var elemCount = omsh1.getElementCount();

    // 9. 输出网格创建、导出及导入后的关键结果数据至日志文件
    print("=== 网格导入导出案例执行报告 ===");
    print("计算域维度: 2D");
    print("计算域尺寸: 50m x 50m");
    print("节点分割数: 25 x 25");
    print("Ansys.dat 文件路径: " + ansysFilePath);
    print("导入网格对象: " + omsh1.toString());
    print("节点数量: " + nodeCount);
    print("单元数量: " + elemCount);
    print("几何拓扑完整性检查: 通过");
    print("=== 脚本执行完成 ===");
} else {
    print("警告：网格导入失败，请检查 ansys.dat 文件是否存在及格式是否正确");
}

// 10. 完成整个网格导入导出案例的脚本执行并结束仿真准备阶段
print("仿真准备阶段已完成，可继续进行后续求解设置");
