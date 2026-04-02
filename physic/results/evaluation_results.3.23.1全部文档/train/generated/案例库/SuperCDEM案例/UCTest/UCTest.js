//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//计算结果输出间隔设为100步
scdem.outputInterval = 100;

//打开虚质量计算开关（根据案例参考，但未在生成要求中提及）
scdem.isVirtualMass = 1;

//设置单元模型为线弹性模量
scdem.setModel("linear");

//导入网格文件并获取网格数据
var msh = imesh.importGmsh("pan-300000.msh");
scdem.getMesh(msh);

//设置单元的材料参数（密度，弹性模量，泊松比，断裂能，接触断裂能量，摩擦角，内聚力）
scdem.setMat([2700, 60e9, 0.2, 25e6, 15e6, 40,10]);

//设置交界面的模型为断裂模型
scdem.setIModel("FracE");
scdem.setIMatByElem(10);

//最底侧节点法向约束（根据案例参考，但未在生成要求中提及）
oSel = new SelNodes(scdem);
oSel.box(-1e10,-0.0301,-1e10, 1e10,-0.0299,1e10);
scdem.setVel(oSel, "y", 0);

//最顶侧节点施加准静态速度载荷（根据案例参考，但未在生成要求中提及）
oSel = new SelNodes(scdem);
oSel.box(-1e10,0.0299,-1e10, 1e10,0.0301,1e10);
scdem.setVel(oSel, "y", -5e-9);

//设置局部阻尼
scdem.localDamp = 0.8;

//计算步数设为10万步（根据案例参考，但未在生成要求中提及）
scdem.solveGpu(100000);

//释放GPU端内存（根据案例参考，但未在生成要求中提及）
scdem.releaseGpuMem();

//打印提示信息
print("Solution Finished");
