#!/usr/bin/env python3
"""
快速检查文件编码问题的工具
检测哪些JS文件存在编码问题，并提供转换选项
"""

import os
from pathlib import Path
from typing import List, Dict, Tuple

class EncodingChecker:
    """文件编码检查器"""
    
    def __init__(self, directory: str):
        self.directory = Path(directory)
        self.results = {
            'utf8': [],
            'gbk': [],
            'gb2312': [],
            'gb18030': [],
            'big5': [],
            'unknown': []
        }
    
    def detect_encoding(self, file_path: Path) -> str:
        """
        检测单个文件的编码
        
        Returns:
            编码名称或'unknown'
        """
        encodings = ['utf-8', 'gbk', 'gb2312', 'gb18030', 'big5', 'latin-1']
        
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding, errors='strict') as f:
                    f.read()
                return encoding
            except (UnicodeDecodeError, UnicodeError):
                continue
            except Exception:
                continue
        
        return 'unknown'
    
    def scan_directory(self):
        """扫描目录中的所有JS文件"""
        print(f"📂 扫描目录: {self.directory}")
        print()
        
        js_files = list(self.directory.rglob("*.js"))
        total = len(js_files)
        
        print(f"找到 {total} 个JS文件")
        print("正在检测编码...")
        print()
        
        for i, file_path in enumerate(js_files, 1):
            if i % 50 == 0:
                print(f"  进度: {i}/{total}")
            
            encoding = self.detect_encoding(file_path)
            
            if encoding == 'utf-8':
                self.results['utf8'].append(file_path)
            elif encoding == 'gbk':
                self.results['gbk'].append(file_path)
            elif encoding == 'gb2312':
                self.results['gb2312'].append(file_path)
            elif encoding == 'gb18030':
                self.results['gb18030'].append(file_path)
            elif encoding == 'big5':
                self.results['big5'].append(file_path)
            else:
                self.results['unknown'].append(file_path)
        
        print(f"  完成: {total}/{total}")
        print()
    
    def print_report(self):
        """打印检查报告"""
        print("=" * 60)
        print("编码检查报告")
        print("=" * 60)
        print()
        
        total = sum(len(files) for files in self.results.values())
        
        # 统计
        print(f"📊 总文件数: {total}")
        print()
        
        print("编码分布:")
        for encoding, files in self.results.items():
            count = len(files)
            percentage = (count / total * 100) if total > 0 else 0
            
            if count > 0:
                status = "✅" if encoding == 'utf8' else "⚠️"
                print(f"  {status} {encoding.upper()}: {count} ({percentage:.1f}%)")
        
        print()
        
        # 问题文件
        problem_count = total - len(self.results['utf8'])
        if problem_count > 0:
            print(f"⚠️  发现 {problem_count} 个非UTF-8文件:")
            print()
            
            for encoding in ['gbk', 'gb2312', 'gb18030', 'big5', 'unknown']:
                files = self.results[encoding]
                if files:
                    print(f"  {encoding.upper()} ({len(files)} 个):")
                    for f in files[:5]:  # 只显示前5个
                        print(f"    - {f.name}")
                    if len(files) > 5:
                        print(f"    ... 还有 {len(files)-5} 个")
                    print()
        else:
            print("✅ 所有文件都是UTF-8编码！")
        
        print("=" * 60)
    
    def save_report(self, output_file: str = "encoding_report.txt"):
        """保存详细报告到文件"""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("文件编码检查报告\n")
            f.write("=" * 60 + "\n\n")
            
            total = sum(len(files) for files in self.results.values())
            f.write(f"总文件数: {total}\n\n")
            
            for encoding, files in self.results.items():
                if files:
                    f.write(f"\n{encoding.upper()} ({len(files)} 个):\n")
                    f.write("-" * 40 + "\n")
                    for file_path in files:
                        f.write(f"{file_path}\n")
        
        print(f"\n✓ 详细报告已保存到: {output_file}")


class EncodingConverter:
    """文件编码转换器"""
    
    @staticmethod
    def convert_file_to_utf8(file_path: Path, source_encoding: str = 'gbk', 
                            backup: bool = True) -> bool:
        """
        将单个文件转换为UTF-8
        
        Args:
            file_path: 文件路径
            source_encoding: 源编码
            backup: 是否备份原文件
            
        Returns:
            是否成功
        """
        try:
            # 读取原文件
            with open(file_path, 'r', encoding=source_encoding) as f:
                content = f.read()
            
            # 备份
            if backup:
                backup_path = str(file_path) + '.bak'
                os.rename(file_path, backup_path)
            
            # 写入UTF-8
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"  ❌ 转换失败: {file_path.name} - {e}")
            # 恢复备份
            if backup:
                backup_path = str(file_path) + '.bak'
                if os.path.exists(backup_path):
                    os.rename(backup_path, file_path)
            return False
    
    @staticmethod
    def batch_convert(files_by_encoding: Dict[str, List[Path]], 
                     backup: bool = True) -> Tuple[int, int]:
        """
        批量转换文件
        
        Args:
            files_by_encoding: 按编码分组的文件字典
            backup: 是否备份
            
        Returns:
            (成功数, 失败数)
        """
        success = 0
        failed = 0
        
        for encoding, files in files_by_encoding.items():
            if encoding == 'utf8' or not files:
                continue
            
            print(f"\n转换 {encoding.upper()} 文件 ({len(files)} 个)...")
            
            for file_path in files:
                if EncodingConverter.convert_file_to_utf8(file_path, encoding, backup):
                    success += 1
                    print(f"  ✓ {file_path.name}")
                else:
                    failed += 1
        
        return success, failed


def main():
    """主函数"""
    print("=" * 60)
    print("文件编码检查工具")
    print("=" * 60)
    print()
    
    # 获取目录
    default_dir = input("请输入要检查的目录路径（回车使用当前目录）: ").strip()
    if not default_dir:
        default_dir = "."
    
    directory = Path(default_dir)
    
    if not directory.exists():
        print(f"❌ 目录不存在: {directory}")
        return
    
    # 检查编码
    checker = EncodingChecker(directory)
    checker.scan_directory()
    checker.print_report()
    
    # 保存报告
    save_report = input("\n是否保存详细报告到文件？(y/n): ").strip().lower()
    if save_report == 'y':
        checker.save_report()
    
    # 询问是否转换
    problem_count = sum(len(files) for encoding, files in checker.results.items() 
                       if encoding != 'utf8')
    
    if problem_count > 0:
        print()
        convert = input(f"发现 {problem_count} 个非UTF-8文件，是否转换为UTF-8？(y/n): ").strip().lower()
        
        if convert == 'y':
            backup = input("是否备份原文件？(y/n，推荐y): ").strip().lower()
            do_backup = (backup == 'y')
            
            print()
            print("=" * 60)
            print("开始转换")
            print("=" * 60)
            
            # 执行转换
            success, failed = EncodingConverter.batch_convert(
                checker.results, 
                backup=do_backup
            )
            
            print()
            print("=" * 60)
            print("转换完成")
            print("=" * 60)
            print(f"  成功: {success}")
            print(f"  失败: {failed}")
            
            if do_backup:
                print(f"\n💡 提示: 备份文件以 .bak 结尾，确认无误后可以删除")
    else:
        print("\n✅ 无需转换！")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  操作已取消")
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()