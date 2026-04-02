setCurDir(getSrcDir());

// 清除数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 设置计算参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("SaveFile_Out 1");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// 导入网格
var msh1 = imesh.importAnsys("bricks.dat");
blkdyn.GetMesh(msh1);

// 切割接触面并更新拓扑信息
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型和材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 5e10, 0.25, 1e6, 1e6, 25.0, 10.0, 1, 10);

// 设置接触面本构模型和强度
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();
blkdyn.SetIFracEnergyByCoord(100, 1000, -1E5, 1E5, -1E5, 1E5, -1E5, 1E5);

// 固定边界条件
blkdyn.FixV("xyz", 0.0, "y", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "y", 2.11, 2.13);
blkdyn.FixV("xyz", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "x", 2.51, 2.53);

// 设置监测信息
dyna.Monitor("block", "ydis", 0.64, 1.007, 0);
dyna.Monitor("block", "ydis", 1.14, 1.007, 0);

// 求解计算
dyna.Solve();

// 计算应变能
var Stain_Energy = 0.0;
var TotalElem = dyna.GetValue("Total_Block_Num");
TotalElem = Math.round(TotalElem);
for (var ielem = 1; ielem <= TotalElem; ielem++) {
    var siglev = 0.0;
    for (var i = 1; i <= 6; i++) {
        siglev += 0.5 * blkdyn.GetElemValue(ielem, "Stress", i) * blkdyn.GetElemValue(ielem, "Strain", i);
    }
    Stain_Energy += siglev * blkdyn.GetElemValue(ielem, "Volume");
}
print("应变能 = " + Stain_Energy);

// 计算外力功
var TotalNode = dyna.GetValue("Total_Node_Num");
TotalNode = Math.round(TotalNode);
var addno = 0;
var averDisp = 0.0;
for (var inode = 1; inode <= TotalNode; inode++) {
    var ycoord = blkdyn.GetNodeValue(inode, "Coord0", 2);
    if (ycoord >= 0.999) {
        averDisp += blkdyn.GetNodeValue(inode, "Displace", 2);
        addno++;
    }
}
if (addno > 0) {
    averDisp = averDisp / addno;
}
var work = 1e6 * 1 * 1 * Math.abs(averDisp);
print("外力功 = " + work);

// 计算阻尼耗散能
print("阻尼耗散能 = " + (work - Stain_Energy));
