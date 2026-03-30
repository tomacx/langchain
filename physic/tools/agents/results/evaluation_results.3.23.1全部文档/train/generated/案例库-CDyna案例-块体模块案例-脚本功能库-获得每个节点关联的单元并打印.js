setCurDir(getSrcDir());

dyna.Clear();

blkdyn.GenBrick2D(1, 1, 2, 2, 1);

var TotalNode = Math.round(dyna.GetValue("Total_Node_Num"));

for (var inode = 1; inode <= TotalNode; inode++) {
    var TotalComElem = Math.round(blkdyn.GetNodeValue(inode, "NeiElemSum"));

    for (var ielem = 1; ielem <= TotalComElem; ielem++) {
        var ElemID = Math.round(blkdyn.GetNodeValue(inode, "NeiElemID", ielem));
        var LocalNodeID = Math.round(blkdyn.GetNodeValue(inode, "LocalIDInNeiElem", ielem));

        print("Node ID  " + inode + "  NeiElemID  " + ElemID + "  LocalNodeID  " + LocalNodeID);
    }
}

dyna.Set("Output_Interval 500");

blkdyn.SetModel("linear");

blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

dyna.LoadUDF("CustomModel");

dyna.RunUDFCmd("PrintTotalVolume");

dyna.Set("If_Allow_UDF_Kernel 1");

dyna.Solve();

dyna.FreeUDF();
