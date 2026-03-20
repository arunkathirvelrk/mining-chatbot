MINING_KEYWORDS = [

    # ===============================
    # 🔰 GENERAL COAL MINING TERMS
    # ===============================
    "coal", "coal mining", "coal mine", "mining industry",
    "surface mining", "opencast mining", "underground mining",
    "longwall mining", "bord and pillar", "shaft", "gallery",
    "coal seam", "overburden", "stripping ratio",
    "mine development", "mine planning", "life of mine",
    "mine production", "coal extraction", "mine operations",
    "Mining laws",

    # ===============================
    # 📜 STATUTES / ACTS (VERY IMPORTANT)
    # ===============================
    "mines act 1952",
    "mmrd act 1957",
    "coal mines act",
    "coal mines regulations 2017",
    "coal bearing areas act 1957",
    "environment protection act 1986",
    "forest conservation act 1980",
    "water act 1974",
    "air act 1981",
    "labour laws in mines",
    "industrial disputes act",
    "minimum wages act",
    "employees compensation act",
    "factories act",
    "explosives act",
    "petroleum and explosives safety organisation rules",

    # ===============================
    # 📢 STATUTORY NOTICES & LEGAL DOCUMENTS
    # ===============================
    "statutory notice",
    "legal notice in mining",
    "show cause notice",
    "compliance notice",
    "violation notice",
    "closure notice",
    "prohibition notice",
    "improvement notice",
    "suspension notice",
    "penalty notice",
    "inspection notice",
    "accident notice",
    "danger notice",
    "warning notice",
    "enforcement notice",
    "government notification",
    "gazette notification",
    "circular", "office order",
    "directive", "advisory",
    "compliance report",
    "statutory returns",
    "annual returns mining",
    "monthly returns mining",

    # ===============================
    # 🏢 GOVERNMENT AUTHORITIES & BODIES
    # ===============================
    "dgms", "directorate general of mines safety",
    "ministry of coal",
    "coal india limited",
    "cmpdi",
    "coal controller organisation",
    "indian bureau of mines",
    "state mining department",
    "pollution control board",
    "moefcc",
    "district mining office",
    "labour department",

    # ===============================
    # 📑 TENDER, AUCTION & ALLOCATION (START STAGE)
    # ===============================
    "coal block auction",
    "mine tender",
    "tender document",
    "e tender mining",
    "technical bid", "financial bid",
    "bid evaluation",
    "letter of award",
    "contract agreement",
    "mine allocation",
    "coal block allocation",
    "revenue sharing",
    "performance guarantee",
    "bank guarantee",
    "mining lease",
    "prospecting license",
    "exploration license",

    # ===============================
    # 🔍 EXPLORATION & SURVEY
    # ===============================
    "geological survey",
    "exploration drilling",
    "core drilling",
    "resource estimation",
    "feasibility report",
    "geological report",
    "mine dossier",
    "coal reserve estimation",

    # ===============================
    # 🌿 APPROVALS & CLEARANCES (LEGAL COMPLIANCE)
    # ===============================
    "environment clearance",
    "forest clearance",
    "ec clearance",
    "fc clearance",
    "consent to establish",
    "consent to operate",
    "public hearing",
    "land acquisition",
    "rehabilitation and resettlement",
    "pollution clearance",
    "environment impact assessment",
    "eia report",

    # ===============================
    # ⛏️ MINE OPERATIONS & PRODUCTION
    # ===============================
    "drilling", "blasting", "explosives in mining",
    "excavation", "loading", "haulage",
    "dragline", "shovel", "dumper",
    "continuous miner",
    "ventilation system",
    "mine ventilation",
    "dewatering",
    "subsidence",
    "roof support",
    "pillar extraction",
    "mine machinery",
    "coal handling plant",
    "coal washery",

    # ===============================
    # 💥 SAFETY, ACCIDENT & DGMS COMPLIANCE
    # ===============================
    "mine safety",
    "safety regulations",
    "dgms inspection",
    "safety audit",
    "risk assessment",
    "accident reporting",
    "fatal accident",
    "serious bodily injury",
    "mine rescue",
    "emergency response plan",
    "fire in coal mine",
    "gas explosion",
    "methane monitoring",
    "roof fall",
    "safety training",
    "personal protective equipment",
    "ppe in mining",

    # ===============================
    # 👷 WORKERS, WAGES & LABOUR WELFARE
    # ===============================
    "mine workers",
    "miner wages",
    "minimum wages mining",
    "salary of miners",
    "working hours in mines",
    "shift system mining",
    "overtime wages",
    "labour welfare in mines",
    "health and safety of workers",
    "occupational diseases",
    "silicosis", "pneumoconiosis",
    "employee compensation",
    "insurance for miners",
    "training of workers",
    "statutory certificates mining",
    "mine manager certificate",
    "overman certificate",
    "sirdar certificate",

    # ===============================
    # 🚛 TRANSPORT, STORAGE & DISPATCH
    # ===============================
    "coal transportation",
    "coal dispatch",
    "railway siding",
    "logistics in mining",
    "weighbridge",
    "coal stockyard",
    "coal evacuation",
    "conveyor belt system",

    # ===============================
    # 💰 ROYALTY, TAX & FINANCIAL COMPLIANCE
    # ===============================
    "royalty on coal",
    "dead rent",
    "dmf contribution",
    "nmet contribution",
    "statutory dues",
    "production cost",
    "revenue share mining",
    "taxation in mining",

    # ===============================
    # 🌱 ENVIRONMENT & SUSTAINABILITY
    # ===============================
    "mine reclamation",
    "afforestation",
    "air pollution in mines",
    "water pollution mining",
    "dust control",
    "environment monitoring",
    "mine closure plan",
    "progressive mine closure",
    "final mine closure",
    "land restoration",

    # ===============================
    # 🛑 VIOLATIONS, PENALTIES & LEGAL ACTION
    # ===============================
    "mining violation",
    "illegal mining",
    "penalty under mines act",
    "prosecution in mining",
    "license suspension",
    "lease cancellation",
    "environment violation",
    "safety violation",
    "non compliance mining",
    "legal action mining",

    # ===============================
    # 🧠 ADVANCED NLP (FOR CHATBOT INTENTS)
    # ===============================
    "mining rules and regulations",
    "coal mining compliance",
    "statutory obligations mining",
    "inspection by authorities",
    "mine owner responsibilities",
    "mine manager duties",
    "legal requirements for coal mining",
    "government rules for coal mines",

# Core Laws & Statutes
    "mining law", "mines act", "mmrd act",
    "coal mines regulations", "statutes",
    "mining rules", "legal compliance",
    "government notification", "gazette",

    # Notices & Legal Terms
    "notice", "statutory notice", "show cause notice",
    "compliance notice", "violation notice",
    "dgms notice", "inspection notice",
    "closure notice", "legal order", "circular",

    # Coal Mining Specific
    "coal mining", "coal mine", "dgms",
    "coal india", "cmpdi",
    "mine safety", "mine regulations",

    # Worker & Wages
    "miner wages", "labour law",
    "worker safety", "compensation",
    "working hours in mines"
]
def is_indian_coal_mining_query(query: str) -> bool:
    q = query.lower()
    return any(keyword in q for keyword in MINING_KEYWORDS)
