'use strict';

// Saves options to chrome.storage
function OptionsViewModel(data)
{
  var self = this;

  self.Label = ko.observable('');
  self.JsKey = ko.observable('');
  self.AppKey = ko.observable('');
  self.Selected = ko.observable(data.selected);
  self.JsConfigs = ko.observableArray(data.jsConfigs||[]);
  function update(){
    chrome.storage.sync.set({
        jsConfigs: self.JsConfigs(),
        selected: self.Selected()
      }, function() {

      });
  }
  self.Selected.subscribe(update);

  self.saveOptions = function () {
    self.JsConfigs.push({
      appId: self.AppKey(),
      jsKey: self.JsKey(),
      label: self.Label()
    });
    self.AppKey("");
    self.JsKey("");
    self.Label("");
    update();
  };
  self.removeItem = function (item) {
    self.JsConfigs.remove(item);
    update();
  };
}
$(document).ready(function() {
  chrome.storage.sync.get({
      selected: '',
      jsConfigs: ''
    }, function(items) {
      window.vm = new OptionsViewModel(items);
      ko.applyBindings(window.vm);
    });
  }
);
