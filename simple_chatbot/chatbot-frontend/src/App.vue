<!-- <template>
  <div style="max-width:900px;margin:30px auto;font-family:Arial">
    <h2>RAG 问答系统（MVP）</h2>
    <UploadChat />
  </div>
</template>

<script>
import UploadChat from "./components/UploadChat.vue";
export default { components: { UploadChat } };
</script> -->
<template>
  <div style="padding:20px; max-width:600px; margin:auto;">

    <h2>RAG</h2>

    <!-- 上传模块 -->
    <div style="margin-top:20px;">
      <h3>上传文件</h3>

      <input type="file" ref="file" />

      <button
        @click="upload"
        style="margin-top:10px;padding:8px 16px;"
      >
        上传并入库
      </button>
    </div>

    <!-- 入库后显示文件 ID -->
    <div v-if="fileId" style="margin-top:30px;">
      <p>✅ 文件上传成功，ID：<strong>{{ fileId }}</strong></p>

      <h3>提问</h3>

      <textarea
        v-model="question"
        rows="4"
        style="width:100%; margin-top:10px;"
        placeholder="请输入你想问的问题"
      ></textarea>

      <button
        @click="ask"
        style="margin-top:10px; padding:8px 16px;"
      >
        提问
      </button>

      <div v-if="loading" style="margin-top:15px; color: #888;">
        ⏳ 正在生成回答...
      </div>

      <!-- 回答展示 -->
      <div v-if="answer" style="margin-top:20px;">
        <h4>回答：</h4>
        <pre style="white-space: pre-wrap; background:#fafafa; padding:10px; border:1px solid #ddd;">
{{ answer }}
        </pre>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      fileId: null,
      question: "",
      answer: "",
      loading: false,
    };
  },

  methods: {
    async upload() {
      const file = this.$refs.file.files[0];
      if (!file) {
        alert("请选择文件！");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        // 1. 上传文件
        const uploadRes = await axios.post("/api/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.fileId = uploadRes.data.id;

        // 2. 调用 ingest，构建向量库
        await axios.post("/api/ingest/", {
          file_id: this.fileId,
        });

        alert("✅ 文件上传成功并已完成向量入库");

      } catch (err) {
        console.error("上传失败：", err);
        alert("❌ 上传失败，请查看后端日志。");
      }
    },

    async ask() {
      if (!this.question) {
        alert("请输入问题");
        return;
      }

      this.loading = true;
      this.answer = "";

      try {
        const res = await axios.post("/api/query/", {
          file_id: this.fileId,
          question: this.question,
        });

        this.answer = res.data.answer;
      } catch (err) {
        console.error("提问失败：", err);
        alert("❌ 提问失败，请检查后端");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>