setCurDir( getSrcDir() );

igeo.clear();
imeshing.clear();

imeshing.genParRegularByCoord (3, "1",0.01, 0,2,0,2,0,2);

for(var i = 0; i < 18; i++)
{
let sel = new SelElems(imeshing);

sel.sphere(0,0,0,  3.6 - (i + 1 )* 0.2, 3.6 - i * 0.2 );

var iGrp = i + 1;

var strGrp = iGrp.toString();

imeshing.setGroup(strGrp, sel);
}

imesh.exportPDyna(imeshing, "pdyna.dat");
