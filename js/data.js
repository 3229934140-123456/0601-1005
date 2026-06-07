const mockData = {
    dataSources: [
        {
            id: 'sales',
            name: '销售数据',
            icon: 'ri-shopping-cart-line',
            color: '#3b82f6',
            description: '包含门店销售、订单、客单价等核心销售指标',
            tables: [
                { id: 'sales_daily', name: '日销售明细表', rows: 125680, updateTime: '2024-01-15 08:00' },
                { id: 'sales_monthly', name: '月销售汇总表', rows: 3600, updateTime: '2024-01-15 08:05' }
            ],
            fields: [
                { id: 'date', name: '日期', type: 'dimension', category: '时间' },
                { id: 'store_id', name: '门店ID', type: 'dimension', category: '门店' },
                { id: 'store_name', name: '门店名称', type: 'dimension', category: '门店' },
                { id: 'region', name: '区域', type: 'dimension', category: '门店' },
                { id: 'category', name: '商品类别', type: 'dimension', category: '商品' },
                { id: 'product_name', name: '商品名称', type: 'dimension', category: '商品' },
                { id: 'sales_amount', name: '销售额', type: 'measure', unit: '元', aggregation: 'sum' },
                { id: 'order_count', name: '订单数', type: 'measure', unit: '单', aggregation: 'sum' },
                { id: 'customer_count', name: '客流量', type: 'measure', unit: '人', aggregation: 'sum' },
                { id: 'avg_order_value', name: '客单价', type: 'measure', unit: '元', aggregation: 'avg' },
                { id: 'return_rate', name: '退货率', type: 'measure', unit: '%', aggregation: 'avg' }
            ]
        },
        {
            id: 'member',
            name: '会员数据',
            icon: 'ri-user-heart-line',
            color: '#8b5cf6',
            description: '包含会员注册、活跃度、消费画像等会员运营数据',
            tables: [
                { id: 'member_info', name: '会员信息表', rows: 85600, updateTime: '2024-01-15 07:30' },
                { id: 'member_consume', name: '会员消费表', rows: 245000, updateTime: '2024-01-15 07:35' }
            ],
            fields: [
                { id: 'member_id', name: '会员ID', type: 'dimension', category: '会员' },
                { id: 'member_level', name: '会员等级', type: 'dimension', category: '会员' },
                { id: 'register_date', name: '注册日期', type: 'dimension', category: '时间' },
                { id: 'gender', name: '性别', type: 'dimension', category: '画像' },
                { id: 'age_group', name: '年龄段', type: 'dimension', category: '画像' },
                { id: 'city', name: '所在城市', type: 'dimension', category: '画像' },
                { id: 'total_points', name: '累计积分', type: 'measure', unit: '分', aggregation: 'sum' },
                { id: 'total_consume', name: '累计消费', type: 'measure', unit: '元', aggregation: 'sum' },
                { id: 'consume_count', name: '消费次数', type: 'measure', unit: '次', aggregation: 'sum' },
                { id: 'active_days', name: '活跃天数', type: 'measure', unit: '天', aggregation: 'sum' },
                { id: 'new_member_count', name: '新增会员数', type: 'measure', unit: '人', aggregation: 'sum' }
            ]
        },
        {
            id: 'inventory',
            name: '库存数据',
            icon: 'ri-archive-line',
            color: '#10b981',
            description: '包含库存数量、周转率、滞销预警等库存管理数据',
            tables: [
                { id: 'inventory_current', name: '当前库存表', rows: 15600, updateTime: '2024-01-15 06:00' },
                { id: 'inventory_history', name: '库存变动表', rows: 98000, updateTime: '2024-01-15 06:10' }
            ],
            fields: [
                { id: 'product_id', name: '商品ID', type: 'dimension', category: '商品' },
                { id: 'product_name', name: '商品名称', type: 'dimension', category: '商品' },
                { id: 'category', name: '商品类别', type: 'dimension', category: '商品' },
                { id: 'warehouse', name: '仓库', type: 'dimension', category: '仓库' },
                { id: 'stock_date', name: '统计日期', type: 'dimension', category: '时间' },
                { id: 'stock_quantity', name: '库存数量', type: 'measure', unit: '件', aggregation: 'sum' },
                { id: 'stock_value', name: '库存金额', type: 'measure', unit: '元', aggregation: 'sum' },
                { id: 'turnover_rate', name: '周转率', type: 'measure', unit: '次', aggregation: 'avg' },
                { id: 'sale_days', name: '可售天数', type: 'measure', unit: '天', aggregation: 'avg' },
                { id: 'out_of_stock_count', name: '缺货商品数', type: 'measure', unit: '个', aggregation: 'sum' }
            ]
        }
    ],

    salesDailyData: {
        dates: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07', '01-08', '01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15'],
        salesAmount: [125600, 138900, 142300, 118700, 135600, 156800, 172300, 165400, 158900, 171200, 189600, 195300, 182700, 201500, 215600],
        orderCount: [320, 356, 368, 298, 345, 412, 456, 438, 421, 452, 512, 528, 492, 548, 586],
        customerCount: [580, 642, 678, 524, 624, 752, 836, 798, 768, 824, 924, 956, 884, 984, 1052],
        avgOrderValue: [392.5, 390.2, 386.7, 398.3, 393.0, 380.6, 377.9, 377.6, 377.4, 378.8, 370.3, 369.9, 371.3, 367.7, 367.9]
    },

    salesByCategory: [
        { category: '服装', value: 456800, percent: 35.2 },
        { category: '鞋靴', value: 289600, percent: 22.3 },
        { category: '配饰', value: 198500, percent: 15.3 },
        { category: '箱包', value: 156200, percent: 12.0 },
        { category: '家居', value: 124800, percent: 9.6 },
        { category: '其他', value: 72600, percent: 5.6 }
    ],

    salesByStore: [
        { store: '北京王府井店', sales: 156800, orders: 428, region: '华北' },
        { store: '上海南京路店', sales: 189500, orders: 512, region: '华东' },
        { store: '广州天河店', sales: 142300, orders: 386, region: '华南' },
        { store: '深圳万象城店', sales: 176200, orders: 478, region: '华南' },
        { store: '杭州湖滨店', sales: 132800, orders: 362, region: '华东' },
        { store: '成都春熙路店', sales: 125600, orders: 342, region: '西南' },
        { store: '武汉江汉路店', sales: 98500, orders: 268, region: '华中' },
        { store: '西安赛格店', sales: 89600, orders: 245, region: '西北' }
    ],

    memberLevelData: [
        { level: '普通会员', count: 45600, percent: 53.3 },
        { level: '银卡会员', count: 22800, percent: 26.6 },
        { level: '金卡会员', count: 12500, percent: 14.6 },
        { level: '钻石会员', count: 4700, percent: 5.5 }
    ],

    memberMonthlyNew: [620, 580, 720, 650, 780, 820, 760, 890, 950, 880, 1020, 1150],
    memberMonthlyActive: [28500, 29200, 31500, 30800, 32600, 34200, 33800, 35600, 36800, 36200, 38500, 40200],
    memberMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

    inventoryData: {
        categories: ['服装', '鞋靴', '配饰', '箱包', '家居'],
        stockQuantity: [12560, 8920, 15680, 6540, 4280],
        stockValue: [3256000, 2186000, 1568000, 1856000, 685000],
        turnoverRate: [4.2, 3.8, 5.6, 3.2, 2.8],
        saleDays: [45, 52, 32, 62, 78]
    },

    topProducts: [
        { rank: 1, name: '经典款休闲运动鞋', sales: 25680, quantity: 1280, category: '鞋靴' },
        { rank: 2, name: '修身牛仔裤', sales: 19850, quantity: 856, category: '服装' },
        { rank: 3, name: '真皮手提包', sales: 18620, quantity: 312, category: '箱包' },
        { rank: 4, name: '羊毛针织衫', sales: 16580, quantity: 692, category: '服装' },
        { rank: 5, name: '简约设计手表', sales: 15280, quantity: 382, category: '配饰' },
        { rank: 6, name: '羽绒服外套', sales: 14960, quantity: 428, category: '服装' },
        { rank: 7, name: '运动休闲鞋', sales: 13650, quantity: 652, category: '鞋靴' },
        { rank: 8, name: '真丝围巾', sales: 12480, quantity: 520, category: '配饰' }
    ],

    stores: [
        { id: 1, name: '北京王府井店', region: '华北', city: '北京', status: 'active' },
        { id: 2, name: '北京三里屯店', region: '华北', city: '北京', status: 'active' },
        { id: 3, name: '上海南京路店', region: '华东', city: '上海', status: 'active' },
        { id: 4, name: '上海陆家嘴店', region: '华东', city: '上海', status: 'active' },
        { id: 5, name: '广州天河店', region: '华南', city: '广州', status: 'active' },
        { id: 6, name: '深圳万象城店', region: '华南', city: '深圳', status: 'active' },
        { id: 7, name: '杭州湖滨店', region: '华东', city: '杭州', status: 'active' },
        { id: 8, name: '成都春熙路店', region: '西南', city: '成都', status: 'active' },
        { id: 9, name: '武汉江汉路店', region: '华中', city: '武汉', status: 'active' },
        { id: 10, name: '西安赛格店', region: '西北', city: '西安', status: 'active' },
        { id: 11, name: '重庆解放碑店', region: '西南', city: '重庆', status: 'inactive' },
        { id: 12, name: '南京新街口店', region: '华东', city: '南京', status: 'active' }
    ],

    regions: ['华北', '华东', '华南', '华中', '西南', '西北'],

    metrics: [
        {
            id: 'sales_amount',
            name: '销售额',
            category: '销售指标',
            unit: '元',
            formula: '订单金额总和 = 商品单价 × 销售数量',
            description: '统计周期内所有已支付订单的金额总和，不包含已退款订单金额。',
            calculation: 'SUM(order_amount) WHERE order_status = "paid"',
            dataSource: '销售数据',
            updateFrequency: '每日更新',
            relatedMetrics: ['客单价', '订单数', '毛利率']
        },
        {
            id: 'order_count',
            name: '订单数',
            category: '销售指标',
            unit: '单',
            formula: '有效订单总数',
            description: '统计周期内已支付的订单总数，每笔订单计为1单，不区分商品数量。',
            calculation: 'COUNT(DISTINCT order_id) WHERE order_status = "paid"',
            dataSource: '销售数据',
            updateFrequency: '每日更新',
            relatedMetrics: ['销售额', '客单价', '退款率']
        },
        {
            id: 'avg_order_value',
            name: '客单价',
            category: '销售指标',
            unit: '元/单',
            formula: '销售额 ÷ 订单数',
            description: '平均每笔订单的金额，反映顾客单次消费能力。',
            calculation: 'SUM(sales_amount) / COUNT(order_id)',
            dataSource: '销售数据',
            updateFrequency: '每日更新',
            relatedMetrics: ['销售额', '订单数', '连带率']
        },
        {
            id: 'customer_count',
            name: '客流量',
            category: '销售指标',
            unit: '人',
            formula: '进店消费顾客总数',
            description: '统计周期内产生消费行为的独立顾客数量，按会员ID或手机号去重。',
            calculation: 'COUNT(DISTINCT customer_id) WHERE has_purchase = true',
            dataSource: '销售数据',
            updateFrequency: '每日更新',
            relatedMetrics: ['转化率', '客单价', '会员占比']
        },
        {
            id: 'new_member_count',
            name: '新增会员数',
            category: '会员指标',
            unit: '人',
            formula: '新注册会员数量',
            description: '统计周期内完成注册的新会员数量，按注册时间统计。',
            calculation: 'COUNT(member_id) WHERE register_date IN period',
            dataSource: '会员数据',
            updateFrequency: '每日更新',
            relatedMetrics: ['会员总数', '会员活跃度', '会员转化率']
        },
        {
            id: 'member_active_rate',
            name: '会员活跃度',
            category: '会员指标',
            unit: '%',
            formula: '活跃会员数 ÷ 总会员数 × 100%',
            description: '统计周期内有消费或登录行为的会员占总会员的比例。',
            calculation: 'COUNT(active_members) / COUNT(total_members) × 100%',
            dataSource: '会员数据',
            updateFrequency: '每日更新',
            relatedMetrics: ['会员留存率', '会员消费占比', '复购率']
        },
        {
            id: 'stock_quantity',
            name: '库存数量',
            category: '库存指标',
            unit: '件',
            formula: '当前库存商品总数量',
            description: '统计时点仓库中实际存放的商品数量，不包括在途库存。',
            calculation: 'SUM(stock_qty) GROUP BY warehouse',
            dataSource: '库存数据',
            updateFrequency: '每日更新',
            relatedMetrics: ['库存金额', '周转率', '可售天数']
        },
        {
            id: 'turnover_rate',
            name: '库存周转率',
            category: '库存指标',
            unit: '次',
            formula: '销售成本 ÷ 平均库存金额',
            description: '一定时期内库存周转的次数，反映库存周转速度和运营效率。',
            calculation: 'COGS / AVG(inventory_value)',
            dataSource: '库存数据',
            updateFrequency: '每月更新',
            relatedMetrics: ['可售天数', '库存金额', '缺货率']
        }
    ],

    shareRecords: [
        {
            id: 1,
            name: '月度销售看板',
            shareUrl: 'https://dashboard.example.com/s/abc123',
            shareCode: 'abc123',
            createTime: '2024-01-10 14:30',
            expireTime: '2024-12-31',
            hasPassword: true,
            password: '123456',
            viewCount: 156,
            status: 'active'
        },
        {
            id: 2,
            name: '会员分析报告',
            shareUrl: 'https://dashboard.example.com/s/def456',
            shareCode: 'def456',
            createTime: '2024-01-12 09:15',
            expireTime: '2024-12-31',
            hasPassword: false,
            password: '',
            viewCount: 42,
            status: 'active'
        },
        {
            id: 3,
            name: '库存预警看板',
            shareUrl: 'https://dashboard.example.com/s/ghi789',
            shareCode: 'ghi789',
            createTime: '2024-01-08 16:45',
            expireTime: '2024-01-08',
            hasPassword: true,
            password: '654321',
            viewCount: 28,
            status: 'expired'
        }
    ],

    accessRecords: [
        { id: 1, shareId: 1, viewer: '张经理', department: '运营部', accessTime: '2024-01-15 10:32:15', duration: '8分32秒', device: 'PC' },
        { id: 2, shareId: 1, viewer: '李总监', department: '销售部', accessTime: '2024-01-15 09:15:42', duration: '15分20秒', device: 'PC' },
        { id: 3, shareId: 1, viewer: '王主管', department: '市场部', accessTime: '2024-01-14 16:45:28', duration: '5分10秒', device: '手机' },
        { id: 4, shareId: 2, viewer: '赵经理', department: '财务部', accessTime: '2024-01-14 14:20:11', duration: '12分45秒', device: 'PC' },
        { id: 5, shareId: 2, viewer: '陈总监', department: '运营部', accessTime: '2024-01-14 11:08:33', duration: '20分15秒', device: 'PC' },
        { id: 6, shareId: 1, viewer: '刘主管', department: '供应链', accessTime: '2024-01-13 17:30:56', duration: '6分50秒', device: 'PC' },
        { id: 7, shareId: 2, viewer: '周经理', department: '销售部', accessTime: '2024-01-13 15:22:41', duration: '18分30秒', device: '手机' },
        { id: 8, shareId: 1, viewer: '吴总监', department: '市场部', accessTime: '2024-01-13 10:45:18', duration: '9分25秒', device: 'PC' }
    ],

    themes: [
        { id: 'default', name: '默认蓝紫', colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'], primary: '#3b82f6' },
        { id: 'ocean', name: '海洋蓝', colors: ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'], primary: '#0284c7' },
        { id: 'sunset', name: '日落橙', colors: ['#ea580c', '#f97316', '#fb923c', '#fbbf24', '#fcd34d', '#fef08a'], primary: '#ea580c' },
        { id: 'forest', name: '森林绿', colors: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'], primary: '#047857' },
        { id: 'rose', name: '玫瑰粉', colors: ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'], primary: '#be123c' },
        { id: 'mono', name: '商务灰', colors: ['#1e293b', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'], primary: '#1e293b' }
    ],

    anomalies: [
        { date: '01-08', type: 'spike', description: '新年促销活动导致销售额大幅增长', color: '#ef4444', chartId: 'chart1' }
    ]
};

let dashboardState = {
    selectedDataSources: ['sales', 'member'],
    charts: [
        { id: 'chart1', type: 'line', title: '销售额趋势', dataSource: 'sales', xField: 'date', yField: 'sales_amount', width: 6, height: 3, x: 0, y: 0 },
        { id: 'chart2', type: 'bar', title: '各门店销售额', dataSource: 'sales', xField: 'store_name', yField: 'sales_amount', width: 6, height: 3, x: 6, y: 0 },
        { id: 'chart3', type: 'pie', title: '商品类别占比', dataSource: 'sales', angleField: 'value', colorField: 'category', width: 4, height: 3, x: 0, y: 3 },
        { id: 'chart4', type: 'bar', title: '会员等级分布', dataSource: 'member', xField: 'level', yField: 'count', width: 4, height: 3, x: 4, y: 3 },
        { id: 'chart5', type: 'line', title: '库存周转率', dataSource: 'inventory', xField: 'category', yField: 'turnover_rate', width: 4, height: 3, x: 8, y: 3 }
    ],
    filters: {
        dateRange: { start: '2024-01-01', end: '2024-01-15', type: 'custom' },
        stores: [],
        regions: ['华北', '华东', '华南'],
        categories: []
    },
    linkFilters: {
        date: null,
        store: null,
        category: null
    },
    currentTheme: 'default',
    layoutGrid: 12,
    selectedChartId: null
};