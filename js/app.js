const pageTitles = {
    'data-select': '数据选择',
    'chart-edit': '图表编辑',
    'layout': '布局画布',
    'filters': '筛选器设置',
    'metrics': '指标说明',
    'share': '分享管理',
    'display': '播放大屏'
};

let currentPage = 'data-select';
let draggedChart = null;
let displayCarouselIndex = 0;
let displayCarouselTimer = null;
let selectedAnomalyColor = '#ef4444';
let editingMetricId = null;
let currentZoom = 1;

function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.add('hidden');
    });
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) {
        pageEl.classList.remove('hidden');
    }
    document.getElementById('page-title').textContent = pageTitles[page] || '';

    if (page === 'layout') {
        setTimeout(() => renderLayoutCanvas(), 100);
    } else if (page === 'chart-edit') {
        renderChartEditPage();
    } else if (page === 'display') {
        renderDisplayPage();
        startCarousel();
    } else if (page === 'share') {
        renderSharePage();
    } else if (page === 'data-select') {
        renderDataSelectPage();
    } else if (page === 'filters') {
        renderFiltersPage();
    } else if (page === 'metrics') {
        renderMetricsPage();
    }

    if (page !== 'display' && displayCarouselTimer) {
        clearInterval(displayCarouselTimer);
        displayCarouselTimer = null;
    }
}

function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.page));
    });
}

