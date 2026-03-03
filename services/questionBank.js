// --- PREPNERVE "MEGA" QUESTION BANK (v4.0) ---
// Covers 22+ Specific Domains: Tech, Hybrid, & Business

const QUESTION_BANK = {
    // ==================================================
    // 🧠 1. AI & INTELLIGENCE SYSTEMS
    // (Generative AI, Agentic AI, ML, Multi-agent)
    // ==================================================
    "AI_Intelligence": [
        "Explain the difference between Discriminative and Generative AI.",
        "How do Autonomous Agents differ from standard chatbots?",
        "What is Retrieval-Augmented Generation (RAG) and why is it useful?",
        "Explain the concept of 'Chain of Thought' prompting.",
        "How do you handle hallucinations in Large Language Models (LLMs)?",
        "What are Domain-Specific Language Models (DSLMs)?",
        "Explain the architecture of a Multi-Agent System.",
        "How do you fine-tune a model using LoRA (Low-Rank Adaptation)?",
        "What is the role of Reinforcement Learning from Human Feedback (RLHF)?",
        "Explain the ethical implications of Agentic AI executing tasks autonomously.",
        "How does a Transformer architecture handle long-context windows?",
        "What is the difference between Zero-shot and Few-shot learning?",
        "How do you evaluate the performance of a GenAI model (BLEU, ROUGE)?",
        "Explain the concept of Vector Databases in AI.",
        "What is Model Quantization and how does it optimize inference?",
        "Describe a use case for Computer Vision in manufacturing.",
        "How do you prevent Prompt Injection attacks?",
        "What is the difference between a Foundation Model and a Fine-tuned Model?",
        "Explain the concept of 'Temperature' in LLM sampling.",
        "How do autonomous agents maintain state/memory across tasks?"
    ],


    "Machine Learning": [
        "Explain the bias-variance tradeoff.",
        "Difference between Supervised and Unsupervised learning?",
        "How do you handle missing or corrupted data?",
        "Explain Overfitting and how to prevent it (Regularization, Dropout).",
        "L1 (Lasso) vs L2 (Ridge) regularization?",
        "Explain the ROC curve and AUC score.",
        "How does a Random Forest algorithm work?",
        "Difference between Bagging and Boosting?",
        "Explain the vanishing gradient problem.",
        "How do you choose the number of clusters in K-Means?",
        "What is Cross-Validation and why is it important?",
        "Stochastic Gradient Descent (SGD) vs Batch Gradient Descent?",
        "Compare ReLU vs Sigmoid activation functions.",
        "How do you handle imbalanced datasets (SMOTE)?",
        "Explain Principal Component Analysis (PCA).",
        "What is Transfer Learning?",
        "How does a Support Vector Machine (SVM) work?",
        "Parametric vs Non-parametric models?",
        "One-Hot Encoding vs Label Encoding?",
        "How do you evaluate a regression model (RMSE, R-Squared)?"
    ],

    "Deep Learning": [
        "Explain the architecture of a CNN.",
        "What is Backpropagation?",
        "How does an LSTM solve vanishing gradients?",
        "Difference between Epoch, Batch, and Iteration?",
        "What is a Transformer and how does Self-Attention work?",
        "Explain Generative Adversarial Networks (GANs).",
        "Role of Optimizers (Adam, RMSprop)?",
        "How do you fine-tune BERT?",
        "What is Batch Normalization?",
        "Explain Word Embeddings (Word2Vec).",
        "Object Detection vs Image Segmentation?",
        "Explain Encoder-Decoder architecture.",
        "What is a Residual Network (ResNet)?",
        "How do you implement Early Stopping?",
        "Softmax vs Sigmoid in output layer?"
    ],

    "MLOps": [
        "How do you track experiments (MLflow, W&B)?",
        "Explain Model Drift vs Data Drift.",
        "How do you deploy a model with Docker?",
        "What is a Feature Store?",
        "Explain A/B testing for ML models.",
        "How do you monitor model performance in production?",
        "What is CI/CD for Machine Learning (CT/CD)?",
        "How do you handle model latency?",
        "Online Learning vs Batch Learning?",
        "Explain Kubeflow pipelines."
    ],
    // ==================================================
    // 💻 2. SOFTWARE & WEB DEVELOPMENT
    // (Full-Stack, Mobile, Low-Code/No-Code)
    // ==================================================
    "Software_Dev": [
        "Compare CSR (Client-Side Rendering) vs SSR (Server-Side Rendering).",
        "How do you optimize the performance of a React Native app?",
        "Explain the benefits of Micro-Frontends.",
        "What are the pros and cons of Low-Code platforms like OutSystems?",
        "How do you handle state management in a large-scale application?",
        "Explain the concept of Progressive Web Apps (PWA).",
        "What is the difference between GraphQL and REST?",
        "How do you secure a mobile application's API keys?",
        "Explain the 'BFF' (Backend for Frontend) pattern.",
        "What is WebAssembly (Wasm) and when would you use it?",
        "How do you handle offline functionality in a mobile app?",
        "Explain the difference between Flutter and React Native.",
        "What is Hydration in the context of web frameworks?",
        "How do you implement Role-Based Access Control (RBAC)?",
        "Explain the concept of 'Tree Shaking' in bundlers.",
        "What is the Virtual DOM?",
        "How do you handle WebSocket scalability?",
        "Explain Dependency Injection in Angular or NestJS.",
        "What are the security risks of No-Code platforms?",
        "How do you manage version control in a mono-repo?"
    ],

    // ==================================================
    // 📊 3. DATA & ANALYTICS
    // (Data Engineering, Science, BI)
    // ==================================================
    "Data_Analytics": [
        "What is the difference between an ETL and ELT pipeline?",
        "Explain the CAP theorem in the context of Big Data.",
        "How do you handle data skew in a distributed system like Spark?",
        "What is the difference between a Data Lake and a Data Warehouse?",
        "Explain the concept of Data Mesh architecture.",
        "How do you ensure data quality and lineage?",
        "What is CDC (Change Data Capture)?",
        "Explain the difference between Star Schema and Snowflake Schema.",
        "How do you optimize a slow SQL query on a billion-row table?",
        "What is a Columnar Database and when should you use it?",
        "Explain the concept of 'Data Observability'.",
        "How do you handle missing data in a dataset?",
        "What is the difference between Batch Processing and Stream Processing?",
        "Explain the role of a Semantic Layer in BI.",
        "How do you visualize high-dimensional data?",
        "What is the difference between OLTP and OLAP?",
        "Explain the concept of Slowly Changing Dimensions (SCD).",
        "How do you secure PII (Personally Identifiable Information) in a data pipeline?",
        "What is Apache Kafka used for?",
        "Explain the difference between Hadoop and Spark."
    ],

    "Data Science": [
        "What is the Central Limit Theorem?",
        "Correlation vs Causation?",
        "How do you detect outliers?",
        "Explain A/B testing statistical significance.",
        "Explain p-value and confidence intervals.",
        "How do you perform EDA?",
        "Type I vs Type II errors?",
        "Explain Bayes' Theorem.",
        "How do you deal with multicollinearity?",
        "Why is Data Cleaning 80% of the work?"
    ],

    // ==================================================
    // ☁️ 4. CLOUD & INFRASTRUCTURE
    // (Cloud-Native, Multi-Cloud, ObserveOps, Edge)
    // ==================================================
    "Cloud_Infra": [
        "What defines a 'Cloud-Native' application?",
        "Explain the strategy for a Multi-Cloud architecture.",
        "What is ObserveOps and how does it differ from traditional monitoring?",
        "How does Edge Computing reduce latency?",
        "Explain the difference between Containers and Virtual Machines.",
        "What is Kubernetes and how does it handle auto-scaling?",
        "Explain the concept of Infrastructure as Code (IaC).",
        "What is Serverless computing and what are its limitations?",
        "How do you handle disaster recovery in AWS/Azure?",
        "What is a Service Mesh (e.g., Istio)?",
        "Explain the 'Sidecar' pattern in Kubernetes.",
        "What is Immutable Infrastructure?",
        "How do you optimize cloud costs (FinOps)?",
        "Explain the difference between Public, Private, and Hybrid clouds.",
        "What is a Content Delivery Network (CDN)?",
        "How do you secure a VPC (Virtual Private Cloud)?",
        "What is Chaos Engineering?",
        "Explain the Blue-Green deployment strategy.",
        "What is Sharding in a cloud database?",
        "How do you manage secrets in a cloud environment?"
    ],

    // ==================================================
    // 🔒 5. CYBERSECURITY
    // (Zero Trust, Preemptive Security, AI Security)
    // ==================================================
    "Cybersecurity": [
        "Explain the core principles of Zero Trust Architecture (ZTA).",
        "What is Preemptive Cybersecurity?",
        "How do you secure an AI model against adversarial attacks?",
        "Explain the difference between EDR and XDR.",
        "What is the MITRE ATT&CK framework?",
        "How do you handle a Ransomware incident?",
        "Explain the concept of 'Least Privilege'.",
        "What is Polymorphic Malware?",
        "How do you secure a CI/CD pipeline (DevSecOps)?",
        "What is the difference between Symmetric and Asymmetric encryption?",
        "Explain the risks of API security (OWASP API Top 10).",
        "What is a Homomorphic Encryption?",
        "How does MFA (Multi-Factor Authentication) work?",
        "Explain the concept of a Honey Pot.",
        "What is Data Loss Prevention (DLP)?",
        "How do you conduct a Penetration Test?",
        "Explain CSRF and XSS attacks.",
        "What is Cloud Security Posture Management (CSPM)?",
        "How do you handle identity management (IAM)?",
        "What is a DDoS attack and how do you mitigate it?"
    ],

    // ==================================================
    // 🚀 6. EMERGING COMPUTING
    // (Quantum, Robotics, Web3, IoT)
    // ==================================================
    "Emerging_Tech": [
        "What is a Qubit and how does it differ from a classical bit?",
        "Explain the concept of Quantum Superposition.",
        "What is Physical AI in the context of robotics?",
        "How does a Blockchain reach consensus (PoW vs PoS)?",
        "What is a Smart Contract?",
        "Explain the architecture of an IoT system.",
        "What is Edge AI?",
        "How do you secure an IoT device network?",
        "What is a DAO (Decentralized Autonomous Organization)?",
        "Explain the concept of Digital Twins.",
        "What is MQTT protocol used for?",
        "How does 5G enable autonomous vehicles?",
        "What is Neuromorphic Computing?",
        "Explain the concept of Web3.",
        "What is SLAM (Simultaneous Localization and Mapping) in robotics?",
        "How do you handle data interoperability in IoT?",
        "What is a Non-Fungible Token (NFT) technially?",
        "Explain Quantum Entanglement.",
        "What is Fog Computing?",
        "How do swarms of drones communicate?"
    ],

    // ==================================================
    // 🏦 7. FINANCE & BANKING (BFSI)
    // ==================================================
    "Finance_BFSI": [
        "Explain the difference between Commercial and Investment banking.",
        "What is Risk Analytics and why is it crucial?",
        "How do you evaluate the creditworthiness of a borrower?",
        "What is the Basel III framework?",
        "Explain the concept of 'Derivatives'.",
        "How does high-frequency trading work?",
        "What is KYC (Know Your Customer) and AML (Anti-Money Laundering)?",
        "Explain the difference between Fiscal and Monetary policy.",
        "What is Asset Management?",
        "How do insurance companies calculate premiums?",
        "What is a Hedge Fund?",
        "Explain the concept of Liquidity Risk.",
        "What is Fintech's impact on traditional banking?",
        "How do you perform a DCF (Discounted Cash Flow) analysis?",
        "What is an IPO?",
        "Explain the role of the Federal Reserve.",
        "What is Underwriting?",
        "How does Blockchain impact cross-border payments?",
        "What is Open Banking?",
        "Explain the concept of 'Short Selling'."
    ],

    // ==================================================
    // 🏥 8. HEALTHCARE & LIFE SCIENCES
    // ==================================================
    "Healthcare": [
        "How do you ensure HIPAA compliance in medical data?",
        "Explain the phases of a Clinical Trial.",
        "What is Telemedicine and what are its challenges?",
        "How is AI used in medical diagnostics?",
        "What is CRISPR technology?",
        "Explain the concept of Personalized Medicine.",
        "How do Electronic Health Records (EHR) improve patient care?",
        "What is Medical Billing and Coding?",
        "Explain the drug discovery process.",
        "What is Biotechnology?",
        "How do you handle triage in an emergency room?",
        "What is the difference between Medicare and Medicaid?",
        "Explain the concept of interoperability in healthcare systems.",
        "What is Remote Patient Monitoring (RPM)?",
        "How do you manage hospital supply chains?",
        "What is Genomics?",
        "Explain the role of a Medical Science Liaison.",
        "How do vaccines work (mRNA vs Traditional)?",
        "What is Pharmacovigilance?",
        "How do you improve patient engagement?"
    ],

    // ==================================================
    // 💼 9. MANAGEMENT & OPERATIONS
    // ==================================================
    "Management": [
        "What is the difference between Strategic and Operational planning?",
        "How do you measure Operational Efficiency?",
        "Explain the SWOT analysis framework.",
        "What is Six Sigma?",
        "How do you manage stakeholder expectations?",
        "Explain the Agile project management methodology.",
        "What is Change Management?",
        "How do you calculate ROI (Return on Investment)?",
        "What is a KPI (Key Performance Indicator)?",
        "How do you handle a project that is over budget?",
        "Explain the concept of Lean Management.",
        "What is Supply Chain Optimization?",
        "How do you conduct a risk assessment?",
        "What is OKR (Objectives and Key Results)?",
        "How do you foster innovation in a corporate environment?",
        "Explain the 'Blue Ocean Strategy'.",
        "What is Business Process Reengineering (BPR)?",
        "How do you handle crisis management?",
        "What is Corporate Social Responsibility (CSR)?",
        "How do you analyze a P&L (Profit and Loss) statement?"
    ],

    // ==================================================
    // 👥 10. HUMAN RESOURCES (HR)
    // ==================================================
    "HR": [
        "How do you handle a toxic workplace culture?",
        "What metrics do you use for People Analytics?",
        "Explain your strategy for Talent Acquisition.",
        "How do you handle an exit interview?",
        "What is Employer Branding?",
        "How do you resolve a conflict between two managers?",
        "Explain the onboarding process for a remote employee.",
        "How do you ensure Diversity, Equity, and Inclusion (DEI)?",
        "What is Performance Management?",
        "How do you handle a sexual harassment complaint?",
        "What is a Compensation and Benefits strategy?",
        "How do you improve employee retention?",
        "Explain the difference between exempt and non-exempt employees.",
        "What is HRIS?",
        "How do you calculate employee churn rate?",
        "What is Succession Planning?",
        "How do you handle layoffs compassionately?",
        "What are the latest trends in HR tech?",
        "How do you measure employee engagement?",
        "Explain the concept of 'Quiet Quitting'."
    ],

    // ==================================================
    // 📈 11. SALES & MARKETING
    // ==================================================
    "Sales_Marketing": [
        "What is the difference between Inbound and Outbound marketing?",
        "How do you calculate Customer Acquisition Cost (CAC)?",
        "Explain the Sales Funnel.",
        "What is Content Strategy?",
        "How do you measure Brand Equity?",
        "What is Account-Based Marketing (ABM)?",
        "How do you handle customer objections?",
        "Explain the concept of SEO vs SEM.",
        "What is Customer Success?",
        "How do you create a User Persona?",
        "What is Growth Hacking?",
        "Explain the 4 Ps of Marketing.",
        "How do you calculate Lifetime Value (LTV)?",
        "What is Influencer Marketing?",
        "How do you use CRM tools effectively?",
        "What is a Go-to-Market (GTM) strategy?",
        "Explain A/B testing in marketing campaigns.",
        "How do you handle a PR crisis?",
        "What is Solution Selling?",
        "How do you nurture leads?"
    ],

    // ==================================================
    // 🏗️ SYSTEM DESIGN & ARCHITECTURE
    // ==================================================

    "System Design": [
        "Design a URL Shortener like Bit.ly.",
        "Design a scalable chat app (WhatsApp).",
        "Design a rate limiter.",
        "Design a video streaming service (Netflix).",
        "Design a notification system for millions of users.",
        "Architect a real-time leaderboard.",
        "Design a web crawler.",
        "How do you handle Database Sharding?",
        "Explain Consistent Hashing.",
        "Design a ride-matching system (Uber).",
        "Ensure High Availability and Fault Tolerance.",
        "Design an autocomplete search.",
        "Handle data replication and consistency.",
        "Design an image storage service (Instagram).",
        "Horizontal vs Vertical scaling?"
    ],

    // ==================================================
    // 💻 CORE TECH STACK
    // ==================================================

    "Frontend": [
        "Virtual DOM vs Real DOM?",
        "Critical Rendering Path?",
        "Explain Closures in JS.",
        "Optimize performance (Lighthouse).",
        "LocalStorage vs SessionStorage vs Cookies?",
        "Explain the Event Loop.",
        "What is a PWA?",
        "Handle CORS errors?",
        "CSS Grid vs Flexbox?",
        "What are Web Components?"
    ],

    "React": [
        "React Lifecycle methods?",
        "useMemo vs useCallback?",
        "What is React Fiber?",
        "Context API vs Redux?",
        "Higher-Order Components?",
        "Controlled vs Uncontrolled components?",
        "Hydration in SSR?",
        "Significance of 'key' prop?",
        "Optimize re-renders?",
        "What are React Portals?"
    ],

    "Node": [
        "Node.js Event Loop phases?",
        "How does Node handle concurrency?",
        "process.nextTick vs setImmediate?",
        "Debug memory leaks in Node?",
        "Streams and Buffers?",
        "Cluster vs Worker Threads?",
        "Secure a Node API?",
        "Express Middleware?",
        "Handle unhandled promise rejections?",
        "What is libuv?"
    ],

    "Python": [
        "Explain GIL.",
        "Generators vs Iterators?",
        "Python memory management?",
        "Explain decorators.",
        "List vs Tuple?",
        "Python Data Classes?",
        "__init__ vs __new__?",
        "pip vs poetry?",
        "Multithreading vs Multiprocessing?",
        "Lambda functions?"
    ],

    "Security": [
        "OWASP Top 10?",
        "Prevent SQL Injection?",
        "Prevent XSS?",
        "Explain CSRF.",
        "Symmetric vs Asymmetric encryption?",
        "How does HTTPS work?",
        "Hashing vs Encryption?",
        "Secure JWT tokens?",
        "Mitigate DDoS?",
        "Least Privilege principle?"
    ],

    // ==================================================
    // 💼 BUSINESS & SPECIALIZED DOMAINS
    // ==================================================
    
    "Finance_BFSI": [
        "Commercial vs Investment banking?",
        "Risk Analytics importance?",
        "Evaluate creditworthiness?",
        "Basel III framework?",
        "Explain Derivatives.",
        "High-frequency trading?",
        "KYC and AML?",
        "Fiscal vs Monetary policy?",
        "Asset Management?",
        "Hedge Funds?"
    ],

    "Healthcare": [
        "HIPAA compliance?",
        "Clinical Trial phases?",
        "Telemedicine challenges?",
        "AI in diagnostics?",
        "CRISPR technology?",
        "Personalized Medicine?",
        "EHR benefits?",
        "Medical Billing/Coding?",
        "Drug discovery process?",
        "Biotechnology?"
    ],

    "Marketing": [
        "Measure Social Media ROI?",
        "SEO vs SEM?",
        "Content Strategy?",
        "Sales Funnel?",
        "Identify Target Audience?",
        "Marketing Analytics tools?",
        "Handle PR crisis?",
        "A/B Testing?",
        "Increase Email Open Rates?",
        "Go-to-Market strategy?"
    ],

    "Supply_Chain": [
        "Procurement vs Purchasing?",
        "Just-In-Time (JIT)?",
        "Last-Mile Delivery?",
        "Cold Chain?",
        "Mitigate Supply Chain risks?",
        "Drop Shipping?",
        "Warehouse Management Systems?",
        "Customs compliance?",
        "Demand Forecasting?",
        "Bullwhip Effect?"
    ],

    "Sustainability": [
        "ESG?",
        "Calculate Carbon Footprint?",
        "Circular Economy?",
        "Greenwashing?",
        "Renewable Energy Credits?",
        "Life Cycle Assessment?",
        "LEED certification?",
        "Carbon Sequestration?",
        "Sustainable Supply Chain?",
        "GHG emissions reporting?"
    ],


    // ==================================================
    // 🚚 12. SUPPLY CHAIN & LOGISTICS
    // ==================================================
    "Supply_Chain": [
        "What is the difference between Procurement and Purchasing?",
        "Explain the Just-In-Time (JIT) inventory system.",
        "How do you manage Last-Mile Delivery?",
        "What is a Cold Chain?",
        "How do you mitigate supply chain risks?",
        "Explain the concept of Drop Shipping.",
        "What is Warehouse Management System (WMS)?",
        "How do you handle customs and compliance in global distribution?",
        "What is Demand Forecasting?",
        "Explain the Bullwhip Effect.",
        "What is Reverse Logistics?",
        "How do you evaluate supplier performance?",
        "What is Intermodal Transportation?",
        "How does Blockchain improve supply chain transparency?",
        "What is Incoterms?",
        "How do you optimize a fleet route?",
        "What is Cross-Docking?",
        "Explain the Triple Bottom Line in supply chains.",
        "How do you handle inventory shrinkage?",
        "What is 3PL (Third-Party Logistics)?"
    ],

    // ==================================================
    // ⚖️ 13. LEGAL & COMPLIANCE
    // ==================================================
    "Legal_Compliance": [
        "What is GDPR and who does it apply to?",
        "Explain the difference between Copyright, Patent, and Trademark.",
        "What is a Non-Disclosure Agreement (NDA)?",
        "How do you handle a data breach legally?",
        "What is Corporate Governance?",
        "Explain Anti-Trust laws.",
        "What is Due Diligence in M&A?",
        "How do you ensure Regulatory Compliance?",
        "What is a Smart Contract legally?",
        "Explain Employment Law basics.",
        "What is Whistleblower protection?",
        "How do you manage Intellectual Property (IP)?",
        "What is a Conflict of Interest?",
        "Explain SOX (Sarbanes-Oxley) compliance.",
        "What is Liability?",
        "How do you draft a Service Level Agreement (SLA)?",
        "What is Arbitration vs Litigation?",
        "Explain Insider Trading.",
        "What is a Compliance Audit?",
        "How do you handle international trade sanctions?"
    ],

    // ==================================================
    // 🏭 14. MANUFACTURING & ENGINEERING
    // ==================================================
    "Engineering_Manufacturing": [
        "What is Lean Manufacturing?",
        "Explain the concept of Six Sigma.",
        "What is Additive Manufacturing (3D Printing)?",
        "How do you handle Quality Control?",
        "What is VLSI in semiconductor design?",
        "Explain the difference between CAD and CAM.",
        "What is Predictive Maintenance?",
        "How does a SCADA system work?",
        "What is Industry 4.0?",
        "Explain the concept of Tolerance in mechanical engineering.",
        "What is Supply Chain integration in manufacturing?",
        "How do you optimize a production line?",
        "What is IoT in manufacturing (IIoT)?",
        "Explain the concept of 'Kanban'.",
        "What is Material Requirements Planning (MRP)?",
        "How do you ensure workplace safety (OSHA)?",
        "What is Rapid Prototyping?",
        "Explain Thermal Dynamics basics.",
        "What is a Digital Twin in engineering?",
        "How do you manage hazardous materials?"
    ],

    // ==================================================
    // 🌿 15. SUSTAINABLE & GREEN SERVICES
    // ==================================================
    "Sustainability": [
        "What is ESG (Environmental, Social, and Governance)?",
        "How do you calculate a Carbon Footprint?",
        "What is the Circular Economy?",
        "Explain Greenwashing.",
        "What are Renewable Energy Credits (RECs)?",
        "How do you conduct a Life Cycle Assessment (LCA)?",
        "What is LEED certification?",
        "Explain Carbon Sequestration.",
        "What is Sustainable Supply Chain Management?",
        "How do you report on GHG (Greenhouse Gas) emissions?",
        "What is Corporate Social Responsibility (CSR)?",
        "Explain the Paris Agreement targets.",
        "What is Energy Efficiency?",
        "How do you manage waste reduction?",
        "What is Impact Investing?",
        "Explain Biomimicry.",
        "What is Fair Trade?",
        "How do you implement a sustainability strategy?",
        "What is Water Footprint?",
        "Explain net-zero goals."
    ],

    // ==================================================
    // 💳 16. FINTECH (Hybrid)
    // ==================================================
    "FinTech": [
        "How does Peer-to-Peer (P2P) lending work?",
        "What is a Neo-Bank?",
        "Explain Algorithmic Trading.",
        "How do you secure mobile payments?",
        "What is a Robo-Advisor?",
        "Explain Decentralized Finance (DeFi).",
        "How do Payment Gateways work?",
        "What is RegTech?",
        "How does Blockchain validate transactions?",
        "What is 'Buy Now, Pay Later' (BNPL)?",
        "Explain Tokenization of assets.",
        "How do you prevent fraud in digital wallets?",
        "What is InsurTech?",
        "How do you handle cross-border remittances?",
        "What is Open Banking API?",
        "Explain High-Frequency Trading (HFT).",
        "What is a Stablecoin?",
        "How does AI detect financial fraud?",
        "What is Crowdfunding?",
        "Explain the concept of Digital Identity."
    ],

    // ==================================================
    // 🎓 17. EDTECH (Hybrid)
    // ==================================================
    "EdTech": [
        "What is an LMS (Learning Management System)?",
        "How do you implement Gamification in education?",
        "What is Adaptive Learning?",
        "Explain the flipped classroom model.",
        "How does AI personalize learning paths?",
        "What is MOOC?",
        "How do you ensure student data privacy (FERPA)?",
        "What is AR/VR in education?",
        "Explain Asynchronous vs Synchronous learning.",
        "What is Micro-learning?",
        "How do you measure student engagement online?",
        "What is SCORM compliance?",
        "How do you prevent cheating in online exams?",
        "What is Corporate Upskilling?",
        "Explain Blended Learning.",
        "How do you design an instructional video?",
        "What is Social Learning?",
        "How does EdTech bridge the skills gap?",
        "What is a Learning Experience Platform (LXP)?",
        "How do you handle accessibility in online courses?"
    ],

    // ==================================================
    // 🩺 18. MEDTECH (Hybrid)
    // ==================================================
    "MedTech": [
        "What is a Medical Device Class (I, II, III)?",
        "How does Remote Patient Monitoring work?",
        "What is IoMT (Internet of Medical Things)?",
        "Explain the approval process for a new medical device (FDA).",
        "What is Telehealth?",
        "How do you secure medical device data?",
        "What is a Wearable Health Device?",
        "Explain Robotic Surgery.",
        "How does AI assist in radiology?",
        "What is a Pacemaker?",
        "How do you handle interoperability between devices?",
        "What is Digital Therapeutics?",
        "Explain 3D bioprinting.",
        "What is a Smart Inhaler?",
        "How do you validate medical software?",
        "What is Point-of-Care testing?",
        "Explain the role of Big Data in MedTech.",
        "What is a Brain-Computer Interface (BCI)?",
        "How do you manage medical device supply chains?",
        "What is Nanomedicine?"
    ],

    // ==================================================
    // 🌾 19. AGTECH (Hybrid)
    // ==================================================
    "AgTech": [
        "What is Precision Agriculture?",
        "How do drones assist in farming?",
        "What is Vertical Farming?",
        "Explain IoT in agriculture.",
        "How do you monitor soil health remotely?",
        "What is Hydroponics?",
        "How does AI predict crop yields?",
        "What is Smart Irrigation?",
        "Explain supply chain transparency in food.",
        "What is Controlled Environment Agriculture (CEA)?",
        "How do automated tractors work?",
        "What is Livestock Monitoring?",
        "Explain the use of Satellite Imagery in farming.",
        "What is Aquaponics?",
        "How do you reduce food waste with tech?",
        "What is Gene Editing in crops?",
        "Explain Farm Management Software.",
        "What is Blockchain in the food supply chain?",
        "How do you handle pest control with tech?",
        "What is Regenerative Agriculture?"
    ],

    // ==================================================
    // 🏠 20. PROPTECH (Hybrid)
    // ==================================================
    "PropTech": [
        "What is Virtual Property Management?",
        "How does VR help in real estate sales?",
        "What is Fractional Real Estate Investing?",
        "Explain Smart Building technology.",
        "How do you use Big Data for property valuation?",
        "What is a Tenant Experience App?",
        "How does Blockchain handle property titles?",
        "What is Automated Valuation Model (AVM)?",
        "Explain Co-living and Co-working trends.",
        "How do you optimize energy in buildings?",
        "What is a Digital Twin of a building?",
        "How do you streamline the mortgage process?",
        "What is Real Estate Crowdfunding?",
        "Explain IoT in facility management.",
        "What is Construction Tech (ConTech)?",
        "How do you manage short-term rentals (Airbnb style)?",
        "What is predictive maintenance for buildings?",
        "How does AI match tenants to properties?",
        "What is Smart Access Control?",
        "Explain Green Building Tech."
    ],

    // ==================================================
    // 🏛️ 21. IT ARCHITECTURE
    // ==================================================
    "IT_Architecture": [
        "Explain the 7 domains of IT infrastructure.",
        "What is the difference between LAN and WAN?",
        "How do you secure a Remote Access domain?",
        "What is a DMZ (Demilitarized Zone)?",
        "Explain the architecture of a Data Center.",
        "What is SD-WAN?",
        "How do you design for High Availability?",
        "What is Network Segmentation?",
        "Explain the role of a Load Balancer.",
        "What is a VPN?",
        "How do you design a disaster recovery plan?",
        "What is Edge Architecture?",
        "Explain the OSI Model.",
        "What is a Storage Area Network (SAN)?",
        "How do you manage Identity and Access Management (IAM)?",
        "What is Virtualization?",
        "Explain Cloud Network Architecture.",
        "What is Zero Trust Network Access (ZTNA)?",
        "How do you monitor network performance?",
        "What is a Proxy Server?"
    ],

    // ==================================================
    // 🎓 22. EDUCATION & TRAINING (General)
    // ==================================================
    "Education": [
        "What is Curriculum Design?",
        "How do you assess student learning?",
        "Explain the difference between Andragogy and Pedagogy.",
        "What is Blended Learning?",
        "How do you handle classroom management?",
        "What is Special Education?",
        "Explain Formative vs Summative assessment.",
        "How do you use technology in the classroom?",
        "What is Instructional Design?",
        "How do you foster critical thinking?",
        "What is Project-Based Learning?",
        "Explain the role of a guidance counselor.",
        "How do you handle diverse learning styles?",
        "What is Vocational Training?",
        "How do you create an inclusive classroom?",
        "What is Lifelong Learning?",
        "Explain Standardized Testing.",
        "How do you mentor new teachers?",
        "What is Early Childhood Education?",
        "How do you manage parent-teacher relationships?"
    ],

    // ==================================================
    // 🛡️ FALLBACK
    // ==================================================
    "General": [
        "Tell me about yourself.",
        "Why do you want this role?",
        "Where do you see yourself in 5 years?",
        "Describe a challenge you overcame.",
        "What are your salary expectations?"
    ]
};

