setCurDir(getSrcDir());

// 清除所有模块数据
dyna.Clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（向下）
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出间隔
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步
dyna.Set("Monitor_Iter 10");

// 自动存储.sav文件
dyna.Set("SaveFile_Out 1");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 导入围岩网格（示例：从文件导入或生成）
var msh = imesh.importAnsys("rock-mesh.dat");
blkdyn.GetMesh(msh);

// 创建计算域内的锚杆
var bar1 = new Array();
bar1[0] = [2.0, 3.5, 0];
bar1[1] = [8.0, 3.5, 0];
bar.CreateByDir("cable", bar1[0], bar1[1], 3, 20);

var bar2 = new Array();
bar2[0] = [4.0, 4.5, 0];
bar2[1] = [8.0, 4.5, 0];
bar.CreateByDir("cable", bar2[0], bar2[1], 3, 20);

var bar3 = new Array();
bar3[0] = [6.0, 5.5, 0];
bar3[1] = [8.0, 5.5, 0];
bar.CreateByDir("cable", bar3[0], bar3[1], 3, 20);

// 将所有锚杆设置为可破坏模型
bar.SetModelByID("failure", 1, 100);

// 定义锚杆材料参数（自由段和锚固段）
var BarPropFree = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];
var BarPropBond = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];

// 设置锚杆各段材料属性
bar.SetPropByID(BarPropFree, 1, 10, 1, 15);
bar.SetPropByID(BarPropBond, 1, 10, 16, 20);

// 在锚杆节点上施加预应力（10kN）
bar.ApplyPreTenForce(1e4, 1, 11, 1, 1);

// 设置围岩材料参数（线弹性模型）
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e8, 0.25, 3e6, 1e6, 15, 10);

// 创建接触面并更新拓扑信息
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置接触面本构模型为线性接触
blkdyn.SetIModel("linear");

// 接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 设置边界条件（固定底部和两侧）
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);

// 设置监测信息：锚杆位移、接触力、块体破坏度等
dyna.Monitor("block", "ydis", 0.64, 1.007, 0);
dyna.Monitor("block", "ydis", 1.14, 2.0, 0);
dyna.Monitor("bar", "xdis", 1, 1, 1);
dyna.Monitor("rdface", "rg_bxForce", 1, 10, 1);
dyna.Monitor("gvalue", "gv_block_crack_ratio");

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 启动核心求解器
dyna.Solve();

// 等待计算完成（可根据实际情况调整）
var TotalBar = Math.round(dyna.GetValue("Total_Bar_Num"));

for(var ibar = 1; ibar <= TotalBar; ibar++)
{
    var TotalSeg = Math.round(bar.GetBarInfo(ibar, "TotalSeg"));

    for(var iseg = 1; iseg <= TotalSeg; iseg++)
    {
        var failtype = bar.GetSegValue(ibar, iseg, "FailType");

        if(failtype > 0.0001)  // 发生破坏
        {
            var Coord1x = bar.GetNodeValue(ibar, iseg, "Coord", 1);
            var Coord1y = bar.GetNodeValue(ibar, iseg, "Coord", 2);
            var Coord1z = bar.GetNodeValue(ibar, iseg, "Coord", 3);

            var Coord2x = bar.GetNodeValue(ibar, iseg + 1, "Coord", 1);
            var Coord2y = bar.GetNodeValue(ibar, iseg + 1, "Coord", 2);
            var Coord2z = bar.GetNodeValue(ibar, iseg + 1, "Coord", 3);

            var AverC_x = (Coord1x + Coord2x) * 0.5;
            var AverC_y = (Coord1y + Coord2y) * 0.5;
            var AverC_z = (Coord1z + Coord2z) * 0.5;

            draw.SetColor(255, 0, 0);
            draw.point(AverC_x, AverC_y, AverC_z);
        }
    }
}

// 输出块体破坏度统计信息
var brokenRatio = dyna.GetValue("gv_block_broken_ratio");
var crackRatio = dyna.GetValue("gv_block_crack_ratio");
var strongDamageRatio = dyna.GetValue("gv_block_strong_damage_ratio");
var weakDamageRatio = dyna.GetValue("gv_block_weak_damage_ratio");

console.log("块体总破坏度: " + brokenRatio);
console.log("块体总体破裂度: " + crackRatio);
console.log("块体强损伤区体积占比: " + strongDamageRatio);
console.log("块体弱损伤区体积占比: " + weakDamageRatio);

// 绘制结果并提交
draw.clear();
draw.commit();
