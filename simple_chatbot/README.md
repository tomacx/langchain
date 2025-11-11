### 简易RAG问答网站

#### 技术栈
- 后端：Django、Langchain
- 采用模型：Deepseek(chat model)、Mistrail AI(embedding)
- 前端：vue.js

#### 运行方式

##### Step 1 创建环境
    # python3.12 支持 langchain v1.0.0 版本
    
    conda create -n simple_chatbot python=3.12 
    
    pip install -r requirements.txt

    # 在根目录下创建 .env 文件，并在文件内配置下列环境变量

    LANGCHAIN_API_KEY=<your langchain api key>
    DEEPSEEK_API_KEY=<your deepseek api key>
    LANGCHAIN_TRACING_V2=true
    LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
    LANGCHAIN_PROJECT=<your langchain project name>
    MISTRAL_API_KEY=<your mistral api key>

    # DATABASE
    MYSQL_DATABASE=<database name>
    MYSQL_USER=<username>
    MYSQL_PASSWORD=<password>
    MYSQL_HOST=<host>
    MYSQL_PORT=<port>

##### Step 2 启动后端
    # 在simple_chatbot目录下
    python manage.py makemigrations

    python manage.py migrate

    python manage.py runserver

##### Step 3 启动前端
    cd frontend
    npm install
    npm run dev # 或者 npm run serve 