function renderDataSelectPage() {
    const container = document.getElementById('page-data-select');
    container.innerHTML = `
        <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">选择数据源</h3>
            <p class="text-sm text-gray-500">选择需要分析的数据来源，支持多数据源组合分析</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            ${mockData.dataSources.map(ds => `
                <div class="data-source-card bg-white rounded-xl border-2 ${dashboardState.selectedDataSources.includes(ds.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} p-6"
                     onclick="toggleDataSource('${ds.id}')">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background: ${ds.color}15;">
                            <i class="${ds.icon} text-2xl" style="color: ${ds.color};"></i>
                        </div>
                        <div class="w-5 h-5 rounded-full border-2 ${dashboardState.selectedDataSources.includes(ds.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} flex items-center justify-center">
                            ${dashboardState.selectedDataSources.includes(ds.id) ? '<i class="ri-check-line text-white text-xs"></i>' : ''}
                        </div>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">${ds.name}</h4>
                    <p class="text-sm text-gray-500 mb-4">${ds.description}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-400">
                        <span><i class="ri-table-line mr-1"></i>${ds.tables.length}张表</span>
                        <span><i class="ri-database-2-line mr-1"></i>${ds.fields.length}个字段</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">数据字段预览</h3>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500">已选择</span>
                    <span class="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg font-medium">${dashboardState.selectedDataSources.length}个数据源</span>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    ${mockData.dataSources.filter(ds => dashboardState.selectedDataSources.includes(ds.id)).map(ds => `
                        <div class="border border-gray-100 rounded-lg p-4">
                            <div class="flex items-center gap-2 mb-4">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: ${ds.color}15;">
                                    <i class="${ds.icon} text-lg" style="color: ${ds.color};"></i>
                                </div>
                                <span class="font-medium text-gray-900">${ds.name}</span>
                            </div>
                            <div class="space-y-2">
                                <p class="text-xs text-gray-400 font-medium">维度字段</p>
                                <div class="flex flex-wrap gap-2 mb-4">
                                    ${ds.fields.filter(f => f.type === 'dimension').map(f => `
                                        <span class="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">${f.name}</span>
                                    `).join('')}
                                </div>
                                <p class="text-xs text-gray-400 font-medium">度量字段</p>
                                <div class="flex flex-wrap gap-2">
                                    ${ds.fields.filter(f => f.type === 'measure').map(f => `
                                        <span class="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md">${f.name}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">重置</button>
                <button onclick="navigateTo('chart-edit')" class="px-6 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                    下一步：创建图表
                </button>
            </div>
        </div>
    `;
}

function toggleDataSource(id) {
    const index = dashboardState.selectedDataSources.indexOf(id);
    if (index > -1) {
        if (dashboardState.selectedDataSources.length > 1) {
            dashboardState.selectedDataSources.splice(index, 1);
        }
    } else {
        dashboardState.selectedDataSources.push(id);
    }
    renderDataSelectPage();
}

function renderChartEditPage() {
    if (!dashboardState.selectedChartId && dashboardState.charts.length > 0) {
        dashboardState.selectedChartId = dashboardState.charts[0].id;
    }
    const chart = dashboardState.charts.find(c => c.id === dashboardState.selectedChartId) || dashboardState.charts[0];
    if (!chart) {
        addNewChart();
        return;
    }
    const dataSource = mockData.dataSources.find(ds => ds.id === chart.dataSource);

    const container = document.getElementById('page-chart-edit');
    container.innerHTML = `
        <div class="flex gap-6 h-full">
            <div class="w-80 flex-shrink-0 space-y-6 overflow-auto scrollbar-thin pb-6">
                <div class="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 class="font-semibold text-gray-900 mb-4">图表类型</h4>
                    <div class="grid grid-cols-3 gap-2">
                        ${getChartTypeButtons(chart.type)}
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 class="font-semibold text-gray-900 mb-4">数据配置</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm text-gray-600 block mb-2">数据源</label>
                            <select onchange="changeChartDataSource('${chart.id}', this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                ${dashboardState.selectedDataSources.map(dsId => {
                                    const ds = mockData.dataSources.find(d => d.id === dsId);
                                    return `<option value="${dsId}" ${chart.dataSource === dsId ? 'selected' : ''}>${ds.name}</option>`;
                                }).join('')}
                            </select>
                        </div>
                        ${chart.type === 'pie' ? `
                            <div>
                                <label class="text-sm text-gray-600 block mb-2">角度字段 (数值)</label>
                                <select onchange="updateChartField('${chart.id}', 'angleField', this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                    ${dataSource.fields.filter(f => f.type === 'measure').map(f => `
                                        <option value="${f.id}" ${chart.angleField === f.id ? 'selected' : ''}>${f.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="text-sm text-gray-600 block mb-2">颜色字段 (类别)</label>
                                <select onchange="updateChartField('${chart.id}', 'colorField', this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                    ${dataSource.fields.filter(f => f.type === 'dimension').map(f => `
                                        <option value="${f.id}" ${chart.colorField === f.id ? 'selected' : ''}>${f.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                        ` : `
                            <div>
                                <label class="text-sm text-gray-600 block mb-2">X轴字段</label>
                                <select onchange="updateChartField('${chart.id}', 'xField', this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                    ${dataSource.fields.filter(f => f.type === 'dimension').map(f => `
                                        <option value="${f.id}" ${chart.xField === f.id ? 'selected' : ''}>${f.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="text-sm text-gray-600 block mb-2">Y轴字段</label>
                                <select onchange="updateChartField('${chart.id}', 'yField', this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                    ${dataSource.fields.filter(f => f.type === 'measure').map(f => `
                                        <option value="${f.id}" ${chart.yField === f.id ? 'selected' : ''}>${f.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                        `}
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 class="font-semibold text-gray-900 mb-4">数据字段</h4>
                    <div class="space-y-3">
                        <div>
                            <p class="text-xs text-gray-400 font-medium mb-2">维度</p>
                            <div class="space-y-1">
                                ${dataSource.fields.filter(f => f.type === 'dimension').map(f => `
                                    <div class="field-item text-sm flex items-center gap-2">
                                        <i class="ri-pulse-line text-blue-500"></i>
                                        <span>${f.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 font-medium mb-2">度量</p>
                            <div class="space-y-1">
                                ${dataSource.fields.filter(f => f.type === 'measure').map(f => `
                                    <div class="field-item text-sm flex items-center gap-2">
                                        <i class="ri-bar-chart-2-fill text-green-500"></i>
                                        <span>${f.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 class="font-semibold text-gray-900 mb-4">图表样式</h4>
                    <div class="space-y-4">
                        <div>
                            <label class="text-sm text-gray-600 block mb-2">图表标题</label>
                            <input type="text" value="${chart.title}" onchange="updateChartTitle('${chart.id}', this.value)"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div class="flex items-center justify-between">
                            <label class="text-sm text-gray-600">显示图例</label>
                            <div class="switch active"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <label class="text-sm text-gray-600">平滑曲线</label>
                            <div class="switch active"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <label class="text-sm text-gray-600">显示数据标签</label>
                            <div class="switch"></div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-gray-200 p-4">
                    <h4 class="font-semibold text-gray-900 mb-4">同比/环比</h4>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">同比 (YoY)</span>
                            <div class="switch ${chart.showYoY ? 'active' : ''}" onclick="toggleYoY('${chart.id}')"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">环比 (MoM)</span>
                            <div class="switch ${chart.showMoM ? 'active' : ''}" onclick="toggleMoM('${chart.id}')"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex-1 flex flex-col gap-4 min-w-0">
                <div class="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-500">已选图表:</span>
                        <select onchange="selectChartForEdit(this.value)" class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                            ${dashboardState.charts.map(c => `
                                <option value="${c.id}" ${c.id === chart.id ? 'selected' : ''}>${c.title}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="duplicateChart('${chart.id}')" class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <i class="ri-file-copy-line mr-1"></i>复制图表
                        </button>
                        <button onclick="addNewChart()" class="px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                            <i class="ri-add-line mr-1"></i>新建图表
                        </button>
                    </div>
                </div>

                <div class="flex-1 bg-white rounded-xl border border-gray-200 p-6 min-h-0">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-900">${chart.title}</h3>
                        <button onclick="openAnomalyModalForChart('${chart.id}')" class="text-sm text-gray-500 hover:text-red-500 transition-colors">
                            <i class="ri-flag-line mr-1"></i>标注异常
                        </button>
                    </div>
                    <div id="chart-preview" class="w-full h-[calc(100%-40px)] min-h-[400px]"></div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const previewEl = document.getElementById('chart-preview');
        if (previewEl) {
            chartManager.renderChart('preview', chart, previewEl);
        }
    }, 50);
}

function getChartTypeButtons(currentType) {
    const types = [
        { type: 'line', icon: 'ri-line-chart-line', name: '折线图' },
        { type: 'bar', icon: 'ri-bar-chart-grouped-line', name: '柱状图' },
        { type: 'pie', icon: 'ri-pie-chart-line', name: '饼图' },
        { type: 'area', icon: 'ri-area-chart-line', name: '面积图' },
        { type: 'scatter', icon: 'ri-bubble-chart-line', name: '散点图' },
        { type: 'table', icon: 'ri-table-line', name: '明细表' }
    ];

    return types.map(t => `
        <button onclick="changeChartType('${t.type}')"
                class="chart-type-btn flex flex-col items-center gap-1 p-3 border border-gray-200 rounded-lg ${currentType === t.type ? 'active' : ''}">
            <i class="${t.icon} text-xl"></i>
            <span class="text-xs">${t.name}</span>
        </button>
    `).join('');
}

function changeChartType(type) {
    const chart = dashboardState.charts.find(c => c.id === dashboardState.selectedChartId);
    if (chart) {
        chart.type = type;
        renderChartEditPage();
    }
}

function changeChartDataSource(chartId, dataSourceId) {
    const chart = dashboardState.charts.find(c => c.id === chartId);
    if (chart) {
        chart.dataSource = dataSourceId;
        const ds = mockData.dataSources.find(d => d.id === dataSourceId);
        if (ds) {
            const dims = ds.fields.filter(f => f.type === 'dimension');
            const measures = ds.fields.filter(f => f.type === 'measure');
            chart.xField = dims.length > 0 ? dims[0].id : chart.xField;
            chart.yField = measures.length > 0 ? measures[0].id : chart.yField;
            chart.angleField = measures.length > 0 ? measures[0].id : chart.angleField;
            chart.colorField = dims.length > 0 ? dims[0].id : chart.colorField;
        }
        renderChartEditPage();
    }
}

function updateChartField(chartId, fieldName, value) {
    const chart = dashboardState.charts.find(c => c.id === chartId);
    if (chart) {
        chart[fieldName] = value;
        const previewEl = document.getElementById('chart-preview');
        if (previewEl) {
            chartManager.renderChart('preview', chart, previewEl);
        }
    }
}

function selectChartForEdit(chartId) {
    dashboardState.selectedChartId = chartId;
    renderChartEditPage();
}

function updateChartTitle(chartId, title) {
    const chart = dashboardState.charts.find(c => c.id === chartId);
    if (chart) {
        chart.title = title;
    }
}

function addNewChart() {
    const newId = `chart${Date.now()}`;
    const ds = dashboardState.selectedDataSources[0] || 'sales';
    const dataSource = mockData.dataSources.find(d => d.id === ds);
    const dims = dataSource ? dataSource.fields.filter(f => f.type === 'dimension') : [];
    const measures = dataSource ? dataSource.fields.filter(f => f.type === 'measure') : [];
    
    const newChart = {
        id: newId,
        type: 'line',
        title: '新图表',
        dataSource: ds,
        xField: dims.length > 0 ? dims[0].id : 'date',
        yField: measures.length > 0 ? measures[0].id : 'sales_amount',
        angleField: measures.length > 0 ? measures[0].id : 'sales_amount',
        colorField: dims.length > 0 ? dims[0].id : 'category',
        width: 6,
        height: 3,
        x: 0,
        y: 0
    };
    dashboardState.charts.push(newChart);
    dashboardState.selectedChartId = newId;
    renderChartEditPage();
}

function duplicateChart(chartId) {
    const chart = dashboardState.charts.find(c => c.id === chartId);
    if (chart) {
        const newChart = {
            ...chart,
            id: `chart${Date.now()}`,
            title: chart.title + ' (副本)'
        };
        dashboardState.charts.push(newChart);
        dashboardState.selectedChartId = newChart.id;
        renderChartEditPage();
    }
}

function toggleYoY(chartId) {
    const chart = dashboardState.charts.find(c => c.id === chartId);
    if (chart) {
        chart.showYoY = !chart.showYoY;
        renderChartEditPage();
    }
}

function toggleMoM(chartId) {
    const chart = dashboardState.charts.find(c => c.id === chartId);
    if (chart) {
        chart.showMoM = !chart.showMoM;
        renderChartEditPage();
    }
}

function openAnomalyModalForChart(chartId) {
    dashboardState.selectedChartId = chartId;
    document.getElementById('anomaly-modal').classList.remove('hidden');
    document.getElementById('anomaly-modal').classList.add('flex');
    
    setTimeout(() => {
        initAnomalyColorButtons();
        refreshAnomalyColorSelection();
    }, 50);
}

function closeAnomalyModal() {
    document.getElementById('anomaly-modal').classList.add('hidden');
    document.getElementById('anomaly-modal').classList.remove('flex');
}

function saveAnomaly() {
    const type = document.getElementById('anomaly-type').value;
    const desc = document.getElementById('anomaly-desc').value;
    
    if (!desc.trim()) {
        alert('请输入异常说明');
        return;
    }
    
    const dates = mockData.salesDailyData.dates;
    const randomDate = dates[Math.floor(Math.random() * dates.length)];
    
    mockData.anomalies.push({
        id: Date.now(),
        date: randomDate,
        type: type,
        description: desc,
        color: selectedAnomalyColor,
        chartId: dashboardState.selectedChartId
    });

    closeAnomalyModal();
    
    if (currentPage === 'chart-edit') {
        renderChartEditPage();
    } else if (currentPage === 'layout') {
        chartManager.disposeChart(`layout-${dashboardState.selectedChartId}`);
        renderLayoutCanvas();
    }
}

function renderLayoutCanvas() {
    const container = document.getElementById('page-layout');
    container.innerHTML = `
        <div class="h-full flex">
            <div class="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 overflow-auto scrollbar-thin">
                <h3 class="font-semibold text-gray-900 mb-4">图表组件</h3>
                <div class="space-y-2">
                    ${dashboardState.charts.map(chart => `
                        <div class="chart-item p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                             draggable="true" data-chart-id="${chart.id}"
                             ondragstart="handleChartDragStart(event, '${chart.id}')"
                             ondragend="handleChartDragEnd(event)">
                            <div class="flex items-center gap-2">
                                <i class="${getChartIcon(chart.type)} text-blue-500"></i>
                                <span class="text-sm font-medium text-gray-700">${chart.title}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-6">
                    <h3 class="font-semibold text-gray-900 mb-4">布局设置</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="text-sm text-gray-600 block mb-2">网格列数</label>
                            <select onchange="changeGridCols(this.value)" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                <option value="8">8 列</option>
                                <option value="12" selected>12 列</option>
                                <option value="16">16 列</option>
                                <option value="24">24 列</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm text-gray-600 block mb-2">组件间距</label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                <option>紧凑</option>
                                <option selected>标准</option>
                                <option>宽松</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="mt-6">
                    <h3 class="font-semibold text-gray-900 mb-4">快捷操作</h3>
                    <div class="space-y-2">
                        <button onclick="autoArrange()" class="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                            <i class="ri-layout-line text-gray-500"></i>
                            <span>自动排列</span>
                        </button>
                        <button onclick="clearLayout()" class="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                            <i class="ri-delete-bin-line text-gray-500"></i>
                            <span>清空画布</span>
                        </button>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-100">
                    <button onclick="addNewChartFromLayout()" class="w-full py-2 border border-dashed border-gray-300 text-sm text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <i class="ri-add-line mr-1"></i>添加图表
                    </button>
                </div>
            </div>

            <div class="flex-1 p-6 overflow-auto">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-500">画布比例:</span>
                        <div class="flex bg-gray-100 rounded-lg p-1">
                            <button class="px-3 py-1 text-sm rounded-md bg-white shadow-sm">16:9</button>
                            <button class="px-3 py-1 text-sm rounded-md text-gray-500">4:3</button>
                            <button class="px-3 py-1 text-sm rounded-md text-gray-500">自适应</button>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="zoomOut()" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                            <i class="ri-zoom-out-line text-gray-500"></i>
                        </button>
                        <span class="text-sm text-gray-500 w-12 text-center">${Math.round(currentZoom * 100)}%</span>
                        <button onclick="zoomIn()" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                            <i class="ri-zoom-in-line text-gray-500"></i>
                        </button>
                    </div>
                </div>

                <div id="layout-canvas" class="grid-bg bg-white rounded-xl border border-gray-200 p-4 relative"
                     style="display: grid; grid-template-columns: repeat(${dashboardState.layoutGrid}, 1fr); gap: 16px; min-height: 600px; transform: scale(${currentZoom}); transform-origin: top left;">
                </div>
            </div>
        </div>
    `;

    renderLayoutCharts();
}

function getChartIcon(type) {
    const icons = {
        line: 'ri-line-chart-line',
        bar: 'ri-bar-chart-grouped-line',
        pie: 'ri-pie-chart-line',
        area: 'ri-area-chart-line',
        scatter: 'ri-bubble-chart-line',
        table: 'ri-table-line'
    };
    return icons[type] || 'ri-bar-chart-line';
}

function renderLayoutCharts() {
    const canvas = document.getElementById('layout-canvas');
    if (!canvas) return;

    canvas.innerHTML = '';

    dashboardState.charts.forEach((chart, index) => {
        const card = document.createElement('div');
        card.className = 'chart-card bg-white rounded-lg border-2 border-gray-200 p-4 relative cursor-move transition-all';
        card.style.gridColumn = `span ${chart.width}`;
        card.style.gridRow = `span ${chart.height}`;
        card.style.minHeight = '200px';
        card.dataset.chartId = chart.id;
        card.dataset.index = index;
        card.draggable = true;

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', chart.id);
            card.classList.add('opacity-50', 'border-blue-400');
            draggedChart = chart.id;
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('opacity-50', 'border-blue-400');
            document.querySelectorAll('.chart-card').forEach(c => c.classList.remove('border-blue-300', 'border-dashed'));
            draggedChart = null;
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (e.currentTarget.dataset.chartId !== draggedChart) {
                e.currentTarget.classList.add('border-blue-300', 'border-dashed');
            }
        });

        card.addEventListener('dragleave', (e) => {
            e.currentTarget.classList.remove('border-blue-300', 'border-dashed');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const draggedId = e.dataTransfer.getData('text/plain');
            const targetId = e.currentTarget.dataset.chartId;
            
            if (draggedId && targetId && draggedId !== targetId) {
                const draggedIndex = dashboardState.charts.findIndex(c => c.id === draggedId);
                const targetIndex = dashboardState.charts.findIndex(c => c.id === targetId);
                
                if (draggedIndex > -1 && targetIndex > -1) {
                    const [removed] = dashboardState.charts.splice(draggedIndex, 1);
                    dashboardState.charts.splice(targetIndex, 0, removed);
                    renderLayoutCanvas();
                }
            }
            
            e.currentTarget.classList.remove('border-blue-300', 'border-dashed');
        });

        card.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <i class="ri-drag-move-line text-gray-300"></i>
                    <h4 class="text-sm font-semibold text-gray-900">${chart.title}</h4>
                </div>
                <div class="flex items-center gap-1">
                    <button onclick="event.stopPropagation(); editChartFromLayout('${chart.id}')" class="p-1 hover:bg-gray-100 rounded" title="编辑">
                        <i class="ri-edit-line text-gray-400 text-sm"></i>
                    </button>
                    <button onclick="event.stopPropagation(); duplicateChartFromLayout('${chart.id}')" class="p-1 hover:bg-gray-100 rounded" title="复制">
                        <i class="ri-file-copy-line text-gray-400 text-sm"></i>
                    </button>
                    <button onclick="event.stopPropagation(); deleteChartFromLayout('${chart.id}')" class="p-1 hover:bg-gray-100 rounded" title="删除">
                        <i class="ri-delete-bin-line text-gray-400 text-sm"></i>
                    </button>
                </div>
            </div>
            <div id="layout-chart-${chart.id}" class="w-full pointer-events-none" style="height: calc(100% - 40px);"></div>
        `;

        canvas.appendChild(card);

        setTimeout(() => {
            const chartEl = document.getElementById(`layout-chart-${chart.id}`);
            if (chartEl) {
                chartManager.renderChart(`layout-${chart.id}`, chart, chartEl);
            }
        }, 50);
    });
}

function editChartFromLayout(chartId) {
    dashboardState.selectedChartId = chartId;
    navigateTo('chart-edit');
}

function duplicateChartFromLayout(chartId) {
    duplicateChart(chartId);
    renderLayoutCanvas();
}

function deleteChartFromLayout(chartId) {
    if (confirm('确定要删除这个图表吗？')) {
        const index = dashboardState.charts.findIndex(c => c.id === chartId);
        if (index > -1) {
            dashboardState.charts.splice(index, 1);
            chartManager.disposeChart(`layout-${chartId}`);
            renderLayoutCanvas();
        }
    }
}

function addNewChartFromLayout() {
    addNewChart();
    renderLayoutCanvas();
}

function handleChartDragStart(event, chartId) {
    draggedChart = chartId;
    event.target.classList.add('drag-chosen');
    event.dataTransfer.effectAllowed = 'move';
}

function handleChartDragEnd(event) {
    event.target.classList.remove('drag-chosen');
    draggedChart = null;
}

function changeGridCols(cols) {
    dashboardState.layoutGrid = parseInt(cols);
    renderLayoutCanvas();
}

function autoArrange() {
    let colIndex = 0;

    dashboardState.charts.forEach(chart => {
        if (colIndex + chart.width > dashboardState.layoutGrid) {
            colIndex = 0;
        }
        chart.x = colIndex;
        colIndex += chart.width;
    });

    renderLayoutCharts();
}

function clearLayout() {
    if (confirm('确定要清空画布吗？所有图表将被移除。')) {
        dashboardState.charts = [];
        renderLayoutCanvas();
    }
}

function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.1, 2);
    renderLayoutCanvas();
}

function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.1, 0.5);
    renderLayoutCanvas();
}

