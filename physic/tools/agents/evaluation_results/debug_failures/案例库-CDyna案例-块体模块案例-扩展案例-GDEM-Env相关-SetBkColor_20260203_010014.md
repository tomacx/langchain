# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-GDEM-Env相关-SetBkColor.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-GDEM-Env相关-SetBkColor

## Generated Code
```javascript
blkdyn.SetBkColor(1, "red", 0.8);
```

## Ground Truth
```javascript
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
```
