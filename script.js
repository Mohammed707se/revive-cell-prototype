// ReviveCell AI Battery Analysis System
class ReviveCellAI {
    constructor() {
        this.batteryDatabase = [];
        this.analysisHistory = JSON.parse(localStorage.getItem('reviveCell_history')) || [];
        this.stats = JSON.parse(localStorage.getItem('reviveCell_stats')) || {
            totalBatteries: 0,
            revivedBatteries: 0,
            energySaved: 0,
            moneySaved: 0
        };
        this.init();
    }

    init() {
        try {
            console.log('Initializing ReviveCell AI...');
            
            // Setup event listeners first
            this.setupEventListeners();
            
            // Generate database
            this.generateBatteryDatabase();
            
            // Initialize charts
            this.setupChart();
            
            // Update UI
            this.updateDashboard();
            this.renderHistory();
            
            console.log('Initialization complete');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    setupEventListeners() {
        try {
            console.log('Setting up event listeners...');
            
            // Navigation
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchSection(e.target.dataset.section);
                });
            });

            // Analysis button
            const analyzeBtn = document.getElementById('analyze-btn');
            if (analyzeBtn) {
                analyzeBtn.addEventListener('click', () => {
                    this.analyzeBattery();
                });
            } else {
                console.error('Analyze button not found');
            }

            // Battery type change
            const batteryTypeSelect = document.getElementById('battery_type');
            if (batteryTypeSelect) {
                batteryTypeSelect.addEventListener('change', (e) => {
                    this.fillRandomData(e.target.value);
                });
            } else {
                console.error('Battery type select not found');
            }

            console.log('Event listeners setup complete');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    setupAutoFill() {
        const batteryTypes = ['AA', 'AAA', 'Li-ion', 'Laptop'];

        // Fill form with random data when battery type changes
        document.getElementById('battery_type').addEventListener('change', (e) => {
            const type = e.target.value;
            this.fillRandomData(type);
        });
    }

    fillRandomData(batteryType) {
        const ranges = {
            'AA': { voltage: [0.8, 1.6], resistance: [0.1, 0.8], temp: [20, 40], cycles: [0, 500], age: [1, 36] },
            'AAA': { voltage: [0.8, 1.6], resistance: [0.1, 0.8], temp: [20, 40], cycles: [0, 400], age: [1, 24] },
            'Li-ion': { voltage: [3.0, 4.2], resistance: [0.05, 0.5], temp: [15, 45], cycles: [0, 1000], age: [1, 60] },
            'Laptop': { voltage: [10.0, 12.6], resistance: [0.1, 1.0], temp: [25, 50], cycles: [0, 800], age: [6, 72] }
        };

        const range = ranges[batteryType];
        if (range) {
            document.getElementById('voltage').value = this.randomInRange(range.voltage[0], range.voltage[1]).toFixed(1);
            document.getElementById('internal_resistance').value = this.randomInRange(range.resistance[0], range.resistance[1]).toFixed(2);
            document.getElementById('temperature').value = Math.round(this.randomInRange(range.temp[0], range.temp[1]));
            document.getElementById('cycle_count').value = Math.round(this.randomInRange(range.cycles[0], range.cycles[1]));
            document.getElementById('age_months').value = Math.round(this.randomInRange(range.age[0], range.age[1]));
        }
    }

    randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');
    }

    async analyzeBattery() {
        // Get input values
        const batteryData = {
            battery_type: document.getElementById('battery_type').value,
            voltage: parseFloat(document.getElementById('voltage').value),
            internal_resistance: parseFloat(document.getElementById('internal_resistance').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            cycle_count: parseInt(document.getElementById('cycle_count').value),
            age_months: parseInt(document.getElementById('age_months').value),
            leakage_detected: Math.random() > 0.8 ? 1 : 0 // Random leakage detection
        };

        // Validate inputs
        if (!this.validateInputs(batteryData)) {
            alert('يرجى ملء جميع الحقول بقيم صحيحة');
            return;
        }

        try {
            // Show loading
            const loadingElement = document.getElementById('loading');
            const resultsCard = document.getElementById('results-card');
            
            if (loadingElement) loadingElement.classList.remove('hidden');
            if (resultsCard) resultsCard.classList.add('hidden');

            // Simulate AI processing time
            await this.sleep(2000);

            // Run AI analysis
            const result = this.runAIAnalysis(batteryData);

            // Add success probability to result
            result.successProbability = this.calculateSuccessProbability(result.score);

            // Show results
            this.displayResults(result);

            // Save to history
            this.saveToHistory(batteryData, result);

            // Update stats
            this.updateStats(result);

            // Hide loading, show results
            if (loadingElement) loadingElement.classList.add('hidden');
            if (resultsCard) resultsCard.classList.remove('hidden');
            
            // Scroll to results
            resultsCard.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error during battery analysis:', error);
            alert('حدث خطأ أثناء تحليل البطارية. يرجى المحاولة مرة أخرى.');
        }
    }

    validateInputs(data) {
        return !isNaN(data.voltage) && !isNaN(data.internal_resistance) &&
            !isNaN(data.temperature) && !isNaN(data.cycle_count) &&
            !isNaN(data.age_months) && data.voltage > 0 && data.internal_resistance > 0;
    }

    runAIAnalysis(data) {
        // Advanced AI-like battery analysis algorithm
        let score = 100;
        let status = 'صالحة';
        let statusClass = 'good';
        let actionSuggestion = 'إعادة استخدام مباشر';
        let pulseVoltage = 0;
        let pulseDuration = 0;
        let safetyMargin = 'آمنة تماماً';

        // Voltage analysis
        const voltageRanges = {
            'AA': { min: 1.0, max: 1.6, nominal: 1.5 },
            'AAA': { min: 1.0, max: 1.6, nominal: 1.5 },
            'Li-ion': { min: 3.2, max: 4.2, nominal: 3.7 },
            'Laptop': { min: 10.8, max: 12.6, nominal: 11.1 }
        };

        const vRange = voltageRanges[data.battery_type];
        const voltageRatio = data.voltage / vRange.nominal;

        if (voltageRatio < 0.6) {
            score -= 40;
            status = 'ضعيفة - قابلة للإحياء';
            statusClass = 'warning';
            actionSuggestion = 'إعادة إحياء بالنبضة الكهربائية';
            pulseVoltage = vRange.nominal * 1.1;
            pulseDuration = 800;
        } else if (voltageRatio < 0.8) {
            score -= 20;
            status = 'ضعيفة نسبياً';
            statusClass = 'warning';
            actionSuggestion = 'إعادة إحياء خفيفة';
            pulseVoltage = vRange.nominal;
            pulseDuration = 500;
        }

        // Internal resistance analysis
        if (data.internal_resistance > 0.5) {
            score -= 25;
            if (score > 50) {
                status = 'مقاومة عالية - قابلة للإحياء';
                statusClass = 'warning';
                actionSuggestion = 'تنظيف + نبضة كهربائية';
                pulseDuration += 300;
            }
        }

        // Temperature analysis
        if (data.temperature > 40 || data.temperature < 10) {
            score -= 15;
            safetyMargin = 'حذر - درجة حرارة غير مثلى';
        }

        // Cycle count analysis
        const maxCycles = {
            'AA': 500, 'AAA': 400, 'Li-ion': 1000, 'Laptop': 800
        };

        const cycleRatio = data.cycle_count / maxCycles[data.battery_type];
        if (cycleRatio > 0.8) {
            score -= 20;
        } else if (cycleRatio > 0.6) {
            score -= 10;
        }

        // Age analysis
        const maxAge = { 'AA': 24, 'AAA': 18, 'Li-ion': 48, 'Laptop': 60 };
        const ageRatio = data.age_months / maxAge[data.battery_type];
        if (ageRatio > 1.2) {
            score -= 30;
        } else if (ageRatio > 0.8) {
            score -= 15;
        }

        // Leakage detection
        if (data.leakage_detected) {
            score -= 50;
            status = 'تسريب مكتشف';
            statusClass = 'danger';
            actionSuggestion = 'إعادة تدوير آمن';
            safetyMargin = 'خطر - تسريب مكتشف';
        }

        // Final classification
        if (score < 30 && !data.leakage_detected) {
            status = 'ميتة - قابلة للإحياء';
            statusClass = 'warning';
            actionSuggestion = 'إعادة إحياء قوية';
            pulseVoltage = vRange.nominal * 1.2;
            pulseDuration = 1200;
        } else if (score < 50) {
            status = 'ضعيفة - قابلة للإحياء';
            statusClass = 'warning';
            actionSuggestion = 'إعادة إحياء متوسطة';
            pulseVoltage = vRange.nominal * 1.05;
            pulseDuration = 700;
        }

        // Calculate success probability
        let successProbability = Math.max(20, Math.min(95, score + this.randomInRange(-10, 15)));
        if (data.leakage_detected) successProbability = Math.min(30, successProbability);

        return {
            score: Math.max(0, score),
            status,
            statusClass,
            actionSuggestion,
            pulseVoltage: pulseVoltage.toFixed(1),
            pulseDuration,
            safetyMargin,
            successProbability: Math.round(successProbability),
            timestamp: new Date().toISOString()
        };
    }

    calculateSuccessProbability(score) {
        // Convert score to probability
        let probability = score;
        
        // Ensure probability is between 0 and 100
        probability = Math.max(0, Math.min(100, probability));
        
        // Round to nearest integer
        return Math.round(probability);
    }

    displayResults(result) {
        try {
            // Get all required elements
            const elements = {
                statusIcon: document.getElementById('status-icon'),
                batteryStatus: document.getElementById('battery-status'),
                pulseInfo: document.getElementById('pulse-info'),
                safetyMargin: document.getElementById('safety-margin'),
                actionSuggestion: document.getElementById('action-suggestion'),
                successProbability: document.getElementById('success-probability'),
                successPercentage: document.getElementById('success-percentage')
            };

            // Check if all elements exist
            for (const [key, element] of Object.entries(elements)) {
                if (!element) {
                    console.error(`Element not found: ${key}`);
                    return;
                }
            }

            // Update status icon and text
            elements.statusIcon.className = 'result-icon';
            
            // Add appropriate icon and class based on status
            if (result.leakage_detected) {
                this.updateStatusDisplay(elements, 'danger', 'exclamation-triangle', 
                    'تسريب مكتشف', 'لا يمكن إحياء البطارية - يجب إعادة تدويرها');
            } else if (result.score >= 80) {
                this.updateStatusDisplay(elements, 'good', 'check-circle',
                    'صالحة للاستخدام', 'البطارية في حالة جيدة ويمكن استخدامها مباشرة');
            } else if (result.score >= 60) {
                this.updateStatusDisplay(elements, 'warning', 'sync',
                    'تحتاج إلى إحياء', 'يمكن إحياء البطارية باستخدام نبضة كهربائية خفيفة');
            } else if (result.score >= 30) {
                this.updateStatusDisplay(elements, 'warning', 'battery-quarter',
                    'ضعيفة - قابلة للإحياء', 'تحتاج إلى معالجة مكثفة لإحيائها');
            } else {
                this.updateStatusDisplay(elements, 'danger', 'times-circle',
                    'غير قابلة للإحياء', 'البطارية تالفة بشكل كبير - يُنصح بإعادة التدوير');
            }

            // Update other result elements
            elements.pulseInfo.innerHTML = result.pulseVoltage ? 
                `${result.pulseVoltage}V لمدة ${result.pulseDuration}ms` : 
                'لا تحتاج إلى نبضة';
            
            elements.safetyMargin.textContent = result.safetyMargin;
            
            elements.actionSuggestion.innerHTML = `${result.actionSuggestion}<br>
                <small>${this.getActionDetail(result)}</small>`;

            // Update success probability
            elements.successProbability.style.width = `${result.successProbability}%`;
            elements.successPercentage.textContent = `${result.successProbability}%`;

            // Update charts
            this.updateCharts(result);
            
        } catch (error) {
            console.error('Error displaying results:', error);
            throw error;
        }
    }

    updateStatusDisplay(elements, className, iconName, status, description) {
        elements.statusIcon.classList.add(className);
        elements.statusIcon.innerHTML = `<i class="fas fa-${iconName}"></i>`;
        elements.batteryStatus.innerHTML = `<span class="${className}-text">${status}</span><br>
            <small>${description}</small>`;
    }

    getActionDetail(result) {
        if (result.leakage_detected) {
            return 'يجب التخلص من البطارية بشكل آمن عبر مراكز إعادة التدوير';
        } else if (result.score >= 80) {
            return 'البطارية صالحة للاستخدام المباشر دون الحاجة لأي معالجة';
        } else if (result.score >= 60) {
            return 'نبضة خفيفة كافية لاستعادة قدرة البطارية';
        } else if (result.score >= 30) {
            return 'تحتاج لعدة نبضات مع مراقبة درجة الحرارة والجهد';
        } else {
            return 'حالة البطارية لا تسمح بإحيائها بشكل آمن';
        }
    }

    saveToHistory(batteryData, result) {
        const historyItem = {
            id: Date.now(),
            ...batteryData,
            ...result,
            timestamp: new Date().toISOString()
        };

        this.analysisHistory.unshift(historyItem);
        if (this.analysisHistory.length > 50) {
            this.analysisHistory = this.analysisHistory.slice(0, 50);
        }

        localStorage.setItem('reviveCell_history', JSON.stringify(this.analysisHistory));
        this.renderHistory();
    }

    updateStats(result) {
        try {
            // Update total batteries count
            this.stats.totalBatteries++;

            // Update revived batteries count if the battery was successfully revived
            if (result.score >= 70 && !result.leakage_detected) {
                this.stats.revivedBatteries++;
            }

            // Calculate success ratio
            const successRatio = (this.stats.revivedBatteries / this.stats.totalBatteries) * 100;

            // Calculate estimated energy savings (kWh)
            const avgBatteryCapacity = {
                'AA': 0.003, // 3Wh
                'AAA': 0.001, // 1Wh
                'Li-ion': 0.01, // 10Wh
                'Laptop': 0.05 // 50Wh
            };

            // Update energy saved
            this.stats.energySaved += avgBatteryCapacity[result.battery_type] || 0;

            // Update money saved (assuming 0.5 SAR per kWh and battery cost)
            const batteryCost = {
                'AA': 5,
                'AAA': 4,
                'Li-ion': 50,
                'Laptop': 200
            };
            this.stats.moneySaved += (batteryCost[result.battery_type] || 0);

            // Get all required elements
            const elements = {
                totalBatteries: document.getElementById('total-batteries'),
                revivedBatteries: document.getElementById('revived-batteries'),
                energySaved: document.getElementById('energy-saved'),
                moneySaved: document.getElementById('money-saved'),
                successRatio: document.getElementById('successRatio'),
                efficiencyRatio: document.getElementById('efficiencyRatio')
            };

            // Update elements if they exist
            if (elements.totalBatteries) {
                elements.totalBatteries.textContent = this.stats.totalBatteries;
            }
            
            if (elements.revivedBatteries) {
                elements.revivedBatteries.textContent = this.stats.revivedBatteries;
            }
            
            if (elements.energySaved) {
                elements.energySaved.textContent = this.stats.energySaved.toFixed(2);
            }
            
            if (elements.moneySaved) {
                elements.moneySaved.textContent = Math.round(this.stats.moneySaved);
            }
            
            if (elements.successRatio) {
                elements.successRatio.textContent = `${successRatio.toFixed(1)}%`;
                elements.successRatio.title = `تم إحياء ${this.stats.revivedBatteries} من أصل ${this.stats.totalBatteries} بطارية`;
            }

            // Calculate and update efficiency ratio
            const efficiencyRatio = (this.stats.energySaved / this.stats.totalBatteries) * 100;
            if (elements.efficiencyRatio) {
                elements.efficiencyRatio.textContent = `${efficiencyRatio.toFixed(1)}%`;
            }

            // Update the success gauge if it exists
            if (this.successGauge) {
                this.updateGauge(this.successGauge, successRatio);
            }

            // Save stats to localStorage
            localStorage.setItem('reviveCell_stats', JSON.stringify(this.stats));
            
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    updateDashboard() {
        try {
            const elements = {
                totalBatteries: document.getElementById('total-batteries'),
                revivedBatteries: document.getElementById('revived-batteries'),
                energySaved: document.getElementById('energy-saved'),
                moneySaved: document.getElementById('money-saved')
            };

            // Update elements if they exist
            if (elements.totalBatteries) {
                elements.totalBatteries.textContent = this.stats.totalBatteries;
            }
            
            if (elements.revivedBatteries) {
                elements.revivedBatteries.textContent = this.stats.revivedBatteries;
            }
            
            if (elements.energySaved) {
                elements.energySaved.textContent = this.stats.energySaved.toFixed(1);
            }
            
            if (elements.moneySaved) {
                elements.moneySaved.textContent = Math.round(this.stats.moneySaved);
            }
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');

        if (this.analysisHistory.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">لا توجد فحوصات سابقة</p>';
            return;
        }

        historyList.innerHTML = this.analysisHistory.map(item => `
            <div class="history-item">
                <div class="history-info">
                    <h4>${item.battery_type} - ${item.voltage}V</h4>
                    <p>${new Date(item.timestamp).toLocaleString('ar-SA')}</p>
                    <p>احتمالية النجاح: ${item.successProbability}%</p>
                </div>
                <div class="history-status ${item.statusClass}">${item.status}</div>
            </div>
        `).join('');
    }

    setupChart() {
        try {
            // Register Chart.js plugins
            Chart.register(ChartDataLabels);
            
            // Set default font family for all charts
            Chart.defaults.font.family = 'Segoe UI, Arial, sans-serif';
            Chart.defaults.font.size = 12;
            Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
            Chart.defaults.plugins.legend.labels.usePointStyle = true;
            Chart.defaults.plugins.legend.position = 'bottom';

            // Initialize all charts
            this.initializeKPIGauges();
            this.initializeAgingChart();
            this.initializePerformanceTrends();
            this.initializeHealthDistribution();
            this.initializeMonitoringGauges();

            // Start real-time updates
            this.startRealTimeUpdates();
        } catch (error) {
            console.error('Error setting up charts:', error);
        }
    }

    initializeKPIGauges() {
        // Current Ratio Gauge
        this.currentRatioGauge = new Chart(document.getElementById('currentRatioGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [1.86, 1.14],
                    backgroundColor: [colors.primary, 'rgba(33, 150, 243, 0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                circumference: 180,
                rotation: -90,
                cutout: '85%',
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // DSI Gauge
        this.dsiGauge = new Chart(document.getElementById('dsiGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [10, 21],
                    backgroundColor: [colors.warning, 'rgba(255, 193, 7, 0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                circumference: 180,
                rotation: -90,
                cutout: '85%',
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // DSO Gauge
        this.dsoGauge = new Chart(document.getElementById('dsoGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [7, 24],
                    backgroundColor: [colors.danger, 'rgba(255, 87, 34, 0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                circumference: 180,
                rotation: -90,
                cutout: '85%',
            plugins: {
                    legend: { display: false }
                }
            }
        });

        // DPO Gauge
        this.dpoGauge = new Chart(document.getElementById('dpoGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [28, 3],
                    backgroundColor: [colors.success, 'rgba(76, 175, 80, 0.1)'],
                    borderWidth: 0
                }]
            },
            options: {
                circumference: 180,
                rotation: -90,
                cutout: '85%',
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    initializeAgingChart() {
        const ctx = document.getElementById('batteryAgingChart');
        this.batteryAgingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['حالي', '1-30', '31-60', '61-90', '90+'],
                datasets: [{
                    label: 'بطاريات جيدة',
                    data: [2500, 2000, 1000, 800, 500],
                    backgroundColor: colors.success
                }, {
                    label: 'بطاريات ضعيفة',
                    data: [1500, 1000, 600, 400, 200],
                    backgroundColor: colors.warning
                }]
            },
            options: {
                ...commonOptions,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initializePerformanceTrends() {
        const ctx = document.getElementById('performanceTrendsChart');
        this.performanceTrendsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'نسبة النجاح',
                    data: [65, 70, 75, 72, 78, 75],
                    borderColor: colors.success,
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'معدل الكفاءة',
                    data: [45, 52, 49, 55, 50, 52],
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: commonOptions
        });
    }

    initializeHealthDistribution() {
        const ctx = document.getElementById('healthDistributionChart');
        this.healthDistributionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['ممتاز', 'جيد', 'متوسط', 'ضعيف', 'حرج'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        colors.success,
                        colors.primary,
                        colors.warning,
                        colors.purple,
                        colors.danger
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                ...commonOptions,
                cutout: '60%'
            }
        });
    }

    initializeMonitoringGauges() {
        // Initialize all gauges
        this.voltageGauge = new Chart(document.getElementById('voltageGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [70, 30],
                    backgroundColor: ['#2196F3', '#f0f0f0'],
                    borderWidth: 0
                }]
            }
        });

        this.tempGauge = new Chart(document.getElementById('temperatureGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [60, 40],
                    backgroundColor: ['#FF9800', '#f0f0f0'],
                    borderWidth: 0
                }]
            }
        });

        this.resistanceGauge = new Chart(document.getElementById('resistanceGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ['#4CAF50', '#f0f0f0'],
                    borderWidth: 0
                }]
            }
        });

        this.healthGauge = new Chart(document.getElementById('healthGauge'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ['#4CAF50', '#f0f0f0'],
                    borderWidth: 0
                }]
            }
        });
    }

    startRealTimeUpdates() {
        setInterval(() => {
            // Update voltage (3.5V - 4.2V range)
            const voltage = this.randomInRange(3.5, 4.2);
            document.getElementById('currentVoltage').textContent = `${voltage.toFixed(1)}V`;
            this.updateGauge(this.voltageGauge, (voltage - 3.5) / 0.7 * 100);

            // Update temperature (20°C - 40°C range)
            const temp = this.randomInRange(20, 40);
            document.getElementById('currentTemp').textContent = `${Math.round(temp)}°C`;
            this.updateGauge(this.tempGauge, (temp - 20) / 20 * 100);

            // Update resistance (0.2Ω - 0.5Ω range)
            const resistance = this.randomInRange(0.2, 0.5);
            document.getElementById('currentResistance').textContent = `${resistance.toFixed(2)}Ω`;
            this.updateGauge(this.resistanceGauge, (0.5 - resistance) / 0.3 * 100);

            // Update health (70% - 100% range)
            const health = this.randomInRange(70, 100);
            document.getElementById('currentHealth').textContent = `${Math.round(health)}%`;
            this.updateGauge(this.healthGauge, health);

            // Update KPI gauges occasionally
            if (Math.random() < 0.3) {
                const newSuccess = this.randomInRange(70, 80);
                const newEfficiency = this.randomInRange(0.8, 1.5);
                
                document.getElementById('successRatio').textContent = `${newSuccess.toFixed(2)}%`;
                document.getElementById('efficiencyRatio').textContent = `${newEfficiency.toFixed(2)}%`;
                
                this.updateGauge(this.currentRatioGauge, newSuccess);
                this.updateGauge(this.dsiGauge, newEfficiency);
            }
        }, 2000);
    }

    updateGauge(gauge, value) {
        if (gauge && gauge.data && gauge.data.datasets) {
            gauge.data.datasets[0].data = [value, 100 - value];
            gauge.update('none'); // Use 'none' mode for smoother updates
        }
    }

    formatNumber(value) {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    }

    generateBatteryDatabase() {
        // Generate 200 battery records using faker-like logic
        const batteryTypes = ['AA', 'AAA', 'Li-ion', 'Laptop'];

        for (let i = 0; i < 200; i++) {
            const type = batteryTypes[Math.floor(Math.random() * batteryTypes.length)];
            const ranges = {
                'AA': { voltage: [0.8, 1.6], resistance: [0.1, 0.8], temp: [15, 45], cycles: [0, 500], age: [1, 36] },
                'AAA': { voltage: [0.8, 1.6], resistance: [0.1, 0.8], temp: [15, 45], cycles: [0, 400], age: [1, 24] },
                'Li-ion': { voltage: [3.0, 4.2], resistance: [0.05, 0.5], temp: [10, 50], cycles: [0, 1000], age: [1, 60] },
                'Laptop': { voltage: [10.0, 12.6], resistance: [0.1, 1.0], temp: [20, 55], cycles: [0, 800], age: [6, 72] }
            };

            const range = ranges[type];
            const battery = {
                id: i + 1,
                battery_type: type,
                voltage: parseFloat(this.randomInRange(range.voltage[0], range.voltage[1]).toFixed(1)),
                internal_resistance: parseFloat(this.randomInRange(range.resistance[0], range.resistance[1]).toFixed(2)),
                temperature: Math.round(this.randomInRange(range.temp[0], range.temp[1])),
                cycle_count: Math.round(this.randomInRange(range.cycles[0], range.cycles[1])),
                capacity_remaining: Math.round(this.randomInRange(20, 95)),
                age_months: Math.round(this.randomInRange(range.age[0], range.age[1])),
                leakage_detected: Math.random() > 0.85 ? 1 : 0,
                pulse_voltage: parseFloat(this.randomInRange(range.voltage[1] * 0.9, range.voltage[1] * 1.2).toFixed(1)),
                pulse_duration: Math.round(this.randomInRange(400, 1200)),
                safety_margin: Math.round(this.randomInRange(5, 25)),
                class_label: this.generateClassLabel()
            };

            // Generate action suggestion based on data
            battery.action_suggestion = this.generateActionSuggestion(battery);

            this.batteryDatabase.push(battery);
        }

        this.saveBatteryCSV();
    }

    generateClassLabel() {
        const rand = Math.random();
        if (rand < 0.4) return 0; // Dead
        if (rand < 0.7) return 1; // Revivable  
        return 2; // Good
    }

    generateActionSuggestion(battery) {
        if (battery.leakage_detected) return 'Replace';
        if (battery.voltage < 1.0 && battery.battery_type === 'AA') return 'Revive';
        if (battery.voltage < 1.0 && battery.battery_type === 'AAA') return 'Revive';
        if (battery.voltage < 3.2 && battery.battery_type === 'Li-ion') return 'Revive';
        if (battery.voltage < 10.8 && battery.battery_type === 'Laptop') return 'Revive';
        if (battery.capacity_remaining < 50) return 'Recharge';
        return 'Reuse';
    }

    saveBatteryCSV() {
        const headers = [
            'battery_type', 'voltage', 'internal_resistance', 'temperature',
            'cycle_count', 'capacity_remaining', 'age_months', 'leakage_detected',
            'class_label', 'pulse_voltage', 'pulse_duration', 'safety_margin',
            'action_suggestion'
        ];

        const csvContent = [
            headers.join(','),
            ...this.batteryDatabase.map(battery =>
                headers.map(header => battery[header]).join(',')
            )
        ].join('\n');

        // Create downloadable CSV (for demo purposes)
        if (typeof window !== 'undefined') {
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            // Store URL for potential download
            window.reviveCellCSV = url;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateCharts(result) {
        try {
            // Update KPI gauges
            if (this.kpiGauges) {
                this.kpiGauges.forEach(gauge => {
                    this.updateGauge(gauge, result.score);
                });
            }

            // Update aging chart
            if (this.agingChart) {
                const ageData = this.analysisHistory.map(item => ({
                    age: item.age_months,
                    score: item.score
                }));
                this.agingChart.data.datasets[0].data = ageData;
                this.agingChart.update();
            }

            // Update performance trends
            if (this.performanceChart) {
                const performanceData = this.analysisHistory.slice(0, 10).reverse();
                this.performanceChart.data.labels = performanceData.map(item => 
                    new Date(item.timestamp).toLocaleDateString('ar-SA')
                );
                this.performanceChart.data.datasets[0].data = performanceData.map(item => item.score);
                this.performanceChart.update();
            }

            // Update health distribution
            if (this.healthChart) {
                const healthData = this.analysisHistory.reduce((acc, item) => {
                    const healthIndex = this.getHealthIndex(item.score);
                    acc[healthIndex] = (acc[healthIndex] || 0) + 1;
                    return acc;
                }, {});
                
                this.healthChart.data.datasets[0].data = Object.values(healthData);
                this.healthChart.update();
            }
        } catch (error) {
            console.error('Error updating charts:', error);
        }
    }

    getAgeGroup(ageMonths) {
        if (ageMonths <= 1) return 0;
        if (ageMonths <= 30) return 1;
        if (ageMonths <= 60) return 2;
        if (ageMonths <= 90) return 3;
        return 4;
    }

    getHealthIndex(score) {
        if (score >= 90) return 0; // ممتازة
        if (score >= 70) return 1; // جيدة
        if (score >= 50) return 2; // متوسطة
        if (score >= 30) return 3; // ضعيفة
        return 4; // حرجة
    }

    calculateSuccessRate() {
        if (this.stats.totalBatteries === 0) return 0;
        return (this.stats.revivedBatteries / this.stats.totalBatteries) * 100;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reviveCellApp = new ReviveCellAI();

    // Auto-fill demo data on page load
    setTimeout(() => {
        window.reviveCellApp.fillRandomData('AA');
    }, 500);

    // Add download CSV functionality
    window.downloadCSV = function () {
        if (window.reviveCellCSV) {
            const a = document.createElement('a');
            a.href = window.reviveCellCSV;
            a.download = 'revive_cell_battery_data.csv';
            a.click();
        }
    };

    console.log('🔋 ReviveCell AI System Initialized');
    console.log('📊 Battery Database Generated: 200 records');
    console.log('🤖 AI Analysis Engine Ready');
}); 