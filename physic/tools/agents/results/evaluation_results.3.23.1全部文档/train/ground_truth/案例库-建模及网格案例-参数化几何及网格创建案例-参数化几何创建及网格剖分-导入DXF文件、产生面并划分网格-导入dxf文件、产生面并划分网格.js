setCurDir(getSrcDir());


for(var i = 1; i <= 5; i++)
{

igeo.clear();
imeshing.clear();


var filename = "Drawing" + i + ".dxf";

igeo.import("dxf",filename);

if(i == 5)
{
//线段求交
igeo.lineInt();
}
//自动产生面，面至多由15条线组成
igeo.genSurfAuto(15);

//休眠2秒
sleep(2000);

igeo.setSize("surface",10,1,111111);

imeshing.genMeshByGmsh(2);

//休眠3秒
sleep(5000);

}
