var BaseView=require("./BaseView"),app=require("app/app"),template=require("templates/index.hbs"),channels=require("channels"),paper=require("libs/paper-full"),helpers=require("../utils/helpers");app.registerPreloader("home",{collections:["projects"],waitCount:2},function(e){var t=_.chain(e.where({featured:!0})).pluck("file").value();return t}),module.exports=BaseView.extend({className:"page page-index",template:template,templateHelpers:function(){return{projects:this.collection.toJSON()}},ui:{splashContainer:".splash-container",splash:"#splash",canvas:"#canvas"},events:{},initialize:function(){_.bindAll(this,"setHeight")},onBeforeRender:function(){},onRender:function(){_.defer(_.bind(function(){helpers.setMeta(this.options.title)},this))},setHeight:function(){var e=this.ui.win.height(),t=this.ui.win.width();this.ui.splashContainer.css({height:this.ui.win.height(),padding:0}),this.ui.canvas.css({width:this.ui.win.width(),height:this.ui.win.height()})},onShow:function(){function e(t){if(o&&!(r.getDistance(t.point)<10)){var i=new paper.Size(paper.view.bounds),n=i.ceil(),a=i.floor(),l=i.width>i.height;r=t.point,i/=l?[2,1]:[1,2];var p=new paper.Path.Rectangle({point:this.bounds.topLeft.floor(),size:n,onMouseMove:e});p.fillColor=s.getAverageColor(p);var p=new paper.Path.Rectangle({point:l?this.bounds.topCenter.ceil():this.bounds.leftCenter.ceil(),size:a,onMouseMove:e});p.fillColor=s.getAverageColor(p),this.remove()}}function t(t){if(o){project.activeLayer.removeChildren(),s.fitBounds(paper.view.bounds,!0);var i=new paper.Path.Rectangle({rectangle:view.bounds,onMouseMove:e});i.fillColor=s.getAverageColor(i)}}this.ui.win=$(window),this.ui.win.on("resize.setHeight",this.setHeight),this.setHeight(),paper.install(window);var i=document.getElementById("canvas"),n=document.getElementById("splash"),o=!1,s;paper.setup(i),n.addEventListener("load",function(){s=new paper.Raster(this),o=!0,s.visible=!1;var i=new paper.Path.Rectangle({rectangle:view.bounds,onMouseMove:e});i.fillColor=s.getAverageColor(i),t()});var r=view.center},onBeforeDestroy:function(){},onDestroy:function(){}});