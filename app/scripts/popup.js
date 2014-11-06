'use strict';


function AddBib(Bib) {
	var s = document.createElement('script');
	s.src = Bib;
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
}
//AddBib("jquery-1.8.2.min.js");
//AddBib("linq.min.js");
//AddBib("knockout-2.2.1.js");
//AddBib("http://www.parsecdn.com/js/parse-1.2.16.min.js");
function ObjetosIndexados() {
    var self = this;
	var data;
	
    Parse.initialize(appId, jsKey);
    var Links = Parse.Object.extend("Links");
    self.Save = function (link, callback, undo){
        var l = new Links();
        l.set("nome", link.nome);
        l.set("Referencia", link.Referencia);
        l.set("Categorias", link.Categorias);
        l.save(null, 
        {
            success: callback,
            error: undo
        });
    }
    self.GetAll = function (){
        var query = new Parse.Query(Links);
        query.find({
            success: function(results) {
                self.Objeto(results.map(function( v, i){
                	return { nome:v.get("nome"),Referencia:v.get("Referencia"),Categorias:v.get("Categorias"),Id:v.id};
                }));//tesste = results;
            },
            error: function(model, error) {
            }
        });
    };
    self.GetAll();
    self.Update = function(link)
    {
        var query = new Parse.Query(Links);
        query.equalTo("nome", link.nome);
        query.first({
            success: function (Contact) {
                Contact.save(null, {
                    success: function (contact) {
                        contact.set(ko.utils.parseJson());
                        contact.save();
                        location.reload();
                    }
                });
            }
        });
    };

    self.Delete = function(link, callback, undo)
    {
        var query = new Parse.Query(Links);
		query.get(link.id, {
  			success: function(myObj) {
    			myObj.destroy({
            		success: callback,
            		error: undo
  				});
    		},
			error: undo
		});
    };





    self.Objeto = ko.observableArray(data!=undefined?data:[]);
    self.CadastrarNomeObjeto = ko.observable();
    self.CadastradasCategorias = ko.observableArray([]);
    self.CadastrarNomeCategoria = ko.observable();
    self.Referencia = ko.observable();
		chrome.tabs.getSelected(null,function(tab) {
		self.CadastrarNomeObjeto(tab.title);
		self.Referencia(tab.url);
		});
	
    self.CadastrarCategoria = (function () {
        self.CadastradasCategorias.push(self.CadastrarNomeCategoria());
        self.CadastrarNomeCategoria("");
    });
    self.CadastrarObjeto = (function () {
        self.Save({
            "nome":self.CadastrarNomeObjeto(),
            "Referencia":self.Referencia()!=undefined && self.Referencia()!=null && self.Referencia()!=""?self.Referencia():"https://www.google.com/search?q="+self.CadastrarNomeObjeto(),
            "Categorias":self.CadastradasCategorias()},
            function(novoLink){
                self.Objeto.push(
                    {
                        "nome":self.CadastrarNomeObjeto(),
                        "Referencia":self.Referencia() && self.Referencia()!=""
                                        ?self.Referencia()
                                        :"https://www.google.com/search?q="+self.CadastrarNomeObjeto(),
                        "Categorias":self.CadastradasCategorias()
                    });
                self.CadastrarNomeObjeto("");
                self.CadastrarNomeCategoria("");
                self.Referencia("");
                self.CadastradasCategorias([]);
            },
            function(novoLink, error){

            });
    });
    self.CategoriasSelecionadas = ko.observableArray([]);
    self.DeSelecionarCategoria = (function (categoria) {
        self.CategoriasSelecionadas.remove(categoria);
    });
    self.SelecionarCategoria = (function (categoria) {
        if (!Enumerable.From(self.CategoriasSelecionadas()).Any(function (cat) {
            return cat == categoria;
        })) {
            self.CategoriasSelecionadas.push(categoria);
        }
    });
    self.ObjetosSelecionados = ko.computed(function () {
        var objestosSelecionados = new Array();
        for (var i = 0; i < self.Objeto().length; i++) {
            var objetoAtual = self.Objeto()[i];
            if (Enumerable.From(self.CategoriasSelecionadas()).All(function (categoria) {
                return Enumerable.From(objetoAtual.Categorias).Any(function (cat) {
                    return cat == categoria;
                });
            })) {
                objestosSelecionados.push(objetoAtual);
            }
        }
        return objestosSelecionados;
    });
    self.Categoria = ko.computed(function () {
        var categorias = Array();
        for (var i = 0; i < self.ObjetosSelecionados().length; i++) {
            var objetoAtual = self.ObjetosSelecionados()[i];
            for (var j = 0;objetoAtual.Categorias && j < objetoAtual.Categorias.length; j++) {
                var categoria = objetoAtual.Categorias[j];
                if (!Enumerable.From(categorias).Any(function (cat) {
                    return cat == categoria;
                }) && !Enumerable.From(self.CategoriasSelecionadas()).Any(function (cat) {
                    return cat == categoria;
                })) {
                    categorias.push(categoria);
                }
            }
        }
        return categorias;
    });
	self.ExcluirObjeto = (function(data)
    {
	$( "#dialog-confirm2" ).dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Deletar": function() {
        	self.Delete(data,function(){
		  		self.Objeto.remove(data);
			},function(){});
          	$( "#dialog-confirm2" ).dialog( "close" );
        },
        Cancel: function() {
          $( "#dialog-confirm2" ).dialog( "close" );
        }
      }
		});
    });
	self.ShowEdit = (function(data)
    {
		data.NotEdit = !(data.NotEdit);
		alert(data.NotEdit+" - "+data.NotEdit);
	});
}
var appId,jsKey;
$(document).ready(function() {
ko.bindingHandlers.tooltip = {
    init: function (element, valueAccessor) {
        var local = ko.utils.unwrapObservable(valueAccessor()),
            options = {};

        ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
        ko.utils.extend(options, local);

        $(element).tooltip(options);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).tooltip("destroy");
        });
    },
    options: {
        placement: "right",
        trigger: "hover"
    }
}
	chrome.storage.sync.get({
    	appId: '',
    	jsKey: ''
  		}, function(items) {
    		appId = items.appId;
    		jsKey = items.jsKey;
			window.vm = new ObjetosIndexados();
			ko.applyBindings(vm);
		});
	}
);