function renderFiltersPage() {
    const container = document.getElementById('page-filters');
    container.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6">
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-gray-900">日期范围筛选</h3>
                    <p class="text-sm text-gray-500 mt-1">设置看板数据的统计时间范围</p>
                </div>
                <div class="p-6">
                    <div class="flex gap-2 mb-4 flex-wrap">
                        ${['今日', '昨日', '近7天', '近30天', '本月', '上月', '本季度', '自定义'].map((period, i) => `
                            <button onclick="setDateRange('${period}')"
                                    class="px-4 py-2 text-sm rounded-lg border transition-colors ${
                                        i === 6 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }">
                                ${period}
                            </button>
                        `).join('')}
                    </div>
                    <div class="flex gap-4 items-center flex-wrap">
                        <div class="flex items-center gap-2">
                            <label class="text-sm text-gray-600">开始日期:</label>
                            <input type="date" value="${dashboardState.filters.dateRange.start}"
                                   onchange="updateDateFilter('start', this.value)"
                                   class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                        </div>
                        <span class="text-gray-400">至</span>
                        <div class="flex items-center gap-2">
                            <label class="text-sm text-gray-600">结束日期:</label>
                            <input type="date" value="${dashboardState.filters.dateRange.end}"
                                   onchange="updateDateFilter('end', this.value)"
                                   class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-gray-900">门店筛选</h3>
                    <p class="text-sm text-gray-500 mt-1">按区域或门店筛选数据</p>
                </div>
                <div class="p-6">
                    <div class="mb-6">
                        <p class="text-sm font-medium text-gray-700 mb-3">按区域</p>
                        <div class="flex flex-wrap gap-2">
                            ${mockData.regions.map(region => `
                                <button onclick="toggleRegion('${region}')"
                                        class="px-4 py-2 text-sm rounded-lg border transition-colors ${
                                            dashboardState.filters.regions.includes(region)
                                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }">
                                    ${region}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <p class="text-sm font-medium text-gray-700">按门店</p>
                            <div class="flex items-center gap-2">
                                <button onclick="selectAllStores()" class="text-sm text-blue-500 hover:text-blue-600">全选</button>
                                <span class="text-gray-300">|</span>
                                <button onclick="clearStores()" class="text-sm text-gray-500 hover:text-gray-600">清空</button>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            ${mockData.stores.map(store => `
                                <label class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors">
                                    <input type="checkbox" ${dashboardState.filters.stores.includes(store.id.toString()) ? 'checked' : ''}
                                           onchange="toggleStore(${store.id})"
                                           class="w-4 h-4 text-blue-500 rounded">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-700 truncate">${store.name}</p>
                                        <p class="text-xs text-gray-400">${store.city} · ${store.region}</p>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-gray-900">商品类别筛选</h3>
                    <p class="text-sm text-gray-500 mt-1">选择需要分析的商品类别</p>
                </div>
                <div class="p-6">
                    <div class="flex flex-wrap gap-3">
                        ${['服装', '鞋靴', '配饰', '箱包', '家居', '数码', '美妆', '食品'].map((cat, i) => `
                            <label class="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                                <input type="checkbox" ${i < 4 ? 'checked' : ''} class="w-4 h-4 text-blue-500 rounded">
                                <span class="text-sm text-gray-700">${cat}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-semibold text-gray-900">已选筛选条件</h3>
                        <p class="text-sm text-gray-500 mt-1">当前应用的筛选条件汇总</p>
                    </div>
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                        ${getActiveFilterCount()}个条件
                    </span>
                </div>
                <div class="p-6">
                    <div class="flex flex-wrap gap-2">
                        ${getActiveFilterTags()}
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <button onclick="resetFilters()" class="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors">重置</button>
                <button onclick="applyFilters()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    应用筛选
                </button>
            </div>
        </div>
    `;
}

function setDateRange(period) {
    console.log('Set date range:', period);
}

function updateDateFilter(type, value) {
    dashboardState.filters.dateRange[type] = value;
}

function toggleRegion(region) {
    const index = dashboardState.filters.regions.indexOf(region);
    if (index > -1) {
        dashboardState.filters.regions.splice(index, 1);
    } else {
        dashboardState.filters.regions.push(region);
    }
    renderFiltersPage();
}

function toggleStore(storeId) {
    const id = storeId.toString();
    const index = dashboardState.filters.stores.indexOf(id);
    if (index > -1) {
        dashboardState.filters.stores.splice(index, 1);
    } else {
        dashboardState.filters.stores.push(id);
    }
}

function selectAllStores() {
    dashboardState.filters.stores = mockData.stores.map(s => s.id.toString());
    renderFiltersPage();
}

function clearStores() {
    dashboardState.filters.stores = [];
    renderFiltersPage();
}

function getActiveFilterCount() {
    return dashboardState.filters.regions.length + dashboardState.filters.stores.length;
}

function getActiveFilterTags() {
    let tags = [];
    dashboardState.filters.regions.forEach(r => {
        tags.push(`<span class="filter-tag">${r}<i class="ri-close-line cursor-pointer" onclick="removeRegionTag('${r}')"></i></span>`);
    });
    dashboardState.filters.stores.forEach(sId => {
        const store = mockData.stores.find(s => s.id === parseInt(sId));
        if (store) {
            tags.push(`<span class="filter-tag">${store.name}<i class="ri-close-line cursor-pointer"></i></span>`);
        }
    });
    if (tags.length === 0) {
        return '<span class="text-sm text-gray-400">暂无筛选条件</span>';
    }
    return tags.join('');
}

function removeRegionTag(region) {
    toggleRegion(region);
}

function resetFilters() {
    dashboardState.filters = {
        dateRange: { start: '2024-01-01', end: '2024-01-15', type: 'custom' },
        stores: [],
        regions: [],
        categories: []
    };
    renderFiltersPage();
}

function applyFilters() {
    alert('筛选条件已应用！');
}

function renderMetricsPage() {
    const container = document.getElementById('page-metrics');
    container.innerHTML = `
        <div class="flex gap-6 h-full">
            <div class="w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="p-4 border-b border-gray-100">
                    <h4 class="font-semibold text-gray-900">指标分类</h4>
                </div>
                <div class="p-2">
                    ${['全部指标', '销售指标', '会员指标', '库存指标'].map((cat, i) => `
                        <button class="w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                            i === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                        }">
                            ${cat}
                        </button>
                    `).join('')}
                </div>
                <div class="p-4 border-t border-gray-100">
                    <button onclick="addNewMetric()" class="w-full py-2 border border-dashed border-gray-300 text-sm text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <i class="ri-add-line mr-1"></i>新建指标
                    </button>
                </div>
            </div>

            <div class="flex-1 space-y-4 overflow-auto scrollbar-thin pb-6">
                ${mockData.metrics.map(metric => `
                    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <i class="ri-function-line text-blue-500 text-xl"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900">${metric.name}</h4>
                                    <span class="text-xs text-gray-400">${metric.category}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="editMetric('${metric.id}')" class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    <i class="ri-edit-line mr-1"></i>编辑口径
                                </button>
                            </div>
                        </div>
                        <div class="p-6 grid grid-cols-2 gap-6">
                            <div>
                                <p class="text-xs text-gray-400 font-medium mb-2">指标定义</p>
                                <p class="text-sm text-gray-600">${metric.description}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 font-medium mb-2">计算公式</p>
                                <p class="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">${metric.formula}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 font-medium mb-2">统计口径</p>
                                <p class="text-sm text-gray-600">${metric.calculation}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 font-medium mb-2">相关信息</p>
                                <div class="flex gap-4 text-sm flex-wrap">
                                    <span class="text-gray-500">数据源: <span class="text-gray-700">${metric.dataSource}</span></span>
                                    <span class="text-gray-500">单位: <span class="text-gray-700">${metric.unit}</span></span>
                                    <span class="text-gray-500">更新: <span class="text-gray-700">${metric.updateFrequency}</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="px-6 py-3 bg-gray-50 border-t border-gray-100">
                            <p class="text-xs text-gray-400">相关指标: 
                                ${metric.relatedMetrics.map(m => `
                                    <span class="text-blue-500 cursor-pointer hover:underline">${m}</span>
                                `).join('、')}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function editMetric(metricId) {
    editingMetricId = metricId;
    const metric = mockData.metrics.find(m => m.id === metricId);
    if (!metric) return;

    renderMetricForm(metric, false);
}

function addNewMetric() {
    editingMetricId = null;
    const emptyMetric = {
        id: '',
        name: '',
        category: '销售指标',
        unit: '',
        formula: '',
        description: '',
        calculation: '',
        dataSource: '销售数据',
        updateFrequency: '每日更新',
        relatedMetrics: []
    };
    renderMetricForm(emptyMetric, true);
}

function renderMetricForm(metric, isNew) {
    const container = document.getElementById('page-metrics');
    container.innerHTML = `
        <div class="max-w-3xl mx-auto">
            <button onclick="renderMetricsPage()" class="mb-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <i class="ri-arrow-left-line"></i>返回指标列表
            </button>
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-gray-900">${isNew ? '新建指标' : '编辑指标口径'}</h3>
                    <p class="text-sm text-gray-500 mt-1">${isNew ? '填写指标信息创建新指标' : metric.name}</p>
                </div>
                <div class="p-6 space-y-5">
                    <div>
                        <label class="text-sm font-medium text-gray-700 block mb-2">指标名称</label>
                        <input type="text" id="metric-name" value="${metric.name}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 block mb-2">指标分类</label>
                            <select id="metric-category" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option ${metric.category === '销售指标' ? 'selected' : ''}>销售指标</option>
                                <option ${metric.category === '会员指标' ? 'selected' : ''}>会员指标</option>
                                <option ${metric.category === '库存指标' ? 'selected' : ''}>库存指标</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 block mb-2">单位</label>
                            <input type="text" id="metric-unit" value="${metric.unit}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700 block mb-2">指标定义/描述</label>
                        <textarea id="metric-description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${metric.description}</textarea>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700 block mb-2">计算公式</label>
                        <input type="text" id="metric-formula" value="${metric.formula}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono">
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700 block mb-2">SQL 口径</label>
                        <textarea id="metric-calculation" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm">${metric.calculation}</textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 block mb-2">数据来源</label>
                            <select id="metric-dataSource" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option ${metric.dataSource === '销售数据' ? 'selected' : ''}>销售数据</option>
                                <option ${metric.dataSource === '会员数据' ? 'selected' : ''}>会员数据</option>
                                <option ${metric.dataSource === '库存数据' ? 'selected' : ''}>库存数据</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 block mb-2">更新频率</label>
                            <select id="metric-updateFrequency" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option ${metric.updateFrequency === '实时' ? 'selected' : ''}>实时</option>
                                <option ${metric.updateFrequency === '每小时' ? 'selected' : ''}>每小时</option>
                                <option ${metric.updateFrequency === '每日更新' ? 'selected' : ''}>每日更新</option>
                                <option ${metric.updateFrequency === '每周更新' ? 'selected' : ''}>每周更新</option>
                                <option ${metric.updateFrequency === '每月更新' ? 'selected' : ''}>每月更新</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onclick="renderMetricsPage()" class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">取消</button>
                    <button onclick="saveMetric(${isNew})" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">保存</button>
                </div>
            </div>
        </div>
    `;
}

function saveMetric(isNew) {
    const name = document.getElementById('metric-name').value.trim();
    if (!name) {
        alert('请输入指标名称');
        return;
    }

    const metricData = {
        name: name,
        category: document.getElementById('metric-category').value,
        unit: document.getElementById('metric-unit').value,
        formula: document.getElementById('metric-formula').value,
        description: document.getElementById('metric-description').value,
        calculation: document.getElementById('metric-calculation').value,
        dataSource: document.getElementById('metric-dataSource').value,
        updateFrequency: document.getElementById('metric-updateFrequency').value,
        relatedMetrics: []
    };

    if (isNew) {
        const newId = 'metric_' + Date.now();
        mockData.metrics.push({
            id: newId,
            ...metricData
        });
        alert('新建指标成功！');
    } else {
        const index = mockData.metrics.findIndex(m => m.id === editingMetricId);
        if (index > -1) {
            mockData.metrics[index] = {
                ...mockData.metrics[index],
                ...metricData
            };
            alert('指标保存成功！');
        }
    }

    editingMetricId = null;
    renderMetricsPage();
}

function renderSharePage() {
    const container = document.getElementById('page-share');
    container.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-gray-900">生成分享链接</h3>
                    <p class="text-sm text-gray-500 mt-1">创建分享链接，邀请他人查看看板</p>
                </div>
                <div class="p-6 space-y-5">
                    <div>
                        <label class="text-sm font-medium text-gray-700 block mb-2">看板名称</label>
                        <input type="text" value="月度经营分析看板" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-gray-700 block mb-2">有效期</label>
                            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>1天</option>
                                <option>7天</option>
                                <option selected>30天</option>
                                <option>永久有效</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700 block mb-2">访问权限</label>
                            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>公开访问</option>
                                <option selected>密码访问</option>
                                <option>指定人员</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="text-sm font-medium text-gray-700">访问密码</label>
                            <div id="password-switch" class="switch active" onclick="togglePasswordSwitch()"></div>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" value="abc123" id="share-password" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 share-link-input">
                            <button onclick="generatePassword()" class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                随机生成
                            </button>
                        </div>
                    </div>
                    <button onclick="createShareLink()" class="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium">
                        <i class="ri-share-forward-line mr-2"></i>生成分享链接
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 class="font-semibold text-gray-900">分享记录</h3>
                        <p class="text-sm text-gray-500 mt-1">管理已创建的分享链接</p>
                    </div>
                    <span class="text-sm text-gray-500">共 ${mockData.shareRecords.length} 条</span>
                </div>
                <div class="divide-y divide-gray-100">
                    ${mockData.shareRecords.map(record => `
                        <div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-3 mb-1">
                                    <h4 class="font-medium text-gray-900">${record.name}</h4>
                                    <span class="px-2 py-0.5 text-xs rounded-full ${
                                        record.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }">
                                        ${record.status === 'active' ? '生效中' : '已过期'}
                                    </span>
                                    ${record.hasPassword ? '<span class="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full"><i class="ri-lock-line mr-1"></i>密码</span>' : ''}
                                </div>
                                <div class="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                                    <span class="truncate max-w-[300px]"><i class="ri-link mr-1"></i>${record.shareUrl}</span>
                                    <span><i class="ri-eye-line mr-1"></i>${record.viewCount}次访问</span>
                                    <span><i class="ri-time-line mr-1"></i>有效期至 ${record.expireTime}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 ml-4">
                                <button onclick="copyShareUrl('${record.shareUrl}')" class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    <i class="ri-file-copy-line mr-1"></i>复制
                                </button>
                                <button onclick="viewAccessRecords(${record.id})" class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                    <i class="ri-history-line mr-1"></i>访问记录
                                </button>
                                <button onclick="deleteShare(${record.id})" class="px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <i class="ri-delete-bin-line mr-1"></i>删除
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-gray-900">最近访问记录</h3>
                    <p class="text-sm text-gray-500 mt-1">查看看板的访问日志</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">访问者</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部门</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">访问时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">停留时长</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${mockData.accessRecords.map(record => `
                                <tr class="access-record-item">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span class="text-blue-600 text-sm font-medium">${record.viewer[0]}</span>
                                            </div>
                                            <span class="text-sm text-gray-900">${record.viewer}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${record.department}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${record.accessTime}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${record.duration}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full ${
                                            record.device === 'PC' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                        }">
                                            <i class="ri-${record.device === 'PC' ? 'computer' : 'smartphone'}-line mr-1"></i>${record.device}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function createShareLink() {
    const nameInput = document.querySelector('input[value="月度经营分析看板"]');
    const name = nameInput ? nameInput.value : '经营分析看板';
    
    const passwordSwitch = document.getElementById('password-switch');
    const hasPassword = passwordSwitch ? passwordSwitch.classList.contains('active') : false;
    
    const passwordInput = document.getElementById('share-password');
    const password = passwordInput ? passwordInput.value : '';
    
    const randomId = Math.random().toString(36).substring(2, 8);
    const shareUrl = `https://dashboard.example.com/s/${randomId}`;
    
    const now = new Date();
    const createTime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    const expireDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expireTime = `${expireDate.getFullYear()}-${String(expireDate.getMonth()+1).padStart(2,'0')}-${String(expireDate.getDate()).padStart(2,'0')}`;
    
    const newShare = {
        id: Date.now(),
        name: name,
        shareUrl: shareUrl,
        createTime: createTime,
        expireTime: expireTime,
        hasPassword: hasPassword,
        password: password,
        viewCount: 0,
        status: 'active'
    };
    
    mockData.shareRecords.unshift(newShare);
    renderSharePage();
    
    setTimeout(() => {
        alert('分享链接已生成！');
    }, 100);
}

function togglePasswordSwitch() {
    const switchEl = document.getElementById('password-switch');
    const passwordInput = document.getElementById('share-password');
    const isActive = switchEl.classList.toggle('active');
    
    if (passwordInput) {
        passwordInput.disabled = !isActive;
        passwordInput.style.opacity = isActive ? '1' : '0.5';
    }
}

function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('share-password').value = password;
}

function copyShareUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('链接已复制到剪贴板！');
    }).catch(() => {
        alert('复制成功！');
    });
}

function viewAccessRecords(shareId) {
    console.log('View access records for share:', shareId);
}

function deleteShare(shareId) {
    if (confirm('确定要删除这个分享链接吗？')) {
        const index = mockData.shareRecords.findIndex(s => s.id === shareId);
        if (index > -1) {
            mockData.shareRecords.splice(index, 1);
            renderSharePage();
        }
    }
}

function renderDisplayPage() {
    const container = document.getElementById('page-display');
    container.innerHTML = `
        <div class="big-screen h-full text-white p-8 flex flex-col">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-3xl font-bold mb-1">经营数据大屏</h1>
                    <p class="text-gray-400">实时更新 · 数据截至 <span id="current-time">--:--:--</span></p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-400">轮播间隔:</span>
                        <select id="carousel-interval" onchange="changeCarouselInterval()" class="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5">
                            <option value="5000">5秒</option>
                            <option value="10000" selected>10秒</option>
                            <option value="15000">15秒</option>
                            <option value="30000">30秒</option>
                        </select>
                    </div>
                    <button onclick="toggleFullscreen()" class="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        <i class="ri-fullscreen-line mr-1"></i>全屏
                    </button>
                    <button onclick="navigateTo('layout')" class="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                        <i class="ri-edit-line mr-1"></i>编辑
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-6 mb-6">
                <div class="card rounded-xl p-5">
                    <p class="text-gray-400 text-sm mb-2">今日销售额</p>
                    <p class="text-3xl font-bold mb-1">¥215,680</p>
                    <p class="text-green-400 text-sm"><i class="ri-arrow-up-line"></i> 12.5% 同比</p>
                </div>
                <div class="card rounded-xl p-5">
                    <p class="text-gray-400 text-sm mb-2">订单数</p>
                    <p class="text-3xl font-bold mb-1">586<span class="text-lg">单</span></p>
                    <p class="text-green-400 text-sm"><i class="ri-arrow-up-line"></i> 8.3% 环比</p>
                </div>
                <div class="card rounded-xl p-5">
                    <p class="text-gray-400 text-sm mb-2">客流量</p>
                    <p class="text-3xl font-bold mb-1">1,052<span class="text-lg">人</span></p>
                    <p class="text-red-400 text-sm"><i class="ri-arrow-down-line"></i> 2.1% 同比</p>
                </div>
                <div class="card rounded-xl p-5">
                    <p class="text-gray-400 text-sm mb-2">客单价</p>
                    <p class="text-3xl font-bold mb-1">¥367.9</p>
                    <p class="text-green-400 text-sm"><i class="ri-arrow-up-line"></i> 4.8% 环比</p>
                </div>
            </div>

            <div class="flex-1 relative overflow-hidden">
                <div id="carousel-container" class="h-full transition-transform duration-700 ease-in-out flex">
                    <div class="carousel-slide h-full w-full flex-shrink-0 grid grid-cols-2 gap-6">
                        <div class="card rounded-xl p-5">
                            <h3 class="text-lg font-semibold mb-4">销售趋势</h3>
                            <div id="display-chart-1" class="h-[calc(100%-40px)]"></div>
                        </div>
                        <div class="card rounded-xl p-5">
                            <h3 class="text-lg font-semibold mb-4">门店销售排行</h3>
                            <div id="display-chart-2" class="h-[calc(100%-40px)]"></div>
                        </div>
                    </div>
                    <div class="carousel-slide h-full w-full flex-shrink-0 grid grid-cols-2 gap-6">
                        <div class="card rounded-xl p-5">
                            <h3 class="text-lg font-semibold mb-4">商品类别占比</h3>
                            <div id="display-chart-3" class="h-[calc(100%-40px)]"></div>
                        </div>
                        <div class="card rounded-xl p-5">
                            <h3 class="text-lg font-semibold mb-4">会员增长趋势</h3>
                            <div id="display-chart-4" class="h-[calc(100%-40px)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center gap-2 mt-6">
                <button class="carousel-indicator active" onclick="goToSlide(0)"></button>
                <button class="carousel-indicator" onclick="goToSlide(1)"></button>
            </div>
        </div>
    `;

    setTimeout(() => {
        initDisplayCharts();
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
    }, 100);
}

function initDisplayCharts() {
    const theme = mockData.themes.find(t => t.id === dashboardState.currentTheme) || mockData.themes[0];
    
    const chart1 = echarts.init(document.getElementById('display-chart-1'), 'dark');
    chart1.setOption({
        color: theme.colors,
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: mockData.salesDailyData.dates,
            axisLine: { lineStyle: { color: '#475569' } },
            axisLabel: { color: '#94a3b8' }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#334155' } },
            axisLabel: { color: '#94a3b8' }
        },
        series: [{
            name: '销售额',
            type: 'line',
            smooth: true,
            data: mockData.salesDailyData.salesAmount,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
                    { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                ])
            },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6
        }]
    });

    const chart2 = echarts.init(document.getElementById('display-chart-2'), 'dark');
    chart2.setOption({
        color: theme.colors,
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: mockData.salesByStore.map(s => s.store.slice(0, 6)),
            axisLine: { lineStyle: { color: '#475569' } },
            axisLabel: { color: '#94a3b8', rotate: 30 }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#334155' } },
            axisLabel: { color: '#94a3b8' }
        },
        series: [{
            name: '销售额',
            type: 'bar',
            data: mockData.salesByStore.map(s => s.sales),
            barWidth: '50%',
            itemStyle: {
                borderRadius: [4, 4, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#60a5fa' },
                    { offset: 1, color: '#3b82f6' }
                ])
            }
        }]
    });

    const chart3 = echarts.init(document.getElementById('display-chart-3'), 'dark');
    chart3.setOption({
        color: theme.colors,
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#94a3b8' } },
        series: [{
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['35%', '50%'],
            itemStyle: { borderRadius: 4, borderColor: '#1e293b', borderWidth: 2 },
            label: { show: false },
            data: mockData.salesByCategory.map(item => ({
                name: item.category,
                value: item.value
            }))
        }]
    });

    const chart4 = echarts.init(document.getElementById('display-chart-4'), 'dark');
    chart4.setOption({
        color: ['#8b5cf6', '#10b981'],
        tooltip: { trigger: 'axis' },
        legend: { data: ['新增会员', '活跃会员'], top: 0, textStyle: { color: '#94a3b8' } },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
        xAxis: {
            type: 'category',
            data: mockData.memberMonths,
            axisLine: { lineStyle: { color: '#475569' } },
            axisLabel: { color: '#94a3b8' }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#334155' } },
            axisLabel: { color: '#94a3b8' }
        },
        series: [
            {
                name: '新增会员',
                type: 'line',
                smooth: true,
                data: mockData.memberMonthlyNew,
                lineStyle: { width: 2 }
            },
            {
                name: '活跃会员',
                type: 'line',
                smooth: true,
                data: mockData.memberMonthlyActive,
                lineStyle: { width: 2 }
            }
        ]
    });
}

