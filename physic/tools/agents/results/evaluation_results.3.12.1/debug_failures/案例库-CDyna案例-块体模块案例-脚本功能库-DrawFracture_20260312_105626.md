# Failure Analysis: 案例库-CDyna案例-块体模块案例-脚本功能库-DrawFracture.js

## Query
我想做一个CDyna案例的数值模拟，功能是CDyna案例，功能是块体模块案例-脚本功能库-DrawFracture。请根据 CDEM 技术手册，合理选择blkdyn、dyna等模块，帮我写一份完整可执行的 JavaScript 脚本，包含几何建模、网格划分、材料与模型设置、边界条件与载荷、求解参数和结果监测。

## Generated Code
```javascript
// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置输出的间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 -9.8 0.0");

// 打开单元大变形计算开关
dyna.Set("Large_Displace 1");

// 打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 设置计算时步为4e-5
dyna.Set("Time_Step 4e-5");

// 创建长宽为1m，厚5cm的板
blkdyn.ImportGrid("gid","element.msh");

// 设置单元模型为线弹性模型
blkdyn.SetModel("SoftenMC");

// 设置单元材料，依次为密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角
blkdyn.SetMat(2500, 1e8,0.25, 8e5, 8e5, 35, 15);

// 设置单元的局部阻尼
blkdyn.SetLocalDamp(0.05);

// 导入计算网格
var msh1=imesh.importAnsys("bricks.dat");

blkdyn.GetMesh(msh1);

// 将所有的单元面都切割为接触面
blkdyn.CrtIFace();

// 更新网格的拓扑信息
blkdyn.UpdateIFaceMesh();

// 设置单元的本构模型
blkdyn.SetModel("linear");

// 设置单元的本构材料
blkdyn.SetMat(2000,3e9,0.25,1e4,1e4,20,10);

// 设置单元的本构模型
blkdyn.SetIModel("ETSFM");

// 设置单元的本构材料
blkdyn.SetIMat(3e10,3e10, 10, 3e6, 1e6);

// 固定边界条件
blkdyn.FixV("y",0,"y",-0.001,0.001);
blkdyn.FixV("x",0,"x", -0.001,0.001);
blkdyn.FixV("x",0,"x", 9.999,11);

// 解算
dyna.Solve(30000);

// 打印结果
print("Simulation finished!");
```

## Ground Truth
```javascript
function DrawJointFracture(Color1R, Color1G, Color1B) 
{
    //获取总单元数
    var TotalElem = Math.round(dyna.GetValue("Total_Block_Num"));

    //循环所有单元
    for (var ielem = 1; ielem <= TotalElem; ielem++) 
    {
        var imodel = Math.round(blkdyn.GetElemValue(ielem, "Model"));

        if (imodel > 0)
        {

            //获得每个单元的面总数
            var TotalFace = Math.round(blkdyn.GetElemValue(ielem, "TotalFace"));


            var NShape = Math.round(blkdyn.GetElemValue(ielem, "Nshape"));



            //循环所有的面，获取面心
            for (var iface = 1; iface <= TotalFace; iface++) 
            {
                var IfCFace = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "IfContactFace",1));
                if (IfCFace == 1) 
                {
                    if (NShape < 5) 
                    {
                        var is1 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", 1));
                        var is2 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", 2));


                        var FraI1 = blkdyn.GetSpringValue(is1, "FractureIter");
                        var FraI2 = blkdyn.GetSpringValue(is2, "FractureIter");

                        if (FraI1 > 0 && FraI2 > 0) 
                        {


                            var coord1 = new Array(3);
                            var coord2 = new Array(3);

                            var node1 = Math.round(blkdyn.GetSpringValue(is1, "MotherNodeID"));
                            var node2 = Math.round(blkdyn.GetSpringValue(is2, "MotherNodeID"));

                            coord1[0] = blkdyn.GetNodeValue(node1, "Coord", 1);
                            coord1[1] = blkdyn.GetNodeValue(node1, "Coord", 2);
                            coord1[2] = blkdyn.GetNodeValue(node1, "Coord", 3);

                            coord2[0] = blkdyn.GetNodeValue(node2, "Coord", 1);
                            coord2[1] = blkdyn.GetNodeValue(node2, "Coord", 2);
                            coord2[2] = blkdyn.GetNodeValue(node2, "Coord", 3);

                            draw.SetColor(Color1R, Color1G, Color1B);

                            draw.line3d(coord1[0], coord1[1], coord1[2], coord2[0], coord2[1], coord2[2]);

                        }

                    }
                    else 
                    {
                        var nodesum = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "TotalNodeInFace",1));
                        var FracFlag = 0;

                        for (var inode = 1; inode <= nodesum; inode++) 
                        {
                            var SpID = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", inode));

                            var FraI = blkdyn.GetSpringValue(SpID, "FractureIter");

                            if (FraI > 0)
                            {
                                FracFlag++;
                            }
                        }

                        if (FracFlag == nodesum) 
                        {
                            for (var inode = 1; inode <= nodesum; inode++) 
                            {
                                var NID1 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "GlobalNodeID", inode));
                               
                                var inode2 = inode + 1;
                                
                                if (inode == nodesum) 
                                {
                                    inode2 = 1;
                                }
                                
                                var NID2 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "GlobalNodeID", inode2));

                                var coord1 = new Array(3);
                                var coord2 = new Array(3);

                                coord1[0] = blkdyn.GetNodeValue(NID1, "Coord", 1);
                                coord1[1] = blkdyn.GetNodeValue(NID1, "Coord", 2);
                                coord1[2] = blkdyn.GetNodeValue(NID1, "Coord", 3);

                                coord2[0] = blkdyn.GetNodeValue(NID2, "Coord", 1);
                                coord2[1] = blkdyn.GetNodeValue(NID2, "Coord", 2);
                                coord2[2] = blkdyn.GetNodeValue(NID2, "Coord", 3);

                                draw.SetColor(Color1R, Color1G, Color1B);

                                draw.line3d(coord1[0], coord1[1], coord1[2], coord2[0], coord2[1], coord2[2]);
                            }
                        }
 
                    }

                }

            }
        }
    }
    draw.commit();
    print("Draw finished!")

}



DrawJointFracture(255,255,255); 
```
