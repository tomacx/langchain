//产生第一组参数化的六面体网格
var acoord = new Array();
acoord[0] = [0,0,0];
acoord[1] = [4,0,0];
acoord[2] = [4,4,0];
acoord[3] = [0,4,0];
acoord[4] = [0,0,2];
acoord[5] = [4,0,2];
acoord[6] = [4,4,2];
acoord[7] = [0,4,2];

imeshing.genHex("f1",acoord, 10,10,5);

//产生第二组参数化的六面体网格
acoord[0] = [-2,3,0];
acoord[1] = [0,2,0];
acoord[2] = [0,4,0];
acoord[3] = [-2,4,0];

acoord[4] = [-2,3,2];
acoord[5] = [0,2,2];
acoord[6] = [0,4,2];
acoord[7] = [-2,4,2];
imeshing.genHex("f2",acoord, 5,5,5);


//产生第三组参数化的六面体网格
acoord[0] = [-2,1,0];
acoord[1] = [0,2,0];
acoord[2] = [0,0,0];
acoord[3] = [-2,0,0];
acoord[4] = [-2,1,2];
acoord[5] = [0,2,2];
acoord[6] = [0,0,2];
acoord[7] = [-2,0,2];
imeshing.genHex("f3",acoord, 5,5,5);
