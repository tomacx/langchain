//本脚本函数用于对复杂边界的外表面自动添加速度约束
//复杂边界的外表面的法向如果垂直于Z轴，随即施加约束
function ApplySroundBound(Tol)
{
    var fnormal = [0.0, 0.0, 1.0];
    //获取总单元数
    var TotalElem = Math.round(dyna.GetValue("Total_Block_Num"));

    var TotalNode = Math.round(dyna.GetValue("Total_Node_Num"));

    var NodeFlag = new Array(TotalNode + 1);

    for(var i = 1; i <= TotalNode; i++)
    {
        NodeFlag[i] = 0;
    }

    //循环所有单元
    for (var ielem = 1; ielem <= TotalElem; ielem++)
    {
        var imodel = Math.round(blkdyn.GetElemValue(ielem, "Model"));

        if (imodel > 0)
        {
            //获得每个单元的面总数
            var TotalFace = Math.round(blkdyn.GetElemValue(ielem, "TotalFace"));

            //循环所有的面，获取面心
            for (var iface = 1; iface <= TotalFace; iface++) {
                var nodesum = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "TotalNodeInFace", 1));
                var IfCFace = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "IfContactFace", 1));

                var GoodFaceFlag = 0;
                if (IfCFace == 1)
                {
                    var FracFlag = 0;

                    for (var inode = 1; inode <= nodesum; inode++) {
                        var SpID = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", inode));

                      var FraI = Math.round( blkdyn.GetSpringValue(SpID, "IfHaveContact") );

                        if (FraI == 0) {
                            FracFlag++;
                        }
                    }

                    if (FracFlag == nodesum) {

                        GoodFaceFlag = 1;
                    }
                }
                else {

                    var IndiFlag = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "NeighborFace", 1));

                    if (IndiFlag == -1) {
                        GoodFaceFlag = 1;
                    }
                }


                if (GoodFaceFlag == 1) {

                    var nx = blkdyn.GetElemFaceValue(ielem, iface, "LocalCoordSystem", 7);
                    var ny = blkdyn.GetElemFaceValue(ielem, iface, "LocalCoordSystem", 8);
                    var nz = blkdyn.GetElemFaceValue(ielem, iface, "LocalCoordSystem", 9);

                    var dotv = Math.abs(nx * fnormal[0] + ny * fnormal[1] + nz * fnormal[2]);

                    if (dotv < Tol) {

                     for (var inode = 1; inode <= nodesum; inode++) {
                        var GNID = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "GlobalNodeID", inode));

                       NodeFlag[GNID] = 1;
                    }

                    }


                }
            }
        }
    }

   var TotalSpring = Math.round(dyna.GetValue("Total_Spring_Num"));

var AddNewNode = 0;

do
{
  AddNewNode = 0;
  for(var i = 1; i <= TotalSpring; i++)
   {
        var IfContact = Math.round ( blkdyn.GetSpringValue(i, "IfHaveContact") );
        if(IfContact  == 1)
        {
            var MID = Math.round ( blkdyn.GetSpringValue(i, "MotherNodeID") );

            if(NodeFlag [MID] == 1 )
            {
                    var TBID = Math.round ( blkdyn.GetSpringValue(i, "TargetBlockID") );
                    var TFID = Math.round ( blkdyn.GetSpringValue(i, "TargetFaceID") );
                    var nodesum = Math.round(blkdyn.GetElemFaceValue(TBID, TFID, "TotalNodeInFace"));
                    for (var inode = 1; inode <= nodesum; inode++)
                    {
                          var ifwt = blkdyn.GetSpringValue(i, "WeightValue", inode);
                         //母点在对侧面上的插值点与对侧面某一点距离很近
                         if(ifwt > 0.99)
                         {
                               var GNID = Math.round(blkdyn.GetElemFaceValue(TBID, TFID, "GlobalNodeID", inode));
                               if( NodeFlag[GNID] != 1)
                               {
                                    NodeFlag[GNID] = 1;
                                    AddNewNode++;
                               }

                         }

                    }
             }

        }
   }

print("AddNewNode:  " + AddNewNode);
}
  while(AddNewNode > 0);


   for(var i = 1; i <= TotalNode; i++)
   {
        if( NodeFlag[i] == 1)
       {
                blkdyn.SetNodeValue(i,"IfFixVel",1.0, 1);
                blkdyn.SetNodeValue(i,"IfFixVel",1.0, 2);
                blkdyn.SetNodeValue(i,"IfFixVel",1.0, 3);
                blkdyn.SetNodeValue(i,"FixedVel",0.0, 1);
                blkdyn.SetNodeValue(i,"FixedVel",0.0, 2);
                blkdyn.SetNodeValue(i,"FixedVel",0.0, 3);
       }
   }

    print("The surrouding bound is applied successfully!");

}

//施加模型四周边界条件
ApplySroundBound(1e-1);
