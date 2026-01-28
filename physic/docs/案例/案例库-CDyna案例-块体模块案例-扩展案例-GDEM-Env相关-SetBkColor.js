setCurDir(getSrcDir());

for (var i = 0; i <= 255; i ++) {
	view.setBkColor(i, 0, 0);
	sleep(20);
}
for (var i = 0; i <= 255; i ++) {
	view.setBkColor(255, i, 0);
	sleep(20);
}
for (var i = 0; i <= 255; i ++) {
	view.setBkColor(255, 255, i);
	sleep(20);
}