function startCarousel() {
    if (displayCarouselTimer) {
        clearInterval(displayCarouselTimer);
    }
    const interval = document.getElementById('carousel-interval')?.value || 10000;
    displayCarouselTimer = setInterval(() => {
        nextSlide();
    }, parseInt(interval));
}

function stopCarousel() {
    if (displayCarouselTimer) {
        clearInterval(displayCarouselTimer);
        displayCarouselTimer = null;
    }
}

function changeCarouselInterval() {
    startCarousel();
}

function nextSlide() {
    displayCarouselIndex = (displayCarouselIndex + 1) % 2;
    goToSlide(displayCarouselIndex);
}

function goToSlide(index) {
    displayCarouselIndex = index;
    const container = document.getElementById('carousel-container');
    if (container) {
        container.style.transform = `translateX(-${index * 100}%)`;
    }
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
}

function updateCurrentTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        timeEl.textContent = timeStr;
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function initThemePanel() {
    const themeList = document.getElementById('theme-list');
    if (!themeList) return;

    themeList.innerHTML = mockData.themes.map(theme => `
        <div class="theme-card p-3 border border-gray-200 rounded-lg cursor-pointer ${dashboardState.currentTheme === theme.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}"
             onclick="selectTheme('${theme.id}')">
            <div class="flex gap-1 mb-2">
                ${theme.colors.slice(0, 5).map(c => `<div class="w-4 h-4 rounded-full" style="background: ${c};"></div>`).join('')}
            </div>
            <p class="text-xs text-gray-600">${theme.name}</p>
        </div>
    `).join('');

    const colorInput = document.getElementById('custom-primary-color');
    if (colorInput) {
        colorInput.addEventListener('input', (e) => {
            document.getElementById('custom-color-hex').textContent = e.target.value;
        });
    }
}

