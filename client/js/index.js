(function($, Highcharts){
    
    var stockVue = new Vue({
        el: '#stock-tiles',
        data: {
            symbols: []
        }
    });
    
    var seriesOptions = [];
    var updateCount = 0;
    
    var host = window.location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);
    
    function createChart() {
        Highcharts.stockChart('graph', {
            rangeSelector: {
                selected: 4
            },
            yAxis: {
                labels: {
                    formatter: function(){
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },
            series: seriesOptions
        });
    }
    
    $(document).ready(function(){
        
        ws.onmessage = function(e){
            var data = JSON.parse(e.data);
            updateCount ++;
            seriesOptions = [];
            $.each(data, function(symbol, stock){
                seriesOptions.push(stock);
            });
            createChart();
            stockVue.$set('symbols', Object.keys(data));
        };
        
        $('#new-stock-text').on('keypress', function(e){
            if (e.keyCode === 13){
                ws.send($(this).val());
            }
        });
        
    });
    
})($, Highcharts);
