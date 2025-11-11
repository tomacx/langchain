<template>
  <div>
    <h3>上传文件</h3>

    <input type="file" ref="file" />
    <button @click="upload">上传并入库</button>

    <div v-if="fileId" style="margin-top:20px;">
      <p>文件 ID: {{ fileId }}</p>

      <h3>提问</h3>
      <textarea
        v-model="question"
        rows="3"
        style="width:100%;"
        placeholder="请输入问题"
      ></textarea>

      <button @click="ask" style="margin-top:10px;">提问</button>

      <div v-if="answer" style="margin-top: 20px;">
        <h4>回答：</h4>
        <div style="white-space:pre-wrap;">{{ answer }}</div>
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
    };
  },

  methods: {
    // ===============================
    // ✅ 上传文件并触发后端 ingest
    // ===============================
    async upload() {
      const f = this.$refs.file.files[0];
      if (!f) {
        alert("请选择文件");
        return;
      }

      const form = new FormData();
      form.append("file", f);

      try {
        // ---- 1. 上传文件 ----
        const uploadRes = await axios.post("/api/upload/", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // 后端返回的数据结构：
        // {
        //   "id": 文件ID，
        //   ...
        // }
        this.fileId = uploadRes.data.id;

        // ---- 2. 调用 ingest 创建索引 ----
        await axios.post("/api/ingest/", {
          file_id: this.fileId,
        });

        alert("上传并入库完成！");
      } catch (e) {
        console.error("上传失败:", e);
        alert("上传失败，请检查后台日志");
      }
    },

    // ===============================
    // ✅ 提问流程
    // ===============================
    async ask() {
      if (!this.question) {
        alert("请输入问题");
        return;
      }

      try {
        const res = await axios.post("/api/query/", {
          file_id: this.fileId,
          question: this.question,
        });

        this.answer = res.data.answer;
      } catch (e) {
        console.error("提问失败:", e);
        alert("提问失败，请检查服务器");
      }
    },
  },
};
</script>