function toggleThemePanel() {
    const panel = document.getElementById('theme-panel');
    panel.classList.toggle('translate-x-full');
    if (!panel.classList.contains('translate-x-full')) {
        initThemePanel();
    }
}

function selectTheme(themeId) {
    dashboardState.currentTheme = themeId;
    chartManager.updateTheme(themeId);
    initThemePanel();
    
    if (currentPage === 'layout') {
        renderLayoutCanvas();
    } else if (currentPage === 'chart-edit') {
        renderChartEditPage();
    }
}

function applyCustomTheme() {
    const color = document.getElementById('custom-primary-color').value;
    
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const shades = [];
    for (let i = 0; i < 6; i++) {
        const factor = 0.4 + i * 0.12;
        shades.push(`rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`);
    }
    
    const customTheme = {
        id: 'custom',
        name: '自定义',
        colors: shades,
        primary: color
    };
    
    const existingIndex = mockData.themes.findIndex(t => t.id === 'custom');
    if (existingIndex > -1) {
        mockData.themes[existingIndex] = customTheme;
    } else {
        mockData.themes.push(customTheme);
    }
    
    selectTheme('custom');
    alert('自定义主题已应用！');
}

function toggleMobilePreview() {
    const preview = document.getElementById('mobile-preview');
    if (preview.classList.contains('hidden')) {
        preview.classList.remove('hidden');
        preview.classList.add('flex');
        renderMobileContent();
    } else {
        preview.classList.add('hidden');
        preview.classList.remove('flex');
    }
}

