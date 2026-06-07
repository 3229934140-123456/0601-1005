const chartManager = {
    instances: {},

    getChartOptions(type, config) {
        const theme = mockData.themes.find(t => t.id === dashboardState.currentTheme) || mockData.themes[0];
        const colors = theme.colors;

        switch (type) {
            case 'line':
                return this.getLineChartOptions(config, colors);
            case 'bar':
                return this.getBarChartOptions(config, colors);
            case 'pie':
                return this.getPieChartOptions(config, colors);
            case 'area':
                return this.getAreaChartOptions(config, colors);
            default:
                return this.getLineChartOptions(config, colors);
        }
    },

    getLineChartOptions(config, colors) {
        const data = this.getChartData(config);
        const seriesData = this.buildSeriesData(data, config, colors, 'line');
        
        return {
            color: colors,
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'transparent',
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: (params) => {
                    let result = params[0].axisValue + '<br/>';
                    params.forEach(param => {
                        const marker = param.marker || '';
                        let value = param.value;
                        let rateText = '';
                        
                        if (param.seriesName.includes('同比') || param.seriesName.includes('环比')) {
                            if (typeof value === 'number') {
                                rateText = (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
                            }
                        } else {
                            if (typeof value === 'number') {
                                rateText = value.toLocaleString();
                            }
                        }
                        
                        result += marker + param.seriesName + ': ' + rateText + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: seriesData.map(s => s.name),
                top: 0,
                textStyle: { fontSize: 12, color: '#64748b' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.xAxis,
                axisLine: { lineStyle: { color: '#e2e8f0' } },
                axisLabel: { color: '#94a3b8', fontSize: 11 }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '数值',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#f1f5f9' } },
                    axisLabel: { color: '#94a3b8', fontSize: 11 }
                },
                (config.showYoY || config.showMoM) ? {
                    type: 'value',
                    name: '变化率',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { 
                        color: '#94a3b8', 
                        fontSize: 11,
                        formatter: '{value}%'
                    }
                } : null
            ].filter(Boolean),
            series: seriesData.map((s, i) => {
                const isRateSeries = s.name.includes('同比') || s.name.includes('环比');
                return {
                    name: s.name,
                    type: 'line',
                    yAxisIndex: isRateSeries ? 1 : 0,
                    smooth: !isRateSeries,
                    symbol: isRateSeries ? 'diamond' : 'circle',
                    symbolSize: isRateSeries ? 8 : 6,
                    data: s.data,
                    lineStyle: { 
                        width: isRateSeries ? 1.5 : 2, 
                        type: isRateSeries ? 'dashed' : 'solid',
                        color: s.color 
                    },
                    itemStyle: { color: s.color },
                    markPoint: !isRateSeries && i === 0 ? this.getMarkPoints(config.chartId) : undefined
                };
            })
        };
    },

    buildSeriesData(data, config, colors, chartType) {
        let series = [];
        
        data.series.forEach((s, i) => {
            series.push({
                name: s.name,
                data: s.data,
                color: colors[i % colors.length]
            });
        });

        if (config.showYoY && data.series.length > 0) {
            const mainSeries = data.series[0];
            const yoyData = this.calculateYoY(mainSeries.data);
            series.push({
                name: mainSeries.name + '同比',
                data: yoyData,
                color: '#f97316'
            });
        }

        if (config.showMoM && data.series.length > 0) {
            const mainSeries = data.series[0];
            const momData = this.calculateMoM(mainSeries.data);
            series.push({
                name: mainSeries.name + '环比',
                data: momData,
                color: '#8b5cf6'
            });
        }

        return series;
    },

    calculateYoY(data) {
        return data.map((value, index) => {
            const prevValue = data[Math.max(0, index - 7)];
            if (prevValue === 0) return 0;
            return Number(((value - prevValue) / prevValue * 100).toFixed(1));
        });
    },

    calculateMoM(data) {
        return data.map((value, index) => {
            if (index === 0) return 0;
            const prevValue = data[index - 1];
            if (prevValue === 0) return 0;
            return Number(((value - prevValue) / prevValue * 100).toFixed(1));
        });
    },

    getBarChartOptions(config, colors) {
        const data = this.getChartData(config);
        const seriesData = this.buildSeriesData(data, config, colors, 'bar');
        const hasRateSeries = config.showYoY || config.showMoM;

        return {
            color: colors,
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'transparent',
                textStyle: { color: '#fff', fontSize: 12 },
                axisPointer: { type: 'shadow' },
                formatter: (params) => {
                    let result = params[0].axisValue + '<br/>';
                    params.forEach(param => {
                        const marker = param.marker || '';
                        let rateText = '';
                        
                        if (param.seriesName.includes('同比') || param.seriesName.includes('环比')) {
                            const value = param.value;
                            if (typeof value === 'number') {
                                rateText = (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
                            }
                        } else {
                            const value = param.value;
                            if (typeof value === 'number') {
                                rateText = value.toLocaleString();
                            }
                        }
                        
                        result += marker + param.seriesName + ': ' + rateText + '<br/>';
                    });
                    return result;
                }
            },
            legend: {
                data: seriesData.map(s => s.name),
                top: 0,
                textStyle: { fontSize: 12, color: '#64748b' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.xAxis,
                axisLine: { lineStyle: { color: '#e2e8f0' } },
                axisLabel: { color: '#94a3b8', fontSize: 11, rotate: data.xAxis.length > 6 ? 30 : 0 }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '数值',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#f1f5f9' } },
                    axisLabel: { color: '#94a3b8', fontSize: 11 }
                },
                hasRateSeries ? {
                    type: 'value',
                    name: '变化率',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { 
                        color: '#94a3b8', 
                        fontSize: 11,
                        formatter: '{value}%'
                    }
                } : null
            ].filter(Boolean),
            series: seriesData.map((s, i) => {
                const isRateSeries = s.name.includes('同比') || s.name.includes('环比');
                if (isRateSeries) {
                    return {
                        name: s.name,
                        type: 'line',
                        yAxisIndex: 1,
                        data: s.data,
                        smooth: true,
                        symbol: 'diamond',
                        symbolSize: 8,
                        lineStyle: { width: 2, color: s.color },
                        itemStyle: { color: s.color }
                    };
                }
                return {
                    name: s.name,
                    type: 'bar',
                    data: s.data,
                    barWidth: '35%',
                    itemStyle: {
                        color: s.color,
                        borderRadius: [4, 4, 0, 0]
                    }
                };
            })
        };
    },

    getPieChartOptions(config, colors) {
        const data = this.getChartData(config);
        return {
            color: colors,
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'transparent',
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                right: '5%',
                top: 'center',
                textStyle: { fontSize: 12, color: '#64748b' }
            },
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                labelLine: { show: false },
                data: data.seriesData
            }]
        };
    },

    getAreaChartOptions(config, colors) {
        const options = this.getLineChartOptions(config, colors);
        options.series = options.series.map(s => ({
            ...s,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                    { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                ])
            }
        }));
        return options;
    },

    getChartData(config) {
        if (config.dataSource === 'sales') {
            if (config.chartType === 'pie' || config.type === 'pie') {
                return {
                    seriesData: mockData.salesByCategory.map(item => ({
                        name: item.category,
                        value: item.value
                    }))
                };
            }
            if (config.xField === 'store_name' || config.xAxis === 'store') {
                return {
                    xAxis: mockData.salesByStore.map(s => s.store),
                    series: [{
                        name: '销售额',
                        data: mockData.salesByStore.map(s => s.sales)
                    }]
                };
            }
            return {
                xAxis: mockData.salesDailyData.dates,
                series: [{
                    name: config.yField === 'order_count' ? '订单数' :
                          config.yField === 'customer_count' ? '客流量' : '销售额',
                    data: config.yField === 'order_count' ? mockData.salesDailyData.orderCount :
                          config.yField === 'customer_count' ? mockData.salesDailyData.customerCount :
                          mockData.salesDailyData.salesAmount
                }]
            };
        }
        if (config.dataSource === 'member') {
            if (config.xField === 'level' || config.type === 'pie') {
                if (config.type === 'pie') {
                    return {
                        seriesData: mockData.memberLevelData.map(item => ({
                            name: item.level,
                            value: item.count
                        }))
                    };
                }
                return {
                    xAxis: mockData.memberLevelData.map(m => m.level),
                    series: [{
                        name: '会员数',
                        data: mockData.memberLevelData.map(m => m.count)
                    }]
                };
            }
            return {
                xAxis: mockData.memberMonths,
                series: [
                    { name: '新增会员', data: mockData.memberMonthlyNew },
                    { name: '活跃会员', data: mockData.memberMonthlyActive }
                ]
            };
        }
        if (config.dataSource === 'inventory') {
            return {
                xAxis: mockData.inventoryData.categories,
                series: [{
                    name: config.yField === 'stock_quantity' ? '库存数量' :
                          config.yField === 'turnover_rate' ? '周转率' : '库存金额',
                    data: config.yField === 'stock_quantity' ? mockData.inventoryData.stockQuantity :
                          config.yField === 'turnover_rate' ? mockData.inventoryData.turnoverRate :
                          mockData.inventoryData.stockValue
                }]
            };
        }
        return { xAxis: [], series: [] };
    },

    getMarkPoints(chartId) {
        const anomalies = mockData.anomalies.filter(a => a.chartId === chartId);
        if (anomalies.length === 0) return undefined;

        return {
            symbol: 'pin',
            symbolSize: 35,
            label: {
                show: false
            },
            tooltip: {
                formatter: (params) => {
                    const anomaly = anomalies.find(a => a.date === params.data.xAxis);
                    if (anomaly) {
                        const typeNames = {
                            spike: '数据突增',
                            drop: '数据突降',
                            outlier: '异常值',
                            trend: '趋势变化',
                            other: '其他'
                        };
                        return `
                            <div style="padding: 4px 8px;">
                                <div style="font-weight: bold; margin-bottom: 4px; color: ${anomaly.color};">
                                    ${typeNames[anomaly.type] || '异常'}
                                </div>
                                <div style="font-size: 12px; margin-bottom: 4px;">
                                    <strong>日期:</strong> ${anomaly.date}
                                </div>
                                <div style="font-size: 12px;">
                                    <strong>说明:</strong> ${anomaly.description}
                                </div>
                            </div>
                        `;
                    }
                    return params.name;
                }
            },
            data: anomalies.map(a => ({
                name: a.description,
                xAxis: a.date,
                yAxis: this.getValueForDate(a.date, chartId),
                itemStyle: { color: a.color },
                value: a.description
            }))
        };
    },

    getValueForDate(date, chartId) {
        const chart = dashboardState.charts.find(c => c.id === chartId);
        if (!chart) return 0;
        const index = mockData.salesDailyData.dates.indexOf(date);
        if (index === -1) return 0;
        return mockData.salesDailyData.salesAmount[index];
    },

    renderChart(chartId, config, container) {
        if (this.instances[chartId]) {
            this.instances[chartId].dispose();
        }
        const chart = echarts.init(container);
        const options = this.getChartOptions(config.type || config.chartType, { ...config, chartId });
        chart.setOption(options);
        this.instances[chartId] = chart;

        chart.on('click', (params) => {
            if (params.componentType === 'markPoint') {
                console.log('点击了标注点', params);
            }
        });

        window.addEventListener('resize', () => {
            chart.resize();
        });

        return chart;
    },

    resizeChart(chartId) {
        if (this.instances[chartId]) {
            this.instances[chartId].resize();
        }
    },

    disposeChart(chartId) {
        if (this.instances[chartId]) {
            this.instances[chartId].dispose();
            delete this.instances[chartId];
        }
    },

    updateTheme(themeId) {
        dashboardState.currentTheme = themeId;
        Object.keys(this.instances).forEach(chartId => {
            const chart = dashboardState.charts.find(c => c.id === chartId);
            if (chart && this.instances[chartId]) {
                const options = this.getChartOptions(chart.type, { ...chart, chartId });
                this.instances[chartId].setOption(options);
            }
        });
    },

    getImage(chartId) {
        if (this.instances[chartId]) {
            return this.instances[chartId].getDataURL({ type: 'png', pixelRatio: 2 });
        }
        return null;
    }
};