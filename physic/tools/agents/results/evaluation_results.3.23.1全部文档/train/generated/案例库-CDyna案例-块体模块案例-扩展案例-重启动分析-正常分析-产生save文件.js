setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("SaveFile_Out 1");

blkdyn.GenBrick3D(10, 10, 10, 5, 5, 5, 1);

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 40, 15);

blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

dyna.BeforeCal();

for (var i = 0; i < 10000; i++) {
    blkdyn.CalBlockForce();
    var unbal = blkdyn.CalNodeMovement();
    dyna.OutputMonitorData();

    if (i != 0 && i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

dyna.Save("Elastic.sav");

blkdyn.SetLocalDamp(0.01);
blkdyn.SetModel("MC");

for (var j = 0; j < 5000; j++) {
    blkdyn.CalBlockForce();
    var unbal = blkdyn.CalNodeMovement();
    dyna.OutputMonitorData();

    if (j != 0 && j % 100 == 0) {
        print("重启动阶段不平衡率：" + unbal);
        dyna.PutStep(2, j, 0.1);
    }
}

dyna.Save("Plastic.sav");

blkdyn.SetLocalDamp(0.05);
blkdyn.SetModel("linear");

dyna.Restore("Elastic.sav");

for (var k = 0; k < 2000; k++) {
    blkdyn.CalBlockForce();
    var unbal = blkdyn.CalNodeMovement();
    dyna.OutputMonitorData();

    if (k != 0 && k % 100 == 0) {
        print("恢复后不平衡率：" + unbal);
        dyna.PutStep(3, k, 0.1);
    }
}
