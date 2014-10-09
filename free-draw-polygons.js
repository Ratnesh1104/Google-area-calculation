(function (window, ng) {
  ng.module('app', ['google-maps'])
    .value('channel', function () {
        var callbacks = [];
        this.add = function (cb) {
          callbacks.push(cb);
        };
        this.invoke = function () {
          callbacks.forEach(function (cb) {
            cb();
          });
        };
        return this;
      })
    .factory('drawChannel',['channel',function(channel){
      return new channel()
    }])
    .factory('clearChannel',['channel',function(channel){
      return new channel()
    }])
    .controller('ctrl', ['$rootScope', '$scope','Logger', 'drawChannel','clearChannel',function ($rootScope, $scope, $log,drawChannel, clearChannel) {
      $scope.showArea = false;
      $scope.center = {
          latitude: 53.406754,
          longitude: -2.158843
      }

      $scope.map = {
        pan: null,
        zoom: 14,
        //refresh: false,
        options: {
          disableDefaultUI: true
        },
        events: {},
        //bounds: {},
        polys: [],
        draw: undefined
      };
      $scope.calculateArea = function(arr){
        var path = arr.getPath();
        if(path === undefined)
          return;
        $scope.showArea = true;
        return google.maps.geometry.spherical.computeArea(path);
      };
      var clear = function(){
        $scope.map.polys = [];
        $scope.showArea = false;
      };
      var draw = function(){
        if($scope.map.draw)
          $scope.map.draw();//should be defined by now
      };
      $scope.drawWidget = {
        controlText: 'draw',
        controlClick: function () {
          drawChannel.invoke()
        }
      };
      $scope.clearWidget = {
        controlText: 'clear',
        controlClick: function () {
          clearChannel.invoke()
        }
      };
      //add beginDraw as a subscriber to be invoked by the channel, allows controller to controller coms
      drawChannel.add(draw);
      clearChannel.add(clear);
    }]);
})(window, angular);