function renderMobileContent() {
    const content = document.getElementById('mobile-content');
    if (!content) return;

    content.innerHTML = `
        <div class="p-4 space-y-4">
            <div class="text-center mb-4">
                <h2 class="text-lg font-bold text-gray-900">经营数据看板</h2>
                <p class="text-xs text-gray-500">实时更新</p>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl">
                    <p class="text-xs opacity-80">销售额</p>
                    <p class="text-xl font-bold">¥21.5万</p>
                    <p class="text-xs opacity-80">↑ 12.5%</p>
                </div>
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-xl">
                    <p class="text-xs opacity-80">订单数</p>
                    <p class="text-xl font-bold">586</p>
                    <p class="text-xs opacity-80">↑ 8.3%</p>
                </div>
                <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 rounded-xl">
                    <p class="text-xs opacity-80">客流量</p>
                    <p class="text-xl font-bold">1,052</p>
                    <p class="text-xs opacity-80">↓ 2.1%</p>
                </div>
                <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-xl">
                    <p class="text-xs opacity-80">客单价</p>
                    <p class="text-xl font-bold">¥367.9</p>
                    <p class="text-xs opacity-80">↑ 4.8%</p>
                </div>
            </div>

            <div class="bg-white rounded-xl p-4 shadow-sm">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">销售趋势</h3>
                <div id="mobile-chart" class="h-48"></div>
            </div>

            <div class="bg-white rounded-xl p-4 shadow-sm">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">门店排行</h3>
                <div class="space-y-2">
                    ${mockData.salesByStore.slice(0, 5).map((store, i) => `
                        <div class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div class="flex items-center gap-2">
                                <span class="w-5 h-5 flex items-center justify-center bg-gray-100 rounded text-xs font-medium text-gray-600">${i + 1}</span>
                                <span class="text-sm text-gray-700">${store.store.slice(0, 6)}</span>
                            </div>
                            <span class="text-sm font-medium text-gray-900">¥${(store.sales / 10000).toFixed(1)}万</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const chartEl = document.getElementById('mobile-chart');
        if (chartEl) {
            const chart = echarts.init(chartEl);
            chart.setOption({
                color: ['#3b82f6'],
                tooltip: { trigger: 'axis' },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: mockData.salesDailyData.dates.slice(0, 7),
                    axisLabel: { fontSize: 10, color: '#94a3b8' },
                    axisLine: { lineStyle: { color: '#e2e8f0' } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { fontSize: 10, color: '#94a3b8' },
                    axisLine: { show: false },
                    splitLine: { lineStyle: { color: '#f1f5f9' } }
                },
                series: [{
                    type: 'line',
                    smooth: true,
                    data: mockData.salesDailyData.salesAmount.slice(0, 7),
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                        ])
                    }
                }]
            });
        }
    }, 100);
}