// --- CODING CHALLENGES BANK (TECH ONLY) ---
const CODING_CHALLENGES = {
   "JavaScript": [
        { title: "Flatten Array", question: "Write a function `flatten(arr)` that flattens a nested array of any depth.", starterCode: "function flatten(arr) {\n  // Code here\n}" },
        { title: "Debounce", question: "Implement a `debounce` function.", starterCode: "function debounce(func, delay) {\n  // Code here\n}" },
        { title: "Deep Clone", question: "Deep clone an object without JSON.parse.", starterCode: "function deepClone(obj) {\n  // Code here\n}" },
        { title: "LRU Cache", question: "Implement an LRU Cache class.", starterCode: "class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}" },
        { title: "Promise.all", question: "Polyfill Promise.all.", starterCode: "function myPromiseAll(promises) {\n  // Code here\n}" }
    ],
    "Python": [
        { title: "Valid Parentheses", question: "Check valid brackets '()[]{}'.", starterCode: "def isValid(s):\n    pass" },
        { title: "Two Sum", question: "Find indices adding to target.", starterCode: "def twoSum(nums, target):\n    pass" },
        { title: "Merge Intervals", question: "Merge overlapping intervals.", starterCode: "def merge(intervals):\n    pass" },
        { title: "Reverse Linked List", question: "Reverse a singly linked list.", starterCode: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverseList(head):\n    pass" },
        { title: "Top K Elements", question: "Find top K frequent elements.", starterCode: "def topKFrequent(nums, k):\n    pass" }
    ],
    "ML_DataScience": [
        { title: "Linear Regression", question: "Implement Simple Linear Regression from scratch (fit/predict).", starterCode: "class LinearRegression:\n    def __init__(self):\n        self.m = 0\n        self.c = 0\n\n    def fit(self, X, y):\n        pass\n\n    def predict(self, X):\n        pass" },
        { title: "Accuracy Metric", question: "Calculate Accuracy score manually.", starterCode: "def accuracy_score(y_true, y_pred):\n    # Return float\n    pass" },
        { title: "K-Means Logic", question: "Implement the update step for K-Means centroids.", starterCode: "def update_centroids(data, labels, k):\n    pass" },
        { title: "Standard Scaler", question: "Implement StandardScaler (mean=0, std=1).", starterCode: "def standardize(data):\n    pass" },
        { title: "Confusion Matrix", question: "Compute True Positives, FP, TN, FN.", starterCode: "def confusion_matrix(y_true, y_pred):\n    pass" }
    ],
    "SQL": [
        { title: "Find Duplicates", question: "Find duplicate emails in a table.", starterCode: "-- SELECT email FROM Users..." },
        { title: "Second Highest", question: "Get 2nd highest salary.", starterCode: "-- SELECT MAX(Salary)..." },
        { title: "Department Top 3", question: "Top 3 earners in each department.", starterCode: "-- SELECT Department, Employee, Salary..." }
    ],
    "SystemDesign": [
        // System Design is usually diagrammatic, but we can test basic estimation/schema code
        { title: "Rate Limiter", question: "Implement a simple Token Bucket rate limiter class.", starterCode: "class RateLimiter {\n  constructor(capacity, refillRate) {}\n  allowRequest() {}\n}" },
        { title: "URL Shortener", question: "Write a function to convert ID to Base62 string.", starterCode: "function idToShortURL(n) {\n  // Code here\n}" }
    ]
};

const getRandom = (arr) => arr ? arr[Math.floor(Math.random() * arr.length)] : null;

// --- UPDATED SMART SELECTOR LOGIC ---
const getResumeBasedQuestion = (resumeData) => {
    const resumeString = JSON.stringify(resumeData || "").toLowerCase();
    const roleString = (resumeData.role || "").toLowerCase();

    // 1. AI & INTELLIGENCE SYSTEMS (Specific Keywords)
    if (resumeString.includes("mlops") || resumeString.includes("pipeline")) return getRandom(QUESTION_BANK["MLOps"]);
    if (resumeString.includes("deep learning") || resumeString.includes("neural") || resumeString.includes("cnn") || resumeString.includes("bert")) return getRandom(QUESTION_BANK["Deep Learning"]);
    if (resumeString.includes("machine learning") || resumeString.includes("scikit")) return getRandom(QUESTION_BANK["Machine Learning"]);
    if (resumeString.includes("generative ai") || resumeString.includes("llm") || resumeString.includes("agent") || resumeString.includes("rag")) return getRandom(QUESTION_BANK["AI_Intelligence"]);
    
    // 2. EMERGING TECH & DATA
    if (resumeString.includes("quantum") || resumeString.includes("robotics") || resumeString.includes("web3") || resumeString.includes("blockchain") || resumeString.includes("iot")) return getRandom(QUESTION_BANK["Emerging_Tech"]);
    if (resumeString.includes("data") || resumeString.includes("analytics") || resumeString.includes("etl") || resumeString.includes("big data")) return getRandom(QUESTION_BANK["Data_Analytics"]);
    if (resumeString.includes("data science") || resumeString.includes("pandas") || resumeString.includes("statistics")) return getRandom(QUESTION_BANK["Data Science"]);

    // 3. HYBRID SECTORS
    if (roleString.includes("fintech") || resumeString.includes("fintech")) return getRandom(QUESTION_BANK["FinTech"]);
    if (roleString.includes("edtech")) return getRandom(QUESTION_BANK["EdTech"]);
    if (roleString.includes("medtech")) return getRandom(QUESTION_BANK["MedTech"]);
    if (roleString.includes("agtech")) return getRandom(QUESTION_BANK["AgTech"]);
    if (roleString.includes("proptech") || roleString.includes("real estate")) return getRandom(QUESTION_BANK["PropTech"]);

    // 4. CORE TECH & INFRASTRUCTURE
    if (resumeString.includes("cloud") || resumeString.includes("aws") || resumeString.includes("azure") || resumeString.includes("gcp")) return getRandom(QUESTION_BANK["Cloud_Infra"]);
    if (resumeString.includes("security") || resumeString.includes("cyber") || resumeString.includes("penetration") || resumeString.includes("owasp")) return getRandom(QUESTION_BANK["Cybersecurity"]);
    if (resumeString.includes("network") || resumeString.includes("lan") || resumeString.includes("wan") || resumeString.includes("infrastructure")) return getRandom(QUESTION_BANK["IT_Architecture"]);
    if (resumeString.includes("system design") || resumeString.includes("architect") || resumeString.includes("scalability")) return getRandom(QUESTION_BANK["System Design"]);
    
    // 5. SOFTWARE DEVELOPMENT (Aggregated)
    if (resumeString.includes("react") || resumeString.includes("node") || resumeString.includes("software") || resumeString.includes("full stack") || resumeString.includes("mobile") || resumeString.includes("web")) return getRandom(QUESTION_BANK["Software_Dev"]);

    // 6. BUSINESS & OPERATIONS
    if (roleString.includes("finance") || roleString.includes("bank") || roleString.includes("investment")) return getRandom(QUESTION_BANK["Finance_BFSI"]);
    if (roleString.includes("health") || roleString.includes("medical") || roleString.includes("doctor") || roleString.includes("nurse")) return getRandom(QUESTION_BANK["Healthcare"]);
    if (roleString.includes("supply") || roleString.includes("logistics") || roleString.includes("procurement")) return getRandom(QUESTION_BANK["Supply_Chain"]);
    if (roleString.includes("legal") || roleString.includes("law") || roleString.includes("compliance")) return getRandom(QUESTION_BANK["Legal_Compliance"]);
    if (roleString.includes("manufacture") || roleString.includes("civil") || roleString.includes("mechanical") || roleString.includes("engineering")) return getRandom(QUESTION_BANK["Engineering_Manufacturing"]);
    if (roleString.includes("sustain") || roleString.includes("green") || roleString.includes("environment") || roleString.includes("esg")) return getRandom(QUESTION_BANK["Sustainability"]);
    if (roleString.includes("hr") || roleString.includes("human resources") || roleString.includes("recruiter")) return getRandom(QUESTION_BANK["HR"]);
    if (roleString.includes("marketing") || roleString.includes("sales") || roleString.includes("seo")) return getRandom(QUESTION_BANK["Sales_Marketing"]);
    if (roleString.includes("manager") || roleString.includes("lead") || roleString.includes("operations")) return getRandom(QUESTION_BANK["Management"]);
    if (roleString.includes("teacher") || roleString.includes("education") || roleString.includes("training")) return getRandom(QUESTION_BANK["Education"]);

    // Fallback
    return getRandom(QUESTION_BANK["General"]);
};

const getCodingChallenge = (topic) => {
    const t = (topic || "").toLowerCase();
    
    // STRICT RULE: Non-Tech roles get NULL (No Coding Editor)
    const nonTech = ["finance", "health", "hr", "sales", "marketing", "legal", "education", "supply", "manager", "sustainability", "manufacturing"];
    if (nonTech.some(k => t.includes(k)) && !t.includes("developer") && !t.includes("engineer") && !t.includes("analyst")) return null;

    let key = "JavaScript"; // Default to JS for general web dev
    
    // AI / Python
    if (t.includes("python") || t.includes("ai") || t.includes("data") || t.includes("machine learning")) {
        // Randomly choose between pure Python algo or ML specific task
        return Math.random() > 0.5 
            ? { ...getRandom(CODING_CHALLENGES["Python"]), mode: "coding" }
            : { ...getRandom(CODING_CHALLENGES["ML_DataScience"]), mode: "coding" };
    }

    // SQL / Data
    if (t.includes("sql") || t.includes("database") || t.includes("analyst")) {
        return { ...getRandom(CODING_CHALLENGES["SQL"]), mode: "sql" };
    }

    // System Design (Architects)
    if (t.includes("architect") || t.includes("system design")) {
        return { ...getRandom(CODING_CHALLENGES["SystemDesign"]), mode: "coding" };
    }

    // General Web/JS
    if (t.includes("javascript") || t.includes("react") || t.includes("node")) {
        key = "JavaScript";
    }

    const challenge = getRandom(CODING_CHALLENGES[key]);
    return {
        question: `Technical Assessment: ${challenge.question}`,
        starterCode: challenge.starterCode,
        mode: "coding"
    };
};

module.exports = { getResumeBasedQuestion, getCodingChallenge };