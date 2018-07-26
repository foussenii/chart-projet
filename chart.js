var app = angular.module("app", ["ngAnimate"]);


app.controller("AppController", function($scope) {



  $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function(data) {


    Highcharts.setOptions({
      global: {
        useUTC: false
      },
      lang: {
        rangeSelectorZoom: ''
      },

      navigator: {
        "height": 60,
        handles: {
          symbols: ['url(handles.png)', 'url(handles.png)'],
          width: 20,
          height: 20
        }
      },
      scrollbar: {
        height: 11,
        barBackgroundColor: 'white',
        barBorderRadius: 3,
        barBorderWidth: 0,
        buttonArrowColor: 'transparent',
        buttonBackgroundColor: 'transparent',
        buttonBorderRadius: 3,
        buttonBorderWidth: 0,
        rifleColor: 'transparent',
        trackBackgroundColor: '#e5e5e5',
        trackBorderColor: 'white',
        trackBorderWidth: 0,
        trackBorderRadius: 3
      },
    });

    $scope.chart = Highcharts.stockChart('container', {

      rangeSelector: {
        inputEnabled: true,
        buttonSpacing: 6,
        buttons: [{
          type: 'day',
          count: 1,
          text: '1D'

        }, {
          type: 'week',
          text: '1W',
          count: 1

        }, {
          type: 'month',
          text: '1M',
          count: 1

        }, {
          type: 'year',
          text: '1Y',
          count: 1

        }, {
          type: 'all',
          text: 'All'
        }],
        buttonTheme: {
          'stroke-width': 0,
          r: 8,
          style: {
            color: 'black',
            background: '#708090',
            fontWeight: 'bold'
          },
          states: {
            hover: {},
            select: {
              fill: '#708090',
              style: {
                color: 'white'
              }
            }
          }
        },
      },

      xAxis: {

        // new Date(moment().year(), moment().month(), moment().day()).getTime()
        events: {
          setExtremes: function(e) {
            $('#reportrange span').html(Highcharts.dateFormat('%d.%m.%Y |', e.min) +
              ' ' + Highcharts.dateFormat('%d.%m.%Y', e.max));
            $('#reportrange').data('daterangepicker').startDate = moment(e.min);
            $('#reportrange').data('daterangepicker').endDate = moment(e.max);
            console.log(e);


          }

        }
      },

      series: [{
        name: 'usage 1',
        data: data
      }]
    });

    var bool = false;
    var unesemaine = 1000 * 60 * 60 * 24 * 7;
    var twodays = 1000 * 60 * 60 * 24 * 2;

    $scope.showWeekends = function() {

      var chart = $scope.chart.get();
      var dataMin = chart.dataMin;
      var dataMax = chart.dataMax;
      var intervalle = dataMax - dataMin;
      var nbredesemaines = intervalle / unesemaine;
      var premiersamedi = moment(dataMin).day(6).hour(0).minute(0).seconds(0).millisecond(0);


      //console.log(moment(dataMin));
      //console.log(moment(dataMin).day(6));
      //console.log(moment(dataMin).day(6).hour(0).minute(0).seconds(0).millisecond(0));

      bool = !bool;
      if (bool === true) {
        for (var i = 0; i < nbredesemaines; i++) {
          $scope.chart.xAxis[0].addPlotBand({
            from: premiersamedi + i * unesemaine,
            to: premiersamedi + twodays + i * unesemaine,
            color: 'rgba(189, 194, 180, 0.10)',
            id: 'weekends'
          });
        }

      } else {
        $scope.chart.xAxis[0].removePlotBand('weekends');
      }

    }




    // daterangepicker calendrier debut
    $(function() {
      var start = moment().subtract(1, 'month');
      var end = moment();
      var dateFormat = 'DD.MM.YYYY';
      var monthNames = ['Janv', 'Fevr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
      var daysFormat = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
      var days = firstDay = 1;
      var apply = 'Appliquer';
      var cancel = 'Annuler';
      var positionCalendar = 'left';
      var calendar = 'Calendrier';
      var toDay = 'Aujourd\'hui';
      var tomorrow = 'Hier';
      var lastsevenDay = '7 derniers jours ';
      var lasttwentyDay = '30 derniers jours ';
      var month = 'Mois';
      var lastMonth = 'Dernier mois ';

      function cb(start, end) {





        $scope.chart.xAxis[0].setExtremes(start.valueOf(), end.valueOf());
      }

      $('#reportrange').daterangepicker({

        startDate: start,
        endDate: end,
        ranges: {
          [toDay]: [moment(end), moment(end)],
          [tomorrow]: [moment(start).subtract(1, 'days'), moment(start).subtract(1, 'days')],
          [lastsevenDay]: [moment().subtract(6, 'days'), moment()],
          [lasttwentyDay]: [moment(end).subtract(29, 'days'), moment(end)],
          [month]: [moment().startOf('month'), moment().endOf('month')],
          [lastMonth]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: positionCalendar,
        // custom-button-color-blue-and-sizebuttom
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: dateFormat,
        locale: {
          firstDay: days,
          applyLabel: apply,
          cancelLabel: cancel,
          format: dateFormat,
          customRangeLabel: calendar,
          daysOfWeek: daysFormat,
          monthNames: monthNames

        }
      }, cb);

      // initialisation
      cb(start, end);

    });
    // daterangepicker calendrier fin
  });




});
