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
        this.setupEventListeners();
        this.generateBatteryDatabase();
        this.updateDashboard();
        this.renderHistory();
        this.setupChart();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Analysis button
        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.analyzeBattery();
        });

        // Auto-fill random data for demo
        this.setupAutoFill();
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

        // Show loading
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('results-card').classList.add('hidden');

        // Simulate AI processing time
        await this.sleep(2000);

        // Run AI analysis
        const result = this.runAIAnalysis(batteryData);

        // Show results
        this.displayResults(result);

        // Save to history
        this.saveToHistory(batteryData, result);

        // Update stats
        this.updateStats(result);

        // Hide loading, show results
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('results-card').classList.remove('hidden');
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

    displayResults(result) {
        // Update status icon and content
        const statusIcon = document.getElementById('status-icon');
        statusIcon.className = `result-icon ${result.statusClass}`;
        statusIcon.innerHTML = result.statusClass === 'good' ? '<i class="fas fa-check-circle"></i>' :
            result.statusClass === 'warning' ? '<i class="fas fa-exclamation-triangle"></i>' :
                '<i class="fas fa-times-circle"></i>';

        document.getElementById('battery-status').textContent = result.status;

        // Pulse information
        if (result.pulseVoltage > 0) {
            document.getElementById('pulse-info').innerHTML =
                `الفولتية: ${result.pulseVoltage}V<br>المدة: ${result.pulseDuration}ms`;
        } else {
            document.getElementById('pulse-info').textContent = 'غير مطلوبة';
        }

        // Safety margin
        document.getElementById('safety-margin').textContent = result.safetyMargin;

        // Action suggestion
        document.getElementById('action-suggestion').textContent = result.actionSuggestion;

        // Success probability
        const progressBar = document.getElementById('success-probability');
        const percentage = document.getElementById('success-percentage');

        progressBar.style.width = '0%';
        percentage.textContent = '0%';

        // Animate progress bar
        setTimeout(() => {
            progressBar.style.width = `${result.successProbability}%`;
            percentage.textContent = `${result.successProbability}%`;
        }, 100);
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
        this.stats.totalBatteries++;

        if (result.successProbability > 60) {
            this.stats.revivedBatteries++;
            this.stats.energySaved += this.randomInRange(0.1, 2.5);
            this.stats.moneySaved += this.randomInRange(5, 25);
        }

        localStorage.setItem('reviveCell_stats', JSON.stringify(this.stats));
        this.updateDashboard();
    }

    updateDashboard() {
        document.getElementById('total-batteries').textContent = this.stats.totalBatteries;
        document.getElementById('revived-batteries').textContent = this.stats.revivedBatteries;
        document.getElementById('energy-saved').textContent = this.stats.energySaved.toFixed(1);
        document.getElementById('money-saved').textContent = Math.round(this.stats.moneySaved);
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
        // Setup pie chart
        const ctx = document.getElementById('batteryChart').getContext('2d');

        // Generate chart data from history
        const batteryTypes = ['AA', 'AAA', 'Li-ion', 'Laptop'];
        const data = batteryTypes.map(type =>
            this.analysisHistory.filter(item => item.battery_type === type).length
        );

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: batteryTypes,
                datasets: [{
                    data: data.every(d => d === 0) ? [25, 20, 30, 25] : data, // Demo data if no history
                    backgroundColor: [
                        '#22c55e',  // Green
                        '#3b82f6',  // Blue
                        '#f59e0b',  // Orange
                        '#8b5cf6'   // Purple
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                family: 'Cairo',
                                size: 14
                            },
                            padding: 20
                        }
                    }
                }
            }
        });

        // Setup monitoring charts
        this.setupMonitoringCharts();
    }

    setupMonitoringCharts() {
        // Initialize real-time data arrays
        this.realTimeData = {
            voltage: [],
            temperature: [],
            current: [],
            risk: [],
            labels: []
        };

        // Generate initial data points
        for (let i = 0; i < 20; i++) {
            this.realTimeData.labels.push(i + 's');
            this.realTimeData.voltage.push(this.randomInRange(0.8, 1.6));
            this.realTimeData.temperature.push(this.randomInRange(20, 45));
            this.realTimeData.current.push(this.randomInRange(0.1, 1.2));
            this.realTimeData.risk.push(this.randomInRange(0, 5));
        }

        // Common chart options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            interaction: {
                intersect: false
            }
        };

        // Voltage Chart
        this.voltageChart = new Chart(document.getElementById('voltageChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: this.realTimeData.labels,
                datasets: [{
                    data: this.realTimeData.voltage,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // Temperature Chart
        this.temperatureChart = new Chart(document.getElementById('temperatureChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: this.realTimeData.labels,
                datasets: [{
                    data: this.realTimeData.temperature,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // Current Chart
        this.currentChart = new Chart(document.getElementById('currentChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: this.realTimeData.labels,
                datasets: [{
                    data: this.realTimeData.current,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // Risk Chart
        this.riskChart = new Chart(document.getElementById('riskChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: this.realTimeData.labels,
                datasets: [{
                    data: this.realTimeData.risk,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // Start real-time updates
        this.startRealTimeUpdates();
    }

    startRealTimeUpdates() {
        setInterval(() => {
            // Update voltage
            const newVoltage = this.randomInRange(0.8, 1.6);
            this.realTimeData.voltage.shift();
            this.realTimeData.voltage.push(newVoltage);
            this.voltageChart.update('none');
            document.getElementById('current-voltage').textContent = newVoltage.toFixed(1) + 'V';

            // Update temperature
            const newTemp = this.randomInRange(20, 45);
            this.realTimeData.temperature.shift();
            this.realTimeData.temperature.push(newTemp);
            this.temperatureChart.update('none');
            document.getElementById('current-temperature').textContent = Math.round(newTemp) + '°C';

            // Update current
            const newCurrent = this.randomInRange(0.1, 1.2);
            this.realTimeData.current.shift();
            this.realTimeData.current.push(newCurrent);
            this.currentChart.update('none');
            document.getElementById('current-amperage').textContent = newCurrent.toFixed(1) + 'A';

            // Update risk
            const newRisk = this.randomInRange(0, 5);
            this.realTimeData.risk.shift();
            this.realTimeData.risk.push(newRisk);
            this.riskChart.update('none');

            const riskLevel = newRisk < 2 ? 'منخفض' : newRisk < 4 ? 'متوسط' : 'مرتفع';
            const riskElement = document.getElementById('current-risk');
            riskElement.textContent = riskLevel;

            // Update risk color
            const riskContainer = riskElement.parentElement;
            riskContainer.className = 'chart-value risk-level';
            if (newRisk >= 4) {
                riskContainer.style.background = 'rgba(239, 68, 68, 0.1)';
                riskContainer.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                riskElement.style.color = '#ef4444';
            } else if (newRisk >= 2) {
                riskContainer.style.background = 'rgba(245, 158, 11, 0.1)';
                riskContainer.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                riskElement.style.color = '#f59e0b';
            } else {
                riskContainer.style.background = 'rgba(34, 197, 94, 0.1)';
                riskContainer.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                riskElement.style.color = '#22c55e';
            }

        }, 2000); // Update every 2 seconds
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ReviveCellAI();

    // Auto-fill demo data on page load
    setTimeout(() => {
        app.fillRandomData('AA');
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