function exportImage() {
    if (currentPage === 'layout') {
        const canvas = document.getElementById('layout-canvas');
        if (canvas) {
            html2canvas(canvas, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'dashboard.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(() => {
                alert('导出成功！图片已下载。');
            });
            return;
        }
    }
    alert('请在布局画布页面导出图片。');
}

function initAnomalyColorButtons() {
    const colorBtns = document.querySelectorAll('.anomaly-color-btn');
    colorBtns.forEach(btn => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = 'true';
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            colorBtns.forEach(b => {
                b.classList.remove('ring-2', 'ring-offset-2', 'ring-red-500', 'ring-orange-500', 'ring-yellow-500', 'ring-green-500', 'ring-blue-500', 'ring-purple-500');
            });
            
            const color = btn.dataset.color;
            selectedAnomalyColor = color;
            
            const colorClass = {
                '#ef4444': 'ring-red-500',
                '#f97316': 'ring-orange-500',
                '#eab308': 'ring-yellow-500',
                '#22c55e': 'ring-green-500',
                '#3b82f6': 'ring-blue-500',
                '#a855f7': 'ring-purple-500'
            }[color] || 'ring-blue-500';
            
            btn.classList.add('ring-2', 'ring-offset-2', colorClass);
        });
    });
}

function refreshAnomalyColorSelection() {
    const colorBtns = document.querySelectorAll('.anomaly-color-btn');
    colorBtns.forEach(btn => {
        if (btn.dataset.color === selectedAnomalyColor) {
            const colorClass = {
                '#ef4444': 'ring-red-500',
                '#f97316': 'ring-orange-500',
                '#eab308': 'ring-yellow-500',
                '#22c55e': 'ring-green-500',
                '#3b82f6': 'ring-blue-500',
                '#a855f7': 'ring-purple-500'
            }[btn.dataset.color] || 'ring-blue-500';
            btn.classList.add('ring-2', 'ring-offset-2', colorClass);
        } else {
            btn.classList.remove('ring-2', 'ring-offset-2', 'ring-red-500', 'ring-orange-500', 'ring-yellow-500', 'ring-green-500', 'ring-blue-500', 'ring-purple-500');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderDataSelectPage();
    setTimeout(initAnomalyColorButtons, 200);
});