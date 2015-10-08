FlowRouter.route('/', {
   action: function() {
   BlazeLayout.render("mainLayout", {content: "ArticleList"});
  }
});

FlowRouter.route('/article/:articleid', {
      action: function() {
      BlazeLayout.render("mainLayout", {content: "DetailPage"});
   }
});
Article = new Mongo.Collection("articles");
if (Meteor.isClient) {
   Template.DetailPage.helpers({
	article: function() {
		var articleid = FlowRouter.getParam("articleid");
		var data = Article.findOne({id: parseInt(articleid)});
		return data;
	}
   });
   Template.WhatToReadNext.helpers({
	articles: function() {
		var data = Article.find().fetch();
		var pn = Article.findOne({'doc': 1}).pageno;
		var items = data.slice(pn*4, pn*4+4)
		return items;
	}
   });
   Template.ArticleList.helpers({
	article: function() {
		var data = Article.findOne({id: 1});
                var last_index = data.hero_image.length
                data.hero_image =  "http://tamonashroy.pythonanywhere.com/media" + data.hero_image.slice(1,last_index) //correcting url
                data.body_text = data.body_text.slice(0,1000); //slice for preview
		return data;
	},
	articles: function() {
		var data = Article.find({}).fetch();
                for (i=0; i<data.length; i++) {
                    data[i].body_text = data[0].body_text.slice(0,500); //slice for the list
                }
		return data;
	}  
   });
   Template.WhatToReadNext.events({
	   'click #next': function(event){
		   console.log("Click event in next happened");
		   var pageInfoDoc = Article.findOne({'doc':1});
		   Session.set('page', pageInfoDoc._id)
		   var pageNo = pageInfoDoc.pageno;
		   console.log("Page number now is " + pageNo);
		   var noRec = Article.find().count();
		   console.log("No of recs now is " + noRec);
		   var maxPageNo = Math.ceil(noRec / 4);
		   console.log("Max Page No " + maxPageNo);
		   if (pageNo < maxPageNo-1) {
			console.log("no errors here");
			Article.update(Session.get('page'), {$inc: {pageno:1}});
		}
	   },
	   'click #prev': function(event){
		   console.log("Click event in next happened");
		   var pageInfoDoc = Article.findOne({'doc':1});
		   Session.set('page', pageInfoDoc._id)
		   var pageNo = pageInfoDoc.pageno;
		   console.log("Page number now is " + pageNo);
		   if (pageNo > 0) {
			Article.update(Session.get('page'), {$inc: {pageno:-1}});
		}
	   }
   });
}
if (Meteor.isServer) {
	Meteor.startup(function() {
	Meteor.methods({
		'fetch': function() {
		   var url = "http://tamonashroy.pythonanywhere.com/articles";
                   var res = HTTP.get(url);
                   var w = res.content;
                   var respJson = JSON.parse(w);
		   console.log("response received.");
				for (i=0; i<respJson.length; i++){
					var temp = respJson[i].id;
					if (!Article.findOne({'id': temp})) {
						Article.insert(respJson[i]);
					}

				}
		},
		startPolling: function(seconds){
        		pollingTaskID = Meteor.setInterval(function(){
            		Meteor.call('fetch');
        		}, seconds*1000);
        		return "polling started...";
    		}
		
	});
        Meteor.call('startPolling', 30);

});
}

