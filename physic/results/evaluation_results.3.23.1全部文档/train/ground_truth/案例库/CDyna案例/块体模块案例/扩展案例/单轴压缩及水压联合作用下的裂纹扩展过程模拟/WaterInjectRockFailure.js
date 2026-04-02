//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.3");

//设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("If_Find_Contact_OBT 1");

dyna.Set("GiD_Out 0");

//包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 1");


var msh1=imesh.importGmsh("1.msh");
blkdyn.GetMesh(msh1);


blkdyn.CrtIFace(1, 1);
//更新接触面网格
blkdyn.UpdateIFaceMesh();


//设定所有单元的本构为线弹性本构
blkdyn.SetModel("MC");

///弹性模量5e11，请确认
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

//设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("brittleMC");

//接触面刚度需要为块体刚度的1-10倍
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6,1);

//设接触面刚度为单元特征刚度的1倍
blkdyn.SetIStiffByElem(1.0);

//设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.6);

//从固体单元接触面创建裂隙单元，只有弹簧的位置才加渗流
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e7,1e-14,1e-8,1,1);



//*************************************************************************
//***********设定压力边界条件

var TotalFracElem = Math.round(dyna.GetValue("Total_FS_ElemNum"));
var ielem = 1;
for(ielem = 1; ielem <= TotalFracElem; ielem++)
{
var xc = fracsp.GetElemValue(ielem,"Centroid",1);
var yc = fracsp.GetElemValue(ielem,"Centroid",2);
var zc = fracsp.GetElemValue(ielem,"Centroid",3);

	if(xc >= 0.01 && xc <= 0.06 && yc >= 0.01 && yc <= 0.13 && zc >= -0.00001 && zc <= 0.0000012)
	{

	var ID1 = fracsp.GetElemValue (ielem, "RelaElemID1");
	var ID2 = fracsp.GetElemValue (ielem, "RelaElemID2");
	if(ID1 < 0 || ID2 < 0)
	{
		var TN = Math.round( fracsp.GetElemValue(ielem,"TotalVertex") );

		for(var inode = 1; inode <= TN; inode++)
		{
			var NodeID = Math.round(fracsp.GetElemValue(ielem, "NodeID", inode)  );

			fracsp.SetNodeValue(NodeID, "IfFixPP",1);
			fracsp.SetNodeValue(NodeID, "FixedPP",2e6);
			fracsp.SetNodeValue(NodeID, "Sat",1.0);

		}
	}

	}

}

//***********设定压力边界条件
//*************************************************************************




print("Finish Apply");


dyna.Monitor("block", "syy", 0.035, 0.035, 0.6);
dyna.Monitor("fracsp", "sc_pp", 0.035, 0, 0);
dyna.Monitor("fracsp", "sc_pp", 0.035, 0.07, 0);


blkdyn.FixV("y", 0.0, "y", -1, 0.0001);
blkdyn.FixV("y",-0.1, "y", 0.1399,0.141);


blkdyn.SetLocalDamp(0.1);

dyna.Set("Time_Step 5e-8");

dyna.Set("FS_MaxWid 2e-4");


dyna.Solve(50000);


//打印提示信息
print("Solution Finished");
